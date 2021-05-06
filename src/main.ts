const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const cp = require('child_process');
const fs = require('fs');

async function run() {
  try {

    // Get github context data
    const context = github.context;

    // To be used to get contents of this git ref 
    const owner = context.repo.owner
    const repo = context.repo.repo
    const ref = context.ref

    // get inputs from workflow
    // specFile name
    const specFile = core.getInput('spec_file');
    const useSourcesFromRepo = core.getInput('use_sources_from_repo');

    // Read spec file and get values 
    var data = fs.readFileSync(specFile, 'utf8');
    let name = '';
    let version = '';

    for (var line of data.split('\n')) {
      var lineArray = line.split(/[ ]+/);
      if (lineArray[0].includes('Name')) {
        name = name + lineArray[1];
      }
      if (lineArray[0].includes('Version')) {
        version = version + lineArray[1];
      }
    }
    console.log(`name: ${name}`);
    console.log(`version: ${version}`);

    // setup rpm tree
    await exec.exec('rpmdev-setuptree');

    // Copy spec file from path specFile to /root/rpmbuild/SPECS/
    await exec.exec(`cp /github/workspace/${specFile} /github/home/rpmbuild/SPECS/`);

    if (useSourcesFromRepo) {
      // Dowload tar.gz file of source code,  Reference : https://developer.github.com/v3/repos/contents/#get-archive-link
      await exec.exec(`curl -L --output tmp.tar.gz https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`)

      // create directory to match source file - %{name}-{version}.tar.gz of spec file
      await exec.exec(`mkdir ${name}-${version}`);

      // Extract source code 
      await exec.exec(`tar xvf tmp.tar.gz -C ${name}-${version} --strip-components 1`);

      // Create Source tar.gz file 
      await exec.exec(`tar -czvf ${name}-${version}.tar.gz ${name}-${version}`);

      // Copy tar.gz file to source path
      await exec.exec(`cp ${name}-${version}.tar.gz /github/home/rpmbuild/SOURCES/`);
    }

    // Execute rpmbuild , -ba generates both RPMS and SPRMS
    try {
      await exec.exec(
        `rpmbuild -ba /github/home/rpmbuild/SPECS/${specFile}`
      );
    } catch (err) {
      core.setFailed(`action failed with error: ${err}`);
    }

    // Verify RPM is created
    await exec.exec('ls /github/home/rpmbuild/RPMS');

    // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like 
    // actions/upload-release-asset 

    // Get source rpm name , to provide file name, path as output
    let myOutput = '';
    await cp.exec('ls /github/home/rpmbuild/SRPMS/', (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`);
        myOutput = myOutput + `${stdout}`.trim();
        console.log(`stderr: ${stderr}`);
      }
    });

    // only contents of workspace can be changed by actions and used by subsequent actions 
    // So copy all generated rpms into workspace , and publish output path relative to workspace (/github/workspace)
    await exec.exec(`mkdir -p rpmbuild/SRPMS`);
    await exec.exec(`mkdir -p rpmbuild/RPMS`);

    await exec.exec(`cp /github/home/rpmbuild/SRPMS/${myOutput} rpmbuild/SRPMS`);
    await cp.exec(`cp -R /github/home/rpmbuild/RPMS/. rpmbuild/RPMS/`);

    await exec.exec(`ls -la rpmbuild/SRPMS`);
    await exec.exec(`ls -la rpmbuild/RPMS`);

    // set outputs to path relative to workspace ex ./rpmbuild/
    core.setOutput("source_rpm_dir_path", `rpmbuild/SRPMS/`);              // path to  SRPMS directory
    core.setOutput("source_rpm_path", `rpmbuild/SRPMS/${myOutput}`);       // path to Source RPM file
    core.setOutput("source_rpm_name", `${myOutput}`);                      // name of Source RPM file
    core.setOutput("rpm_dir_path", `rpmbuild/RPMS/`);                      // path to RPMS directory
    core.setOutput("rpm_content_type", "application/octet-stream");        // Content-type for Upload
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
