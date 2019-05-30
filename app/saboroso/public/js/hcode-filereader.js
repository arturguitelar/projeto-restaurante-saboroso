/**
 * Faz o preview de uma imagem que foi carregada por input "file"
 * especificado para um elemento img especificado.
 */
class HcodeFilereader {

    /**
     * @param { String } inputElement Id do input file. 
     * @param { String } imgElement  Id do elemento img onde será mostrada a imagem.
     */
    constructor(inputElement, imgElement) {
        
        this.inputEl = inputElement;
        this.imgEl = imgElement;

        this.initInputEvent();
    }

    initInputEvent() {
        
        document.querySelector(this.inputEl).addEventListener('change', e => {
            
            this.reader(e.target.files[0]).then(result => {

                document.querySelector(this.imgEl).src = result;
            }).catch(err => {
                console.error(err);
            });
        });
    }

    reader(file) {

        return new Promise((resolve, reject) => {

            let reader = new FileReader();

            reader.onload = function() {
                resolve(reader.result);
            }

            reader.onerror = function() {
                reject('Não foi possível ler a imagem.');
            }

            reader.readAsDataURL(file);
        });
    }
}