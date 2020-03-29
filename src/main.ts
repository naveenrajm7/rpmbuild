const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const download_tar = require('./download-release-archive');
const cp = require('child_process');

async function run() {
  try {

    // Get github context data
    const context = github.context;

    const owner = context.repo.owner
    const repo = context.repo.repo
    const ref = context.ref

    const version = "1.0.0"

    console.log(`We can even get context data, like the owner: ${owner}, repo: ${repo}, ref: ${ref}`);

    const specFile = core.getInput('specFile');
    console.log(`Hello ${specFile} from inside a container`);

    // setup rpm tree
    await exec.exec('rpmdev-setuptree');

    // Copy spec file from path specFile to /root/rpmbuild/SPECS/
    await io.cp(`/github/workspace/${specFile}`, '/github/home/rpmbuild/SPECS/');

    await exec.exec(`curl -L --output tmp.tar.gz https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`)

    await exec.exec(`mkdir ${repo}-${version}`);

    await exec.exec(`tar xvf tmp.tar.gz -C ${repo}-${version} --strip-components 1`);

    await exec.exec(`tar -czvf ${repo}-${version}.tar.gz ${repo}-${version}`);

    // Get repo files from /github/workspace/
    await exec.exec('ls -la ');
    await exec.exec(`cp ${repo}-${version}.tar.gz /github/home/rpmbuild/SOURCES/`);

    // Copy tar.gz file to /root/rpmbuild/SOURCES
    // make sure the name of tar.gz is same as given in Source of spec file
    //await io.cp(tarBallPath, '/root/rpmbuild/SOURCES');

    // Execute rpmbuild 
    try {
      await exec.exec(
        `rpmbuild -ba /github/home/rpmbuild/SPECS/${specFile}`
      );
    } catch (err) {
      core.setFailed(`action failed with error: ${err}`);
    }

    // Get path for rpm 
    //const rpmPath = await exec.exec('node', ['index.js', 'foo=bar'], options);
    await exec.exec('ls /github/home/rpmbuild/RPMS');

    // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like 
    // actions/upload-release-asset 
    // If you want to upload yourself , need to write api call to upload as asset
    //core.setOutput("rpmPath", rpmPath)

    let myOutput = '';
    cp.exec('ls /github/home/rpmbuild/SRPMS/', (err, stdout, stderr) => {
      if (err) {
        //some err occurred
        console.error(err)
      } else {
          // the *entire* stdout and stderr (buffered)
          console.log(`stdout: ${stdout}`);
          myOutput = stdout;
          console.log(`stderr: ${stderr}`);
        }
      });

    core.setOutput("source_rpm_path", `/github/home/rpmbuild/SRPMS/${myOutput}`); // make option to upload source rpm

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
