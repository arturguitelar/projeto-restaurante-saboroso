const conn = require('./db');

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
     * @param {*} fields Objeto com os campos a serem inseridos no banco.
     * @returns Promise com resultado do insert. 
     */
    save(fields) {
        
        return new Promise((resolve, rejet) => {

            // invertendo a data recebida para o padrão do banco de dados mysql: ano/mês/dia
            let date = fields.date.split('/');
            fields.date = `${date[2]}-${date[1]}-${date[0]}`;

            conn.query(`
                INSERT INTO tb_reservations (name, email, people, date, time)
                VALUES (?, ?, ?, ?, ?)
            `, [
                fields.name,
                fields.email,
                fields.people,
                fields.date,
                fields.time
            ], (err, results) => {

                if (err) {
                    rejet(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
};