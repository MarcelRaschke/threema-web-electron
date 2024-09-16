const common = require("./../packaging/common");
const fs = require("fs");
const path = require("path");

const myArgs = process.argv.slice(2);
const os = myArgs[0];
const flavour = myArgs[1];

const pack = common.getPackage();

let prodName = pack.electron.buildConfigs[os][flavour]["name"];
if (common.hasChannelName()) {
  prodName += ` ${common.getTitlecaseChannelName()}`;
}

console.log(`Replacing Threema Web with ${prodName}`);

const rootPath = process.cwd();
const dirPath = path.join(
  rootPath,
  `app/dependencies/threema-web/release/${pack.threemaWebVersion}`,
);
const filePattern = /\.bundle\.js$/u;

fs.readdirSync(dirPath).forEach((file) => {
  if (filePattern.test(file)) {
    const filePath = path.join(dirPath, file);
    const content = fs.readFileSync(filePath, "utf-8");
    // Only replace the first match, as the pattern should occur only once.
    const regex = /"DEFAULT_TITLE","Threema Web"/u;
    const newContent = content.replace(regex, `"DEFAULT_TITLE","${prodName}"`);

    fs.writeFileSync(filePath, newContent, "utf-8");

    console.log(`Successfully processed file at path ${filePath}`);
  }
});
