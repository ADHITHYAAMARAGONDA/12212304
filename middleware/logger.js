import fs from "fs";
import path from "path";

const logStream = fs.createWriteStream(path.join("logs.txt"), { flags: "a" });

const logger = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method} ${req.url} from ${
    req.ip
  }\n`;
  logStream.write(log);
  next();
};

export default logger;
