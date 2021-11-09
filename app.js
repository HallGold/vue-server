const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");

const index = require("./routes/index");
const users = require("./routes/users");
const upload = require("./routes/upload");

/* //路由权限控制  在路由之前使用 */
const koajwt = require("koa-jwt");

/* 配置jwt */
app.use(
  koajwt({
    secret: "jianshu-server-jwt", // 编辑密钥 生成token和解析token时都需要用到
  }).unless({
    // 配置不需要通过jwt认证的接口 可以直接放行  比如：登录和注册等一些前台信息
    path: [/^\/users\/login/, /^\/users\/reg/],
  })
);

/* 连接数据库 */
const mongoose = require("./db");
mongoose();

// error handler
onerror(app);

// middlewares
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());
// 上传
app.use(upload.routes(), upload.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

module.exports = app;

console.log("http://localhost:3000");
