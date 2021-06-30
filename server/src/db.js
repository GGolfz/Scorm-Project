const { Pool } = require("pg");
const pool = new Pool({
  user: "scorm_user",
  password: "dADKHgj86jQoRoff7xwC4TZ",
  host: "127.0.0.1",
  port: 5432,
  database: "scorm_db",
});

pool.on("connect", (err, client) => {
  console.log(`Connecting to DB "scorm_db"`);
});

pool.on("error", (err, client) => {
  console.log(`Connection failed ${err}`);
});

pool.query("SELECT NOW()", (err, res) => {
  if (err) {
    console.error(`${err}`);
  } else {
    console.log(`at: ${res.rows[0].now}`);
  }
});

module.exports = pool;
