"""Build machine-readable data for every Blueprint screen and embed it.
Run from catalog/: python3 _build_screens.py  (after _build.py / _build_ui.py)
Writes ../data/*.json and injects the same JSON into each screen's <script type="application/json" id="bp-data">."""
import json, re, yaml, glob, os, subprocess
os.chdir(os.path.dirname(os.path.abspath(__file__)))
subprocess.run(["python3","_build_ui.py"],check=True,stdout=subprocess.DEVNULL)
ROOT=".."; D="2026-10-26"
Y=lambda f: yaml.safe_load(open(f))
_t=open(f"{ROOT}/catalog-data.js").read();cat=json.loads(_t[_t.index('=')+1:].strip().rstrip(';'))
proj=Y(f"{ROOT}/project.blueprint.yaml"); rules=Y("rules.yaml"); fresh=Y("freshness.yaml"); bvb=Y("build_vs_buy.yaml"); canvas=Y("canvas.yaml")
pay=Y("payments.yaml"); conn=[e for e in pay["entries"] if e["id"]=="pay.stripe-connect"][0]
meta=lambda name,src: {"schema":"blueprint/"+name+"@1","generated":D,"publisher":"CREATIVITY IS EVERYWHERE, LLC","sources":src,"how_to_read":"catalog/ai-usage.md"}
names=cat["names"]
# catalog: add per-item freshness age for dot cluster
cat_out={"meta":meta("catalog",["catalog/*.yaml","project.blueprint.yaml","catalog/freshness.yaml"]),**cat,"freshness":fresh}
# canvas
cv={"meta":meta("canvas",["catalog/canvas.yaml"]),**canvas,"names":names}
# compare (Stripe Connect)
sel={(s.get("catalog_id"),s.get("option")):s for s in proj["selections"]}
opts=[]
for o in conn["options"]:
    s=sel.get(("pay.stripe-connect",o["id"]),{})
    opts.append({**o,"status":s.get("status","none"),"reason":s.get("reason",""),"rules":s.get("rules",[])})
stack=[]
for dom in cat["domains"]:
    for it in dom["items"]:
        if it["status"]=="selected" and dom["id"] in("hosting","database","email_notifications","auth"):
            stack.append({"domain":dom["name"],"id":it["id"],"name":it["name"],"bands":it["bands"]})
cmp={"meta":meta("compare-stripe-connect",["catalog/payments.yaml","project.blueprint.yaml","catalog/rules.yaml"]),
     "question":"主催者がイベントを作り、参加者から代金を受け取る。紛争・返金・損失の責任をプラットフォーム（自社）が負うか？",
     "item":{k:conn[k] for k in("id","name","lock_in","liability_compliance","source")},"options":opts,
     "rules":[r for r in rules["rules"] if r["id"]=="R-006"],"stack":stack,"budget_target":proj.get("budget_target")}
# rules: lineage (source kind -> rule -> scope)
def kind(src):
    return "オーナー明示" if "オーナー明示" in src else "AIの推測" if "AI" in src else "オーナー発言" if "発言" in src else "Blueprint" if "Blueprint" in src else "チーム/運用"
rl=[]
for r in rules["rules"]:
    used=[s.get("catalog_id") for s in proj["selections"] if r["id"] in (s.get("rules") or [])]
    rl.append({**r,"source_kind":kind(r.get("source","")),"used_by":list(dict.fromkeys(u for u in used if u))})
rul={"meta":meta("rules",["catalog/rules.yaml","project.blueprint.yaml"]),"today":D,"rules":rl}
# build vs buy
b={"meta":meta("build-vs-buy",["catalog/build_vs_buy.yaml"]),**bvb}
out={"catalog":cat_out,"canvas":cv,"compare-stripe":cmp,"rules":rul,"build-vs-buy":b}
os.makedirs(f"{ROOT}/data",exist_ok=True)
for k,v in out.items(): json.dump(v,open(f"{ROOT}/data/{k}.json","w"),ensure_ascii=False,indent=1)
index={"meta":meta("index",[]),"screens":[
 {"screen":"catalog-concept.html","data":"data/catalog.json","what":"技術カタログ（15分野・43件）と選択・鮮度"},
 {"screen":"canvas-concept.html","data":"data/canvas.json","what":"プロジェクトのノードグラフ（サンプル）"},
 {"screen":"compare-stripe.html","data":"data/compare-stripe.json","what":"Stripe Connect の方式比較と責任の所在"},
 {"screen":"rules-ledger.html","data":"data/rules.json","what":"ルール台帳と出どころ（系譜）"},
 {"screen":"build-vs-buy.html","data":"data/build-vs-buy.json","what":"作る／API／全部入りの費用比較"}]}
json.dump(index,open(f"{ROOT}/data/index.json","w"),ensure_ascii=False,indent=1)
SCREEN={"catalog":"catalog-concept.html","canvas":"canvas-concept.html","compare-stripe":"compare-stripe.html","rules":"rules-ledger.html","build-vs-buy":"build-vs-buy.html"}
for k,f in SCREEN.items():
    p=f"{ROOT}/{f}"; s=open(p).read()
    blob=json.dumps(out[k],ensure_ascii=False).replace("</","<\\/")
    tag=f'<script type="application/json" id="bp-data">{blob}</script>'
    s=re.sub(r'<script type="application/json" id="bp-data">.*?</script>',lambda m:tag,s,flags=re.S) if 'id="bp-data"' in s else s.replace("</head>",tag+"</head>",1)
    alt=f'<link rel="alternate" type="application/json" href="data/{k}.json" title="machine-readable data">'
    if 'rel="alternate"' not in s: s=s.replace("</head>",alt+"</head>",1)
    open(p,"w").write(s)
print("screens built:",", ".join(SCREEN.values()))
