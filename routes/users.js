var express = require("express");
var router = express.Router();
require('dotenv').config();

// 登入頁面
router.get("/", function (req, res, next) {
  res.render("users/index", { title: 'Login'});
});

module.exports = router;
