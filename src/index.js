var rpio = require('rpio'); //define uso do rpio
const request = require('request');
const { sleep } = require('rpio');
 
// configura pinos botão e LED
BTN = 32;
LED = 29;
 
// configura botao como entrada e LED como saida
rpio.open(BTN, rpio.INPUT, rpio.PULL_UP);
rpio.open(LED, rpio.OUTPUT, rpio.LOW);
 
// inicializa variáveis para controle do LED e botao
var btnState = 0;
var ledState = 1;
var btnLock = 0;
var count = 0;
 
// setInterval(function() {
//    btnState = rpio.read(BTN) // le botao
    
//    // trata o estado do botao e controla o LED de acordo
//    if(btnState == 0 && btnLock == 0) {
//        ledState = !ledState;
//        ledState ? rpio.write(LED, rpio.LOW) : rpio.write(LED, rpio.HIGH);    
//        btnLock = 1;

//        console.log('LED1: ' + (ledState ? '0' : '1')); // escreve estado do LED no console
//        count += 1;
//        countLata = 0
//        recycling(count)
//    }
 
//    if(btnState == 1 && btnLock == 1) {
//        btnLock = 0
//    }
// }, 50);

function recycling(count) {
   const path = `http://35.215.197.50:8181/recycling?count=${count}`

   request(path, function (error, data, body){
      console.log(body);
   });
}

var limiar = 1000
var ldrCount = 0
var countLata = 0

PIN_LDR = 7
LED_LDR = 23

rpio.open(LED_LDR, rpio.OUTPUT, rpio.LOW)

setInterval(function() {
   ldrCount = 0
   rpio.open(PIN_LDR, rpio.OUTPUT, rpio.LOW);
   sleep(0.1)
   rpio.open(PIN_LDR, rpio.INPUT);

   let ldr = rpio.read(PIN_LDR)
   while ((ldr == 0) && (ldrCount < (limiar * 2))) {
      ldrCount += 1
   }

   if (ldrCount >= limiar) {
      countLata += 1
      rpio.write(LED_LDR, rpio.HIGH)
      sleep(0.2)
      rpio.write(LED_LDR, rpio.LOW)
      console.log("QUANTIDADE: " + countLata)
   }
   console.log(ldrCount);
}, 10);

