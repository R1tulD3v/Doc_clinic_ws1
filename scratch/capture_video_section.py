import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")

# Hide elements before #clinic-video in test html so screenshot captures clinic-video section cleanly
script = """
<style>
  header, section:not(.clinic-video-sec):not(#awards) {
    display: none !important;
  }
</style>
"""

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

test_html = os.path.join(workspace_dir, "_test_video_isolated.html")
with open(test_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace("</head>", script + "</head>"))

viewports = [
    (375, 812, "mobile_375"),
    (390, 844, "mobile_390"),
    (430, 932, "mobile_430")
]

for w, h, name in viewports:
    shot_file = os.path.join(current_dir, f"video_isolated_{name}.png")
    user_data = os.path.join(current_dir, f"temp_profile_iso_{name}")
    cmd = [
        chrome_path,
        "--headless=new",
        f"--user-data-dir={user_data}",
        f"--screenshot={shot_file}",
        "--virtual-time-budget=1000",
        f"--window-size={w},{h}",
        f"file:///{test_html.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, capture_output=True, text=True)

if os.path.exists(test_html):
    os.remove(test_html)

print("Isolated video section screenshots generated!")
