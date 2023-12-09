#!/bin/bash
#new Env('青龙配置文件备份还原');
#1 1 1 1 1 jd_qlbackup.sh 

# 有丢失配置的风险 自行考虑
# 青龙config.sh 填入export backup="true"变量。然后设定脚本的运行Cron定时即可。
# 根据自己实际情况设定定时 比如每个小时30分钟时备份1次  30 * * * *

backupConfigFile() {
  configDirectory="/ql/data/config"
  configFilePath="$configDirectory/config.sh"
  backupFilePath="$configDirectory/config.sh.bak"

  configContent=$(cat "$configFilePath")

  if [[ $configContent == *"export backup=\"true\""* ]]; then
    echo "配置文件正常，开始执行备份"
    
    stats=$(stat -c %s "$backupFilePath")
    echo "配置文件大小为 $stats 字节"

    cp "$configFilePath" "$backupFilePath"
    echo "✔️备份至青龙Config文件夹成功"
    sleep 0.05
    echo "备份文件位置1： $backupFilePath"

    backupDirectory="./BackUp"
    mkdir -p "$backupDirectory"

    timestamp=$(date +"%Y%m%d_%H%M%S")
    timestampedBackupFile="$(basename "$configFilePath")_${timestamp}.bak"

    # 备份脚本同级的BackUp文件夹内最多保留5个文件
    files=($backupDirectory/*)
    if (( ${#files[@]} >= 5 )); then
      oldest_file=${files[0]}
      for file in "${files[@]}"; do
        [[ $file -ot $oldest_file ]] && oldest_file=$file
      done
      rm "$oldest_file"
    fi

    cp "$backupFilePath" "$backupDirectory/$timestampedBackupFile"
    finalBackupFilePath="$backupDirectory/$timestampedBackupFile"
    echo "✔️备份至当前脚本同级的BackUp文件夹内成功"
    sleep 0.05
    echo "备份文件位置2： $finalBackupFilePath"

  else
    echo "❌配置文件中未找到指定字符，未执行备份，开始还原"
    restoreConfigFile
  fi
}

restoreConfigFile() {
  configDirectory="/ql/data/config"
  configFilePath="$configDirectory/config.sh"
  backupFilePath="$configDirectory/config.sh.bak"

  cp "$backupFilePath" "$configFilePath"
  echo "✔️配置文件已成功还原为备份文件"
}

backupConfigFile
