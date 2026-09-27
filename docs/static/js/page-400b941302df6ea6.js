let totalCount = 0;

  let currentDir = [0,1];

  let specialEffects = {
  enhancementCount: 0,  // enhancement 누적 횟수
  nextMultiplier: 1,     // awakening 효과로 다음 정화 수 배수
  replicateNext: false,  // replicate 타일 효과 여부
  pendingExtraSteps: 0   // development/purification로 즉시 진행할 추가 정화 수
};


  const TILE_COLORS = {
  'wall': 'bg-transparent',
  'path': 'bg-gray-300',
  'start': 'bg-green-400',
  'goal': 'bg-pink-300',
  'spirit': 'bg-black text-white font-bold',
  'visited': 'bg-[#FFF0E9]',
  'replicate' : 'custom',
  'purification' : 'custom',
  'development' : 'custom',
  'enhancement' : 'custom',
  'awakening' : 'custom'
};

function updateSpiritButtons() {
  const container = document.getElementById('spiritButtons');
  container.innerHTML = '';  // 기존 버튼 모두 삭제

  // 기본값 1~4에 enhancementCount 만큼 더함
  for (let base = 1; base <= 4; base++) {
    const val = base + specialEffects.enhancementCount;
    const btn = document.createElement('button');
    btn.textContent = val;
    btn.classList.add('bg-indigo-600','text-white','px-4','py-2','rounded','hover:bg-indigo-700');
    btn.addEventListener('click', () => {
      // 0) 횟수 증가
      totalCount++;
      document.getElementById('totalCountValue').textContent = totalCount;
      // 1) 정령 이동 실행
      advanceSpirit(val);
      // 2) 서버에 전송
      sendTabletState("purify");

    });
    container.appendChild(btn);
  }
}

function confirmTabletState() {
  const blessing = Number(document.getElementById('elzowinBlessing').value);
  if (!spiritPos || !tabletMap.some(row => row.includes('goal')) ||
      !Number.isInteger(blessing) || blessing < 0 || blessing > 8) {
    alert("Select start and goal tiles, and a blessing level from 0 to 8."); return;
  }
  const elzowinInput = document.getElementById("elzowinBlessing");
  elzowinInput.disabled = true;
  elzowinInput.classList.add('bg-gray-200', 'cursor-not-allowed', 'opacity-50');

  // 1. 버튼 숨김
  document.getElementById("confirmTabletWrapper").classList.add("hidden");

  const countLabel = document.getElementById('totalCountLabel');
  document.getElementById('totalCountValue').textContent = totalCount;
  countLabel.classList.remove('hidden');

  // 2. 텍스트 표시
  document.getElementById("spiritChoiceLabel").classList.remove("hidden");

  // 3. 정화 버튼 표시
  document.getElementById("spiritButtons").classList.remove("hidden");

  // 4. 정화 버튼 최초 렌더링
  updateSpiritButtons();

  sendTabletState("confirm");
}

  const itemType = document.body.dataset.item;   // 예: "upper"
  const stage = document.body.dataset.stage;          // 예: 1
  const mapKey = `${itemType}-${stage}`;
  const tabletMap = tabletMaps[mapKey];
  //console.log("mapKey =", mapKey, "loaded map:", tabletMaps[mapKey]);


  let spiritPos = findStartPosition(tabletMap);
  const visited = new Set();

  function findStartPosition(map) {
  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[0].length; c++) {
      if (map[r][c] === 'start') {
        // 시작 타일 옆에 path 가 있는 방향을 currentDir 으로 초기화
        [[0,1],[1,0],[0,-1],[-1,0]].some(([dr,dc]) => {
          if (map[r+dr]?.[c+dc] === 'path') {
            currentDir = [dr, dc];
            return true;
          }
        });
        return [r, c];
      }
    }
  }
  return null;
}
  const PATH_TILES = [
  'path','replicate','purification',
  'development','enhancement','awakening'
];

const SPECIAL_TILES = [
  'replicate', 'purification',
  'development', 'enhancement', 'awakening'
]

