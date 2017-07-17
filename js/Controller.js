document.write('<script src="js/GAPSolution.js?v=1" type="text/javascript"></script>');
document.write('<script src="js/GAPInstance.js?v=1" type="text/javascript"></script>');
document.write('<script src="js/GLPK/GLPKSolver.js?v=1" type="text/javascript"></script>');

/**
 * The controller of the program. It is able to calculate the solutions of the instances selected in the GUI.
 */
class Controller {
    constructor(view) {
        this.view = view;
        this.computing = false; //to avoid computing two instances at the same time
        this.webWorker = null;
    }
    //load an instance and calculate result. Result is shown in the log section of the GUI.
    loadAndSolve(instanceSource, instance, algorithm, algoParams) {
        if (this.computing === true) {
            this.view.log("Error! Already computing!");
            return;
        }
        this._updateViewButtons(this.view, true, false);
        this.instanceSource = instanceSource;
        this.instance = instance;
        this.algorithm = algorithm;
        this.computing = true;
        this.loadInstance(instanceSource, instance, (text) => {
            if (this.computing === false) return; //stop if the user pressed stop before instance was load
            this.view.log("Data loaded");
            if (algorithm !== "SIMPLEX")
                this._createWorker(text);
            else this._solveWithSimplex(text);
            
        }, error => {
            this.view.log(error);
            this.computing = false;
            this._updateViewButtons(self.view, false, false);
        });
    }
    _solveWithSimplex(text) {
        var self = this;
        this.view.log("Executing algorithm...");
        GLPKSolver.solve(text, result => {
            if (result === Infinity)
                this.view.log("No feasible solution found");
            else
                this.view.log("Best LP solution has cost " + result.toFixed(3));
            this._updateViewButtons(self.view, false, false);
            this.computing = false;
        });
    }
    //create a worker to solve an instance using one metaheuristic
    _createWorker(text) {
        if (typeof Worker === "undefined") {
            this.view.log("Sorry, your browser does not support workers.");
            return;
        }
        var self = this;
        this.view.log("Executing algorithm...");
        this.webWorker = new Worker("js/GAPSolverWorker.js?v=2");
        this.webWorker.postMessage(text);
        this.webWorker.postMessage(this.algorithm);
        this.webWorker.onmessage = function (event) {
            self.solution = event.data;
            Object.setPrototypeOf(self.solution, GAPSolution.prototype);
            Object.setPrototypeOf(self.solution.getInstance(), GAPInstance.prototype);
            self.computing = false;
            if (self.solution.isFeasible()) {
                self.view.log("Done: solution has cost " + self.solution.getCost());
                self.view.log(self.solution);
                self._updateViewButtons(self.view, false, true);
            } else {
                self.view.log("Sorry, could not find a feasible solution!");
                self._updateViewButtons(self.view, false, false);
            }
            
        };
    }

    _updateViewButtons(view, isCalculating, isResultReady) {
        view.setSolveButtonClickable(!isCalculating);
        view.setStopButtonClickable(isCalculating);
        view.setSaveButtonClickable(isResultReady);
    }
    //blocks the computation.
    stopComputation() {
        if (this.algorithm == "SIMPLEX") {
            GLPKSolver.stop();
        } else {
            if (this.webWorker !== null)
                this.webWorker.terminate();
            this.webWorker = null;
        }
        this.view.log("Stopped algorithm execution");
        this.computing = false;
        this._updateViewButtons(this.view, false, false);
    }

    //loads instance from web and calls callback on the received text
    loadInstance(selectedSource, instance, onsuccess, onerror) {
        var url;
        switch (selectedSource) {
            case "astarte":
                url = instance;
                break;
            case "sqlite":
                url = "getInstance.aspx?instanceId=" + instance;
                break;
        }
        this._directInstanceDownload(url, onsuccess, onerror);
    }

    _directInstanceDownload(url, onsuccess, onerror) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                onsuccess(this.responseText);
            }
            else if (this.readyState === 4) {
                onerror("Error downloading data! Returned status " + this.status);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    }
    //saves the result of a SQLite instance back into the DB, using AJAX
    remoteSave() {
        this.solution.cost = this.solution.getCost();
        this.solution.algorithm = this.algorithm;
        var url = "putSolution.aspx?instanceId=" + this.instance;
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                self.view.log("Data saved remotely");
            }
            else if (this.readyState === 4) {
                self.view.log("Error saving data remotely: error " + this.status);
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send(JSON.stringify(this.solution));
    }
}