from logic import compute_prob_dp
from logic import SPECIAL
import random
from tqdm import tqdm
import csv

iterations=10


elzowin=range(0,9) #엘조윈 9단계
tiles=range(1, 31) #도착 지점까지 남은 타일 수
special_tiles=range(0,8) #남은 특수 타일 수 0~7
draws_left=range(1, 10) #남은 정화 횟수 (최대 : 기타 방어구 7단계 2등급 노릴 경우)
#총 4차원, 크기 10*30*10*10 =/= 30,000

#init
cases=dict([]) #(남은 칸 수, 남은 특수 타일 수, 남은 드로우 수, 엘조윈)
for i in tiles:
    for j in special_tiles:
        if i-1<j:
            continue
        else:
            for e in elzowin:
                for d in draws_left:
                    cases[(str(i),str(j),str(d),str(e))]=0.0

for i in tqdm(tiles):
    for j in special_tiles:
        if i-1<j:
            continue
        else:
            for e in elzowin:
                for d in draws_left:
                    for n in range(1,iterations+1):
                        path=['start','goal']
                        for k in range(i-1):
                            path.insert(1, 'path')
                        random_locations=random.sample(range(1, len(path)-1), j)
                        random_specials=random.choices(SPECIAL, k=j)
                        for loc, special in zip(random_locations, random_specials):
                            path[loc] = special
                        cases[(str(i),str(j),str(d),str(e))]+=(1/n)*(compute_prob_dp(path, d, e, 0)['within_n']- cases[(str(i),str(j),str(d),str(e))])
with open("expectations.csv", mode="w", newline='', encoding="utf-8") as f:
    writer = csv.writer(f)
    for key, value in cases.items():
        writer.writerow([key, value])
