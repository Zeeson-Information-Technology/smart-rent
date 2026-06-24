const { readFileSync } = require("node:fs");
const Module = require("node:module");
const { resolve } = require("node:path");
const ts = require("typescript");

const seedPath = resolve(__dirname, "seed.ts");
const source = readFileSync(seedPath, "utf8");
const output = ts.transpileModule(source, {
  compilerOptions: {
    esModuleInterop: true,
    module: ts.ModuleKind.CommonJS,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    target: ts.ScriptTarget.ES2020,
  },
  fileName: seedPath,
});

const seedModule = new Module(seedPath, module.parent);
seedModule.filename = seedPath;
seedModule.paths = Module._nodeModulePaths(__dirname);
seedModule._compile(output.outputText, seedPath);