const NUM_SPECIAL_TILES = {
  '1':4, '2':5, '3':5, '4':6, '5':6, '6':7, '7':7
}
let unreached_special_tiles=NUM_SPECIAL_TILES[stage]

  function getNextPosition(r, c, map, visited) {
  const [dr, dc] = currentDir;
  const right = [ dc, -dr ];
  const left  = [ -dc, dr ];
  const back  = [ -dr, -dc ];

  // 1️⃣ First pass: only walk on PATH_TILES
  for (const [dR, dC] of [[dr,dc], right, left, back]) {
    const nr = r + dR, nc = c + dC, key = `${nr},${nc}`;
    if (
      nr >= 0 && nr < map.length &&
      nc >= 0 && nc < map[0].length &&
      PATH_TILES.includes(map[nr][nc]) &&
      !visited.has(key)
    ) {
      currentDir = [dR, dC];
      return [nr, nc];
    }
  }

  // 2️⃣ Fallback: if we couldn’t move onto a path tile, see if goal is next
  for (const [dR, dC] of [[dr,dc], right, left, back]) {
    const nr = r + dR, nc = c + dC;
    if (
      nr >= 0 && nr < map.length &&
      nc >= 0 && nc < map[0].length &&
      map[nr][nc] === 'goal'
    ) {
      currentDir = [dR, dC];
      return [nr, nc];
    }
  }

  return null;
}

  let selectedPos = null;
  function showCustomDropdown(x, y) {
  const dropdown = document.getElementById("customDropdownWrapper");
  dropdown.style.left = `${x}px`;
  dropdown.style.top = `${y + window.scrollY}px`;
  dropdown.classList.remove("hidden");
}

