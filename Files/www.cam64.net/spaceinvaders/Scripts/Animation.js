var ANIM_TYPE = { NONE : 0,
                  REPEAT : 1,
                  PINGPONG : 2,
                  RANDOM : 3 };

function Animation(bitmapIndex, frames, speed, style)
{
    this.bitmapIndex = bitmapIndex;
    this.frames = frames;
    this.speed = speed;
    this.frameTimer = 0;
    this.frameDirection = 1;
    this.currentFrameIndex = 0;

    if (frames instanceof Array)
    {
        this.currentFrame = frames[0];
        this.style = style;
    }
    else
    {
        this.currentFrame = frames;        
        this.style = ANIM_TYPE.NONE;
    }

    this.Update = function()
    {
        var newFrame;

        if(this.style != ANIM_TYPE.NONE)
        {
            this.frameTimer++;
            if(this.frameTimer >= this.speed)
            {
                this.frameTimer = 0;
                switch(this.style)
                {
                    case ANIM_TYPE.REPEAT:
                    {
                        this.currentFrameIndex++;
                        if(this.currentFrameIndex >= this.frames.length)
                        {
                            this.currentFrameIndex = 0;
                        }
                    } break;
                    case ANIM_TYPE.PINGPONG:
                    {
                        this.currentFrameIndex += this.frameDirection;
                        if(this.currentFrameIndex == this.frames.length-1 || this.currentFrameIndex == 0)
                        {
                            this.frameDirection = -this.frameDirection;
                        }
                    } break;
                    case ANIM_TYPE.RANDOM:
                    {
                        if(this.frames.length>1)
                        {
                            do
                            {
                                newFrame = Math.floor(Math.random() * this.frames.length);
                            } while (newFrame == this.currentFrameIndex);
                            this.currentFrameIndex = newFrame;
                        }
                    } break;
                }
                this.currentFrame = this.frames[this.currentFrameIndex];
            }
        }        
    }
}
