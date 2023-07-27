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

function interface_start() {
  should_abort = false;
  document.getElementById("btn_solve").disabled = true;
  document.getElementById("btn_pause").disabled = false;
  document.getElementById("btn_resume").disabled = true;
  document.getElementById("btn_abort").disabled = false;
}

function interface_propagate(lit) {
  addToLog("PROPAGATING: " + lit);
}

function interface_conflict(clause) {
  addToLog("CONFLICT: [" + clause + "]");
}

function interface_learned_clause(clause) {
  addToLog("LEARNED CLAUSE: [" + clause + "]");
}

function interface_backjump(level) {
  addToLog("BACKJUMPING TO LEVEL: " + level);
}

function interface_decide(lit) {
  addToLog("DECIDING: " + lit);
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

// ===
// - Split pure interface from aux functions
// - Add/implement abort button
// - Implement speed selector

// - Implement interface and pause at the right time
// - Pass assignment, etc, to interface functions
// - Add html element that displays assignment, etc.
// ===
