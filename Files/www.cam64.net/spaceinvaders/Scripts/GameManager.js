var STATE = { MENU : 0,
              GAME : 1,
              GAMEOVER : 2};

var BMP = { BACKGROUND : 0,
            SPRITES : 1,
            SCANLINES : 2,
            GUN : 3,
            PARTICLES : 4,
            CONTROLS : 5};

var SPRITETYPE = { GUN : 0,
                   ALIEN1 : 1,
                   ALIEN2 : 2,
                   ALIEN3 : 3,
                   ALIEN4 : 4,
                   ALIEN5 : 5,
                   BULLET1 : 6,
                   BULLET2 : 7,
                   BLOCK : 8,
                   SPACESHIP : 9};

function GameManager()
{
    // Member variables
    var timer = null;
    var stateTimer = 0;
    var invaderDir = 8;
    var invaderIndex = 0;
    var invaderAtEdge = false;
    var invaderAdvancing = false;
    var invaderCreating = true;
    var invaderSpeedX = 0;
    var invaderSpeeyY = 0;
    var invaderBulletSpeed = 0;
    var invaderFireDelay = 0;
    var invaderFireSpeed = 0;
    var invaderLanded = false;
    var invaderLoopStart = false;
    var gun = null;
    var bulletDelay = 0;
    var bulletSpeed = 100;
    var hitCount = 0;
    var lives = 3;
    var stage = 0;
    var score = 0;
    var spaceshipTimer = 0;

    // ---------------------------------------------------------------------
    // CreateSprite - Creates a sprite of a specific type
    // ---------------------------------------------------------------------
    this.CreateSprite = function(spriteType, x, y, param1)
    {
        var index = null;

        switch(spriteType)
        {
            case SPRITETYPE.GUN:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, 6));
                g_SpriteList[index].minX = 40;
                g_SpriteList[index].maxX = 700;
                g_SpriteList[index].hotArea = new Rectangle(12, 21, 39, 15);
            } break;

            case SPRITETYPE.ALIEN1:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, new Array(0, 1), 30, ANIM_TYPE.REPEAT));
                g_SpriteList[index].hotArea = new Rectangle(18, 12, 24, 24);
            } break;

            case SPRITETYPE.ALIEN2:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, new Array(1, 0), 30, ANIM_TYPE.REPEAT));
                g_SpriteList[index].hotArea = new Rectangle(18, 12, 24, 24);
            } break;

            case SPRITETYPE.ALIEN3:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, new Array(2, 3), 30, ANIM_TYPE.REPEAT));
                g_SpriteList[index].hotArea = new Rectangle(14, 12, 33, 24);
            } break;

            case SPRITETYPE.ALIEN4:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, new Array(3, 2), 30, ANIM_TYPE.REPEAT));
                g_SpriteList[index].hotArea = new Rectangle(14, 12, 33, 24);
            } break;

            case SPRITETYPE.ALIEN5:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, new Array(4, 5), 30, ANIM_TYPE.REPEAT));
                g_SpriteList[index].hotArea = new Rectangle(12, 12, 36, 24);
            } break;

            case SPRITETYPE.BULLET1:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, 7));
                g_SpriteList[index].persistSpeed = true;
                g_SpriteList[index].speedY = -10;
                g_SpriteList[index].speedX = param1;
                g_SpriteList[index].minY = -15;
                g_SpriteList[index].limitAction = LIMIT_ACTION.KILL;
                g_SpriteList[index].hotArea = new Rectangle(29, 15, 3, 15);
            } break;

            case SPRITETYPE.BULLET2:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, 8));
                g_SpriteList[index].persistSpeed = true;
                g_SpriteList[index].speedY = invaderBulletSpeed;
                g_SpriteList[index].maxY = 500;
                g_SpriteList[index].limitAction = LIMIT_ACTION.KILL;
                g_SpriteList[index].hotArea = new Rectangle(29, 15, 3, 15);
            } break;

            case SPRITETYPE.BLOCK:
            {
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, 9));
                g_SpriteList[index].hotArea = new Rectangle(27, 21, 6, 6);
            } break;

            case SPRITETYPE.SPACESHIP:
            {
                //index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, 10));
                //g_SpriteList[index].hotArea = new Rectangle(8, 15, 45, 19);
                //g_SpriteList[index].persistSpeed = true;
                //g_SpriteList[index].speedX = 1;
                //g_SpriteList[index].minX = -60;
                //g_SpriteList[index].maxX = 800;
                //g_SpriteList[index].limitAction = LIMIT_ACTION.KILL;
                index = g_SpriteManager.AddSprite(x, y, new Animation(BMP.SPRITES, 10));
                g_SpriteList[index].hotArea = new Rectangle(12, 12, 36, 24);
            } break;
        }

        g_SpriteList[index].type = spriteType;

        return index;
    }



    // ---------------------------------------------------------------------
    // Initialise - Initial game environment
    // ---------------------------------------------------------------------
    this.Initialise = function()
    {
        // Register bitmaps
        g_BitmapManager = new BitmapManager();        
        g_BitmapManager.RegisterBitmap("Data/Images/Background.png", 800, 600);
        g_BitmapManager.RegisterBitmap("Data/Images/Sprites.png", 60, 48);
        g_BitmapManager.RegisterBitmap("Data/Images/ScanLines.png", 800, 600);
        g_BitmapManager.RegisterBitmap("Data/Images/Gun.png", 26, 16);
        g_BitmapManager.RegisterBitmap("Data/Images/Particles.png", 16, 16);
        g_BitmapManager.RegisterBitmap("Data/Images/Controls.png", 103, 103);
        g_BitmapManager.DownloadAll(function()
        {
            // Create sprite mananger
            g_SpriteManager = new SpriteManager();
            g_SpriteManager.Initialise(300);

            // Create particle manager
            g_ParticleManager = new ParticleManager();
            g_ParticleManager.Initialise();
                        
            // Start game loop
            g_GameManager.SetGameState(STATE.MENU);
        });
    }



    // ---------------------------------------------------------------------
    // SetGameState - Sets current state of the game
    // ---------------------------------------------------------------------
    this.SetGameState = function(newState)
    {
        stateTimer = 0;

        if(timer != null)
        {
            clearInterval(timer);
        }

        switch(newState)
        {
            case STATE.MENU:
            {                
                g_GameManager.Reset(true);
                timer = setInterval(g_GameManager.MainMenu, 20);
            } break;
            case STATE.GAME:
            {
                timer = setInterval(g_GameManager.MainLoop, 20);
            } break;
            case STATE.GAMEOVER:
            {
                timer = setInterval(g_GameManager.GameOver, 20);
            } break;
        }        
    }



    // ---------------------------------------------------------------------
    // Reset - Sets up initial game state
    // ---------------------------------------------------------------------
    this.Reset = function(newGame)
    {
        invaderSpeedX = 8 + stage;
        if(invaderSpeedX > 16) invaderSpeedX = 16;
        invaderSpeedY = 11 + stage;
        if(invaderSpeedY > 16) invaderSpeedY = 20;
        invaderDir = invaderSpeedX;
        invaderIndex = 0;
        invaderAtEdge = false;
        invaderAdvancing = false;
        invaderCreating = true;
        invaderBulletSpeed = 4;
        if(invaderBulletSpeed > 10) invaderBulletSpeed = 10;
        hitCount = 0;
        invaderFireDelay = 100;
        invaderFireSpeed = 50 - (stage * 5);
        if(invaderFireSpeed < 10) invaderFireSpeed = 10;
        invaderLanded = false;
        invaderLoopStart = false;
        stage++;

        if(newGame)
        {
            gun = null;
            invincible = 100;
            bulletDelay = 0;
            bulletSpeed = 100;
            spaceshipTimer = 0;
            lives = 3;
            g_SpriteManager.Initialise();
        }
        else
        {
            for(var count=0;count<55;count++)
            {
                g_SpriteList[count].active = false;
            }
        }

        // Create invader sprites
        var verticalOffset = 80 + (stage * 12);
        if(verticalOffset > 200) verticalOffset = 200;
        //for(var countRow=4;countRow>=0;countRow--)
        //{
        //    for(var countCol=0;countCol<11;countCol++)
        //    {
        //        var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1 + countRow, 64 + (countCol*50), verticalOffset + (countRow*40));
        //        //var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1 + 4, 64, verticalOffset);
        //    }
        //}
//T
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (1*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (2*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (3*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (2*50), verticalOffset + (2*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (2*50), verticalOffset + (3*40));

//H
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN2, 64 + (5*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN2, 64 + (5*50), verticalOffset + (2*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN2, 64 + (5*50), verticalOffset + (3*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN2, 64 + (6*50), verticalOffset + (2*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN2, 64 + (7*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN2, 64 + (7*50), verticalOffset + (2*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN2, 64 + (7*50), verticalOffset + (3*40));

//A
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (9*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (9*50), verticalOffset + (2*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (9*50), verticalOffset + (3*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (10*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (10*50), verticalOffset + (2*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (11*50), verticalOffset + (1*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (11*50), verticalOffset + (2*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN3, 64 + (11*50), verticalOffset + (3*40));

//N
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN4, 64 + (1*50), verticalOffset + (5*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN4, 64 + (1*50), verticalOffset + (6*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN4, 64 + (1*50), verticalOffset + (7*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.SPACESHIP, 64 + (2*50), verticalOffset + (6*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN4, 64 + (3*50), verticalOffset + (5*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN4, 64 + (3*50), verticalOffset + (6*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN4, 64 + (3*50), verticalOffset + (7*40));

//K
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN5, 64 + (5*50), verticalOffset + (5*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN5, 64 + (5*50), verticalOffset + (6*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN5, 64 + (5*50), verticalOffset + (7*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN5, 64 + (6*50), verticalOffset + (6*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN5, 64 + (7*50), verticalOffset + (5*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN5, 64 + (7*50), verticalOffset + (7*40));

//S
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (9*50), verticalOffset + (5*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (10*50), verticalOffset + (5*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (11*50), verticalOffset + (5*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.SPACESHIP, 64 + (10*50), verticalOffset + (6*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (9*50), verticalOffset + (7*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (10*50), verticalOffset + (7*40));
var index = g_GameManager.CreateSprite(SPRITETYPE.ALIEN1, 64 + (11*50), verticalOffset + (7*40));


        if(newGame)
        {
            // Create gun sprite
            gun = g_GameManager.CreateSprite(SPRITETYPE.GUN, 370, 500);

            // Create defences
            for(var defenceCount=0;defenceCount<4;defenceCount++)
            {
                //for(var countRow=0;countRow<6;countRow++)
                //{
                //    for(var countCol=0;countCol<8;countCol++)
                //    {
                //        if((countRow>0 && countRow<5) || (countRow==0 && countCol>0 && countCol<7) || (countRow==5 && (countCol==0 || countCol==7)))
                //        {
//g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((countCol * 8) + (defenceCount * 140)), 410 + (countRow * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (2 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (4 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (6 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (8 * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (2 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (4 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (6 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (8 * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((3 * 8) + (defenceCount * 140)), 410 + (2 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((4 * 8) + (defenceCount * 140)), 410 + (4 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((5 * 8) + (defenceCount * 140)), 410 + (6 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((6 * 8) + (defenceCount * 140)), 410 + (8 * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (1 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((2 * 8) + (defenceCount * 140)), 410 + (1 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((3 * 8) + (defenceCount * 140)), 410 + (1 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((4 * 8) + (defenceCount * 140)), 410 + (1 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((5 * 8) + (defenceCount * 140)), 410 + (1 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((6 * 8) + (defenceCount * 140)), 410 + (1 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((7 * 8) + (defenceCount * 140)), 410 + (1 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (1 * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (3 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((2 * 8) + (defenceCount * 140)), 410 + (3 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((3 * 8) + (defenceCount * 140)), 410 + (3 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((4 * 8) + (defenceCount * 140)), 410 + (3 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((5 * 8) + (defenceCount * 140)), 410 + (3 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((6 * 8) + (defenceCount * 140)), 410 + (3 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((7 * 8) + (defenceCount * 140)), 410 + (3 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (3 * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (5 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((2 * 8) + (defenceCount * 140)), 410 + (5 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((3 * 8) + (defenceCount * 140)), 410 + (5 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((4 * 8) + (defenceCount * 140)), 410 + (5 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((5 * 8) + (defenceCount * 140)), 410 + (5 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((6 * 8) + (defenceCount * 140)), 410 + (5 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((7 * 8) + (defenceCount * 140)), 410 + (5 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (5 * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (7 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((2 * 8) + (defenceCount * 140)), 410 + (7 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((3 * 8) + (defenceCount * 140)), 410 + (7 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((4 * 8) + (defenceCount * 140)), 410 + (7 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((5 * 8) + (defenceCount * 140)), 410 + (7 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((6 * 8) + (defenceCount * 140)), 410 + (7 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((7 * 8) + (defenceCount * 140)), 410 + (7 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (7 * 8));

g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((1 * 8) + (defenceCount * 140)), 410 + (9 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((2 * 8) + (defenceCount * 140)), 410 + (9 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((3 * 8) + (defenceCount * 140)), 410 + (9 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((4 * 8) + (defenceCount * 140)), 410 + (9 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((5 * 8) + (defenceCount * 140)), 410 + (9 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((6 * 8) + (defenceCount * 140)), 410 + (9 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((7 * 8) + (defenceCount * 140)), 410 + (9 * 8));
g_GameManager.CreateSprite(SPRITETYPE.BLOCK, 132 + ((8 * 8) + (defenceCount * 140)), 410 + (9 * 8));


                //        }
                //    }
                //}
            }
        }
    }



    // ---------------------------------------------------------------------
    // MainMenu - Main menu loop
    // ---------------------------------------------------------------------
    this.MainMenu = function()
    {
        var stateChanged = false;

        if(stateTimer==0 && g_ControlManager.Fire)
        {
            stateTimer = 100;
        }

        if(stateTimer>0)
        {
            stateTimer--;
            if(stateTimer==0)
            {
                g_GameManager.SetGameState(STATE.GAME);
                stateChanged = true;
            }
        }

        if(!stateChanged)
        {
            // Clear background
            g_Context.clearRect(0, 0, WIDTH, HEIGHT);

            // Draw graphics
            g_BitmapManager.Draw(BMP.BACKGROUND,0,0,800,600,0,0,800,600);

            // Draw top panel
            g_Context.textAlign = "left";
            g_Context.fillText("SCORE - " + IntPad(score, 5), 30, 35);
            g_Context.textAlign = "right";
            g_Context.fillText("HI-SCORE - 00000", 770, 35);

            // Draw center
            g_Context.fillStyle = "#49DB49";
            g_Context.textAlign = "center";
            g_Context.font = '20px sans-serif';        
            if(stateTimer>0) g_Context.fillText((stateTimer & 4 ? "GET READY" : ""), 400, 290);
            else
            {
                g_Context.fillText("-- GATE INVADERS --", 400, 250);
                g_Context.fillText("MOVE - CURSOR LEFT/RIGHT", 400, 300);
                g_Context.fillText("FIRE - SPACEBAR", 400, 330);
            }

            // Draw bottom panel
            g_Context.fillRect(20,560,760,2);
            g_Context.textAlign = "left";
            g_Context.fillText("3", 30, 584);
            for(var count=0;count<3;count++)
            {
                g_BitmapManager.Draw(BMP.GUN,0,0,26,16,50+(count*33),568,26,16);
            }
            g_Context.textAlign = "right";
            g_Context.fillText("STAGE 00", 770, 584);

            // Draw touch screen controls
            g_ControlManager.Draw();

            // Draw scanline effect
            g_BitmapManager.Draw(BMP.SCANLINES,0,0,800,600,0,0,800,600);
        }
    }



    // ---------------------------------------------------------------------
    // GameOver - Game over loop
    // ---------------------------------------------------------------------
    this.GameOver = function()
    {
        var stateChanged = false;

        if(stateTimer==0)
        {
            stateTimer = 100;
        }

        if(stateTimer>0)
        {
            stateTimer--;
            if(stateTimer==0)
            {
                g_GameManager.SetGameState(STATE.MENU);
                stateChanged = true;
            }
        }

        if(!stateChanged)
        {
            // Clear background
            g_Context.clearRect(0, 0, WIDTH, HEIGHT);

            // Draw graphics
            g_BitmapManager.Draw(BMP.BACKGROUND,0,0,800,600,0,0,800,600);

            // Draw top panel
            g_Context.textAlign = "left";
            g_Context.fillText("SCORE - " + IntPad(score, 5), 30, 35);
            g_Context.textAlign = "right";
            g_Context.fillText("HI-SCORE - 00000", 770, 35);

            // Draw center
            g_Context.fillStyle = "#49DB49";
            g_Context.textAlign = "center";
            g_Context.font = '20px sans-serif';        
            g_Context.fillText("GAME OVER", 400, 290);        

            // Draw bottom panel
            g_Context.fillRect(20,560,760,2);
            g_Context.textAlign = "left";
            g_Context.fillText("0", 30, 584);        
            g_Context.textAlign = "right";
            g_Context.fillText("STAGE " + stage, 770, 584);

            // Draw touch screen controls
            g_ControlManager.Draw();

            // Draw scanline effect
            g_BitmapManager.Draw(BMP.SCANLINES,0,0,800,600,0,0,800,600);
        }
    }



    // ---------------------------------------------------------------------
    // MainLoop - Main game loop
    // ---------------------------------------------------------------------
    this.MainLoop = function()
    {
        if(!g_SpriteList[gun].dormant)
        {
            // Move gun
            if(g_ControlManager.Left) g_SpriteList[gun].speedX = -2;
            else if(g_ControlManager.Right) g_SpriteList[gun].speedX = 2;
            else g_SpriteList[gun].speedX = 0;

            // Fire gun
            if(bulletDelay > 0)
            {
                bulletDelay--;
            }
            else
            {
                if(g_ControlManager.Fire)
                {
                    g_GameManager.CreateSprite(SPRITETYPE.BULLET1, g_SpriteList[gun].x, g_SpriteList[gun].y - 18, 0);                    
                    bulletDelay = bulletSpeed;
                }
            }
        }

        // Check for invaders landed
        if(invaderLanded && invaderLoopStart && lives >= 0)
        {
            for(var pcount=0;pcount<30;pcount++)
            {
                g_ParticleManager.AddParticle(new Particle(g_SpriteList[gun].x+22, g_SpriteList[gun].y+16, 0, 1));
            }                                    
            g_SpriteList[gun].active = false;
            lives = -1;
            stateTimer = 200;            
        }
        
        if(stateTimer==0)
        {
            // Check for game reset
            if(hitCount == 55)
            {
                g_GameManager.Reset(false);
            }

            // Spaceship timer        
            if(spaceshipTimer == 0 || (spaceshipTimer==-1 && !g_SpriteManager.Exists(SPRITETYPE.SPACESHIP)))
            {
                spaceshipTimer = RandomInt(800, 1500);
            }
            else if(spaceshipTimer > 0)
            {
                spaceshipTimer--;
                if(spaceshipTimer == 0)
                {
                    g_GameManager.CreateSprite(SPRITETYPE.SPACESHIP, -60, 45);
                    spaceshipTimer = -1;
                }
            }

            // Update invaders
            if(invaderCreating)
            {
                g_SpriteList[invaderIndex].visible = true;
            }
            else
            {
                if(!invaderAdvancing)
                {
                    if((g_SpriteList[invaderIndex].x >= 676 && invaderDir > 0) || (g_SpriteList[invaderIndex].x <= 64 && invaderDir < 0))
                    {
                        invaderAtEdge = true;
                    }
                    g_SpriteList[invaderIndex].speedX = invaderDir;
                }
                else
                {
                    g_SpriteList[invaderIndex].speedY = invaderSpeedY;
                    if(g_SpriteList[invaderIndex].y + g_SpriteList[invaderIndex].speedY > 460)
                    {
                        invaderLanded = true;
                    }
                }
            }

            // Move to next invader
            invaderLoopStart = false;
            do
            {
                invaderIndex++;
                if(invaderIndex == 33)
                {
                    invaderIndex = 0;
                    invaderLoopStart = true;
                }
            } while(g_SpriteList[invaderIndex].dormant == true);

            // Check to cancel invader creation period
            if(invaderCreating && invaderLoopStart)
            {
                invaderCreating = false;
            }

            // Reset advancing state and start moving in new direction
            if(invaderAdvancing && invaderLoopStart)
            {            
                invaderDir = -invaderDir;
                invaderAdvancing = false;
                invaderAtEdge = false;
            }

            // Start advancing state
            if(invaderAtEdge && invaderLoopStart)
            {
                invaderAdvancing = true;
            }

            // Choose invader to fire
            if(invaderFireDelay>0)
            {
                invaderFireDelay--;
            }
            else
            {            
                var selIndex = -1;
                while(selIndex == -1)
                {
                    var column = RandomInt(0, 10);
                    for(var count=0;count<5;count++)
                    {
                        if(!g_SpriteList[column+(count*11)].dormant)
                        {
                            selIndex = column+(count*11);                    
                            break;
                        }
                    }
                }

                if(selIndex>-1)
                {
                    g_GameManager.CreateSprite(SPRITETYPE.BULLET2, g_SpriteList[selIndex].x, g_SpriteList[selIndex].y + 10);
                }
                invaderFireDelay = invaderFireSpeed;
            }
        }

        // Update game objects
        g_SpriteManager.Update();
        g_ParticleManager.Update();

        // Check for bullets hitting things
        for(var bulletIndex=0;bulletIndex<g_SpriteList.length;bulletIndex++)
        {
            // Gun bullet
            if(g_SpriteList[bulletIndex].active && g_SpriteList[bulletIndex].type == SPRITETYPE.BULLET1)
            {
                for(var spriteIndex=0;spriteIndex<g_SpriteList.length;spriteIndex++)
                {
                    if(bulletIndex != spriteIndex &&  g_SpriteList[spriteIndex].active && !g_SpriteList[spriteIndex].dormant && g_SpriteManager.Collide(g_SpriteList[bulletIndex], g_SpriteList[spriteIndex]))
                    {
                        switch(g_SpriteList[spriteIndex].type)
                        {
                            case SPRITETYPE.ALIEN1:
                            case SPRITETYPE.ALIEN2:
                            {
                                for(var pcount=0;pcount<30;pcount++)
                                {
                                    g_ParticleManager.AddParticle(new Particle(g_SpriteList[spriteIndex].x+22, g_SpriteList[spriteIndex].y+16, 0, 1));
                                }
                                hitCount++;
                                score+=30;                                    
                                g_SpriteList[spriteIndex].dormant = true;
                                g_SpriteList[bulletIndex].active = false;
                            } break;
                            case SPRITETYPE.ALIEN3:
                            case SPRITETYPE.ALIEN4:
                            {
                                for(var pcount=0;pcount<30;pcount++)
                                {
                                    g_ParticleManager.AddParticle(new Particle(g_SpriteList[spriteIndex].x+22, g_SpriteList[spriteIndex].y+16, 4, 5));
                                }
                                hitCount++;
                                score+=20;
                                g_SpriteList[spriteIndex].dormant = true;
                                g_SpriteList[bulletIndex].active = false;
                            } break;
                            case SPRITETYPE.ALIEN5:
                            {
                                for(var pcount=0;pcount<30;pcount++)
                                {
                                    g_ParticleManager.AddParticle(new Particle(g_SpriteList[spriteIndex].x+22, g_SpriteList[spriteIndex].y+16, 2, 3));
                                }
                                hitCount++;
                                score+=10;
                                g_SpriteList[spriteIndex].dormant = true;
                                g_SpriteList[bulletIndex].active = false;
                            } break;
                            case SPRITETYPE.BLOCK:
                            {
                                for(var pcount=0;pcount<10;pcount++)
                                {
                                    g_ParticleManager.AddParticle(new Particle(g_SpriteList[spriteIndex].x+22, g_SpriteList[spriteIndex].y+16, 0, 1));
                                }                                
                                g_SpriteList[spriteIndex].active = false;
                                g_SpriteList[bulletIndex].active = false;
                            } break;
                            case SPRITETYPE.SPACESHIP:
                            {
                                for(var pcount=0;pcount<40;pcount++)
                                {
                                    g_ParticleManager.AddParticle(new Particle(g_SpriteList[spriteIndex].x+22, g_SpriteList[spriteIndex].y+16, 0, 5));                            
                                }
                                score+=250;                                
                                g_SpriteList[spriteIndex].active = false;
                                g_SpriteList[bulletIndex].active = false;
                                spaceshipTimer = 0;
                            } break;
                        }
                    }
                }
            }

            // Invader bullet
            if(g_SpriteList[bulletIndex].active && g_SpriteList[bulletIndex].type == SPRITETYPE.BULLET2)
            {
                for(var spriteIndex=0;spriteIndex<g_SpriteList.length;spriteIndex++)
                {
                    if(bulletIndex != spriteIndex &&  g_SpriteList[spriteIndex].active && !g_SpriteList[spriteIndex].dormant && g_SpriteManager.Collide(g_SpriteList[bulletIndex], g_SpriteList[spriteIndex]))
                    {
                        switch(g_SpriteList[spriteIndex].type)
                        {
                            case SPRITETYPE.GUN:
                            {                        
                                if(invincible==0)
                                {
                                    for(var pcount=0;pcount<30;pcount++)
                                    {
                                        g_ParticleManager.AddParticle(new Particle(g_SpriteList[spriteIndex].x+22, g_SpriteList[spriteIndex].y+16, 0, 1));
                                    }                                    
                                    g_SpriteList[spriteIndex].dormant = true;
                                    g_SpriteList[bulletIndex].active = false;                                    
                                    lives--;
                                    if(lives<0)
                                    {
                                        g_SpriteList[spriteIndex].active = false;
                                        stateTimer = 50;
                                    }
                                    else
                                    {
                                        invincible = 160;
                                    }
                                }
                            } break;

                            case SPRITETYPE.BLOCK:
                            {
                                for(var pcount=0;pcount<10;pcount++)
                                {
                                    g_ParticleManager.AddParticle(new Particle(g_SpriteList[spriteIndex].x+22, g_SpriteList[spriteIndex].y+16, 0, 1));
                                }                                
                                g_SpriteList[spriteIndex].active = false;
                                g_SpriteList[bulletIndex].active = false;                                
                            } break;
                        }
                    }
                }
            }
        }

        // Cancel bullet delay if all bullets gone
        if(bulletDelay > 0 && !g_SpriteManager.Exists(SPRITETYPE.BULLET1))
        {
            bulletDelay = 0;
        }

        // Update gun invincibility
        if(invincible > 80)
        {
            invincible--;
        }
        else if(invincible > 0)
        {
            g_SpriteList[gun].dormant = false;
            g_SpriteList[gun].visible = (invincible & 4);
            invincible--;
        }
        else
        {
            g_SpriteList[gun].visible = true;
        }

        // State timer update
        if(stateTimer>0)
        {
            stateTimer--;
            if(stateTimer==0)
            {
                g_GameManager.SetGameState(STATE.GAMEOVER);
            }
        }


        // Clear background
        g_Context.clearRect(0, 0, WIDTH, HEIGHT);

        // Draw graphics
        g_BitmapManager.Draw(BMP.BACKGROUND,0,0,800,600,0,0,800,600);
        g_SpriteManager.Draw();
        g_ParticleManager.Draw();

        g_Context.fillStyle = "#49DB49";
        g_Context.font = '20px sans-serif';
        
        // Draw top panel
        g_Context.textAlign = "left";
        g_Context.fillText("SCORE - " + IntPad(score, 5), 30, 35);
        g_Context.textAlign = "right";
        g_Context.fillText("HI-SCORE - 00000", 770, 35);            

        // Draw bottom panel
        g_Context.fillRect(20,560,760,2);
        g_Context.textAlign = "left";
        g_Context.fillText((lives == -1 ? "0" : lives), 30, 584);
        for(var count=0;count<lives;count++)
        {
            g_BitmapManager.Draw(BMP.GUN,0,0,26,16,50+(count*33),568,26,16);
        }
        g_Context.textAlign = "right";
        g_Context.fillText("STAGE " + IntPad(stage, 2), 770, 584);

        // Draw touch screen controls
        g_ControlManager.Draw();

        //g_Context.textAlign = "left";
        //g_Context.fillText(g_SpriteList[0].x + ", " + g_SpriteList[0].y, 30, 70);

        // Draw scanline effect
        g_BitmapManager.Draw(BMP.SCANLINES,0,0,800,600,0,0,800,600);
    }
}
