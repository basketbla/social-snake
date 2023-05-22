// Jesus okay how do I even make a square
// Do a grid of squares and then use javascript to update colors?

// let squareColored = {};
const conversation = [
  "That is true",
  "yes",
  "I am the social snake",
  "Happy news!",
  "What a day for social snake"
]

let conversationIndex = 0;

var grid = document.getElementById("grid-1");
var grid2 = document.getElementById("grid-2");
const STARTING_POS = 44;
let foodPos;
let snakeLen = 1;
let snakeDir = "down";
let snakeBodyPos = [STARTING_POS, STARTING_POS - 10];
let needGrow = false;
let movedAlready = false;

// Map keeping track of open spots
let spotsFree = {};
for (let i = 0; i < 100; i++) {
  spotsFree[i] = true;
}
spotsFree[STARTING_POS] = false;
spotsFree[STARTING_POS - 10] = false;


const updateWorld = async () => {

  // Change direction with arrows
  document.addEventListener("keydown", e => {

    // Don't want more than 1 move per frame
    if (movedAlready) {
      return;
    }
    movedAlready = true;
    if (e.key === "d") {
      snakeDir = "right";
    }
    if (e.key === "s") {
      snakeDir = "down";
    }
    if (e.key === "w") {
      snakeDir = "up";
    }
    if (e.key === "a") {
      snakeDir = "left";
    }
  })



  while (true) {
    await new Promise(r => setTimeout(r, 500));

    movedAlready = false;

    // Check if snake ate the food
    if (snakeBodyPos[0] === foodPos) {
      snakeLen += 1;
      needGrow = true;
      growPos = snakeBodyPos[snakeBodyPos.length - 1];
    }

    let oldHeadPos = snakeBodyPos[0];

    // Update head pos (check for collisions later)
    if (snakeDir == "up") {
      if (snakeBodyPos[0] < 10) {
        snakeBodyPos[0] += 90
      }
      else {
        snakeBodyPos[0] -= 10;
      }
    }
    if (snakeDir == "down") {
      snakeBodyPos[0] = (snakeBodyPos[0] + 10) % 100;
    }
    if (snakeDir == "left") {
      if (snakeBodyPos[0] % 10 === 0) {
        snakeBodyPos[0] += 9;
      }
      else {
        snakeBodyPos[0] -= 1;
      }
    }
    if (snakeDir == "right") {

      if (snakeBodyPos[0] === 266) {
        handleSocialSnake();
        return;
      }
      if (snakeBodyPos[0] % 10 === 9) {
        // Escape at this square
        if (snakeBodyPos[0] === 89) {
          snakeBodyPos[0] = 260;
        }
        else {
          snakeBodyPos[0] -= 9;
        }
      }
      else {
        snakeBodyPos[0] += 1;
      }
    }

    // Check for collisions
    if (Object.keys(spotsFree).map(num => Number(num)).filter(i => !spotsFree[i]).includes(snakeBodyPos[0])) {
      handleEndGame();
      return;
    }

    // Uncolor old tail, color new head
    unColorSquare(snakeBodyPos[snakeBodyPos.length - 1]);
    spotsFree[snakeBodyPos[snakeBodyPos.length - 1]] = true;

    spotsFree[snakeBodyPos[0]] = false;
    colorSquare(snakeBodyPos[0]);

    // Update all other positions
    for (let i = snakeBodyPos.length - 1; i > 0; i--) {
      if (i === 1) {
        snakeBodyPos[i] = oldHeadPos;
      }
      else {
        snakeBodyPos[i] = snakeBodyPos[i - 1];
      }
    }

    // If we ate, add a new one (and make new food)
    if (needGrow) {
      snakeBodyPos.push(growPos);
      spotsFree[growPos] = false;
      colorSquare(growPos);
      needGrow = false;
      foodPos = pickFoodPos();
      colorSquare(foodPos);
    }
  }
}

const colorSquare = (i) => {
  let gridContainer;
  if (i >= 100) {
    gridContainer = grid2.querySelector("#grid-item-container-" + i);
  }
  else {
    gridContainer = grid.querySelector("#grid-item-container-" + i);
  }
  gridContainer.innerHTML = `<div class="grid-item-container"><div class="grid-item green"></div></div>`;
}

