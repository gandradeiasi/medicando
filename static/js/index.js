$(document).ready(function () {
    //esconde frames
    $("#tela-medicamentos, #tela-farmacias").hide();

    //Click
    $(".btn-home").on("click", function () { toggleHome("home") });
    $(".btn-medicamentos").on("click", function () { toggleHome("medicamentos") });
    $(".btn-farmacias").on("click", function () { toggleHome("farmacias") });
    $(".editHorario").on("click", function () { $("#formRegistrarHorario input[name='idGaveta']").val($(this).val()) });

    //Consulta horarios
    consultaHorarios();
    consultaRemedios();

    //Form
    $("#formRegistrarHorario").submit(function (e) {
        e.preventDefault();

        $.ajax({
            "url": $(this).attr("action"),
            "method": "post",
            "data": $(this).serialize(),
            dataType: "json",
            success: function (retorno) {
                $("#modalRegistrarHorario").modal("hide");
                if (retorno.msg == "ok") consultaHorarios();
            }
        });
    });

    $("#formNovoRemedio").submit(function (e) {
        e.preventDefault();

        $.ajax({
            "url": $(this).attr("action"),
            "method": "post",
            "data": $(this).serialize(),
            dataType: "json",
            success: function (retorno) {
                $("#modalNovoRemedio").modal("hide");
                if (retorno.msg == "ok") consultaRemedios();
            }
        });
    });
});

//Funçoes globais
function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function toggleHome(tela) {
    $("#tela-home, #tela-medicamentos, #tela-farmacias").hide();

    switch (tela) {
        case "home": $("#tela-home").show(); break;
        case "medicamentos": $("#tela-medicamentos").show(); break;
        case "farmacias": $("#tela-farmacias").show(); break;
    }
}

function consultaHorarios() {
    $.ajax({
        "url": window.location.origin + "/horarioGavetas?idUsuario=" + getCookie("id"),
        "dataType": "json",
        success: function (retorno) {
            $("#horario1").html(JSON.parse(retorno[0]).hora);
            $("#editHorario1, #remedios1, addRemedio1").val(JSON.parse(retorno[0]).id);

            $("#horario2").html(JSON.parse(retorno[1]).hora);
            $("#editHorario2, #remedios2, addRemedio2").val(JSON.parse(retorno[1]).id);

            $("#horario3").html(JSON.parse(retorno[2]).hora);
            $("#editHorario3, #remedios2, addRemedio2").val(JSON.parse(retorno[2]).id);
        }
    });
}

function consultaRemedios(divId) {
    $.ajax({
        "url": window.location.origin + "/consultaRemedios?idGaveta=" + $(divId).val(),
        "dataType": "json",
        success: function (retorno) {
            let htmlToAdd = "";

            for (let remedio in retorno) {

                let json = JSON.parse(remedio);

                let iconeRemedio;

                switch (json.icone) {
                    case "0":
                        iconeRemedio = "<i class='fas fa-tablets align-self-center fa-2x mx-3'></i>";
                        break;
                    case "1":
                        iconeRemedio = "<i class='fas fa-capsules align-self-center fa-2x mx-3'></i>";
                        break;
                    case "2":
                    default:
                        iconeRemedio = "<i class='fas fa-pills align-self-center fa-2x mx-3'></i>";
                        break;
                }

                htmlToAdd += `
                    <div class="d-flex py-3">
                        ${iconeRemedio}
                        <span class="align-self-center">${json.nome}</span>
                        <i class="fas fa-times" value="${json.id}"></i>
                    </div>
                    <div class="bg-gray h-2p w-100"></div>
                `;
            }

            $(divId).html(htmlToAdd);
        }
    });
}