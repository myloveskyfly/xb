//const $ = new Env('青龙配置文件备份还原');
//有丢失配置的风险 自行考虑
//青龙config.sh 填入export BACKUP="true"变量。然后设定脚本的运行Cron定时即可。
//根据自己实际情况设定定时 比如每个小时30分钟时备份1次  30 * * * *
/*1 1 1 1 jd_qlbackup.js*/
const fs = require('fs').promises;
const util = require('util');
const { exec } = require('child_process');
const path = require('path');

const execAsync = util.promisify(exec);

async function backupConfigFile() {
  try {
    const configDirectory = '/ql/data/config';
    const configFilePath = path.join(configDirectory, 'config.sh');
    const backupFilePath = path.join(configDirectory, 'config.sh.bak');

    const { stdout: configContent } = await execAsync(`cat ${configFilePath}`);

    if (configContent.includes('export BACKUP="true"')) {
      console.log('配置文件正常，开始执行备份');
      
      const stats = await fs.stat(configFilePath);
      console.log(`配置文件大小为 ${stats.size} 字节\n`);

      await execAsync(`cp ${configFilePath} ${backupFilePath}`);
      console.log('✔️备份至青龙Config文件夹成功');
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log(`备份文件位置1： ${backupFilePath}\n`);

      const backupDirectory = path.join(process.cwd(), 'BackUp');
      await fs.mkdir(backupDirectory, { recursive: true });

      const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '_').split('.')[0];
      const timestampedBackupFile = `${path.basename(configFilePath)}_${timestamp}.bak`;
      // 备份脚本同级的BackUp文件夹内最多保留5个文件
      const files = await fs.readdir(backupDirectory);
      if (files.length >= 5) {
        let filesWithStats = await Promise.all(files.map(async file => {
          const filePath = path.join(backupDirectory, file);
          const fileStats = await fs.stat(filePath);
          return { filePath, mtime: fileStats.mtime.getTime() };
        }));
        filesWithStats.sort((a, b) => a.mtime - b.mtime);
        await fs.unlink(filesWithStats[0].filePath);
      }

      await fs.copyFile(backupFilePath, path.join(backupDirectory, timestampedBackupFile));
      const finalBackupFilePath = path.join(backupDirectory, timestampedBackupFile);
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('✔️备份至当前脚本同级的BackUp文件夹内成功');
      await new Promise(resolve => setTimeout(resolve, 50));
      console.log('备份文件位置2：', finalBackupFilePath);

      
    } else {
      console.log('❌配置文件中未找到指定字符，未执行备份，开始还原');
      await restoreConfigFile();
    }
  } catch (error) {
    console.error('⛔发生错误:', error);
  }
}

async function restoreConfigFile() {
  try {
    const configDirectory = '/ql/data/config';
    const configFilePath = path.join(configDirectory, 'config.sh');
    const backupFilePath = path.join(configDirectory, 'config.sh.bak');

    await fs.copyFile(backupFilePath, configFilePath);
    console.log('✔️配置文件已成功还原为备份文件');
  } catch (error) {
    console.error('⚠️还原配置文件时发生错误:', error);
  }
}

backupConfigFile();