const unColorSquare = (i) => {
  let gridContainer;
  if (i >= 100) {
    gridContainer = grid2.querySelector("#grid-item-container-" + i);
  }
  else {
    gridContainer = grid.querySelector("#grid-item-container-" + i);
  }
  gridContainer.innerHTML = `<div class="grid-item-container"><div class="grid-item"></div></div>`;
}

// Update later to avoid entire snake
const pickFoodPos = () => {
  let freeSpots = Object.keys(spotsFree).map(num => Number(num)).filter(i => spotsFree[i]);
  let randIndex = Math.floor(Math.random() * (freeSpots.length));
  return freeSpots[randIndex];
}

// Display messages and such
const handleEndGame = () => {
  let score = snakeBodyPos.length;
  if (score === 100) {
    document.getElementById("win-text").style.display = "unset";
  }
  else {
    document.getElementById("death-text").style.display = "unset";
  }
  let scoreText = document.getElementById("score-text");
  scoreText.innerHTML = "Score: " + score;
  scoreText.style.display = "unset";
  document.getElementById("play-again").style.display = "unset";
  document.getElementById("announcement-panel").style.display = "flex";
}

const handleSocialSnake = () => {
  // Render the social snake
  drawSocialSnake();

  // Textboxes
  colorSquare(232);
  let gridContainer = grid2.querySelector("#grid-item-container-" + 232);
  gridContainer.innerHTML = "I am the social snake";

  let gridContainer2 = grid2.querySelector("#grid-item-container-" + 227);
  gridContainer2.innerHTML = "<input id=text-input></input><button id=submit-text-button>Submit</button>";

  document.getElementById("submit-text-button").addEventListener("click", () => {
    handleSubmitText();
  });

  // Clear out some space for the textboxes
  gridContainer = grid2.querySelector("#grid-item-container-" + 226);
  gridContainer.innerHTML = "";
  gridContainer = grid2.querySelector("#grid-item-container-" + 225);
  gridContainer.innerHTML = "";
  gridContainer = grid2.querySelector("#grid-item-container-" + 224);
  gridContainer.innerHTML = "";
}

const handleSubmitText = () => {

  console.log('test');

  let text = document.getElementById("text-input").value;

  console.log(text);
  // Query GPT and update social snake response

  let gridContainer = grid2.querySelector("#grid-item-container-" + 232);
  gridContainer.innerHTML = conversation[conversationIndex];

  conversationIndex = (conversationIndex + 1) % 5;

  let gridContainer2 = grid2.querySelector("#grid-item-container-" + 227 + " > input");
  gridContainer2.value = "";
}

const drawSocialSnake = () => {
  colorSquare(270);
  colorSquare(271);
  colorSquare(272);
  colorSquare(273);

  gridContainer = grid2.querySelector("#grid-item-container-" + 270);
  gridContainer.innerHTML = `<div class="grid-item-container"><div class="grid-item green">0__0</div></div>`;
}

const makeGrid = () => {
  // var grid = document.getElementById("grid-1");
  for (let i = 0; i < 100; i++) {
    grid.innerHTML += `<div class="grid-item-container" id="grid-item-container-${i}"><div class="grid-item"></div></div>`;
  }

  for (let i = 100; i < 300; i++) {
    grid2.innerHTML += `<div class="grid-item-container" id="grid-item-container-${i}"><div class="grid-item"></div></div>`;
  }

  // let gridContainers = grid.querySelectorAll(".grid-item-container");
  // for (let idx in gridContainers) {
  //   let container = gridContainers[idx];
  //   container.addEventListener("click", () => {
  //     if (squareColored[idx]) {
  //       unColorSquare(idx);
  //       squareColored[idx] = false;
  //     }
  //     else {
  //       colorSquare(idx);
  //       squareColored[idx] = true;
  //     }
  //   })
  // }

  // Start game
  let panel = document.getElementById("announcement-panel");
  panel.addEventListener("click", e => {
    document.getElementById("intro-text").style.display = "none";
    panel.style.display = "none";
    updateWorld();
  })

  foodPos = pickFoodPos();

  // add the snake and first food
  colorSquare(snakeBodyPos[0]);
  colorSquare(snakeBodyPos[1]);
  colorSquare(foodPos);

  // Start actually incrementing time
  // updateWorld();

}



// How to do the body???

// For moving: each thing in array goes to position of next thing in array

// For growing: duplicate last thing in array (move but don't erase)