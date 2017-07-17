/* Variable neighborhood search solver.
Starting from a random solution, improvements are searched in it's neighborhood.
One an improvement is found, start all over from the current best solution, looking again for improvements.
Neighborhood sets:
1-CHANGE: change the agent that performs a job. If the solution improves, pick the new one.
2-OPT: swap the agents for each job pairs.
2-CHANGE: change the agents that perform two jobs.
3-OPT: swap the agents for each job triple.
*/
class GAPVariableNeighborhoodSearchSolver {
    static solve(instance) {
        var sStar = instance.findInitialSolution(instance);
        var maxK = 3;
        if (instance.getJobsNumber() > 200) {
            maxK = 2;//do not perform 3-OPT as it would be too slow
        }
        for (let k = 0; k <= maxK; k++) {
            let sOpt = null;
            if (k === 0) {
                sOpt = GAPVariableNeighborhoodSearchSolver.oneChangeOpt(sStar);
            } else if (k === 1) {
                sOpt = GAPVariableNeighborhoodSearchSolver.twoOpt(sStar);
            } else if (k === 2) {
                sOpt = GAPVariableNeighborhoodSearchSolver.twoChangeOpt(sStar);
            } else {
                sOpt = GAPVariableNeighborhoodSearchSolver.threeOpt(sStar);
            }
            if (sOpt.getCost() < sStar.getCost()) {
                sStar = sOpt;
                k = -1;

            }
        }
        return sStar;
    }

    //1-CHANGE. Returns a new solution leaving the original intact
    static oneChangeOpt(solution) {
        var newSol = solution.deepCopy();
        var instance = solution.getInstance();
        for (let j1 = 0; j1 < instance.getJobsNumber(); j1++)
            for (let a1 = 0; a1 < instance.getAgentsNumber(); a1++) {
                let sNeighbor = newSol.deepCopy();
                sNeighbor.setAgentPerformingJob(a1, j1);
                if (sNeighbor.getCost() < newSol.getCost())
                    newSol = sNeighbor;
            }
        return newSol;
    }

    //2-OPT. Returns a new solution leaving the original intact
    static twoOpt(solution) {
        var newSol = solution.deepCopy();
        var instance = solution.getInstance();
        let sNeighbor = solution.deepCopy();
        for (let j1 = 0; j1 < instance.getJobsNumber(); j1++)
            for (let j2 = 0; j2 < instance.getJobsNumber(); j2++) {
                let a1 = sNeighbor.getAgentPerformingJob(j1);
                let a2 = sNeighbor.getAgentPerformingJob(j2);
                sNeighbor.setAgentPerformingJob(a2, j1);
                sNeighbor.setAgentPerformingJob(a1, j2);
                if (sNeighbor.getCost() < newSol.getCost()) {
                    newSol = sNeighbor.deepCopy();
                }
                else {
                    sNeighbor.setAgentPerformingJob(a1, j1);
                    sNeighbor.setAgentPerformingJob(a2, j2);
                }
            }
        return newSol;
    }

    //2-CHANGE. Returns a new solution leaving the original intact
    static twoChangeOpt(solution) {
        var newSol = solution.deepCopy();
        var sNeighbor = solution.deepCopy();
        var instance = solution.getInstance();

        for (let j1 = 0; j1 < instance.getJobsNumber(); j1++) {
            for (let j2 = 0; j2 < instance.getJobsNumber(); j2++) {
                let old_a1 = solution.getAgentPerformingJob(j1);
                let old_a2 = solution.getAgentPerformingJob(j2);
                for (let a1 = 0; a1 < instance.getAgentsNumber(); a1++) {
                    for (let a2 = 0; a2 < instance.getAgentsNumber(); a2++) {
                        sNeighbor.setAgentPerformingJob(a1, j1);
                        sNeighbor.setAgentPerformingJob(a2, j2);
                        if (sNeighbor.getCost() < newSol.getCost())
                            newSol = sNeighbor.deepCopy();
                    }
                }
                sNeighbor.setAgentPerformingJob(old_a1, j1);
                sNeighbor.setAgentPerformingJob(old_a2, j2);
            }
        }
        return newSol;
    }


    //3-OPT. Returns a new solution leaving the original intact
    static threeOpt(solution) {
        var newSol = solution.deepCopy();
        var instance = solution.getInstance();
        let sNeighbor = solution.deepCopy();
        for (let j1 = 0; j1 < instance.getJobsNumber(); j1++) {
            for (let j2 = 0; j2 < instance.getJobsNumber(); j2++) {
                for (let j3 = 0; j3 < instance.getJobsNumber(); j3++) {
                    let a1 = sNeighbor.getAgentPerformingJob(j1);
                    let a2 = sNeighbor.getAgentPerformingJob(j2);
                    let a3 = sNeighbor.getAgentPerformingJob(j3);
                    sNeighbor.setAgentPerformingJob(a2, j1);
                    sNeighbor.setAgentPerformingJob(a3, j2);
                    sNeighbor.setAgentPerformingJob(a1, j3);
                    if (sNeighbor.getCost() < newSol.getCost()) {
                        newSol = sNeighbor.deepCopy();
                    } else {
                        sNeighbor.setAgentPerformingJob(a1, j1);
                        sNeighbor.setAgentPerformingJob(a2, j2);
                        sNeighbor.setAgentPerformingJob(a3, j3);
                    }
                }
            }
        }
        return newSol;
    }
}