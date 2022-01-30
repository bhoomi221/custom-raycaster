//all varibales need throughout the code 
/* const map = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,0,1,1,0,0,0,0,1,0,1,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,5,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,1,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];  */

const map= JSON.parse(localStorage.getItem("map"))
//console.log(map);

const SCREEN_WIDTH = window.innerWidth;
const SCREEN_HEIGHT = window.innerHeight;

//forver loop for the game refreshes every 30 ms 
const TICK = 30; 

const CELL_SIZE = 24

const player = {
    x: CELL_SIZE * 1.5,
    y: CELL_SIZE * 2,
    angle: 0,
    speed: 0
}

const PLAYER_SIZE = 6;

const COLORS = {
    floor: "#bd00ff", // "#ff6361"
    ceiling: "#00ff9f", // "#012975",
    wall: "#00b8ff", // "#58508d"
    wallDark: "#001eff", // "#003f5c"
    rays: "#ffa600",
  };

  const FOV = toRadians(90); 

//creating the game canvas on load 
const canvas = document.createElement("canvas");
canvas.setAttribute('width', SCREEN_WIDTH); 
canvas.setAttribute('height', SCREEN_HEIGHT);
document.body.appendChild(canvas);



//all the function we will need to put in the game loop 

const context = canvas.getContext("2d")
function clearScreen() {
    context.fillStyle = "white";
    context.fillRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

};

function movePlayer(){
    const s = player.x + Math.cos(player.angle) * player.speed; 
    const t = player.y + Math.sin(player.angle) * player.speed; 
    const mx = Math.floor(s / CELL_SIZE)
    const my = Math.floor(t / CELL_SIZE)

    if(map[my][mx] == 0 ){
        player.x =s 
        player.y = t 
    }

};

function outOfBounds(x, y){
    return x < 0 || x >= map[0].length || y < 0 || y >= map.length;
}

function distance(x1, y1, x2, y2){
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))

}

