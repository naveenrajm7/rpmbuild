const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const tc = require('@actions/tool-cache');


async function download_archive(owner, repo, ref ) {
    try {
        
        const octokit = new Octokit();

        const archive_format = "tarball";

        const downloadLocation = octokit.repos.getArchiveLink({
            owner,
            repo,
            archive_format,
            ref
        });

        console.log(`Download Location : ${downloadLocation}`);    
        
        const tarBallPath = await tc.downloadTool(downloadLocation);

        console.log(`Tarball Location : ${tarBallPath}`);

        return tarBallPath;

    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = download_archive;
