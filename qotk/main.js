import Menu from './menu.js';
import Background from './background.js';
import Player from './player.js';
import Blood from './blood.js';
import InputHandler from './input.js';
import FightPanel from './fightPanel.js';

window.addEventListener('load', function() {
  
  const gameCanvas = document.getElementById('gameCanvas');
  const gameCtx = gameCanvas.getContext('2d');
  gameCanvas.width = 320;
  gameCanvas.height = 224;
  
  const menuCanvas = document.getElementById('menuCanvas');
  const menuCtx = menuCanvas.getContext('2d');
  menuCanvas.width = 320;
  menuCanvas.height = 224;
  
  class Game {
    constructor(width, height) {
      this.width = width;
      this.height = height;
      this.mode = 'kumite';
      this.fps = 10;
      this.background = new Background(this);
      this.fighter0 = new Player(this, this.getFighters()[0], 'h', 0);
      let fighters = this.shuffle(this.getFighters());
      this.fighter1 = new Player(this, fighters[0], 'k1', 0);
      this.fighter2 = new Player(this, [null, 1, 1, 1], 't2', 1);
      this.fightPanel = new FightPanel(this);
      this.input = new InputHandler(this, null);
      this.start = false;
      this.end = false;
      this.bloods = [];
      this.enemyThrown = null;
      this.frameTimer = 0;
      this.frameInterval = 100;
      //audio
      this.audioOption = new Audio('./sfx/qotk-option.m4a');
      this.audioSelect = new Audio('./sfx/qotk-select.m4a');
      this.audioIntro = new Audio('./sfx/qotk-intro.m4a');
      this.audioStart = new Audio('./sfx/qotk-start.m4a');
      this.audioFight = new Audio('./sfx/qotk-fight.m4a');
      this.audioHit1 = new Audio('./sfx/qotk-hit1.m4a');
      this.audioHit2 = new Audio('./sfx/qotk-hit2.m4a');
      this.audioHit3 = new Audio('./sfx/qotk-hit3.m4a');

      window.addEventListener('keydown', (e) => {
    switch(e.key){
      case "ArrowLeft":
	this.audioPlay(this.audioOption);
      break;
      case "ArrowRight":
	this.audioPlay(this.audioSelect);    
      break;
    });

    }
    update(deltaTime) {
      if (this.frameTimer > this.frameInterval) {
        this.input.update(deltaTime);
        this.frameTimer = 0;
      } else {
        this.frameTimer += deltaTime;
      }
      this.background.update(deltaTime);
      this.fighter1.update(this.input, deltaTime);
       if (this.mode === 'training') this.fighter2.update(this.input, deltaTime);
      this.fighter0.update(this.input, deltaTime);
      this.bloods.forEach(blood => {
			   blood.update(this.input, deltaTime);
			   if (blood.time >= 10) this.bloods.splice(this.bloods.indexOf(blood), 1);
		  });
      if (this.mode === 'kumite') this.fightPanel.update(deltaTime);
      if (this.fightPanel.timer.count == 0 || this.fighter0.health <= 0 || this.fighter1.health <= 0) this.end = true;
    }
    draw(context) {
      this.background.draw(context);
      if (this.fighter1.strike === 1) {
        this.fighter0.draw(context);
        this.fighter1.draw(context);
      } else if (this.fighter1.order === -1) {
        this.fighter1.draw(context);
        this.fighter2.draw(context);
        this.fighter0.draw(context);
      } else {
        if (this.mode === 'training') this.fighter2.draw(context);
        this.fighter1.draw(context);
        this.fighter0.draw(context);
      }
      this.bloods.forEach(blood => {
			  blood.draw(context);
		  });
      if (this.mode === 'kumite') this.fightPanel.draw(context);
    }
    addBlood(player) {
      this.bloods.push(new Blood(this, player)); 
    }
    movement(direction, player, amount) {
      if (direction === 'left') {
        if (player.x > -10) {
          player.x-=amount;
        } else if (this.background.x < 0 && player.enemies[0].x < this.width-player.enemies[0].width+10) {
          this.background.x+=amount;
          if (player.enemies[0].currentState.length && player.enemies[0].currentState.state === 'WALK') {
            if (player.enemies[0].direction === 0) player.enemies[0].x+=amount*2;
            else player.enemies[0]-=amount*2
          } else player.enemies[0].x+=amount;
          this.bloods.forEach(blood => {
			      blood.x+=amount;
		      });
        }
      } else if (direction === 'right') {
        if (player.x < this.width-player.width+10) {
          player.x+=amount;
        } else if (this.background.x > 0-(this.background.width-this.width) && player.enemies[0].x > -10) {
          this.background.x-=amount;
          if (player.enemies[0].currentState.length && player.enemies[0].currentState.state === 'WALK') {
            if (player.enemies[0].direction === 0) player.enemies[0].x-=amount*2;
            else player.enemies[0]+=amount*2
          } else player.enemies[0].x-=amount;
          this.bloods.forEach(blood => {
			      blood.x-=amount;
		      });
        }
      }
    }
    reset(mode) {
      this.mode = mode;
      var backgroundId = 'kumite';
      if (this.mode !== 'kumite') {
        var backgrounds = this.shuffle(this.getBackgrounds());
        backgroundId = backgrounds[0];
        if (backgroundId === this.background.id) backgroundId = backgrounds[1];
      }
      this.background.reset(backgroundId);
      this.fighter0.reset(this.getFighters()[this.fighter0.no], 'h', 0);
      if (this.mode === 'kumite') {
        const fighters = this.shuffle(this.getFighters());
	      var fighter1 = fighters[0];
	      if (fighter1[0] === this.fighter1.no) fighter1 = fighters[1];
        this.fighter1.reset(fighter1, 'k1', 1);
      } else {
        this.fighter1.reset([null, 1, 1, 1], 't1', 1);
        this.fighter2.reset([null, 1, 1, 1], 't2', 0);
      }
      this.fightPanel.reset();
      this.start = true;
      this.end = false;
      this.bloods = [];
      document.getElementById("pause").value = 0;
    }
    shuffle(array) {
      let currentIndex = array.length,  randomIndex;
      while (currentIndex > 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    }
    getFighters() {
      //DF (0-3), AT(4-7), SP(1-4)
      return [
        [0, 2, 5, 1],
        [1, 0, 6, 2],
        [2, 0, 7, 1],
        /*[3, 3, 4, 1],
        [4, 0, 4, 4],
        [5, 1, 4, 3],
        [6, 1, 6, 1],
        [7, 2, 4, 2],
        [8, 0, 5, 3]*/
      ];
    }
    getBackgrounds() {
      return ['dojo', 'dojang', 'gym'];
    }
    audioPlay(audio) {
      audio.currentTime = 0;
      audio.play();
    }
  }	
  const game = new Game(gameCanvas.width, gameCanvas.height);
  const menu = new Menu(game, menuCanvas.width, menuCanvas.height, menuCanvas);
  
  let lastTime = 0;
  
  function play(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    menuCtx.clearRect(0, 0, menuCanvas.width, menuCanvas.height);
    if (document.getElementById("pause").value == 1) {
		  menuCanvas.style.visibility = "visible";
		} else {
		  menuCanvas.style.visibility = "hidden";
		  gameCtx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
      game.update(deltaTime); 
		}
	  game.draw(gameCtx);
	  menu.update(menuCtx);
    requestAnimationFrame(play);
  }
  play(0);
  
});
