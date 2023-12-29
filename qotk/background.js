export default class Background {
  constructor(game) {
    this.game = game;
    this.height = 224;
    this.width = 448;
    this.x = -64;
    this.y = 0;
    this.image = document.getElementById('kumite');
    this.frameY = 0;
    this.maxFrame = 5;
		this.frameTimer = 0;
		this.frameInterval = 1000/this.game.fps;
  }
  update(deltaTime) {
    //sprite animation
    if (this.frameTimer > this.frameInterval) {
			if (this.frameY >= this.maxFrame) this.frameY = 0;
			else this.frameY++;
			this.frameTimer = 0;
		} else {
			this.frameTimer += deltaTime;
		}
  }
  draw(context){
    context.imageSmoothingEnabled = false;
    context.drawImage(this.image, 0, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
  }
  reset(id) {
    this.id = id;
    this.x = 0;
    this.width = 320;
    if (this.game.mode === 'kumite') {
      this.width = 448;
      this.x = -64;
    }
    this.image = document.getElementById(id);
  }
}