import json,pathlib
H=pathlib.Path(__file__).parent
d=json.load(open(H.parent/'proto-round3/_canvas.json'))
order=['rules','brand','ux','ui','uxl','tech','biz','gtm','scale','exit']
names={f['id']:f['name'] for f in d['fields']}
names.update(uxl='UI/UX チェック',gtm='GTM・運用',scale='Scale',exit='Exit')
d['fields']=[{'id':i,'name':names[i]} for i in order]
N=lambda i,f,l,s,n,**k:dict(id=i,field=f,label=l,state=s,note=n,**k)
d['nodes']+=[
N('x1','uxl','空の状態を先に描く','done','データ0件の画面を最初に決める。初回の人が迷わない'),
N('x2','uxl','押せる所は44px以上','done','スマホで押し間違えない。はい/いいえで確認'),
N('x3','uxl','390px で崩れない','open','一番細いスマホ幅で文字が切れないか'),
N('g1','gtm','最初の100人の居場所','open','どのコミュニティで最初に知ってもらうか'),
N('g2','gtm','日英同時に公開','done','初日から日本語と英語。海外カードの手数料も見込む'),
N('g3','gtm','代理販売(MoR)','open','Paddle / Lemon Squeezy が税を肩代わり。5%+50¢',flag=True),
N('g4','gtm','問い合わせ窓口','done','運用：返事は48時間以内。テンプレートを用意'),
N('s1','scale','1万人で詰まる所','open','先に一番弱い部品を1つ挙げておく'),
N('s2','scale','DB 接続数の上限','open','無料枠の接続数。プール方式で回避'),
N('s3','scale','1人あたりの費用','done','月の費用 ÷ 利用者数。毎月記録'),
N('e1','exit','買い手に見せる数字','open','MRR・解約率・獲得単価を1画面に'),
N('e2','exit','DD 書類の置き場','done','契約・規約・権利の一覧を1か所に'),
N('e3','exit','毎月の記録','done','数字は後から作れない。今日から残す'),
]
d['edges']+=[[a,b,k] for a,b,k in [
('t5','g3','decided'),('g3','e1','decided'),('i1','x1','decided'),('i3','x3','decided'),('x2','x3','decided'),('i4','x2','candidate'),
('u1','g1','candidate'),('g1','g2','decided'),('z1','g3','candidate'),('g4','s1','candidate'),('t2','s2','decided'),('s1','s2','decided'),
('s3','e1','decided'),('e2','e1','decided'),('e3','e1','decided'),('z2','e2','decided'),('z3','s3','candidate'),('b1','g2','candidate'),('r3','s3','candidate')]]
d['trace']=d['trace']+['g3','e1']
d['updated']=d['meta']['generated']='2026-10-27'
json.dump(d,open(H/'_canvas.json','w'),ensure_ascii=False,indent=1)
json.dump(d,open(H.parent/'data/canvas.json','w'),ensure_ascii=False,indent=1)
t=(H/'tpl.html').read_text().replace('__CANVAS__',json.dumps(d,ensure_ascii=False).replace('</','<\\/'))
(H/'index.html').write_text(t);print(len(d['nodes']),len(d['edges']))
