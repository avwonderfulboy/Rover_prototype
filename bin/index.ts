import * as rover_utilities from "../utlities/utilities";
import * as cliConfig from "../rover-cli-poc-main/cliConfig";
import * as util from "../rover-cli-poc-main/util";
import * as deployment from "../utlities/deployment";

const exec = require("child_process").execSync;
const input = {
  app_name: "testres3",
  language: "node",
  Stacks: { emailAuth: "EmailAuthModule", emailAuths: "BaseModule" },
  CustomStacks: { customone: ["s3_lambda"] },
  repoconfig: {
    name: "SAM",
    repotype: "public",
    tool: "git",
    language: "js",
    framework: "sam",
    no_envs: 1,
    accesskey: "AKIA57GLKGCHUY3HMT56",
    secretkey: "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",
    envs: ["dev"],
    steps: {
      dev: ["build", "deploy"],
    },
    stackname: {
      dev: "devemail",
      test: "testemail",
    },
    deploymentbucket: {
      dev: "",
    },
    deploymentregion: {
      dev: "ap-south-1",
    },
    deploymentparameters: { dev: {} },
    deployment_event: ["push"],
  },
};
let res: any = [];
let resources: any = [];
let stack_resource_Name: any = [];
let AppType;
let template = {};
let config;
async function run(argv) {
  if (argv[0] === "init") {
    let editedSam = await util.confirmation();
    if (editedSam === "create new SAM project") {
      let app_name = await util.inputString("app_name", "App Name:");
      let language = await util.languageChoice();
      let stack_names: any = {};
      let customStacks: any = {};
      let moreStack:any;
      let i = 1; 
      do{
        
        let app_Types: any = [];
        let AppType:any = await util.appType("Type :");
        if (AppType !== "Customizable") {
          let stack_name = await util.inputString(
            `stackName${i}`,
            `Stack ${i} Name: `
          );

          stack_names[stack_name[`stackName${i}`]] = AppType;
        } else {
          let choice = cliConfig.customizable.choice;
          let customstack_name = await util.inputString(
            `customStackName${i}`,
            `Stack ${i} Name: `
          );
          let CustomStacks = await util.multichoice("app_type", choice);
          customStacks[customstack_name[`customStackName${i}`]] =
            CustomStacks.app_type;
        }
        moreStack =await util.moreStack()
        i++
      }while(moreStack!=='No'){
        template = { ...app_name, language };
        if (stack_names !== null) template = { ...template, Stacks: stack_names };
        if (customStacks !== null)
        template = { ...template, CustomStacks: customStacks };
        rover_utilities.samGeneration(({template})["template"]);
          console.log({template});
      };
    } else if (editedSam === "add components to existing SAM") {
      console.log("Work in progress...");
    } else if (editedSam === "add modules to existing SAM") {
      console.log("Work in progress...");
    }
  } else if (argv[0] === "deploy") {
    let r = await util.inputType("choice", "pipeline", "Deploy through:");
    if (r === "repository and pipeline") {
      let pipeline = await util.samBuild();
      let repoConfig = { ...pipeline };
      template = { ...template, repoConfig };
      let repoconfig = await Promise.resolve(util.jsonCreation(template));
      if (repoconfig !== undefined) {
        await deployment.setupRepo(JSON.parse(repoconfig)["repoConfig"]);
      }
    } else {
      exec(
        "sh " +
          rover_utilities.npmroot +
          "/rover-prototype/utlities/exec.sh dgb  rovertest "
      );
    }
  } else {
    console.log(
      "rover " +
        argv +
        " - not a rover command \n  rover init   - creates new SAM project \n  rover deploy - deploys SAM project"
    );
  }
}

export let resource_type = ({} = res);
export let stackNames: any = stack_resource_Name;

run(process.argv.slice(2));
