from flask import Flask, request, make_response, render_template, jsonify
import mysql.connector
import json
import datetime
import hmac
import binascii

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

chaveAuth = "#$seC"
cryptoKey = "T4rcd"

# VIEW


@app.route("/")
def telaLogin():
    return render_template("login.html")


@app.route("/home")
def telaHome():
    return render_template("index.html")


# POST


@app.route("/novoRemedio", methods=["POST"])
def novoRemedio():
    checkAuth()

    idGaveta = request.form["idGaveta"]
    nome = request.form["nome"]
    icone = request.form["icone"]

    sqlQuery(
        "INSERT into remedio SET nome = '%s', icone = '%s', id_gaveta = '%s'"
        % (nome, icone, idGaveta)
    )

    return jsonify({"msg": "ok"})


@app.route("/programarHorario", methods=["POST"])
def programarHorario():
    checkAuth()

    idGaveta = request.form["idGaveta"]
    hora = request.form["hora"]

    sqlQuery("UPDATE gaveta SET hora = '%s' WHERE id = '%s'" % (hora, idGaveta))

    return jsonify({"msg": "ok"})


@app.route("/registrar", methods=["POST"])
def registrar():
    email = request.form["email"]
    senha = request.form["senha"]

    sqlQuery(
        "INSERT into usuario SET email = '%s', senha = '%s'" % (email, crypto(senha))
    )

    return jsonify({"msg": "ok"})


@app.route("/login", methods=["POST"])
def login():
    email = request.form["email"]
    senha = request.form["senha"]

    for retorno in select(
        "SELECT id FROM usuario WHERE email = '%s' AND senha = '%s'"
        % (email, crypto(senha))
    ):
        return jsonify(
            {
                "id": retorno[0],
                "key": crypto(
                    chaveAuth + crypto(senha) + str(retorno[0]) + str(datetime.date.today())
                ),
            }
        )

    return jsonify({"msg": "erro"})


# GET


@app.route("/horarioGaveta")
def horarioGaveta():
    idGaveta = request.args.get("idGaveta")

    return "{%s}" % (
        timeDeltaToHour(select("SELECT hora FROM gaveta WHERE id = " + idGaveta)[0][0])
    )


@app.route("/horarioGavetas")
def horarioGavetas():
    idUsuario = request.args.get("idUsuario")
    data = []

    for retorno in select(
        "SELECT id, hora FROM gaveta WHERE id_usuario = %s" % (idUsuario)
    ):
        data.append(
            toJsonString({"id": retorno[0], "hora": timeDeltaToHour(retorno[1])})
        )

    return jsonify(data)


@app.route("/consultaRemedios")
def consultaRemedios():
    idGaveta = request.args.get("idGaveta")

    data = []

    for retorno in select(
        "SELECT id, nome, icone FROM remedio WHERE id_gaveta = %s" % (idGaveta)
    ):
        data.append(
            toJsonString({"id": retorno[0], "nome": retorno[1], "icone": retorno[2]})
        )

    return jsonify(data)


# DELETE


@app.route("/deletaRemedio", methods=["DELETE"])
def deletaRemedio():
    checkAuth()

    idRemedio = request.form["idRemedio"]

    sqlQuery("DELETE FROM remedio WHERE id = '%s'" % (idRemedio))

    return jsonify({"msg": "ok"})


# Funções auxiliares


def checkAuth():
    print("Checando autenticação")
    
    id = request.form["idAuth"]
    key = request.form["key"]

    for retorno in select(
        "SELECT senha FROM usuario WHERE id = '%s'"% (id)
    ):
        if key != str(crypto(chaveAuth + retorno[0] + id + str(datetime.date.today()))):
            render_template("login.html")


def conectar():
    conn = mysql.connector.connect(
        host="127.0.0.1", database="sys", user="root", password="senha"
    )

    return conn


def sqlQuery(query):
    print(query)
    mydb = conectar()
    mycursor = mydb.cursor()
    mycursor.execute(query)
    mydb.commit()
    mydb.close()


def select(query):
    print(query)
    mydb = conectar()
    mycursor = mydb.cursor()
    mycursor.execute(query)
    return mycursor.fetchall()


def timeDeltaToHour(timeDelta):
    if timeDelta == None:
        return "Não programado"

    hora = str(timeDelta.seconds // 3600).rjust(2, "0")
    minuto = str((timeDelta.seconds // 60) % 60).rjust(2, "0")
    return "%s:%s" % (hora, minuto)


def toJsonString(objeto):
    return json.dumps(objeto, ensure_ascii=False)


def crypto(message):
    message = message.encode()
    return hmac.new(cryptoKey.encode(), message).hexdigest().upper()
