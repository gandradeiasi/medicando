#include <Wire.h> 
#include <RTClib.h>  
#include <SoftwareSerial.h>


//RX e TX
//variáveis para o wifi
//conflito com as portas ----- alterar portas wifi
SoftwareSerial esp8266(52,50);    //----- pinos para o modulo wifi
RTC_DS3231 rtc; //OBJETO DO TIPO RTC_DS3231
String REDE = "TORTUGA";
String SENHA = "jack sparrow";
int intervaloComando = 250;
String ip = "192.168.0.8";

//motor de passo
int maxstep = 268;  //Numero de Passos exatos para o curso da gaveta - constante
int x;   //Para o contador de passos
char gaveta;
String h1, h2, h3;
char hora[30];
char horaAnterior[30];

//motor 1
const int enable1 = 4;
const int step1 = 3;
const int dir1 = 2;

//motor 2
const int enable2 = 9;
const int step2 = 8;
const int dir2 = 7;

//motor 3
const int enable3 = 12;
const int step3 = 11;
const int dir3 = 10;

//botões
const int btn1 = 40;
const int btn2 = 41;
const int btn3 = 42;

//alarme
const int led = 37;
const int buzzer = 38;

//variáveis auxiliares
int AuxPino1;
int AuxPino2;


//Controle abertura
boolean abriu1 = true;
boolean abriu2 = true;
boolean abriu3 = true;

//Controle abertura por botões
boolean podeAbrir1 = true;
boolean podeAbrir2 = true;
boolean podeAbrir3 = true;

String extrairHora(String string) {
  int indexLeft = 0;
  int indexRight = 0;
  
  for (int i = 0; i < string.length()-1; i++) {
    if (string.substring(i,i+1).equals("{")) {
      indexLeft = i;
      break;
    }
  }

  for (int i = string.length()-1; i < 0; i--) {
    if (string.substring(i,i+1).equals("}")) {
      indexRight = i;
      break;
    }
  }

  return string.substring(indexLeft+1,indexRight);
}

void ativaGaveta() {
  
  if (digitalRead(btn1) == HIGH) {
    if (podeAbrir1) {

Serial.println("pode abrir");
      
      digitalWrite(enable1,LOW);
      digitalWrite(dir1,HIGH);

      for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {
         digitalWrite(step1,HIGH);  //Output high
         delay(5); //Wait
         digitalWrite(step1,LOW);  //Output low
         delay(5);  //Wait
       }
       digitalWrite(enable1,HIGH);  //Para o motor
       podeAbrir1 = false;
    }
    else {

      Serial.println("pode fechar");
      digitalWrite(enable1,LOW);
      digitalWrite(dir1,LOW);

      for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {
         digitalWrite(step1,HIGH);  //Output high
         delay(5);  //Wait
         digitalWrite(step1,LOW);  //Output low
         delay(5);  //Wait
       }
       digitalWrite(enable1,HIGH);  //Para o motor
       podeAbrir1 = true;
    }
  }
  else if (digitalRead(btn2) == HIGH) {
    if (podeAbrir2) {
      digitalWrite(enable2,LOW);
      digitalWrite(dir2,LOW);

     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {
         digitalWrite(step2,HIGH);  //Output high
         delay(5);  //Wait
         digitalWrite(step2,LOW);  //Output low
         delay(5);  //Wait
       }
         digitalWrite(enable2,HIGH);  //Para o motor
         podeAbrir2 = false;
    }
    else {
      digitalWrite(enable2,LOW);
      digitalWrite(dir2,HIGH);

     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {
         digitalWrite(step2,HIGH);  //Output high
         delay(5);  //Wait
         digitalWrite(step2,LOW);  //Output low
         delay(5);  //Wait
       }
         digitalWrite(enable2,HIGH);  //Para o motor
         podeAbrir2 = true;
    }
  }
  else if (digitalRead(btn3) == HIGH) {
    if (podeAbrir3) {
      Serial.println("if");
     digitalWrite(enable3,LOW); 
     digitalWrite(dir3,HIGH);

     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {

         digitalWrite(step3,HIGH);  //Output high
         delay(5);  //Wait
         digitalWrite(step3,LOW);  //Output low
         delay(5); //Wait
       }
         digitalWrite(enable3,HIGH);  //Para o motor
         podeAbrir3 = false;
    }
    else {
      Serial.println("else");
      digitalWrite(enable3,LOW); 
     digitalWrite(dir3,LOW);

     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {

         digitalWrite(step3,HIGH);  //Output high
         delay(5);  //Wait
         digitalWrite(step3,LOW);  //Output low
         delay(5);  //Wait
       }
         digitalWrite(enable3,HIGH);  //Para o motor
         podeAbrir3 = true;
    }
  }
}
 
String sendData(String command)
{
  ativaGaveta();
   //Envio dos comandos AT para o modulo
  String response = "";
  esp8266.print(command);
  long int time = millis();
  while ((time + intervaloComando) > millis())
  {
    while (esp8266.available())
    {
      char c = esp8266.read();
      response += c;
    }
  }
  Serial.print(response);
  return response;
}

int testarComando(String comando) {
  if (comando.indexOf("OK") > -1) return 1;
  else if (comando.indexOf("GOT IP") > -1) return 1;
  return 0;
}


 //Rotina para contar passos
//Dependendo do motor que está sendo chamando ele vai pegar e alterar os pinos
//pino AuxPino1 = step
//pino AuxPino2 = enable
void Roda(){

     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {
         digitalWrite(AuxPino1,HIGH);  //Output high
         delay(AuxPino1); // Wait
         digitalWrite(AuxPino1,LOW);  //Output low
         delay(AuxPino1); // Wait
       }
         digitalWrite(AuxPino2,HIGH);  //Para o motor
         gaveta = 0;
}

//rotina para o alarme do Dispensório
void aviso(){
  tone(buzzer,261);  //incia o som do buzzer
  for (int i = 0; i < 10; i++) { //faz o led piscar
    digitalWrite(led,HIGH);
    delay(200);
    digitalWrite(led,LOW);
    delay(200);
  }
  noTone(buzzer); //para o som do buzzer
  digitalWrite(led, LOW);
  
}

void setup() {
    Serial.begin(9600); //INICIALIZA A SERIAL
    esp8266.begin(9600); //iniciando a serial do modulo wifi 
    sendData("AT+RST\r\n");
    sendData("AT+UART_DEF=9600,8,1,0,0\r\n");
    sendData("AT+CWMODE=3\r\n");
   
    //configurando os pinos para o motor de passo 1
    pinMode(enable1,OUTPUT);  //Enable
    pinMode(step1,OUTPUT);  //Step
    pinMode(dir1,OUTPUT); // Dir
    digitalWrite(enable1,HIGH);  //Logica invertida ENABLE = HIGH - motor parado
   
    //configurando os pinos para o motor de passo 2
    pinMode(enable2,OUTPUT); 
    pinMode(step2,OUTPUT);
    pinMode(dir2,OUTPUT); 
    digitalWrite(enable2,HIGH); 
   
    //configurando os pinos para o motor de passo 3
    pinMode(enable3,OUTPUT);
    pinMode(step3,OUTPUT);
    pinMode(dir3,OUTPUT); 
    digitalWrite(enable3,HIGH); 

    //configura botões de abertura de gaveta
    pinMode(btn1,INPUT);
    pinMode(btn2,INPUT);
    pinMode(btn3,INPUT);
   
    pinMode(led,OUTPUT);
    pinMode(buzzer,OUTPUT);
    
    //este metodo irá verificar se o rtc não foi inicializado
    if(! rtc.begin()) { 
      Serial.println("DS3231 não encontrado"); 
      while(1);
    }

    //caso o rtc perca a energia ou foi ligado pela primeira vez
    if(rtc.lostPower()){ 
       Serial.println("DS3231 OK!"); 
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__))); //CAPTURA A DATA E HORA EM QUE O SKETCH É COMPILADO - Depois da primeira compilação ela deve ser comentada.
     }
    delay(100); //INTERVALO DE 100 MILISSEGUNDOS


    //Inicializa hora anterior
    //DateTime now = rtc.now();
    //sprintf( horaAnterior, "%02d%02d", now.hour(), now.minute());
}

void loop() {
  //Abre gavetas através dos botões
  //ativaGaveta();
  
  //A hora do RTC
    DateTime now = rtc.now();
    sprintf( hora, "%02d%02d", now.hour(), now.minute()); //armazenando em hora o horário que está marcado no RTC já com a formataçõa HoraMinuto 
   //como receber informações vindas de aplicativos externos e não pela porta serial
   Serial.println(hora);

//fazendo a conexão com o wifi
  Serial.println(sendData("AT+CIPSTATUS\r\n"));
  if (sendData("AT+CIPSTATUS\r\n").indexOf(5)  -1) {
    Serial.println("Conectando...");
    while (testarComando(sendData("AT+CWJAP="+ REDE +","+ SENHA +"\r\n")) == 0){};
    Serial.println("Conectado!");
  }

  //Verifica se ja passou um minuto para permitir que gavetas possam ser abertas novamente
  String strHora = hora;
  String strHoraAnterior = horaAnterior;
  
  if (strHora != strHoraAnterior){
    abriu1 = false;
    abriu2 = false;
    abriu3 = false;
    sprintf( horaAnterior, "%02d%02d", now.hour(), now.minute());
  }

  while(1==1) {
    while (testarComando(sendData("AT+CIPSTART=TCP,"+ip+",5000\r\n")) == 0 ) {};
    if (testarComando(sendData("AT+CIPSEND=42\r\n")) == 0) continue;
    else break;
  }
  h1 = extrairHora(sendData("GET horarioGavetaidGaveta=1 HTTP1.1\r\n\r\n"));
  Serial.println(h1);

  while(1==1) {
    while (testarComando(sendData("AT+CIPSTART=TCP,"+ip+",5000\r\n")) == 0 ) {};
    if (testarComando(sendData("AT+CIPSEND=42\r\n")) == 0) continue;
    else break;
  }
  h2 = extrairHora(sendData("GET horarioGavetaidGaveta=2 HTTP1.1\r\n\r\n"));
  Serial.println(h2);

  while(1==1) {
    while (testarComando(sendData("AT+CIPSTART=TCP,"+ip+",5000\r\n")) == 0 ) {};
    if (testarComando(sendData("AT+CIPSEND=42\r\n")) == 0) continue;
    else break;
  }
  h3 = extrairHora(sendData("GET horarioGavetaidGaveta=3 HTTP1.1\r\n\r\n"));
  Serial.println(h3);

  //verificando o horário das gavetas para abrir
  //fica conferindo o horário no RTC até algum ficar igual (Hora e minuto)
   if(h1 == hora && abriu1 == 0){
      Serial.println("gaveta 1 na hora "  + h1);
      aviso();
      digitalWrite(enable1,LOW);
      digitalWrite(dir1,LOW);
      AuxPino1 = step2;  
      AuxPino2 = enable2;   
      Roda();

     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {
         digitalWrite(step1,LOW); // Output high
         delay(5);  //Wait
         digitalWrite(step1,HIGH);  //Output low
         delay(5);  //Wait
       }
         digitalWrite(enable1,HIGH);  //Para o motor
         abriu1 = 1;
         podeAbrir1 = false;
   
   }else if(h2 == hora && abriu2 == 0){
      Serial.println("gaveta 2 na hora "  + h2);
      aviso();
      digitalWrite(enable2,LOW);
      digitalWrite(dir2,LOW);
      AuxPino1 = step2;  
      AuxPino2 = enable2;   
      Roda();

     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {
         digitalWrite(step2,LOW);  //Output high
         delay(5);  //Wait
         digitalWrite(step2,HIGH);  //Output low
         delay(5);  //Wait
       }
         digitalWrite(enable2,HIGH);  //Para o motor
         abriu2 = 1;
         podeAbrir2 = false;
    
   }else if(h3 == hora && abriu3 == 0){
     Serial.println("gaveta 3 na hora "  + h3);
     aviso();
     Serial.println("aviso depois");
     digitalWrite(enable3,LOW); 
     digitalWrite(dir3,HIGH);
     AuxPino1 = step3;  
     AuxPino2 = enable3;  
     Roda();
    
     for(x = 0; x < maxstep; x++)  //Isso gera uma forma de onda quadrada com Dutty Cicle de 7ms
      {

         digitalWrite(step3,HIGH);  //Output high
         delay(5);  //Wait
         digitalWrite(step3,LOW);  //Output low
         delay(5);  //Wait
       }
         digitalWrite(enable3,HIGH);  //Para o motor
         abriu3 = 1;
         podeAbrir3 = false;
   }

}
