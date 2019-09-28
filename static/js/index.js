$(document).ready(function() {
    //esconde frames
    $("#tela-medicamentos, #tela-farmacias").hide();

    //Click
    $(".btn-home").on("click",function() {toggleHome("home")});
    $(".btn-medicamentos").on("click",function() {toggleHome("medicamentos")});
    $(".btn-farmacias").on("click",function(){toggleHome("farmacias")});
    $(".editHorario").on("click", function() {$("#formRegistrarRemedio input[name='idGaveta']").val($(this).val())});

    //Consulta horarios
    consultaHorarios();

    //Form
    $("#formRegistrarRemedio").submit(function(e){
        e.preventDefault();

        $.ajax({
            "url":$(this).attr("action"),
            "method":"post",
            "data": $(this).serialize(),
            dataType: "json",
            success: function(retorno) {
                if (retorno.msg == "ok") consultaHorarios();
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


function toggleHome(tela) {
    $("#tela-home, #tela-medicamentos, #tela-farmacias").hide();

    switch(tela) {
        case "home": $("#tela-home").show(); break;
        case "medicamentos": $("#tela-medicamentos").show(); break;
        case "farmacias": $("#tela-farmacias").show(); break;
    }
}

function consultaHorarios() {
    $.ajax({
        "url":window.location.origin + "/horarioGavetas?idUsuario=" + getCookie("id"),
        "dataType": "json",
        success: function(retorno) {
            $("#horario1").html(JSON.parse(retorno[0]).hora);
            $("#editHorario1").val(JSON.parse(retorno[0]).id);

            $("#horario2").html(JSON.parse(retorno[1]).hora);
            $("#editHorario2").val(JSON.parse(retorno[1]).id);

            $("#horario3").html(JSON.parse(retorno[2]).hora);
            $("#edithorario3").val(JSON.parse(retorno[2]).id);
        }
    });
}
