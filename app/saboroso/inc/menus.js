const path = require('path');
const conn = require('./db');

module.exports = {

    /**
     * @return Menus ordenados por título.
     */
    getMenus() {

        return new Promise((resolve, reject) => {

            conn.query("SELECT * FROM tb_menus ORDER BY title", (err, results) => {

                if (err) {
                    reject(err);
                } else {
            
                    resolve(results);
                }
            });
        });
    },

    /**
     * @param {*} fields Campos do fomulário.
     * @param {*} files Aquivos enviados.
     * @returns Registro salvo no banco de dados.
     */
    save(fields, files) {

        return new Promise((resolve, reject) => {

            fields.photo = `images/${path.parse(files.photo.path).base}`;

            let query, queryPhoto = '', params = [
                fields.title,
                fields.description,
                fields.price
            ];

            if (files.photo.name) {
                
                queryPhoto = ', photo = ?';

                params.push(fields.photo);
            }

            if (fields.id > 0) {
                // neste caso, será um update

                params.push(fields.id);

                query = `
                    UPDATE tb_menus
                    SET title = ?,
                        description = ?,
                        price = ?
                        ${queryPhoto}
                    WHERE id = ?
                `;
            } else {
                // neste caso, será um insert

                if (!files.photo.name) {
                    reject('É necessário enviar uma foto.');
                }

                query = `
                    INSERT INTO tb_menus (title, description, price, photo)
                    VALUES (?, ?, ?, ?)
                `;
            }

            conn.query(query , params, (err, results) => {

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
                DELETE FROM tb_menus WHERE id = ?
            `, [ id ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}