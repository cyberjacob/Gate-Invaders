function ServerManager()
{
    // ---------------------------------------------------------------------
    // Initialise - Initial server manager
    // ---------------------------------------------------------------------
    this.Initialise = function()
    {        
    }

    this.Test = function()
    {
        $.get('../Utility.ashx',function(data)
        {
            alert(data);
        });
    }
}
