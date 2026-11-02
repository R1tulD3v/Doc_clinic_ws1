import subprocess
import os
import time

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

# 1. Closed state
shot_closed = os.path.join(current_dir, "shot_closed.png")
cmd1 = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={shot_closed}",
    "--window-size=1280,950",
    f"file:///{index_html.replace(os.sep, '/')}"
]
subprocess.run(cmd1, capture_output=True, text=True)

# 2. Weekday Open state (opens automatically on load)
script_open = """
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const trigger = document.getElementById('hero-dt-trigger');
    if (trigger) trigger.click();
  }, 50);
});
</script>
"""
test_open_html = os.path.join(workspace_dir, "_test_open.html")
with open(test_open_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace("</body>", script_open + "</body>"))

shot_open = os.path.join(current_dir, "shot_compact_open.png")
cmd2 = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={shot_open}",
    "--virtual-time-budget=1000",
    "--window-size=1280,950",
    f"file:///{test_open_html.replace(os.sep, '/')}"
]
subprocess.run(cmd2, capture_output=True, text=True)

# 3. Sunday Open state
script_sun = """
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const trigger = document.getElementById('hero-dt-trigger');
    if (trigger) trigger.click();
    const btns = document.querySelectorAll('.dd2-dt-date-btn');
    if (btns[1]) btns[1].click();
  }, 50);
});
</script>
"""
test_sun_html = os.path.join(workspace_dir, "_test_sun.html")
with open(test_sun_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace("</body>", script_sun + "</body>"))

shot_sun = os.path.join(current_dir, "shot_compact_sun.png")
cmd3 = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={shot_sun}",
    "--virtual-time-budget=1000",
    "--window-size=1280,950",
    f"file:///{test_sun_html.replace(os.sep, '/')}"
]
subprocess.run(cmd3, capture_output=True, text=True)

# Clean up test HTMLs
if os.path.exists(test_open_html): os.remove(test_open_html)
if os.path.exists(test_sun_html): os.remove(test_sun_html)

print("Closed shot:", os.path.exists(shot_closed))
print("Compact open shot:", os.path.exists(shot_open))
print("Compact sun shot:", os.path.exists(shot_sun))
