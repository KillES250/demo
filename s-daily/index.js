const fs = require('fs');
const yaml = require('js-yaml');
const { Command } = require('commander');
const Daily = require('./source/librarys/daily');
const program = new Command();

program
  .option('-r, --run', '立即运行一次');

program.parse(process.argv);
const options = program.opts();

function loginQueue(configs, userConfig) {
  const user = new Daily(userConfig);
  user.on('CLOSE', () => {
    if (configs.length > 0) {
      const nextConfig = configs.shift();
      loginQueue(configs, nextConfig);
    } else {
      process.exit(0); // 当所有任务完成时退出程序
    }
  });
}

if (options.run) {
  const configs = yaml.load(fs.readFileSync('config.yaml'));
  configs.splice(0, 30).forEach((userConfig) => {
    loginQueue(configs, userConfig);
  });
}
