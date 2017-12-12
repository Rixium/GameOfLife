var gridSizeWidth;
var gridSizeHeight;
var grid = [];
var canvas;
var cellSize = 5;

var hitButton = false;
var hiddenButton = false;
var started = false;
var startButton;
var drawButton;
var gridCopy;
var shouldDraw = true;

function setup() {
  frameRate(20);
  canvas = createCanvas(displayWidth / 1.5, displayHeight / 1.5);

  gridSizeWidth = canvas.width / cellSize;
  gridSizeHeight = canvas.height / cellSize;
  grid = create2DArray(grid);

  var button = createButton('Clear');
  button.position(20, 20);
  button.mousePressed(clearGrid);

  startButton = createButton('Start / Stop');
  startButton.position(button.x, button.y + 50);
  startButton.mousePressed(startSimulation);

  drawButton = createButton('Draw / Erase');
  drawButton.position(button.x, startButton.y + 50);
  drawButton.mousePressed(setDraw);

  var hideButton = createButton('Hide / Unhide Message');
  hideButton.position(button.x, drawButton.y + 50);
  hideButton.mousePressed(setHidden);
}

function setHidden() {
  hiddenButton = !hiddenButton;
}
function setDraw() {
  shouldDraw = !shouldDraw;
}

function startSimulation() {
  hitButton = true;
  started = !started;
}

function clearGrid() {
  hitButton = true;
  for(var i = 0; i < gridSizeWidth; i++) {
    for(var j = 0; j < gridSizeHeight; j++) {
      grid[i][j] = 0;
    }
  }
}

function mouseReleased() {
  hitButton = false;
}

function drawCells() {
  for(var i = 0; i < gridSizeWidth; i++) {
    for(var j = 0; j < gridSizeHeight; j++) {
      if(grid[i][j] == 1) {
        fill(0);
        rect(i * cellSize, j * cellSize, cellSize, cellSize);
      }

    }
  }

}
function draw() {
  background(255);
  textSize(100);
  textAlign(CENTER);
  fill(255, 50, 80, 50);
  text("Conway's Game of Life", width / 2, height / 2);
  if(started) {
    updateCells();
  }
  drawCells();

  if(!started && !hiddenButton) {
    var alpha = 255;

    var rectWidth = 800;
    var rectHeight = 300;
    var rectX = width / 2 - rectWidth / 2;
    var rectY = height / 2 - rectHeight / 2;

    if(mouseX > rectX && mouseY > rectY && mouseX < rectX + rectWidth && mouseY < rectY + rectHeight) {
        alpha = 50;
    }
    noStroke();
    fill(40, 40, 40, alpha);
    rect(rectX, rectY, rectWidth, rectHeight);
    textFont("Sans-serif");
    textSize(100);
    textAlign(CENTER);
    fill(255, 50, 80, alpha);
    text("PRESS SPACE", width / 2, height / 2);
    textSize(50);
    text("or click to add live cells!", width / 2, height / 2 + 100);
  }
}

function mouseClicked() {
  addCells();
}

function mouseDragged() {
  addCells();
}

function addCells() {
  if(!hitButton) {
        for(var i = 0; i < gridSizeWidth; i++) {
          for(var j = 0; j < gridSizeHeight; j++) {
            switch(grid[i][j]) {
                case 1:
                  fill(0);
                  break;
                case 0:
                  fill(255);
                  break;
                default:
                  break;
            }

            var cellPos = [ i * cellSize, j * cellSize, cellSize];

            if(mouseX > cellPos[0] && mouseX < cellPos[0] + cellPos[2] && mouseY > cellPos[1] && mouseY < cellPos[1] + cellPos[2]) {
              if(shouldDraw) {
                grid[i][j] = 1;
              } else {
                grid[i][j] = 0;
              }
              return;
            }
          }
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    started = !started;
  }
}

//  For a space that is 'populated':
//      Each cell with one or no neighbors dies, as if by solitude.
//      Each cell with four or more neighbors dies, as if by overpopulation.
//      Each cell with two or three neighbors survives.
//  For a space that is 'empty' or 'unpopulated'
//      Each cell with three neighbors becomes populated.

function updateCells() {
  var gridCopy = [];
  gridCopy = create2DArray(gridCopy);
  canDraw = false;
  for(var i = 0; i < gridSizeWidth; i++) {
    for(var j = 0; j < gridSizeHeight; j++) {
      var neighbours = checkNeighbours(grid, i, j);
      var gridValue = grid[i][j];
      if(gridValue == 1 && (neighbours < 2 || neighbours > 3)) {
        gridCopy[i][j] = 0;
      } else if (gridValue == 0 && neighbours == 3){
        gridCopy[i][j] = 1;
      } else {
        gridCopy[i][j] = grid[i][j];
      }
    }
  }
  canDraw = true;
  grid = gridCopy;
}

function checkNeighbours(grid, i, j) {
  var neighbours = 0;

  for(var nI = -1; nI < 2; nI++) {
    for(var nJ = -1; nJ < 2; nJ++) {

      var iCheck = i + nI;
      var jCheck = j + nJ;

      if(nI == 0 && nJ == 0) {
        continue;
      }

      if(iCheck < 0) {
        iCheck = gridSizeWidth - 1;
      } else if (iCheck > gridSizeWidth - 1) {
        //iCheck = (iCheck % gridSizeWidth);
        iCheck = 0;
      }

      if(jCheck < 0) {
        jCheck = gridSizeHeight - 1;
      } else if (jCheck > gridSizeHeight - 1) {
        //jCheck = (jCheck % gridSizeHeight);
        jCheck = 0;
      }

      iCheck = Math.floor(iCheck);
      jCheck = Math.floor(jCheck);

      if(grid[iCheck][jCheck] == 1) {
        neighbours++;
      }
    }
  }
  return neighbours;
}

function create2DArray(array) {
  for(var i = 0; i < gridSizeWidth; i++) {
    array[i] = Array(gridSizeHeight);
  }

  for(var i = 0; i < gridSizeWidth; i++) {
    for(var j = 0; j < gridSizeHeight; j++) {
      array[i][j] = floor(random(2));
    }
  }

  return array;
}
