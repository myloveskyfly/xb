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

// 获取外网 IP 的逻辑...
async function getExternalIP() {
    //定义一个包含多个 API 端点的数组
    const apiEndpoints = [
        'https://www.ip.cn/api/index?ip&type=0',
        'https://2024.ipchaxun.com',
        'http://api.ipify.cn/?format=json'
    ];
    // 循环尝试获取 IP
    for (const endpoint of apiEndpoints) {
        // 定义重试次数和最大重试次数
        let retryCount = 0;
        const maxRetries = 3;
        // 获取 IP
        while (retryCount < maxRetries) {
            try {
                const response = await axios.get(endpoint);
                const responseData = response.data;
                // API 响应有一个名为 'ip' 的字段
                const ip = responseData.ip;
                console.log(`🔗从接口 ${endpoint} 获取当前外网IP \n✅获取到的外网IP为:`, ip);
                return ip;

            } catch (error) {
                console.error(`🔔从接口 ${endpoint} 获取当前外网 IP 失败，重试次数：`, retryCount + 1);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    console.error('🔔多次尝试获取外网 IP 失败，停止执行。');
    return null;
}


// 清空白名单的逻辑...
async function clearWhitelist() {
    for (const account of accounts) {
        const [USER, UID, UKEY] = account;
        let retryCount = 0;
        const maxRetries = 3;
        while (retryCount < maxRetries) {
            try {
                console.log(`⏰清空 ${USER} 的白名单`);
                await axios.get(`http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=del&ip=all`);
                console.log(`✅账号 ${USER} 的白名单清空成功`);
                break;
            } catch (error) {
                console.error(`🔔账号 ${USER} 的白名单清空失败，重试次数：`, retryCount + 1);
                retryCount++;
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
}

// 获取白名单列表的逻辑...
async function getWhitelist(account) {
    const [USER, UID, UKEY] = account;
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
        try {
            const response = await axios.get(`http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=get`);
            return response.data;
        } catch (error) {
            console.error('🔔获取白名单失败，重试次数：', retryCount + 1);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    console.error('🔔多次尝试获取白名单失败，停止执行。');
    return null;
}

// 更新白名单的逻辑...
async function updateWhitelist(account, ip) {
    const [USER, UID, UKEY] = account;
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
        try {
            console.log('✅执行更新白名单');
            await axios.get(`http://op.xiequ.cn/IpWhiteList.aspx?uid=${UID}&ukey=${UKEY}&act=add&ip=${ip}`);
            console.log('✅更新白名单成功');
            break;
        } catch (error) {
            console.error('🔔更新白名单失败，重试次数：', retryCount + 1);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// 检查账号状态的逻辑...
async function checkAccountStatus(account) {
    const [USER, UID, UKEY] = account;
    let retryCount = 0;
    const maxRetries = 3;
    while (retryCount < maxRetries) {
        try {
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
        } catch (error) {
            console.error('🔔检查账号状态失败，重试次数：', retryCount + 1);
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    console.error('🔔多次尝试检查账号状态失败，停止执行。');
    return null;
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
            const currentIP = await getExternalIP();
            // 检查获取到的 外网IP 是否为空
            if (currentIP === undefined) {
                console.error('🔔获取当前外网 IP 失败，停止执行。');
                return;
            }
            // 检查获取到的 白名单 是否为空
            const whitelist = await getWhitelist(account);
            if (whitelist === null) {
                console.error('🔔获取白名单失败，停止执行。');
                return;
            }
            console.log('✅获取到的白名单为：', whitelist);

            if (whitelist && whitelist.includes(currentIP)) {
                console.log('😀当前 IP 已在白名单中，账号状态正常，停止操作！');
            } else {
                console.log('🔔当前 IP 不在白名单中，清空白名单并更新 IP...');
                await clearWhitelist(account);
                await updateWhitelist(account, currentIP);
                console.log('✅IP 地址发生变化，已更新白名单。');
                console.log('⏰15s 后重新获取白名单地址');
                await new Promise(resolve => setTimeout(resolve, 15000));
                const updatedWhitelist = await getWhitelist(account);
                console.log('✅更新后的白名单地址为：', updatedWhitelist);
                const maskedIp = currentIP.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.***.$3.$4");
                const maskedWhiteList = updatedWhitelist.replace(/(\d+)\.(\d+)\.(\d+)\.(\d+)/, "$1.***.$3.$4");
                await sendNotify.sendNotify(
                    `🎉携趣白名单更新通知🎉`,
                    `当前外网 IP 变更为：\n${maskedIp}\n\n账号：💎${USER}💎\n\n更新白名单地址为：\n${maskedWhiteList}`
                );
            }
        }
    } catch (error) {
        console.error(`⚠️账号 ${USER} 过期或配置错误：`, error.message);
        currentAccountIndex++;
        if (currentAccountIndex < accounts.length) {
            console.log(`🔄切换到下一个账号：${accounts[currentAccountIndex][0]}`);
            console.log('⏰15s 后切换到下一个账号');
            await new Promise(resolve => setTimeout(resolve, 15000));
            await main();
        } else {
            console.log('⛔所有账号状态异常，停止执行。');
            await sendNotify.sendNotify(`🎉携趣白名单更新通知🎉`, `⛔所有账号状态异常，停止执行。`);
        }
    }
}


main();