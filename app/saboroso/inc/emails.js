const conn = require('./db');

module.exports = {

    /**
     * @return Emails ordenados por nome.
     */
    getEmails() {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT * FROM tb_emails ORDER BY email
            `, (err, results) => {

                if (err) {
                    reject(err);
                } else {
            
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} req Requisição com os campos a serem inseridos no banco.
     * @returns Promise com resultado do insert. 
     */
    save(req) {

        return new Promise((resolve, reject) => {

            if (!req.fields.email) {

                reject({ error: 'Para se inscrever é preciso preencher o e-mail.' });
            } else {
                                
                conn.query(`
                    INSERT INTO tb_emails (email) VALUES (?)
                `, [
                    req.fields.email
                ], (err, results) => {
    
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(results);
                    }
                });
            }

        });
    },

    /**
     * @param {*} id Id do registro que será deletado.
     * @returns Registro deletado.
     */
    delete(id) {
        
        return new Promise((resolve, reject) => {

            conn.query(`
                DELETE FROM tb_emails WHERE id = ?
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