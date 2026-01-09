import json
import csv
import ast
from django.shortcuts import render, redirect
from .logic import process_tablet
from .logic import compute_prob_dp
from .logic import flatten_tablet
from .logic import compute_expectation
from .models import Contact
from django.utils import timezone
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.views.decorators.csrf import csrf_exempt

#@csrf_exempt
def calc_probabilities(request):
    """
    POST /api/calc-probabilities/
    body: {
      tablet_map: [[…], […], …],    # 2D 석판 배열
      start_pos: [r, c],              # 시작 좌표
      n: <정화 횟수>,
      elzowin_level: <0~8 정수>
    }
    returns JSON { within_n:…, within_n_plus_1:… }
    """
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    tablet_map     = data.get('tablet_map')
    spirit_pos      = data.get('spiritPos')
    n              = data.get('n')
    elzowin_level  = data.get('elzowin_level')
    total_count    = data.get('totalCount')
    visited_list   = data.get('visitedList',[])

    # 필수 파라미터 검증
    if tablet_map is None:
        return JsonResponse({'error': 'tablet_map is required'}, status=400)
    if spirit_pos is None or len(spirit_pos) != 2:
        return JsonResponse({'error': 'spirit_pos must be [r, c]'}, status=400)
    if n is None:
        return JsonResponse({'error': 'n is required'}, status=400)
    if elzowin_level is None:
        return JsonResponse({'error': 'elzowin_level is required'}, status=400)


    # 0) visited리스트 적용, 새로운 start 찾기
    for vr, vc in visited_list:
        tablet_map[vr][vc] = 'visited'
    
    for i in range(len(tablet_map)):
        for j in range(len(tablet_map[0])):
            if tablet_map[i][j] == 'start':
                tablet_map[i][j] = 'path'

    sr, sc = spirit_pos
    tablet_map[sr][sc] = 'start'

    # 1) 2D map → 1D path
    path = flatten_tablet(tablet_map)
    print(path)

    # 2) DP 계산
    result = compute_prob_dp(path, n-total_count, elzowin_level)

    # 3) 결과 반환
    return JsonResponse({
        'within_n':        result['within_n'],
        'within_n_plus_1': result['within_n_plus_1'],
    })

#@csrf_exempt
@require_POST
def update_tablet(request):
    try:
        payload = json.loads(request.body)
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    # 클라이언트에서 보낸 데이터
    tablet_map = payload.get("tabletMap") #현재 석판 상황
    action     = payload.get("action")
    spirit_pos = payload.get("spiritPos")
    total_count = payload.get("totalCount") #총 정화 횟수
    enhancement_count = payload.get("enhancementCount") #강화 타일 밟은 횟수
    elzowin_level=payload.get("elzowinLevel")
    visited_list   = payload.get('visitedList',[]) #방문한 타일 리스트
    stage          = payload.get('stage')
    part           = payload.get('item_type')
    n              = payload.get('n')
    unreached_special_tiles = payload.get('unreached_special_tiles')
    
    # 0) visited리스트 적용, 새로운 start 찾기
    #print("visited_list :",visited_list)
    for vr, vc in visited_list:
        tablet_map[vr][vc] = 'visited'
    #print("enh count :",enhancement_count)
    
    for i in range(len(tablet_map)):
        for j in range(len(tablet_map[0])):
            if tablet_map[i][j] == 'start':
                tablet_map[i][j] = 'path'

    sr, sc = spirit_pos
    tablet_map[sr][sc] = 'start'

    # print("<debug>")
    # print("(1) tablet_map")
    # for row in tablet_map:
    #     print(row)

    path=flatten_tablet(tablet_map,part,stage)

    #compute_expectation(total_count, path[:], int(unreached_special_tiles), part, stage, elzowin_level)
    expectations = {}
    
    with open("./myapp/expectations.csv", mode="r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            key, value = row
            expectations[key] = ast.literal_eval(value)
    try:
        my_expectation_n=expectations[str((str(len(path)-1),str(unreached_special_tiles),str(n-total_count),str(elzowin_level)))]
    except KeyError:
        my_expectation_n=1.0
    try:    
        my_expectation_n_1=expectations[str((str(len(path)-1),str(unreached_special_tiles),str(n-total_count+1),str(elzowin_level)))]
    except KeyError:
        my_expectation_n_1=1.0
    my_expectations=[my_expectation_n, my_expectation_n_1]
    
    probs = compute_prob_dp(
        path,
        #spirit_pos,
        n-total_count,
        elzowin_level,
        enhancement_count
    )
    
    # print("(2) spirit_pos :",spirit_pos)
    # print("(3) total_count :",total_count)
    # print("(4) elzowin_level :",elzowin_level)
    # print("(2) path")
    # print(path)
    

    if tablet_map is None:
        return JsonResponse({"error": "tabletMap is required"}, status=400)

    # 1) 로직 처리
    analysis = process_tablet(tablet_map)

    # 2) 필요하다면 action, spirit_pos 등에 따라 추가 로직
    #    예: DB에 저장하거나, 별도 함수 호출 등

    # 3) 응답
    return JsonResponse({
        "status": "ok",
        "action": action,
        "spiritPos": spirit_pos,
        "analysis": analysis,
        "probability": probs,
        "my_expectations" : my_expectations
    })

# Create your views here.
def ko_index(request):
    return render(request, 'ko_index.html')

def en_index(request):
    return render(request, 'en_index.html')

# 새로 추가: ko/ 나 en/ 이 없는 요청 (루트) 은 ko_index 로
def root_redirect(request):
    return redirect('https://chowoljoa.com/ko/')   # URL name ko_index 로


def calculate_view(request, item_type, stage):
    return render(request, 'calculate.html', {
        'item_type': item_type,
        'stage': stage,
    })

def en_calculate_view(request, item_type, stage):
    return render(request, 'en_calculate.html', {
        'item_type': item_type,
        'stage':stage,
        }
            )

def get_client_ip(request):
    """가장 일반적인 X‐Forwarded‐For 처리 로직"""
    xff = request.META.get('HTTP_X_FORWARDED_FOR')
    if xff:
        # proxy 뒤에 여러 IP가 올 수 있으므로 첫 번째를 취함
        return xff.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')

def contact(request):
    if request.method == 'POST':
        # 1) 폼 데이터 꺼내기
        subject   = request.POST.get('subject', '').strip()
        content   = request.POST.get('content', '').strip()
        reply_to  = request.POST.get('reply_to', '').strip() or None
        # category 필드가 폼에 없으면 빈 문자열로
        #category  = request.POST.get('category', '').strip()
        attachment = request.FILES.get('attachment')

        # 2) 메타데이터
        ip         = get_client_ip(request)
        user_agent = request.META.get('HTTP_USER_AGENT', '')

        # 3) 인스턴스 생성 & 필드 할당
        contact_obj = Contact(
            subject        = subject,
            content        = content,
            reply_to       = reply_to or None,
            published_date = timezone.now(),
            ip             = ip,
            user_agent     = user_agent,
            status         = 'pending',
        )
        if 'image' in request.FILES:
            contact_obj.image = request.FILES['image']

        # 4) 저장
        contact_obj.save()

        # 5) 완료 후 리다이렉트 (원하시는 곳으로 변경 가능)
        return redirect('ko_index')

    # GET 으로 들어오면 KO 메인으로
    return redirect('ko_index')
    
