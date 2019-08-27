$(document).ready(function() {
    //esconde frames
    $("#tela-login, #tela-registro, #tela-medicamentos, #tela-localizacao").hide();

    //Click
    $(".btn-home").on("click",function() {toggleHome("home")});
    $(".btn-medicamentos").on("click",function() {toggleHome("medicamentos")});
    $(".btn-localizacao").on("click",function(){toggleHome("localizacao")});
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

function toggleHome(tela) {
    $("#tela-home, #tela-medicamentos, #tela-localizacao").hide();

    switch(tela) {
        case "home": $("#tela-home").show(); break;
        case "medicamentos": $("#tela-medicamentos").show(); break;
        case "localizacao": $("#tela-localizacao").show(); break;
    }
}