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

@app.route("/registrar", methods=["POST"])
def registrar():
    email = request.form["email"]
    senha = request.form["senha"]
    sqlQuery("insert into paciente set email = '" + email + "', senha = '" + str(hash(senha)) + "'")
    return jsonify({"msg":"ok"})


@app.route("/login")
def login():
    email = request.args.get("email")
    senha = request.args.get("senha")
    for retorno in select("select id from paciente where email = '" + email + "' and senha = '" + str(hash(senha)) + "'"):
        return jsonify({"id":retorno[0],"key":hash(chaveAuth+str(senha)+str(retorno[0]))})
    return jsonify({"msg":"erro"})


@app.route("/horarioGaveta")
def horarioGaveta():
    idGaveta = request.args.get("idGaveta")

    return (
        "{"
        + timeDeltaToHour(
            select("select hora from gaveta where id = " + idGaveta)[0][0]
        )
        + "}"
    )


@app.route("/horarioGavetas")
def horarioGavetas():
    idPaciente = request.args.get("idUsuario")
    data = []
    count = 0

    for retorno in select(
        "select id, hora from gaveta where id_paciente = " + idPaciente
    ):
        data.append({"id": retorno[0], "hora": timeDeltaToHour(retorno[1])})

    return json.dumps(data)


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
    mydb = conectar()
    mycursor = mydb.cursor()
    mycursor.execute(query)
    return mycursor.fetchall()

def timeDeltaToHour(timeDelta):
    return (
        str(timeDelta.seconds // 3600).rjust(2, "0")
        + ":"
        + str((timeDelta.seconds // 60) % 60).ljust(2, "0")
    )

