import json

with open('scratch/audit_results.json', encoding='utf-8') as f:
    res = json.load(f)

with open('scratch/audit_table.md', 'w', encoding='utf-8') as out:
    out.write("| Page | Title (chars) | Meta Description (chars) | H1 Count & Text | Canonical | JSON-LD Schema Types |\n")
    out.write("|:---|:---|:---|:---|:---:|:---|\n")
    for r in res:
        title = r['title'].replace('|', '\\|')
        meta = r['meta'].replace('|', '\\|')
        h1 = r['h1_text'].replace('|', '\\|')
        # summarize schema types uniquely
        types = [t.strip() for t in r['schema'].split(',') if t.strip()]
        unique_types = []
        for t in types:
            if t not in unique_types:
                unique_types.append(t)
        schema_summary = ', '.join(unique_types) if unique_types else 'None'
        out.write(f"| `{r['page']}` | {title} ({r['title_len']}) | {meta} ({r['meta_len']}) | **{r['h1_count']}**: {h1} | {r['canonical']} | {schema_summary} |\n")

    out.write("\n\n### Implantologist Matches:\n\n")
    for r in res:
        if r['implantologist_matches']:
            out.write(f"#### `{r['page']}` ({len(r['implantologist_matches'])} occurrences)\n")
            for l, txt in r['implantologist_matches']:
                out.write(f"- **Line {l}**: `{txt}`\n")
            out.write("\n")

print("Generated audit_table.md successfully.")
