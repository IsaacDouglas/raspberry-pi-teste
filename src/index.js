var rpio = require('rpio'); //define uso do rpio
 
LED = 29 //define pino do LED
 
var ledState = 0; //define estado do led
 
rpio.open(LED, rpio.OUTPUT, rpio.LOW); //define LED como output
 
setInterval(function() {
   ledState = !ledState; //troca estado do led
   if(ledState == 0) rpio.write(LED, rpio.HIGH); //acende LED
   else rpio.write(LED, rpio.LOW); //apaga LED
}, 1000); //configura intervalo de 1000 ms

BTN = 32; //define pino da chave 
 
rpio.open(BTN, rpio.INPUT, rpio.PULL_UP); //configura botao como input
 
setInterval(function() {
   console.log('Button State: ' + (rpio.read(BTN) ? 'OFF' : 'ON')); //escreve no console estado do botao
}, 10); //configura intervalo de 10 ms para leitura