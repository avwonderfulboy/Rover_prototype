const exec = require("child_process").execSync;
const {spawn} = require("child_process");
export function setupRepo(reponame,type){
   // exec("gh repo create "+reponame+ " --"+ type+" --clone")
    
    //exec("mkdir "+reponame+"/.git/workflows")  
    exec("cd "+reponame )
    //exec("git checkout -b main") 
    exec("git add . && git commit -m 'initial commit'")
    exec("git push -u origin main ")  
    //exec("git push -u origin main")  

}
setupRepo("testres","public")