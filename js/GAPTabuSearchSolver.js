/**
 * Tabu search solver.
PSEUDO CODE:
TL = insieme vuoto
s* = random initial solution
s' = s*
while not(termination condition)
    sb = null
    for a predetermined number of iterations
        take a neighbor of s'
        if s' in TL, continue
        sb = s' if sb = null or sb.cost > s'.cost
    add sb into TL
    limit TL size to a predetermined threashold taking off an old solution (if necessary)
    s' = sb
    if s*.cost > s'.cost
        s* = s'
 */
class GAPTabuSearchSolver {
    static solve(instance) {
        var tabuList = new TabuList(2.375 * instance.getJobsNumber() * instance.getAgentsNumber());
        var sStar = instance.findInitialSolution(instance);
        var sCurrent = sStar;
        for (let iter = 0; iter < GAPTabuSearchSolver.N_ITERATIONS; iter++) {
            let bestNeighbor = null;
            //look at N_NEIGHBORS neighbors obtained by changing who performes two job
            for (let k = 0; k < GAPTabuSearchSolver.N_NEIGHBORS; k++) {
                let sNeighbor = GAPTabuSearchSolver.randomNeighbor(sCurrent);
                if (tabuList.contains(sNeighbor))
                    continue;
                if (bestNeighbor == null || sNeighbor.getCost() < bestNeighbor.getCost())
                    bestNeighbor = sNeighbor;
            }
            if (bestNeighbor == null)
                continue;
            sCurrent = bestNeighbor;
            tabuList.insert(sCurrent);
            if (sCurrent.getCost() < sStar.getCost())
                sStar = sCurrent;
        }

        return sStar;
    }
    static randomNeighbor(sCurrent) {
        var sNeighbor = sCurrent.deepCopy();
        var instance = sCurrent.getInstance();
        var j1 = Math.floor(Math.random() * instance.getJobsNumber());
        var a1 = Math.floor(Math.random() * instance.getAgentsNumber());
        var j2 = Math.floor(Math.random() * instance.getJobsNumber());
        var a2 = Math.floor(Math.random() * instance.getAgentsNumber());
        sNeighbor.setAgentPerformingJob(a1, j1);
        sNeighbor.setAgentPerformingJob(a2, j2);
        return sNeighbor;
    }
}

GAPTabuSearchSolver.N_ITERATIONS = 4000;
GAPTabuSearchSolver.N_NEIGHBORS = 50;
/* Efficient tabu list implementation.
 * */
class TabuList {

    constructor(size) {
        this.size = size;
        this.tabuHashSet = {};
        this.tabuQueue = new Queue();
    }

    contains(sNeighbor) {
        var sNeighborString = JSON.stringify(sNeighbor.getAgentsPerformingJobs());
        return sNeighborString in this.tabuHashSet;
    }

    insert(sCurrent) {
        if (this.contains(sCurrent))
            return;
        var sCurrentString = JSON.stringify(sCurrent.getAgentsPerformingJobs());
        this.tabuHashSet[sCurrentString] = true;
        this.tabuQueue.enqueue(sCurrentString);
        if (this.tabuQueue.getLength() > this.size) {
            let first = this.tabuQueue.dequeue();
            delete this.tabuHashSet[first];
        }
    }
}
