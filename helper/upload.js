const multer = require("multer");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  region: "ap-south-1",
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "kandoi",
    acl: "public-read",
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + "-" + file.originalname);
    },
  }),
});
module.exports = upload;

