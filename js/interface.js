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

  var nodes = new vis.DataSet([]);
  var edges = new vis.DataSet([]);
  var container = document.getElementById("conflict-graph");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {};
  var network = new vis.Network(container, data, options);
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
  showState();
}

function interface_analyze(conflict_graph) {
  console.log(conflict_graph);

  // See examples here: https://visjs.github.io/vis-network/examples/
  var node_data = [];
  var edge_data = [];
  for (node in conflict_graph) {
    node_obj = {
      id: node,
    };
    // Set node label
    if (node == 'bot') {
      node_obj['label'] = '⊥';
      node_obj['fixed'] = true;
    } else {
      node_obj['label'] = node + "@" + conflict_graph[node]['level'];
    }
    // Set node color
    if (conflict_graph[node]['reason'].length == 0 && conflict_graph[node]['level'] > 0) {
      node_obj['color'] = '#efe';
    } else if (conflict_graph[node]['side'] == 'left') {
      node_obj['color'] = '#eef';
    } else {
      node_obj['color'] = '#fee';
    }
    node_data.push(node_obj);
    // Add edges
    for (prev_node_idx in conflict_graph[node]['reason']) {
      edge_obj = {
        from: -1*conflict_graph[node]['reason'][prev_node_idx],
        to: node,
        arrows: {
          to: {
            enabled: true,
            type: 'arrow',
          },
        },
      };
      console.log("Add edge from " + conflict_graph[node]['reason'][prev_node_idx] + " to " + node);
      edge_data.push(edge_obj);
    }
  }
  var nodes = new vis.DataSet(node_data);
  var edges = new vis.DataSet(edge_data);

  var container = document.getElementById("conflict-graph");
  var data = {
    nodes: nodes,
    edges: edges,
  };
  var options = {
    physics: {
      enabled: true,
      wind: {
        x: -1,
        y: 0,
      },
    },
  };
  var network = new vis.Network(container, data, options);
}

function interface_backjump(level) {
  addToLog("BACKJUMPING TO LEVEL: " + level);
  cur_level = level;
  cur_assignment = cur_assignment.filter(obj =>
    obj.level <= level
  );
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
