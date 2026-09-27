from collections import defaultdict

ELZOWIN_BLESSING=[
    [0.4, 0.3, 0.2, 0.1],
    [0.35, 0.25, 0.25, 0.15],
    [0.3, 0.2, 0.3, 0.2],
    [0.25, 0.15, 0.35, 0.25],
    [0.2, 0.1, 0.4, 0.3],
    [0.15, 0.05, 0.45, 0.35],
    [0.05, 0.05, 0.45, 0.45],
    [0, 0, 0.4, 0.6],
    [0, 0, 0.1, 0.9]
]

MOVABLE={'path','start','goal',
        'replicate','development',
        'purification','enhancement','awakening'}

SPECIAL= ('replicate', 'development','purification','enhancement','awakening')

def process_tablet(tablet_map):
    # tablet_map: list[list[str]]
    # 예: start/goal 좌표 찾기, 통계 계산 등
    start = None #초기화
    goal = None #초기화
    for i, row in enumerate(tablet_map):
        for j, t in enumerate(row):
            if t == "start":
                start = (i, j)
            elif t == "goal":
                goal = (i, j)
    # 어떤 처리를 하든 리턴
    return {"start": start, "goal": goal}

def flatten_tablet(tablet_map, part, level):
    lengths={'upper' : {1:15, 2:17, 3:20, 4:21, 5:24, 6:26, 7:29},
             'others' : {1:17,2:19,3:22,4:23,5:26,6:28,7:31},
             'weapon' : {1:15, 2:17, 3:20, 4:21, 5:24, 6:26, 7:29}
             }
    L=lengths[part][int(level)]

    path=[]
    visited=set()

    #start 위치 찾기
    for row in range(len(tablet_map)):
        for col in range(len(tablet_map[0])):
            if tablet_map[row][col]=='start':
                current=(row, col)
                visited.add(current)
                break

    #초기화
    init_dict=process_tablet(tablet_map)
    path.append('start')
    current=(init_dict['start'])

    directions=[(0,1),(1,0),(0,-1),(-1,0)]
    for i in range(L):
        for direction in directions:
            new=(current[0]+direction[0],current[1]+direction[1])
            if len(tablet_map)>new[0]>=0 and len(tablet_map[0])>new[1]>=0 and tablet_map[new[0]][new[1]] in MOVABLE and (new[0],new[1]) not in visited:
                path.append(tablet_map[new[0]][new[1]])
                visited.add(current)
                current=(new[0],new[1])
                break
    return path


def compute_prob_dp(path, n, elzowin_level, init_enh):
    L = len(path)
    goal_idx = L - 1

    # 상태: (idx, enh_count, mul) → 확률
    dp_prev = defaultdict(float)
    dp_prev[(0, init_enh, 1)] = 1.0

    prob_n, prob_n1 = 0.0, 0.0

    for t in range(1, n+2):
        dp_cur = defaultdict(float)

        for (idx, enh, mul), p in dp_prev.items():
            if p == 0:
                continue

            # 이미 goal인 상태
            if idx == goal_idx:
                if t <= n:  prob_n  += p
                prob_n1     += p
                continue

            # roll별 분기
            probs=ELZOWIN_BLESSING[elzowin_level]
            for roll, roll_p in enumerate(probs, start=1):
                if roll_p == 0:
                    continue
                q = p * roll_p

                # 1) 이동량 계산
                steps = (roll + enh) * mul
                i2 = min(idx + steps, goal_idx)

                # 2) 즉시 특수타일 효과
                while True:
                    tile = path[i2]
                    if tile == 'replicate':
                        i2 = min(i2 + steps, goal_idx)
                        if i2 ==  goal_idx:
                            break
                        continue
                    elif tile == 'development':
                        i2 = min(i2 + 4, goal_idx)
                    elif tile == 'purification':
                        i2 = min(i2 + 1, goal_idx)
                    break

                # 3) 강화/각성 업데이트
                tile2 = path[i2]
                enh2 = enh + (1 if tile2 == 'enhancement' else 0)
                mul2 = 3   if tile2 == 'awakening'   else 1

                # 4) goal 체크 및 누적
                if i2 == goal_idx:
                    if t <= n:  prob_n  += q
                    prob_n1     += q
                else:
                    dp_cur[(i2, enh2, mul2)] += q

        dp_prev = dp_cur

    return {'within_n': prob_n, 'within_n_plus_1': prob_n1}
