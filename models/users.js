const mongoose = require("mongoose");

/* 创建Schema对象 */

const schema = new mongoose.Schema({
  /* 用户名 */
  username: String,
  /* 密码 */
  pwd: {
    type: String,
    select: false, //在查询用户对象时 密码为影藏状态
  },
  /* 头像 */
  avatar: {
    type: String,
    default: "", //设置默认值
  },
  /* 性别 */
  sex: {
    type: String,
    default: "",
  },
});

/* 用户对象模型 */
const Users = mongoose.model("users", schema);

module.exports = {
  Users,
};
