const router = require("koa-router")();
const multer = require("@koa/multer");
const fs = require("fs");
const path = require("path");
router.prefix("/upload");

const upload = multer({
  storage: multer.diskStorage({
    //设置文件存储位置
    destination: function (req, file, cb) {
      let date = new Date();
      let year = date.getFullYear();
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let day = date.getDate();
      let dir = "./public/uploads/" + year + month + day;

      //判断目录是否存在，没有则创建
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, {
          recursive: true,
        });
      }

      //dir就是上传文件存放的目录
      cb(null, dir);
    },
    //设置文件名称
    filename: function (req, file, cb) {
      let fileName = file.fieldname + "-" + Date.now() + path.extname(file.originalname);
      //fileName就是上传文件的文件名
      cb(null, fileName);
    },
  }),
});
// 上传图片接口
router.post("/img", upload.single("myfile"), async (ctx) => {
  let path = ctx.request.file.path;
  path = ctx.origin + "" + path.replace("public", "");
  ctx.body = {
    data: path,
  };
});

module.exports = router;
