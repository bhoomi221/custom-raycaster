const SCREEN_W = window.innerWidth;
const SCREEN_H = window.innerHeight;
const GRID_X = 350
const GRID_Y = 150

let MAP_SIZE = 0; 
//let CELL_SIZE = 75; 
var newMap;


const canva = document.createElement("canvas");
canva.setAttribute('width', SCREEN_W); 
canva.setAttribute('height', SCREEN_H);
document.body.appendChild(canva);


const con = canva.getContext("2d");
function clearScreen() {
    con.fillStyle = "white";
    con.fillRect(0, 0, SCREEN_W, SCREEN_H)

};

const slider = document.getElementById("grid")
slider.addEventListener('input', () => {
    //console.log(slider.value)
        clearScreen()
        clearTable(MAP_SIZE)
        MAP_SIZE = slider.value;
        render_map(MAP_SIZE); 

})


function clearTable(size) {
    var table = document.getElementById("t1");

    for(var i = table.rows.length - 1; i >= 0; i--) {
        table.deleteRow(i);
    }

}

function render_map(size) {
    const table = document.getElementById('t1')
    for (var i = 0; i < size; i++) {
        const row = document.createElement('tr')
        table.appendChild(row)
        for(var j = 0; j < size; j++) {
            const col = document.createElement('td')
            col.setAttribute('onClick', "colorChanger(this)");
            row.appendChild(col)
        }
    }      

}

function colorChanger(cell) {
    if(cell.style.backgroundColor == "") {
        cell.style.backgroundColor = "#000FF0"
    } else {
        cell.style.backgroundColor = ""
    }
}

const button = document.getElementById('start')
button.addEventListener('click', () => {
    newMap = createMap()
    localStorage.setItem("map", JSON.stringify(newMap));  
    document.location.href = 'index.html'
})

function createMap() {
    //const tb = document.getElementById('t1');
    let map = []; 
    for (var i = 0; i < MAP_SIZE; i++) {
        for(var j = 0; j < MAP_SIZE; j++) {
            map[i] = [];
            map[i][j] = 0;
        }
    }
    var table = document.getElementById("t1");
    for (var i = 0, row; row = table.rows[i]; i++) {
        //iterate through rows
        //rows would be accessed using the "row" variable assigned in the for loop
        for (var j = 0, col; col = row.cells[j]; j++) {
          //iterate through columns
          //columns would be accessed using the "col" variable assigned in the for loop
            if(col.style.backgroundColor == ""){
                map[i][j] = 0
            } else {
                map[i][j] = 1
            }
        }  
    }
    //creating the border 
    for (var i = 0; i < MAP_SIZE; i++) {
        for(var j = 0; j < MAP_SIZE; j++) {
            if(i == 0 || i == MAP_SIZE-1 || j == 0 || j == MAP_SIZE-1){
                map[i][j] = 1
            }
        }
    }

    return map
}