function hideCustomDropdown() {
  document.getElementById("customDropdownWrapper").classList.add("hidden");
}

  function renderTablet() {
  const container = document.getElementById('tablet');
  container.innerHTML = '';

  // 그리드 크기 설정
  container.style.gridTemplateColumns = `repeat(${tabletMap[0].length}, 2.5rem)`;

  for (let r = 0; r < tabletMap.length; r++) {
    for (let c = 0; c < tabletMap[0].length; c++) {
      const key = `${r},${c}`;
      let type = tabletMap[r][c];

      // 정령 위치 반영
      if (spiritPos && r === spiritPos[0] && c === spiritPos[1]) {
        type = 'spirit';
      } else if (visited.has(key) && type !== 'goal') {
        type = 'visited';
      }

      // 셀 생성
      const cell = document.createElement('div');
      cell.classList.add('w-10', 'h-10', 'rounded', 'flex', 'items-center', 'justify-center', 'cursor-pointer','transition-transform', 'duration-100', 'hover:scale-105');

      // 선택된 셀이라면 강조 표시
if (selectedPos && selectedPos[0] === r && selectedPos[1] === c) {
  cell.classList.add('ring-2', 'ring-indigo-500');
}

// 색상 적용
if (type === 'goal') {
  cell.style.backgroundColor = '#D487BB';
} else if (type === 'visited') {
  cell.classList.add('bg-[#FFF0E9]');
} else if (TILE_COLORS[type] === 'custom') {
  cell.style.backgroundImage = `url('${document.body.dataset.static}images/tiles/${type}_1.jpg')`;
  cell.style.backgroundSize = 'cover';
  cell.style.backgroundPosition = 'center';
} else if (TILE_COLORS[type]) {
  cell.classList.add(...TILE_COLORS[type].split(' '));
}


// 텍스트 표시
if (type === 'spirit') {
  cell.textContent = '●';
} if (type === 'goal') {
  cell.textContent = 'G';
}

// 클릭 시 좌표 저장만
cell.addEventListener('click', (e) => {
  selectedPos = [r, c];
   showCustomDropdown(e.clientX, e.clientY);
});

document.addEventListener('click', (e) => {
  const dropdown = document.getElementById("customDropdownWrapper");
  if (!dropdown.contains(e.target) && !e.target.closest('#tablet')) {
    hideCustomDropdown();
  }
});

container.appendChild(cell);
    }
  }
}

  function advanceSpirit(times = 1) {
    if (!spiritPos) {
    alert("!!! Please set start tile !!!");
    location.reload();
    return;
  }

    document.getElementById("elzowinBlessing").disabled = true;
    document.getElementById("elzowinBlessing").classList.add('bg-gray-200', 'cursor-not-allowed', 'opacity-50');
//   document.querySelector('button[onclick="confirmElzowin()"]').disabled = true;
//   document.querySelector('button[onclick="confirmElzowin()"]').classList.add("bg-gray-300", "cursor-not-allowed", "opacity-60");
// document.querySelector('button[onclick="confirmElzowin()"]').classList.remove("bg-indigo-600", "hover:bg-indigo-700");

// 1) awakening 적용: nextMultiplier이 3 이상이면 한 번만 곱해 주고 초기화
  let base = times;
  if (specialEffects.nextMultiplier > 1) {
    base *= specialEffects.nextMultiplier;
    specialEffects.nextMultiplier = 1;
  }

  // 2) replicate 적용: “방금 사용된 정화 효과만큼” 추가
  let totalSteps = base;
  if (specialEffects.replicateNext) {
    totalSteps += base;
    specialEffects.replicateNext = false;
  }

  // 3) development / purification 로 즉시 추가
  totalSteps += specialEffects.pendingExtraSteps;
  specialEffects.pendingExtraSteps = 0;

  // 실제 이동 루프
  for (let i = 0; i < totalSteps; i++) {
    visited.add(`${spiritPos[0]},${spiritPos[1]}`);

    //다음 위치 계산
    const next = getNextPosition(spiritPos[0], spiritPos[1], tabletMap, visited);

    if (!next) {
      alert("Can't move anymore!");
      break;
    }

    //실제로 이동 및 렌더링
    spiritPos = next;
    renderTablet();

    //만약 도착 타일 만날 경우 + 특수 타일 지나칠 경우
    const [cr, cc] = spiritPos;
    if (SPECIAL_TILES.includes(tabletMap[cr][cc])) {
      unreached_special_tiles--;
      //console.log(unreached_special_tiles)
    }
    if (tabletMap[cr][cc] === 'goal') {
      alert("🎉 Finished!!");
      location.reload();
      return;
  }
}

    const [r, c] = spiritPos;
    const tileType = tabletMap[r][c];
    // 특수 타일 효과 처리
switch (tileType) {
  case 'awakening':
    specialEffects.nextMultiplier = 3;
    break;

  case 'enhancement':
    specialEffects.enhancementCount++ ;
    updateSpiritButtons();  // ← 버튼 갱신
    break;

  case 'replicate':
    // 초기 추가 이동 횟수 = times
    let remaining = base;

    while (remaining > 0) {
      // 현재 위치 방문 처리
      visited.add(`${spiritPos[0]},${spiritPos[1]}`);

      // 한 칸 이동
      const extra = getNextPosition(spiritPos[0], spiritPos[1], tabletMap, visited);
      if (!extra) break;         // 더 이상 이동 불가능하면 중단
      spiritPos = extra;
      renderTablet();

      // 도착한 타일 종류 확인
      const arrived = tabletMap[spiritPos[0]][spiritPos[1]];
      if (arrived === 'replicate') {
        // “replicate→replicate” 체인이 일어나면
        // 남은 추가 이동량에 다시 times 만큼 더해줌
        remaining += base;
      }

      remaining--;
    }
    break;

  case 'development':
    // 도착 즉시 4칸 추가 이동
        for (let j = 0; j < 4; j++) {
          visited.add(`${spiritPos[0]},${spiritPos[1]}`);
          const extra = getNextPosition(spiritPos[0], spiritPos[1], tabletMap, visited);
          if (!extra) break;
          spiritPos = extra;
          renderTablet();
        }
        break;

  case 'purification':
    alert("You've reached purification tile. Please select how much you have moved. This move doesn't count to the trial.");
    totalCount--;
    break;
    }
}

  // 초기 렌더링
  renderTablet();

  document.querySelectorAll('#customDropdownList li').forEach(item => {
  item.addEventListener('click', () => {
    if (!selectedPos) return;

    const [r, c] = selectedPos;
    const oldTile = tabletMap[r][c];
    const newTile = item.dataset.value;

    if (oldTile === 'start' && newTile !== 'start') {
      spiritPos=null;
    }

    if (newTile === 'start') {
      // start는 하나만 존재하게 초기화
      for (let i = 0; i < tabletMap.length; i++) {
        for (let j = 0; j < tabletMap[0].length; j++) {
          if (tabletMap[i][j] === 'start') {
            tabletMap[i][j] = 'path';
          }
        }
      }
      spiritPos = [r, c];
    }

    // ❗ 중요: 이건 무조건 실행해야 함!
    tabletMap[r][c] = newTile;

    selectedPos = null;
    hideCustomDropdown();
    renderTablet();
  });
});
//<!-- ***********************************석판 UI 종료****************************************** -->



