const express = require('express');
const router = express.Router();

const conn = require('./../inc/db');
/* GET users listing. */
router.get('/', function(req, res, next) {
  conn.query("SELECT * FROM tb_users ORDER BY name", (err, results) => {

    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
});

module.exports = router;