# catalog/*.yaml + project.blueprint.yaml -> catalog-data.js（UI用。手で書き写さない）
import yaml,json,glob,os
H=os.path.dirname(os.path.abspath(__file__))
proj=yaml.safe_load(open(os.path.join(H,'..','project.blueprint.yaml')))
sel={}
for s in proj['selections']:
    key=s['catalog_id']+('.'+s['option'] if s.get('option') else '')
    sel[key]=s
NAMES=dict(frontend='フロント',backend='バックエンド',database='データベース',auth='認証',security='セキュリティ',hosting='ホスト',payments='決済',storage_media='保存・動画',email_notifications='メール・通知',analytics='分析',ai_llm='AI',search='検索',realtime='リアルタイム',ci_cd='CI/CD',monitoring='監視')
out={'project':{k:proj[k] for k in ('project','tier','budget_target')},'domains':[]}
allnames={}
for d in NAMES:
    y=yaml.safe_load(open(os.path.join(H,d+'.yaml')))
    raw=y['auth']['providers'] if d=='auth' else y['entries']
    items=[]
    for e in raw:
        srcs=e['source'] if isinstance(e['source'],list) else [e['source']]
        if 'options' in e:
            for o in e['options']:
                items.append(dict(id=e['id']+'.'+o['id'],name='Connect '+o['id'].capitalize(),what=o['controller'],best_for=e['best_for'],avoid_when='',bands=dict(free=o['cost'],usd5='—',usd10='—',usd100='—'),limits='',lock_in=e['lock_in'],liability=o['liability'],security='',pairs=[],src=srcs))
            continue
        items.append(dict(id=e['id'],name=e['name'],what=e.get('what',e.get('best_for','')),best_for=e.get('best_for',''),avoid_when=e.get('avoid_when',''),bands=e['pricing_bands'],limits=e.get('limits',''),lock_in=e.get('lock_in',''),liability=e.get('liability_compliance',''),security=e.get('security',''),pairs=e.get('pairs_well_with',[]),support=e.get('support'),src=srcs))
    for it in items:
        s=sel.get(it['id'])
        it['status']=s['status'] if s else 'none'
        it['reason']=s['reason'] if s else ''
        it['rules']=s.get('rules',[]) if s else []
        allnames[it['id']]=it['name']
    out['domains'].append(dict(id=d,name=NAMES[d],items=items,methods=y['auth']['methods'] if d=='auth' else None))
out['names']=allnames
open(os.path.join(H,'..','catalog-data.js'),'w').write('// 自動生成：catalog/_build_ui.py（編集しない）\nwindow.CATALOG='+json.dumps(out,ensure_ascii=False)+';\n')
print(sum(len(x['items']) for x in out['domains']),'items')
