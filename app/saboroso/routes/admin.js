const express = require('express');
const router = express.Router();

const users = require('./../inc/users');
const admin = require('../inc/admin');

/** Middleware para verificação de login */
router.use(function(req, res, next) {
    
    if (['/login'].indexOf(req.url) === -1 && !req.session.user) {
        res.redirect('/admin/login');
    } else {
        next();
    }
});

/** Middleware para menus de navegação do admin */
router.use(function(req, res, next) {
    
    req.menus = admin.getMenus(req);
    next();
});

/** Home */
router.get('/', function(req, res, next) {

    admin.dashboard().then(data => {

        res.render('admin/index', admin.getParams(req, {
            data
        }));
    }).catch(err => {
        console.error(err);
    });
});

/** Login */
router.post('/login', function(req, res, next) {

    if (!req.body.email) {
        users.render(req, res, 'Preencha o campo e-mail.');
    } else if (!req.body.password) {
        users.render(req, res, 'Preencha o campo senha.');
    } else {
        
        users.login(req.body.email, req.body.password).then(user => {

            req.session.user = user;

            res.redirect('/admin');
        }).catch(err => {
            users.render(req, res, err.message || err);
        });
    }
});

router.get('/login', function(req, res, next) {
    users.render(req, res, null);
});

/** Logout */
router.get('/logout', function(req, res, next) {

    delete req.session.user;

    res.redirect('/admin/login');
});

/** Contacts */
router.get('/contacts', function(req, res, next) {

    res.render('admin/contacts', admin.getParams(req));
});

/** Emails */
router.get('/emails', function(req, res, next) {

    res.render('admin/emails', admin.getParams(req));
});

/** Menus */
router.get('/menus', function(req, res, next) {

    res.render('admin/menus', admin.getParams(req));
});

/** Reservations */
router.get('/reservations', function(req, res, next) {

    res.render('admin/reservations', admin.getParams(req, {
        date: {}
    }));
});

/** Users */
router.get('/users', function(req, res, next) {

    res.render('admin/users', admin.getParams(req));
});

module.exports = router;