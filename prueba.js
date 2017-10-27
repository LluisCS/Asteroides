function Vidas(){
    this._nVidas = 3;

}
Vidas.prototype.getNVidas = function (){
    return nVidas;
};

Vidas.prototype.perderVida = function (){
    nVidas--;
}

Vidas.prototype.ganarVida = function (){
    nVidas++;
}
function Texto(){
    this._texto="";

}
function Puntuacion(){
    this._puntos = 0;
}
Puntuacion.prototype.sumar = function (n){
    _puntos += n;
}