require("../models/connect_mongo"); //连接数据库
var encrypt = require("../models/encrypt");
var User = require("../models/user");
var formidable = require("formidable");


//检测字节长度
function strlen(str) {
    var len = 0;
    for (var i = 0; i < str.length; i++) {
        var c = str.charCodeAt(i);
        //单字节加1   
        if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
            len++;
        } else {
            len += 2;
        }
    }
    return len;
}

//执行注册业务
exports.reg = function (req, res, next) {
    //得到用户填写的东西
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        var username = fields.username;
        var email = fields.email;
        var password = fields.password;

        //验证表单信息是否符合规则，不符合返回-1
        //判断长度
        if (strlen(username) < 4 || strlen(username) > 14) {
            res.json({
                "code": -1,
                "msg": "用户名长度不符或者包含敏感词"
            });
            return;
        }
        //验证字符
        var usernameReg = /^[\u4e00-\u9fa5\w]*$/;
        if (!usernameReg.test(username)) {
            res.json({
                "code": -1,
                "msg": "用户名长度不符或者包含敏感词"
            });
            return;
        }
        //验证邮箱
        var emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        if (!emailReg.test(email)) {
            res.json({
                "code": -1,
                "msg": "邮箱格式不正确"
            });
            return;
        }
        //验证密码
        var pwdReg = /^[\w]{6,16}$/;
        if (!pwdReg.test(password)) {
            res.json({
                "code": -1,
                "msg": "密码不符合规则"
            });
            return;
        }

        //信息合格后，查询数据库中是不是有这个人，被占用返回-2
        User.find({
            name: username,
            isDel: 0
        }, function (err, docs) {
            if (err) {
                res.send("-3"); //服务器错误
                return;
            }
            if (docs.length != 0) {
                // {"code":-619,"msg":"用户名过长"}
                // res.json({"code":-1,"msg":"用户名被占用"});
                res.send({
                    "code": -2,
                    "msg": "用户名被占用"
                }); //被占用
                return;
            }
            User.find({
                email: email,
                isDel: 0
            }, function (err, docs) {
                if (err) {
                    res.send("-3"); //服务器错误
                    return;
                }
                if (docs.length != 0) {
                    // {"code":-619,"msg":"用户名过长"}
                    // res.json({"code":-1,"msg":"用户名被占用"});
                    res.send({
                        "code": -2,
                        "msg": "邮箱被占用"
                    }); //被占用
                    return;
                }

                //通过筛选后，设置加密
                password = encrypt(password);
                //添加用户
                User.create({
                    name: username,
                    email: email,
                    password: password,
                }, function (err) {
                    if (err) {
                        res.send("-3"); //服务器错误
                        return;
                    }
                    //session写入头像
                    User.find({
                        name: username
                    }, function (err, docs) {
                        if (err) {
                            console.log(err);
                        }
                        req.session.imgName = docs[0].avatar
                        req.session.login = "1";
                        req.session.username = username;
                        // res.json({"code":1,"msg":"注册成功"});
                        res.send({
                            "code": 1,
                            "msg": "注册成功"
                        }); //注册成功返回1，send后会结束res(response)，最后写
                    });
                });
            });

        });

    });
};

//执行登陆页面
exports.login = function (req, res, next) {
    //得到用户表单
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        //得到表单之后做的事情
        var loginInfo = fields.loginInfo;
        var password = fields.password;
        var jiamihou = encrypt(password);
        //查询数据库，看看有没有个这个人
        User.find({
            $or: [{
                    name: loginInfo
                },
                {
                    email: loginInfo
                }
            ]
        }, function (err, docs) {
            if (err) {
                res.send("-3"); //server error
                return;
            }
            //没有这个人
            if (docs.length == 0) {
                res.send({
                    "code": -1,
                    "msg": "用户名或密码错误"
                }); //用户名不存在
                return;
            }
            //如果有的话，验证密码
            if (jiamihou == docs[0].password) {
                req.session.login = "1";
                req.session.username = docs[0].name;
                req.session.imgName = docs[0].avatar
                res.send({
                    "code": 1,
                    "msg": "登陆成功！将自动跳转到首页"
                }); //登录成功
                return;
                // res.redirect("/"); //post请求无法使用redirect 会显示灰暗 提示unreachable
            } else {
                res.send({
                    "code": -1,
                    "msg": "用户名或密码错误"
                }); //密码错误
                return;
            }
        });
    });
};
