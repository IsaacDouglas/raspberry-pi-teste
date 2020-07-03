var rpio = require('rpio'); //define uso do rpio
 
LED = 29 //define pino do LED
 
var ledState = 0; //define estado do led
 
rpio.open(LED, rpio.OUTPUT, rpio.LOW); //define LED como output
 
setInterval(function() {
   ledState = !ledState; //troca estado do led
   if(ledState == 0) rpio.write(LED, rpio.HIGH); //acende LED
   else rpio.write(LED, rpio.LOW); //apaga LED
}, 1000); //configura intervalo de 1000 ms