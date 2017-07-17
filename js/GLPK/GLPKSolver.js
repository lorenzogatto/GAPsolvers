/**
 * Non-blocking class to solve GAP instances using the open-source GLPK library.
 * Usage: call solve passing the istance text (JSON) and a callback.
 * The callback will receive the cost of the minimal cost solution.
 * The method stop can be used to stop the computation.
 */
class GLPKSolver {
    static _generateProblemDescription(gapInstance) {
        var model = "Minimize\n";
        var n_agents = gapInstance.getAgentsNumber();
        var n_jobs = gapInstance.getJobsNumber();
        model += "obj: ";
        for (let agent = 0; agent < n_agents; agent++)
            for (let job = 0; job < n_jobs; job++) {
                let cost = gapInstance.getCost(agent, job);
                model += "+ " + cost + "x" + (agent * n_jobs + job);
            }
        model += "\nSubject To\ncap: ";
        for (let job = 0; job < n_jobs; job++) {
            for (let agent = 0; agent < n_agents; agent++){
                model += "+ x" + (agent * n_jobs + job);
            }
            model += " = 1\n";
        }

        for (let agent = 0; agent < n_agents; agent++) {
            for (let job = 0; job < n_jobs; job++) {
                let res = gapInstance.getResourcesConsumption(agent, job);
                model += "+ " + res + " x" + (agent * n_jobs + job);
            }
            model += " <= " + gapInstance.getResourcesLimit(agent) + "\n";
        }
        model += "Bounds\n";
        for (let agent = 0; agent < n_agents; agent++) {
            for (let job = 0; job < n_jobs; job++) {
                model += "0 <= x" + (agent * n_jobs + job) + " <= 1\n";
            }
        }
        model += "Generals\n";
        for (let agent = 0; agent < n_agents; agent++) {
            for (let job = 0; job < n_jobs; job++) {
                model += "x" + (agent * n_jobs + job) +"\n";
            }
        }
        model += "End\n";
        
        return model;
    }

    static solve(text, onDone) {
        var gapInstance = JSON.parse(text);
        Object.setPrototypeOf(gapInstance, GAPInstance.prototype);
        var bestCost = Infinity;
        
        GLPKSolver.job = new Worker("js/GLPK/GLPKSolverWorker.js");
        GLPKSolver.job.onmessage = function (e) {
            var obj = e.data;
            switch (obj.action) {
                case 'log':
                    //console.log(obj.message);
                    //bestCost = Math.min(bestCost, obj.message);
                    //onMessage(obj.message);
                    //log(obj.message);
                    break;
                case 'done':
                    console.log(obj.result);
                    onDone(GLPKSolver._getCost(gapInstance, obj.result));
                    stop();
                    //log(JSON.stringify(obj.result));
                    break;
            }
        };
        GLPKSolver.job.postMessage({
            action: 'load',
            data: GLPKSolver._generateProblemDescription(gapInstance),
            mip: false
        });
    }

    static stop() {
        if (GLPKSolver.job !== null)
            GLPKSolver.job.terminate();
        GLPKSolver.job = null;
    }

    static _getCost(gapInstance, solution) {
        var ret = 0;
        var n_agents = gapInstance.getAgentsNumber();
        var n_jobs = gapInstance.getJobsNumber();
        for (let agent = 0; agent < n_agents; agent++)
            for (let job = 0; job < n_jobs; job++) {
                let cost = gapInstance.getCost(agent, job);
                let variable = "x" + (agent * n_jobs + job);
                ret += solution[variable] * cost;
            }
        return ret;
    }
}
GLPKSolver.job = null;