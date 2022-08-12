class Game 
{
    canvas = document.createElement('canvas');
    width = 1280;
    height = 720;
    movementKeys = ["w", "a", "s", "d", "r"];
    borderCollision = '';
    start()
    {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.backgroundColor = 'white';
        this.context = this.canvas.getContext('2d');
        document.getElementById('mainDiv').appendChild(this.canvas);
        this.interval = setInterval(updateGameArea, 20);
        document.addEventListener('keydown', (key) => {
            this.keys = (this.keys || []);
            this.keys[key.key] = true;
        });
        document.addEventListener('keyup', (key) => {
            this.keys[key.key] = false;
        });
    }
    centerX(width)
    {
        return game.width / 2 - width / 2;
    }
    centerY(height)
    {
        return game.height / 2 - height / 2;
    }
    clear() 
    {
        this.context.clearRect(0, 0, this.width, this.height);
    }
    stop()
    {
        clearInterval(this.interval);
    }
}

class Entity
{
    speedX = 0;
    speedY = 0;
    constructor(width, height, x, y, color, fill = true)
    {
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.color = color;
        this.fill = fill
    }
    update() 
    {
        this.newPos();
        this.ctx = game.context;
        if(this.fill){
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(this.x, this.y, this.width, this.height);
        } else {
            this.ctx.strokeRect(this.x, this.y, this.width, this.height);
        }
    }
    newPos()
    {
        this.x += this.speedX;
        this.y += this.speedY;
        document.getElementById("curX").innerText = this.x;
        document.getElementById('curY').innerText = this.y;
        var playerPos = {
            'type': 'player_pos',
            'x': this.x,
            'y': this.y,
        }
        socket.send(JSON.stringify(playerPos));
    }
}

class MovementHandler
{
    constructor(entity, speed)
    {
        entity.speedX = 0;
        entity.speedY = 0;

        if(game.keys)
        {
            if(game.keys[game.movementKeys[0]]) //w
            {
                if(game.borderCollision != ("top" || "right_top" || "left_top")){
                    entity.speedY -= speed;
                }
            }
            if(game.keys[game.movementKeys[1]]) //a
            {
                if(game.borderCollision != ("left" || "left_top" || "left_bottom")){
                    entity.speedX -= speed;
                }
            }
            if(game.keys[game.movementKeys[2]]) //s
            {
                if(game.borderCollision != ("bottom" || "right_bottom" || "left_bottom")){
                    entity.speedY += speed;
                }
            }
            if(game.keys[game.movementKeys[3]]) //d
            {
                if(game.borderCollision != ("right" || "right_top" || "right_bottom")){
                    entity.speedX += speed;
                }
            }
            if(game.keys[game.movementKeys[4]]) //r
            {
                entity.x = game.centerX(entity.width);
                entity.y = game.centerY(entity.height);
            }
        }
    }
}

class Collision
{
    screenCollision(entity, worldBounds)
    {
        var entityCollisions = [entity.x, entity.x + (entity.width), entity.y, entity.y + (entity.height)];
        var worldCollisions = [worldBounds.x, worldBounds.x + (worldBounds.width), worldBounds.y, worldBounds.y + (worldBounds.height)];
        var collisions = new Map();
        collisions.set('left', (entityCollisions[0] < worldCollisions[0]));
        collisions.set('right', (entityCollisions[1] > worldCollisions[1]));

        collisions.set('top', (entityCollisions[2] < worldCollisions[2]));
        collisions.set('bottom', (entityCollisions[3] > worldCollisions[3]));

        collisions.set('corner_top_right', (collisions.get('top') && collisions.get('right')));
        collisions.set('corner_top_left', (collisions.get('top') && collisions.get('left')));

        collisions.set('corner_bottom_right', (collisions.get('bottom') && collisions.get('right')));
        collisions.set('corner_bottom_left', (collisions.get('bottom') && collisions.get('left')));


        //top collision
        if(collisions.get('top') && !collisions.get('left') && !collisions.get('right') && !collisions.get('bottom'))
        {
            game.borderCollision = "top";
        }
        //top left
        else if(collisions.get('corner_top_left'))
        {
            game.borderCollision = "left_top";
        }
        //top right
        else if(collisions.get('corner_top_right'))
        {
            game.borderCollision = "right_top";
        }

        //bottom collision
        if(!collisions.get('top') && !collisions.get('left') && !collisions.get('right') && collisions.get('bottom'))
        {
            game.borderCollision = "bottom";
        }
        //bottom left
        else if(collisions.get('corner_bottom_left'))
        {
            game.borderCollision = "left_bottom";
        }
        //bottom right
        else if(collisions.get('corner_bottom_right'))
        {
            game.borderCollision = "right_bottom";
        }

        //right collision
        if(!collisions.get('top') && !collisions.get('left') && collisions.get('right') && !collisions.get('bottom'))
        {
            game.borderCollision = "right";
        }

        //left collision
        if(!collisions.get('top') && collisions.get('left') && !collisions.get('right') && !collisions.get('bottom'))
        {
            game.borderCollision = "left";
        }

        //no collisions detected
        if(!collisions.get('top') && !collisions.get('left') && !collisions.get('right') && !collisions.get('bottom') && 
        !collisions.get('corner_bottom_right') && !collisions.get('corner_bottom_left') && !collisions.get('corner_top_right') && !collisions.get('corner_top_left'))
        {
            game.borderCollision = "";
        }

        document.getElementById('curCol').innerText = (game.borderCollision != '' ? game.borderCollision : 'none');
    }
}

function updateGameArea()
{
    game.clear();
    new MovementHandler(danigg, 5);
    new Collision().screenCollision(danigg, worldBounds);
    danigg.update();
}

var notif = new CustomNotification();
var game = new Game();
var worldBounds = new Entity(game.width, game.height, game.centerX(game.width), game.centerY(game.height), 'white', false);
var danigg = new Entity(50, 50, game.centerX(50), game.centerY(50), 'black', true);
var socket = new WebSocket('ws:///sancopublic.ddns.net:19002/');
function startGame() 
{
    notif.mainText = 'Game started';
    game.start();
    notif.notify();
}