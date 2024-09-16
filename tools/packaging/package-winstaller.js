const installer = require("electron-installer-windows");
const common = require("./common");
const {getWindowsSigntoolOptions} = require("../signing/sign-windows");
const path = require("node:path");
const {unlinkSync} = require("node:fs");

async function main() {
  const myArgs = process.argv.slice(2);
  const flavor = myArgs[0];

  const pkg = common.getPackage();
  const configs = pkg.electron.buildConfigs;

  let appDirName = configs["windows"][flavor]["name"];
  let executableName = configs["windows"][flavor]["executableName"];

  if (common.hasChannelName()) {
    appDirName += ` ${common.getTitlecaseChannelName()}`;
    executableName += `-${common.getChannelName()}`;
  }

  const rootPath = process.cwd();
  const srcPath = path.join(
    rootPath,
    `app/build/dist-electron/packaged/${appDirName}-win32-x64/`,
  );
  const destPath = path.join(rootPath, "app/build/dist-electron/installers/");

  // Delete `signtool.exe` provided by Squirrel, so it uses the one in our
  // `PATH` as a fallback.
  unlinkSync(
    path.join(
      rootPath,
      "node_modules/electron-installer-windows/vendor/squirrel/signtool.exe",
    ),
  );

  console.log(`Creating package for ${appDirName} (this may take a while)`);

  const {d, du, fd, td, tr, f, csp, kc} = getWindowsSigntoolOptions(flavor);
  const options = {
    src: srcPath,
    dest: destPath,
    icon: configs["windows"][flavor]["iconPath"],
    exe: `${executableName}.exe`,
    authors: ["Threema GmbH"],
    animation: configs["windows"][flavor]["animation"],
    noMsi: true,
    signWithParams: [
      `/d "${d}"`,
      `/du "${du}"`,
      `/fd "${fd}"`,
      `/td "${td}"`,
      `/tr "${tr}"`,
      `/f "${f}"`,
      `/csp "${csp}"`,
      `/kc "${kc}"`,
    ].join(" "),
  };

  try {
    await installer(options, flavor);
    console.log(`Successfully created signed package at ${options.dest}`);
  } catch (err) {
    console.error(err, err.stack);
    process.exit(1);
  }
}

main();
