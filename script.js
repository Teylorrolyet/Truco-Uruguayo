////////////////////////////
// CONFIGURACIÓN
////////////////////////////

const PALOS=["espada","basto","oro","copa"];
const VALORES=[1,2,3,4,5,6,7,10,11,12];

let estado={
pJugador:0,
pCPU:0,
mano:"jugador",
truco:1,
bazasJ:0,
bazasCPU:0,
turno:"jugador",
dificultad:1
};

let mazo=[], jugador=[], cpu=[];

////////////////////////////
// MAZO
////////////////////////////

function crearMazo(){
mazo=[];
PALOS.forEach(p=>{
VALORES.forEach(v=>{
mazo.push({valor:v,palo:p});
});
});
}

function mezclar(){
mazo.sort(()=>Math.random()-0.5);
}

function repartir(){
jugador=mazo.splice(0,3);
cpu=mazo.splice(0,3);
}

////////////////////////////
// JERARQUÍA TRUCO URUGUAYO
////////////////////////////

function poder(c){
if(c.valor==1&&c.palo=="espada")return 14;
if(c.valor==1&&c.palo=="basto")return 13;
if(c.valor==7&&c.palo=="espada")return 12;
if(c.valor==7&&c.palo=="oro")return 11;
if(c.valor==3)return 10;
if(c.valor==2)return 9;
if(c.valor==1)return 8;
if(c.valor==12)return 7;
if(c.valor==11)return 6;
if(c.valor==10)return 5;
if(c.valor==7)return 4;
if(c.valor==6)return 3;
if(c.valor==5)return 2;
return 1;
}

////////////////////////////
// IA (3 NIVELES)
////////////////////////////

function cpuElegirCarta(){

if(estado.dificultad==0)
return cpu.splice(Math.floor(Math.random()*cpu.length),1)[0];

if(estado.dificultad==1){
cpu.sort((a,b)=>poder(a)-poder(b));
return cpu.shift();
}

if(estado.dificultad==2){
cpu.sort((a,b)=>poder(b)-poder(a));
return cpu.shift();
}
}

////////////////////////////
// JUGAR CARTA
////////////////////////////

function jugar(i){

if(estado.turno!=="jugador")return;

let cj=jugador.splice(i,1)[0];
let cc=cpuElegirCarta();

resolverBaza(cj,cc);
render();
}

function resolverBaza(j,c){

document.getElementById("mesa").innerHTML=
`${j.valor} ${j.palo} vs ${c.valor} ${c.palo}`;

if(poder(j)>poder(c))estado.bazasJ++;
else estado.bazasCPU++;

if(estado.bazasJ==2||estado.bazasCPU==2)
terminarMano();
}

////////////////////////////
// ENVIDO REAL
////////////////////////////

function calcularEnvido(mano){
let palos={};

mano.forEach(c=>{
if(!palos[c.palo])palos[c.palo]=[];
palos[c.palo].push(c.valor>7?0:c.valor);
});

let max=0;

Object.values(palos).forEach(a=>{
if(a.length>=2){
a.sort((x,y)=>y-x);
max=Math.max(max,a[0]+a[1]+20);
}else{
max=Math.max(max,a[0]);
}
});

return max;
}

function cantarEnvido(){

let ej=calcularEnvido(jugador);
let ec=calcularEnvido(cpu);

if(ej>=ec)estado.pJugador+=2;
else estado.pCPU+=2;

actualizarMarcador();
}

////////////////////////////
// TRUCO
////////////////////////////

function cantarTruco(){
estado.truco++;
if(estado.truco>4)estado.truco=4;
}

////////////////////////////
// FIN DE MANO
////////////////////////////

function terminarMano(){

if(estado.bazasJ>estado.bazasCPU)
estado.pJugador+=estado.truco;
else
estado.pCPU+=estado.truco;

actualizarMarcador();

if(estado.pJugador>=30||estado.pCPU>=30){
alert("Partido terminado");
location.reload();
}

nuevaMano();
}

////////////////////////////
// UI
////////////////////////////

function actualizarMarcador(){
pj.textContent=estado.pJugador;
pc.textContent=estado.pCPU;
}

function render(){

jugadorDiv.innerHTML="";
jugador.forEach((c,i)=>{
jugadorDiv.innerHTML+=
`<img src="assets/cartas/${c.valor}-${c.palo}.png"
class="card" onclick="jugar(${i})">`;
});

cpuDiv.innerHTML="";
cpu.forEach(()=>{
cpuDiv.innerHTML+=
`<img src="assets/card-back.png" class="card">`;
});
}

////////////////////////////
// INICIO
////////////////////////////

const jugadorDiv=document.getElementById("jugador");
const cpuDiv=document.getElementById("cpu");
const pj=document.getElementById("pj");
const pc=document.getElementById("pc");

function nuevaMano(){

estado.bazasJ=0;
estado.bazasCPU=0;
estado.truco=1;
estado.dificultad=
parseInt(document.getElementById("dificultad").value);

crearMazo();
mezclar();
repartir();
render();
}

nuevaMano();