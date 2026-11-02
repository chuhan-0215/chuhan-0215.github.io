from pathlib import Path
from html.parser import HTMLParser
import re,json,sys,hashlib
R=Path(sys.argv[1])if len(sys.argv)>1 else Path(__file__).resolve().parent/'dist'
class Check(HTMLParser):
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='a'and'href'in a:assert a['href'].startswith('#')or a['href']=='papers/Confidence-Fallback.pdf',('outbound navigation',a['href'])
  if tag in ['script','img','link']:
   k='href'if tag=='link'else'src';v=a.get(k)
   if v and not v.startswith('data:'):assert not re.match(r'^(https?:)?//',v)and(R/v).is_file(),v
for name in ['index.html','style.css','app.js','content.js','photos.js','.nojekyll']:assert(R/name).is_file(),name
Check().feed((R/'index.html').read_text(encoding='utf8'))
for p in R.glob('*'):
 if p.suffix in ['.html','.js','.css']:
  text=p.read_text(encoding='utf8')
  for forbidden in ['39.105.119.125','SeLaR','Soft-Thinking','state-dependent control','固定干预','独立任务上的准确率收益','post_observation','baseline_results','episodes.jsonl']:
   assert forbidden not in text,('unpublished detail or server reference',p.name,forbidden)
text=(R/'content.js').read_text(encoding='utf8');data=json.loads(text.removeprefix('const CONTENT=').strip().removesuffix(';'));assert data['zh']['ongoingBody']=='我也正在开展Agent相关研究。'and data['en']['ongoingBody']=='I am also working on an ongoing Agent research project.'
photos=json.loads((R/'photos.js').read_text(encoding='utf8').removeprefix('const PHOTOS=').strip().removesuffix(';'));assert len(photos)==12
for p in photos:
 for k in ['src','thumb']:
  b=(R/p[k]).read_bytes();assert b.startswith(b'RIFF')and b[8:12]==b'WEBP'
print(json.dumps({'public_content_check':'pass','photos':len(photos),'no_server_links':True,'agent_details':'one generic statement per language'}))
if(R/'paper.json').exists():
 p=json.loads((R/'paper.json').read_text(encoding='utf8'));raw=(R/p['href']).read_bytes();assert raw.startswith(b'%PDF-')and len(raw)==p['bytes']and hashlib.sha256(raw).hexdigest()==p['sha256']and p['pages']==4
 print(json.dumps({'author_provided_paper':'pass','pages':p['pages'],'sha256':p['sha256']}))
