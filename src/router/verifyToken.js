const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    res.status(401).json({ error: "Missing token" });
  } else {
    try {
      token = token.split(" ")[1];
      // 解析 Token
      const username = jwt.verify(token, "kkkkkat_123");

      // 将解析后的数据存储到 req.user 中，以便后续处理程序使用
      req.username = username;

      // 调用 next() 继续执行下一个处理程序
      next();
    } catch (error) {
      res.status(401).json({ error: "Invalid token" });
    }
  }
};

module.exports = verifyToken;
