const router = require("koa-router")();
const { login, reg, verify } = require("../controller/user");

router.prefix("/users");

// 登录
router.post("/login", login);

// 注册
router.post("/reg", reg);

// 验证用户登录
router.post("/verify", verify);

module.exports = router;
