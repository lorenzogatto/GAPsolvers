/**
 * A solution to the GAP problem. All methods except deepCopy and toString run in O(1).
 * This is obtained by caching the cost.
 */
class GAPSolution {
    constructor(gapInstance) {
        this._gapInstance = gapInstance;
        this._agent = new Array(gapInstance.getJobsNumber()).fill(0);
        this._usedResources = new Array(gapInstance.getAgentsNumber()).fill(0);
        this._base_cost = 0;
        for (let j = 0; j < gapInstance.getJobsNumber(); j++) {
            this._usedResources[0] += gapInstance.getResourcesConsumption(0, j);
            this._base_cost += gapInstance.getCost(0, j);
        }
        this._overwork = this._getOverwork(0);
    }
    getInstance() {
        return this._gapInstance;
    }

    getAgentPerformingJob(job) {
        return this._agent[job];
    }

    getAgentsPerformingJobs() {
        return this._agent;
    }

    getCost(penalty = 1000) {
        return this._base_cost + this._overwork * penalty;
    }

    setAgentPerformingJob(agent, job) {
        var old_agent = this._agent[job];

        this._base_cost -= this._gapInstance.getCost(old_agent, job);
        this._overwork -= this._getOverwork(agent);//take off overwork, before modifying _usedResources!
        this._overwork -= this._getOverwork(old_agent);
        this._usedResources[this._agent[job]] -= this._gapInstance.getResourcesConsumption(this._agent[job], job);
        
        this._agent[job] = agent;

        this._base_cost += this._gapInstance.getCost(agent, job);
        this._usedResources[agent] += this._gapInstance.getResourcesConsumption(agent, job);
        this._overwork += this._getOverwork(agent);
        this._overwork += this._getOverwork(old_agent);
    }

    _getOverwork(agent) {
        if (this.getFreeResources(agent) >= 0)
            return 0;
        else return -this.getFreeResources(agent);
    }

    getFreeResources(agent) {
        return this._gapInstance.getResourcesLimit(agent) - this._usedResources[agent];
    }

    isFeasible() {
        return this._overwork === 0;
    }

    //Cloning of the solution. It does not clone the instance because the instance is not mutated after load.
    deepCopy() {
        var gapInstanceBackup = this._gapInstance;
        this._gapInstance = null;
        var obj = Object.setPrototypeOf(JSON.parse(JSON.stringify(this)), GAPSolution.prototype);
        this._gapInstance = gapInstanceBackup;
        obj._gapInstance = gapInstanceBackup;
        return obj;
    }

    toString() {
        var agents = this.getAgentsPerformingJobs();
        var ret = "" + agents[0];
        for (let i = 1; i < agents.length; i++)
            ret += ", " + agents[i];
        return ret;
    }
}