$(document).ready(function() {
    //esconde frames de login/registro
    $("#tela-login, #tela-registro").hide();
});

//Funçoes globais

function toggleLogin(tela) {
    $("#tela-inicio, #tela-login, #tela-registro").hide();

    switch(tela) {
        case "inicio": $("#tela-inicio").show(); break;
        case "login": $("#tela-login").show(); break;
        case "registro": $("#tela-registro").show(); break;
    }
}