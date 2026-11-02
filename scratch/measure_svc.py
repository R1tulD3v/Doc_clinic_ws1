import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

debug_script = """
<script>
window.addEventListener('load', () => {
  const container = document.querySelector('.svc__row');
  const cards = document.getElementById('services-container');
  const cardList = document.querySelectorAll('.svc-card');
  const info = {
    windowWidth: window.innerWidth,
    containerWidth: container ? container.getBoundingClientRect().width : null,
    cardsWidth: cards ? cards.getBoundingClientRect().width : null,
    cardsScrollWidth: cards ? cards.scrollWidth : null,
    cardsClientWidth: cards ? cards.clientWidth : null,
    card0Rect: cardList[0] ? cardList[0].getBoundingClientRect() : null,
    card1Rect: cardList[1] ? cardList[1].getBoundingClientRect() : null,
    card2Rect: cardList[2] ? cardList[2].getBoundingClientRect() : null,
  };
  const pre = document.createElement('pre');
  pre.id = 'debug-info';
  pre.textContent = JSON.stringify(info, null, 2);
  document.body.appendChild(pre);
});
</script>
"""

test_content = html_content.replace("</body>", debug_script + "</body>")
test_file = os.path.join(workspace_dir, "_test_measure.html")
with open(test_file, "w", encoding="utf-8") as f:
    f.write(test_content)

for w in [360, 375, 390, 430]:
    out_png = os.path.join(current_dir, f"measure_{w}.png")
    cmd = [
        chrome_path,
        "--headless=new",
        f"--user-data-dir={user_data}",
        f"--screenshot={out_png}",
        f"--window-size={w},680",
        "--virtual-time-budget=2000",
        f"file:///{test_file.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

if os.path.exists(test_file):
    os.remove(test_file)
