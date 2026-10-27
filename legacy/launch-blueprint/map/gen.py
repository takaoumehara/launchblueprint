import json
# id, area, tier, status, ja, en, pass, depends_on, impacts
N=[
("purpose","purpose","T0","done","目的","Purpose","One-sentence purpose + who it is for, agreed by owner",[],["positioning","ux.research"]),
("positioning","purpose","T0","done","ポジショニング","Positioning","Value, offer, name, banned words written; name/domain checked (L1, L21)",["purpose","ux.research"],["experience","marketing","brand.strategy"]),
("ux.research","ux","T1","done","調査","Research","5+ real user signals with sources (L13)",["purpose"],["ux.personas","positioning"]),
("ux.personas","ux","T1","done","ペルソナ","Personas","1–3 personas with JTBD, each traced to research",["ux.research"],["ux.pains","ux.journey"]),
("ux.pains","ux","T1","open","ペイン","Pain points","Top pains ranked by frequency × severity",["ux.personas"],["ux.ideas"]),
("ux.ideas","ux","T1","open","アイデア","Brainstorm","≥10 ideas, 3 picked with reason",["ux.pains"],["ux.flows"]),
("ux.flows","ux","T1","open","フロー","UX / flows","Main flow clickable; owner completes it without help",["ux.ideas"],["ux.journey","ux.interface"]),
("ux.journey","ux","T2","open","CJM","Journey map","Before/during/after stages with emotions and touchpoints",["ux.personas","ux.flows"],["ux.service_blueprint","brand.touchpoints","marketing"]),
("ux.service_blueprint","ux","T2","open","サービスブループリント","Service blueprint","Front/back stage + support processes per journey step",["ux.journey"],["ux.provider_needs","ops"]),
("ux.provider_needs","ux","T2","open","提供側の要件","Provider needs","Staff/provider tasks, data and tools listed",["ux.service_blueprint"],["ops","cost","legal.privacy","account_lifecycle"]),
("ux.interface","ux","T1","open","インターフェース","Interface spec","Build spec with states; checked at 393px (L20)",["ux.flows","ux.journey","brand.voice","brand.identity","brand.motion"],["experience"]),
("experience","ux","T0","needs_confirmation","体験・デザイン","Experience","Design direction, a11y contrast, languages + JA line breaks (L19)",["positioning","ux.interface","brand.identity"],["hosting","marketing"]),
("brand.strategy","brand","T1","done","ブランド戦略","Brand strategy","Owner repeats essence in ≤7 words",["positioning"],["brand.personality"]),
("brand.personality","brand","T1","done","人格","Personality","Aaker scores + 1–2 dominant traits",["brand.strategy"],["brand.voice","brand.motion"]),
("brand.voice","brand","T1","needs_confirmation","声・トーン","Voice & tone","Tone matrix EN/JA + this-not-that + Not-to-do list",["brand.personality"],["ux.interface","marketing","brand.voice_casting"]),
("brand.identity","brand","T0","done","アイデンティティ","Identity","Logo set, tokens, contrast pass",["brand.strategy"],["ux.interface","experience"]),
("brand.motion","brand","T2","open","モーション","Motion","Duration/easing tokens + reduced motion",["brand.personality"],["ux.interface"]),
("brand.voice_casting","brand","T2","open","声のキャスティング","Voice casting","Voice ID + dictionary; STT diff clean; native listen (L22)",["brand.voice"],["marketing"]),
("brand.touchpoints","brand","T2","open","タッチポイント","Touchpoints","360° map: make now / later / N/A, incl. AI agents as audience",["ux.journey"],["marketing"]),
("data","tech","T1","open","データ","Data","Schema + backup/restore tested on a copy (L5)",["ux.provider_needs"],["hosting","legal.privacy","exit"]),
("auth","tech","T1","open","認証","Auth","OAuth under company identity (L6); login works on real host",["hosting"],["account_lifecycle","security"]),
("hosting","tech","T0","done","ホスティング","Hosting","Locked for 12 months; cost at 0/100/10k users; real-stack spike deployed (L2, L3)",["data","cost","experience"],["auth","analytics","exit","legal.privacy"]),
("exit","tech","T2","open","移行・撤退","Exit / migration","Export + host-move gate rehearsed (L23)",["hosting","data"],[]),
("legal.privacy","legal","T1","needs_confirmation","プライバシー","Privacy","Per-region list (GDPR, UK GDPR, APPI, CCPA…) with applies_because",["data","hosting","ux.provider_needs","account_lifecycle"],["analytics","ops"]),
("legal.terms","legal","T2","open","規約","Terms","Terms + refunds/subscriptions reviewed; lawyer if T3",["security","account_lifecycle"],["marketing"]),
("account_lifecycle","security","T2","open","アカウントの一生","Account lifecycle","Rename, delete, takeover, death/incapacity flows defined",["auth","ux.provider_needs"],["legal.privacy","ops","legal.terms"]),
("security","security","T1","open","セキュリティ","Security","Credentials checklist + secrets rules + admin excluded (L9–L11)",["auth","hosting"],["legal.terms","ops"]),
("cost","ops","T0","needs_confirmation","コスト","Cost","Paid-tool billing status + AI-credit table (L16, L17)",["ux.provider_needs"],["hosting"]),
("ops","ops","T2","open","運用・サポート","Ops / support","Email+DNS working (L7); support path; job queue (L18)",["ux.service_blueprint","ux.provider_needs","security","legal.privacy","account_lifecycle"],["cost"]),
("analytics","ops","T2","open","計測","Analytics","3 metrics with consent handling",["hosting","marketing","legal.privacy"],[]),
("marketing","ops","T1","open","マーケティング","Marketing","Core sentence, channel rules, script→voice→visuals (L21, L22)",["positioning","ux.journey","brand.voice","experience","brand.voice_casting","brand.touchpoints","legal.terms"],["analytics"]),
]
nodes=[dict(zip(["id","area","tier","status","ja","en","pass","depends_on","impacts"],n)) for n in N]
ids={n["id"] for n in nodes}
for n in nodes:
  for x in n["depends_on"]+n["impacts"]: assert x in ids,(n["id"],x)
html=open('template.html').read().replace('/*DATA*/',json.dumps({"project":"example","tier":"T2","blocks":nodes},ensure_ascii=False))
open('index.html','w').write(html)
