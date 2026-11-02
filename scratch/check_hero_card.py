import subprocess
import os

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")
user_data = os.path.join(current_dir, "temp_profile")

# Desktop capture
cmd_desktop = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={os.path.join(current_dir, 'hero_card_desktop.png')}",
    "--window-size=1280,900",
    "--virtual-time-budget=2000",
    f"file:///{index_html.replace(os.sep, '/')}"
]
subprocess.run(cmd_desktop, capture_output=True, text=True, encoding='utf-8', errors='ignore')

# Mobile capture (375px)
cmd_mobile = [
    chrome_path,
    "--headless=new",
    f"--user-data-dir={user_data}",
    f"--screenshot={os.path.join(current_dir, 'hero_card_mobile_375.png')}",
    "--window-size=375,900",
    "--virtual-time-budget=2000",
    f"file:///{index_html.replace(os.sep, '/')}"
]
subprocess.run(cmd_mobile, capture_output=True, text=True, encoding='utf-8', errors='ignore')

print("Desktop shot:", os.path.exists(os.path.join(current_dir, 'hero_card_desktop.png')))
print("Mobile shot:", os.path.exists(os.path.join(current_dir, 'hero_card_mobile_375.png')))
