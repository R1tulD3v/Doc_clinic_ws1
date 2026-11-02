import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")
out_png = os.path.join(current_dir, "shot_treatments_btn_rendered.png")

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

scroll_script = """
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const btn = document.querySelector('.svc__more a');
    if (btn) btn.scrollIntoView({ block: 'center' });
  }, 400);
});
</script>
"""

test_html = os.path.join(workspace_dir, "_test_btn_final.html")
with open(test_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace("</body>", scroll_script + "</body>"))

cmd = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={out_png}",
    "--window-size=1280,600",
    "--virtual-time-budget=2000",
    f"file:///{test_html.replace(os.sep, '/')}"
]
subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

if os.path.exists(test_html):
    os.remove(test_html)

print("Captured shot_treatments_btn_rendered.png:", os.path.exists(out_png))
