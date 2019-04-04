var mongoose = require("mongoose");

// 连接数据库
mongoose.connect('mongodb://localhost/mongoose_test', {
    useNewUrlParser: true
});

mongoose.connection.once("open", function () {
    console.log("数据连接成功~~~");
});