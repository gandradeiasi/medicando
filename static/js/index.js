$(document).ready(function () {
    //esconde frames
    $("#tela-medicamentos, #tela-farmacias").hide();

    //Click
    $(".btn-home").on("click", function () { toggleHome("home") });
    $(".btn-medicamentos").on("click", function () { toggleHome("medicamentos") });
    $(".btn-farmacias").on("click", function () { toggleHome("farmacias") });
    $(".editHorario").on("click", function () { $("#formRegistrarHorario input[name='idGaveta']").val($(this).val()) });
    $(".addRemedio").on("click", function () { $("#formNovoRemedio input[name='idGaveta']").val($(this).val()) });
    $(".btn-sair").on("click", function () { window.location.href = window.location.origin });

    //Consulta horarios
    consultaHorarios();

    //Form
    $("#formRegistrarHorario").submit(function (e) {
        e.preventDefault();

        $.ajax({
            "url": $(this).attr("action"),
            "method": "post",
            "data": $(this).serialize() + dataAuth(),
            dataType: "json",
            success: function (retorno) {
                $("#modalRegistrarHorario").modal("hide");
                if (retorno.msg == "ok") consultaHorarios();
            }
        });
    });

    $("#limparHorario").on("click", function (e) {
        e.preventDefault();

        $.ajax({
            "url": $("#formRegistrarHorario").attr("action"),
            "method": "post",
            "data": "idGaveta=" + $("#formRegistrarHorario input[name='idGaveta']").val().toString() + "&hora=NULL" + dataAuth(),
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
            "data": $(this).serialize() + dataAuth(),
            dataType: "json",
            success: function (retorno) {
                $("#modalNovoRemedio").modal("hide");
                if (retorno.msg == "ok") consultaRemedios($('#formNovoRemedio input[name="idGaveta"]').val());
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
            try {
                $("#horario1").html(JSON.parse(retorno[0]).hora);
                $("#editHorario1, #remedios1, #addRemedio1").val(JSON.parse(retorno[0]).id);
                consultaRemedios(JSON.parse(retorno[0]).id);
                console.log(retorno[0]).hora
            }
            catch (e) {  }

            try {
                $("#horario2").html(JSON.parse(retorno[1]).hora);
                $("#editHorario2, #remedios2, #addRemedio2").val(JSON.parse(retorno[1]).id);
                consultaRemedios(JSON.parse(retorno[1]).id);
            }
            catch (e) { }

            try {
                $("#horario3").html(JSON.parse(retorno[2]).hora);
                $("#editHorario3, #remedios3, #addRemedio3").val(JSON.parse(retorno[2]).id);
                consultaRemedios(JSON.parse(retorno[2]).id);
            }
            catch (e) { }
        }
    });
}

function consultaRemedios(idGaveta) {
    $.ajax({
        "url": window.location.origin + "/consultaRemedios?idGaveta=" + idGaveta,
        "dataType": "json",
        success: function (retorno) {
            let htmlToAdd = "";

            for (let remedio of retorno) {

                let json = JSON.parse(remedio);

                let iconeRemedio;

                switch (json.icone) {
                    case 0:
                        iconeRemedio = "<i class='fas fa-tablets align-self-center fa-2x mx-3'></i>";
                        break;
                    case 1:
                        iconeRemedio = "<i class='fas fa-capsules align-self-center fa-2x mx-3'></i>";
                        break;
                    case 2:
                    default:
                        iconeRemedio = "<i class='fas fa-pills align-self-center fa-2x mx-3'></i>";
                        break;
                }

                htmlToAdd += `
                    <div class="d-flex py-3 align-items-center">
                        ${iconeRemedio}
                        <span class="flex-fill">${json.nome}</span>
                        <i class="fas fa-times mx-3 cursor-pointer hover-red deletaRemedio" value="${json.id}"></i>
                    </div>
                    <div class="bg-gray h-2p w-100"></div>
                `;
            }

            $('.remedios').filter(function () { return this.value == idGaveta }).html(htmlToAdd);

            $(".deletaRemedio").prop("onclick", null).off("click");
            $(".deletaRemedio").on("click", function () {
                let deleteIcon = $(this);

                $.ajax({
                    "url": window.location.origin + "/deletaRemedio",
                    "method": "DELETE",
                    "data": "idRemedio=" + $(deleteIcon).attr("value") + dataAuth(),
                    dataType: "json",
                    success: function (retorno) {
                        $(deleteIcon).remove();
                        consultaHorarios();
                    }
                });
            });
        }
    });
}

function dataAuth() {
    return "&idAuth=" + getCookie("id") + "&key=" + getCookie("key")
}