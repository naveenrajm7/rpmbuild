"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const download_tar = require('./download-release-archive');
const cp = require('child_process');
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get github context data
            const context = github.context;
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const ref = context.ref;
            const version = "1.0.0";
            // get inputs from workflow
            const specFile = core.getInput('spec_file');
            // setup rpm tree
            yield exec.exec('rpmdev-setuptree');
            // Copy spec file from path specFile to /root/rpmbuild/SPECS/
            yield exec.exec(`cp /github/workspace/${specFile} /github/home/rpmbuild/SPECS/`);
            // Dowload tar.gz file of source code
            yield exec.exec(`curl -L --output tmp.tar.gz https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`);
            // create directory to match source file - repo-version
            yield exec.exec(`mkdir ${repo}-${version}`);
            // Extract source code to directory
            yield exec.exec(`tar xvf tmp.tar.gz -C ${repo}-${version} --strip-components 1`);
            // Create Source tar.gz file
            yield exec.exec(`tar -czvf ${repo}-${version}.tar.gz ${repo}-${version}`);
            // Get repo files from /github/workspace/
            yield exec.exec('ls -la ');
            // Copy tar.gz file to source
            yield exec.exec(`cp ${repo}-${version}.tar.gz /github/home/rpmbuild/SOURCES/`);
            // Execute rpmbuild 
            try {
                yield exec.exec(`rpmbuild -ba /github/home/rpmbuild/SPECS/${specFile}`);
            }
            catch (err) {
                core.setFailed(`action failed with error: ${err}`);
            }
            // Verify RPM created
            yield exec.exec('ls /github/home/rpmbuild/RPMS');
            // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like 
            // actions/upload-release-asset 
            let myOutput = '';
            yield cp.exec('ls /github/home/rpmbuild/SRPMS/', (err, stdout, stderr) => {
                if (err) {
                    //some err occurred
                    console.error(err);
                }
                else {
                    // the *entire* stdout and stderr (buffered)
                    console.log(`stdout: ${stdout}`);
                    myOutput = myOutput + `${stdout}`.trim();
                    console.log(`stderr: ${stderr}`);
                }
            });
            // only contents of workspace can be changed by actions and used by subsequent actions 
            // So copy all generated rpms into workspace , and publish output path relative to workspace
            yield exec.exec(`mkdir -p rpmbuild/SRPMS`);
            yield exec.exec(`cp /github/home/rpmbuild/SRPMS/${myOutput} rpmbuild/SRPMS`);
            yield exec.exec(`ls -la rpmbuild/SRPMS`);
            // set output to path relative to workspace ex ./rpm/
            core.setOutput("source_rpm_path", `rpmbuild/SRPMS`); // make option to upload source rpm
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
