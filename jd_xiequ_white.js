// 携趣白名单更新 uid和vkey在白名单管理接口能查到，ukey在api提取链接内包含
// 参考定时 5,35 * * * *
// 变量 export XIEQU_CONFIG=“备注@uid@ukey@vkey”
const axios = require('axios');
const sendNotify = require('./sendNotify');

// 配置青龙变量参数
const [USER, UID, UKEY, VKEY] = process.env.XIEQU_CONFIG.split('@');
// 配置携趣变量参数
const CLEAR_WHITE_LIST_URL = `http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=del&ip=all`;
const ADD_TO_WHITE_LIST_URL = `http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=add`;
const GET_WHITE_LIST_URL = `http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=get`;
const ACCOUNT_STATUS = `http://api.xiequ.cn/VAD/GetIp.aspx?act=get&uid=${UID}&vkey=${VKEY}&num=1&time=30&plat=1&re=0&type=0&so=1&ow=1&spl=3&addr=&db=1`;
const GET_IP_URL = 'https://www.taobao.com/help/getip.php';
// 设置请求的User-Agent头，以伪装成浏览器请求，并禁止缓存
axios.defaults.headers.common['User-Agent'] =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36';
axios.defaults.headers.common['Cache-Control'] = 'no-cache';
axios.defaults.headers.common['Pragma'] = 'no-cache';

// 获取当前外网IP的函数
async function getPublicIP() {
  try {
    const response = await axios.get(GET_IP_URL);
    const ip = response.data.match(/\d+\.\d+\.\d+\.\d+/)[0];
    console.log('😀获取当前外网IP:', ip); //显示获取到的IP
    return ip;
  } catch (error) {
    console.error('🔔获取当前外网IP失败:', error.message);
    return null;
  }
}

// 清空白名单函数
async function clearWhiteList() {
  try {
    console.log('✅执行清空白名单');
    await axios.get(CLEAR_WHITE_LIST_URL);
    console.log('✅清空白名单成功');
  } catch (error) {
    console.error('🔔清空白名单失败:', error.message);
  }
}

// 获取白名单函数
async function getWhiteList() {
  try {
    const response = await axios.get(GET_WHITE_LIST_URL);
    return response.data; // 返回白名单数据
  } catch (error) {
    console.error('🔔获取白名单失败:', error.message);
    return null;
  }
}

// 更新白名单函数
async function addToWhiteList(ip) {
  try {
    console.log('✅执行更新白名单');
    await axios.get(`${ADD_TO_WHITE_LIST_URL}&ip=${ip}`);
    console.log('✅更新白名单成功');
  } catch (error) {
    console.error('🔔更新白名单失败:', error.message);
  }
}

// 检查账号状态函数
async function checkAccountStatus() {
  try {
    const response = await axios.get(ACCOUNT_STATUS);
    const content = response.data;
    if (content.includes('过期')) {
      console.log('🔔账号额度已经用完或者账号已过期！');
      await sendNotify.sendNotify(`⚠通知⚠`, `账号：💎${USER}💎\n产品额度已经用完或者已过期！`);
    } else if (content.includes('Err')) {
      console.log('❗账号信息配置有误');
      await sendNotify.sendNotify(`⚠通知⚠`, `账号：💎${USER}💎\n账号信息配置有误！`);
    } else {
      console.log('✅账号状态正常');
    }
  } catch (error) {
    console.error('🔔检查账号状态失败:', error.message);
    await sendNotify.sendNotify(`🔔通知🔔`, `携趣代理更新：\n检查账号💎${USER}💎状态失败！`);
  }
}


// 入口函数
async function main() {
  const NO = process.env.XIEQU_CONFIG.split('@')[0];
  console.log('💎当前账号名称为：', NO + '\n');

  const ip = await getPublicIP();
  if (ip) {
    const whiteList = await getWhiteList();
    console.log('😀当前白名单IP:', whiteList);

    if (whiteList === ip) {
      await checkAccountStatus();
    } else {
	  await clearWhiteList();
      await addToWhiteList(ip);
      await sendNotify.sendNotify(`🎉携趣白名单更新通知🎉`,`当前外网IP变更为：\n${ip}\n\n账号：💎${USER}💎\n\n已更新白名单！`);
      console.log('⏲5s后重新检查账号状态！');
	  await new Promise((resolve) => setTimeout(resolve, 5000)); // 5s后重新检查账号状态
      await checkAccountStatus();

    }
  }
}

main();
