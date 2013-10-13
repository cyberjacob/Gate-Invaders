var g_SpriteList = null;

function SpriteManager()
{
    this.Initialise = function()
    {
        g_SpriteList = null;
    }

    this.AddSprite = function(x, y, animation)
    {
        var index = this.NextAvailableSprite();

        g_SpriteList[index].Clear();
        g_SpriteList[index].index = index;
        g_SpriteList[index].active = true;
        g_SpriteList[index].x = x;
        g_SpriteList[index].y = y;
        g_SpriteList[index].animation = animation;
                
        return index;
    }

    this.NextAvailableSprite = function()
    {
        var result = -1;

        if(g_SpriteList != null)
        {
            for(var count=0;count<g_SpriteList.length;count++)
            {
                if(!g_SpriteList[count].active)
                {
                    result = count;
                    break;
                }
            }
        }
        else
        {
            g_SpriteList = new Array();
        }

        if(result==-1)
        {            
            result = g_SpriteList.length;
            for(var count=0;count<10;count++)
            {
                g_SpriteList[g_SpriteList.length] = new Sprite();
            }
        }

        return result;
    }

    this.CountActive = function()
    {
        var result = 0;

        for(var count=0;count<g_SpriteList.length;count++)
        {
            if(g_SpriteList[count].active) result++;
        }

        return result;
    }

    this.RemoveSprite = function(index)
    {
        g_SpriteList[index].active = false;
    }

    this.Update = function()
    {
        for (var count=0; count<g_SpriteList.length; count++)
        {
            g_SpriteList[count].Update();
        }
    }

    this.Exists = function(spriteType)
    {
        var result = false;

        for (var count=0; count<g_SpriteList.length; count++)
        {            
            if(g_SpriteList[count].active && g_SpriteList[count].type == spriteType)
            {
                result = true;
                break;
            }
        }

        return result;
    }

    this.Collide = function(sprite1, sprite2)
    {
        var result = false;

        if(sprite1.hotArea != null && sprite2.hotArea != null)
        {
            result = SquaresOverlap(sprite1.x + sprite1.hotArea.x,
                                    sprite1.y + sprite1.hotArea.y,
                                    sprite1.hotArea.width,
                                    sprite1.hotArea.height,
                                    sprite2.x + sprite2.hotArea.x,
                                    sprite2.y + sprite2.hotArea.y,
                                    sprite2.hotArea.width,
                                    sprite2.hotArea.height);
        }

        return result;
    }

    this.Draw = function()
    {
        for (var count=0; count<g_SpriteList.length; count++)
        {        
            g_SpriteList[count].Draw();        
        }
    }
}
