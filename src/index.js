var rpio = require('rpio'); //define uso do rpio
 
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
 
setInterval(function() {
   btnState = rpio.read(BTN) // le botao
    
   // trata o estado do botao e controla o LED de acordo
   if(btnState == 0 && btnLock == 0) {
       ledState = !ledState;
       ledState ? rpio.write(LED, rpio.LOW) : rpio.write(LED, rpio.HIGH);    
       btnLock = 1;
   }
 
   if(btnState == 1 && btnLock == 1) {
       btnLock = 0
   }
   console.log('LED1: ' + (ledState ? '0' : '1')); // escreve estado do LED no console
}, 50);