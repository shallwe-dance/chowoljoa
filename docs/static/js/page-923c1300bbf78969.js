document.getElementById('helpBtn').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.toggle('hidden');
});
document.getElementById('helpCloseBtn').addEventListener('click', () => {
  document.getElementById('helpPanel').classList.add('hidden');
});
