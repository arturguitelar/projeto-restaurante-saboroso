const express = require('express');
const router = express.Router();

const conn = require('./../inc/db');

/* GET home page. */
router.get('/', function(req, res, next) {

  conn.query("SELECT * FROM tb_menus ORDER BY title", (err, results) => {

    if (err) {
      console.error(err);
    } else {

      res.render('index', {
        title: 'Restaurante Saboroso!',
        menus: results
      });
    }
  });
});

module.exports = router;
