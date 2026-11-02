import subprocess
import os
import json
import re

chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
current_dir = os.path.dirname(os.path.abspath(__file__))
workspace_dir = os.path.dirname(current_dir)
index_html = os.path.join(workspace_dir, "index.html")

script = """
<script>
window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    const sec = document.querySelector('.clinic-video-sec');
    const wrapper = document.querySelector('.clinic-video-wrapper');
    const awardsSec = document.querySelector('#awards');
    const awardsEyebrow = document.querySelector('#awards .eyebrow');

    const secRect = sec.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();
    const awardsSecRect = awardsSec.getBoundingClientRect();
    const awardsEyebrowRect = awardsEyebrow.getBoundingClientRect();

    const secStyle = window.getComputedStyle(sec);
    const awardsStyle = window.getComputedStyle(awardsSec);

    const res = {
      windowWidth: window.innerWidth,
      secPaddingTop: secStyle.paddingTop,
      secPaddingBottom: secStyle.paddingBottom,
      secMarginBottom: secStyle.marginBottom,
      awardsPaddingTop: awardsStyle.paddingTop,
      awardsMarginTop: awardsStyle.marginTop,
      awardsPaddingBottom: awardsStyle.paddingBottom,
      videoBottomToAwardsTop: Math.round(awardsSecRect.top - wrapperRect.bottom),
      videoBottomToAwardsEyebrow: Math.round(awardsEyebrowRect.top - wrapperRect.bottom),
      secBottomToAwardsTop: Math.round(awardsSecRect.top - secRect.bottom),
      videoWrapperHeight: Math.round(wrapperRect.height),
      videoWrapperWidth: Math.round(wrapperRect.width)
    };

    document.body.innerHTML = '<div id="MEASURE_OUT">' + JSON.stringify(res) + '</div>';
  }, 300);
});
</script>
"""

with open(index_html, "r", encoding="utf-8") as f:
    html_content = f.read()

test_html = os.path.join(workspace_dir, "_test_measure.html")
with open(test_html, "w", encoding="utf-8") as f:
    f.write(html_content.replace("</body>", script + "</body>"))

viewports = [
    (1280, 950, "desktop_1280"),
    (375, 812, "mobile_375"),
    (390, 844, "mobile_390"),
    (430, 932, "mobile_430")
]

results = {}

for w, h, name in viewports:
    user_data = os.path.join(current_dir, f"temp_profile_{name}")
    cmd = [
        chrome_path,
        "--headless=new",
        f"--user-data-dir={user_data}",
        "--dump-dom",
        "--virtual-time-budget=2000",
        f"--window-size={w},{h}",
        f"file:///{test_html.replace(os.sep, '/')}"
    ]
    proc = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    raw_out = proc.stdout.decode('utf-8', errors='replace')
    m = re.search(r'<div id="MEASURE_OUT">(.*?)</div>', raw_out)
    if m:
        results[name] = json.loads(m.group(1))
    else:
        results[name] = "NOT_FOUND"

if os.path.exists(test_html):
    os.remove(test_html)

out_json = os.path.join(current_dir, "video_metrics_results.json")
with open(out_json, "w", encoding="utf-8") as f:
    json.dump(results, f, indent=2)

print("RESULTS:")
print(json.dumps(results, indent=2))
