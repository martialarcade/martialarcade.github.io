import {
  Bow,
  Kamae,
  Standing,
  Walk,
  Punch1,
  Punch2,
  Punch3,
  Kick1,
  Kick2,
  Kick3,
  Jumpkick,
  Hit,
  Fall,
  Block,
  Throw,
  Thrown,
  Recover,
  End
} from './playerStates.js';

export default class Player {
  constructor(game, profile, fightertype, direction) {
    this.game = game;
    this.fightertype = fightertype;
    this.no = profile[0];
    this.defense = profile[1];
    this.attack = profile[2];
    this.speed = profile[3];
    this.outfit = 0;
    this.width = 151;
    this.height = 151;
    if (this.fightertype === 'h') this.x = 10;
    else this.x = this.x = this.game.width-this.width-10;
    this.y = this.game.height - this.height - 41;
    this.image = document.getElementById('fighter'+this.no+'_'+this.outfit);
    this.frameX = 0;
    this.frameY = 0;
    this.strike = 0;
    this.order = 0;
    this.health = 180;
		this.frameTimer = 0;
		this.frameInterval = 1000/this.game.fps;
    this.states = [
      new Bow(this, this.game),
      new Kamae(this, this.game),
      new Standing(this, this.game),
      new Walk(this, this.game),
      new Punch1(this, this.game),
      new Punch2(this, this.game),
      new Punch3(this, this.game),
      new Kick1(this, this.game),
      new Kick2(this, this.game),
      new Kick3(this, this.game),
      new Jumpkick(this, this.game),
      new Hit(this, this.game),
      new Fall(this, this.game),
      new Block(this, this.game),
      new Throw(this, this.game),
      new Thrown(this, this.game),
      new Recover(this, this.game),
      new End(this, this.game)
    ];
    this.maxFrame = 10;
    this.currentState = this.states[0];
    this.endLoop = 0;
  }
  update(input, deltaTime) {
    //sprite animation
    if (this.frameTimer > this.frameInterval) {
      //walk direction
      if (this.fightertype === 'h' && this.currentState.state === 'WALK' && this.game.mode === 'kumite' && ((this.direction === 0 && input.keys.indexOf('ArrowLeft') > -1) || (this.direction === 1 && input.keys.indexOf('ArrowRight') > -1))) {
        if (this.frameX <= 0) this.frameX = this.maxFrame+1;
        this.frameX--;
      } else if (this.frameX >= this.maxFrame) {
        this.frameX = 0;
			} else {
			  this.frameX++;
      }
      //separate training fighters
      if ((this.fightertype === 't1' && (this.x >= this.game.fighter2.x-5 && this.x <= this.game.fighter2.x+5)) || (this.fightertype === 't2' && (this.x >= this.game.fighter1.x-5 && this.x <= this.game.fighter1.x+5))) {
        if (this.order === -1 && this.direction === 0) this.x += 5;
        else if (this.order === -1 && this.direction === 1) this.x -= 5;
      }
			this.frameTimer = 0;
		} else {
			this.frameTimer += deltaTime;
		}
		this.currentState.handleInput(input);
  }
  draw(context){
    if (this.game.start == true) {
      context.imageSmoothingEnabled = false;
      context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }
  }
  setState(state) {
	  this.currentState = this.states[state];
	  this.currentState.enter();
	}
	reset(profile, fightertype, direction) {
	  this.no = profile[0];
    this.defense = profile[1];
    this.attack = profile[2];
    this.speed = profile[3];
    this.fightertype = fightertype;
    this.direction = direction;
    if (this.fightertype === 'h') {
      if (this.game.mode === 'kumite') this.x = 10;
      else this.x = (this.game.width/2)-(this.width/2)-0.5;
    } else if (this.fightertype === 'k1' || this.fightertype === 't1') this.x = this.x = this.game.width-this.width-10;
    else if (this.fightertype === 't2') this.x = 10;
    if (this.fightertype === 't1') this.image = document.getElementById(this.game.background.id+'Fighter1');
    else if (this.fightertype === 't2') this.image = document.getElementById(this.game.background.id+'Fighter2');
    else if (this.fightertype === 'k1' && this.no == this.game.fighter0.no && this.game.fighter0.outfit == 0) this.image = document.getElementById('fighter'+this.no+'_1');
    else this.image = document.getElementById('fighter'+this.no+'_'+this.outfit);
    this.frameX = 0;
    if (this.game.mode === 'training' && (this.fightertype !== 'h')) {
      this.frameY = 1+direction;
	    this.maxFrame = 3;
      this.currentState = this.states[2];
    } else {
      this.frameY = 0;
	    this.maxFrame = 10;
      this.currentState = this.states[0];
    }
    this.strike = 0;
    this.order = 0;
    this.health = 180;
		this.frameTimer = 0;
    if (this.fightertype === 'h') {
      this.enemies = [this.game.fighter1];
      if (this.game.mode === 'training') this.enemies.push(this.game.fighter2);
    } else this.enemies = [this.game.fighter0];
    this.endLoop = 0;
	}
}