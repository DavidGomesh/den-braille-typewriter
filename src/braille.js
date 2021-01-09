class Celula{
    constructor(p1=false, p2=false, p3=false, p4=false, p5=false, p6=false){
        this.pontos = new Array()

        this.pontos[0] = p1 ? "1":"";
        this.pontos[1] = p2 ? "2":"";
        this.pontos[2] = p3 ? "3":"";
        this.pontos[3] = p4 ? "4":"";
        this.pontos[4] = p5 ? "5":"";
        this.pontos[5] = p6 ? "6":"";
    }

    setLetra(letra=""){
        let codigo = this.getCodigoLetra(letra);

        this.pontos.fill("", 0, 6);

        for(let i=0; i<codigo.length; i++){
            this.pontos[Number(codigo[i])-1] = codigo[i];
        }
    }

    getCodigoLetra(letra=""){
        let codigo = "";
        switch (letra) {
            case "a": codigo = "1"; break;
            case "b": codigo = "12"; break;
            case "c": codigo = "14"; break;
            case "d": codigo = "145"; break;
            case "e": codigo = "15"; break;
            case "f": codigo = "124"; break;
            case "g": codigo = "1245"; break;
            case "h": codigo = "125"; break;
            case "i": codigo = "24"; break;
            case "j": codigo = "245"; break;
            case "k": codigo = "13"; break;
            case "l": codigo = "123"; break;
            case "m": codigo = "134"; break;
            case "n": codigo = "1345"; break;
            case "o": codigo = "135"; break;
            case "p": codigo = "1234"; break;
            case "q": codigo = "12345"; break;
            case "r": codigo = "1235"; break;
            case "s": codigo = "234"; break;
            case "t": codigo = "2345"; break;
            case "u": codigo = "136"; break;
            case "v": codigo = "1236"; break;
            case "w": codigo = "2456"; break;
            case "x": codigo = "1346"; break;
            case "y": codigo = "13456"; break;
            case "z": codigo = "1356"; break;
            default: codigo = " "; break;
        }
        return codigo;
    }

    getCodigoCaractere(){
        let codigo = "";
        for(let i=0; i<6; i++){
            codigo += this.pontos[i];
        }
        return codigo;
    }

    getCaractere(){
        let caractere = "";

        switch (this.getCodigoCaractere()) {
            case "1": caractere = "a"; break;
            case "12": caractere = "b"; break;
            case "14": caractere = "c"; break;
            case "145": caractere = "d"; break;
            case "15": caractere = "e"; break;
            case "124": caractere = "f"; break;
            case "1245": caractere = "g"; break;
            case "125": caractere = "h"; break;
            case "24": caractere = "i"; break;
            case "245": caractere = "j"; break;
            case "13": caractere = "k"; break;
            case "123": caractere = "l"; break;
            case "134": caractere = "m"; break;
            case "1345": caractere = "n"; break;
            case "135": caractere = "o"; break;
            case "1234": caractere = "p"; break;
            case "12345": caractere = "q"; break;
            case "1235": caractere = "r"; break;
            case "234": caractere = "s"; break;
            case "2345": caractere = "t"; break;
            case "136": caractere = "u"; break;
            case "1236": caractere = "v"; break;
            case "2456": caractere = "w"; break;
            case "1346": caractere = "x"; break;
            case "13456": caractere = "y"; break;
            case "1356": caractere = "z"; break;
            default: caractere = " "; break;
        }

        return caractere;
    }
}

function clicar(pontoClicado){
    let ponto = document.querySelector(`div#${pontoClicado}`);
    ponto.className = ponto.className == "ponto desmarcado" ? "ponto marcado" : "ponto desmarcado";
}

function addCaractere(caractere){
    document.querySelector("div#transcricao").innerHTML += caractere;
}

function removerCaractere(){
    let transcricao = document.querySelector("div#transcricao");
    transcricao.innerHTML = transcricao.innerText.slice(0, -1);
}

function confirmarSinal(key){
    switch (key) {
        case 97:       
            addCaractere(new Celula(
                document.querySelector("div#p1").className == "ponto marcado",
                document.querySelector("div#p2").className == "ponto marcado",
                document.querySelector("div#p3").className == "ponto marcado",
                document.querySelector("div#p4").className == "ponto marcado",
                document.querySelector("div#p5").className == "ponto marcado",
                document.querySelector("div#p6").className == "ponto marcado").getCaractere()
            );
        break;

        case 32:
        case 115:
            addCaractere(" ");
        break;

        case 100:
            removerCaractere();
        break;
    }
}

let letras = "qwertyuiopasdfghjklzxcvbnm"
let teclas = new Array()

for(let i=0; i<26; i++){
    
    let cel = new Celula()
    cel.setLetra(letras[i])

    teclas.push(cel)
}

function gerarTeclado(){
    let teclado = document.querySelector("div#teclado");

    let linha = `<div class="linha">`;
    let tecla = `<div class="tecla clicavel">`;
    let end_div = `</div>`

    let html = ``;

    let letra=0;

    let ordem = [1,4,2,5,3,6];

    for(let lin=0; lin<3; lin++){
        html += linha;

        for(let tec=0; tec < (lin==1?9:lin==2?7:10); tec++){
            html += `<div class="tecla clicavel" onclick="clique('${teclas[letra].getCaractere()}')">`;
            for(let p_tec=0; p_tec<6; p_tec++){
                html += `<div class='p-tecla ponto ${(teclas[letra].pontos[ordem[p_tec]-1] != "" ? "marcado":"desmarcado") }'></div>`
            }

            letra++

            html += end_div;
        }

        html += end_div;
    }

    teclado.innerHTML = html;
}

// Element.addEventListener('keydown', )

// function teclar(){
//     alert("teclou!")
// }

// console.log(teclas[0].pontos[0])
gerarTeclado();

function clique(letra){
    addCaractere(letra);
}

