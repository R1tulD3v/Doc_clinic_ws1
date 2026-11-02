import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")
out_png = os.path.join(current_dir, "shot_treatments_btn_isolated.png")

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

isolate_css = """
<style>
header, footer, .fabs, .hero, .about, .reviews, .stats, .why, .faq, #contact { display: none !important; }
body, html { margin: 0; padding: 20px; background: #fff !important; }
.svc-grid { display: none !important; }
.sec-head { margin-bottom: 20px !important; }
</style>
"""

test_html = os.path.join(workspace_dir, "_test_btn_iso.html")
with open(test_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace("</head>", isolate_css + "</head>"))

cmd = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={out_png}",
    "--window-size=800,320",
    "--virtual-time-budget=2000",
    f"file:///{test_html.replace(os.sep, '/')}"
]
subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

if os.path.exists(test_html):
    os.remove(test_html)

print("Captured shot_treatments_btn_isolated.png:", os.path.exists(out_png))
