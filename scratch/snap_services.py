import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

scroll_script = """
<script>
window.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('services');
  if (el) {
    el.scrollIntoView({ block: 'start', inline: 'nearest' });
  }
});
window.addEventListener('load', () => {
  const el = document.getElementById('services');
  if (el) {
    el.scrollIntoView({ block: 'start', inline: 'nearest' });
  }
});
</script>
"""

test_html = html_content.replace("</body>", scroll_script + "</body>")
test_path = os.path.join(workspace_dir, "_test_services_snap.html")
with open(test_path, "w", encoding="utf-8") as f:
    f.write(test_html)

widths = [360, 375, 390, 430]
for w in widths:
    png = os.path.join(current_dir, f"services_current_{w}.png")
    cmd = [
        chrome_path,
        "--headless=new",
        f"--user-data-dir={user_data}",
        f"--screenshot={png}",
        f"--window-size={w},800",
        "--virtual-time-budget=2500",
        f"file:///{test_path.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    print(f"Captured {w}px: {os.path.exists(png)}")

if os.path.exists(test_path):
    os.remove(test_path)