const opportunities = {
    'upper' : {1:4, 2:4, 3:5, 4:5, 5:6, 6:6, 7:7},
    'others' : {1:5, 2:5, 3:6, 4:6, 5:7, 6:7, 7:8},
    'weapon' : {1:4, 2:4, 3:5, 4:5 , 5:6, 6:6, 7:7}
}
const n = opportunities[itemType]?.[parseInt(stage,10)] ?? 0;
console.log(itemType, parseInt(stage,10));

let latestCalculation = 0;
function sendTabletState(action, extra) {
  const requestId = ++latestCalculation;
  // 1) input 값 읽기
  const elzowinLevel = parseInt(
    document.getElementById('elzowinBlessing').value,
    10
  ) || 0;

  Chowol.calculate({
      item_type: itemType,
      stage: stage,
      mapKey: mapKey,
      tabletMap: tabletMap,
      spiritPos: spiritPos,      // 시작 위치가 있으면 포함
      action: action,            // "confirm" 또는 "purify"
      totalCount: totalCount,
      enhancementCount: specialEffects.enhancementCount,
      elzowinLevel: elzowinLevel,
      n: n,
      unreached_special_tiles:unreached_special_tiles,
      visitedList: Array.from(visited).map(s => {
        const [r, c] = s.split(',').map(Number);
        return [r, c];
      }),
      extra: extra || null       // 필요시 추가 정보
    }, document.body.dataset.static + "expectations.csv")
  .then(data => {
    if (requestId !== latestCalculation) return;
    if (data.status === "ok") {

      const pN = (data.probability.within_n * 100).toFixed(2);
      const pN1 = (data.probability.within_n_plus_1 * 100).toFixed(2);

      // 결정 로직
  const mcPct = (data.my_expectations[0] * 100).toFixed(1);
  const mcPct_1 = (data.my_expectations[1] * 100).toFixed(1);
  const recN  = (pN    >= mcPct*0.95)
                ? 'Keep Going!'
                : 'Stop Transcend';
  const recN1 = (pN1 >= mcPct_1*0.95)
                ? 'Keep Going!'
                : 'Stop Transcend';

      // 1) 첫 번째 li
  const liN      = document.getElementById('probWithinN');
  liN.querySelector('.prob-text').innerText = `Probability to get within ${n} trials (grade 3): ${pN}%`;
  liN.querySelector('.rec-text').innerText  = `recommendation : ${recN}`;

  // 2) 두 번째 li
  const liN1     = document.getElementById('probWithinN1');
  liN1.querySelector('.prob-text').innerText = `Probability to get within ${n+1} trials (grade 2): ${pN1}%`;
  liN1.querySelector('.rec-text').innerText  = `recommendation : ${recN1}`;



      document.getElementById('probabilityResults').classList.remove('hidden');
    }
  })
  .catch(err => { if (requestId === latestCalculation) alert("Calculation failed. Check start/goal tiles and your connection."); console.error(err); });
}
