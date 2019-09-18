$(document).ready(function() {
    //esconde frames
    $("#tela-medicamentos, #tela-farmacias").hide();

    //Click
    $(".btn-home").on("click",function() {toggleHome("home")});
    $(".btn-medicamentos").on("click",function() {toggleHome("medicamentos")});
    $(".btn-farmacias").on("click",function(){toggleHome("farmacias")});
});

//Funçoes globais
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}


function toggleHome(tela) {
    $("#tela-home, #tela-medicamentos, #tela-farmacias").hide();

    switch(tela) {
        case "home": $("#tela-home").show(); break;
        case "medicamentos": $("#tela-medicamentos").show(); break;
        case "farmacias": $("#tela-farmacias").show(); break;
    }
}
