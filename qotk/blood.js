export default class Blood {
  constructor(game, player) {
    this.game = game;
    this.player = player;
    this.width = 151;
    this.height = 151;
    this.x = player.x;
    this.y = this.game.height - this.height - 41;
    this.image = document.getElementById('blood');
    this.frameX = 0;
    this.frameY = this.frameY = this.getFrameY(this.player.enemies[0].currentState.state, this.player.enemies[0].no, this.player.direction);
    this.maxFrame = 2;
	  this.frameTimer = 0;
	  this.time = 0;
	  this.frameInterval = 1000/this.game.fps;
  }
  update(input, deltaTime) {
    //sprite animation
    if (this.frameTimer > this.frameInterval) {
      if (this.frameX >= this.maxFrame) {
        this.frameX = this.maxFrame;
		  } else this.frameX++;
		  this.frameTimer = 0;
		  this.time += 1/this.game.fps;
	  } else {
		  this.frameTimer += deltaTime;
	  }
  }
  draw(context){
    context.imageSmoothingEnabled = false;
    context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
  getFrameY(state, no, direction) {
    var add = 0;
    if (direction === 1) add = 2;
    if (no === 0) {
      if (state === 'PUNCH1') return 1 + add;
      else if (state === 'PUNCH2') return 1 + add;
      else if (state === 'KICK1') return 0 + add;
      else if (state === 'KICK2') return 1 + add;
      else if (state === 'JUMPKICK') return 0 + add;
    } else if (no === 1) {
      if (state === 'PUNCH1') return 0 + add;
      else if (state === 'PUNCH2') return 0 + add;
      else if (state === 'KICK1') return 0 + add;
      else if (state === 'KICK2') return 0 + add;
      else if (state === 'JUMPKICK') return 0 + add;
    } else if (no === 2) {
      if (state === 'PUNCH1') return 0 + add;
      else if (state === 'PUNCH2') return 1 + add;
      else if (state === 'KICK1') return 0 + add;
      else if (state === 'KICK2') return 0 + add;
      else if (state === 'JUMPKICK') return 0 + add;
    }
  }
}