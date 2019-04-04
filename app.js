const express = require('express');
const app = express();
const session = require('express-session');

// Load routes
const perform = require("./controller/perform");
const show = require("./controller/show");

// 使用session
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

// 静态文件
app.use(express.static("./public"));

// 设置模板引擎
app.set("view engine", "ejs");
app.engine('.html', require('ejs').__express);// 将模板的后缀改为.html
app.set('view engine', 'html');// 避免了每次res.Render("xx.html")的尴尬

// 路由表
app.get("/", show.showIndex); //显示首页

// 用户路由（注册登录退出）
app.get("/register", show.showReg); //显示注册页面
app.post("/doregister", perform.reg); //执行注册，Ajax服务
app.get("/login", show.showLogin); //显示登陆页面
app.post("/dologin", perform.login); //执行登录，Ajax服务
app.get('/logout', show.logout);//退出登录

// 404
app.use(show.error);

app.listen(9999, function () {
    console.log("服务器打开");
});