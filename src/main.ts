const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

async function run() {
  try {
    const myInput = core.getInput('specFile');
    core.debug(`Hello ${myInput} from inside a container`);

    // Get repo files from /github/workspace/
    await exec.exec('ls -la /github/workspace');

    // LOG: know current directory
    await exec.exec('pwd && echo $HOME && ls');

    // Copy spec file from path specFile to /root/rpmbuild/SPECS/
    
    
    // Get tar.gz file of release 


    // Copy tar.gz file to /root/rpmbuild/SOURCES


    // Execute rpmbuild 


    // Get path for rpm 


    // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like 
    // actions/upload-release-asset
    

    // Get github context data
    const context = github.context;
    console.log(`We can even get context data, like the repo: ${context.repo.repo}`);
    
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
