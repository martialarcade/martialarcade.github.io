export default class FightPanel {
  constructor(game) {
    this.game = game;
    this.width = 206;
    this.height = 26;
    this.x = (this.game.width-this.width)/2;
    this.y = this.game.height-this.height-5;
    this.image = document.getElementById('fightPanel');
    this.squareWH = 17;
    this.fighterImage = document.getElementById('heads');
    this.fighter0FrameX = 4;
    this.fighter1FrameX = 4;
    this.fighter0X = 61;
    this.fighter1X = this.game.width-this.squareWH-61;
    this.fighterY = this.game.height-this.squareWH-10;
    this.name0 = new name(this.game);
    this.name0.x = 82;
    this.name1 = new name(this.game);
    this.name1.x = this.game.width-this.name1.width-83;
    this.health0 = new health(this.game);
    this.health0.image = document.getElementById('health0');
    this.health0.x = 82;
    this.health1 = new health(this.game);
    this.health1.image = document.getElementById('health1');
    this.health1.x = this.game.width-143;
    this.timer = new timer(this.game);
    this.resultText = new resultText(this.game);
    this.frameTimer = 0;
		this.frameInterval = 1000;
  }
  update(deltaTime) {
    this.fighter0FrameX = Math.ceil(this.game.fighter0.health/30);
    this.fighter1FrameX = Math.ceil(this.game.fighter1.health/30);
    this.health0.width = Math.ceil(this.game.fighter0.health/3);
    this.health1.width = Math.ceil(this.game.fighter1.health/3);
    //timer
    if (this.frameTimer > this.frameInterval) this.frameTimer = 0;
		else this.frameTimer += deltaTime;
		if (this.game.fighter0.currentState.state !== 'BOW' && this.game.end === false && this.frameTimer > this.frameInterval && this.timer.frameY < 60) {
		  this.timer.frameY++;
		  this.timer.count--;
		}
  }
  draw(context){
    context.imageSmoothingEnabled = false;
    if (this.game.end === true && ((this.game.fighter0.currentState.state === 'END' && this.game.fighter0.frameX === this.game.fighter0.maxFrame) || (this.game.fighter1.currentState.state === 'END' && this.game.fighter1.frameX === this.game.fighter1.maxFrame))) {
      if (this.game.fighter0.health > this.game.fighter1.health) {
        this.resultText.image = document.getElementById('youWin');
      }
		  context.drawImage(this.resultText.image, this.resultText.x, this.resultText.y, this.resultText.width, this.resultText.height);
		}
    context.drawImage(this.image, this.x, this.y, this.width, this.height);
    context.drawImage(this.fighterImage, this.fighter0FrameX * this.squareWH, this.game.fighter0.no * this.squareWH, this.squareWH, this.squareWH, this.fighter0X, this.fighterY, this.squareWH, this.squareWH);
    context.drawImage(this.fighterImage, this.fighter1FrameX * this.squareWH, this.game.fighter1.no * this.squareWH, this.squareWH, this.squareWH, this.fighter1X, this.fighterY, this.squareWH, this.squareWH);
    context.drawImage(this.name0.image, 0, this.game.fighter0.no * this.name0.height, this.name0.width, this.name0.height, this.name0.x, this.name0.y, this.name0.width, this.name0.height);
    context.drawImage(this.name1.image, 0, this.game.fighter1.no * this.name1.height, this.name1.width, this.name1.height, this.name1.x, this.name1.y, this.name1.width, this.name1.height);
    context.drawImage(this.health0.image, 0, 0, this.health0.width, this.health0.height, this.health0.x, this.health0.y, this.health0.width, this.health0.height);
    context.drawImage(this.health1.image, 0, 0, this.health1.width, this.health1.height, this.health1.x, this.health1.y, this.health1.width, this.health1.height);
    context.drawImage(this.timer.image, 0, this.timer.frameY * this.timer.height, this.timer.width, this.timer.height, this.timer.x, this.timer.y, this.timer.width, this.timer.height);
	}
  reset() {
    this.fighter0FrameX = 4;
    this.fighter1FrameX = 4;
    this.health0.width = 60;
    this.health1.width = 60;
    this.timer.count = 60;
    this.frameTimer = 0;
    this.timer.frameY = 0;
    this.resultText.image = document.getElementById('youLose');
  }
}

class name {
  constructor(game) {
    this.game = game;
    this.width = 61;
    this.height = 7;
    this.image = document.getElementById('names');
    this.y = this.game.height-this.height-20;
  }
}

class health {
  constructor(game) {
    this.game = game;
    this.width = 60;
    this.height = 7;
    this.y = this.game.height-17
  }
}

class timer {
  constructor(game) {
    this.game = game;
    this.count = 60;
    this.image = document.getElementById('timer');
    this.width = 14;
    this.height = 13;
    this.frameY = 0;
    this.x = (this.game.width/2)-(this.width/2)-1;
    this.y = this.game.height-this.height-12;
  }
}

class resultText {
  constructor(game) {
    this.game = game;
    this.image = document.getElementById('youLose');
    this.width = 320;
    this.height = 224;
    this.x = 0;
    this.y = 0;
  }
}