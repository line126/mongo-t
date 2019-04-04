//首页
exports.showIndex = function (req, res, next) {
    res.render("index", {
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
    });
};

//注册页面
exports.showReg = function (req, res, next) {
    res.render("register", {
        "login": req.session.login == "1" ? true : false,
        "username": req.session.login == "1" ? req.session.username : "",
    });
};

//显示登陆页面
exports.showLogin = function (req, res, next) {
    res.render("login");
};

//退出业务
exports.logout = function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log("退出失败!");
            return;
        }
        res.redirect('/');
    })
}

//404
exports.error = function (req, res) {
    res.render("error");
};