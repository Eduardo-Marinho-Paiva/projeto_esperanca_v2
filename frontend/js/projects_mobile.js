
// Altera o Menu baseado no Tamanho  Janela
document.addEventListener("DOMContentLoaded", function () {
    const titulo = document.querySelector(".projects-intro-right-div");
    larguraTela = window.innerWidth;
    if(larguraTela <= 768){
        titulo.innerHTML = '<h3>Transformando Vidas com Esperança</h3>';
        console.log("O valor é " + titulo.textContent);
    }
});

    
