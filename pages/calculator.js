/* Browser implementation of myapp/logic.py. No backend requests. */
(function (root) {
  'use strict';
  const blessing = [
    [.4,.3,.2,.1], [.35,.25,.25,.15], [.3,.2,.3,.2],
    [.25,.15,.35,.25], [.2,.1,.4,.3], [.15,.05,.45,.35],
    [.05,.05,.45,.45], [0,0,.4,.6], [0,0,.1,.9]
  ];
  const movable = new Set(['path','start','goal','replicate','development',
    'purification','enhancement','awakening']);
  const lengths = {upper:[15,17,20,21,24,26,29],
    weapon:[15,17,20,21,24,26,29], others:[17,19,22,23,26,28,31]};

  function computeProbability(path, n, level, initialEnhancement) {
    if (!path.length || !Number.isInteger(level) || !blessing[level]) {
      throw new Error('Invalid path or blessing level.');
    }
    let previous = new Map([[`0,${initialEnhancement},1`, 1]]);
    const goal = path.length - 1;
    let withinN = 0, withinN1 = 0;
    for (let t = 1; t <= n + 1; t++) {
      const current = new Map();
      for (const [state, probability] of previous) {
        if (probability === 0) continue;
        const [index, enhancement, multiplier] = state.split(',').map(Number);
        if (index === goal) {
          if (t <= n) withinN += probability;
          withinN1 += probability;
          continue;
        }
        blessing[level].forEach((rollProbability, offset) => {
          if (rollProbability === 0) return;
          const q = probability * rollProbability;
          const steps = (offset + 1 + enhancement) * multiplier;
          let next = Math.min(index + steps, goal);
          while (true) {
            const tile = path[next];
            if (tile === 'replicate') {
              next = Math.min(next + steps, goal);
              if (next === goal) break;
              continue;
            }
            if (tile === 'development') next = Math.min(next + 4, goal);
            else if (tile === 'purification') next = Math.min(next + 1, goal);
            break;
          }
          const enhancement2 = enhancement + (path[next] === 'enhancement' ? 1 : 0);
          const multiplier2 = path[next] === 'awakening' ? 3 : 1;
          if (next === goal) {
            if (t <= n) withinN += q;
            withinN1 += q;
          } else {
            const key = `${next},${enhancement2},${multiplier2}`;
            current.set(key, (current.get(key) || 0) + q);
          }
        });
      }
      previous = current;
    }
    return {within_n:withinN, within_n_plus_1:withinN1};
  }

  function flattenTablet(map, part, stage) {
    const limit = lengths[part]?.[Number(stage) - 1];
    if (!limit) throw new Error('Invalid equipment or stage.');
    let current;
    const visited = new Set();
    map.forEach((row,r) => row.forEach((tile,c) => {
      if (tile === 'start') { current = [r,c]; visited.add(`${r},${c}`); }
    }));
    if (!current) throw new Error('Select a start tile.');
    const path = ['start'];
    for (let i = 0; i < limit; i++) {
      for (const [dr,dc] of [[0,1],[1,0],[0,-1],[-1,0]]) {
        const [r,c] = [current[0]+dr,current[1]+dc];
        if (movable.has(map[r]?.[c]) && !visited.has(`${r},${c}`)) {
          path.push(map[r][c]);
          visited.add(current.join(','));
          current = [r,c];
          break;
        }
      }
    }
    return path;
  }

  function parseExpectations(csv) {
    const table = new Map();
    for (const line of csv.trim().split(/\r?\n/)) {
      const match = line.match(/^"\('([0-9]+)', '([0-9]+)', '([0-9]+)', '([0-9]+)'\)",(.+)$/);
      if (!match || !Number.isFinite(Number(match[5]))) throw new Error('Invalid expectation table.');
      table.set(match.slice(1,5).join(','), Number(match[5]));
    }
    return table;
  }
  const tables = new Map();
  function loadExpectations(url) {
    if (!tables.has(url)) {
      tables.set(url, fetch(url).then(response => {
        if (!response.ok) throw new Error('Unable to load calculator data.');
        return response.text();
      }).then(parseExpectations).catch(error => { tables.delete(url); throw error; }));
    }
    return tables.get(url);
  }
  function analyze(payload, table) {
    const map = payload.tabletMap.map(row => row.slice());
    for (const [r,c] of payload.visitedList || []) map[r][c] = 'visited';
    for (const row of map) row.forEach((tile,c) => { if (tile === 'start') row[c] = 'path'; });
    const [r,c] = payload.spiritPos;
    map[r][c] = 'start';
    const path = flattenTablet(map, payload.item_type, payload.stage);
    const remaining = payload.n - payload.totalCount;
    const expectation = draws => table.get([path.length-1,payload.unreached_special_tiles,
      draws,payload.elzowinLevel].join(',')) ?? 1;
    return {status:'ok', probability:computeProbability(path, remaining,
      payload.elzowinLevel, payload.enhancementCount),
      my_expectations:[expectation(remaining), expectation(remaining+1)]};
  }
  async function calculate(payload, url) {
    // Freeze state before waiting for the initial data download.
    const snapshot = JSON.parse(JSON.stringify(payload));
    return analyze(snapshot, await loadExpectations(url));
  }
  const api = {computeProbability,flattenTablet,parseExpectations,analyze,calculate};
  root.Chowol = api;
  if (typeof module !== 'undefined') module.exports = api;
})(globalThis);
