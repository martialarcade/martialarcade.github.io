const states = {
  BOW: 0,
  KAMAE: 1,
  STANDING: 2,
  WALK: 3,
  PUNCH1: 4,
  PUNCH2: 5,
  PUNCH3: 6,
  KICK1: 7,
  KICK2: 8,
  KICK3: 9,
  JUMPKICK: 10,
  HIT: 11,
  FALL: 12,
  BLOCK: 13,
  THROW: 14,
  THROWN: 15,
  RECOVER: 16,
  END: 17
}

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Bow extends State {
  constructor(player, game) {
    super('BOW');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.frameX = 0;
    this.player.maxFrame = 10;
    this.player.frameY = 0;
  }
  handleInput(input) {
    if (this.player.frameX === 0) this.game.audioPlay(this.game.audioFight);
    if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.KAMAE);
    }
  }
}

export class Kamae extends State {
  constructor(player, game) {
    super('KAMAE');
    this.player = player;
    this.game = game;
  }
  enter() {
    if (this.game.mode === 'kumite' || (this.game.mode === 'training' && this.player.fightertype !== 'h')) {
      if (this.player.x < this.player.enemies[0].x) this.player.direction = 0;
      else this.player.direction = 1;
    }
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 15 + this.player.direction;
  }
  handleInput(input) {
    if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Standing extends State {
  constructor(player, game) {
    super('STANDING');
    this.player = player;
    this.game = game;
  }
  enter() {
    if (this.game.mode === 'kumite' || (this.game.mode === 'training' && this.player.fightertype !== 'h')) {
      if (this.player.x < this.player.enemies[0].x) this.player.direction = 0;
      else this.player.direction = 1;
    }
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
    this.player.frameY = 1 + this.player.direction;
    //separate fighters
    this.player.enemies.forEach(enemy => {
      var distance = 0;
      if (this.player.x+(this.player.width/2) <= this.game.width/2) {
        if (this.player.x <= enemy.x) {
          distance = enemy.x-this.player.x;
          if (distance < 50) enemy.x += (50-distance);
        } else {
          distance = this.player.x-enemy.x;
          if (distance < 50) this.player.x += (50-distance);
        }
      } else {
        if (this.player.x <= enemy.x) {
          distance = enemy.x-this.player.x;
          if (distance < 50) this.player.x -= (50-distance);
        } else {
          distance = this.player.x-enemy.x;
          if (distance < 50) enemy.x -= (50-distance);
        }
      }
    });
  }
  handleInput(input) {
    if (this.game.end == true) {
      if (this.player.frameX >= this.player.maxFrame) {
        if (this.player.endLoop <= 20) this.player.endLoop++;
        else this.player.setState(states.END);
      }
    } else if (this.player.fightertype === 'h') {
      if (((input.lastKey === 'PRESS a' || input.lastKey === 'PRESS b') && ((this.player.direction === 0 && input.keys.indexOf('ArrowLeft') > -1) || (this.player.direction === 1 && input.keys.indexOf('ArrowRight') > -1))) || ((input.lastKey === 'PRESS left' || input.lastKey === 'PRESS right') && ((this.player.direction === 0 && input.keys.indexOf('a') > -1) || (this.player.direction === 1 && input.keys.indexOf('s') > -1)))) {
        this.player.setState(states.BLOCK);
      } else if ((input.lastKey === 'PRESS c' && ((this.player.direction === 0 && input.keys.indexOf('ArrowLeft') > -1) || (this.player.direction === 1 && input.keys.indexOf('ArrowRight') > -1))) || input.keys.indexOf('d') > -1 && ((this.player.direction === 0 && input.lastKey === 'PRESS left') || (this.player.direction === 1 && input.lastKey === 'PRESS right'))) {
        this.player.enemies.forEach(enemy => {
          this.game.enemyThrown = throwMove(this.player, this.game.enemyThrown);
        });
      } else if (input.lastKey === 'PRESS a') {
        punch(this.player);
      } else if (input.lastKey === 'PRESS b') {
        kick(this.player);
      } else if (input.lastKey === 'PRESS c') {
        this.player.setState(states.JUMPKICK);
      } else {
        if (this.game.mode === 'training' && input.keys.indexOf('ArrowRight') > -1) this.player.direction = 0;
		    else if (this.game.mode === 'training' && input.keys.indexOf('ArrowLeft') > -1) this.player.direction = 1;
        if (input.keys.indexOf('ArrowRight') > -1 || input.keys.indexOf('ArrowLeft') > -1) this.player.setState(states.WALK);
      }
    } else if (this.game.mode === 'kumite') enemyAi(this.player, this.game);
  }
}

export class Walk extends State {
  constructor(player, game) {
    super('WALK');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
    this.player.frameY = 17 + this.player.direction;
    this.player.moveRand = Math.floor(Math.random() * 2);
  }
  handleInput(input) {
    if (this.game.end == true) this.player.setState(states.STANDING);
    else if (this.player.fightertype === 'h') {
      var collisionr = 0;
      var collisionl = 0;
      if (((input.lastKey === 'PRESS a' || input.lastKey === 'PRESS b') && ((this.player.direction === 0 && input.keys.indexOf('ArrowLeft') > -1) || (this.player.direction === 1 && input.keys.indexOf('ArrowRight') > -1))) || ((input.lastKey === 'PRESS left' || input.lastKey === 'PRESS right') && ((this.player.direction === 0 && input.keys.indexOf('a') > -1) || (this.player.direction === 1 && input.keys.indexOf('s') > -1)))) {
        this.player.setState(states.BLOCK);
      } else if ((input.lastKey === 'PRESS c' && ((this.player.direction === 0 && input.keys.indexOf('ArrowLeft') > -1) || (this.player.direction === 1 && input.keys.indexOf('ArrowRight') > -1))) || input.keys.indexOf('d') > -1 && ((this.player.direction === 0 && input.lastKey === 'PRESS left') || (this.player.direction === 1 && input.lastKey === 'PRESS right'))) {
        this.player.enemies.forEach(enemy => {
          this.game.enemyThrown = throwMove(this.player, this.game.enemyThrown);
        });
      } else if (input.lastKey === 'PRESS a') {
        punch(this.player);
      } else if (input.lastKey === 'PRESS b') {
        kick(this.player);
      } else if (input.lastKey === 'PRESS c') {
        this.player.setState(states.JUMPKICK);
      } else if (input.keys.indexOf('ArrowRight') > -1) {
        if (input.keys.indexOf('ArrowLeft') > -1) {
          if (this.game.mode === 'training') {
            this.player.direction = 1;
            this.player.frameY = 18;
          }
          this.player.enemies.forEach(enemy => {
            if (collision(this.player, enemy, this.player.direction) === true && this.player.direction === 1) collisionl++;
          });
          if (collisionl == 0) this.game.movement('left', this.player, this.player.speed);
        } else {
          if (this.game.mode === 'training') {
            this.player.direction = 0;
            this.player.frameY = 17;
          }
          this.player.enemies.forEach(enemy => {
            if (collision(this.player, enemy, this.player.direction) === true && this.player.direction === 0) collisionr++;
          });
          if (collisionr == 0) this.game.movement('right', this.player, this.player.speed);
        }
      } else if (input.keys.indexOf('ArrowLeft') > -1) {
        if (input.keys.indexOf('ArrowRight') > -1) {
          if (this.game.mode === 'training') {
            this.player.direction = 0;
            this.player.frameY = 17;
          }
          this.player.enemies.forEach(enemy => {
            if (collision(this.player, enemy, this.player.direction) === true && this.player.direction === 0) collisionr++;
          });
          if (collisionr == 0) this.game.movement('right', this.player, this.player.speed);
        } else {
          if (this.game.mode === 'training') {
            this.player.direction = 1;
            this.player.frameY = 18;
          }
          this.player.enemies.forEach(enemy => {
            if (collision(this.player, enemy, this.player.direction) === true && this.player.direction === 1) collisionl++;
          });
          if (collisionl == 0) this.game.movement('left', this.player, this.player.speed);
        }
      } else if (input.keys.indexOf('ArrowLeft') <= -1 || input.keys.indexOf('ArrowRight') <= -1) {
        this.player.setState(states.STANDING);
      }
    } else {
      if (this.game.mode === 'kumite') enemyAi(this.player, this.game);
      if (this.player.moveRand === 0) this.game.movement('right', this.player, this.player.speed);
      else this.game.movement('left', this.player, this.player.speed);
    }
  }
}

export class Punch1 extends State {
  constructor(player, game) {
    super('PUNCH1');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
    this.player.frameY = 19 + this.player.direction;
    if (this.player.enemies[0].fightertype !== 'h' && this.game.mode === 'kumite' && enemyBlock(this.player.enemies[0]) == true) this.player.enemies[0].setState(states.BLOCK);
  }
  handleInput(input) {
    if (this.player.frameX === getStrikeFrame('PUNCH1')) {
      this.player.enemies.forEach(enemy => {
        if (strikeRange(this.player, enemy, this.player.direction) === true) enemy.setState(states.HIT);
      });
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Punch2 extends State {
  constructor(player, game) {
    super('PUNCH2');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 4;
    this.player.frameY = 21 + this.player.direction;
    if (this.player.enemies[0].fightertype !== 'h' && this.game.mode === 'kumite' && enemyBlock(this.player.enemies[0]) == true) this.player.enemies[0].setState(states.BLOCK);
  }
  handleInput(input) {
    if (this.player.frameX === getStrikeFrame('PUNCH2')) {
      this.player.enemies.forEach(enemy => {
        if (strikeRange(this.player, enemy, this.player.direction) === true) enemy.setState(states.HIT);
      });
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Punch3 extends State {
  constructor(player, game) {
    super('PUNCH3');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 7;
    this.player.frameY = 23 + this.player.direction;
    if (this.player.enemies[0].fightertype !== 'h' && this.game.mode === 'kumite' && enemyBlock(this.player.enemies[0]) == true) this.player.enemies[0].setState(states.BLOCK);
  }
  handleInput(input) {
    if (this.player.frameX === getStrikeFrame('PUNCH3')) {
      this.player.enemies.forEach(enemy => {
        if (strikeRange(this.player, enemy, this.player.direction) === true) enemy.setState(states.FALL);
      });
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Kick1 extends State {
  constructor(player, game) {
    super('KICK1');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 3;
    this.player.frameY = 25 + this.player.direction;
    if (this.player.enemies[0].fightertype !== 'h' && this.game.mode === 'kumite' && enemyBlock(this.player.enemies[0]) == true) this.player.enemies[0].setState(states.BLOCK);
  }
  handleInput(input) {
    if (this.player.frameX === getStrikeFrame('KICK1')) {
      this.player.enemies.forEach(enemy => {
        if (strikeRange(this.player, enemy, this.player.direction) === true) enemy.setState(states.HIT);
      });
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Kick2 extends State {
  constructor(player, game) {
    super('KICK2');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 4;
    this.player.frameY = 27 + this.player.direction;
    if (this.player.enemies[0].fightertype !== 'h' && this.game.mode === 'kumite' && enemyBlock(this.player.enemies[0]) == true) this.player.enemies[0].setState(states.BLOCK);
  }
  handleInput(input) {
    if (this.player.frameX === getStrikeFrame('KICK2')) {
      this.player.enemies.forEach(enemy => {
        if (strikeRange(this.player, enemy, this.player.direction) === true) enemy.setState(states.HIT);
      });
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Kick3 extends State {
  constructor(player, game) {
    super('KICK3');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 7;
    this.player.frameY = 29 + this.player.direction;
    if (this.player.enemies[0].fightertype !== 'h' && this.game.mode === 'kumite' && enemyBlock(this.player.enemies[0]) == true) this.player.enemies[0].setState(states.BLOCK);
  }
  handleInput(input) {
    if (this.player.frameX === getStrikeFrame('KICK3')) {
      this.player.enemies.forEach(enemy => {
        if (strikeRange(this.player, enemy, this.player.direction) === true) enemy.setState(states.FALL);
      });
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Jumpkick extends State {
  constructor(player, game) {
    super('JUMPKICK');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 4;
    this.player.frameY = 31 + this.player.direction;
    if (this.player.enemies[0].fightertype !== 'h' && this.game.mode === 'kumite' && enemyBlock(this.player.enemies[0]) == true) this.player.enemies[0].setState(states.BLOCK);
    this.player.moveRand = Math.floor(Math.random() * 2);
  }
  handleInput(input) {
    if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    } else {
      if (this.player.frameX === getStrikeFrame('JUMPKICK')) {
        this.player.enemies.forEach(enemy => {
          if (strikeRange(this.player, enemy, this.player.direction) === true) enemy.setState(states.HIT);
        });
      }
      if (this.player.fightertype === 'h') {
        var collisions = 0;
        this.player.enemies.forEach(enemy => {
          if (collision(this.player, enemy, this.player.direction) === true) collisions++;
        });
        if (collisions == 0) {
          if (input.keys.indexOf('ArrowLeft') > -1) this.game.movement('left', this.player, this.player.speed);
          if (input.keys.indexOf('ArrowRight') > -1) this.game.movement('right', this.player, this.player.speed);
        }
      } else if (this.player.fightertype !== 'h' && collision(this.player, this.player.enemies[0], this.player.direction) === false) {
        if (this.player.moveRand === 0) this.game.movement('right', this.player, this.player.speed);
        else this.game.movement('left', this.player, this.player.speed);
      }
    }
  }
}

export class Hit extends State {
  constructor(player, game) {
    super('HIT');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = getHitMaxFrame(this.player.enemies[0].currentState.state);
    this.player.frameY = getHitFrameY(this.player.enemies[0].currentState.state, this.player.enemies[0].no, this.player.direction);
    if (this.player.frameTimer > this.player.frameInterval) {
      if (this.player.frameX === 0) this.game.addBlood(this.player);
      if (this.game.mode === 'kumite' && this.player.health>0) this.player.health-=((this.player.enemies[0].attack-this.player.defense)*2);
    }
    if (this.player.frameX === 0) getSfx(this.player.enemies[0].currentState.state, this.game);
  }
  handleInput(input) {
    if (this.player.health <= 0) {
      this.player.setState(states.FALL);
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
    if (this.player.direction === 0) this.game.movement('left', this.player, 1);
    else this.game.movement('right', this.player, 1);
  }
}

export class Fall extends State {
  constructor(player, game) {
    super('FALL');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = getFallFrameY(this.player.enemies[0].currentState.state, this.player.enemies[0].no, this.player.direction);
    if (this.player.frameTimer > this.player.frameInterval) {
      if (this.player.frameX === 0) this.game.addBlood(this.player);
      if (this.game.mode === 'kumite' && this.player.health>0) this.player.health-=((this.player.enemies[0].attack-this.player.defense)*2);
    }
    if (this.player.frameX === 0) this.game.audioPlay(this.game.audioHit3);
  }
  handleInput(input) {
    if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.RECOVER);
    }
    if (this.player.direction === 0) this.game.movement('left', this.player, 1);
    else this.game.movement('right', this.player, 1);
  }
}

export class Block extends State {
  constructor(player, game) {
    super('BLOCK');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.hit = 0;
    this.player.strike = 0;
    this.player.frameX = 0;
    if (this.player.enemies[0].currentState.state === 'PUNCH1' || this.player.enemies[0].currentState.state === 'KICK1') {
      //punch/kick 1
      this.player.maxFrame = 1;
    } else if (this.player.enemies[0].currentState.state === 'PUNCH2' || this.player.enemies[0].currentState.state === 'KICK2' || this.player.enemies[0].currentState.state === 'JUMPKICK') {
      //punch/kick 2 + jumpkick
      this.player.maxFrame = 2;
    } else if (this.player.enemies[0].currentState.state === 'PUNCH3' || this.player.enemies[0].currentState.state === 'KICK3') {
      // punch/kick 3
      this.player.maxFrame = 4;
    } else {
      this.player.maxFrame = 4;
    }
    this.player.frameY = 35 + this.player.direction;
  }
  handleInput(input) {
    if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Throw extends State {
  constructor(player, game) {
    super('THROW');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 1;
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 33 + this.player.direction;
  }
  handleInput(input) {
    if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class Thrown extends State {
  constructor(player, game) {
    super('THROWN');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 11 + this.player.direction;
    if (this.game.mode === 'kumite' && this.player.health>0) this.player.health-=((this.player.enemies[0].attack-this.player.defense)*3);
  }
  handleInput(input) {
    if ((this.player.direction === 0 && this.player.x+this.player.width <= this.game.width+50) || (this.player.direction === 1 && this.player.x >= -50)) {
      if (this.player.frameX > 0 && this.player.frameX <= 3) {
        if (this.player.direction === 0) this.game.movement('right', this.player, 5);
        else this.game.movement('left', this.player, 5);
      } else {
        if (this.player.direction === 0) this.game.movement('right', this.player, 1);
        else this.game.movement('left', this.player, 1);
      }
    }
    if (this.player.frameX >= this.player.maxFrame) {
      this.game.enemyThrown = null;
      this.player.setState(states.RECOVER);
    }
  }
}

export class Recover extends State {
  constructor(player, game) {
    super('RECOVER');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 6;
    this.player.frameY = 13 + this.player.direction;
    if (this.player.fightertype === 't1') {
      this.player.order = -1;
      this.game.fighter2.order = 0;
    } else if (this.player.fightertype === 't2') {
      this.player.order = -1;
      this.game.fighter1.order = 0;
    }
  }
  handleInput(input) {
    if (this.player.health <= 0) {
      this.player.frameTimer = 0;
    } else if (this.player.frameX >= this.player.maxFrame) {
      this.player.setState(states.STANDING);
    }
  }
}

export class End extends State {
  constructor(player, game) {
    super('END');
    this.player = player;
    this.game = game;
  }
  enter() {
    this.player.strike = 0;
    this.player.frameX = 0;
    this.player.maxFrame = 4;
    if (this.player.health > this.player.enemies[0].health) {
      this.player.frameY = 37;
      this.player.strike = 1;
    } else {
      this.player.frameY = 38;
    }
  }
  handleInput(input) {
    if (this.player.frameX >= this.player.maxFrame) {
      this.player.frameTimer = 0;
      this.player.frameX = this.player.maxFrame;
    }
  }
}

function punch(player) {
  var rand = Math.floor(Math.random() * 3);
  if (rand === 0) player.setState(states.PUNCH1);
  else if (rand === 1) player.setState(states.PUNCH2);
  else if (rand === 2) player.setState(states.PUNCH3);
}

function kick(player) {
  var rand = Math.floor(Math.random() * 3);
  if (rand === 0) player.setState(states.KICK1);
  else if (rand === 1) player.setState(states.KICK2);
  else if (rand === 2) player.setState(states.KICK3);
}

function hit(enemy) {
  if (
    enemy.currentState.state === 'PUNCH1' ||
    enemy.currentState.state === 'PUNCH2' ||
    enemy.currentState.state === 'PUNCH3' ||
    enemy.currentState.state === 'KICK1' ||
    enemy.currentState.state === 'KICK2' ||
    enemy.currentState.state === 'KICK3' ||
    enemy.currentState.state === 'JUMPKICK'
  ) return true;
  else return false;
}

function collision(player, enemy, direction) {
  if (direction === 0 && enemy.x > player.x && player.x+(player.width/2)+50 >= enemy.x+(enemy.width/2)) return true;
  else if (direction === 1 && enemy.x < player.x && player.x+(player.width/2)-50 <= enemy.x+(enemy.width/2)) return true;
  else return false;
}

function strikeRange(player, enemy, direction) {
  var result = false;
  if (enemy.currentState.state !== 'BLOCK') {
    if (direction === 0 && player.x <= enemy.x && player.x+(player.width/2)+60 >= enemy.x+(enemy.width/2)) result = true;
    else if (direction === 1 && player.x >= enemy.x && player.x+(player.width/2)-60 <= enemy.x+(enemy.width/2)) result = true;
  }
  return result;
}

function enemyBlock(enemy) {
  var rand = Math.floor(Math.random() * 3);
  if (rand === 0) return true;
  else return false;
}

function getStrikeFrame(state) {
  if (state === 'PUNCH1' || state === 'KICK1' || state === 'PUNCH2') return 1;
  else if (state === 'KICK2' || state === 'PUNCH3' || state === 'KICK3' || state === 'JUMPKICK') return 2;
}

function getHitMaxFrame(state) {
  if (state === 'PUNCH1' || state === 'KICK1' || state === 'JUMPKICK') return 2;
  else if (state === 'PUNCH2' || state === 'KICK2') return 3;
}

function getSfx(state, game) {
  if (state === 'PUNCH1' || state === 'KICK1') game.audioPlay(game.audioHit1);
  else if (state === 'PUNCH2' || state === 'KICK2' || state === 'JUMPKICK') game.audioPlay(game.audioHit2);
}

function getHitFrameY(state, no, direction) {
  if (no === 0) {
    if (state === 'PUNCH1') return 3 + direction;
    else if (state === 'PUNCH2') return 3 + direction;
    else if (state === 'KICK1') return 5 + direction;
    else if (state === 'KICK2') return 3 + direction;
    else if (state === 'JUMPKICK') return 5 + direction;
  } else if (no === 1) {
    if (state === 'PUNCH1') return 5 + direction;
    else if (state === 'PUNCH2') return 5 + direction;
    else if (state === 'KICK1') return 5 + direction;
    else if (state === 'KICK2') return 5 + direction;
    else if (state === 'JUMPKICK') return 5 + direction;
  } else if (no === 2) {
    if (state === 'PUNCH1') return 5 + direction;
    else if (state === 'PUNCH2') return 3 + direction;
    else if (state === 'KICK1') return 5 + direction;
    else if (state === 'KICK2') return 5 + direction;
    else if (state === 'JUMPKICK') return 5 + direction;
  }
}

function getFallFrameY(state, no, direction) {
  if (no === 0) {
    if (state === 'PUNCH1') return 7 + direction;
    else if (state === 'PUNCH2') return 7 + direction;
    else if (state === 'PUNCH3') return 7 + direction;
    else if (state === 'KICK1') return 9 + direction;
    else if (state === 'KICK2') return 7 + direction;
    else if (state === 'KICK3') return 9 + direction;
    else if (state === 'JUMPKICK') return 9 + direction;
  } else if (no === 1) {
    if (state === 'PUNCH1') return 9 + direction;
    else if (state === 'PUNCH2') return 9 + direction;
    else if (state === 'PUNCH3') return 7 + direction;
    else if (state === 'KICK1') return 9 + direction;
    else if (state === 'KICK2') return 9 + direction;
    else if (state === 'KICK3') return 9 + direction;
    else if (state === 'JUMPKICK') return 9 + direction;
  } else if (no === 2) {
    if (state === 'PUNCH1') return 9 + direction;
    else if (state === 'PUNCH2') return 7 + direction;
    else if (state === 'PUNCH3') return 9 + direction;
    else if (state === 'KICK1') return 9 + direction;
    else if (state === 'KICK2') return 9 + direction;
    else if (state === 'KICK3') return 7 + direction;
    else if (state === 'JUMPKICK') return 9 + direction;
  }
}

function throwMove(player, enemyThrown) {
  player.setState(states.THROW);
  player.enemies.forEach(enemy => {
    if (strikeRange(player, enemy, player.direction) === true && enemyThrown == null) enemyThrown = enemy;
  });
  if (enemyThrown !== null) {
    enemyThrown.setState(states.THROWN);
  }
  return enemyThrown;
}

function enemyAi(player, game) {
  if (collision(player, player.enemies[0], player.direction) === true && (player.enemies[0].currentState.state == 'STANDING' || player.enemies[0].currentState.state == 'WALK')) {
    var rand = Math.floor(Math.random() * 9);
    if (rand === 0) game.enemyThrown = throwMove(player, game.enemyThrown);
    else if (rand === 1) player.setState(states.JUMPKICK);
    else if (rand <= 3) punch(player);
    else if (rand <= 5) kick(player);
    else player.setState(states.STANDING);
  } else if (player.frameX >= player.maxFrame) {
    var rand = Math.floor(Math.random() * 7);
    if (rand >= 3) player.setState(states.WALK);
    else if (rand >= 1)  player.setState(states.STANDING);
    else player.setState(states.JUMPKICK);
  }
}