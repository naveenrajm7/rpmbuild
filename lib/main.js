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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Get github context data
            const context = github.context;
            const owner = context.repo.owner;
            const repo = context.repo.repo;
            const ref = context.ref;
            console.log(`We can even get context data, like the owner: ${owner}, repo: ${repo}, ref: ${ref}`);
            const tarBallPath = yield download_tar(owner, repo, ref);
            console.log(`Tar Path for copy : ${tarBallPath}`);
            const specFile = core.getInput('specFile');
            console.log(`Hello ${specFile} from inside a container`);
            // Get repo files from /github/workspace/
            yield exec.exec('ls -la /github/workspace');
            // Get repo files from /github/workspace/
            yield exec.exec('ls -la ');
            // Copy spec file from path specFile to /root/rpmbuild/SPECS/
            yield io.cp('/github/workspace/cello.spec', '/root/rpmbuild/SPECS/');
            // Get tar.gz file of release 
            // 1. Write API call to download tar.gz from release OR
            // 2. Create tar.gz of /github/workspace to get tar of source code
            // Copy tar.gz file to /root/rpmbuild/SOURCES
            // make sure the name of tar.gz is same as given in Source of spec file
            yield io.cp(tarBallPath, '/root/rpmbuild/SOURCES');
            // Execute rpmbuild 
            try {
                yield exec.exec(`rpmbuild -ba ${specFile}`);
            }
            catch (err) {
                core.setFailed(`action failed with error: ${err}`);
            }
            // Get path for rpm 
            //const rpmPath = await exec.exec('node', ['index.js', 'foo=bar'], options);
            // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like 
            // actions/upload-release-asset 
            // If you want to upload yourself , need to write api call to upload as asset
            //core.setOutput("rpmPath", rpmPath)
            //core.setOutput("sourceRpmPath", sourceRpmPath)  // make option to upload source rpm
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
