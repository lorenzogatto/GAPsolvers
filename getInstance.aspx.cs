using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// Get an instance from the SQLite DB.
/// The instance is saved to a file that is than loaded by Javascript using AJAX.
/// </summary>
public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        //Add5Instances.Main();
        int instanceId = int.Parse(Request.QueryString["instanceId"]);
        GAPInstance instance = null;
        using (SQLiteContext ctx = new SQLiteContext())
        {
            var instanceDb = from a in ctx.GAPInstances
                            where a.instanceId == instanceId
                            select a;
            instance = instanceDb.First();
        }

        string json = instance.toJson();
        // Send file position to the client
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json);
        Response.End();
    }
}