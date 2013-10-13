function ParticleManager()
{
    this.ParticleList = new Array();

    this.Initialise = function()
    {
    }

    this.AddParticle = function(newParticle)
    {
        this.ParticleList.push(newParticle);
        return this.ParticleList.length - 1;
    }

    this.RemoveParticle = function(particle)
    {
        this.ParticleList.removeObject(particle);
    }

    this.Count = function()
    {
        return this.ParticleList.length;
    }

    this.Update = function()
    {
        for (var count=0; count<this.ParticleList.length; count++)
        {
            this.ParticleList[count].Update();
        }
    }

    this.Draw = function()
    {
        for (var count=0; count<this.ParticleList.length; count++)
        {        
            this.ParticleList[count].Draw();
        }
        g_Context.globalAlpha = 1;
    }
}
