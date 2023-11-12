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

/** @type {{pos: Vector, height: number, type: string}[]} */
let spawnedWalls;

let nextWallDist = 0;

function update() {
  //Initializer function
  if (!ticks) {
  
  }

  if(input.isJustPressed){
    changeGrowthDirection();
  }
}

//-----------------------------------
//----------FUNCTIONS----------------
//-----------------------------------

function changeGrowthDirection(){

}

function endGame() {
  play("explosion");
  end();
}
