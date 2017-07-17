document.write('<script src="js/Controller.js?v=6" type="text/javascript"></script>'); //import controller, from https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file
/**
 * The view.
 * This code initializes the selects and receives event, that are than trasmitted to the controller.
 */
var view;
window.onload = ev => {
    view = new View();
};

class View {
    constructor() {
        this.controller = new Controller(this);
        this.astrateSelect = document.getElementById("astrateSelect");
        this.sqliteSelect = document.getElementById("sqliteSelect");
        this.loadSolveButton = document.getElementById("loadsolve");
        this.stopButton = document.getElementById("stop");
        this.saveButton = document.getElementById("save");
        this.logs = document.getElementById("log");
        this.setInitialState();
        this.setListeners();
        this.log("Ready!");
    }

    setInitialState() {
        this.populateSelects();
        this.setStopButtonClickable(false);
        this.setSaveButtonClickable(false);
    }

    setListeners() {
        this.loadSolveButton.onclick = ev => {
            this.onLoadAndSolveClick();
        };
        this.stopButton.onclick = ev => {
            this.controller.stopComputation();
        };
        this.saveButton.onclick = ev => {
            if (this.controller.instanceSource === "astarte") {
                //using https://github.com/eligrey/FileSaver.js
                var fileName = this.controller.instanceSource + "_" + this.controller.instance.slice(0, -4) + this.controller.algorithm + ".txt";
                var textInFile = "Solution with cost: " + this.controller.solution.getCost() + "\r\n";
                textInFile += this.controller.solution;
                var blob = new Blob([textInFile], { type: "text/plain;charset=utf-8" });
                saveAs(blob, fileName);
            } else {
                this.controller.remoteSave();
            }
        };
    }

    onLoadAndSolveClick(ev) {
        //figure out the source of the instance
        var dataSources = document.getElementsByName("source");
        var selectedSource;

        for (let i = 0; i < dataSources.length; i++) {
            if (dataSources[i].checked)
                selectedSource = dataSources[i].value;
        }
        var instance;
        switch (selectedSource) {
            case "astarte":
                instance = this.astrateSelect.value;
                break;
            case "sqlite":
                instance = this.sqliteSelect.value;
                break;
        }
        var algorithms = document.getElementsByName("algorithm");
        var algorithm;

        for (let i = 0; i < algorithms.length; i++) {
            if (algorithms[i].checked)
                algorithm = algorithms[i].value;
        }
        this.controller.loadAndSolve(selectedSource, instance, algorithm);
    }

    //populates the selects near the "Instance:" text
    populateSelects() {
        for (let i = 1; i <= 12; i++)
            for (let k = 0; k <= 4; k++) {
                let url = "assets/instances/gap" + i + "_" + k + ".json";
                astrateSelect.innerHTML += "<option value='" + url + "'>OR Library GAP " + i + "_" + k + "</option>";
            }
        for (let i = 0; i < 4; i++)
            for (let k = 0; k <= 5; k++) {
                let letter = String.fromCharCode(97 + i);
                let filename = "gap" + letter + "_" + k + ".json";
                let url = "assets/instances/" + filename;
                astrateSelect.innerHTML += "<option value='" + url + "'>Yagiura GAP " + letter + k + "</option>";
            }
        astrateSelect.innerHTML += "<option value='assets/instances/e05100.json'>Yagiura GAP e05100</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e05200.json'>Yagiura GAP e05200</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e10100.json'>Yagiura GAP e10100</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e10200.json'>Yagiura GAP e10200</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e10400.json'>Yagiura GAP e10400</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e15900.json'>Yagiura GAP e15900</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e20100.json'>Yagiura GAP e20100</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e20200.json'>Yagiura GAP e20200</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e20400.json'>Yagiura GAP e20400</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e201600.json'>Yagiura GAP e201600</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e30900.json'>Yagiura GAP e30900</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e40400.json'>Yagiura GAP e40400</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e60900.json'>Yagiura GAP e60900</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e401600.json'>Yagiura GAP e401600</option>";
        astrateSelect.innerHTML += "<option value='assets/instances/e801600.json'>Yagiura GAP e801600</option>";
        var url = "getInstanceIds.aspx";
        var xhttp = new XMLHttpRequest();
        var self = this;
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                let ids = JSON.parse(this.responseText);
                for (let k = 0; k < ids.length; k++) {
                    sqliteSelect.innerHTML += "<option value='" + ids[k] + "'>GAP SQLite " + ids[k] + "</option>";
                    document.getElementById("sqliteradio").disabled = false;
                }
            }
            else if (this.readyState === 4) {
                self.log("Error retrieving SQLite instances list");
            }
        };
        xhttp.open("GET", url, true);
        xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
        xhttp.send();
        
    }

    checkSource(source) {
        switch (source.value) {
            case "astarte":
                astrateSelect.style.display = "block";
                sqliteSelect.style.display = "none";
                break;
            case "sqlite":
                astrateSelect.style.display = "none";
                sqliteSelect.style.display = "block";
                break;
        }
    }
    log(text, newline = true) {
        this.logs.innerHTML += text;
        if (newline)
            this.logs.innerHTML += "\n";
    }
    setSolveButtonClickable(clickable) {
        this.loadSolveButton.style.display = "none";
        if (clickable) {
            this.loadSolveButton.style.display = "inline-block";
        }
    }

    setStopButtonClickable(clickable) {
        this.stopButton.style.display = "none";
        if (clickable) {
            this.stopButton.style.display = "inline-block";
        }
    }

    setSaveButtonClickable(clickable) {
        this.saveButton.disabled = !clickable;
    }
}