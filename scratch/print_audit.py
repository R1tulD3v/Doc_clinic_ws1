import json

with open('scratch/audit_results.json', encoding='utf-8') as f:
    res = json.load(f)

for r in res:
    print(f"=== {r['page']} ===")
    print(f"  Title ({r['title_len']} chars): {r['title']}")
    print(f"  Meta ({r['meta_len']} chars): {r['meta']}")
    print(f"  H1 ({r['h1_count']}): {r['h1_text']}")
    print(f"  Canonical: {r['canonical']}")
    print(f"  Schema: {r['schema']}")
    if r['implantologist_matches']:
        print(f"  Implantologist matches ({len(r['implantologist_matches'])}):")
        for l, txt in r['implantologist_matches']:
            print(f"    Line {l}: {txt[:100]}")
    else:
        print("  Implantologist matches: None")
