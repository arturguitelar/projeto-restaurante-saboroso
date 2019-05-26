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
    }
}