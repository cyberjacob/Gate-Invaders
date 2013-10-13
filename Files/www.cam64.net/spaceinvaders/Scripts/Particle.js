function Particle(x, y, frameStart, frameEnd)
{
    this.x = x;
    this.y = y;
    this.speedX = RandomFloat(-2,2);
    this.speedY = RandomFloat(-2,2);
    this.life = RandomInt(30,60);
    this.animation = new Animation(BMP.PARTICLES, RandomInt(frameStart, frameEnd));

    this.Update = function()
    {
        this.life--;
        if(this.life == 0)
        {
            g_ParticleManager.RemoveParticle(this);
        }
        else
        {
            this.speedX = this.speedX * .96;
            this.speedY = this.speedY * .96;

            this.x += this.speedX;
            this.y += this.speedY;        

            this.animation.Update();

            if(this.x > WIDTH || this.x < -16 || this.y > HEIGHT || this.y < -16)
            {
                g_ParticleManager.RemoveParticle(this);
            }
        }        
    }

    this.Draw = function()
    {
        g_Context.globalAlpha = this.life / 60;
        var bitmap = g_BitmapManager.BitmapList[this.animation.bitmapIndex];
        g_Context.drawImage(bitmap.image,
                            this.animation.currentFrame * bitmap.tileWidth, 0, bitmap.tileWidth, bitmap.tileHeight,
                            this.x, this.y, bitmap.tileWidth, bitmap.tileHeight);    
    }
}
