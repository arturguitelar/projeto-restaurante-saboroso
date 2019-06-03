const conn = require('./db');

class Pagination {

    constructor(query, params = [], itensPerPage = 10) {

        this.query = query;
        this.params = params;
        this.itensPerPage = itensPerPage;
        this.currentPage = 1;
    }

    /**
     * @param {*} page Número da página a ser retornado.
     * @returns Uma Promise de uma página com os requisitos especificados no constructor.
     */
    getPage(page) {
        
        // Nota: no banco o índice das pages começa em 0.
        this.currentPage = page - 1;

        this.params.push(
            this.currentPage * this.itensPerPage,
            this.itensPerPage
        );

        return new Promise((resolve, reject) => {

            conn.query([this.query, 'SELECT FOUND_ROWS() AS FOUND_ROWS'].join(';'), this.params, (err, results) => {

                if (err) {
                    reject(err);
                } else {
                    
                    this.data = results[0];
                    this.total = results[1][0];
                    this.totalPages = Math.ceil(this.total / this.currentPage);
                    this.currentPage++;

                    resolve(this.data);
                }
            });
        });
    }

    getTotal() {
        return this.total;
    }

    getCurrentPage() {
        return this.currentPage;
    }

    getTotalPages() {
        return this.totalPages;
    }
}

module.exports = Pagination;
