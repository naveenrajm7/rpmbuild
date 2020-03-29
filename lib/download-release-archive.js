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
            const tag = "v1.0.0";
            const tarFile = `${tag}.tar.gz`;
            console.log("Calling API ...");
            octokit.repos.getArchiveLink({
                owner,
                repo,
                archive_format,
                ref
            }).then(({ data }) => {
                fs.writeFile(tarFile, Buffer.from(data), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The Tar file was saved!");
                    console.log(`Tarball Location : ${tarFile}`);
                    return tarFile;
                });
            }).catch(function (error) {
                console.log(error);
            });
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
module.exports = download_archive;
