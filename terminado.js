var txtMuerto;
var Terminado ={
	preload: function () {

	},

	create: function(){
		juego.stage.backgroundColor="#990000";
		txtMuerto = juego.add.text(130,260,"GAME OVER",{font:"25px Arial",fill:"#FFF"});
	}

};