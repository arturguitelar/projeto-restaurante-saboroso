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

/** Contacts */
router.get('/contacts', function(req, res, next) {
  
  res.render('contacts', {
    title: 'Contatos - Restaurante Saboroso!',
    background: 'images/img_bg_3.jpg',
    h1: 'Diga um oi!'
  });
});

/** Menus */
router.get('/menus', function(req, res, next) {
  
  res.render('menus', {
    title: 'Menus - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'Saboreie nosso menu!'
  });
});

/** Reservations */
router.get('/reservations', function(req, res, next) {
  
  res.render('reservations', {
    title: 'Reservas - Restaurante Saboroso!',
    background: 'images/img_bg_2.jpg',
    h1: 'Reserve uma Mesa!'
  });
});

/** Services */
router.get('/services', function(req, res, next) {
  
  res.render('services', {
    title: 'Serviços - Restaurante Saboroso!',
    background: 'images/img_bg_1.jpg',
    h1: 'É um prazer poder servir!'
  });
});

module.exports = router;
