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
const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const tc = require('@actions/tool-cache');
function download_archive(owner, repo, ref) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const octokit = new Octokit();
            const archive_format = "tarball";
            const ref = "v1.0.0";
            console.log("Calling API ...");
            octokit.repos.getBranch({
                owner,
                repo,
                ref
            }).then(({ data }) => {
                console.log(data);
            });
            // octokit.repos.getArchiveLink({
            //     owner,
            //     repo,
            //     archive_format,
            //     ref
            // }).then(( { data }) => {
            //     console.log(data)
            // });
            //console.log(`Download Location : ${downloadLocation}`);    
            //const tarBallPath = await tc.downloadTool(downloadLocation);
            //console.log(`Tarball Location : ${tarBallPath}`);
            //return tarBallPath;
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
module.exports = download_archive;
