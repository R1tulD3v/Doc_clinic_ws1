import subprocess
import os
import json

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

# Let's inspect what happens with style.css unmodified at 360, 375, 390, 430
inspect_script = """
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const row = document.querySelector('.svc__row');
    const cards = document.getElementById('services-container');
    const cardList = [...document.querySelectorAll('.svc-card')];
    const res = {
      vw: window.innerWidth,
      row_w: row ? row.offsetWidth : null,
      cards_w: cards ? cards.offsetWidth : null,
      cards_cw: cards ? cards.clientWidth : null,
      cards_sw: cards ? cards.scrollWidth : null,
      cards_pl: cards ? window.getComputedStyle(cards).paddingLeft : null,
      cards_pr: cards ? window.getComputedStyle(cards).paddingRight : null,
      cards_ml: cards ? window.getComputedStyle(cards).marginLeft : null,
      cards_mr: cards ? window.getComputedStyle(cards).marginRight : null,
      cardList: cardList.map(c => ({
        w: c.offsetWidth,
        left: c.offsetLeft,
        rect_w: c.getBoundingClientRect().width,
        rect_left: c.getBoundingClientRect().left
      }))
    };
    const div = document.createElement('div');
    div.id = 'OUT_DATA';
    div.textContent = JSON.stringify(res);
    div.style.cssText = 'position:fixed;top:0;left:0;background:black;color:white;font-size:10px;z-index:999999;word-break:break-all;';
    document.body.prepend(div);
  }, 500);
});
</script>
"""

test_content = html_content.replace("</body>", inspect_script + "</body>")
test_file = os.path.join(workspace_dir, "_test_diag.html")
with open(test_file, "w", encoding="utf-8") as f:
    f.write(test_content)

for w in [360, 375, 390, 430]:
    out_png = os.path.join(current_dir, f"diag_{w}.png")
    cmd = [
        chrome_path,
        "--headless=new",
        f"--user-data-dir={user_data}",
        f"--screenshot={out_png}",
        f"--window-size={w},400",
        "--virtual-time-budget=2000",
        f"file:///{test_file.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

if os.path.exists(test_file):
    os.remove(test_file)
