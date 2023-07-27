// This file is released under the MIT license.
// See LICENSE.md.

function interface_wait_time_propagate() {
  speed_factor = document.getElementById("speed").value;
  return speed_factor*500;
}

function interface_wait_time_decide() {
  speed_factor = document.getElementById("speed").value;
  return speed_factor*1000;
}

function interface_wait_time_learn() {
  speed_factor = document.getElementById("speed").value;
  return speed_factor*1000;
}

function interface_wait_time_backjump() {
  speed_factor = document.getElementById("speed").value;
  return speed_factor*1000;
}

function interface_wait_time_conflict() {
  speed_factor = document.getElementById("speed").value;
  return speed_factor*500;
}

var cur_level = 0;
var assignment = [];
var last_learned = [];

function interface_start() {
  should_abort = false;
  document.getElementById("btn_solve").disabled = true;
  document.getElementById("btn_pause").disabled = false;
  document.getElementById("btn_resume").disabled = true;
  document.getElementById("btn_abort").disabled = false;

  cur_level = 0;
  cur_assignment = [];
  last_learned = [];
  showState();
}

function interface_propagate(lit) {
  addToLog("PROPAGATING: " + lit);
  cur_assignment.push({
    level: cur_level,
    lit: lit,
    type: "prop",
  });
  showState();
}

function interface_conflict(clause) {
  addToLog("CONFLICT: [" + clause + "]");
}

function interface_learned_clause(clause) {
  addToLog("LEARNED CLAUSE: [" + clause + "]");
  last_learned = clause;
}

function interface_backjump(level) {
  addToLog("BACKJUMPING TO LEVEL: " + level);
  cur_level = level;
  cur_assignment = cur_assignment.filter(obj =>
    obj.level <= level
  );
  addToLog(cur_assignment);
  showState();
}

function interface_decide(lit) {
  addToLog("DECIDING: " + lit);
  cur_level += 1;
  cur_assignment.push({
    level: cur_level,
    lit: lit,
    type: "decide",
  });
  showState();
}

function interface_result(result) {
  if (result == "SAT") {
    addToLog("SATISFIABLE");
  } else if (result == "UNSAT") {
    addToLog("UNSATISFIABLE");
  } else if (result == "ABORT") {
    addToLog("ABORTED");
  }
}

function interface_finish() {
  document.getElementById("btn_solve").disabled = false;
  document.getElementById("btn_pause").disabled = true;
  document.getElementById("btn_resume").disabled = true;
  document.getElementById("btn_abort").disabled = true;
}

var can_continue = true;
var should_abort = false;

function do_pause() {
  can_continue = false;
  document.getElementById("btn_pause").disabled = true;
  document.getElementById("btn_resume").disabled = false;
}

function do_resume() {
  can_continue = true;
  document.getElementById("btn_pause").disabled = false;
  document.getElementById("btn_resume").disabled = true;
}

function do_abort() {
  should_abort = true;
  do_resume();
  document.getElementById("btn_pause").disabled = true;
  document.getElementById("btn_resume").disabled = true;
  document.getElementById("btn_abort").disabled = true;
}

function showState() {
  clearState();

  addToState("Current assignment: " + cur_assignment.map(obj =>
    obj.lit + "@" + obj.level
  ));
  addToState("Decisions: " + cur_assignment.filter(obj =>
    obj.type == "decide"
  ).map(obj =>
    obj.lit + "@" + obj.level
  ));
  if (last_learned.length > 0) {
    addToState("Last learned clause: [" + last_learned + "]");
  }
}
