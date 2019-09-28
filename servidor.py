from flask import Flask, request, make_response, render_template, jsonify
import mysql.connector
import json

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

chaveAuth = "#$seC"

# Funções de renderização de view


@app.route("/")
def telaLogin():
    return render_template("login.html")


@app.route("/home")
def telaHome():
    return render_template("index.html")


# Funções de serviço

@app.route("/programarHorario", methods=["POST"])
def programarHorario():
    idGaveta = request.form["idGaveta"]
    hora = request.form["hora"]
    
    sqlQuery("UPDATE gaveta SET hora = '%s' WHERE idGaveta = '%s'" % (hora, idGaveta))
    
    return jsonify({"msg": "ok"})

@app.route("/registrar", methods=["POST"])
def registrar():
    email = request.form["email"]
    senha = request.form["senha"]
    
    sqlQuery("INSERT into usuario SET email = '%s', senha = '%s'" % (email, str(hash(senha))))
    
    return jsonify({"msg": "ok"})


@app.route("/login")
def login():
    email = request.args.get("email")
    senha = request.args.get("senha")
    
    for retorno in select("SELECT id FROM usuario WHERE email = '%s' AND senha = '%s'" % (email, str(hash(senha)))):
        return jsonify({"id": retorno[0], "key": hash(chaveAuth + str(senha) + str(retorno[0]))})
    
    return jsonify({"msg": "erro"})


@app.route("/horarioGaveta")
def horarioGaveta():
    idGaveta = request.args.get("idGaveta")

    return "{%s}" % (timeDeltaToHour(select("SELECT hora FROM gaveta WHERE id = " + idGaveta)[0][0]))


@app.route("/horarioGavetas")
def horarioGavetas():
    idUsuario = request.args.get("idUsuario")
    data = []
    count = 0

    for retorno in select("SELECT id, hora FROM gaveta WHERE id_usuario = %s" % (idUsuario)):
        data.append(toJsonString({"id": retorno[0], "hora": timeDeltaToHour(retorno[1])}))

    return jsonify(data)


# Funções auxiliares


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
    minuto = str((timeDelta.seconds // 60) % 60).ljust(2, "0")
    return "%s:%s" % (hora, minuto)

def toJsonString(objeto):
    return json.dumps(objeto, ensure_ascii=False)
