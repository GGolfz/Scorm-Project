const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const uzip = require("unzipper");
const path = require("path");
const pool = require("./db");

const fileStorage = multer.diskStorage({
  destination: "src/uploads/",
  filename: (req, file, cb) => cb(null, file.originalname),
});

router.get("/test", async (req, res) => {
  return res.status(200).json({ status: "success" });
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
  await pool.query("INSERT INTO courses(name) VALUES ($1)",[name.join(".")])
  return res.status(201).json({success:true})
});
router.get("/course", async (req,res) => {
  const courses = await pool.query("SELECT * FROM courses");
  return res.send(courses.rows)
})
router.get("/course/:id", async (req,res) => {
  const id = req.params.id
  const course = await pool.query("SELECT * FROM courses WHERE course_id = $1",[id])
  if(course.rowCount > 0) return res.send(course.rows[0])
  return res.status(404)
})
router.get("/progress/:id" , async (req,res) => {
  const userId = 1;
  const courseId = req.params.id
  let exist = await pool.query("SELECT * FROM progress WHERE course_id = $1 AND user_id = $2",[courseId,userId])
  if(exist.rowCount > 0) {
    let data = exist.rows[0]
    return res.send({location:data.location ?? 0,completion_status:data.status == 1})
  } else {
    await pool.query("INSERT INTO progress(course_id,user_id) VALUES($1,$2)",[courseId,userId])
    return res.send({location:0,completion_status:false})
  }

})
router.post("/progress", async (req,res) => {
  const {courseId,userId,location,status,score} = req.body;
  let exist = await pool.query("SELECT * FROM progress WHERE course_id = $1 AND user_id = $2",[courseId,userId])
  if(exist.rowCount > 0){
    if(exist.rows[0].status == 1) {
      await pool.query("UPDATE progress SET location = $1 WHERE course_id = $2 AND user_id = $3",[location,courseId,userId])
    } else {
      await pool.query("UPDATE progress SET location = $1,status = $2, score = $3 WHERE course_id = $4 AND user_id = $5",[location,status,score,courseId,userId])
    }
  } else {
    await pool.query("INSERT INTO progress(course_id,user_id,location,status,score) VALUES($1,$2,$3,$4,$5)",[courseId,userId,location,status,score])
  }
  return res.send({success:true})
})
module.exports = router;
