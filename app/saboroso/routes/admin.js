const express = require('express');
const router = express.Router();

/** Home */
router.get('/', function(req, res, next) {

    res.render('admin/index');
});

/** Login */
router.get('/login', function(req, res, next) {

    if (!req.session.views) req.session.views = 0;

    console.log(req.session.views++);

    res.render('admin/login');
});

/** Contacts */
router.get('/contacts', function(req, res, next) {

    res.render('admin/contacts');
});

/** Emails */
router.get('/emails', function(req, res, next) {

    res.render('admin/emails');
});

/** Menus */
router.get('/menus', function(req, res, next) {

    res.render('admin/menus');
});

/** Reservations */
router.get('/reservations', function(req, res, next) {

    res.render('admin/reservations', {
        date: {}
    });
});

/** Users */
router.get('/users', function(req, res, next) {

    res.render('admin/users');
});

module.exports = router;