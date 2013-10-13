function ControlManager()
{    
    this.Up = false;
    this.Down = false;
    this.Left = false;
    this.Right = false;
    this.Fire = false;
    this.MouseClick = false;
    this.MouseX = 0;
    this.MouseY = 0;
    this.TouchEnabled = false;
    this.TouchLeftEnabled = false;
    this.TouchLeftX = 0;
    this.TouchLeftY = 0;
    this.TouchRightEnabled = false;
    this.TouchRightX = 0;
    this.TouchRightY = 0;
    this.TouchUpEnabled = false;
    this.TouchUpX = 0;
    this.TouchUpY = 0;
    this.TouchDownEnabled = false;
    this.TouchDownX = 0;
    this.TouchDownY = 0;
    this.TouchFireEnabled = false;
    this.TouchFireX = 0;
    this.TouchFireY = 0;
    this.TouchesArray = null;
    this.ChangedTouchesArray = null;
    this.Diagnostics = false;


    // ---------------------------------------------------------------------
    // Initialise - Initial game controls
    // ---------------------------------------------------------------------
    this.Initialise = function()
    {
        // Keyboard event handlers
        window.addEventListener('keydown', g_ControlManager.KeyDownEvent, true);
        window.addEventListener('keyup', g_ControlManager.KeyUpEvent, true);

        // Mouse event handlers
        g_Canvas.onmousedown = g_ControlManager.MouseDownEvent;
	    g_Canvas.onmouseup = g_ControlManager.MouseUpEvent;

        // Enable touch controls if required
        g_ControlManager.TouchEnabled = !!('ontouchstart' in window) ? 1 : 0;      
        
        if(g_ControlManager.TouchEnabled)
        {
            // Touch screen event handlers        
            g_Canvas.ontouchstart = g_ControlManager.TouchStartEvent;
            g_Canvas.ontouchmove = g_ControlManager.TouchMoveEvent;
	        g_Canvas.ontouchend = g_ControlManager.TouchEndEvent;
        }
    }


    // ---------------------------------------------------------------------
    // Key down event handler
    // ---------------------------------------------------------------------
    this.KeyDownEvent = function(evt)
    {
        switch (evt.keyCode)
        {
            case 32: { g_ControlManager.Fire = true; } break;
            case 38: { g_ControlManager.Up = true; } break;
            case 40: { g_ControlManager.Down = true; } break;
            case 37: { g_ControlManager.Left = true; } break;
            case 39: { g_ControlManager.Right = true; } break;
        }
    }


    // ---------------------------------------------------------------------
    // Key up event handler
    // ---------------------------------------------------------------------
    this.KeyUpEvent = function(evt)
    {
        switch (evt.keyCode)
        {
            case 32: { g_ControlManager.Fire = false; } break;
            case 38: { g_ControlManager.Up = false; } break;
            case 40: { g_ControlManager.Down = false; } break;
            case 37: { g_ControlManager.Left = false; } break;
            case 39: { g_ControlManager.Right = false; } break;
        }
    }


    // ---------------------------------------------------------------------
    // Mouse down event handler
    // ---------------------------------------------------------------------
    this.MouseDownEvent = function(e)
    {
		g_ControlManager.SetCoords(e);
		g_ControlManager.MouseClick = true;
		g_Canvas.onmousemove = g_ControlManager.MouseMoveEvent;
        return false;
    }


    // ---------------------------------------------------------------------
    // Mouse move event handler
    // ---------------------------------------------------------------------
    this.MouseMoveEvent = function(e)
    {   
        g_ControlManager.SetCoords(e);
        return false;
    }


    // ---------------------------------------------------------------------
    // Mouse up event handler
    // ---------------------------------------------------------------------
    this.MouseUpEvent = function(e)
    {
	    g_Canvas.onmousemove = null;
        g_ControlManager.MouseClick = false;
        g_ControlManager.SetCoords(e);
        return false;
    }


    // ---------------------------------------------------------------------
    // Touch start event handler
    // ---------------------------------------------------------------------
    this.TouchStartEvent = function(e)
    {    
        e.preventDefault();
        g_ControlManager.TouchesArray = e.touches;
		g_ControlManager.RefreshTouches(); 
        g_ControlManager.MouseClick = true;       
        	
        return false;
    }


    // ---------------------------------------------------------------------
    // Touch move event handler
    // ---------------------------------------------------------------------
    this.TouchMoveEvent = function(e)
    {    
        g_ControlManager.RefreshTouches();
        return false;
    }


    // ---------------------------------------------------------------------
    // Touch end event handler
    // ---------------------------------------------------------------------
    this.TouchEndEvent = function(e)
    {
        g_ControlManager.TouchesArray = e.touches;
        g_ControlManager.ChangedTouchesArray = e.changedTouches;
        g_ControlManager.RefreshTouches();
        g_ControlManager.MouseClick = false;

        return false;
    }


    // ---------------------------------------------------------------------
    // Refresh hit touch controls
    // ---------------------------------------------------------------------
    this.RefreshTouches = function()
    {
        var tempLeft = false;
        var tempRight = false;
        var tempUp = false;
        var tempDown = false;
        var tempFire = false;
        
        for (var i = 0; i < g_ControlManager.TouchesArray.length; i++)
        {
			g_ControlManager.SetCoords(g_ControlManager.TouchesArray[i]);
            if(PointInSquare(g_ControlManager.TouchLeftX,g_ControlManager.TouchLeftY,103,103,g_ControlManager.MouseX,g_ControlManager.MouseY)) tempLeft = true;
            if(PointInSquare(g_ControlManager.TouchRightX,g_ControlManager.TouchRightY,103,103,g_ControlManager.MouseX,g_ControlManager.MouseY)) tempRight = true;
            if(PointInSquare(g_ControlManager.TouchUpX,g_ControlManager.TouchUpY,103,103,g_ControlManager.MouseX,g_ControlManager.MouseY)) tempUp = true;
            if(PointInSquare(g_ControlManager.TouchDownX,g_ControlManager.TouchDownY,103,103,g_ControlManager.MouseX,g_ControlManager.MouseY)) tempDown = true;
            if(PointInSquare(g_ControlManager.TouchFireX,g_ControlManager.TouchFireY,103,103,g_ControlManager.MouseX,g_ControlManager.MouseY)) tempFire = true;
		}

        g_ControlManager.Left = tempLeft;
        g_ControlManager.Right = tempRight;
        g_ControlManager.Up = tempUp;
        g_ControlManager.Down = tempDown;
        g_ControlManager.Fire = tempFire;
    }


    // ---------------------------------------------------------------------
    // Set mouse/touch co-ordinates
    // ---------------------------------------------------------------------
    this.SetCoords = function(e)
    {
        if (e.offsetX)
        {
            // Works in Chrome / Safari (except on iPad/iPhone)
            this.MouseX = e.offsetX;
            this.MouseY = e.offsetY;
        }
        else if (e.layerX)
        {
            // Works in Firefox
            this.MouseX = e.layerX;
            this.MouseY = e.layerY;
        }
        else
        {
            // Works in Safari on iPad/iPhone
            this.MouseX = e.pageX - g_Canvas.offsetLeft;
            this.MouseY = e.pageY - g_Canvas.offsetTop;
        }

    }


    // ---------------------------------------------------------------------
    // Draw touch screen controls
    // ---------------------------------------------------------------------
    this.Draw = function()
    {
        // Draw touch controls, if enabled
        if(g_ControlManager.TouchEnabled)
        {
            if(g_ControlManager.TouchLeftEnabled) g_BitmapManager.Draw(BMP.CONTROLS,0 + (515 * (g_ControlManager.Left ? 1 : 0)),0,103,103,this.TouchLeftX,this.TouchLeftY,103,103);
            if(g_ControlManager.TouchRightEnabled) g_BitmapManager.Draw(BMP.CONTROLS,103 + (515 * (g_ControlManager.Right ? 1 : 0)),0,103,103,this.TouchRightX,this.TouchRightY,103,103);
            if(g_ControlManager.TouchUpEnabled) g_BitmapManager.Draw(BMP.CONTROLS,206 + (515 * (g_ControlManager.Up ? 1 : 0)),0,103,103,this.TouchUpX,this.TouchUpY,103,103);
            if(g_ControlManager.TouchDownEnabled) g_BitmapManager.Draw(BMP.CONTROLS,309 + (515 * (g_ControlManager.Down ? 1 : 0)),0,103,103,this.TouchDownX,this.TouchDownY,103,103);
            if(g_ControlManager.TouchFireEnabled) g_BitmapManager.Draw(BMP.CONTROLS,412 + (515 * (g_ControlManager.Fire ? 1 : 0)),0,103,103,this.TouchFireX,this.TouchFireY,103,103);
        }

        // Display diagnostics, if required
        if(g_ControlManager.Diagnostics)
        {
            g_Context.textAlign = "left";
            var dy = 40;

            g_Context.fillText("Controls: ", 25, dy); dy+=20;
            g_Context.fillText("Up = " + (g_ControlManager.Up ? "On" : "--"), 50, dy); dy+=20;
            g_Context.fillText("Down = " + (g_ControlManager.Down ? "On" : "--"), 50, dy); dy+=20;
            g_Context.fillText("Left = " + (g_ControlManager.Left ? "On" : "--"), 50, dy); dy+=20;
            g_Context.fillText("Right = " + (g_ControlManager.Right ? "On" : "--"), 50, dy); dy+=20;
            g_Context.fillText("Fire = " + (g_ControlManager.Fire ? "On" : "--"), 50, dy); dy+=35;

            g_Context.fillText("Mouse: ", 25, dy); dy+=20;
            g_Context.fillText("Status = " + (g_ControlManager.MouseClick ? "Down" : "Up"), 50, dy); dy+=20;
            g_Context.fillText("Coords = " + g_ControlManager.MouseX + ", " + g_ControlManager.MouseY, 50, dy); dy+=35;

            g_Context.fillText("Touch: ", 25, dy); dy+=20;
            if(g_ControlManager.TouchesArray == null)
            {
                g_Context.fillText("Touches = " + null, 50, dy); dy+=20;
            }
            else
            {
                var touchString = "";
                if(g_ControlManager.TouchesArray.length > 0)
                {
                    touchString = " - ";
                    for(var i=0;i<g_ControlManager.TouchesArray.length;i++)
                    {
                        touchString += "{" + (g_ControlManager.TouchesArray[i].pageX - g_Canvas.offsetLeft) + ", " + (g_ControlManager.TouchesArray[i].pageY - g_Canvas.offsetTop) + "}, ";
                    }
                }
                g_Context.fillText("Touches = " + g_ControlManager.TouchesArray.length + touchString, 50, dy); dy+=20;
            }
            
            g_Context.fillText("Changed = " + (g_ControlManager.ChangedTouchesArray == null ? "null" : g_ControlManager.ChangedTouchesArray.length), 50, dy); dy+=20;
        }
    }
}
