import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
user_data = os.path.join(current_dir, "temp_profile")

template = """<!DOCTYPE html>
<html>
<head>
<link rel="stylesheet" href="css/style.css">
<style>
body { padding: 40px; background: #F8FAFD; display: flex; flex-direction: column; gap: 30px; font-family: var(--sans); }
.box { display: flex; align-items: center; gap: 20px; }
.label { width: 220px; font-weight: bold; }
</style>
</head>
<body>
<div class="box">
  <div class="label">Option A (Treatments + SVG):</div>
  <a href="services.html" class="btn btn--ghost btn--pill"><span>View All Treatments</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
</div>

<div class="box">
  <div class="label">Option B (Treatments → no SVG):</div>
  <a href="services.html" class="btn btn--ghost btn--pill"><span>View All Treatments →</span></a>
</div>

<div class="box">
  <div class="label">Option C (Treatments → + SVG):</div>
  <a href="services.html" class="btn btn--ghost btn--pill"><span>View All Treatments →</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg></a>
</div>
</body>
</html>
"""

test_html = os.path.join(workspace_dir, "_test_btn_compare.html")
with open(test_html, "w", encoding="utf-8") as f:
    f.write(template)

out_png = os.path.join(current_dir, "shot_btn_side_by_side.png")
cmd = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={out_png}",
    "--window-size=800,400",
    f"file:///{test_html.replace(os.sep, '/')}"
]
subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
if os.path.exists(test_html):
    os.remove(test_html)

print("Generated shot_btn_side_by_side.png:", os.path.exists(out_png))
