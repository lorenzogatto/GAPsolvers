using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// Class that generates an instance using a factory method
/// </summary>
public class InstanceBuilder
{
    private static readonly int MAX_COST = 100;
    private static readonly int MIN_COST = 1;
    private static readonly int MIN_RESOURCES = 1;
    private static readonly int MAX_RESOURCES = 100;
    private static readonly int MIN_RESOURCES_LIMIT = 10;
    private static readonly int MAX_RESOURCES_LIMIT = 150;
    private static Random rnd = new Random();

    ///The instance is not guaranteed to be feasible because the proof requires solving a NP-hard problem.
    static public GAPInstance createNewInstance(int agents, int jobs)
    {
        GAPInstance instance = new GAPInstance(agents, jobs);
        //set costs, resources, resourceLimit
        for (int a = 0; a < agents; a++)
            for (int j = 0; j < jobs; j++)
            {
                int cost = rnd.Next(MIN_COST, MAX_COST);
                int resources = rnd.Next(MIN_RESOURCES, MAX_RESOURCES);
                instance.setCost(a, j, cost);
                instance.setResourcesConsumption(a, j, resources);
            }
        for (int a = 0; a < agents; a++)
        {
            int agentResources = rnd.Next(MIN_RESOURCES_LIMIT, MAX_RESOURCES_LIMIT);
            instance.setResourcesLimit(a, agentResources);
        }
        return instance;
    }
}