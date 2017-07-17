importScripts("GAPInstance.js");
importScripts("GAPTabuSearchSolver.js");
importScripts("GAPSimulatedAnnealingSolver.js?v=1");
importScripts("GAPIteratedLocalSearchSolver.js?v=1");
importScripts("GAPVariableNeighborhoodSearchSolver.js?v=1");
importScripts("GAPSolution.js");
importScripts("Queue.js");

/**
 * Worker used to solve a GAP instance.
 * It takes two parameters through messages. The first one is the JSON representation of an instance, the second is
 * a text representing the metaheuristic to use.
 */
var jsonData = null;
var algorithm = null;
onmessage = (e) => {
    if (jsonData == null) {
        jsonData = e.data;
    }
    else if (algorithm == null) {
        algorithm = e.data;
        solve();
    }
}

function solve() {
    var data = JSON.parse(jsonData);
    var gapInstance = Object.assign(new GAPInstance, data);
    var solution = null;
    switch (algorithm) {
        case "SA":
            solution = GAPSimulatedAnnealingSolver.solve(gapInstance);
            break;
        case "TS":
            solution = GAPTabuSearchSolver.solve(gapInstance);
            break;
        case "ILS":
            solution = GAPIteratedLocalSearchSolver.solve(gapInstance);
            break;
        case "VNS":
            solution = GAPVariableNeighborhoodSearchSolver.solve(gapInstance);
            break;
    }
    postMessage(solution);
}
