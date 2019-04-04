var mongoose = require("mongoose");

//模式结构(约束)
var Schema = mongoose.Schema;
var userSchema = new Schema({
    name: {
        type: String,
        required: true//设置为必须
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    isDel: {
        type: Number,
        default: 0
    },
    avatar: {
        type: String,
        default: "default.jpg"
    }
});

//定义模型
var UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;