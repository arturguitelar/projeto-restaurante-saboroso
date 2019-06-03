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
     * @return Reservas ordenadas por data.
     */
    getReservations(page) {

        if (!page) page = 1;

        let pag = new Pagination(
            `SELECT SQL_CALC_FOUND_ROWS * FROM tb_reservations ORDER BY name LIMIT ?, ?`
        );

        return pag.getPage(page);
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
    }
};