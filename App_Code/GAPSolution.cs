using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.ComponentModel.DataAnnotations;

/// <summary>
/// A solution to the GAP problem. Solutions are calculated by the javascript solvers and stored in the DB.
/// </summary>
public class GAPSolution
{
    [Key]
    public int key { get; set; }
    public int instanceId { get; set; }
    public string algorithm { get; set; }
    public int cost { get; set; }
    private int[] agents { get; set; }

    [Required]
    public string agentsInDb //to store in DB
    {
        get { return JsonConvert.SerializeObject(agents); ; }
        set { agents = JsonConvert.DeserializeObject<int[]>(value); }
    }

    public GAPSolution() { }
    
    public static GAPSolution fromJson(String json)
    {
        JObject obj = JObject.Parse(json);
        GAPSolution ret = new GAPSolution();
        ret.algorithm = obj["algorithm"].ToObject<string>();
        ret.cost = obj["_base_cost"].ToObject<int>();
        ret.agents = obj["_agent"].ToObject<int[]>();
        return ret;
    }
}