const conn = require('./db');

module.exports = {

    render(req, res, error, success) {

        res.render('contacts', {
            title: 'Contatos - Restaurante Saboroso!',
            background: 'images/img_bg_3.jpg',
            h1: 'Diga um oi!',
            body: req.body,
            error,
            success
        });
    },

    /**
     * @return Contatos ordenados por nome.
     */
    getContacts() {

        return new Promise((resolve, reject) => {

            conn.query("SELECT * FROM tb_contacts ORDER BY register DESC", (err, results) => {

                if (err) {
                    reject(err);
                } else {
            
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} fields Objeto com os campos a serem inseridos no banco.
     * @returns Promise com resultado do insert. 
     */
    save(fields) {

        return new Promise((resolve, reject) => {

            conn.query(`
                INSERT INTO tb_contacts (name, email, message)
                VALUES(?, ?, ?)
            `, [
                fields.name,
                fields.email,
                fields.message
            ], (err, results) => {

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
                DELETE FROM tb_contacts WHERE id = ?
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