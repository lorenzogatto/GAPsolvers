/**
 * An instance of the GAP problem. Each instance has a certain number of agents, jobs, 
 * a cost and consumed resources for each pair, and a resource limit for each agent.
 */
class GAPInstance {
    constructor(name, numcustomers, numfacilities, cost, req, cap) {
        this.name = name;
        this.numcustomers = numcustomers;
        this.numfacilities = numfacilities;
        this.cost = cost;
        this.req = req;
        this.cap = cap;
    }

    getAgentsNumber() {
        return this.numfacilities;
    }

    getJobsNumber() {
        return this.numcustomers;
    }

    getCost(agent, job) {
        return this.cost[agent][job];
    }

    getResourcesConsumption(agent, job) {
        return this.req[agent][job];
    }

    getResourcesLimit(agent) {
        return this.cap[agent];
    }

    //make each job be performed by the cheapest agent that has enough free resources
    findInitialSolution() {
        var s0 = new GAPSolution(this);
        var s0cost = s0.getCost();
        for (let job = 0; job < this.getJobsNumber(); job++) {
            let bestCost = Infinity;
            for (let agent = 0; agent < this.getAgentsNumber(); agent++) {
                if (this.getCost(agent, job) < bestCost && s0.getFreeResources(agent) > this.getResourcesConsumption(agent, job)) {
                    bestCost = this.getCost(agent, job);
                    s0.setAgentPerformingJob(agent, job);
                }
            }
        }
        return s0;
    }
}