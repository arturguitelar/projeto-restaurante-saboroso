const express = require('express');
const router = express.Router();
const moment = require('moment');

const users = require('./../inc/users');
const admin = require('./../inc/admin');
const menus = require('./../inc/menus');
const reservations = require('./../inc/reservations');
const contacts = require('./../inc/contacts');
const emails = require('./../inc/emails');

moment.locale('pt-BR');

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

        res.render('admin/index', admin.getParams(req, { data }));
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

    contacts.getContacts().then(data => {

        res.render('admin/contacts', admin.getParams(req, { data }));
    })
});

router.delete('/contacts/:id', function(req, res, next) {

    contacts.delete(req.params.id).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

/** Emails */
router.get('/emails', function(req, res, next) {

    emails.getEmails().then(data => {

        res.render('admin/emails', admin.getParams(req, { data }));
    });
});

router.delete('/emails/:id', function(req, res, next) {

    emails.delete(req.params.id).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

/** Menus */
router.get('/menus', function(req, res, next) {

    menus.getMenus().then(data => {

        res.render('admin/menus', admin.getParams(req, { data }));
    });

});

router.post('/menus', function(req, res, next) {
    
    menus.save(req.fields, req.files).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

router.delete('/menus/:id', function(req, res, next) {

    menus.delete(req.params.id).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

/** Reservations */
router.get('/reservations', function(req, res, next) {

    let start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
    let end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

    reservations.getReservations(req).then(pag => {

        res.render('admin/reservations', admin.getParams(req, {
            date: { start, end },
            data: pag.data,
            moment,
            links: pag.links
        }));
    });
});

router.get('/reservations/chart', function(req, res, next) {

    req.query.start = (req.query.start) ? req.query.start : moment().subtract(1, 'year').format('YYYY-MM-DD');
    req.query.end = (req.query.end) ? req.query.end : moment().format('YYYY-MM-DD');

    reservations.chart(req).then(dataChart => {
        res.send(dataChart);
    });
});

router.post('/reservations', function(req, res, next) {

    reservations.save(req.fields, req.files).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

router.delete('/reservations/:id', function(req, res, next) {

    reservations.delete(req.params.id).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

/** Users */
router.get('/users', function(req, res, next) {

    users.getUsers().then(data => {

        res.render('admin/users', admin.getParams(req, { data }));
    });
});

router.post('/users', function(req, res, next) {
    
    users.save(req.fields).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

// user-password
router.post('/users/password-change', function(req, res, next) {

    users.changePassword(req).then(results => {
        res.send(results);
    }).catch(err => {
        res.send({ error: err });
    });
});

router.delete('/users/:id', function(req, res, next) {

    users.delete(req.params.id).then(results => {
        res.send(results);
    }).catch(err => {
        res.send(err);
    });
});

module.exports = router;