from flask import Flask, request, make_response, render_template
import mysql.connector
import json

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False

# Funções de renderização de view

@app.route("/")
def telaLogin():
    return render_template("login.html")



# Funções de serviço

@app.route("/registrar", methods=["POST"])
def registrar():
    email = request.form.get("email", False)
    senha = request.form.get("senha", False)
    sqlQuery("insert into paciente set email = '" + email + "', senha = '" + str(hash(senha)) + "'")


@app.route("/login")
def login():
    email = request.args.get("email")
    senha = request.args.get("senha")
    for retorno in select("select * from paciente where email = '" + email + "' and senha = '" + str(hash(senha)) + "'"):
        return '{ok}'
    return '{erro}'


@app.route("/horarioGaveta")
def horarioGaveta():
    idGaveta = request.args.get("idGaveta")
    data = []
    count = 0

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
    mydb = conectar()
    mycursor = mydb.cursor()
    mycursor.execute(query)
    mycursor.close()

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

