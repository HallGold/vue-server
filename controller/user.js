const jwt = require("jsonwebtoken");
const { Users } = require("../models/users");

/* 用户登录 */
const login = async (ctx) => {
  /* 获取用户传递的账号密码 */
  const { username, pwd } = ctx.request.body;
  await Users.findOne({ username, pwd })
    .then((rel) => {
      if (rel) {
        /* 如果查询到了 表示有这个用户 */
        /**
         * 生成token
         * @type {*}
         * 三个参数
         * 1.对象内容
         * 2.密钥
         * 3.jwt 相关配置信息
         * */
        let token = jwt.sign(
          {
            username: rel.username,
            _id: rel._id,
          },
          "jianshu-server-jwt",
          {
            // expiresIn 单位是秒  时效设置的一周
            expiresIn: 3600 * 24 * 7,
          }
        );
        ctx.body = { code: 200, token, msg: "登录成功" };
      } else {
        ctx.body = { code: 300, msg: "登录失败" };
      }
    })
    .catch((err) => {
      ctx.body = { code: 500, msg: "登录异常" };
    });
};

/**
 *用户注册
 *
 * @param {*} ctx
 */
const reg = async (ctx) => {
  /* 获取用户传递的账号密码 */
  const { username, pwd } = ctx.request.body;
  /* 验证用户名是否已被注册 */
  let isDouble = false;
  await Users.findOne({ username }).then((res) => {
    if (res) isDouble = true;
  });

  if (isDouble) {
    ctx.body = {
      code: 300,
      msg: "用户名已存在",
    };
    return;
  }
  // 开始添加用户
  await Users.create({ username, pwd })
    .then((rel) => {
      if (rel) {
        ctx.body = { code: 200, msg: "注册成功" };
      } else {
        ctx.body = { code: 300, msg: "注册失败" };
      }
    })
    .catch((err) => {
      ctx.body = { code: 500, msg: "注册异常" };
    });
};

/* 认证用户登录 */
const verify = async (ctx) => {
  /* 获取token */
  let token = ctx.header.authorization;
  /* 注意空格 */
  token = token.replace("Bearer ", "");

  try {
    /*  result要处理的token信息 */
    let result = jwt.verify(token, "jianshu-server-jwt");
    /* result._id 判断当前是否有这样一个用户  */
    await Users.findOne({ _id: result._id })
      .then((rel) => {
        if (rel) {
          ctx.body = { code: 200, msg: "用户认证成功", user: rel };
        } else {
          ctx.body = { code: 500, msg: "用户认证失败1" };
        }
      })
      .catch((err) => {
        ctx.body = { code: 500, msg: "用户认证失败2" };
      });
  } catch (error) {
    ctx.body = { code: 500, msg: "用户认证失败3" };
  }
};

module.exports = {
  login,
  reg,
  verify,
};
