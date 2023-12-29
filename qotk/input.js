export default class InputHandler {
  constructor(game, menu) {
    this.game = game;
    this.menu = menu;
    this.keys = [];
    //keyboard
    window.addEventListener('keydown', (e) => {
      switch(e.key){
			  case "ArrowLeft":
			    if (!e.repeat && this.keys.indexOf(e.key) === -1) {
			      this.lastKey = "PRESS left";
  			    this.keys.push(e.key);
			    }
			    break;
			  case "ArrowRight":
			    if (!e.repeat && this.keys.indexOf(e.key) === -1) {
			      this.lastKey = "PRESS right";
  			    this.keys.push(e.key);
			    }
			    break;
	      case "a":
			    if (!e.repeat && this.keys.indexOf(e.key) === -1) {
			      this.lastKey = "PRESS a";
			      this.keys.push(e.key);
			    }
			    break;
			  case "s":
			    if (!e.repeat && this.keys.indexOf(e.key) === -1) {
			      this.lastKey = "PRESS b";
			      this.keys.push(e.key);
			    }
			    break;
			 case "d":
			    if (!e.repeat && this.keys.indexOf(e.key) === -1) {
			      this.lastKey = "PRESS c";
			      this.keys.push(e.key);
			    }
			    break;
			 case " ":
			    if (!e.repeat && this.keys.indexOf(e.key) === -1) {
			      this.lastKey = "PRESS pause";
			      this.keys.push(e.key);
			    }
			    break;
			}
    });
    window.addEventListener('keyup', (e) => {
      this.lastKey = "";
			this.keys.splice(this.keys.indexOf(e.key), 1);
    });
    //touches
    leftBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!e.repeat && this.keys.indexOf("ArrowLeft") === -1) {
        this.lastKey = "PRESS left";
        this.keys.push("ArrowLeft");
      }
    });
    rightBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!e.repeat && this.keys.indexOf("ArrowRight") === -1) {
        this.lastKey = "PRESS right";
        this.keys.push("ArrowRight");
      }
    });
    aBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!e.repeat && this.keys.indexOf("a") === -1) {
        this.lastKey = "PRESS a";
        this.keys.push("a");
      }
    });
    bBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!e.repeat && this.keys.indexOf("b") === -1) {
        this.lastKey = "PRESS b";
        this.keys.push("s");
      }
    });
    cBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (!e.repeat && this.keys.indexOf("c") === -1) {
        this.lastKey = "PRESS c";
        this.keys.push("d");
      }
    });
    leftBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.lastKey = '';
      this.keys.splice(this.keys.indexOf("ArrowLeft"), 1);
    });
    rightBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.lastKey = '';
      this.keys.splice(this.keys.indexOf("ArrowRight"), 1);
    });
    aBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.lastKey = '';
      this.keys.splice(this.keys.indexOf("a"), 1);
    });
    bBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.lastKey = '';
      this.keys.splice(this.keys.indexOf("s"), 1);
    });
    cBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.lastKey = '';
      this.keys.splice(this.keys.indexOf("d"), 1);
    });
  }
  update(deltaTime) {
    this.lastKey = "";
  }
}