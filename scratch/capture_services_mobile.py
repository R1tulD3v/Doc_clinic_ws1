import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

isolate_css = """
<style>
body > *:not(main), header, footer, .fabs, section:not(#services) { display: none !important; }
body, html { margin: 0 !important; padding: 0 !important; background: #fff !important; }
#services { padding-top: 15px !important; padding-bottom: 25px !important; }
[data-reveal] { opacity: 1 !important; transform: none !important; }
</style>
"""

test_html = os.path.join(workspace_dir, "_test_svc_mobile.html")
with open(test_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace("</head>", isolate_css + "</head>"))

widths = [360, 375, 390, 430]
for w in widths:
    out_png = os.path.join(current_dir, f"svc_mobile_current_{w}.png")
    cmd = [
        chrome_path,
        "--headless=new",
        f"--user-data-dir={user_data}",
        f"--screenshot={out_png}",
        f"--window-size={w},620",
        "--virtual-time-budget=2000",
        f"file:///{test_html.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    print(f"Captured {w}px: {os.path.exists(out_png)}")

if os.path.exists(test_html):
    os.remove(test_html)
