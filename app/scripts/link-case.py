# 症例のビートに phraseIds を入れる補助（python3 -I scripts/link-case.py <case.ts> beat=id,id ...）
import sys
path = sys.argv[1]
s = open(path, encoding="utf-8").read()
for arg in sys.argv[2:]:
    beat, ids = arg.split("=")
    ids = [x for x in ids.split(",") if x]
    i = s.index(f"id: '{beat}'")
    j = s.index("task: {", i)
    end = s.index("\n      },", j)
    block = s[j:end]
    if "phraseIds" in block:
        # 既存の phraseIds を置き換える
        a = s.index("phraseIds: [", j)
        b = s.index("]", a)
        s = s[:a] + "phraseIds: [" + ", ".join(f"'{x}'" for x in ids) + s[b:]
        continue
    k = s.index("kind: '", j)
    line_end = s.index("\n", k)
    s = s[:line_end] + "\n        phraseIds: [" + ", ".join(f"'{x}'" for x in ids) + "]," + s[line_end:]
open(path, "w", encoding="utf-8").write(s)
print("linked", len(sys.argv) - 2)
