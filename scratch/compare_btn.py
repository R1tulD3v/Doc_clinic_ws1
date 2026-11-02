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
window.addEventListener('load', () => {
  const el = document.querySelector('.svc__more');
  if (el) el.scrollIntoView({ block: 'center' });
});
</script>
"""
# Test 1: View All Treatments with existing SVG
html1 = html_content.replace(
    '<span data-i18n="svc.viewAll">View All\n            Services</span>',
    '<span data-i18n="svc.viewAll">View All Treatments</span>'
).replace("</body>", scroll_script + "</body>")
test1 = os.path.join(workspace_dir, "_test_btn1.html")
with open(test1, "w", encoding="utf-8") as f:
    f.write(html1)

# Test 2: View All Treatments → with SVG removed
html2 = html_content.replace(
    """<a href="services.html" class="btn btn--ghost btn--pill"><span data-i18n="svc.viewAll">View All
            Services</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg></a>""",
    """<a href="services.html" class="btn btn--ghost btn--pill"><span data-i18n="svc.viewAll">View All Treatments →</span></a>"""
).replace("</body>", scroll_script + "</body>")
test2 = os.path.join(workspace_dir, "_test_btn2.html")
with open(test2, "w", encoding="utf-8") as f:
    f.write(html2)

# Test 3: View All Treatments → WITH existing SVG
html3 = html_content.replace(
    '<span data-i18n="svc.viewAll">View All\n            Services</span>',
    '<span data-i18n="svc.viewAll">View All Treatments →</span>'
).replace("</body>", scroll_script + "</body>")
test3 = os.path.join(workspace_dir, "_test_btn3.html")
with open(test3, "w", encoding="utf-8") as f:
    f.write(html3)

for idx, tpath in enumerate([test1, test2, test3], 1):
    png = os.path.join(current_dir, f"shot_btn_option_{idx}.png")
    cmd = [
        chrome_path,
        "--headless=new",
        f"--user-data-dir={user_data}",
        f"--screenshot={png}",
        "--window-size=1280,600",
        "--virtual-time-budget=2000",
        f"file:///{tpath.replace(os.sep, '/')}"
    ]
    subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
    if os.path.exists(tpath):
        os.remove(tpath)
    print(f"Generated option {idx}:", os.path.exists(png))
