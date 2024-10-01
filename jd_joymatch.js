/*
参加双人赛，获胜可得300积分
cron:29 9,20 * * *
 */
const $ = new Env("6dy宠汪汪-双人赛Fix");
const notice = require('./sendNotify');
const _0x3c75a9 = $.isNode() ? require("./jdCookie.js") : "";
let _0xcc2443 = true;
let _0x5a02bf = [];
let _0x10a129 = "";
let _0xc3eda8 = "";
if ($.isNode()) {
  Object.keys(_0x3c75a9).forEach(_0x3e3246 => {
    _0x5a02bf.push(_0x3c75a9[_0x3e3246]);
  });
  if (process.env.JD_DEBUG && process.env.JD_DEBUG === "false") {
    console.log = () => {};
  }
} else {
  _0x5a02bf = [$.getdata("CookieJD"), $.getdata("CookieJD2"), ..._0x3c3d46($.getdata("CookiesJD") || "[]").map(_0x4c1674 => _0x4c1674.cookie)].filter(_0x272543 => !!_0x272543);
}
!(async () => {
  if (!_0x5a02bf[0]) {
    const _0x29026a = {
      "open-url": "https://bean.m.jd.com/bean/signIndex.action"
    };
    $.msg($.name, "【提示】请先获取京东账号一cookie\n直接使用NobyDa的京东签到获取", "https://bean.m.jd.com/bean/signIndex.action", _0x29026a);
    return;
  }
  if (new Date().getHours() < 9 || new Date().getHours() > 21) {
    console.log("不在参赛时间，退出");
    return;
  }
  for (let _0x4c6d1e = 0; _0x4c6d1e < _0x5a02bf.length; _0x4c6d1e++) {
    {
      if (_0x5a02bf[_0x4c6d1e]) {
        _0x10a129 = _0x5a02bf[_0x4c6d1e];
        $.UserName = decodeURIComponent(_0x10a129.match(/pt_pin=([^; ]+)(?=;?)/) && _0x10a129.match(/pt_pin=([^; ]+)(?=;?)/)[1]);
        $.index = _0x4c6d1e + 1;
        $.isLogin = true;
        $.nickName = "";
        $.UA = require("./USER_AGENTS").UARAM();
        await _0x5b1003();
        console.log("\n******开始【京东账号" + $.index + "】" + ($.nickName || $.UserName) + "*********\n");
        if (!$.isLogin) {
          const _0x7ae448 = {
            "open-url": "https://bean.m.jd.com/bean/signIndex.action"
          };
          $.msg($.name, "【提示】cookie已失效", "京东账号" + $.index + " " + ($.nickName || $.UserName) + "\n请重新登录获取\nhttps://bean.m.jd.com/bean/signIndex.action", _0x7ae448);
          if ($.isNode()) {
            {
              await _0x190e06.sendNotify($.name + "cookie已失效 - " + $.UserName, "京东账号" + $.index + " " + $.UserName + "\n请重新登录获取cookie");
            }
          }
          continue;
        }
        await _0x2de48e(false);
        await $.wait(500);
        $.result == "unreceive" && (await _0xe98123());
        await $.wait(500);
        await _0x3003e1();
        await $.wait(2000);
        await _0x2de48e();
        await $.wait(10000);
        
      }
    }
  }
})().catch(_0x317e0c => {
  $.log("", "❌ " + $.name + ", 失败! 原因: " + _0x317e0c + "!", "");
}).finally(() => {
  $.done();
});
async function _0x3003e1() {
  const _0x46e7f3 = {
    Host: "api.m.jd.com",
    Origin: "https://h5.m.jd.com",
    "Content-Type": "application/json",
    "User-Agent": $.UA,
    Cookie: _0x10a129
  };
  let _0x12501b = {
    url: "https://api.m.jd.com/api?client=android&clientVersion=11.6.0&appid=jdchoujiang_h5&t=1677312471257&functionId=combatMatch&body=%7B%22teamLevel%22%3A%222%22%2C%22reqSource%22%3A%22h5%22%7D&h5st=&uuid=&eu=&fv=&build=98666&osVersion=12&networkType=wifi&oaid=",
    headers: _0x46e7f3
  };
  return new Promise(async _0x3e260c => {
    $.get(_0x12501b, async (_0xd32d3a, _0x2d82d8, _0x16384a) => {
      try {
        if (_0xd32d3a) {
          console.log("" + JSON.stringify(_0xd32d3a));
          console.log(" API请求失败，请检查网路重试");
        } else {
          {
            _0x16384a = JSON.parse(_0x16384a);
            _0x16384a.success ? console.log("参赛成功！") : console.log(_0x16384a.errorMessage);
          }
        }
      } catch (_0x8538a6) {
        $.logErr(_0x8538a6, _0x2d82d8);
      } finally {
        _0x3e260c(_0x16384a);
      }
    });
  });
}
async function _0xe98123() {
  const _0x4e6286 = {
    Host: "api.m.jd.com",
    Origin: "https://h5.m.jd.com",
    "Content-Type": "application/json",
    "User-Agent": $.UA,
    Cookie: _0x10a129
  };
  let _0x133e78 = {
    url: "https://api.m.jd.com/api?client=android&clientVersion=11.6.0&appid=jdchoujiang_h5&t=1677312458500&functionId=combatReceive&body={%22reqSource%22:%22h5%22}&h5st=20230225160738785%3B9700942244965183%3B04889%3Btk02w5fc71afb18nqVADaN0oUst3H1GjS59nqN4u3%2BdF%2BH%2Bf2ZHBqC5mo2aON02zX4GOwhgEN80%2Brx9hawWd0OxLotth%3B16165b4fd4b3fb4aff89e71886a2fa4824e1e1079208534ff92481b4c7518898%3B3.1%3B1677312458785%3B62f4d401ae05799f14989d31956d3c5fe4d0c9245dd6c1a41e80e50875d9afa0cce84d8dd9669ec8b4ce610fa638083c3ce3263965813b4c7f07c5d958c86f4ceaca9007ba547a6573c1035d84bc2f08dc85fe1b4c40f448dd28e6ec7583f12f1ebb4f5406e8f6d70ccc6ea5655c2cd2a399971544498707ba5104c2ecf7a35f5a953f26df394f8e452b6c1a970e90c6&uuid=&eu=&fv=&build=98666&osVersion=12&networkType=wifi&partner=xiaomi001&d_brand=Redmi&aid=&oaid=",
    headers: _0x4e6286
  };
  return new Promise(async _0x5e4bdb => {
    $.get(_0x133e78, async (_0x523b41, _0x23fcf6, _0x54f97d) => {
      {
        try {
          if (_0x523b41) {
            console.log("" + JSON.stringify(_0x523b41));
            console.log(" API请求失败，请检查网路重试");
          } else {
            {
              _0x54f97d = JSON.parse(_0x54f97d);
              _0x54f97d.success ? console.log("上轮比赛第一名，获得300积分！\n") : console.log(_0x54f97d.errorMessage);
            }
          }
        } catch (_0x29fd97) {
          $.logErr(_0x29fd97, _0x23fcf6);
        } finally {
          _0x5e4bdb(_0x54f97d);
        }
      }
    });
  });
}
async function _0x2de48e(_0x11bed9 = true) {
  const _0x2d047f = {
    Host: "api.m.jd.com",
    Origin: "https://h5.m.jd.com",
    "Content-Type": "application/json",
    "User-Agent": $.UA,
    Cookie: _0x10a129
  };
  let _0x492c55 = {
    url: "https://api.m.jd.com/api?client=android&clientVersion=11.6.0&appid=jdchoujiang_h5&t=1677312472015&functionId=combatDetail&body=%7B%22help%22%3Afalse%2C%22reqSource%22%3A%22h5%22%7D&h5st=&uuid=&eu=6&fv=3&build=98666&osVersion=12&networkType=wifi&aid=&oaid=&help=false&reqSource=h5",
    headers: _0x2d047f
  };
  return new Promise(async _0x2a9b9c => {
    $.get(_0x492c55, async (_0x1ad74a, _0x4b77c1, _0x3c47ac) => {
      try {
        if (_0x1ad74a) {
          console.log("" + JSON.stringify(_0x1ad74a));
          console.log(" API请求失败，请检查网路重试");
        } else {
          _0x3c47ac = JSON.parse(_0x3c47ac);
			if (_0x3c47ac.success) {
			    $.result = _0x3c47ac.data.petRaceResult;
			    if (_0x11bed9) {
			        console.log("\n比赛信息：");
			        _0x3c47ac.data.raceUsers.forEach(_0x5c7b71 => {
			            if (_0x5c7b71.myself) {
				            const distanceDiff = Math.abs(_0x3c47ac.data.raceUsers[0].distance - _0x3c47ac.data.raceUsers[1].distance);
			                console.log("当前排名: " + _0x5c7b71.rank);
			                if (_0x5c7b71.rank === 1) {
			                    $.log("✔领先:"+distanceDiff+"KM");
			                    console.log("可通过邀请助力继续提升速度！！！");
			                } else {
			                    $.log("❌落后:"+distanceDiff+"KM");
								// 只有前四个账号运行且落后小于120时发送通知
                          		let accountName = $.nickName || $.UserName;
                          		if ($.index <= 4 && distanceDiff < 120) {
								notice.sendNotify(`🎉宠汪汪双人赛通知🎉`, `♻️${accountName}\n可通过助力提升名次！`);
								}
			                }
			            }
			        });
			    }
			} else {
			    console.log(_0x3c47ac.errorMessage);
			}

        }
      } catch (_0x547031) {
        $.logErr(_0x547031, _0x4b77c1);
      } finally {
        _0x2a9b9c(_0x3c47ac);
      }
    });
  });
}
function _0x5b1003() {
  return new Promise(_0x16ba4a => {
    {
      const _0xc11a8b = {
        Cookie: _0x10a129,
        referer: "https://h5.m.jd.com/",
        "User-Agent": $.UA
      };
      const _0x3aa3a4 = {
        url: "https://plogin.m.jd.com/cgi-bin/ml/islogin",
        headers: _0xc11a8b,
        timeout: 10000
      };
      $.get(_0x3aa3a4, (_0x5a2b0d, _0x231e45, _0x1e7306) => {
        try {
          {
            if (_0x1e7306) {
              {
                _0x1e7306 = JSON.parse(_0x1e7306);
                if (!(_0x1e7306.islogin === "1")) {
                  if (_0x1e7306.islogin === "0") {
                    {
                      $.isLogin = false;
                    }
                  }
                }
              }
            }
          }
        } catch (_0x272886) {
          console.log(_0x272886);
        } finally {
          _0x16ba4a();
        }
      });
    }
  });
}
function _0x10b39f() {
  return new Promise(_0x25a4e0 => {
    !_0xcc2443 ? $.msg($.name, "", "" + _0xc3eda8) : $.log("京东账号" + $.index + $.nickName + "\n" + _0xc3eda8);
    _0x25a4e0();
  });
}
function _0x48feb1(_0x24a77e) {
  try {
    if (typeof JSON.parse(_0x24a77e) == "object") {
      {
        return true;
      }
    }
  } catch (_0x16fc0a) {
    console.log(_0x16fc0a);
    console.log("京东服务器访问数据为空，请检查自身设备网络情况");
    return false;
  }
}
function _0x3c3d46(_0x3bcf6b) {
  if (typeof _0x3bcf6b == "string") {
    try {
      return JSON.parse(_0x3bcf6b);
    } catch (_0x1f0611) {
      {
        console.log(_0x1f0611);
        $.msg($.name, "", "请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie");
        return [];
      }
    }
  }
}
// prettier-ignore
function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `🔔${this.name}, 开始!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), n = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(n, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t, e = null) { const s = e ? new Date(e) : new Date; let i = { "M+": s.getMonth() + 1, "d+": s.getDate(), "H+": s.getHours(), "m+": s.getMinutes(), "s+": s.getSeconds(), "q+": Math.floor((s.getMonth() + 3) / 3), S: s.getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, (s.getFullYear() + "").substr(4 - RegExp.$1.length))); for (let e in i) new RegExp("(" + e + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? i[e] : ("00" + i[e]).substr(("" + i[e]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============📣系统通知📣=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `❗️${this.name}, 错误!`, t.stack) : this.log("", `❗️${this.name}, 错误!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `🔔${this.name}, 结束! 🕛 ${s} 秒`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }