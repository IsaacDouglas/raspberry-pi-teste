// libs para o envio da informacao por mqtt
const mqtt = require('mqtt')
var client = mqtt.connect('mqtt://test.mosquitto.org')

// libs para o hardware
var rpio = require('rpio') //define uso do rpio
const request = require('request')
const { sleep } = require('rpio')
 
// configura os pinos do botao, LDR e LED
LDR = 7
LED = 23
BTN = 32

// configura o botao como entrada e LED como saida
rpio.open(BTN, rpio.INPUT, rpio.PULL_UP)
rpio.open(LED, rpio.OUTPUT, rpio.LOW)
 
// inicializa variáveis para o controle
var btnState = 0
var btnLock = 1

var limiar = 3000
var countLata = 0

var livreOld = false
var livreNew = true
var on = true

// request para registrar os pontos e gerar o QRCode
function recycling(count) {
   const path = `http://35.215.197.50:8181/recycling?count=${count}`

   request(path, function (error, data, body){
      console.log("QRCode: " + body)
      client.publish('megahack3/info', JSON.stringify(JSON.stringify({ "latas": `${count}`, "qrcode": body })))
   });
   

   on ? rpio.write(LED, rpio.LOW) : rpio.write(LED, rpio.HIGH)
   sleep(0.1)
   on ? rpio.write(LED, rpio.HIGH) : rpio.write(LED, rpio.LOW)
}

setInterval(function() {
   btnState = rpio.read(BTN) // le o botao

   if(btnState == 0 && btnLock == 0) {
      btnLock = 1

      recycling(countLata) // faz a request para obter o QRCode com o contador atual
      countLata = 0
   }
 
   if(btnState == 1 && btnLock == 1) {
       btnLock = 0
   }

   // gerencia a leitura do LDR
   rpio.open(LDR, rpio.OUTPUT, rpio.LOW)
   sleep(0.1)
   rpio.open(LDR, rpio.INPUT)

   var ldrCount = 0
   while ((rpio.read(LDR) == 0) && (ldrCount < (limiar * 3))) {
      ldrCount += 1
   }

   // gerencia a troca de estados para o contador
   livreNew = (ldrCount < limiar)

   if (livreOld != livreNew) {

      livreOld = livreNew
      on = !on
      on ? rpio.write(LED, rpio.HIGH) : rpio.write(LED, rpio.LOW)
      
      if (on) {
         countLata += 1
         console.log("LATAS: " + countLata)
         client.publish('megahack3/info', JSON.stringify(JSON.stringify({ "latas": `${countLata}` })))
      }
   }

   // console.log("LDR COUNT: " + ldrCount)
}, 10);

client.on('connect', function () {
   client.subscribe('megahack3/info')
 })
  
client.on('message', function (topic, message) {
   // message is Buffer
   console.log(topic.toString() + " - " + message.toString())
   // client.end()
})