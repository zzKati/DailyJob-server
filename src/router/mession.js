const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const verifyToken = require("./verifyToken");
const { nanoid } = require("nanoid");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "daily_job",
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("2:连接到数据库");
  }
});

// 获取任务列表接口
router.get("/message", verifyToken, (req, res) => {
  // console.log(1);
  const username = req.username.username;
  connection.query(
    "SELECT userdata FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "服务器出错" });
      } else {
        // console.log(result[0].userdata);
        res.send(result[0].userdata);
      }
    }
  );
});

// 添加任务接口
router.post("/addMessage", verifyToken, (req, res) => {
  const username = req.username.username;

  // 为数据添加 id 和进度
  let data = req.body;
  data = Object.assign(data, { id: nanoid(), progress: 0 });
  let newData;
  connection.query(
    "SELECT userdata FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "服务器出错" });
      } else {
        // 生成新数据
        if (result.length > 0) {
          newData = JSON.parse(result[0].userdata);
          newData.unshift(data);
          // console.log(newData);
          connection.query(
            "UPDATE users SET userdata = ? WHERE username = ?",
            [JSON.stringify(newData), username],
            (error, result) => {
              if (error) {
                res.status(500).json({ error: "服务器出错" });
              } else {
                if (result.affectedRows > 0) {
                  res.send("success");
                }
              }
            }
          );
        }
      }
    }
  );
});

// 修改步骤状态接口
router.post("/changeStatus", verifyToken, (req, res) => {
  // 获取用户名
  const username = req.username.username;
  // 获取任务索引和步骤索引
  const { mesIndex, step } = req.body;

  connection.query(
    "SELECT userdata FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "服务器出错" });
      } else {
        if (result.length > 0) {
          let data = JSON.parse(result[0].userdata);
          data[mesIndex].messionList[step].status = 1;
          connection.query(
            "UPDATE users SET userdata = ? WHERE username = ?",
            [JSON.stringify(data), username],
            (error, result) => {
              if (error) {
                res.status(500).json({ error: "服务器出错" });
              } else {
                if (result.affectedRows > 0) {
                  res.send("success");
                }
              }
            }
          );
        }
      }
    }
  );
});

// 删除任务接口
router.post("/deleteMessage", verifyToken, (req, res) => {
  const username = req.username.username;
  const { index } = req.body;

  connection.query(
    "SELECT userdata FROM users WHERE username = ?",
    [username],
    (error, result) => {
      if (error) {
        res.status(500).json({ error: "服务器出错" });
      } else {
        if (result.length > 0) {
          const data = JSON.parse(result[0].userdata);
          data.splice(index, 1);
          connection.query(
            "UPDATE users SET userdata = ? WHERE username = ?",
            [JSON.stringify(data), username],
            (error, result) => {
              if (error) {
                res.status(500).json({ error: "服务器出错" });
              } else {
                if (result.affectedRows > 0) {
                  res.send("success");
                }
              }
            }
          );
        }
      }
    }
  );
});
module.exports = router;
