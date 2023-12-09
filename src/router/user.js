const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const mysql = require("mysql");
const verifyToken = require("./verifyToken");

//连接数据库
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "daily_job",
});

//验证数据库是否连接
connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("1:连接到数据库");
  }
});

router.get("/", (req, res) => {
  res.send("1");
});

// 注册接口
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  // 判断 信息是否齐全
  if (!username || !password) {
    res.status(400).json({ error: "Lack of necessary information" });
  } else {
    // 查询用户名是否存在
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (error, result) => {
        if (error) {
          console.log(error);
          res.status(500).json({ error: "服务器出错,注册失败" });
        } else if (result.length > 0) {
          res.status(400).json({ error: "用户名已存在" });
        } else {
          // 加密密码并存储
          const hashPassword = bcrypt.hashSync(password, 10);
          connection.query(
            "INSERT INTO users SET ?",
            { username, password: hashPassword, userdata: JSON.stringify([]) },
            (error, result) => {
              if (error) {
                console.log(error);
                res.status(500).json({ error: "服务器出错,注册失败" });
              } else {
                const token = jwt.sign({ username }, "kkkkkat_123", {
                  expiresIn: "7d",
                });
                res.send({
                  token,
                  message: "register success",
                  username,
                });
              }
            }
          );
        }
      }
    );
  }
});

// 登录接口
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // 检查参数是否齐全
  if (!username || !password) {
    res.status(400).json({ error: "Lack of necessary information" });
  } else {
    // 根据用户名查询数据库
    connection.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
      (err, result) => {
        if (err) {
          res.status(500).json({ error: "服务器出错,登录失败" });
        } else {
          if (result.length > 0) {
            // 用户名存在 判断密码是否正确
            const hashPassword = result[0].password;
            if (bcrypt.compareSync(password, hashPassword)) {
              // 密码正确 生成token
              const token = jwt.sign({ username }, "kkkkkat_123", {
                expiresIn: "7d",
              });
              res.send({
                token,
                message: "login success",
                username,
              });
            } else {
              // 用户名存在 但密码错误
              res.status(401).json({ error: "用户名或密码错误" });
            }
          } else {
            // 用户名不存在
            res.status(401).json({ error: "用户名或密码错误" });
          }
        }
      }
    );
  }
});

router.post("/autologin", verifyToken, (req, res) => {
  res.send({
    message: "success",
    username: req.username.username,
  });
});

module.exports = router;
