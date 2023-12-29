const states = {
  TITLE: 0,
  MAIN: 1,
  HOWTO: 2,
  ABOUT: 3,
  SELECT: 4,
  OUTFIT: 5,
}

class State {
  constructor(state) {
    this.state = state;
  }
}

export class Title extends State {
  constructor(menu, game) {
    super('TITLE');
    this.menu = menu;
    this.game = game;
  }
  enter(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(this.menu.bg, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.frame, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.title, 0, 0, this.menu.width, this.menu.height);
  }
  handleInput(input, context) {
    if (input.lastKey === 'PRESS a' || input.lastKey === 'PRESS b' || input.lastKey === 'PRESS c' || input.lastKey === 'PRESS pause') {
      this.game.audioPlay(this.game.audioIntro);
      input.lastKey = '';
      this.menu.setState(1, context);
    }
  }
}

export class Main extends State {
  constructor(menu, game) {
    super('MAIN');
    this.menu = menu;
    this.game = game;
  }
  enter(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(this.menu.bg, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.menuMain, (this.menu.width/2)-35, this.menu.menuMainY, 70, 120);
    context.drawImage(this.menu.menuMainOutline.image, this.menu.menuMainOutline.x, this.menu.menuMainOutline.y, this.menu.menuMainOutline.width, this.menu.menuMainOutline.height);
    context.drawImage(this.menu.frame, 0, 0, this.menu.width, this.menu.height);
  }
  handleInput(input, context) {
    if (input.lastKey === 'PRESS a') {
      this.game.audioPlay(this.game.audioSelect);
      input.lastKey = '';
      if (this.menu.menuMainNo == 0) {
        this.menu.mode = 'kumite';
        this.menu.setState(4, context);
      } else if (this.menu.menuMainNo == 1) {
        this.menu.mode = 'training';
        this.menu.setState(4, context);
      } else {
        this.menu.setState(this.menu.menuMainNo, context);
      }
    } else if (input.lastKey === 'PRESS b' && this.game.start == true) {
      input.lastKey = '';
      this.menu.menuMainNo = 0;
      this.menu.menuMainY = (this.menu.height/2)-13;
      document.getElementById("pause").value = 0;
    } else if (input.lastKey === 'PRESS left' && this.menu.menuMainNo > 0) {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.menuMainNo--; 
      this.menu.menuMainY += 30;
    } else if (input.lastKey === 'PRESS right' && this.menu.menuMainNo < 3) {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.menuMainNo++;
      this.menu.menuMainY -= 30;
    }
  }
}

export class HowTo extends State {
  constructor(menu, game) {
    super('HOWTO');
    this.menu = menu;
    this.game = game;
  }
  enter(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(this.menu.bg, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.howTo, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.frame, 0, 0, this.menu.width, this.menu.height);
  }
  handleInput(input, context) {
    if (input.lastKey === 'PRESS b') {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.setState(1, context);
    }
  }
}

export class About extends State {
  constructor(menu, game) {
    super('ABOUT');
    this.menu = menu;
    this.game = game;
  }
  enter(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(this.menu.bg, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.about, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.frame, 0, 0, this.menu.width, this.menu.height);
  }
  handleInput(input, context) {
    if (input.lastKey === 'PRESS b') {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.setState(1, context);
    }
  }
}

export class Select extends State {
  constructor(menu, game) {
    super('SELECT');
    this.menu = menu;
    this.game = game;
  }
  enter(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(this.menu.bg, 0, 0, this.menu.width, this.menu.height);
    var i = 0;
    while (i<this.game.getFighters().length) {
      context.drawImage(this.menu.select, i*90, 0, 90, 173, this.menu.selectX+(i*90), 25, 90, 173);
      context.drawImage(document.getElementById('fighter'+i+'_0'), 0, 0, 151, 151, this.menu.selectX+(i*90)-30, 38, 151, 151);
      i++;
    }
    context.drawImage(this.menu.frame, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.selectOutline, (this.menu.width/2)-45, 24, 91, 175);
  }
  handleInput(input, context) {
    if (input.lastKey === 'PRESS a') {
      this.game.audioPlay(this.game.audioSelect);
      input.lastKey = '';
      if (this.game.fighter0.no !== this.menu.selectFighter) {
        this.menu.selectOutfit = 0;
        this.menu.selectOutfitX = (this.menu.width/2)-45;
      }
      this.menu.setState(5, context);
    } else if (input.lastKey === 'PRESS b') {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.setState(1, context);
    } else if (input.lastKey === 'PRESS left' && this.menu.selectFighter > 0) {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.selectFighter--;
      this.menu.selectX = (this.menu.width/2)-45-(this.menu.selectFighter*90);
    } else if (input.lastKey === 'PRESS right' && this.menu.selectFighter < (this.game.getFighters().length-1)) {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.selectFighter++;
      this.menu.selectX = (this.menu.width/2)-45-(this.menu.selectFighter*90);
    }
  }
}

export class Outfit extends State {
  constructor(menu, game) {
    super('OUTFIT');
    this.menu = menu;
    this.game = game;
  }
  enter(context) {
    context.imageSmoothingEnabled = false;
    context.drawImage(this.menu.bg, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.select, this.menu.selectFighter*90, 0, 90, 173, (this.menu.width/2)-45, 25, 90, 173);
    var i = 0;
    while (i<2) {
      context.drawImage(document.getElementById('fighter'+this.menu.selectFighter+'_'+i), 0, 0, 151, 151, this.menu.selectOutfitX+(i*90)-30, 38, 151, 151);
      i++;
    }
    context.drawImage(this.menu.frame, 0, 0, this.menu.width, this.menu.height);
    context.drawImage(this.menu.selectOutline, (this.menu.width/2)-45, 24, 91, 175);
  }
  handleInput(input, context) {
    if (input.lastKey === 'PRESS a') {
      this.game.audioPlay(this.game.audioStart);
      input.lastKey = '';
      this.game.fighter0.no = this.menu.selectFighter;
      this.game.fighter0.outfit = this.menu.selectOutfit;
      this.menu.menuMainNo = 0;
      this.menu.menuMainY = (this.menu.height/2)-13;
      this.menu.setState(1, context);
      this.game.reset(this.menu.mode);
    } else if (input.lastKey === 'PRESS b') {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.setState(4, context);
    } else if (input.lastKey === 'PRESS left' && this.menu.selectOutfit > 0) {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.selectOutfit--;
      this.menu.selectOutfitX = (this.menu.width/2)-45-(this.menu.selectOutfit*90);
    } else if (input.lastKey === 'PRESS right' && this.menu.selectOutfit < 1) {
      this.game.audioPlay(this.game.audioOption);
      input.lastKey = '';
      this.menu.selectOutfit++;
      this.menu.selectOutfitX = (this.menu.width/2)-45-(this.menu.selectOutfit*90);
    }
  }
}