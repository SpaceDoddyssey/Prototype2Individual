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

/** @type {{pos: Vector, width: number, height: number, type: string, direction: number}[]} */
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
    let wallEndY = 0;
    if (wall.direction === 1) {
      // Sticking up from the platform
      wall.pos.y = VIEW_Y - platformHeight - wall.height;
      wallEndY = VIEW_Y - platformHeight - 1;
    } else {
      // Sticking down from the top of the screen
      wall.pos.y = 0;
      wallEndY = VIEW_Y - platformHeight - wall.height;
    }
    line(wall.pos.x, wall.pos.y, wall.pos.x, wallEndY);
  });

  // Draw the platform
  color("blue");
  rect(0, VIEW_Y - platformHeight, VIEW_X, platformHeight);

  // Remove off-screen walls
  spawnedWalls = spawnedWalls.filter((wall) => wall.pos.x + wall.width > 0);
}

//-----------------------------------
//----------FUNCTIONS----------------
//-----------------------------------

function changeGrowthDirection() {
  player.direction *= -1; // Toggle between growing and shrinking
}

function spawnWall() {
  const isStickingUp = rnd() > 0.5;  // 50% chance of sticking up or down
  const height = rnd(25, 150); 
  spawnedWalls.push({
    pos: vec(VIEW_X, isStickingUp ? VIEW_Y - platformHeight : 0),
    width: 5,
    height: height,
    direction: isStickingUp ? 1 : -1,
    type: "ground",
  });
}

function endGame() {
  play("explosion");
  end();
}
