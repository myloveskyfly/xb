/* cron "5,35 * * * *" xiequ_white.js, tag=携趣白名单更新  */
const $ = new Env('携趣白名单更新v1.5');
//青龙变量格式参考 export XIEQU_CONFIG="账号名称随意@UID@UKEY@ip1.txt"
const axios = require('axios');
const fs = require('fs');
const notify = require('./sendNotify')
const currentDateTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

// 配置青龙变量参数
const [No,UID, UKEY, IP_CACHE_FILE] = process.env.XIEQU_CONFIG.split('@');
// 配置代码参数
const GET_IP_URL = 'https://www.taobao.com/help/getip.php';
const CLEAR_WHITE_LIST_URL = `http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=del&ip=all`;
const UPDATE_WHITE_LIST_URL = `http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=add&ip=`;
const GET_WHITE_LIST_URL = `http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=get`;

// 设置请求的User-Agent头，以伪装成浏览器请求
axios.defaults.headers.common['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';

// 获取当前外网IP的函数
async function getPublicIP() {
  try {
    const response = await axios.get(GET_IP_URL);
    const ip = response.data.match(/\d+\.\d+\.\d+\.\d+/)[0];
    return ip;
  } catch (error) {
    console.error('获取外网IP失败:', error.message);
    return null;
  }
}

// 读取上次缓存的IP的函数
function getLastCachedIP() {
  try {
    const ip = fs.readFileSync(IP_CACHE_FILE, 'utf8');
		if (ip) {
			console.log('上次缓存的外网IP:', ip);
			return ip.trim();
		} else {
			console.log('没有找到上次缓存的外网IP。');
			return null;
		}
  } catch (error) {
    console.error('读取ip1.txt文件失败:', error.message);
    return null;
  }
}

// 将当前IP缓存到文件的函数
function cacheIP(ip) {
  fs.writeFile(IP_CACHE_FILE, ip, 'utf8', (err) => {
    if (err) {
      console.error('😂写入ip1.txt文件失败:', err.message);
    } else {
      console.log('✔当前外网IP已成功保存到ip1.txt文件。');
    }
  });
}

// 发送请求清空携趣白名单的函数
async function clearXiequWhiteList() {
  try {
    await axios.get(CLEAR_WHITE_LIST_URL);
    console.log('✔携趣白名单已清空。');
  } catch (error) {
    console.error('😂清空携趣白名单失败:', error.message);
  }
}

// 发送请求更新携趣白名单的函数
async function updateXiequWhiteList(ip) {
  const updateUrl = `${UPDATE_WHITE_LIST_URL}${ip}`;

  try {
    await axios.get(updateUrl);
    console.log('✔携趣白名单已更新为最新的外网IP。');
  } catch (error) {
    console.error('😂更新携趣白名单失败:', error.message);
  }
}

// 发送请求获取更新后的携趣白名单的函数
async function getXiequWhiteList() {
  try {
    const response = await axios.get(GET_WHITE_LIST_URL);
    console.log('✔更新后的携趣白名单:', response.data);
  } catch (error) {
    console.error('😂获取更新后的携趣白名单失败:', error.message);
  }
}

// 执行脚本的函数
async function runScript() {
  console.log('开始执行脚本...');

  const currentIP = await getPublicIP();
  if (currentIP) {
    console.log('当前外网IP:', currentIP);

    const lastCachedIP = getLastCachedIP();
    if (lastCachedIP === currentIP) {
      console.log('✔当前外网IP与上次缓存的IP一致，停止执行。');
      process.exit();
    } else {
      console.log('✔当前外网IP与上次缓存的IP不一致，开始执行更新操作。');

      console.log('⏱清空携趣白名单...');
      await clearXiequWhiteList();

      console.log('⏱开始更新携趣白名单...');
      await updateXiequWhiteList(currentIP);

      console.log('⏱开始获取更新后的携趣白名单...');
      await getXiequWhiteList();

      console.log('⏱开始缓存当前外网IP到ip1.txt文件...');
      cacheIP(currentIP);
    }
  }
  
  console.log('脚本执行完毕。');
  await notify.sendNotify(`🎉通知🎉`,`当前外网IP变更为：${currentIP}\n\n${No}✅已同步更新携趣白名单！\n\n通知时间：${currentDateTime}`)
  
}


// 执行脚本
runScript();
