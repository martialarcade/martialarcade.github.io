import InputHandler from './input.js';
import {
  Title,
  Main,
  HowTo,
  About,
  Select,
  Outfit
} from './menuStates.js';

export default class Menu {
  constructor(game, width, height, menuCanvas) {
    this.game = game;
    this.width = width;
    this.height = height;
    this.bg = document.getElementById('menuBg');
    this.frame = document.getElementById('menuFrame');
    this.title = document.getElementById('menuTitle');
    this.btnWidth = 70;
    this.btnHeight = 25;
    this.menuMain =document.getElementById('menuMain');
    this.menuMainY = (this.height/2)-13;
    this.menuMainNo = 0;
    this.menuMainOutline = new menuMainOutline(this);
    this.select = document.getElementById('select');
    this.selectFighter = this.game.fighter0.no;
    this.selectOutfit = this.game.fighter0.outfit;
    this.selectX = (this.width/2)-45-(this.selectFighter*90);
    this.selectOutfitX = (this.width/2)-45;
    this.selectOutline = document.getElementById('selectOutline');
    this.howTo = document.getElementById('howTo');
    this.about = document.getElementById('about');
    this.states = [
      new Title(this, this.game),
      new Main(this, this.game),
      new HowTo(this, this.game),
      new About(this, this.game),
      new Select(this, this.game),
      new Outfit(this, this.game)
    ];
    this.currentState = this.states[0];
    this.mode = 'kumite';
    this.input = new InputHandler(this.game, this);
  }
  update(context) {
    //pause
    gameCanvas.addEventListener('click', (e) => {
      var mousePos = this.getMousePos(gameCanvas, e);
      if (this.isInside(mousePos, this.game.background) && document.getElementById("pause").value == 0) {
        document.getElementById("pause").value = 1;
      }
    }, false);
    if (document.getElementById("pause").value == 1) {
      this.currentState.enter(context);
      this.currentState.handleInput(this.game.input, context);
    } else if (this.game.input.lastKey === 'PRESS pause') {
      document.getElementById("pause").value = 1;
    }
  }
  setState(state, context) {
	  this.currentState = this.states[state];
	  this.currentState.enter(context);
	}
	getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    var ratio = gameCanvas.width/gameCanvas.offsetWidth;
    return {
      x: (event.clientX - rect.left)*ratio,
      y: (event.clientY - rect.top)*ratio,
    };
  }
  isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
  }
}

class menuMainOutline {
  constructor(menu) {
    this.menu = menu;
    this.image = document.getElementById('menuMainOutline');
    this.x = (this.menu.width/2)-36;
    this.y = (this.menu.height/2)-13;
    this.width = 72;
    this.height = 26;
  }
}