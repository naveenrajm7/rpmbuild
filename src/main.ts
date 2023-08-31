const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

async function run() {
  try {

    // Get github context data
    const context = github.context;

    // To be used to get contents of this git ref
    const owner = context.repo.owner
    const repo = context.repo.repo
    const ref = context.ref
    //get working directory
    const workspace = process.env.GITHUB_WORKSPACE
    // get inputs from workflow
    // specFile name
    const configPath = core.getInput('spec_file'); // user input, eg: `foo.spec' or `rpm/foo.spec'
    const confBasename = path.basename(configPath); // always just `foo.spec`
    const artifactsPath = core.getInput('sources'); // user input directory of binary_artifacts, eg: `dist' or `cmd/build'
    const artiBasename = path.basename(artifactsPath);
    const servicePath = core.getInput('service_file'); //Returns an empty string if the value is not defined.
    const serviceBase = path.basename(servicePath);
    //check artifacts path if relative or absolute
    var specFile = {
      srcFullPath: (path.isAbsolute(configPath) ? configPath : `${workspace}/${configPath}`),
      destFullPath: `/github/home/rpmbuild/SPECS/${confBasename}`,
    };
    const artifacts = {
      srcFullPath: (path.isAbsolute(artifactsPath) ? artifactsPath : `${workspace}/${artifactsPath}`),
      destFullPath: `/github/home/rpmbuild/SOURCES/`,
    };
    const serviceFile = {
      srcFullPath: (path.isAbsolute(servicePath) ? servicePath : `${workspace}/${servicePath}`),
      destFullPath: `/github/home/rpmbuild/SOURCES/${serviceBase}`,
    }
    // Read spec file and get values
    var data = fs.readFileSync(specFile.srcFullPath, 'utf8');
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

    // Copy spec file from path specFile to /github/home/rpmbuild/SPECS/
    await exec.exec(`cp ${specFile.srcFullPath} ${specFile.destFullPath}`);
    if (servicePath.length != '') {
      await exec.exec(`cp ${serviceFile.srcFullPath} ${serviceFile.destFullPath}`);
    }
    await exec.exec(`mkdir -p ${artifacts.destFullPath}`);
    // Copy artifacts from build dir to sources dir
    process.env.GIT_DIR = `${workspace}.git`;
    await exec.exec(`ls -lah ${workspace} ${artifacts.srcFullPath}/`)

    const files = fs.readdirSync(`${artifacts.srcFullPath}`)
    for (const file of files) {
      const joinedSourcePath = path.join(artifacts.srcFullPath, file)
      const joinedDestPath = path.join(artifacts.destFullPath, file)
      if (fs.existsSync(joinedSourcePath) && fs.lstatSync(joinedSourcePath).isFile()) {
        console.log(`debug: cp ${joinedSourcePath} ${joinedDestPath}`);
        await exec.exec(`cp ${joinedSourcePath} ${joinedDestPath}`)
      }
    }
    //core.setFailed(`action failed to read artifact dir with error: ${err}`);
    await exec.exec(`ls -lah ${artifacts.srcFullPath}/ ${artifacts.destFullPath}`)

    // build binary only
    try {
      await exec.exec(
        `rpmbuild -bb ${specFile.destFullPath}`
      );
    } catch (err) {
      core.setFailed(`action failed with error: ${err}`);
    }

    // Verify RPM is created
    await exec.exec('ls /github/home/rpmbuild/RPMS');

    // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like
    // actions/upload-release-asset

    // Get rpm name , to provide file name, path as output
    let myOutput = '';
    await cp.exec('ls /github/home/rpmbuild/RPMS/', (err, stdout, stderr) => {
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
    await exec.exec(`mkdir -p rpmbuild/RPMS`);

    await cp.exec(`cp -R /github/home/rpmbuild/RPMS/. rpmbuild/RPMS/`);

    await exec.exec(`ls -la rpmbuild/RPMS`);

    // set outputs to path relative to workspace ex ./rpmbuild/
    core.setOutput("binary_rpm_dir_path", `rpmbuild/RPMS/`);              // path to  SRPMS directory
    core.setOutput("binary_rpm_path", `rpmbuild/RPMS/${myOutput}`);       // path to Source RPM file
    core.setOutput("binary_rpm_name", `${myOutput}`);                      // name of Source RPM file
    core.setOutput("rpm_dir_path", `rpmbuild/RPMS/`);                      // path to RPMS directory
    core.setOutput("rpm_content_type", "application/octet-stream");        // Content-type for Upload

  } catch (error) {
    core.setFailed(error);
  }
}

run();
