/**
 * Atribui um método save ao protótipo de todos os formulários do documento.
 * - Envia os dados do formulário via AJAX para o url especificado no action do form.
 * 
 * @param config Objeto com configuração de success e failure.
 * - ex.:
```
{ 
    success: () => { faça algo... }, 
    failure: err => { console.log(err); }
}
```
 */
HTMLFormElement.prototype.save = function(config) {

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
                
                if (json.error) {
                    if (typeof config.failure === 'function') config.failure(json.error);
                } else {
                    if (typeof config.success === 'function') config.success(json);
                }
            }).catch(err => {
                if (typeof config.failure === 'function') config.failure(err);
            });
    });
};