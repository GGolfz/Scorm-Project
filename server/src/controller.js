const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const uzip = require("unzipper");
const path = require("path");

const fileStorage = multer.diskStorage({
  destination: "src/uploads/",
  filename: (req, file, cb) => cb(null, file.originalname),
});

router.get("/test", async (req, res) => {
  res.status(200).json({ status: "success" });
});

const upload = multer({ storage: fileStorage });
router.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  let name = file.originalname.split(".");
  name.pop();
  let filePath = "src/uploads/" + name.join(".");
  let zipPath = path.join("src/uploads/"+file.originalname)
  await fs.createReadStream(zipPath).pipe(uzip.Extract({path:filePath}))
  await fs.unlinkSync(zipPath)
  res.status(201).json({success:true})

});
module.exports = router;
