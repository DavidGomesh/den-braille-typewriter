const caracteres = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
const codigos    = ["0","01","03","034","04","013","0134","014","13","134","02","012","023","0234","024","0123","01234","0124","123","1234","025","0125","1345","0235","02345","0245"]
const idPontos   = ["ponto0", "ponto1", "ponto2", "ponto3", "ponto4", "ponto5"];

let teclasPressionadas = new Array();
let celulaAtual        = new Array();

function getCaractere(codigo = " "){
    return (caracteres[codigos.indexOf(codigo)]);
}

function getCodigo(caractere = " "){
    return (codigos[caractere.indexOf(caractere)]);
}

function verificarPonto(tecla){
    let ponto = -1;
    
    switch(tecla){
        case 70: ponto=0; break; //F = P1
        case 68: ponto=1; break; //D = P2
        case 83: ponto=2; break; //S = P3
        case 74: ponto=3; break; //J = P4
        case 75: ponto=4; break; //K = P5
        case 76: ponto=5; break; //L = P6
    }

    return ponto;
}

function marcarPonto(ponto){
    document.querySelector(`div#ponto${ponto}`).className = "ponto marcado";
}

function desmarcarPonto(ponto){
    document.querySelector(`div#ponto${ponto}`).className = "ponto desmarcado";
}

function desmarcarTodosPontos(){
    for(let i=0; i<6; i++){
        document.querySelector(`div#ponto${i}`).className = "ponto desmarcado";
        celulaAtual.pop();
    }
}

function addCaractereTexto(caractere=""){
    document.querySelector("div#texto").innerHTML += caractere;
}

function gerarCodigoAtual(){
    let codigo = "";

    for(let i=0; i<celulaAtual.length; i++){
        codigo += celulaAtual[i];
    }

    return codigo;
}

function pressionarTecla(tecla){
    console.log(tecla)

    switch(tecla){
        case 32:
            addCaractereTexto(" ");
        break;

        case 13:
            addCaractereTexto("<br>");
        break;

        case 8:
            
        break;
    }

    let ponto = verificarPonto(tecla);

    if(ponto === -1){
        return;
    }
    
    if(teclasPressionadas.indexOf(ponto) == -1){    

        teclasPressionadas.push(ponto);
        teclasPressionadas.sort();
    }

    if(celulaAtual.indexOf(ponto) == -1){

        celulaAtual.push(ponto);
        celulaAtual.sort();

        marcarPonto(ponto);
    }
}

function soltarTecla(tecla){
    let ponto = verificarPonto(tecla);

    if(ponto == -1){
        return;
    }
    
    teclasPressionadas.splice(teclasPressionadas.indexOf(ponto), 1)
    
    if(teclasPressionadas.length == 0){
        let codigoAtual = gerarCodigoAtual();
        addCaractereTexto(getCaractere(codigoAtual));
        desmarcarTodosPontos();
    }
}