var crypto = require("crypto");

function md5(mima) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(mima).digest('base64'); //调用方法Hash后，不能再次使用该对象hash.digest()。多次调用将导致抛出错误。
    return password;
}

module.exports = function (mima) {
    password = md5(md5(mima) + "计");
    return password;
}

module.exports.md5 = md5;