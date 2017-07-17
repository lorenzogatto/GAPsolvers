/**
 * Iterated local search solver.
 * PSEUDO-CODE:
s0 = random initial solution
s* = localSearch(s0)
while(not termination condition)
    sPert = perturbation of s*
    sPert = local search (sPert)
    s* = best(s*, sPert)
 */
class GAPIteratedLocalSearchSolver {
    static solve(instance) {
        var sStar = instance.findInitialSolution();
        sStar = GAPIteratedLocalSearchSolver.localSearch(sStar);
        for (let iter = 0; iter < GAPIteratedLocalSearchSolver.N_ITERATIONS; iter++) {
            let sPerturbated = GAPIteratedLocalSearchSolver.perturbate(sStar);
            sPerturbated = GAPIteratedLocalSearchSolver.localSearch(sPerturbated);
            if (sPerturbated.getCost() < sStar.getCost()) {
                sStar = sPerturbated;
            }
        }
        return sStar;
    }
    //4-OPT. Returns a perturbated solution leaving the original intact
    static perturbate(solution) {
        var newSol = solution.deepCopy();
        var instance = solution.getInstance();
        for (let i = 0; i < 4; i++) {
            let job = Math.floor(Math.random() * instance.getJobsNumber());
            let agent = Math.floor(Math.random() * instance.getAgentsNumber());
            newSol.setAgentPerformingJob(agent, job);
        }
        return newSol;
    }
    //2-OPT. Returns a new solution leaving the original intact
    static localSearch(solution) {
        var newSol = solution.deepCopy();
        var instance = solution.getInstance();
        var sNeighbor = solution.deepCopy();
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
}
GAPIteratedLocalSearchSolver.N_ITERATIONS = 500;