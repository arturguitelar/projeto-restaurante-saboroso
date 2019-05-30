/**
 * Atribui um método save ao protótipo de todos os formulários do documento.
 * - Envia os dados do formulário via AJAX para o url especificado no action do form.
 * @returns Uma Promise com o JSON dos dados.
 */
HTMLFormElement.prototype.save = function() {

    return new Promise((resolve, reject) => {

        let form = this;
    
       form.addEventListener('submit', e => {
            e.preventDefault();
            // obtendo o formulário como um objeto
            const formData = new FormData(form);
        
            fetch(form.action, {
                method: form.method,
                body: formData
            })
                .then(response => response.json())
                .then(json => {
                    resolve(json);
                }).catch(err => {
                    reject(err);
                });
       });
    });
};