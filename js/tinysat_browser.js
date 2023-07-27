"use strict";

var inputElement = ace.edit("input");
inputElement.setTheme("ace/theme/textmate");
inputElement.$blockScrolling = Infinity;
inputElement.setOptions({
  useSoftTabs: true,
  tabSize: 2,
  maxLines: Infinity,
  autoScrollEditorIntoView: true
});

var output = "Ready..";
var outputElement = document.getElementById('output');
updateOutput();

var log = "Ready..";
var logElement = document.getElementById('log');
updateLog();

var solve = async function () {

  interface_start();

  var input = inputElement.getValue();
  var solver = initSolver();

  clearOutput();
  updateOutput();
  clearLog();
  updateLog();

  var prop_budget = 100000;
  var conf_budget = 100000;
  var time_budget = 100000;

  var use_1uip = true;
  var use_2wl = true;

  var logger;
  logger = addToLog;

  solver.parse(input);
  var result = await solver.solve(logger, prop_budget, conf_budget, time_budget, use_2wl, use_1uip);

  if (result.status == SAT) {
    interface_result("SAT");
    var vline = "v"
    for (var i = 1; i < result.model.length; ++i) {
      if (result.model[i] == TRUE) {
        vline += " "+i;
      } else if (result.model[i] == FALSE) {
        vline += " -"+i;
      }
    }
    vline += "\n";
    addToOutput("s SATISFIABLE\n");
    addToOutput(vline);
  } else if (result.status == UNSAT) {
    interface_result("UNSAT");
    addToOutput("s UNSATISFIABLE\n");
  } else {
    interface_result("ABORT");
    addToOutput("s UNKNOWN\n");
  }

  interface_finish();
}

function clearOutput() {
  output = "";
}

function addToOutput(text) {
  output += text;
  updateOutput();
}

function updateOutput() {
  if (outputElement) {
    var output_to_show = " ";
    if (output != "") {
      output_to_show = output;
    }
    outputElement.textContent = output_to_show;
    outputElement.scrollTop = outputElement.scrollHeight; // focus on bottom
  }
}

function clearLog() {
  log = "";
  updateLog();
}

function addToLog(text) {
  log = text + "\n" + log;
  updateLog();
}

function updateLog() {
  var log_to_show = " ";
  if (log != "") {
    log_to_show = log;
  }
  if (logElement) {
    logElement.textContent = log_to_show;
    // logElement.scrollTop = logElement.scrollHeight; // focus on bottom
  }
}
