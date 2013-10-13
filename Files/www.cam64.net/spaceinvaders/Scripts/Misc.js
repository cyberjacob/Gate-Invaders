/**
    Removes a number of objects from the array
    @param from The first object to remove
    @param to (Optional) The last object to remove
*/
Array.prototype.remove = function(/**Number*/ from, /**Number*/ to)
{
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
}

/**
    Removes a specific object from the array
    @param object The object to remove
*/
Array.prototype.removeObject = function(object)
{
    for (var i = 0; i < this.length; ++i)
    {
        if (this[i] === object)
        {
            this.remove(i);
            break;
        }
    }
}


function Point3D(x, y, z)
{
    this.x = x;
    this.y = y;
    this.z = z;
    this.sx = 319-(this.x*2)+(this.y*2);
	this.sy = 449-this.x-this.y-this.z;

    this.Refresh = function()
    {
        this.sx = 319-(this.x*2)+(this.y*2);
	    this.sy = 449-this.x-this.y-this.z;
    }
}

function Rectangle(x, y, width, height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
}


function TestObject()
{
    var m_value = 10;

    this.Method1 = function()
    {
        return m_value;
    }
}

TestObject.prototype.Method2 = function()
{
    return this.m_value;
}

function getCursorPosition(canvas, event)
{ 
    var x, y; 
 
    canoffset = $(canvas).offset(); 
    x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft - Math.floor(canoffset.left); 
    y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop - Math.floor(canoffset.top) + 1; 
 
    return [x,y]; 
} 

function RandomInt(min, max)
{
    return Math.floor(RandomFloat(min, max+1));
}

function RandomFloat(min, max)
{
    return min + (Math.random() * (max - min));
}

function RectanglesOverlap(rect1, rect2)
{
    return SquaresOverlap(rect1.x, rect1.y, rect1.width, rect1.height, rect2.x, rect2.y, rect2.width, rect2.height);
}

function SquaresOverlap(x_pos1, y_pos1, width1, height1, x_pos2, y_pos2, width2, height2)
{
	var result = false;
	
	if(x_pos1+width1>x_pos2 && x_pos1<x_pos2+width2 && y_pos1+height1>y_pos2 && y_pos1<y_pos2+height2) result = true;
	
	return result;
}

function PointInSquare(sx, sy, sw, sh, px, py)
{
    var result = false;

    if(px>=sx)
    {
        if(px<(sx+sw))
        {
            if(py>=sy)
            {
                if(py<(sy+sh))
                {
                    result = true;
                }
            }
        }
    }

    return result;
}


function IntPad(num, size)
{ 
    var s = "000000000" + num; 
    return s.substr(s.length-size); 
} 
