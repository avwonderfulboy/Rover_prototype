import * as customStack from "../resources/components";
import * as Stack from "../resources/modules";
export let LanguageSupport = {
  node: {
    version: "nodejs14.x",
    dependency: "npm",
    extension: ".js",
  },
  python: {
    version: "python3.9",
    dependency: "pip3",
    extension: ".py",
  },
};
export let app = {
  choices: {
    language: ["Node", "Python"],
   
    type:Object.values(Stack.ModuleDescription),
  
    pipeline: ["repository and pipeline", "cli"],
  },
};
export let customizable = {
  choice: Object.keys(customStack.Components),
};
