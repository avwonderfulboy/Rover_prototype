const exec = require("child_process").execSync;
const {spawn} = require("child_process");
const process = require('process');
const { Octokit } = require("@octokit/rest");
export function setupRepo(reponame,repoconfig){
    
    
    exec("gh repo create "+reponame+ " --"+repoconfig.repotype+" --clone")
    repoconfig=JSON.stringify(repoconfig)
    exec("mkdir "+reponame+"/.github") 
    exec("mkdir "+reponame+"/.github/workflows") 
    exec("python3 pipeline/pipelinegenerator.py "+ reponame+"/.github/workflows/main.yml "+reponame+"/region.txt "+reponame+"/accesskey.txt "+reponame+"/secret.txt "+"'"+repoconfig+"'")         
    process.chdir(reponame);
    exec("gh secret set AWS_ACCESS_KEY_ID < accesskey.txt")
    exec("gh secret set AWS_SECRET_ACCESS_KEY < secret.txt")
    exec("gh secret set AWS_REGION < region.txt")
    exec("rm -rf accesskey.txt")
    exec("rm -rf secret.txt")
    exec("rm -rf  region.txt")      
    exec("sh /Users/dheerajbhatt/Documents/GitHub/rover-prototype/utlities/commit.sh "+reponame)  
}
//setupRepo("testres","public")