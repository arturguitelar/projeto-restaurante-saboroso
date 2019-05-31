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
     * @returns Validação de um usuário.
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
    },

    /**
     * @return Usuários ordenados por nome.
     */
    getUsers() {

        return new Promise((resolve, reject) => {

            conn.query("SELECT * FROM tb_users ORDER BY name", (err, results) => {

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

            let query, params = [
                fields.name,
                fields.email
            ];

            if (fields.id > 0) {
                // neste caso, será um update
                params.push(fields.id);

                query = `
                    UPDATE tb_users
                    SET name = ?,
                        email = ?
                    WHERE id = ?
                `;
            } else {
                // neste caso, será um insert
                query = `
                    INSERT INTO tb_users (name, email, password)
                    VALUES (?, ?, ?)
                `;

                params.push(fields.password);
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
                DELETE FROM tb_users WHERE id = ?
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
     * @param {*} req Requisição http.
     * @returns Alteração de senha.
     */
    changePassword(req) {

        return new Promise((resolve, reject) => {

            if (!req.fields.password) {
                reject('Preencha a senha.');
            } else if (req.fields.password !== req.fields.passwordConfirm) {
                reject('Confirme a senha corretamente.');
            } else {

                conn.query(`
                    UPDATE tb_users
                    SET password = ?
                    WHERE id = ?
                `, [
                    req.fields.password,
                    req.fields.id
                ], (err, results) => {
                    if (err) {
                        reject(err.message);
                    } else {
                        resolve(results);
                    }
                });
            }
        });
    }
}