// 携趣白名单更新 uid和ukey在白名单管理接口能查到
// 参考定时 5,35 * * * *
// 变量 export XIEQU_CONFIG=“账号1备注@uid@ukey;账号2备注@uid@ukey;账号3备注@uid@ukey”
//const $ = new Env('携趣白名单更新多账号版');
//5,35 * * * * jd_xiequ_white_Multiple.js
const axios = require('axios');
const sendNotify = require('./sendNotify');

// 从环境变量中获取多个账号信息
const accounts = process.env.XIEQU_CONFIG.split(';').map(account => account.split('@'));
let currentAccountIndex = 0;

// 获取外网IP的逻辑...
async function getExternalIP() {
  try {
    const response = await axios.get('https://www.ip.cn/api/index?ip&type=0');
    const responseData = response.data;
    const ip = responseData.ip;
    console.log('🔗获取当前外网IP:', ip); // 显示获取到的IP
    return ip;
  } catch (error) {
    console.error('🔔获取当前外网IP失败:', error);
    return null; // 在失败情况下返回 null
  }
}

// 清空白名单的逻辑...
async function clearWhitelist() {
  for (const account of accounts) {
    const [USER, UID, UKEY] = account;
    try {
      console.log(`⏰清空 ${USER} 的白名单`);
      await axios.get(`http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=del&ip=all`);
      console.log(`✅账号 ${USER} 的白名单清空成功`);
    } catch (error) {
      console.error(`🔔账号 ${USER} 的白名单清空失败:`, error.message);
    }
  }
}

// 获取白名单列表的逻辑...
async function getWhitelist(account) {
	const [USER, UID, UKEY] = account;
	try {
		const response = await axios.get(`http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=get`);
		return response.data; // 返回白名单数据
	} catch (error) {
		console.error('🔔获取白名单失败:', error.message);
		return null;
	}
}

// 更新白名单的逻辑...
async function updateWhitelist(account, ip) {
	const [USER, UID, UKEY] = account;
    try {
    console.log('✅执行更新白名单');
    await axios.get(`http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=add&ip=${ip}`);
    console.log('✅更新白名单成功');
  } catch (error) {
    console.error('🔔更新白名单失败:', error.message);
  }
}

// 检查账号状态的逻辑...
async function checkAccountStatus(account) {
	const [USER, UID, UKEY] = account;
	return axios.get('http://op.xiequ.cn/ApiUser.aspx?act=suitdt', {
			params: {
				uid: UID,
				ukey: UKEY
			}
		})
		.then((response) => {
    const jsonData = response.data;
    const useValue = jsonData.data[0].use;
    console.log('套餐类型:', jsonData.data[0].type);
    console.log('套餐时长:', jsonData.data[0].long);
    console.log('套餐数量:', jsonData.data[0].num);
    console.log('已使用数量:', jsonData.data[0].use);
    console.log('截止日期:', jsonData.data[0].enddate);
    console.log('是否有效:', jsonData.data[0].valid + '\n');
    return useValue;
  })
		.catch(error => {
			if (jsonData.data[0].ERR || response.status === 500) {
				console.error(`账号 ${USER} 配置错误或者服务器异常`);
			} else {
				console.error(`账号 ${USER} 请求遇到问题:`, error);
			}
		});

}


async function main() {
	// 检查 process.env.XIEQU_CONFIG 变量是否存在
	if (!process.env.XIEQU_CONFIG) {
		console.log('未发现 XIEQU_CONFIG 环境变量，请检查相关配置。');
		return;
	}

	const account = accounts[currentAccountIndex];
	const [USER, UID, UKEY] = account;
	console.log('💎当前账号名称为：', USER + '\n');
	try {
		const useValue = await checkAccountStatus(account);
		if (!isNaN(useValue) && (useValue > 950 && useValue < 1000)) {
			console.log('⛔账号额度即将耗尽，清空白名单并切换到下一个账号...');
			await clearWhitelist();
			currentAccountIndex++;
			if (currentAccountIndex < accounts.length) {
				console.log(`🔄切换到下一个账号：${accounts[currentAccountIndex][0]}`);
		        console.log('⏰15s后切换到下一个账号');
		        await new Promise(resolve => setTimeout(resolve, 15000));
				await main();
			} else {
				console.log('⛔所有账号状态异常，停止执行。');
        await sendNotify.sendNotify(`🎉携趣白名单更新通知🎉`, `⛔所有账号状态异常，停止执行。`);
			}
		} else {
			// console.log(`账号 ${USER} 的使用值为: ${useValue}`);
			const currentIP = await getExternalIP();
			// console.log('获取到的当前IP地址为：', currentIP); // 添加打印语句
			const whitelist = await getWhitelist(account); // 传入账号信息
			console.log('✅获取到的白名单为：', whitelist); //打印当前白名单地址信息

			if (whitelist && whitelist.includes(currentIP)) { // 检查 whitelist 是否存在再进行 includes 操作
				console.log('😀当前IP已在白名单中，账号状态正常，停止操作！');
			// 在账号状态正常并且当前IP在白名单中时，继续执行其他操作
			} else {
				console.log('🔔当前IP不在白名单中，清空白名单并更新IP...');
				await clearWhitelist(account);
        		await updateWhitelist(account, currentIP);
				console.log('✅IP地址发生变化，已更新白名单。');
		        // 更新白名单后8s获取最新的白名单信息并进行打印
		        console.log('⏰15s后重新获取白名单地址');
				await new Promise(resolve => setTimeout(resolve, 15000));
		        const updatedWhitelist = await getWhitelist(account);
		        console.log('✅更新后的白名单地址为：', updatedWhitelist); 
		        const maskedIp = currentIP.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.***.$3.$4");
	      		const maskedWhiteList = updatedWhitelist.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.***.$3.$4");
		    await sendNotify.sendNotify(
		    `🎉携趣白名单更新通知🎉`,
		    `当前外网IP变更为：\n${maskedIp}\n\n账号：💎${USER}💎\n\n更新白名单地址为：\n${maskedWhiteList}`
		);
			}
		}
	} catch (error) {
		console.error(`⚠️账号 ${USER} 过期或配置错误：`, error.message);
		currentAccountIndex++;
		if (currentAccountIndex < accounts.length) {
		console.log(`🔄切换到下一个账号：${accounts[currentAccountIndex][0]}`);
	    console.log('⏰15s后切换到下一个账号');
	    await new Promise(resolve => setTimeout(resolve, 15000));
			await main();
		} else {
			console.log('⛔所有账号状态异常，停止执行。');
      		await sendNotify.sendNotify(`🎉携趣白名单更新通知🎉`, `⛔所有账号状态异常，停止执行。`);
		}
	}
}


main();