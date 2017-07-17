using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.ComponentModel.DataAnnotations;

/// <summary>
/// An instance of the GAP problem. Each instance has a certain number of agents, jobs, a cost and consumed resources for each pair,
/// and a resource limit for each agent.
/// </summary>
public class GAPInstance
{
    [Key]
    public int instanceId { get; set; }
    public int agentsNumber { get; set; }
    public int jobsNumber { get; set; }
    private int[,] costs { get; set; }
    private int[,] resources { get; set; }
    private int[] resourcesLimit { get; set; }

    [Required]
    public string costsInDb //to store in DB
    {
        get { return JsonConvert.SerializeObject(costs); ; }
        set { costs = JsonConvert.DeserializeObject<int[,]>(value); }
    }
    [Required]
    public string resourcesInDb //to store in DB
    {
        get { return JsonConvert.SerializeObject(resources); ; }
        set { resources = JsonConvert.DeserializeObject<int[,]>(value); }
    }
    [Required]
    public string resourcesLimitInDb //to store in DB
    {
        get { return JsonConvert.SerializeObject(resourcesLimit); ; }
        set { resourcesLimit = JsonConvert.DeserializeObject<int[]>(value); }
    }

    public GAPInstance() { }
    public GAPInstance(int nAgents, int nJobs)
    {
        this.agentsNumber = nAgents;
        this.jobsNumber = nJobs;
        this.costs = new int[nAgents, nJobs];
        this.resources = new int[nAgents, nJobs];
        this.resourcesLimit = new int[nAgents];
    }
    /// <summary>
    /// Set the cost to match an agent to a job
    /// </summary>
    /// <param name="agent"></param>
    /// <param name="job"></param>
    /// <param name="cost"></param>
    public void setCost(int agent, int job, int cost)
    {
        this.costs[agent, job] = cost;
    }
    /// <summary>
    /// The the resources used by the agent to fulfill that job.
    /// </summary>
    /// <param name="agent"></param>
    /// <param name="job"></param>
    /// <param name="resources"></param>
    public void setResourcesConsumption(int agent, int job, int resources)
    {
        this.resources[agent, job] = resources;
    }
    /// <summary>
    /// Set the amount of resources the agent has.
    /// </summary>
    /// <param name="agent"></param>
    /// <param name="resources"></param>
    public void setResourcesLimit(int agent, int resources)
    {
        this.resourcesLimit[agent] = resources;
    }
    /// <summary>
    /// Transorm the instance to a Json string.
    /// </summary>
    /// <returns></returns>
    public String toJson()
    {
        JObject obj = new JObject();
        obj["name"] = "gap" + instanceId;
        obj["numcustomers"] = jobsNumber;
        obj["numfacilities"] = agentsNumber;
        JArray costs = new JArray();
        for(int i=0;i<agentsNumber;i++)
        {
            JArray subArray = new JArray();
            for(int k=0;k<jobsNumber;k++)
                subArray.Add(this.costs[i, k]);
            costs.Add(subArray);
        }
            
        obj["cost"] = costs;
        JArray resources = new JArray();
        for (int i = 0; i < agentsNumber; i++)
        {
            JArray subArray = new JArray();
            for (int k = 0; k < jobsNumber; k++)
                subArray.Add(this.resources[i, k]);
            resources.Add(subArray);
        }
        obj["req"] = resources;
        JArray resourcesLimit = new JArray();
        foreach (int x in this.resourcesLimit)
            resourcesLimit.Add(x);
        obj["cap"] = resourcesLimit;

        return obj.ToString();
    }
}