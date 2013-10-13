function BitmapManager()
{
    this.loadCount = 0;
    this.BitmapList = new Array();
}

BitmapManager.prototype.RegisterBitmap = function(sourceImage, tileWidth, tileHeight)
{        
    this.BitmapList.push(new Bitmap(sourceImage, tileWidth, tileHeight));
}

BitmapManager.prototype.DownloadAll = function(readyCallback)
{
    g_Context.font = '18px sans-serif';
    g_Context.textAlign = "center";

    for(var count=0;count<this.BitmapList.length;count++)
    {
        g_Context.fillStyle = "#000000";
        g_Context.fillRect(0,0,WIDTH,HEIGHT);
        g_Context.fillStyle = "#AAAAAA";
        g_Context.fillText("Loading " + (count+1) + "...", WIDTH>>1, HEIGHT>>1);

        var instance = this; 
        this.BitmapList[count].image.addEventListener("load", function()
        {
            instance.loadCount++;
            if(instance.loadCount == instance.BitmapList.length)
            {
                readyCallback();
            }
        }, false);
        this.BitmapList[count].image.src = this.BitmapList[count].imagePath;
    }
}

BitmapManager.prototype.Draw = function(bitmapIndex, sx, sy, sw, sh, dx, dy, dw, dh)
{
    g_Context.drawImage(this.BitmapList[bitmapIndex].image, sx, sy, sw, sh, dx, dy, dw, dh);
}
