document.getElementById('menuForm').addEventListener('submit'), async (e) => {
  e.preventDefault();
}

const formData = new FormData(e.target);
const data = Object.fromEntries(formData.entries());

const res = await.fetch('/api/menu', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json'},
  body: JSON.stringify(data)
});

const result = await res.text();
document.getElementById('resultArea').textContent = result;