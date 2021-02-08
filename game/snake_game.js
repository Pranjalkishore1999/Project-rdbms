var speed=100;
//function for selecting the speed drop down menu as Level
window.test=function(e)
{
 speed=e.value;
console.log(speed);
}
//console.log(speed);

const cvs = document.getElementById("snake");
const ctx = cvs.getContext("2d");

//create the unit as 32 pixels
const box = 32;

// load audio files

let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();

dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";

//load images
const ground = new Image();
ground.src = "images/snake_grid.png";

const foodImg = new Image();
foodImg.src = "images/snake_food.png";



// to prevent the scrolling during up and down keys were pressed and it prevents the default action

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

//create the snake

let snake = [];

snake[0] = {
    x : 12 * box,
    y : 16 * box
};

//create the food

let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

//create the score var

let score = 0;

// control the snake
let dir;

document.addEventListener("keydown",manage_direction);

function manage_direction(event){
    let key = event.keyCode;
    if( key == 37 && dir != "RIGHT"){
        left.play();
        dir = "LEFT";
    }else if(key == 38 && dir != "DOWN"){
        dir = "UP";
        up.play();
    }else if(key == 39 && dir!= "LEFT"){
        dir = "RIGHT";
        right.play();
    }else if(key == 40 && dir != "UP"){
        dir = "DOWN";
        down.play();
    }
}

// cheack collision function
function collide(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}

// draw ground , snake and food to the canvas

function draw(){
    ctx.drawImage(ground,0,0);

    for(let i = 0; i < snake.length ; i++){
        ctx.fillStyle = (i == 0)? "green" : "red";
        ctx.fillRect(snake[i].x,snake[i].y,box,box);

        ctx.strokeStyle = "yellow";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(foodImg, food.x, food.y);

        //old head position
        let snakeXdir = snake[0].x;
        let snakeYdir = snake[0].y;

        //which direction to find and update position of snake
        if( dir == "LEFT") snakeXdir -= box;
        if( dir == "UP") snakeYdir-= box;
        if( dir == "RIGHT") snakeXdir += box;
        if( dir == "DOWN") snakeYdir += box;
        // Increment the snake size if it eats the food on (food.x ,food.y)
        if(snakeXdir == food.x && snakeYdir == food.y){
            score++;
            eat.play();
            food = {
                x : Math.floor(Math.random()*17+1) * box,
                y : Math.floor(Math.random()*17+2) * box
               
            }
            //console.log(food.x);
           // console.log(food.y);
           
        }
        else{
            //remove the tail
          snake.pop();
        }

        //construct New Head
        let newHead = {
            x : snakeXdir,
            y : snakeYdir
        }

        // game over condition
    
        if(snakeXdir < box || snakeXdir > 18 * box || snakeYdir < 2*box || snakeYdir> 18*box || collide(newHead,snake)){
            clearInterval(game);
            dead.play();
        }
        
        //Insert New Head
        snake.unshift(newHead);
        
       // ctx.fillStyle = "white";
       ctx.font = "50px changa one";
       ctx.fillText(score,2*box,1.6*box);
}

let game = setInterval(draw,speed);