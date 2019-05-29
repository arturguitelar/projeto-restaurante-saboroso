const conn = require('./db');

module.exports = {

    /**
     * @returns Contagem de registros das tabelas tb_contacts, tb_menus, tb_reservations e tb_users.
     */
    dashboard() {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT 
                    (SELECT
                        COUNT(*)
                        FROM tb_contacts) AS nrcontacts,
                    (SELECT
                        COUNT(*)
                        FROM tb_menus) AS nrmenus,
                    (SELECT
                        COUNT(*)
                        FROM tb_reservations) AS nrreservations,
                    (SELECT
                        COUNT(*)
                        FROM tb_users) AS nrusers;
            `, (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    /**
     * @req Requisição.
     * @params Parâmetros.
     * @returns Novo objeto criado.
     */
    getParams(req, params) {

        return Object.assign({}, {
            menus: req.menus,
            user: req.session.user
        }, params);
    },

    /**
     * @req Requisição.
     * @returns Lista de menus.
     */
    getMenus(req) {

        let menus = [
            {
                text: 'Tela Inicial',
                href: '/admin/',
                icon: 'home',
                active: false
            },

            {
                text: 'Menu',
                href: '/admin/menus',
                icon: 'cutlery',
                active: false
            },

            {
                text: 'Reservas',
                href: '/admin/reservations',
                icon: 'calendar-check-o',
                active: false
            },

            {
                text: 'Contatos',
                href: '/admin/contacts',
                icon: 'comments',
                active: false
            },

            {
                text: 'Usuários',
                href: '/admin/users',
                icon: 'users',
                active: false
            },

            {
                text: 'E-mails',
                href: '/admin/emails',
                icon: 'envelope',
                active: false
            }
        ];

        menus.map(menu => {
            if (menu.href === `/admin${req.url}`) menu.active = true;
        });

        return menus;
    }
}