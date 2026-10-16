/* BELiOR Lounge API — a small Cloudflare Worker that knows the house's guests.
   Bindings:  KV namespace GUESTS      secret ADMIN_KEY
   Routes:    POST /verify  {k}                      -> {ok, name, tier}      (called by the site)
              GET  /admin                            -> the house's guest desk (HTML)
              GET  /admin/guests                     -> list      (Authorization: Bearer ADMIN_KEY)
              POST /admin/guests {name, tier, note}  -> add, returns the guest's private link
              DELETE /admin/guests/:token            -> remove (the link stops working at once) */

const SITE = 'https://belior-maison.pages.dev';
const TIERS = ['guest', 'circle'];
const cors = {'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type, Authorization', 'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'};
const json = (o, status = 200) => new Response(JSON.stringify(o), {status, headers: {'Content-Type': 'application/json; charset=utf-8', ...cors}});
const token = () => { const b = new Uint8Array(16); crypto.getRandomValues(b); return btoa(String.fromCharCode(...b)).replace(/\+/g, 'x').replace(/\//g, 'y').replace(/=+$/, ''); };

export default {
  async fetch(req, env) {
    const url = new URL(req.url), path = url.pathname;
    if (req.method === 'OPTIONS') return new Response(null, {headers: cors});

    if (path === '/verify' && req.method === 'POST') {
      const {k} = await req.json().catch(() => ({}));
      if (!k || typeof k !== 'string' || k.length > 64) return json({ok: false}, 400);
      const g = await env.GUESTS.get('g:' + k, 'json');
      if (!g) return json({ok: false}, 404);
      await env.GUESTS.put('g:' + k, JSON.stringify({...g, last: new Date().toISOString(), visits: (g.visits || 0) + 1}));
      return json({ok: true, name: g.name, tier: g.tier});
    }

    if (path === '/admin' && req.method === 'GET') return new Response(ADMIN_HTML, {headers: {'Content-Type': 'text/html; charset=utf-8'}});

    if (path.startsWith('/admin/guests')) {
      const auth = req.headers.get('Authorization') || '';
      if (!env.ADMIN_KEY || auth !== 'Bearer ' + env.ADMIN_KEY) return json({error: 'unauthorised'}, 401);
      if (req.method === 'GET') {
        const list = await env.GUESTS.list({prefix: 'g:'}), out = [];
        for (const key of list.keys) { const g = await env.GUESTS.get(key.name, 'json'); if (g) out.push({token: key.name.slice(2), ...g, link: SITE + '/lounge?k=' + key.name.slice(2)}); }
        out.sort((a, b) => (b.created || '').localeCompare(a.created || ''));
        return json(out);
      }
      if (req.method === 'POST') {
        const {name, tier, note} = await req.json().catch(() => ({}));
        if (!name || !TIERS.includes(tier)) return json({error: 'name and tier (guest|circle) required'}, 400);
        const k = token(), g = {name: String(name).slice(0, 60), tier, note: String(note || '').slice(0, 200), created: new Date().toISOString(), visits: 0};
        await env.GUESTS.put('g:' + k, JSON.stringify(g));
        return json({token: k, ...g, link: SITE + '/lounge?k=' + k});
      }
      if (req.method === 'DELETE') {
        const k = path.split('/')[3]; if (!k) return json({error: 'token'}, 400);
        await env.GUESTS.delete('g:' + k); return json({ok: true});
      }
    }
    return json({error: 'not found'}, 404);
  },
};

const ADMIN_HTML = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BELiOR Lounge · Guest desk</title>
<style>
body{margin:0;background:#0c0b0a;color:#ece4d6;font:14px/1.7 -apple-system,"Apple SD Gothic Neo","Noto Sans KR",sans-serif}
main{max-width:720px;margin:0 auto;padding:40px 20px 80px}
h1{font:400 22px/1.2 "Cormorant Garamond",Georgia,serif;letter-spacing:.2em;margin:0 0 4px}
.label{font-size:10px;letter-spacing:.28em;text-transform:uppercase;color:#c9aa6c;margin:0 0 24px}
form,section{border:1px solid rgba(201,170,108,.28);padding:20px;margin:0 0 20px}
label{display:grid;gap:6px;font-size:12px;color:#a69d8e;margin:0 0 14px}
input,select,button{font:inherit;color:#ece4d6;background:transparent;border:0;border-bottom:1px solid rgba(236,228,214,.3);padding:8px 0;outline:none;border-radius:0}
select option{color:#111}
button{border:1px solid #c9aa6c;color:#0c0b0a;background:#c9aa6c;padding:10px 20px;cursor:pointer;letter-spacing:.16em;font-size:11px;text-transform:uppercase}
button.ghost{background:none;color:#c9aa6c;padding:4px 10px}
.g{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;padding:12px 0;border-top:1px solid rgba(236,228,214,.1)}
.g small{display:block;color:#a69d8e;font-size:12px;word-break:break-all}
.tier{font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#c9aa6c}
#msg{color:#c9aa6c;min-height:1.5em}
</style></head><body><main>
<h1>BELiOR</h1><p class="label">Lounge · Guest desk</p>
<form id="key"><label>관리 키<input id="k" type="password" autocomplete="current-password" placeholder="ADMIN_KEY"></label><button>열기</button></form>
<form id="add" hidden><label>이름<input id="name" required placeholder="예: 김OO 대표"></label>
<label>등급<select id="tier"><option value="guest">Guest of the House — 공연·계약 고객</option><option value="circle">The Circle — 대표의 서클</option></select></label>
<label>메모 (고객에게 보이지 않음)<input id="note" placeholder="예: 2026 송년 갈라"></label>
<button>초대 링크 만들기</button><p id="msg"></p></form>
<section id="list" hidden><p class="label" style="margin:0 0 6px">Guests</p><div id="rows"></div></section>
<script>
const $=s=>document.querySelector(s);let KEY=sessionStorage.getItem('belior-admin')||'';
const api=(p,o={})=>fetch(p,{...o,headers:{'Content-Type':'application/json',Authorization:'Bearer '+KEY,...(o.headers||{})}}).then(async r=>{if(r.status===401){sessionStorage.removeItem('belior-admin');location.reload();}return r.json();});
async function load(){const gs=await api('/admin/guests');$('#key').hidden=true;$('#add').hidden=false;$('#list').hidden=false;
 $('#rows').innerHTML=gs.map(g=>'<div class="g"><div><span class="tier">'+(g.tier==='circle'?'The Circle':'Guest')+'</span> '+esc(g.name)+(g.note?' · <span style="color:#a69d8e">'+esc(g.note)+'</span>':'')+'<small>'+g.link+'</small><small>방문 '+(g.visits||0)+'회'+(g.last?' · 최근 '+g.last.slice(0,10):'')+'</small></div><div><button class="ghost" onclick="copy(\\''+g.link+'\\')">복사</button> <button class="ghost" onclick="del(\\''+g.token+'\\',\\''+esc(g.name)+'\\')">삭제</button></div></div>').join('')||'<p style="color:#a69d8e">아직 등록된 손님이 없습니다.</p>';}
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
window.copy=async l=>{try{await navigator.clipboard.writeText(l);$('#msg').textContent='링크를 복사했습니다.';}catch{prompt('링크',l);}};
window.del=async(t,n)=>{if(!confirm(n+' 님의 링크를 삭제할까요? 바로 열리지 않게 됩니다.'))return;await api('/admin/guests/'+t,{method:'DELETE'});load();};
$('#key').onsubmit=e=>{e.preventDefault();KEY=$('#k').value.trim();sessionStorage.setItem('belior-admin',KEY);load();};
$('#add').onsubmit=async e=>{e.preventDefault();const g=await api('/admin/guests',{method:'POST',body:JSON.stringify({name:$('#name').value,tier:$('#tier').value,note:$('#note').value})});
 if(g.link){$('#msg').textContent=g.name+' 님 링크: '+g.link;$('#name').value='';$('#note').value='';copy(g.link);load();}else $('#msg').textContent=g.error||'오류';};
if(KEY)load();
</script></main></body></html>`;
