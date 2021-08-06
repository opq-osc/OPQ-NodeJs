const Fs = require('fs-extra');
const Path = require('path');

// const CONFIG_FILE_DIR = require('appdata-path').getAppDataPath('pxder');
const CONFIG_FILE_DIR = require('path').resolve(__dirname,'..')
const CONFIG_FILE = Path.resolve(CONFIG_FILE_DIR, 'pxder/config/protocol.json');
console.log(CONFIG_FILE_DIR);
console.log(CONFIG_FILE);
const writeConfig = (config = { registered: false, port: 0 }) => {
  Fs.ensureDirSync(CONFIG_FILE_DIR);
  Fs.writeJsonSync(CONFIG_FILE, config);
  return config;
};

const readConfig = () => Fs.readJsonSync(CONFIG_FILE);

const getConfig = () => {
  try {
    return readConfig();
  } catch (error) {
    return writeConfig();
  }
};

const data = getConfig();

module.exports = {
  data,
  modify: obj => writeConfig(Object.assign(data, obj)),
};
