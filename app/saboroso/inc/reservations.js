const moment = require('moment');

const conn = require('./db');
const Pagination = require('./Pagination');

module.exports = {

    render(req, res, error, success) {

        res.render('reservations', {
            title: 'Reservas - Restaurante Saboroso!',
            background: 'images/img_bg_2.jpg',
            h1: 'Reserve uma Mesa!',
            body: req.body,
            error,
            success
        });
    },

    /**
     * @returns Contagem de registros nas tabelas:
     * - tb_contacts
     * - tb_menus
     * - tb_reservations
     * - tb_users
     */
    dashboard() {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT
                    (SELECT COUNT(*) FROM tb_contacts) AS nrcontacts,
                    (SELECT COUNT(*) FROM tb_menus) AS nrmenus,
                    (SELECT COUNT(*) FROM tb_reservations) AS nrreservations,
                    (SELECT COUNT(*) FROM tb_users) AS nrusers;
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
     * @param req Dados da requisição.
     * @returns Reservas ordenadas por data.
     */
    getReservations(req) {

        return new Promise((resolve, reject) => {

            let page = req.query.page;
            let dtstart = req.query.start;
            let dtend = req.query.end;

            if (!page) page = 1;
    
            let params = [];
    
            if (dtstart && dtend) params.push(dtstart, dtend);
    
            let pag = new Pagination(`
                SELECT SQL_CALC_FOUND_ROWS * 
                FROM tb_reservations 
                ${ (dtstart && dtend) ? 'WHERE date BETWEEN ? and ?' : ''}
                ORDER BY name LIMIT ?, ?
            `, params);
    
            pag.getPage(page).then(data => {

                resolve({ 
                    data, 
                    links: pag.getNavigation(req.query) 
                });
            });
        });
    },

    /**
     * @param {*} fields Objeto com os campos a serem inseridos no banco.
     * @returns Promise com resultado do insert. 
     */
    save(fields) {
        
        return new Promise((resolve, reject) => {

            if (fields.date.indexOf('/') > -1) {

                // invertendo a data recebida para o padrão do banco de dados mysql: ano/mês/dia
                let date = fields.date.split('/');
                fields.date = `${date[2]}-${date[1]}-${date[0]}`;
            }

            let query, params = [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ];

            if (parseInt(fields.id) > 0) {
                // neste caso, será um update
                query = `
                    UPDATE tb_reservations
                    SET
                        name = ?,
                        email = ?,
                        people = ?,
                        date = ?,
                        time = ?
                    WHERE id = ?
                `;
                
                params.push(fields.id);
            } else {
                // neste caso será um insert
                query = `
                    INSERT INTO tb_reservations (name, email, people, date, time)
                    VALUES (?, ?, ?, ?, ?)
                `;
            }

            conn.query(query, params, (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} id Id do registro que será deletado.
     * @returns Registro deletado.
     */
    delete(id) {
        
        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_reservations WHERE id = ?
            `, [ id ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    },
    
    /**
     * Nota: Utilizado para a geração de gráficos no index da área admin.
     * @param {*} req Requisição.
     * @returns Listagem de registros em um determinado período, agrupada por ano e mês
     * e ordenada por ano e mês de forma decrescente.
     */
    chart(req) {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT
                    CONCAT(YEAR(date), '-', MONTH(date)) AS date,
                    COUNT(*) AS total,
                    SUM(people) / COUNT(*) AS avg_people
                FROM tb_reservations
                WHERE
                    date BETWEEN ? AND ?
                GROUP BY YEAR(date), MONTH(date)
                ORDER BY YEAR(date) DESC, MONTH(date) DESC;
            `, [
                req.query.start,
                req.query.end
            ], (err, results) => {

                if (err) {
                    reject(err);
                } else {

                    let months = [];
                    let values = [];

                    results.forEach(row => {
                        months.push(moment(row.date).format('MMM YYYY'));
                        values.push(row.total);
                    });

                    resolve({
                        months,
                        values
                    });
                }
            });
        });
    }
};