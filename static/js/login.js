$(document).ready(function() {
    //limpa cookies
    setCookie("id","",7);
    setCookie("key","",7);

    //esconde frames
    $("#tela-login, #tela-registro").hide();

    //Form
    $("#formRegistrar").submit(function(e){
        e.preventDefault();

        $.ajax({
            "url":$(this).attr("action"),
            "method":"post",
            "data": $(this).serialize(),
            dataType: "json",
            success: function(retorno) {
                window.location.href = window.location.href;
            }
        });
    });

    $("#formLogin").submit(function(e){
        e.preventDefault();

        $.ajax({
            "url":$(this).attr("action"),
            "method":"post",
            "data": $(this).serialize(),
            dataType: "json",
            success: function(retorno) {
                if (retorno.msg != "erro"){
                    setCookie("id",retorno.id,1);
                    setCookie("key",retorno.key,1);
                    window.location.href = "/home";
                }
                else {
                    alert("Erro ao logar")
                }
            }
        });
    });
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

function toggleLogin(tela) {
    $("#tela-inicio, #tela-login, #tela-registro").hide();

    switch(tela) {
        case "inicio": $("#tela-inicio").show(); break;
        case "login": $("#tela-login").show(); break;
        case "registro": $("#tela-registro").show(); break;
    }
}
