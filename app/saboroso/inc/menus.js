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

            conn.query(`
                INSERT INTO tb_menus (title, description, price, photo)
                VALUES (?, ?, ?, ?)
            `,[
                fields.title,
                fields.description,
                fields.price,
                fields.photo
            ], (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }
}