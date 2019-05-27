const conn = require('./db');

module.exports = {

    render(req, res, error) {

        res.render('admin/login', {
            body: req.body,
            error
        });
    },

    /**
     * @param {String} email Email do usuário.
     * @param {String} password Senha do usuário.
     * @returns Usuário validado.
     */
    login(email, password) {

        return new Promise((resolve, reject) => {

            conn.query(`
                SELECT * FROM tb_users WHERE email = ?
            `, [
                email
            ], (err, results) => {

                if (err) {
                    reject(err);
                } else {

                    // Nota: É preciso verificar se existe algum resultado em results
                    if (!results.length > 0) {
                        reject('Usuário ou senha incorretos.');
                    } else {

                        let row = results[0];

                        // verifica a senha
                        if (row.password !== password) {
                            reject('Usuário ou senha incorretos.');
                        } else {
                            resolve(row);
                        }
                    }
                }
            });
        });
    }
}