import subprocess
import os
import json
import time
import urllib.request

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")

viewports = [
    (1280, 950, "desktop_1280"),
    (375, 812, "mobile_375"),
    (390, 844, "mobile_390"),
    (430, 932, "mobile_430")
]

for w, h, name in viewports:
    user_data = os.path.join(current_dir, f"temp_profile_cdp_{name}")
    port = 9222
    proc = subprocess.Popen([
        chrome_path,
        "--headless=new",
        f"--remote-debugging-port={port}",
        f"--user-data-dir={user_data}",
        f"--window-size={w},{h}",
        f"file:///{index_html.replace(os.sep, '/')}"
    ], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    
    time.sleep(1.5)
    try:
        req = urllib.request.urlopen(f"http://localhost:{port}/json")
        pages = json.loads(req.read().decode())
        ws_url = pages[0]['webSocketDebuggerUrl']
        
        # We can use websocket or CDP via node ws module or simple python script
    except Exception as e:
        print("Error connecting:", e)
    finally:
        proc.kill()
