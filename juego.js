var nave;
var balas;
var tiempoEntreBalas=400;
var tiempo=0;
var malos;
var timer;
var puntos;
var txtPuntos;
var vidas;
var txtVidas;
var fondoJuego;
var cursores;
var sonidoDisparo;
var sonidoBack;
var soundPuntos;
var txtAutor;

var Juego={
	preload: function () {
		juego.load.image('nave','img/nave.png');
		juego.load.image('laser','img/laser.png');
		juego.load.image('malo','img/alien.png');
		juego.load.image('bg','img/bg.png');
		juego.load.audio('lazer','sounds/disparo.mp3');
		juego.load.audio('soundPuntos','sounds/puntos.mp3');
		juego.load.audio('sountrack','sounds/sountrack.mp3');
	},

	create: function(){
		fondoJuego = juego.add.tileSprite(0,0,400,540,'bg');
		juego.physics.startSystem(Phaser.Physics.ARCADE);
		nave = juego.add.sprite(juego.width/2,485,'nave');
		nave.anchor.setTo(0.5);
		juego.physics.arcade.enable(nave,true);
		/*Evitar que la nave no salga de la pantalla*/
		juego.physics.arcade.enable(nave);
		nave.body.collideWorldBounds=true;

		balas = juego.add.group();
		balas.enableBody = true;
		balas.setBodyType = Phaser.Physics.ARCADE;
		balas.createMultiple(50,'laser');
		balas.setAll('anchor.x',0.5);
		balas.setAll('anchor.y',0.5);
		balas.setAll('checkWorldBounds',true);
		balas.setAll('outOfBoundsKill',true);

		malos = juego.add.group();
		malos.enableBody = true;
		malos.setBodyType = Phaser.Physics.ARCADE;
		malos.createMultiple(30,'malo');
		malos.setAll('anchor.x',0.5);
		malos.setAll('anchor.y',0.5);
		malos.setAll('checkWorldBounds',true);
		malos.setAll('outOfBoundsKill',true);

		timer = juego.time.events.loop(2000,this.crearEnemigo,this);
		//Definiendo e puntaje en pantalla
		puntos = 0;
		juego.add.text(20,20,"Puntos: ", {font:"14px Arial",fill:"#FFF"});
		txtPuntos=juego.add.text(80,20,"0",{font:"14px Arial",fill:"#FFF"});
		//Definiendo contador de vidas
		vidas = 3;
		juego.add.text(310,20,"Vidas: " , {font:"14px Arial",fill:"#FFF"});
		txtVidas = juego.add.text(360,20,"3",{font:"14px Arial",fill:"#FFF"});
		/*Colocando el nombre del Desarrollado */
		txtAutor = juego.add.text(290,520,"Clever Salvador",{font:"14px Arial",fill:"#FFF"})
		/*Cursores*/
		cursores = juego.input.keyboard.createCursorKeys();
		//Sonido back
		sonidoBack = juego.sound.add('sountrack');
        sonidoBack.play();
	},
	update: function(){
		fondoJuego.tilePosition.y-=1;
		nave.rotation = juego.physics.arcade.angleToPointer(nave) + Math.PI/2;
		/*Movimiento de la nave*/
		if(cursores.right.isDown) {
			nave.position.x+=3;
		}else if(cursores.left.isDown) {
			nave.position.x -=3;
		}

		if(cursores.down.isDown) {
			nave.position.y+=3;
		}else if(cursores.up.isDown) {
			nave.position.y -=3;
		}
		/**/
		if(juego.input.activePointer.isDown) {
			sonidoDisparo=juego.sound.add('lazer');
			sonidoDisparo.play();
			this.disparar();
		}
		//Colision 
		juego.physics.arcade.overlap(balas,malos,this.collision,null,this);
		//Colision de malo a nave
		juego.physics.arcade.overlap(nave,malos,this.collisionMalo,null,this);
		//Definiendo el contador de vidas
		malos.forEachAlive(function(m) {
			if(m.position.y > 520 && m.position < 521) {
				vidas -=1;
				txtVidas.text = vidas;
			}
		});

		if(vidas == 0) {
			juego.state.start('Terminado');
		}
	},
	disparar: function() {
		if(juego.time.now > tiempo && balas.countDead() > 0) {
			tiempo = juego.time.now + tiempoEntreBalas;
			var bala = balas.getFirstDead();
			bala.anchor.setTo(0.5);
			bala.reset(nave.x,nave.y);
			bala.rotation = juego.physics.arcade.angleToPointer(bala) + Math.PI/2;
			juego.physics.arcade.moveToPointer(bala,200);
		}
	},

	crearEnemigo: function () {
		var enem = malos.getFirstDead();
		var num = Math.floor(Math.random()*10+1);
		enem.reset(num*38,0);
		enem.anchor.setTo(0.5);
		enem.body.velocity.y = 100;
		enem.checkWorldBounds = true;
		enem.outOfBoundsKill = true;
	},

	collision: function(b,m) {
		soundPuntos = juego.sound.add('soundPuntos');
        soundPuntos.play();
		b.kill();
		m.kill();
		puntos ++;
		txtPuntos.text = puntos;
	},
	collisionMalo: function(b,m) {
		m.kill();
		vidas --;
		txtVidas.text = vidas;
	}


};