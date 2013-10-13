function Bitmap(sourceImage, tileWidth, tileHeight)
{
    this.imagePath = sourceImage;
    this.image = new Image();
    this.tileWidth = tileWidth;
    this.tileHeight = tileHeight;
    this.ready = false;
}
