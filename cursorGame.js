var gamePiece;
var wall;
var gameStopped;

var enterKey = function(event){
if(event.keyCode == 13) {
  clearInterval(this.interval);
  startGame();
    }
  }

function startGame() {
  gameArea.start();
  wall = [];

  document.body.removeEventListener("keyup", enterKey, true);
  document.body.style.background = "url(https://steamuserimages-a.akamaihd.net/ugc/100603056096583419/1BF135E054FC854BBA9C6447DCA3904BBA311C99/)";

  score = new component("30px", "Consolas", "white", 10, 30, "text");
  gamePiece = new component(16, 16, "red", 10, 120);
  gameOverText = new component("60px","Consolas", "red", innerWidth/2, innerHeight/2, "text");
  restartGameText = new component("40px", "Consolas", "white", innerWidth/2, innerHeight/2 + 100 , "text");

  if (this.interval == null) {
    this.interval = setInterval(updateGameArea, 1000/144);
  }
}

var gameArea = {
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
    this.canvas.style.cursor = "none"; // hiding the original cursor
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;

    window.addEventListener('mousemove', function (e) {
      gameArea.x = e.pageX;
      gameArea.y = e.pageY;
    })
  },
  clear : function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  },
  stop : function() {
    gameStopped = true;
    this.canvas.style.cursor = "default";
    this.context = this.canvas.getContext("2d");
    this.context.textAlign = "center";

    document.body.addEventListener("keyup", enterKey, true);
    document.body.style.background = "black";

    gameOverText.text="GAME OVER";
    gameOverText.update();

    restartGameText.text="press 'ENTER' to start a new game!";
    restartGameText.update();
    }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.update = function() {
        ctx = gameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < wall.length; i += 1) {
      if (gamePiece.crashWith(wall[i])) {
          gameArea.stop();
          return;
      }
    }

    gameArea.clear();
    gameArea.frameNo += 1;
    if (gameArea.frameNo == 1 || everyInterval(300)) {
        x = gameArea.canvas.width;
        minHeight = 200;
        maxHeight = 500;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 70;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        wall.push(new component(50, height, "black", x, 0, "image"));
        wall.push(new component(50, x - height - gap, "black", x, height + gap));

          if (gameArea.frameNo > 1500) {
            wall.push(new component(50, height, "blue", x, 0, "image"));
            wall.push(new component(50, x - height - gap, "blue", x, height + gap));
            document.body.style.background = "url(https://steamuserimages-a.akamaihd.net/ugc/100603056096642547/028134A3F9AC9B7560FDD0DFD8A3DC8B749D9D71/)";
          }

          if (gameArea.frameNo > 5000) {
            wall.push(new component(50, height, "green", x, 0, "image"));
            wall.push(new component(50, x - height - gap, "green", x, height + gap));
            document.body.style.background = "url(https://vignette.wikia.nocookie.net/terrariafanideas/images/5/50/Wiki-background/revision/latest?cb=20140420201040)";
          }
    }
    for (i = 0; i < wall.length; i += 1) {
        wall[i].speedX = -1;
        wall[i].newPos();
        wall[i].update();
    }

    if (gameArea.x && gameArea.y) {
        gamePiece.x = gameArea.x;
        gamePiece.y = gameArea.y;
    }

    score.text="SCORE: " + gameArea.frameNo;
    score.update();
    gamePiece.newPos();
    gamePiece.update();
  }

function everyInterval(n) {
  if ((gameArea.frameNo / n) % 1 == 0) {return true;}
  return false;
}
