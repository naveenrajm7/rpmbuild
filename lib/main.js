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
            const specFile = core.getInput('specFile');
            console.log(`Hello ${specFile} from inside a container`);
            yield exec.exec('rpmdev-setuptree');
            // Get repo files from /github/workspace/
            yield exec.exec('ls -la ');
            // Copy spec file from path specFile to /root/rpmbuild/SPECS/
            yield io.cp('/github/workspace/cello.spec', '/github/home/rpmbuild/SPECS/');
            // Get tar.gz file of release 
            // await download_tar(
            //   owner,
            //   repo,
            //   ref
            // ).then( function(filePath){
            //   console.log(`Tar Path for copy : ${filePath}`);
            //   io.cp(`${repo}-1.0.tar.gz`, '/github/home/rpmbuild/SOURCES/');
            // }).catch(function(error){
            //   console.log(error);
            // });
            yield exec.exec('curl -L --output cello-1.0.0.tar.gz https://github.com/naveenrajm7/cello/archive/v1.0.0.tar.gz');
            //console.log(`Tar Path for copy : ${tarBallPath}`);
            yield exec.exec('echo "$HOME"');
            // Get repo files from /github/workspace/
            yield exec.exec('ls -la ');
            yield io.cp(`${repo}-1.0.0.tar.gz`, '/github/home/rpmbuild/SOURCES/');
            // Copy tar.gz file to /root/rpmbuild/SOURCES
            // make sure the name of tar.gz is same as given in Source of spec file
            //await io.cp(tarBallPath, '/root/rpmbuild/SOURCES');
            // Execute rpmbuild 
            try {
                yield exec.exec(`rpmbuild -ba /github/home/rpmbuild/SPECS/cello.spec`);
            }
            catch (err) {
                core.setFailed(`action failed with error: ${err}`);
            }
            // Get path for rpm 
            //const rpmPath = await exec.exec('node', ['index.js', 'foo=bar'], options);
            yield exec.exec('ls /github/home/rpmbuild/RPMS');
            // setOutput rpm_path to /root/rpmbuild/RPMS , to be consumed by other actions like 
            // actions/upload-release-asset 
            // If you want to upload yourself , need to write api call to upload as asset
            //core.setOutput("rpmPath", rpmPath)
            core.setOutput("source_rpm_path", "/github/home/rpmbuild/SRPMS"); // make option to upload source rpm
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
