/**
 * Simulated annealing solver.
 * PSEUDO-CODE:
s* = random initial solution
s' = s*
while(not termination condition)
    for N_ITER_UPDATE_TEMPERATURE iterations
        sPert = perturbation of s'
        if s'.cost < s*.cost
            s* = s'
        else
            s* = s' with probability e^(-s'.cost + s*.cost)/T
    T = alpha * T
 */
class GAPSimulatedAnnealingSolver {
    static solve(instance)
    {
        var T = GAPSimulatedAnnealingSolver.INITIAL_TEMPERATURE;
        var sStar = instance.findInitialSolution(instance);
        var sCurrent = sStar.deepCopy();
        for (let iter = 0; iter < GAPSimulatedAnnealingSolver.N_ITERATIONS; iter++) {
            let sPerturbated = GAPSimulatedAnnealingSolver.perturbate(sCurrent);
            sCurrent = GAPSimulatedAnnealingSolver.acceptanceCriterion(sCurrent, sPerturbated, T);
            if (sCurrent.getCost() < sStar.getCost()) {
                sStar = sCurrent;
            }

            if ((iter + 1) % GAPSimulatedAnnealingSolver.N_ITER_UPDATE_TEMPERATURE == 0)
                T *= GAPSimulatedAnnealingSolver.alpha;
        }
        return sStar;
    }

    //create a new perturbed instance of the solution
    static perturbate(sCurrent) {
        var sPerturbated = sCurrent.deepCopy();
        var instance = sCurrent.getInstance();
        //creo altra soluzione perturbando. Cambio agente che svolge un job
        let agentsToChange = Math.floor(Math.random() * instance.getJobsNumber());
        for (let i = 0; i < agentsToChange; i++) {
            let job = Math.floor(Math.random() * instance.getJobsNumber());
            let agent = Math.floor(Math.random() * instance.getAgentsNumber());
            sPerturbated.setAgentPerformingJob(agent, job);
        }
        return sPerturbated;
    }

    static acceptanceCriterion(sCurrent, sPerturbated, T) {
        if (sPerturbated.getCost() < sCurrent.getCost())
            return sPerturbated;
        else {
            let p = Math.exp((-sPerturbated.getCost() + sCurrent.getCost()) / T);
            if (Math.random() < p)
                return sPerturbated;
            else return sCurrent;
        }
    }
}
GAPSimulatedAnnealingSolver.N_ITERATIONS = 100000;
GAPSimulatedAnnealingSolver.N_ITER_UPDATE_TEMPERATURE = 1000; //how often to update temperature
GAPSimulatedAnnealingSolver.alpha = 0.9; //temperature *= alpha;
GAPSimulatedAnnealingSolver.INITIAL_TEMPERATURE = 1000;