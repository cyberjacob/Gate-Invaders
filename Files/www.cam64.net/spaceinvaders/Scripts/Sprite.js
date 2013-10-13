var LIMIT_ACTION = { STOP : 0,
                     KILL : 1 };

function Sprite()
{
    this.Clear();    
}

Sprite.prototype.Clear = function()
{
    this.index = -1;
    this.active = false;
    this.dormant = false;
    this.type = null;
    this.x = 0;
    this.y = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.animation = null;
    this.persistSpeed = false;
    this.visible = true;
    this.minX = null;
    this.minY = null;
    this.maxX = null;
    this.maxY = null;
    this.limitAction = LIMIT_ACTION.STOP;
    this.hotArea = null;
}

Sprite.prototype.Update = function()
{
    if(this.active && !this.dormant)
    {
        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Clear speed, unless persisted
        if(!this.persistSpeed)
        {
            this.speedX = 0;
            this.speedY = 0;
        }

        // Stop at limit
        if(this.limitAction == LIMIT_ACTION.STOP)
        {
            if(this.minX != null && this.x < this.minX) this.x = this.minX;
            if(this.maxX != null && this.x > this.maxX) this.x = this.maxX;
            if(this.minY != null && this.y < this.minY) this.y = this.minY;
            if(this.maxY != null && this.y > this.maxY) this.y = this.maxY;
        }

        // Kill at limit
        if(this.limitAction == LIMIT_ACTION.KILL)
        {
            if(this.minX != null && this.x < this.minX) g_SpriteList[this.index].active = false;
            if(this.maxX != null && this.x > this.maxX) g_SpriteList[this.index].active = false;
            if(this.minY != null && this.y < this.minY) g_SpriteList[this.index].active = false;
            if(this.maxY != null && this.y > this.maxY) g_SpriteList[this.index].active = false;
        }        

        // Update animation
        this.animation.Update();
    }
}

Sprite.prototype.Draw = function()
{
    if(this.active && this.visible && !this.dormant)
    {
        var bitmap = g_BitmapManager.BitmapList[this.animation.bitmapIndex];
        g_Context.drawImage(bitmap.image,
                            this.animation.currentFrame * bitmap.tileWidth, 0, bitmap.tileWidth, bitmap.tileHeight,
                            this.x, this.y, bitmap.tileWidth, bitmap.tileHeight);
    }
}
