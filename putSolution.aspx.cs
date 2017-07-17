using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

/// <summary>
/// Saves a solution calculated by the client into the SQLite DB.
/// </summary>
public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {
        int instanceId = int.Parse(Request.QueryString["instanceId"]);
        string body = GetDocumentContents(Request);
        GAPSolution solution = GAPSolution.fromJson(body);
        solution.instanceId = instanceId;
        using (SQLiteContext ctx = new SQLiteContext())
        {
            ctx.GAPSolutions.Add(solution);
            ctx.SaveChanges();
        }
    }

    /// <summary>
    /// Get the body of the AJAX request.
    /// </summary>
    /// <param name="Request"></param>
    /// <returns></returns>
    private string GetDocumentContents(System.Web.HttpRequest Request)
    {
        string documentContents;
        using (Stream receiveStream = Request.InputStream)
        {
            using (StreamReader readStream = new StreamReader(receiveStream, Encoding.UTF8))
            {
                documentContents = readStream.ReadToEnd();
            }
        }
        return documentContents;
    }
}