function getVCollision(angle) {
    //facing right or left 
    const right = Math.abs(Math.floor((angle - Math.PI / 2) / Math.PI) % 2);
    //calculate cell you are in then, left or right find the cell infront of you
    const firstX = right 
        ? Math.floor(player.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE 
        : Math.floor(player.x / CELL_SIZE) * CELL_SIZE;
    //the y value based on knowing the player position, x distance, and the ray angle 
    
    const firstY = player.y + (firstX - player.x) * Math.tan(angle); 

    //if right step one cell to the right each time, else left 
    const xA = right ? CELL_SIZE : -CELL_SIZE;
    const yA = xA * Math.tan(angle);
     
    let wall; 
    let nextX= firstX;
    let nextY = firstY;

    while(!wall) {
        //converting between map and scene cells 
        const cellX = right 
            ? Math.floor(nextX / CELL_SIZE) 
            : Math.floor(nextX /CELL_SIZE) - 1;
        const cellY = Math.floor(nextY / CELL_SIZE);

        if(outOfBounds(cellX, cellY)){
            break
        }
        wall = map[cellY][cellX];
        //step forward if no wall found 
        if (!wall){
            nextX += xA;
            nextY += yA;
        }
    }
    return {angle , distance: distance(player.x, player.y, nextX, nextY), vertical: true};
} 

function getHCollision(angle) {
    //facing up or down 
    const up = Math.abs(Math.floor(angle / Math.PI) % 2);
    //calculate cell you are in then, up or down find the cell infront of you
    const firstY = up 
        ? Math.floor(player.y / CELL_SIZE) * CELL_SIZE
        : Math.floor(player.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE;
    //the x value based on knowing the player position, y distance, and the ray angle 
    const firstX = player.x + (firstY - player.y) / Math.tan(angle); 

    //if up step one cell up each time, else down, negative for up because smaller numbers are higher up in arrays  
    const yA = up ? -CELL_SIZE : CELL_SIZE;
    const xA = yA / Math.tan(angle);
     
    let wall;
    let nextX = firstX;
    let nextY = firstY;

    while(!wall) {
        //converting between map and scene cells 
        const cellX = Math.floor(nextX / CELL_SIZE);
        const cellY = up 
            ? Math.floor(nextY / CELL_SIZE) - 1 
            : Math.floor(nextY / CELL_SIZE);

        if(outOfBounds(cellX, cellY)){
            break;
        }
        wall = map[cellY][cellX];
        //step forward if no wall found 
        if (!wall) {
            nextX += xA;
            nextY += yA;
        }
    }
    return {angle, distance: distance(player.x, player.y, nextX, nextY), vertical: false};
}

function castRay(angle){
    const vCollision = getVCollision(angle);
    const hColiision = getHCollision(angle);

    return hColiision.distance >= vCollision.distance ? vCollision : hColiision

}


function getRays(){
    const initial_angle = player.angle -(FOV/2);
    const numberOfRays= SCREEN_WIDTH;
    const angleStep = FOV / numberOfRays;
    return Array.from({length : numberOfRays}, (_, i) => {
        const angle = initial_angle + i * angleStep;
        const ray = castRay(angle);
        return ray 
    })
};

function fixFishEye(distance, angle, playerAngle){
    const diff = angle - playerAngle
    return distance * Math.cos(diff)
}

function renderScene(rays){
    rays.forEach((ray, i)=> {
        const distance = fixFishEye(ray.distance, ray.angle, player.angle);
        const wallHeight = ((CELL_SIZE * 5) / distance) * 277; 
        context.fillStyle = ray.vertical ? COLORS.wallDark : COLORS.wall;
        context.fillRect(i, SCREEN_HEIGHT / 2 - (wallHeight / 2), 1, wallHeight); 
        context.fillStyle = COLORS.floor
        context.fillRect(i, SCREEN_HEIGHT / 2 + wallHeight / 2, 1, SCREEN_HEIGHT / 2 + wallHeight / 2)
        context.fillStyle = COLORS.ceiling;
        context.fillRect(i, 0, 1, SCREEN_HEIGHT / 2 - wallHeight / 2);
    })
};

function renderMinimap(posX = 0, posY = 0, scale = 1, rays){
    const cellSize = CELL_SIZE * scale;
    map.forEach((row, y) => {
        row.forEach((cell, x) => {
            if(cell){
                context.fillStyle = "grey";
                context.fillRect(posX + x * cellSize, posY + y * cellSize, cellSize, cellSize);
            }
        })
    })

    context.strokeStyle = COLORS.rays;
    rays.forEach(ray => {
        context.beginPath()
        context.moveTo(player.x *scale +posX, player.y * scale + posY);
        context.lineTo((player.x + Math.cos(ray.angle) * ray.distance) * scale, (player.y + Math.sin(ray.angle) * ray.distance) * scale )
        context.closePath()
        context.stroke()

    })


    context.fillStyle = "blue"
    context.fillRect(posX + player.x * scale - PLAYER_SIZE/2, posY + player.y * scale - PLAYER_SIZE/2, PLAYER_SIZE, PLAYER_SIZE);

    const rayLength = PLAYER_SIZE * 2; 
    context.strokeStyle = "blue"
    context.beginPath();
    context.moveTo(player.x *scale +posX, player.y * scale + posY);
    context.lineTo((player.x + Math.cos(player.angle) * rayLength) * scale, (player.y + Math.sin(player.angle) * rayLength) * scale )
    context.closePath()
    context.stroke()
};




function gameloop(){
    clearScreen()
    movePlayer()
    const rays = getRays()
    //const rays = []
    renderScene(rays)
    renderMinimap(0, 0, 0.75, rays)
}

setInterval(gameloop, TICK);

function toRadians(deg){
    return (deg * Math.PI) / 180
}

document.addEventListener("keydown", (e) => {
    if(e.key === "w"){
        player.speed = 2;
    }
    if(e.key === "s"){
        player.speed = -2;
    }
})

document.addEventListener("keyup", (e) => {
    if(e.key === "w" || e.key === "s" ){
        player.speed = 0;
    }
})

document.addEventListener("mousemove", (e) => {
    //player.angle = Math.atan2(e.clientY - player.y, e.clientX- player.x)
    player.angle += toRadians(e.movementX)
    
})