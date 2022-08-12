class Game
{
    Canvas = document.createElement('canvas');
    Context = this.Canvas.getContext('2d');

    constructor(Width = 1280, Height = 720)
    {
        this.Width = Width;
        this.Height = Height;
    }

    start()
    {
        this.Canvas.width = this.Width;
        this.Canvas.height = this.Height;
        this.Canvas.style.backgroundColor = 'white';

        this.Canvas.style.cursor = "none";

        document.getElementById('mainDiv').appendChild(this.Canvas);

        this.Canvas.addEventListener('mouseenter', (e) => {
            e.preventDefault();
        });

        this.Canvas.addEventListener('mouseleave', (e) => {
            e.preventDefault();
        });

        this.Canvas.addEventListener('mousemove', (mouse) => {
            this.mX = mouse.offsetX;
            this.mY = mouse.offsetY;
        });

        this.Canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();

            this.mouseDown = true;
        });

        this.Canvas.addEventListener('mouseup', (e) => {
            e.preventDefault();

            this.mouseDown = false;
        });

        this.interval = setInterval(update, 20);
    }

    clear() 
    {
        this.Context.clearRect(0, 0, this.Width, this.Height);
    }
}

class Entity
{
    SpeedX = 0;
    SpeedY = 0;
    Context = game.Context;
    canvasWidth = game.Width;
    canvasHeight = game.Height;

    Left = 0;
    Right = 0;
    Top = 0;
    Bottom = 0;
    Center = 0;

    constructor(X, Y, Width, Height, Color)
    {
        this.Width = Width;
        this.Height = Height;
        this.X = X;
        this.Y = Y;
        this.Color = Color;
    }

    draw()
    {
        //update the directions
        this.Left = this.X;
        this.Right = this.X + (this.Width);
        this.Top = this.Y;
        this.Bottom = this.Y + (this.Height);

        this.Center = (this.Left + this.Right) + (this.Top + this.Bottom);

        this.Context.fillStyle = this.Color;
        this.Context.fillRect(this.X, this.Y, this.Width, this.Height);
    }

    centerScreen(CenterOnAxis = "XY")
    {
        switch(CenterOnAxis)
        {
            //xy
            default:
                this.X = this.canvasWidth / 2 - this.Width / 2;
                this.Y = this.canvasHeight / 2 - this.Height / 2;
                break;
            case "X":
                this.X = this.canvasWidth / 2 - this.Width / 2;
                break;
            case "Y":
                this.Y = this.canvasHeight / 2 - this.Height / 2;
                break;
        }
    }
}

function update()
{
    game.clear();

    cursor.X = game.mX;
    cursor.Y = game.mY;

    if(game.mouseDown)
    {
        cursor.Color = "red";
    }
    else
    {
        cursor.Color = "blue";
    }

    /*
    if(cursor.Center == daNigg.Center)
    {
        console.log("touching!");
    }*/

    //console.log("CCenter should be: " + (cursor.Left - cursor.Right), cursor.Left, cursor.Right);

    daNigg.draw();
    cursor.draw();
}

var game = new Game();
var daNigg = new Entity(0, 0, 50, 50, "black");

var cursor = new Entity(0, 0, 10, 10, "blue");

function startGame()
{
    new NotificationInstance('Game started');
    game.start();
    daNigg.centerScreen();

    cursor.centerScreen();
}