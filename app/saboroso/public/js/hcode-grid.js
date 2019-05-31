/**
 * Abstração para os métodos de CRUD da área admin.
 */
class HcodeGrid {

    constructor(configs) {

        configs.listeners = Object.assign({
            afterUpdateClick: e => {
                $('#modal-update').modal('show');
            }
        }, configs.listeners);
        
        this.options = Object.assign({}, {        
            formCreate: '#modal-create form',
            formUpdate: '#modal-update form',
            btnUpdate: '.btn-update',
            btnDelete: '.btn-delete'
        }, configs);

        this.initForms();
        this.initButtons();
    }

    initForms() {

        this.formCreate = document.querySelector(this.options.formCreate);

        this.formCreate.save().then(json => {
            window.location.reload();
        }).catch(err => {
            console.error(err);
        });

        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formUpdate.save().then(json => {
            window.location.reload();
        }).catch(err => {
            console.error(err);
        });
    }

    initButtons() {

        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {

            btn.addEventListener('click', e => {
                
                let tr = e.path.find(el => {
                    return (el.tagName.toUpperCase() === 'TR');
                });

                let data = JSON.parse(tr.dataset.row);
                
                for (let name in data) {

                    let input = this.formUpdate.querySelector(`[name=${name}]`);

                    switch(name) {
                        case 'date':
                            if (input) input.value = moment(data[name]).format('YYYY-MM-DD');
                            break;
                        
                        default:
                            if (input) input.value = data[name];
                    }
                }

                this.fireEvents('afterUpdateClick', [e]);
            });
        });

        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {

            btn.addEventListener('click', e => {

                let tr = e.path.find(el => {
                    return (el.tagName.toUpperCase() === 'TR');
                });

                let data = JSON.parse(tr.dataset.row);

                // janela de confirmação
                if (confirm(eval('`' + this.options.deleteMsg + '`'))) {

                    fetch(eval('`' + this.options.deleteUrl + '`'), {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(json => {
                            window.location.reload();
                        });
                }
            });
        });
    }

    /**
     * @param {String} name Nome da função.
     * @param {Array} args Argumentos da função.
     */
    fireEvents(name, args) {
        if (this.options.listeners[name] && typeof this.options.listeners[name] === 'function')
            this.options.listeners[name].apply(this, args);
    }
}