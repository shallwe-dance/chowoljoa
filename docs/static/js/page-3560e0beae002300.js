function showCategory(category, clickedBtn) {
  const all = ['upper', 'others', 'weapon'];
    all.forEach(cat => {
      document.getElementById(`grid-${cat}`).classList.add('hidden');
    });
    document.getElementById(`grid-${category}`).classList.remove('hidden');

    // 모든 버튼에서 강조 클래스 제거
    const buttons = document.querySelectorAll('.category-btn');
    buttons.forEach(btn => {
      btn.classList.remove('bg-sky-500', 'font-bold');
      btn.classList.add('bg-indigo-600');
    });

    // 클릭된 버튼 강조
    clickedBtn.classList.remove('bg-indigo-600');
    clickedBtn.classList.add('bg-sky-500', 'font-bold');
  }
