const express = require("express");
const router = express.Router();
const multer = require("multer");
const uzip = require('unzip')
const fs = require('fs')

const fileStorage = multer.diskStorage({
  destination: "uploads/",
});

router.get("/test", async (req, res) => {
  res.status(200).json({ status: "success" });
});

const upload = multer({ storage: fileStorage });
router.post("/upload", upload.single("file"), async (req, res) => {
    console.log(req)
  const file = req.file;
  try {
    let name = file.originalname.split(".");
    let extName = name.pop();
    let filename = "uploads/" + name.join(".");
    try {
      fs.rename(file.path, filename, () => {
        if (extName === "zip") {
          fs.createReadStream(filename)
            .on("error", () => {})
            .on("close", () => {
              fs.unlinkSync(filename);
            })
            .pipe(uzip.Extract({ path: "upload/" + nstr }));
        }
      });
    } catch (e) {
      console.log(error);
    }
  } catch (e) {}
});
module.exports = router;
