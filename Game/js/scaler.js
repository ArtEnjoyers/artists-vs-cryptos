var Game = Game || {};

//calcular les dimensions de la pantalla del jugador per fer servir el 100% de la pantalla

Game.getGameLandscapeDimensions = function (max_w, max_h) {
    //agafar w i h de la pantalla
    var w = window.innerWidth * window.devicePixelRatio;
    var h = window.innerHeight * window.devicePixelRatio;

    //determinar que es w i que es h
    var landW = Math.max(w, h);
    var landH = Math.min(w, h);

    //mirar si necessitem escalar l'amplada
    if(landW > max_w) {
        var ratioW = max_w / landW;
        landW *= ratioW;
        landH *= ratioW;
    }

    //mirar si necessitem escalar la llargada
    if(landH > max_h) {
        var ratioH = max_h / landH;
        landW *= ratioH;
        landH *= ratioH;
    }

    return {
        w: landW,
        h: landH
    };
};
