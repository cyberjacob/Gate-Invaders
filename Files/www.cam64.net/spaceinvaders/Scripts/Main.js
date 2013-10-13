var WIDTH = 800;
var HEIGHT = 600;
var g_GameManager;
var g_BitmapManager;
var g_SpriteManager;
var g_MapManager;
var g_Canvas;
var g_Context;

function Init()
{
    // Set title
    document.title="S̶p̶a̶c̶e̶ Gate Invaders";

    // Attempt to get canvas
    g_Canvas = document.getElementById("canvas");
    if(g_Canvas.getContext)
    {
        // Get canvas context
        g_Context = g_Canvas.getContext("2d");
        g_Context.font = "11px Arial";
        g_Context.fillStyle = "#ffffff";    
        
        // Initialise server manager
        g_ServerManager = new ServerManager();
        g_ServerManager.Initialise();

        // Initialise control manager
        g_ControlManager = new ControlManager();
        g_ControlManager.Initialise();

        // Setup touch screen controls
        g_ControlManager.TouchLeftEnabled = true;
        g_ControlManager.TouchLeftX = 10;
        g_ControlManager.TouchLeftY = 487;
        g_ControlManager.TouchRightEnabled = true;
        g_ControlManager.TouchRightX = 130;
        g_ControlManager.TouchRightY = 487;
        g_ControlManager.TouchFireEnabled = true;
        g_ControlManager.TouchFireX = 687;
        g_ControlManager.TouchFireY = 487;        

        // Initialise game manager
        g_GameManager = new GameManager();
        g_GameManager.Initialise();        
    }
}
