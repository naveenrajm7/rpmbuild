const { Octokit } = require('@octokit/rest');
const fs = require('fs');
const tc = require('@actions/tool-cache');


async function download_archive(owner, repo, ref ) {
    try {
        
        const octokit = new Octokit();

        const archive_format = "tarball";

        const tag = "v1.0.0"
        
        const tarFile = `${repo}-1.0.tar.gz`;

        console.log("Calling API ...");
        await octokit.repos.getArchiveLink({
            owner,
            repo,
            archive_format,
            ref
        }).then(( { data }) => {
                fs.writeFile(tarFile, Buffer.from(data), function(err){
                if(err) {
                    return console.log(err);
                }
                console.log("The Tar file was saved!");
                console.log(`Tarball Location : ${tarFile}`);
                return tarFile;
            });
        }).catch( function(error){
            console.log(error);
        });

        

    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = download_archive;
