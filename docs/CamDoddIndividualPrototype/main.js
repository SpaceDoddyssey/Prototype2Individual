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

/** @type {{pos: Vector, width: number, height: number, type: string}[]} */
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
      pos: vec(30, VIEW_Y - platformHeight), // Adjusted the starting position of the player
      height: 10, // Initial height
      direction: 1, // 1 for growing, -1 for shrinking
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
  player.pos.y = VIEW_Y - 10 - player.height;
  color("red");
  rect(player.pos.x, player.pos.y, playerWidth, player.height);

  // Update and draw walls
  spawnedWalls.forEach((wall) => {
    wall.pos.x -= 2;
    wall.pos.y = VIEW_Y - platformHeight - wall.height; 
    color("black");
    line(wall.pos.x, wall.pos.y, wall.pos.x, VIEW_Y - platformHeight - 1);
  });

  // Draw the platform
  color("blue");
  rect(0, VIEW_Y - 10, VIEW_X, 10);

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
  spawnedWalls.push({
    pos: vec(VIEW_X, 180),
    width: 5,
    height: 10,
    type: "ground"
  });
}

function endGame() {
  play("explosion");
  end();
}
