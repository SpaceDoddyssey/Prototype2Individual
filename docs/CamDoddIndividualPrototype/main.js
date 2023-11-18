title = "Size Changer";

description = `
[Tap to Grow or Shrink]
`;

characters = [];
const VIEW_X = 200;
const VIEW_Y = 200;

options = {
  viewSize: { x: VIEW_X, y: VIEW_Y },
  isPlayingBgm: true,
  isReplayEnabled: true,
  seed: 50,
};

/** @type {{pos: Vector, width: number, direction: number}[]} */
let spawnedWalls;

let nextWallDist = 0;
let platformHeight = 10;

// Player properties
/** @type {{ pos: Vector, height: number, direction: number }} */
let player; //Direction is 1 for growing, -1 for shrinking
let playerWidth = 5;

function update() {
  // Initializer function
  if (!ticks) {
    player = {
      pos: vec(30, VIEW_Y - platformHeight), 
      height: 10,
      direction: 1,
    };

    spawnedWalls = [];
  }

  // Handle input
  if (input.isJustPressed) {
    changeGrowthDirection();
  }

  // Update player height
  player.height += player.direction;
  if (player.height <= 0) {
    endGame();
  }

  // Spawn walls
  nextWallDist--;
  if (nextWallDist < 0) {
    spawnWall();
    nextWallDist = rnd(30, 60);
  }

  // Update and draw player
  player.pos.y = VIEW_Y - platformHeight - player.height;
  color("red");
  rect(player.pos.x, player.pos.y, playerWidth, player.height);

  // Update and draw walls
  color("green");
  spawnedWalls.forEach((wall) => {
    wall.pos.x -= 2;
    let wallEndY = wall.direction == 1 ? VIEW_Y - platformHeight : 0;
    line(wall.pos.x, wall.pos.y, wall.pos.x, wallEndY);
  });

  // Draw the platform
  color("blue");
  rect(0, VIEW_Y - platformHeight, VIEW_X, platformHeight);

  // Remove off-screen walls
  spawnedWalls.forEach((wall) => {
    if(wall.pos.x < -wall.width){
      destroyWall(wall);
    }
  });

  checkCollisions();
}

//-----------------------------------
//----------FUNCTIONS----------------
//-----------------------------------

function checkCollisions() {
  spawnedWalls.forEach((wall) => {
    // Check if the bounding boxes overlap
    if (hittingWall(wall)){
      if (wall.direction === 1 && player.height > (VIEW_Y - platformHeight - wall.pos.y)) {
        // If the wall is sticking up and the player is higher, destroy the wall
        destroyWall(wall);
      } else {
        // Otherwise, end the game
        endGame();
      }
    }
  });
}

function hittingWall(wall){
  const wallBoundingBox = {
    left: wall.pos.x,
    right: wall.pos.x + wall.width,
  };

  const inRange =
    player.pos.x < wallBoundingBox.right &&
    player.pos.x + playerWidth > wallBoundingBox.left;
  if(!inRange){ return false; }

  return (wall.direction == 1 || wall.pos.y > player.pos.y);
}

function destroyWall(wall) {
  play("hit");

  for (let i = 0; i < 30; i++) {
    let particleY = 
    wall.direction == 1
      ? rnd(VIEW_Y - platformHeight - wall.pos.y)
      : -rnd(0, wall.pos.y);
    particle(
      wall.pos.x + rnd(wall.width), 
      wall.pos.y + particleY,
      1, // count
      1, // speed
      rnd(360), // angle
      360 // angleWidth
    );
  }
  spawnedWalls = spawnedWalls.filter((w) => w !== wall);

  addScore(1, player.pos);
}

function changeGrowthDirection() {
  player.direction *= -1; // Toggle between growing and shrinking
}

function spawnWall() {
  const pos = vec(VIEW_X, rnd(100, 150));
  spawnedWalls.push({
    pos: pos,
    width: 5,
    direction: rnd() > 0.5 ? 1 : -1, // 50% chance of sticking up or down
  });
  console.log(pos)
}

function endGame() {
  play("explosion");
  end();
}
