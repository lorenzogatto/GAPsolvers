using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

/// <summary>
/// Get the list of instances ids present in the SQLite DB.
/// </summary>
public partial class getInstanceIds : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        List<int> ids = new List<int>();
        using (SQLiteContext ctx = new SQLiteContext())
        {
            var instanceDb = from a in ctx.GAPInstances
                             select a.instanceId;
            ids = instanceDb.ToList<int>();
        }

        string json = JsonConvert.SerializeObject(ids);
        Response.Clear();
        Response.ContentType = "application/json; charset=utf-8";
        Response.Write(json);
        Response.End();
    }
}