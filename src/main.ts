const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');

async function run() {
  try {

    // Get github context data
    const context = github.context;
    console.log(`We can even get context data, like the repo: ${context.repo.repo}`);
    
    const specFile = core.getInput('specFile');
    core.debug(`Hello ${specFile} from inside a container`);

    // Get repo files from /github/workspace/
    await exec.exec('ls -la /github/workspace');

    // LOG: know current directory
    await exec.exec('pwd && echo $HOME && ls');

    // Copy spec file from path specFile to /root/rpmbuild/SPECS/
    await io.cp('path/to/file', 'path/to/dest');
    
    // Get tar.gz file of release 
    // 1. Write API call to download tar.gz from release OR
    // 2. Create tar.gz of /github/workspace to get tar of source code

    // Copy tar.gz file to /root/rpmbuild/SOURCES
    // make sure the name of tar.gz is same as given in Source of spec file
    await io.cp('path/to/file', '/root/rpmbuild/SOURCES');

    // Execute rpmbuild 
    try {
      await exec.exec(
        `rpmbuild -ba ${specFile}`
      );
    } catch (err) {
      core.setFailed(`action failed with error: ${err}`);
    }

    // Get path for rpm 
    //const rpmPath = await exec.exec('node', ['index.js', 'foo=bar'], options);

    // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like 
    // actions/upload-release-asset 
    // If you want to upload yourself , need to write api call to upload as asset
    core.setOutput("rpmPath", rpmPath)
    core.setOutput("sourceRpmPath", sourceRpmPath)  // make option to upload source rpm

    
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
