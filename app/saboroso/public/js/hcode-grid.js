/**
 * Abstração para os métodos de CRUD da área admin.
 */
class HcodeGrid {

    constructor(configs) {

        configs.listeners = Object.assign({
            afterUpdateClick: e => {
                $('#modal-update').modal('show');
            },
            afterDeleteClick: e => {
                window.location.reload();
            },
            afterFormCreate: e => {
                window.location.reload();
            },
            afterFormUpdate: e => {
                window.location.reload();
            },
            afterFormCreateError: e => {
                alert('Não foi possível enviar o formulário.');
            },
            afterFormUpdateError: e => {
                alert('Não foi possível enviar o formulário.');
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
            this.fireEvent('afterFormCreate');
        }).catch(err => {
            this.fireEvent('afterFormCreateError');
        });

        this.formUpdate = document.querySelector(this.options.formUpdate);

        this.formUpdate.save().then(json => {
            this.fireEvent('afterFormUpdate');
        }).catch(err => {
            this.fireEvent('afterFormUpdateError');
        });
    }

    initButtons() {

        // btns update
        [...document.querySelectorAll(this.options.btnUpdate)].forEach(btn => {

            btn.addEventListener('click', e => {

                this.fireEvent('beforeUpdateClick', [e]);
                
                let data = this.getTrData(e);
                
                for (let name in data) {

                    this.options.onUpdateLoad(this.formUpdate, name, data);
                }

                this.fireEvent('afterUpdateClick', [e]);
            });
        });

        // btns delete
        [...document.querySelectorAll(this.options.btnDelete)].forEach(btn => {

            btn.addEventListener('click', e => {

                this.fireEvent('beforeDeleteClick');

                let data = this.getTrData(e);

                // janela de confirmação
                if (confirm(eval('`' + this.options.deleteMsg + '`'))) {

                    fetch(eval('`' + this.options.deleteUrl + '`'), {
                        method: 'DELETE'
                    })
                        .then(response => response.json())
                        .then(json => {
                            this.fireEvent('afterDeleteClick');
                        });
                }
            });
        });
    }

    getTrData(e) {

        let tr = e.path.find(el => {
            return (el.tagName.toUpperCase() === 'TR');
        });

        return JSON.parse(tr.dataset.row);
    }

    /**
     * @param {String} name Nome da função.
     * @param {Array} args Argumentos da função.
     */
    fireEvent(name, args) {
        if (this.options.listeners[name] && typeof this.options.listeners[name] === 'function')
            this.options.listeners[name].apply(this, args);
    }
}