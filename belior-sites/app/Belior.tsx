"use client";
import {createContext, Fragment, useContext, useEffect, useRef, useState} from 'react';
import type {FormEvent, PointerEvent as RPointerEvent, ReactNode} from 'react';
import './belior.css';

/* BELiOR — the maison site.
   The film and chapter scenes open the house, the original maison follows below,
   and the animal collection extends it world by world. */

const V = (n: string) => '/belior/v3/' + n;
const MAIL = 'contact@belior.co.kr';
const MAIL2 = 'twottiva.business@gmail.com';
/* Reference images kept apart so high-resolution originals can replace them in one place. */
export const REF = {emblem: '/belior/refs/01_emblem_reference.png', bag: '/belior/refs/02_bag_reference.png', clothing: '/belior/refs/03_clothing_reference.png'};

type World = {
  slug: string; name: string; kw: string; mat: string; color: string; chips: string[];
  img: string | null; alt: string | null; tag: [string, string] | null;
  world: [string, string]; notes: string | null; scent: [string, string] | null; atelier: [string, string] | null;
};

const WORLDS: World[] = [
  {slug: 'lion', name: 'LION', kw: 'Nobility · Strength · Leadership', mat: 'Textured Gold', color: '#c9a35f',
    chips: ['#c9a35f', '#8a6232', '#3a2a18', '#ece4d6'], img: 'lion-wide.jpg', alt: 'lion-portrait.jpg', tag: null,
    world: ['사자의 시선은 언제나 앞으로 향합니다. 흔들림 없는 세상 속에서도 흔들리지 않는 존재감을 선사합니다.', 'The lion always looks ahead. A presence that holds steady in an unsteady world.'],
    notes: 'Woody · Amber · Leather', scent: ['깊고 묵직한 우디 노트에 따뜻한 앰버가 더해진, 품격 있는 향.', 'Deep woods warmed by amber. A scent of quiet dignity.'],
    atelier: ['프리미엄 소재와 장인정신으로 완성한 BELiOR의 오브제.', 'Objects finished with fine materials and patient craft.']},
  {slug: 'swan', name: 'SWAN', kw: 'Grace · Beauty · Artistry', mat: 'Textured Silver', color: '#c7cbd3',
    chips: ['#f1efe9', '#c7cbd3', '#8b97a8', '#4b5566'], img: 'swan-moon.jpg', alt: 'swan-gold.jpg', tag: null,
    world: ['백조의 우아함은 단순한 아름다움이 아닌, 시간을 초월한 순수함의 언어입니다.', 'The grace of the swan is more than beauty. It is a timeless language of purity.'],
    notes: 'Floral · Musk · Powdery', scent: ['섬세한 플로럴 노트와 부드러운 머스크가 어우러진, 우아한 향.', 'Delicate florals over soft musk. An elegant scent.'],
    atelier: ['백조의 날개에서 영감을 받은 섬세한 디테일의 오브제.', 'Objects with fine detail, drawn from the swan’s wing.']},
  {slug: 'orca', name: 'ORCA', kw: 'Freedom · Depth · Journey', mat: 'Deep Sapphire', color: '#3fa3ad',
    chips: ['#7cc7c9', '#2f8794', '#123c4f', '#0a1a26'], img: 'orca.jpg', alt: null, tag: null,
    world: ['깊은 바다를 유영하는 범고래처럼, 자유롭고 강한 에너지가 일상을 채웁니다.', 'Like the orca moving through deep water, a free and strong energy fills the everyday.'],
    notes: 'Aquatic · Amber · Marine', scent: ['차가운 바다의 신선함과 묵직한 앰버의 조화. 자유로운 향.', 'Cold sea freshness balanced by amber. A free scent.'],
    atelier: ['물결과 곡선에서 영감을 받은 다이내믹한 오브제.', 'Dynamic objects shaped by waves and curves.']},
  {slug: 'leopard', name: 'LEOPARD', kw: 'Elegance · Independence · Sensuality', mat: 'Gold / Black', color: '#d1a457',
    chips: ['#d8ae63', '#a87a3a', '#3b2a16', '#111111'], img: 'leopard.jpg', alt: null, tag: ['Elegance Without Permission.', '허락을 구하지 않는 우아함.'],
    world: ['표범의 우아함은 부드러움 속의 강함. 그 자체로 하나의 예술입니다.', 'The leopard’s elegance is strength within softness. A work of art in itself.'],
    notes: 'Spicy · Floral · Amber', scent: ['스파이시한 향신료와 플로럴 노트가 어우러진, 관능적인 향.', 'Spice and florals entwined. A sensual scent.'],
    atelier: ['고유의 패턴과 질감에서 영감을 받은 오브제.', 'Objects inspired by its own pattern and texture.']},
  {slug: 'panther', name: 'PANTHER', kw: 'Mystery · Intuition · Night', mat: 'Obsidian', color: '#a39cb0',
    chips: ['#5d586a', '#2c2a33', '#17161b', '#d08a3a'], img: 'panther.jpg', alt: null, tag: ['The Power of Silence.', '침묵이 가진 압도적인 힘.'],
    world: ['침묵 속에 숨겨진 강렬한 존재감. 그것이 팬서의 세계입니다.', 'An intense presence hidden in silence. This is the world of the panther.'],
    notes: 'Woody · Musk · Spicy', scent: ['깊은 우디 노트와 머스크가 어우러진, 신비롭고 매혹적인 향.', 'Deep woods and musk. A mysterious, captivating scent.'],
    atelier: ['어둠과 빛의 대비에서 탄생한 시크한 오브제.', 'Objects born from the contrast of dark and light.']},
  {slug: 'phoenix', name: 'PHOENIX', kw: 'Renewal · Elegance · Transcendence', mat: 'Fire Opal', color: '#e2803a',
    chips: ['#f2b25c', '#e2803a', '#9c3a1c', '#2a120a'], img: 'phoenix-scene.jpg', alt: null, tag: ['Born Beyond Limits.', '한계를 넘어 다시 태어나다.'],
    world: ['불꽃 속에서 다시 태어나는 불사조. 끝이 아닌 시작을 노래하는 세계입니다.', 'The phoenix, reborn in fire. A world that sings of beginnings, not endings.'],
    notes: null, scent: null, atelier: null},
];
const FOCAL: Record<string, [number, number]> = {lion: [47, 40], swan: [57, 58], orca: [28, 45], leopard: [53, 33], panther: [53, 42], phoenix: [76, 22]};
const posOf = (w: {slug: string}, d = 'center 35%') => w.slug === 'phoenix' ? '74% 45%' : w.slug === 'orca' ? '36% 45%' : d;

const MENU: {href: string; name: string; ko: string; subs: [string, string, string][]}[] = [
  {href: '/maison', name: 'MAISON', ko: '메종', subs: [['/maison', '하우스 소개', 'The house'], ['/maison#house', '무대에서 시작된 하우스', 'Born on stage'], ['/maison#symbol', '심볼 체계', 'Symbol system']]},
  {href: '/music', name: 'MUSIC & EXPERIENCE', ko: '음악과 경험', subs: [['/music/artists', '연주진', 'Artists'], ['/music/performances', '공연 포트폴리오', 'Performances'], ['/music/gala', 'Brand Gala Dinner Show', 'Brand Gala Dinner Show'], ['/music/inquiry', '공연 문의', 'Performance inquiry']]},
  {href: '/collection', name: 'COLLECTION', ko: '동물 컬렉션', subs: WORLDS.map(w => ['/collection/' + w.slug, w.name[0] + w.name.slice(1).toLowerCase(), w.name[0] + w.name.slice(1).toLowerCase()] as [string, string, string])},
  {href: '/products', name: 'PARFUM & OBJECTS', ko: '향과 오브제', subs: [['/products/no-16', 'No. 16 — 숲과 말', 'No. 16 — Forest & Horse'], ['/products/parfum', 'Parfum', 'Parfum'], ['/objects', 'Selected Objects', 'Selected Objects']]},
  {href: '/atelier', name: 'ATELIER', ko: '아틀리에', subs: [['/atelier', '콘텐츠 제작', 'Content direction'], ['/atelier#visual', '비주얼 팀', 'Visual team'], ['/atelier#process', '제작의 순서', 'Process']]},
  {href: '/journal', name: 'JOURNAL', ko: '저널', subs: [['/journal', '모든 이야기', 'All stories']]},
  {href: '/private', name: 'PRIVATE ENQUIRIES', ko: '프라이빗 문의', subs: [['/private', '문의하기', 'Enquire'], ['/lounge', 'BELiOR 라운지', 'BELiOR Lounge']]},
];

// page-turn: the destination label, and the animal shown on each turn (Lion first, then the house in order)
const LABELS: Record<string, string> = {
  '/': 'BELiOR', '/maison': 'MAISON', '/music': 'MUSIC & EXPERIENCE', '/music/artists': 'ARTISTS', '/music/performances': 'PERFORMANCES',
  '/music/gala': 'BRAND GALA DINNER SHOW', '/music/inquiry': 'PERFORMANCE INQUIRY', '/collection': 'THE COLLECTION', '/products': 'PARFUM & OBJECTS',
  '/products/no-16': 'No. 16', '/objects': 'OBJECTS', '/atelier': 'ATELIER', '/journal': 'JOURNAL', '/private': 'PRIVATE ENQUIRIES', '/lounge': 'LOUNGE',
};
WORLDS.forEach(w => { LABELS['/collection/' + w.slug] = w.name + ' COLLECTION'; });
type Turn = {world: string; mark: string; round: boolean; color: string};
const SEQUENCE: Turn[] = [{world: 'LION', mark: V('lion-motif.jpg'), round: false, color: '#c9a35f'},
  ...WORLDS.slice(1).map(w => ({world: w.name, mark: V('emblem-' + w.slug + '.jpg'), round: true, color: w.color}))];
const OWN: Record<string, Turn> = Object.fromEntries(WORLDS.map((w, i) => ['/collection/' + w.slug, i === 0 ? SEQUENCE[0] : {world: w.name, mark: V('emblem-' + w.slug + '.jpg'), round: true, color: w.color}]));

const HANGUL = /[\u3131-\uD79D]/;
// Korean is set small in the Apple system face; Latin keeps the display serif
const lines = (s: string) => {
  const body = s.split('\n').map((p, i, a) => <Fragment key={i}>{p}{i < a.length - 1 && <br/>}</Fragment>);
  return HANGUL.test(s) ? <span className="ko">{body}</span> : body;
};

const LangCtx = createContext(false);
function useT() { const en = useContext(LangCtx); return {en, t: (ko: string, eng: string) => en ? eng : ko}; }

/* ---------- building blocks ---------- */
function Cta({href, children}: {href: string; children?: ReactNode}) {
  const {t, en} = useT(); void t; void en;
  return <a className="cta" href={href}><span>{children ?? t('알아보기', 'Discover')}</span><span className="ring" aria-hidden="true">›</span></a>;
}

function Scene({img, eyebrow, title, lede, href, cta, pos = 'center'}: {img: string; eyebrow: string; title: string; lede?: string; href?: string; cta?: string; pos?: string}) {
  const {t, en} = useT(); void t; void en;
  return <section className="scene"><img className="bg" src={V(img)} alt="" style={{objectPosition: pos}}/>
      <div className="inner"><span className="label">{eyebrow}</span><h1>{lines(title)}</h1>{lede && <p className="lede">{lede}</p>}{href && <Cta href={href}>{cta}</Cta>}</div></section>;
}


/* Camera pull-back: opens close on the eyes, scroll draws back to the whole picture. */
function ZoomStage({img, fx, fy, eyebrow, title, lede, href, cta, pos = 'center'}: {img: string; fx: number; fy: number; eyebrow: string; title: string; lede?: string; href?: string; cta?: string; pos?: string}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const draw = () => {
      raf = 0;
      const r = el.getBoundingClientRect(), span = Math.max(1, r.height - window.innerHeight);
      const p = reduce ? 1 : Math.min(1, Math.max(0, -r.top / span));
      const e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      el.style.setProperty('--z', String(Math.exp(Math.log(window.innerWidth < 760 ? 1.8 : 2.4) * (1 - e))));
      el.style.setProperty('--p', String(e));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(draw); };
    el.classList.add('live'); draw();
    window.addEventListener('scroll', on, {passive: true}); window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); if (raf) cancelAnimationFrame(raf); };
  }, []);
  return <section className="zoom-stage" ref={ref} style={{['--fx' as string]: fx + '%', ['--fy' as string]: fy + '%'}}>
    <div className="zs-frame"><img className="zs-img" src={V(img)} alt="" style={{objectPosition: pos}}/><div className="zs-veil"/>
      <div className="zs-hint" aria-hidden="true"><span>Scroll</span><i/></div>
      <div className="inner"><span className="label">{eyebrow}</span><h1>{lines(title)}</h1>{lede && <p className="lede">{lede}</p>}{href && <Cta href={href}>{cta}</Cta>}</div></div></section>;
}


/* ---------- b12 maison chapters ---------- */
const B12: Record<string, {img: string; ko: string; tag: string; pos?: string; body: [string, string]}> = {
  lion: {img: 'b12-lion.jpg', ko: '사자의 기품', tag: 'An inheritance of presence.', body: ['수호자의 고요한 권위에서 출발한 컬렉션. 재단된 형태와 엄선한 가죽, 따뜻한 앰버의 잔향이 과시 없는 힘의 언어가 됩니다.', 'The Lion collection draws on the quiet authority of a guardian. Tailored forms, considered leather and a warm trace of amber make a language of strength without spectacle.']},
  swan: {img: 'b12-swan.jpg', ko: '백조의 우아함', tag: 'Grace, held in stillness.', body: ['흐르는 실루엣과 빛나는 노트, 지니는 사람과 함께 움직이는 오브제. 부드럽지만 분명한 중심을 지닌 우아함입니다.', 'Swan is a study in poise: fluid silhouettes, luminous notes and objects that move with their wearer. An expression of softness with an unmistakable centre.']},
  orca: {img: 'orca-portrait.jpg', ko: '오르카의 깊이', tag: 'A study in depth and contrast.', pos: 'center 55%', body: ['빛과 어둠 사이에 속한 컬렉션. 깨끗한 선이 예상하지 못한 깊이를 만나, 자신만의 물결을 찾는 이를 위한 작품이 됩니다.', 'Orca belongs to the space between light and dark. Clean lines meet unexpected depth in pieces made for those who find their own current.']},
  leopard: {img: 'b12-leopard.jpg', ko: '표범의 본능', tag: 'The beauty of instinct.', body: ['관습이 아닌 본능을 따르는 컬렉션. 손끝에 닿는 표면, 결단력 있는 형태, 온전히 자기만의 에너지.', 'The Leopard collection follows instinct rather than convention. Tactile surfaces, decisive shapes and an energy that is entirely its own.']},
  panther: {img: 'b12-panther.jpg', ko: '검은 표범의 밤', tag: 'Quiet power after dark.', body: ['메종의 밤을 닮은 시그니처. 블랙 래커와 그늘진 꽃, 조각 같은 형태가 은밀하고 확신에 찬 존재감을 만듭니다.', 'A nocturnal signature of the maison. Panther brings together black lacquer, shadowed florals and sculptural forms with an intimate, assured presence.']},
  phoenix: {img: 'phoenix-scene.jpg', ko: '불사조의 비상', tag: 'Born beyond limits.', pos: '74% center', body: ['끝난 자리에서 시작되는 순간의 컬렉션. 불빛을 머금은 오팔과 따뜻한 금속, 다시 날아오르는 형태가 새로운 시작을 노래합니다.', 'Phoenix belongs to the moment after an ending. Fire-lit opal, warm metal and forms that rise again sing of beginnings.']},
};

function B12Hero() {
  const {t} = useT();
  return <section className="b12-hero"><div className="bh-img"/><div className="bh-shade"/>
    <div className="bh-copy"><span className="label">An independent maison · Seoul</span><h2>The art of<br/><em>being singular.</em></h2>
      <p className="bh-text">Objects of presence, shaped by instinct.<br/>{t('서울에서 시작된, 고요한 존재감의 미학.', '')}</p>
      <a className="text-link" href="/collection">Enter the collections <span aria-hidden="true">↗</span></a></div>
    <div className="bh-foot"><span>Music · Art · People · Places</span><span>A More Beautiful Tomorrow</span></div></section>;
}

function Manifesto() {
  const {t} = useT();
  return <section className="b12-manifesto"><span className="label">The BELiOR point of view</span><h2>Not made to be seen.<br/><span>Made to be remembered.</span></h2>
    <p className="muted">{t('첫 숨의 향에서 손에 익은 오브제의 무게까지, BELiOR의 모든 것은 일상을 나만의 것으로 만드는 초대입니다.', 'We believe the most lasting luxury speaks softly. From a first breath of fragrance to the familiar weight of a cherished object, every BELiOR creation is an invitation to make the everyday your own.')}</p>
    <p className="ko-line">{t('가장 오래 남는 아름다움은 조용히 말합니다.', 'The most lasting beauty speaks softly.')}</p></section>;
}

function CollectionGrid() {
  const {t} = useT();
  return <section className="b12-collections"><div className="b12-heading"><div><span className="label">Six expressions, one spirit</span><h2>The collections</h2></div><span className="muted">{t('여섯 가지 상징, 하나의 태도', 'Six symbols, one attitude')}</span></div>
    <div className="b12-grid">{WORLDS.map(w => { const b = B12[w.slug]; return <a className="b12-card" href={'/collection/' + w.slug} key={w.slug} style={{['--world' as string]: w.color}}>
      <img src={V(b.img)} alt={w.name + ' collection'} loading="lazy" style={{objectPosition: b.pos || 'center'}}/><div className="b12-ov"/>
      <div className="b12-cc"><span>{b.ko}</span><h3>{w.name}</h3><p>{b.tag}</p><span className="b12-arrow">Explore ↗</span></div></a>; })}</div></section>;
}

function Listening() {
  const {t} = useT();
  return <section className="b12-split night"><img src={V('b12-vinyl.jpg')} alt={t('어두운 방의 턴테이블', 'A turntable in a dark listening room')} loading="lazy"/>
    <div><span className="label">The listening room · 001</span><h2>Sound for<br/><em>the in-between.</em></h2>
      <p className="muted">{t('낮과 밤 사이, 그 문턱을 위한 느린 선율. 어디에 있든 그 저녁으로 데려다 줄 음악입니다.', 'A slow sequence for the threshold between day and night. A soundtrack imagined in Seoul, made for wherever you are.')}</p>
      <div className="tc-sound"><SoundButton label="Swan Lake · Rehearsal"/></div>
      <a className="text-link" href="/music">Visit the listening room <span aria-hidden="true">↗</span></a></div></section>;
}

function Visit() {
  return <section className="b12-visit"><span className="label">By invitation, always</span><h2>Some things are<br/>better discovered <em>in person.</em></h2>
    <a className="text-link" href="/private">Arrange a private conversation <span aria-hidden="true">↗</span></a></section>;
}

function LogoFilm() {
  const ref = useRef<HTMLVideoElement>(null);
  return <section className="b12-film" aria-label="BELiOR logo film"><video ref={ref} src={V('b12-logo.mp4')} poster={V('b12-logo-poster.jpg')} autoPlay muted playsInline preload="auto" aria-label="BELiOR logo film"/>
    <div className="bf-foot"><button type="button" onClick={() => { const v = ref.current; if (v) { v.currentTime = 0; void v.play().catch(() => {}); } }}>Replay film</button>
      <a className="bf-cue" href="#collections">Scroll<i/></a><span>The Animal Collection</span></div></section>;
}


/* No. 16 poster, typeset over the picture */
function N16Poster() {
  const {t} = useT();
  return <section className="n16-poster-img"><img src={V('no16-poster.jpg')} alt={t('BELiOR — 햇살이 드는 숲속 물가, 말에 오른 아이와 곁을 지키는 아버지. A More Beautiful Tomorrow.', 'BELiOR — a sunlit forest pool, a child on a white horse and her father beside her. A More Beautiful Tomorrow.')} loading="lazy"/></section>;
}

/* Seoul Gala — VIP Presents */
function SeoulGala() {
  const {t} = useT();
  return <section className="b12-split seoul-gala"><img src={V('seoul-gala.jpg')} alt="BELiOR Seoul Gala — VIP Presents" loading="lazy"/>
    <div><span className="label">BELiOR · Seoul Gala</span><h2>VIP<br/><em>Presents.</em></h2>
      <p className="muted">{t('대리석 기둥 사이로 빛이 내려앉고, 보면대의 불빛이 하나씩 켜집니다. 초대받은 이들만을 위한 서울의 저녁.', 'Light settles between marble columns and the music stands glow, one by one. An evening in Seoul, for invited guests only.')}</p>
      <a className="text-link" href="/private">Request an invitation <span aria-hidden="true">↗</span></a></div></section>;
}


/* The worlds BELiOR lets you live: childhood, Paris, Monte-Carlo, Seoul */
function Experience() {
  const {t} = useT();
  const items: [string, string, string, string, string, string][] = [
    ['no16-pool.jpg', 'I · Childhood', t('숲속 물가의 기억', 'A forest pool, remembered'), t('어린 시절, 숲속 물가의 한 장면.', 'A childhood scene by a forest pool.'), '/products/no-16', 'center 40%'],
    ['swan-ballet.jpg', 'II · Paris', t('막이 오르기 직전', 'Before the curtain rises'), t('오페라 극장의 정적, 그리고 백조의 호수.', 'The hush of the opera house, and Swan Lake.'), '/collection/swan', 'center'],
    ['visual-arrival.jpg', 'III · Monte-Carlo', t('불빛 아래 도착하는 밤', 'Arriving under the lights'), t('차 문이 열리고, 저녁이 시작됩니다.', 'A car door opens, and the evening begins.'), '/private', 'center'],
    ['seoul-gala-hall.jpg', 'IV · Seoul', t('초대받은 이들의 갈라', 'A gala, by invitation'), t('대리석 기둥 사이로 켜지는 보면대의 불빛.', 'Music stands glowing between marble columns.'), '/music', 'center'],
  ];
  return <section className="experience"><div className="ex-head"><span className="label">The BELiOR Experience</span>
      <h2>{lines(t('물건이 아니라,', 'Not an object.'))}<br/><em>{lines(t('그 순간을 경험하게 합니다.', 'A moment you live.'))}</em></h2>
      <p className="muted">{t('프랑스와 이탈리아에서 온 현의 소리로 — 어린 시절의 숲에서 파리의 무대, 몬테카를로의 밤, 서울의 갈라까지.', 'In the voice of strings from France and Italy — from a childhood forest to a Paris stage, a Monte-Carlo night and a gala in Seoul.')}</p></div>
    <div className="ex-grid">{items.map(([im, k, h, p, href, pos]) => <a className="ex-card" href={href} key={k}><img src={V(im)} alt="" loading="lazy" style={{objectPosition: pos}}/><div className="ex-ov"/>
      <div className="ex-cc"><span>{k}</span><h3>{lines(h)}</h3><p>{p}</p></div></a>)}</div></section>;
}


/* The Muse of BELiOR — performance film (guests blurred), plays muted until asked */
function MuseFilm({src = 'belior-film-v9.mp4', poster = 'film-poster.jpg', label = 'The Muse of BELiOR', audio = true, vertical = false}: {src?: string; poster?: string; label?: string; audio?: boolean; vertical?: boolean}) {
  const {t} = useT();
  const ref = useRef<HTMLVideoElement>(null), [sound, setSound] = useState(false);
  return <section className={'muse-film' + (vertical ? ' vertical' : '')} aria-label={label}>
    <video ref={ref} src={V(src)} poster={V(poster)} autoPlay muted loop playsInline preload="metadata"/>
    {audio && <button type="button" className="mf-sound" aria-pressed={sound} onClick={() => { const v = ref.current; if (!v) return; v.muted = sound; setSound(!sound); if (!sound) { v.currentTime = 0; void v.play().catch(() => {}); } }}>
      <span aria-hidden="true" className="mf-bars"><i/><i/><i/></span>{sound ? t('소리 끄기', 'Sound off') : t('소리 켜기', 'Sound on')}</button>}</section>;
}

/* ---------- The Lounge world: a private place to rest and play, opened by the house's invitation code ---------- */
const WORLD_SPOTS: [string, number, number][] = [['lion', 17, 19], ['swan', 46, 14], ['orca', 75, 17], ['leopard', 14, 41], ['panther', 85, 36], ['phoenix', 81, 52]];

function LoungeOpening({tier, name}: {tier: Tier | ''; name?: string}) {
  const {t} = useT();
  const circle = tier === 'circle';
  return <section className="lw-open" aria-label="BELiOR Lounge">
    <img className="bg" src={V('lounge-forest.jpg')} alt={t('숲속 물가, 말에 오른 아이와 아버지', 'A forest pool, a child on a horse and her father')}/>
    <div className="lw-open-copy"><p className="label">{circle ? 'BELiOR Lounge · The Circle' : 'BELiOR Lounge · Guest of the House'}</p>
      <h1>{name ? lines(t(`${name} 님,\n잠시, 어린 날로`, `${name},\nfor a while, a child again`)) : lines(t('잠시, 어린 날로', 'For a while, a child again'))}</h1>
      <p className="muted">{t('이곳에서는 직함도 나이도 내려놓으셔도 됩니다. 쉬고, 놀고, 다시 돌아오세요.', 'Here, titles and years can be set down. Rest, play, and come back whenever you need to.')}</p>
      <SoundButton label={t('백조의 호수 듣기', 'Listen · Swan Lake')}/></div></section>;
}

function LoungeWorlds() {
  const {t} = useT();
  const [cur, setCur] = useState<string>('');
  const w = WORLDS.find(x => x.slug === cur);
  return <section className="lw-worlds"><div className="lw-map">
      <img src={V('lounge-world.jpg')} alt={t('BELiOR 여섯 세계의 지도', 'The map of the six BELiOR worlds')}/>
      {WORLD_SPOTS.map(([slug, x, y]) => { const ww = WORLDS.find(z => z.slug === slug)!; return <button type="button" key={slug} className={'lw-spot' + (cur === slug ? ' on' : '')} style={{left: x + '%', top: y + '%', ['--world' as string]: ww.color}} aria-label={ww.name} onClick={() => setCur(cur === slug ? '' : slug)}><i/></button>; })}
    </div>
    <div className="lw-world-copy"><span className="label">The Animal Collection · Six worlds</span>
      {w ? <><h2 style={{color: w.color}}>{w.name}</h2><p className="lw-kw">{w.kw}</p><p className="muted">{t(w.world[0], w.world[1])}</p>
        <a className="text-link" href={'/collection/' + w.slug} style={{color: w.color, borderColor: w.color}}>{t('이 세계로 들어가기', 'Enter this world')} <span aria-hidden="true">→</span></a></>
      : <><h2>{lines(t('여섯 개의 세계', 'Six worlds'))}</h2><p className="muted">{t('지도 위의 동물을 누르면 그 세계가 열립니다.', 'Touch an animal on the map to open its world.')}</p></>}
    </div></section>;
}

/* Game I — the emblem pairs: twelve cards, six worlds */
function EmblemPairs() {
  const {t} = useT();
  const deal = () => WORLDS.flatMap(w => [w.slug, w.slug]).map((s, i) => ({id: i, slug: s, r: Math.random()})).sort((a, b) => a.r - b.r);
  const [cards, setCards] = useState<{id: number; slug: string; r: number}[]>([]);
  const [up, setUp] = useState<number[]>([]), [done, setDone] = useState<string[]>([]), [moves, setMoves] = useState(0), [lock, setLock] = useState(false);
  useEffect(() => { setCards(deal()); }, []);
  const reset = () => { setCards(deal()); setUp([]); setDone([]); setMoves(0); setLock(false); };
  const flip = (c: {id: number; slug: string}) => {
    if (lock || up.includes(c.id) || done.includes(c.slug)) return;
    const next = [...up, c.id];
    setUp(next);
    if (next.length === 2) {
      setMoves(m => m + 1); setLock(true);
      const [a, b] = next.map(id => cards.find(x => x.id === id)!);
      window.setTimeout(() => { if (a.slug === b.slug) setDone(d => [...d, a.slug]); setUp([]); setLock(false); }, a.slug === b.slug ? 500 : 900);
    }
  };
  const won = done.length === WORLDS.length && cards.length > 0;
  return <div className="lw-game"><span className="label">Game I · The Emblem Pairs</span><h3>{lines(t('엠블럼 짝 맞추기', 'The emblem pairs'))}</h3>
    <p className="muted">{t('열두 장의 카드 속에 여섯 세계가 두 장씩 숨어 있습니다.', 'Six worlds, two cards each, hidden among twelve.')}</p>
    <div className="lw-cards">{cards.map(c => { const show = up.includes(c.id) || done.includes(c.slug); const w = WORLDS.find(x => x.slug === c.slug)!;
      return <button type="button" key={c.id} className={'lw-card' + (show ? ' show' : '') + (done.includes(c.slug) ? ' done' : '')} style={{['--world' as string]: w.color}} onClick={() => flip(c)} aria-label={show ? w.name : t('카드', 'Card')}>
        <span className="back"><b>B</b></span><span className="face"><img src={V('emblem-' + c.slug + '.jpg')} alt=""/></span></button>; })}</div>
    <p className="lw-score">{won ? t(`모두 찾으셨습니다 · ${moves}번`, `All six found · ${moves} turns`) : t(`${done.length} / 6 · ${moves}번`, `${done.length} / 6 · ${moves} turns`)}
      <button type="button" className="text-link" onClick={reset}>{t('다시 섞기', 'Shuffle again')}</button></p></div>;
}

/* Game II — The String Stage. Four strings across a lacquered board: touch a string anywhere to sound that note,
   draw along it for a glissando. "Echo" plays a short phrase on the strings; the guest plays it back. */
let lwCtx: AudioContext | null = null, lwVerb: ConvolverNode | null = null;
function lwAudio() {
  const C = (window as unknown as {AudioContext?: typeof AudioContext; webkitAudioContext?: typeof AudioContext});
  const Ctor = C.AudioContext || C.webkitAudioContext; if (!Ctor) return null;
  if (!lwCtx) {
    lwCtx = new Ctor();
    const sr = lwCtx.sampleRate, len = Math.round(sr * 1.8), ir = lwCtx.createBuffer(2, len, sr);   // a small, dark hall
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2) * .5; }
    lwVerb = lwCtx.createConvolver(); lwVerb.buffer = ir; const wet = lwCtx.createGain(); wet.gain.value = .28; lwVerb.connect(wet); wet.connect(lwCtx.destination);
  }
  if (lwCtx.state === 'suspended') void lwCtx.resume();
  return lwCtx;
}
function pluck(freq: number, strength = 1) {
  const ctx = lwAudio(); if (!ctx) return;
  const sr = ctx.sampleRate, len = Math.round(sr * (freq < 200 ? 3.2 : 2.2)), buf = ctx.createBuffer(1, len, sr), d = buf.getChannelData(0);
  const n = Math.round(sr / freq), ring = new Float32Array(n);
  for (let i = 0; i < n; i++) ring[i] = (Math.random() * 2 - 1) * (i < n * .5 ? 1 : .35);   // plucked nearer the bridge: brighter
  const decay = freq < 200 ? .9985 : freq < 400 ? .997 : .995;
  for (let i = 0, p = 0; i < len; i++, p = (p + 1) % n) { const nx = (p + 1) % n; d[i] = ring[p]; ring[p] = (ring[p] * .55 + ring[nx] * .45) * decay; }
  const src = ctx.createBufferSource(), body = ctx.createBiquadFilter(), tone = ctx.createBiquadFilter(), g = ctx.createGain();
  body.type = 'peaking'; body.frequency.value = freq < 200 ? 180 : 420; body.Q.value = 1.4; body.gain.value = 5;   // the instrument's body
  tone.type = 'lowpass'; tone.frequency.value = Math.min(7000, freq * 9); tone.Q.value = .7;
  g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(.42 * strength, ctx.currentTime + .004);
  src.buffer = buf; src.connect(body); body.connect(tone); tone.connect(g); g.connect(ctx.destination); if (lwVerb) g.connect(lwVerb); src.start();
}
const STRINGS: {name: string; base: number; w: number}[] = [{name: 'Vn I', base: 659.25, w: 1.2}, {name: 'Vn II', base: 440, w: 1.6}, {name: 'Va', base: 261.63, w: 2.2}, {name: 'Vc', base: 98, w: 3}];
const POS = 12;                                           // positions along each string (semitones)
const NOTE_NAMES = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
const freqOf = (s: number, p: number) => STRINGS[s].base * Math.pow(2, p / 12);
const nameOf = (s: number, p: number) => { const midi = Math.round(69 + 12 * Math.log2(freqOf(s, p) / 440)); return NOTE_NAMES[midi % 12] + (Math.floor(midi / 12) - 1); };
type Note = [number, number];                             // [string, position]
function StringStage() {
  const {t} = useT();
  const canvas = useRef<HTMLCanvasElement>(null), wrap = useRef<HTMLDivElement>(null);
  const vib = useRef<{s: number; x: number; t0: number}[]>([]), glow = useRef<{s: number; p: number; t0: number}[]>([]);
  const last = useRef<string>(''), phrase = useRef<Note[]>([]), played = useRef<Note[]>([]);
  const [mode, setMode] = useState<'free' | 'listen' | 'repeat' | 'won' | 'miss'>('free'), [round, setRound] = useState(1), [note, setNote] = useState('');
  const geo = () => { const c = canvas.current!; const W = c.clientWidth, H = c.clientHeight; return {W, H, padL: 56, padR: 20, y: (s: number) => H * (.2 + s * .2)}; };
  const sound = (s: number, p: number, strength = 1) => {
    pluck(freqOf(s, p), strength); const {W, padL, padR} = geo();
    vib.current.push({s, x: padL + (p + .5) * (W - padL - padR) / POS, t0: performance.now()}); glow.current.push({s, p, t0: performance.now()});
    setNote(STRINGS[s].name + ' · ' + nameOf(s, p));
  };
  useEffect(() => {                                          // the board
    const c = canvas.current!, ctx = c.getContext('2d')!; let raf = 0;
    const draw = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1), W = c.clientWidth, H = c.clientHeight;
      if (c.width !== W * dpr || c.height !== H * dpr) { c.width = W * dpr; c.height = H * dpr; }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
      const {padL, padR, y} = geo(), now = performance.now(), x0 = padL, x1 = W - padR, span = x1 - x0;
      ctx.fillStyle = 'rgba(201,170,108,.12)'; ctx.fillRect(x0 - 6, H * .08, 2, H * .84);                                     // the nut
      for (let p = 1; p < POS; p++) { ctx.fillStyle = 'rgba(236,228,214,' + ([5, 7].includes(p) ? .16 : .06) + ')'; ctx.fillRect(x0 + p * span / POS, H * .12, 1, H * .76); }
      for (let p = 0; p < POS; p++) if ([2, 4, 6, 9].includes(p)) { ctx.fillStyle = 'rgba(201,170,108,.35)'; ctx.beginPath(); ctx.arc(x0 + (p + .5) * span / POS, H * .5, 2.2, 0, 7); ctx.fill(); }
      glow.current = glow.current.filter(g => now - g.t0 < 900);
      for (const g of glow.current) { const a = 1 - (now - g.t0) / 900, gx = x0 + (g.p + .5) * span / POS, gy = y(g.s); const rg = ctx.createRadialGradient(gx, gy, 0, gx, gy, 26); rg.addColorStop(0, 'rgba(201,170,108,' + .55 * a + ')'); rg.addColorStop(1, 'rgba(201,170,108,0)'); ctx.fillStyle = rg; ctx.fillRect(gx - 26, gy - 26, 52, 52); }
      vib.current = vib.current.filter(v => now - v.t0 < 1600);
      STRINGS.forEach((st, s) => {
        const yy = y(s), vs = vib.current.filter(v => v.s === s);
        ctx.beginPath(); ctx.lineWidth = st.w; ctx.strokeStyle = 'rgba(214,186,128,.95)'; ctx.shadowColor = 'rgba(201,170,108,.5)'; ctx.shadowBlur = vs.length ? 8 : 0;
        for (let x = x0; x <= x1; x += 3) {
          let dy = 0;
          for (const v of vs) { const age = (now - v.t0) / 1000, env = Math.exp(-age * 2.6) * (1 - Math.min(1, Math.abs(x - v.x) / span) * .6); const shape = Math.sin(Math.PI * (x - x0) / span); dy += Math.sin(age * (60 + 20 * s) * 2) * 7 * env * shape; }
          if (x === x0) ctx.moveTo(x, yy + dy); else ctx.lineTo(x, yy + dy);
        }
        ctx.stroke(); ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(236,228,214,.55)'; ctx.font = '500 10px Jost, "Helvetica Neue", Arial, sans-serif'; ctx.textAlign = 'right'; ctx.fillText(st.name.toUpperCase(), x0 - 14, yy + 3.5);
      });
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw); return () => cancelAnimationFrame(raf);
  }, []);
  const hit = (e: RPointerEvent<HTMLCanvasElement>, drag: boolean) => {
    const r = canvas.current!.getBoundingClientRect(), {W, H, padL, padR} = geo(), x = e.clientX - r.left, yy = e.clientY - r.top;
    const s = Math.max(0, Math.min(3, Math.round((yy / H - .2) / .2))); if (Math.abs(yy - H * (.2 + s * .2)) > H * .11) return;
    const p = Math.max(0, Math.min(POS - 1, Math.floor((x - padL) / ((W - padL - padR) / POS))));
    const key = s + ':' + p; if (drag && key === last.current) return; last.current = key;
    sound(s, p, drag ? .7 : 1);
    if (mode === 'repeat') { played.current.push([s, p]); const i = played.current.length - 1, want = phrase.current[i];
      if (!want || want[0] !== s || want[1] !== p) { setMode('miss'); return; }
      if (played.current.length === phrase.current.length) setMode('won'); }
  };
  const listen = () => {
    const len = Math.min(8, 3 + round), ph: Note[] = []; let s = 1 + Math.floor(Math.random() * 2), p = 2 + Math.floor(Math.random() * 5);
    for (let i = 0; i < len; i++) { ph.push([s, p]); const step = [-2, -1, 1, 2][Math.floor(Math.random() * 4)]; p += step; if (p < 0 || p >= POS) { p -= step * 2; } if (Math.random() < .25) s = Math.max(0, Math.min(3, s + (Math.random() < .5 ? -1 : 1))); }
    phrase.current = ph; played.current = []; setMode('listen');
    ph.forEach((n, i) => window.setTimeout(() => sound(n[0], n[1], .9), 420 * i + 300));
    window.setTimeout(() => setMode('repeat'), 420 * len + 500);
  };
  const msg = {free: t('현을 건드리면 소리가 납니다. 따라 긋듯 밀면 음이 이어집니다.', 'Touch a string to sound it; draw along it and the notes run together.'),
    listen: t('듣고 계세요…', 'Listen…'), repeat: t('이제 같은 소절을 연주해 보세요.', 'Now play the same phrase back.'),
    won: t(`같은 소절입니다. ${round}번째 소절 완성.`, `That is the phrase. Round ${round} complete.`), miss: t('조금 달랐습니다. 다시 들어 볼까요?', 'Not quite. Shall we hear it again?')}[mode];
  return <div className="lw-game lw-stage"><span className="label">Game II · The String Stage</span><h3>{lines(t('현의 무대', 'The string stage'))}</h3>
    <p className="muted">{msg}</p>
    <div className="lw-board" ref={wrap}><canvas ref={canvas} onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); hit(e, false); }} onPointerMove={e => { if (e.buttons) hit(e, true); }} onPointerUp={() => { last.current = ''; }} aria-label={t('네 개의 현', 'Four strings')}/>
      <span className="lw-note" aria-live="polite">{note}</span></div>
    <p className="lw-score">
      {mode === 'won' ? <button type="button" className="text-link" onClick={() => { setRound(r => r + 1); listen(); }}>{t('다음 소절', 'Next phrase')}</button>
        : mode === 'miss' ? <button type="button" className="text-link" onClick={() => { played.current = []; setMode('listen'); phrase.current.forEach((n, i) => window.setTimeout(() => sound(n[0], n[1], .9), 420 * i + 300)); window.setTimeout(() => setMode('repeat'), 420 * phrase.current.length + 500); }}>{t('다시 듣기', 'Hear it again')}</button>
        : <button type="button" className="text-link" disabled={mode === 'listen'} onClick={listen}>{mode === 'repeat' ? t('다시 듣기', 'Hear it again') : t('한 소절 듣고 따라 하기', 'Echo · listen and play back')}</button>}
      {mode !== 'free' && <button type="button" className="text-link" onClick={() => { setMode('free'); setRound(1); }}>{t('자유 연주', 'Free play')}</button>}</p></div>;
}

function LoungeGames() {
  const {t} = useT();
  return <section className="lw-games"><div className="lw-games-head"><span className="label">The Playroom</span><h2>{lines(t('놀이방', 'The playroom'))}</h2>
      <p className="muted">{t('잠깐이면 됩니다. 한 판, 한 소절.', 'A minute is enough. One round, one phrase.')}</p></div>
    <div className="lw-games-grid"><EmblemPairs/><StringStage/></div></section>;
}

/* Car diffuser — Tchaikovsky No.16, holiday edition (copy as written by the house) */
function CarDiffuser() {
  const {t} = useT();
  return <section className="b12-split night car-diff"><img src={V('car-diffuser.jpg')} alt={t('차량 송풍구에 꽂은 BELiOR 디퓨저, 나무 엠블럼', 'BELiOR car diffuser on a dashboard vent, tree emblem')} loading="lazy"/>
    <div><span className="label">Parfum · Holiday Limited Edition 🎄</span><h2>{lines(t('당신만을 위한\n차이코프스키 No.16 향', 'Tchaikovsky No.16,\nfor you alone'))}</h2>
      <p className="muted">{t('샌달우드와 크리스마스 한정 에디션. 37개의 향료와 영국·프랑스에서 들여온 엄선한 향료로, 내 차 안을 고급지고 힐링 가득한 연말 순간으로.', 'Sandalwood, in a Christmas limited edition. Thirty-seven notes, with materials chosen from England and France, turning the inside of your car into a composed, restful moment of the year’s end.')}</p>
      <a className="text-link" href="/private">{t('기프트 문의', 'Gift enquiries')} <span aria-hidden="true">↗</span></a></div></section>;
}

/* ---------- Inquiry, as on the September site ----------
   Enquiries are delivered by Web3Forms with the house's public form key (the same key the
   September site used). If sending fails, the form opens the visitor's mail app instead. */
const W3F_KEY = '4dfff3da-feed-4b5a-ad01-cbf8c38da971';
const KAKAO = 'https://pf.kakao.com/_UAxfxiX';
/* Phone alert topic the house set up on the September site (ntfy) — every enquiry also rings the phone. */
const PHONE_TOPIC = 'twottiva-2518344b98686d6f';
type Field = {name: string; label: [string, string]; type: 'select' | 'text' | 'date' | 'tel' | 'email' | 'textarea'; options?: [string, string][]; ph?: [string, string]; req?: boolean; full?: boolean};
const CONTACT_FIELDS: Field[] = [
  {name: 'contact_name', label: ['담당자 성함', 'Your name'], type: 'text'},
  {name: 'contact_phone', label: ['연락처', 'Phone'], type: 'tel', req: true},
  {name: 'contact_email', label: ['이메일', 'Email'], type: 'email', full: true},
];
const PERF_FIELDS: Field[] = [
  {name: 'type', label: ['행사 유형', 'Occasion'], type: 'select', options: [['기업 행사', 'Corporate event'], ['호텔 연회 · 갈라 디너', 'Hotel banquet · gala dinner'], ['브랜드 행사', 'Brand event'], ['프라이빗 디너', 'Private dinner'], ['웨딩', 'Wedding'], ['기타', 'Other']]},
  {name: 'guests', label: ['예상 인원', 'Guests'], type: 'select', options: [['30명 이하', 'Up to 30'], ['30–100명', '30–100'], ['100–300명', '100–300'], ['300명 이상', '300+'], ['미정', 'Not yet known']]},
  {name: 'date', label: ['희망 날짜', 'Date'], type: 'date'},
  {name: 'ensemble', label: ['선호 편성', 'Ensemble'], type: 'select', options: [['솔로', 'Solo'], ['듀오', 'Duo'], ['트리오', 'Trio'], ['현악 4중주', 'String quartet'], ['확장 편성 (피아노 · 하프 등)', 'Extended (piano, harp…)'], ['상담 후 결정', 'To discuss']]},
  {name: 'venue', label: ['행사 장소', 'Venue'], type: 'text'},
  {name: 'mood', label: ['프로그램 분위기', 'Programme mood'], type: 'select', options: [['우아한 클래식', 'Elegant classical'], ['영화 OST · 크로스오버', 'Film & crossover'], ['로맨틱', 'Romantic'], ['웅장 · 격식', 'Grand & formal'], ['상담 후 결정', 'To discuss']]},
  {name: 'city', label: ['도시', 'City'], type: 'select', options: [['서울', 'Seoul'], ['경기 · 인천', 'Gyeonggi · Incheon'], ['그 외 지역', 'Elsewhere']]},
  {name: 'time', label: ['시간', 'Time'], type: 'text', ph: ['예: 18:30 리셉션 / 19:00 본행사', 'e.g. 18:30 reception / 19:00 dinner']},
  ...CONTACT_FIELDS,
  {name: 'message', label: ['추가 요청 사항', 'Further requests'], type: 'textarea', full: true, ph: ['세부 내용이나 특별히 원하시는 사항을 자유롭게 적어 주세요.', 'Anything else you would like us to know.']},
];
const TOPICS: [string, string][] = [['프라이빗 이벤트', 'Private event'], ['음악이 있는 저녁', 'An evening with music'], ['기프팅 · 퍼스널라이즈', 'Gifting & personalisation'], ['콘텐츠 제작 · 영상 · 기획', 'Content — film & planning'], ['오브제', 'Objects'], ['기타', 'Other']];
const EXPERIENCES: [string, string][] = [['음악', 'Music'], ['공간 연출', 'Spatial direction'], ['기프트 · 오브제', 'Gifts & objects'], ['영상', 'Film']];

async function sendInquiry(subject: string, title: string, body: string[], d: Record<string, string>) {
  const src = ' · 유입 : ' + (new URLSearchParams(window.location.search).get('utm_source') || 'direct') + ' / ' + (document.referrer || '-');
  fetch('https://ntfy.sh', {method: 'POST', body: JSON.stringify({topic: PHONE_TOPIC, title: 'BELiOR ' + subject + ' / ' + (title || '신규') + ' / ' + (d.date || '일정 미정'), message: body.join('\n') + '\n\n' + src, priority: 5, tags: ['sparkles']})}).catch(() => {});
  if (!W3F_KEY) throw Error('no key');
  const r = await fetch('https://api.web3forms.com/submit', {method: 'POST', headers: {'Content-Type': 'application/json', Accept: 'application/json'},
    body: JSON.stringify({access_key: W3F_KEY, subject: '[BELiOR ' + subject + '] ' + title + ' / ' + (d.date || '일정 미정'), from_name: 'BELiOR 홈페이지 ' + subject,
      name: d.contact_name || title, email: d.contact_email || MAIL2, message: body.join('\n')})});
  let j: {success?: boolean} | null = null; try { j = await r.json(); } catch {}
  if (!r.ok || (j && j.success === false)) throw Error('HTTP ' + r.status);
}

function Consent({on, set, items}: {on: boolean; set: (v: boolean) => void; items: [string, string]}) {
  const {t} = useT();
  return <div className="pf-consent"><label className="pf-check"><input type="checkbox" checked={on} onChange={e => set(e.target.checked)}/>{t('[필수] 개인정보 수집·이용에 동의합니다.', '[Required] I agree to the collection and use of personal information.')}</label>
    <dl><div><dt>{t('수집 항목', 'Collected')}</dt><dd>{t(...items)}</dd></div><div><dt>{t('이용 목적', 'Purpose')}</dt><dd>{t('문의 확인 및 답변', 'Replying to your enquiry')}</dd></div>
      <div><dt>{t('보유 기간', 'Retention')}</dt><dd>{t('문의 처리 후 1년 (관계 법령에 따라 보존이 필요한 경우 해당 기간). 메일 전송 서비스(Web3Forms, 미국 서버)에는 최대 3년 보관될 수 있습니다.', 'One year after handling (longer where law requires). The mail relay (Web3Forms, US servers) may keep it up to three years.')}</dd></div></dl>
    <p className="pf-note">{t('동의를 거부하실 수 있으나, 거부하시면 문의 접수가 어렵습니다.', 'You may decline, but we cannot then receive your enquiry.')}</p></div>;
}

function useSend() {
  const {t} = useT();
  const [state, setState] = useState<'' | 'sending' | 'done' | 'error'>(''), [msg, setMsg] = useState('');
  async function run(ok: boolean, why: string, job: () => Promise<void>, fallback: () => string) {
    if (!ok) { setMsg(why); return false; }
    setMsg(''); setState('sending');
    try { await job(); setState('done'); setMsg(t('문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.', 'Thank you. The house will be in touch.')); return true; }
    catch { setState('error'); setMsg(t('메일 앱이 열리면 보내기를 눌러 주세요. 열리지 않으면 ' + MAIL + ' 으로 보내 주세요.', 'Press send in your mail app. If it does not open, write to ' + MAIL + '.')); window.location.href = fallback(); return false; }
  }
  return {state, msg, run};
}

function FieldInput({f, value, set}: {f: Field; value: string; set: (v: string) => void}) {
  const {t} = useT();
  const ph = f.ph ? t(...f.ph) : undefined;
  return <label className={f.full ? 'full' : ''}><span>{t(...f.label)}{f.req && <span className="req">*</span>}</span>
    {f.type === 'select' ? <select value={value} onChange={e => set(e.target.value)}><option value="">{t('선택해 주세요', 'Please choose')}</option>{(f.options || []).map(([k, e]) => <option key={k} value={k}>{t(k, e)}</option>)}</select>
      : f.type === 'textarea' ? <textarea rows={5} value={value} placeholder={ph} onChange={e => set(e.target.value)}/>
      : <input type={f.type} value={value} placeholder={ph} required={f.req} onChange={e => set(e.target.value)}/>}</label>;
}

const mailto = (subject: string, body: string[]) => 'mailto:' + MAIL + '?cc=' + MAIL2 + '&subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body.join('\n'));

function PerformanceInquiry() {
  const {t} = useT();
  const [d, setD] = useState<Record<string, string>>({}), [ok, setOk] = useState(false);
  const {state, msg, run} = useSend();
  const set = (k: string) => (v: string) => setD(x => ({...x, [k]: v}));
  const body = () => PERF_FIELDS.map(f => '■ ' + f.label[0] + ' : ' + (d[f.name] || '-'));
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fine = await run(!!d.contact_phone && ok, !d.contact_phone ? t('연락처를 입력해 주세요.', 'Please add a phone number.') : t('개인정보 수집·이용에 동의해 주세요.', 'Please accept the personal information notice.'),
      () => sendInquiry('공연 문의', d.type || '공연', body(), d), () => mailto('[BELiOR 공연 문의] ' + (d.type || ''), body()));
    if (fine) { setD({}); setOk(false); }
  }
  return <div className="pf">
    <section className="pi-hero"><img src={V('pi-hero.jpg')} alt=""/><div className="pi-hero-in"><img className="sym" src={V('symbol-gold.png')} alt=""/>
      <h1>PERFORMANCE<br/>INQUIRY</h1><p className="ko-sub">공연 문의</p><span className="rule"/><p className="tag">MUSIC CREATES A MORE BEAUTIFUL TOMORROW</p></div></section>
    <section className="pi-intro"><p className="side-label">BELiOR<br/>PERFORMANCE<br/>INQUIRY</p>
      <div className="pi-intro-copy"><h2>{lines(t('특별한 순간을 위한,\n가장 아름다운 음악의 경험.', 'For the moments that matter,\nthe most beautiful music.'))}</h2>
        <p>{t('BELiOR는 공간과 사람, 그리고 이야기에 맞는 최적의 공연을 제안합니다. 프라이빗 만찬부터 기업 행사, 브랜드 이벤트까지 — 예술이 머무는 순간을 함께 만들어갑니다.', 'BELiOR proposes the right performance for the place, the people and the story — from private dinners to corporate and brand evenings.')}</p>
        <p>{t('연주는 ', 'Performed by ')}<a href="/music/artists">{t('TWOTTIVA 현악앙상블', 'TWOTTIVA string ensemble')}</a>{t('이 맡습니다.', '.')}</p></div>
      <div className="pi-intro-media"><p className="tag">TAILORED MUSIC<br/>FOR MEANINGFUL MOMENTS.</p><img src={V('pi-intro.jpg')} alt="" loading="lazy"/></div></section>
    <section className="pi-form-sec" id="brief"><div className="pi-form-media"><img src={V('pi-side.jpg')} alt="" loading="lazy"/>
        <div><p className="big">A MORE<br/>BEAUTIFUL<br/>TOMORROW</p><span className="rule"/><p>{t('음악은 단순한 연주가 아닌, 사람과 공간을 잇는 특별한 경험입니다. BELiOR는 고객의 철학과 목적에 맞춰 세심하게 기획된 공연을 제안합니다.', 'Music is not only playing — it joins people and place. BELiOR proposes performances planned carefully around your purpose.')}</p></div></div>
      <form className="pf-card" onSubmit={submit} noValidate><h2>INQUIRY FORM</h2><p className="pf-intro">{t('아래 내용을 알려주시면, 담당자가 확인 후 맞춤형 제안을 드립니다.', 'Share the details below and we will return with a tailored proposal.')}</p>
        <div className="pf-grid">{PERF_FIELDS.map(f => <FieldInput key={f.name} f={f} value={d[f.name] || ''} set={set(f.name)}/>)}</div>
        <Consent on={ok} set={setOk} items={['담당자 성함, 연락처, 이메일, 행사 정보', 'Name, phone, email and event details']}/>
        <button className="pf-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t('보내는 중…', 'Sending…') : 'SUBMIT INQUIRY →'}</button>
        {msg && <p className="pf-status" role="status">{msg}</p>}</form></section>
    <section className="pi-process"><p className="eyebrow">CONSULTATION PROCESS</p><p className="sub">{t('세심한 상담을 통해, 가장 완벽한 순간을 준비합니다.', 'Careful consultation, for the right moment.')}</p>
      <ol>{[['INQUIRY', '공연 문의', 'Inquiry', '행사 개요를 전달해 주세요.', 'Send us the outline of the occasion.'], ['CONSULTATION', '상담 및 기획', 'Consultation', '담당자가 세부 내용을 바탕으로 맞춤 제안을 드립니다.', 'We return with a proposal built on the details.'], ['PROPOSAL', '제안 및 확정', 'Proposal', '공연 구성과 세부 사항을 확정하고, 최상의 무대를 준비합니다.', 'Programme and details are confirmed, and the stage prepared.']].map(([en, k1, e1, k2, e2], i) =>
        <li key={en}><span className="no">0{i + 1}</span><b>{en}</b><span className="ko">{t(k1, e1)}</span><p>{t(k2, e2)}</p></li>)}</ol></section>
    <section className="pi-ours"><div className="lead"><h2>OUR<br/>PERFORMANCE</h2><p>{t('공간과 목적에 맞춘, 다양한 형태의 공연을 제안합니다.', 'Performances shaped to the place and the purpose.')}</p></div>
      {[['stage-quartet.jpg', 'PRIVATE DINNER', '프라이빗 만찬', 'Private dinner', '62% center'], ['stage-ensemble.jpg', 'CORPORATE EVENT', '기업 행사', 'Corporate', 'center'], ['eve-quartet.jpg', 'BRAND EVENT', '브랜드 이벤트', 'Brand', '88% center'], ['bu-violinist.jpg', 'SPECIAL OCCASION', '특별한 순간', 'Special occasions', 'center 30%']].map(([im, en, k, e, pos]) =>
        <figure key={en}><img src={V(im)} alt="" loading="lazy" style={{objectPosition: pos}}/><figcaption><b>{en}</b><span>{t(k, e)}</span></figcaption></figure>)}</section>
  </div>;
}

function InviteContact() {
  const {t} = useT();
  const [d, setD] = useState<Record<string, string>>({}), [exp, setExp] = useState<string[]>([]), [ok, setOk] = useState(false), [open, setOpen] = useState('appointment');
  const {state, msg, run} = useSend();
  const set = (k: string) => (v: string) => setD(x => ({...x, [k]: v}));
  const body = () => ['■ 문의 주제 : ' + (d.topic || '-'), '■ 행사명 : ' + (d.event_name || '-'), '■ 담당자 : ' + (d.contact_name || '-'), '■ 연락처 : ' + (d.contact_phone || '-'), '■ 이메일 : ' + (d.contact_email || '-'),
    '■ 희망 일자 : ' + (d.date || '-') + ' ' + (d.time || ''), '■ 장소 : ' + (d.venue || '-'), '■ 예상 인원 : ' + (d.guests || '-'), '■ 원하는 경험 : ' + (exp.join(', ') || '-'), '■ 내용 : ' + (d.message || '-')];
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const need = !d.event_name || !d.contact_phone;
    const fine = await run(!need && ok, need ? t('행사명과 연락처를 입력해 주세요.', 'Please add the occasion and a phone number.') : t('개인정보 수집·이용에 동의해 주세요.', 'Please accept the personal information notice.'),
      () => sendInquiry(d.topic || '문의', d.event_name, body(), d), () => mailto('[BELiOR 문의] ' + (d.event_name || ''), body()));
    if (fine) { setD({}); setExp([]); setOk(false); }
  }
  const services: [string, [string, string], [string, string], string[], string?][] = [
    ['appointment', ['프라이빗 상담', 'Private appointment'], ['원하시는 저녁과 오브제에 관해 하우스와 직접 이야기를 나누실 수 있습니다.', 'Speak with the house directly about the evening, or the piece, you have in mind.'], ['ct-appt1.jpg', 'ct-appt2.jpg']],
    ['personal', ['퍼스널라이즈', 'Personalisation'], ['로고 각인과 메시지 카드로, 건네는 분의 마음이 오브제에 남도록 준비합니다.', 'Engraving and message cards, so that the giver remains with the piece.'], ['ct-pers1.jpg', 'ct-pers2.jpg'], '/objects'],
    ['gifting', ['기프팅', 'Gifting'], ['총회와 갈라디너, 연말의 감사 인사까지. 수량과 예산에 맞춰 하우스의 오브제로 구성합니다.', 'Assemblies, gala dinners and year-end thanks — composed from the house’s objects to quantity and budget.'], ['ct-gift1.jpg', 'ct-gift2.jpg'], '/objects'],
    ['evening', ['음악이 있는 저녁', 'The evening'], ['자리의 흐름을 먼저 읽고, 그 위에 음악과 공간을 함께 구성합니다.', 'We read the flow of the room first, then compose music and place upon it.'], ['pi-hero.jpg', 'ct-eve2.jpg'], '/music'],
    ['content', ['콘텐츠 제작', 'Content production'], ['무대 배경 영상과 영상 편집, 프로그램 그래픽까지 그 저녁의 세계관에 맞춰 기획하고 제작합니다.', 'Stage visuals, film editing and programme graphics, made for the world of each evening.'], ['op-onsite.jpg', 'visual-piano.jpg'], '/atelier'],
  ];
  return <div className="pf ct2">
    <div className="ct2-side">
      <p className="eyebrow">BY INVITATION</p><h1>{lines(t('초대를 청하다', 'Request an invitation'))}</h1>
      <p className="lead">{t('BELiOR의 저녁은 초대로 열립니다. 함께하고 싶은 저녁의 이야기를 남겨 주시면, 하우스가 직접 회신드립니다.', 'Evenings at BELiOR open by invitation. Tell us about the evening you have in mind, and the house will reply in person.')}</p>
      <div className="ct-services"><p className="eyebrow">{t('BELiOR 서비스 경험', 'The BELiOR services')}</p>
        {services.map(([id, title, text, imgs, link]) => <div className={'acc' + (open === id ? ' on' : '')} key={id}>
          <button type="button" onClick={() => setOpen(open === id ? '' : id)} aria-expanded={open === id}>{lines(t(...title))}<span aria-hidden="true">{open === id ? '−' : '+'}</span></button>
          {open === id && <div className="acc-body"><div className="acc-imgs">{imgs.map(im => <img key={im} src={V(im)} alt="" loading="lazy"/>)}</div>
            <div className="acc-foot"><p>{t(...text)}</p>{link ? <a className="text-link" href={link}>{t('자세히 보기', 'Learn more')}</a> : <a className="text-link" href={KAKAO} target="_blank" rel="noopener noreferrer">{t('카카오톡으로 상담하기', 'Speak with us on KakaoTalk')}</a>}</div></div>}</div>)}</div>
      <div className="ct2-direct"><p className="eyebrow">KAKAOTALK CHANNEL</p>
        <a className="ct2-kakao" href={KAKAO + '/chat'} target="_blank" rel="noopener noreferrer">{t('카카오톡으로 상담하기', 'Chat on KakaoTalk')} <span aria-hidden="true">↗</span></a>
        <a href={'mailto:' + MAIL}>{MAIL}</a><a href={'mailto:' + MAIL2}>{MAIL2}</a></div>
    </div>
    <form className="ct2-form" onSubmit={submit} noValidate><p className="eyebrow">ENQUIRY</p><h2>{lines(t('문의 남기기', 'Leave an enquiry'))}</h2>
      <p className="pf-intro">{t('행사의 목적과 원하시는 저녁을 들려주세요. 정해지지 않은 항목은 비워 두셔도 됩니다.', 'Tell us the purpose and the evening you imagine. Leave blank anything not yet decided.')}</p>
      <div className="pf-grid">
        <FieldInput f={{name: 'topic', label: ['문의 주제', 'Subject'], type: 'select', options: TOPICS, full: true}} value={d.topic || ''} set={set('topic')}/>
        <FieldInput f={{name: 'event_name', label: ['행사명', 'Occasion'], type: 'text', req: true, full: true, ph: ['예: 창립 기념 갈라디너', 'e.g. Anniversary gala dinner']}} value={d.event_name || ''} set={set('event_name')}/>
        {CONTACT_FIELDS.map(f => <FieldInput key={f.name} f={f} value={d[f.name] || ''} set={set(f.name)}/>)}
        <FieldInput f={{name: 'date', label: ['희망 일자', 'Date'], type: 'date'}} value={d.date || ''} set={set('date')}/>
        <FieldInput f={{name: 'time', label: ['시간', 'Time'], type: 'text', ph: ['예: 19:00', 'e.g. 19:00']}} value={d.time || ''} set={set('time')}/>
        <FieldInput f={{name: 'venue', label: ['장소', 'Venue'], type: 'text'}} value={d.venue || ''} set={set('venue')}/>
        <FieldInput f={{name: 'guests', label: ['예상 인원', 'Guests'], type: 'text'}} value={d.guests || ''} set={set('guests')}/>
        <fieldset className="full"><legend>{t('원하시는 경험', 'The experience you have in mind')}</legend><div className="pf-chips">{EXPERIENCES.map(([k, e]) => <label key={k} className={'pf-chip' + (exp.includes(k) ? ' on' : '')}>
          <input type="checkbox" checked={exp.includes(k)} onChange={() => setExp(x => x.includes(k) ? x.filter(y => y !== k) : [...x, k])}/>{t(k, e)}</label>)}</div></fieldset>
        <FieldInput f={{name: 'message', label: ['행사 목적과 원하시는 분위기', 'Purpose and atmosphere'], type: 'textarea', full: true}} value={d.message || ''} set={set('message')}/></div>
      <Consent on={ok} set={setOk} items={['담당자 성함, 연락처, 이메일, 문의 내용', 'Name, phone, email and enquiry']}/>
      <button className="pf-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? t('보내는 중…', 'Sending…') : t('초대 요청 보내기', 'Send the request')}</button>
      {msg && <p className="pf-status" role="status">{msg}</p>}</form>
  </div>;
}


/* BELiOR performance on YouTube (privacy-enhanced embed, loads when scrolled near) */
const YT_ID = 'FU6bRZKOc18';
function YouTubeFilm({eyebrow = 'BELiOR · Live Performance'}: {eyebrow?: string}) {
  return <section className="yt-film"><span className="label">{eyebrow}</span><YTBackground id={YT_ID} poster="eve-quartet.jpg" className="framed"/></section>;
}


function HousePins() {
  const {t} = useT();
  return <section className="b12-split pins"><img src={V('house-pins.jpg')} alt={t('BELiOR 하우스 핀 — 바이올린, 백조, 백합, 샴페인, 린, 백조의 호수, 하트, 이름 핀, 고양이', 'BELiOR house pins — violin, swan, lily, champagne, Rin, Swan Lake, heart, name plate, cat')} loading="lazy"/>
    <div><span className="label">Entry 02 · Objects of the House</span><h2>{lines(t('현과 사람,\n장소와 이야기.', 'Strings, people,\nplaces, stories.'))}</h2>
      <p className="muted">{t('핀과 참으로 옮긴 하우스의 조각들. 무대 위의 것만이 아니라, 그 사이의 일상까지 하나의 세계로 둡니다.', 'Pieces of the house, carried onto pins and charms — not only what is on stage, but the everyday between.')}</p>
      <a className="text-link" href="/private">{t('핀 제작 문의', 'Enquire about pins')} <span aria-hidden="true">↗</span></a></div></section>;
}


/* Parfum: one scent for each animal world, given to guests as a gift */
function GiftScents() {
  const {t} = useT();
  return <section className="section night gift-scents"><Head eyebrow="Parfum · The Animal Collection" title={t('동물 컬렉션의 향, 선물로 전합니다', 'A scent for each world, given as a gift')}
      text={t('BELiOR는 여섯 동물의 세계마다 하나의 향을 짓고, 함께한 분께 선물로 전합니다. 일부 향은 라운지에서만 만나실 수 있습니다.', 'BELiOR composes one scent for each of the six animal worlds and gives it to guests of the house. Some are shown only in the Lounge.')}/>
    <div className="gs-grid">{WORLDS.map(w => <a className="gs" href={'/collection/' + w.slug} key={w.slug} style={{['--world' as string]: w.color}}>
      <div className="ph"><img src={V('emblem-' + w.slug + '.jpg')} alt={w.name + ' emblem'} loading="lazy"/></div>
      <span className="label">{w.mat}</span><h3>{w.name}</h3><p>{w.notes || w.kw}</p></a>)}</div>
    <div className="gs-cta"><a className="text-link" href="/lounge">{t('라운지 입장', 'Enter the Lounge')} <span aria-hidden="true">↗</span></a><a className="text-link" href="/private">{t('기프트 문의', 'Gift enquiries')} <span aria-hidden="true">↗</span></a></div></section>;
}

/* BELiOR Lounge — opened with the invitation code given at BELiOR evenings (same code as the September site) */
const LOUNGE_HASH = 'b8578b21fb9edf916958e86478078a36395a8cb4fc35eda5848356adc88f3a70';
/* Lounge tiers. A guest arrives by the private link the house sent them (/lounge?k=…); the tier is read
   from the link, remembered on their device, and the lounge opens without anything to type.
   guest  — clients of a performance or contract.   circle — the house's own circle (the invitation code also opens this). */
type Tier = 'guest' | 'circle';
/* Guest desk (Cloudflare Worker, belior-sites/lounge-api). Empty until the house deploys it; the lounge then falls back to the tier links. */
const LOUNGE_API = '';
type Guest = {k: string; name: string; tier: Tier};
async function verifyGuest(k: string): Promise<Guest | null> {
  if (!LOUNGE_API) return null;
  try { const r = await fetch(LOUNGE_API + '/verify', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({k})}); if (!r.ok) return null; const d = await r.json() as {ok?: boolean; name?: string; tier?: Tier}; return d.ok && d.name && d.tier ? {k, name: d.name, tier: d.tier} : null; } catch { return null; }
}
const TIER_HASH: Record<string, Tier> = {
  '519ff6faf7fc99c02d1dbd5a5cd568f45d3618210c35b11c22ca9599918d9328': 'guest',
  '97c06dde72525f2a3cc438dc78ef83e70246688b638823d93a47c059c0e8dd72': 'circle',
};
const sha = async (v: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(v)))).map(b => b.toString(16).padStart(2, '0')).join('');
const LOUNGE_ITEMS: [string, [string, string], string, [string, string]][] = [
  ['lg-card.jpg', ['레더 카드 홀더', 'Leather Card Holder'], 'Noir · Champagne trim', ['가죽', 'Leather']],
  ['lg-wallet.jpg', ['레더 플랩 월렛', 'Leather Flap Wallet'], 'Noir · Gold clasp', ['가죽', 'Leather']],
  ['lg-sleeve.jpg', ['레더 랩톱 슬리브', 'Leather Laptop Sleeve'], 'Noir · Gold edge', ['가죽', 'Leather']],
  ['prod-bag-hd.jpg', ['B 모노그램 백', 'B Monogram Bag'], 'Ivory · Noir', ['가죽', 'Leather']],
  ['ct-gift1.jpg', ['메종 기프트 세트', 'Maison Gift Set'], 'Card holder · Parfum', ['기프트', 'Gifts']],
  ['lg-parfum.jpg', ['BELiOR 퍼퓸', 'BELiOR Parfum'], 'Holiday 2026', ['기프트', 'Gifts']],
];
function Lounge() {
  const {t} = useT();
  const [tier, setTier] = useState<Tier | ''>(''), [name, setName] = useState(''), [opening, setOpening] = useState(false), [err, setErr] = useState(false), [checked, setChecked] = useState(false);
  const open = tier !== '';
  const admit = (tr: Tier, slow: boolean, guest?: Guest) => {
    try { localStorage.setItem('belior-salon', tr); if (guest) localStorage.setItem('belior-guest', JSON.stringify(guest)); } catch {}
    setErr(false); if (guest) setName(guest.name);
    if (!slow) { setTier(tr); return; } setOpening(true); setTimeout(() => { setTier(tr); window.scrollTo(0, 0); }, 1400);
  };
  useEffect(() => {
    (async () => {
      try {
        const k = new URLSearchParams(location.search).get('k');
        if (k) {
          history.replaceState(null, '', location.pathname);
          const g = await verifyGuest(k.trim());                       // a personal link from the guest desk
          if (g) { admit(g.tier, true, g); setChecked(true); return; }
          const tr = TIER_HASH[await sha(k.trim())];                   // or one of the house's tier links
          if (tr) { admit(tr, true); setChecked(true); return; }
        }
        const remembered = localStorage.getItem('belior-guest');
        if (remembered) {                                               // a known guest: ask the desk again, so a removed link closes
          const prev = JSON.parse(remembered) as Guest, g = LOUNGE_API ? await verifyGuest(prev.k) : prev;
          if (g) { setName(g.name); setTier(g.tier); setChecked(true); return; }
          localStorage.removeItem('belior-guest'); localStorage.removeItem('belior-salon');
        }
        const saved = localStorage.getItem('belior-salon');
        if (saved === '1' || saved === 'circle') setTier('circle'); else if (saved === 'guest') setTier('guest');
      } catch {}
      setChecked(true);
    })();
  }, []);
  async function enter(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = String(new FormData(e.currentTarget).get('code') || '').trim(), v = raw.toUpperCase().replace(/\s/g, '');
    const g = await verifyGuest(raw), h = await sha(v), tr = g ? g.tier : h === LOUNGE_HASH ? 'circle' : TIER_HASH[await sha(raw)];
    if (tr) admit(tr, true, g || undefined); else { setErr(false); requestAnimationFrame(() => setErr(true)); }
  }
  if (!checked) return <section className="lounge-gate" aria-busy="true"/>;
  if (!open) return <section className={'lounge-gate' + (opening ? ' opening' : '')}>
    <div className="lg-seal" aria-hidden="true"><span className="l">B</span><span className="r">B</span></div>
    <p className="label">BELiOR Lounge · By Invitation</p><h1>{lines(t('초대받은 분만 들어오실 수 있습니다.', 'By invitation only.'))}</h1>
    <p className="muted">{t('라운지는 BELiOR의 저녁을 함께한 분들을 위한 공간입니다. 전해 받으신 초대 코드를 입력해 주세요.', 'The Lounge is kept for guests of BELiOR evenings. Please enter the invitation code you were given.')}</p>
    <form className={'lg-form' + (err ? ' err' : '')} onSubmit={enter}><input name="code" type="password" autoComplete="off" placeholder={t('초대 코드', 'Invitation code')} aria-label={t('초대 코드', 'Invitation code')}/><button type="submit">ENTER</button>
      <p className="lg-err" role="alert">{err ? t('코드가 맞지 않습니다.', 'That code is not recognised.') : ''}</p></form>
    <a className="text-link" href="/private">{t('초대를 청하기', 'Request an invitation')} <span aria-hidden="true">→</span></a></section>;
  return <>
    <LoungeOpening tier={tier} name={name}/><LoungeWorlds/><LoungeGames/>{tier === 'circle' && <CarDiffuser/>}
    {tier === 'circle' && <><section className="section"><Head eyebrow="Lounge Objects" title={t('라운지 오브제', 'Lounge objects')}/>
      <div className="lg-grid">{LOUNGE_ITEMS.map(([im, name, line, cat]) => <figure key={im}><div className="ph"><img src={V(im)} alt={t(...name)} loading="lazy"/></div>
        <figcaption><span className="label">{t(...cat)}</span><h3>{lines(t(...name))}</h3><p>{line}</p><a className="text-link" href="/private">{t('문의하기', 'Enquire')}</a></figcaption></figure>)}</div></section></>}
  </>;
}

/* Enquiry, always one tap away (bottom right, like the Porsche chat button) */
function EnquiryDock() {
  const {t} = useT();
  const [open, setOpen] = useState(false);
  return <div className={'dock' + (open ? ' open' : '')}>
    {open && <div className="dock-panel" role="dialog" aria-label={t('문의', 'Enquiries')}>
      <a href="/music/inquiry">{t('공연 문의', 'Performance enquiry')}</a><a href="/private#enquiry">{t('초대 · 기프트 문의', 'Invitation & gifts')}</a>
      <a href="https://pf.kakao.com/_UAxfxiX/chat" target="_blank" rel="noopener noreferrer">{t('카카오톡 상담', 'KakaoTalk')}</a><a href={'mailto:' + MAIL}>{MAIL}</a></div>}
    <button type="button" className="dock-btn" aria-expanded={open} aria-label={t('문의하기', 'Enquire')} onClick={() => setOpen(o => !o)}>
      {open ? <span aria-hidden="true">×</span> : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>}</button></div>;
}

/* Background film from YouTube, dressed as the house's own: no player chrome, still image until it plays */
function YTBackground({id, poster, className = ''}: {id: string; poster: string; className?: string}) {
  const {t} = useT();
  const ref = useRef<HTMLIFrameElement>(null), [on, setOn] = useState(false), [sound, setSound] = useState(false), [paused, setPaused] = useState(false);
  const cmd = (func: string, args: unknown[] = []) => ref.current?.contentWindow?.postMessage(JSON.stringify({event: 'command', func, args}), '*');
  useEffect(() => {
    let timer = 0;
    const msg = (e: MessageEvent) => {
      if (typeof e.data !== 'string' || !/youtube/.test(e.origin) || e.source !== ref.current?.contentWindow) return;
      try { const d = JSON.parse(e.data); if (d.info && d.info.playerState === 1 && !timer) timer = window.setTimeout(() => setOn(true), 2600); } catch {}
    };
    window.addEventListener('message', msg);
    return () => { window.removeEventListener('message', msg); clearTimeout(timer); };
  }, []);
  return <div className={'ytbg ' + className + (on ? ' on' : '')}>
    <img className="ytbg-still" src={V(poster)} alt=""/>
    <div className="ytbg-frame" aria-hidden="true"><iframe ref={ref} title="BELiOR film" tabIndex={-1} allow="autoplay; encrypted-media" loading="lazy"
      onLoad={() => ref.current?.contentWindow?.postMessage(JSON.stringify({event: 'listening', id}), '*')}
      src={'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&mute=1&loop=1&playlist=' + id + '&controls=0&showinfo=0&playsinline=1&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0&cc_load_policy=0&enablejsapi=1'}/></div>
    <div className="ytbg-ctrl">
      <button type="button" className="mf-sound" aria-pressed={sound} onClick={() => { if (sound) cmd('mute'); else { cmd('unMute'); cmd('seekTo', [0, true]); cmd('playVideo'); setPaused(false); } setSound(!sound); }}>
        <span aria-hidden="true" className="mf-bars"><i/><i/><i/></span>{sound ? t('소리 끄기', 'Sound off') : t('소리 켜기', 'Sound on')}</button>
      <button type="button" className="ytbg-pause" aria-label={paused ? t('영상 재생', 'Play film') : t('영상 일시정지', 'Pause film')} onClick={() => { cmd(paused ? 'playVideo' : 'pauseVideo'); setPaused(!paused); }}><span aria-hidden="true">{paused ? '▶' : 'II'}</span></button></div></div>;
}

/* No. 01 — The Tchaikovsky Edition */
function Tchaikovsky() {
  const {t} = useT();
  return <section className="tchai"><div className="tc-film"><video src={V('tchaikovsky.mp4')} poster={V('tchaikovsky-poster.jpg')} muted loop playsInline autoPlay preload="metadata" aria-label="The Tchaikovsky Edition"/></div>
    <div className="tc-copy"><span className="label">Parfum · N° 01</span><h2>The Tchaikovsky<br/>Edition</h2>
      <p className="tc-line">Fir in the snow. Warm resin. A last note of musk — the moment the curtain falls on Swan Lake.</p>
      <p className="muted">{t('눈 덮인 전나무, 따뜻한 레진, 그리고 마지막 머스크. 백조의 호수에 막이 내리는 순간을 향으로 남깁니다.', 'Composed by BELiOR, Seoul.')}</p>
      <div className="tc-sound"><SoundButton label="Swan Lake · Rehearsal"/></div>
      <a className="more" href="/products/parfum">{t('PARFUM 보기', 'Parfum')}</a></div></section>;
}

/* The closing chord */
function Finale() {
  const {t} = useT();
  return <section className="finale"><p className="fn-a">The music ends.</p><p className="fn-b">The moonlight stays.</p>
    <p className="fn-ko">{lines(t('음악은 끝나도, 달빛은 남습니다.', ''))}</p>
    <div className="fn-team"><span className="label">TWOTTIVA × BELiOR</span><p className="fn-c">One team, one enquiry.</p><p className="muted">{t('하나의 팀, 하나의 창구로 문의를 받습니다.', 'One team. One point of contact.')}</p><Cta href="/private">{t('문의하기', 'Enquire')}</Cta></div></section>;
}

/* Swan Lake rehearsal, one shared player with a slow fade-in */
let swanAudio: HTMLAudioElement | null = null;
function swan() {
  if (!swanAudio) { swanAudio = new Audio('/belior/v3/swan-lake-film.mp4'); swanAudio.loop = true; swanAudio.preload = 'none'; }
  return swanAudio;
}
function SoundButton({label}: {label: string}) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const a = swan(), sync = () => setOn(!a.paused);
    a.addEventListener('play', sync); a.addEventListener('pause', sync); sync();
    return () => { a.removeEventListener('play', sync); a.removeEventListener('pause', sync); };
  }, []);
  const toggle = () => {
    const a = swan();
    if (!a.paused) { a.pause(); return; }
    document.querySelectorAll('video').forEach(v => { if (!v.muted) v.pause(); });
    a.volume = 0; void a.play().then(() => { const id = window.setInterval(() => { a.volume = Math.min(.85, a.volume + .05); if (a.volume >= .85) window.clearInterval(id); }, 120); }).catch(() => {});
  };
  return <button type="button" className={'sound' + (on ? ' on' : '')} onClick={toggle} aria-pressed={on}>
    <span className="bars" aria-hidden="true"><i/><i/><i/><i/></span><span>{label}</span></button>;
}

function Band({img, eyebrow, title, text, href, cta, pos = 'center'}: {img: string; eyebrow: string; title: string; text: string; href: string; cta?: string; pos?: string}) {
  const {t, en} = useT(); void t; void en;
  return <section className="band"><img className="bg" src={V(img)} alt="" loading="lazy" style={{objectPosition: pos}}/>
      <div className="inner"><span className="label">{eyebrow}</span><h2>{lines(title)}</h2><p className="lede">{text}</p><Cta href={href}>{cta}</Cta></div></section>;
}

function Door({href, img, eyebrow, title, text, pos = 'center'}: {href: string; img: string; eyebrow: string; title: string; text: string; pos?: string}) {
  const {t, en} = useT(); void t; void en;
  return <a className="door" href={href}><div className="ph"><img src={V(img)} alt="" loading="lazy" style={{objectPosition: pos}}/></div><span className="label">{eyebrow}</span><h3>{lines(title)}</h3><p>{text}</p><span className="more">Explore</span></a>;
}

function Head({eyebrow, title, text}: {eyebrow: string; title: string; text?: string}) {
  const {t, en} = useT(); void t; void en;
  return <div className="section-head"><span className="label">{eyebrow}</span><h2>{lines(title)}</h2>{text && <p className="muted">{text}</p>}</div>;
}

function Emblems({items, five}: {items: World[]; five?: boolean}) {
  const {t, en} = useT(); void t; void en;
  return <div className={'emblems' + (five ? ' five' : '')}>{items.map(w => <a className="emblem" href={'/collection/' + w.slug} key={w.slug}><img src={V('emblem-' + w.slug + '.jpg')} alt={w.name + ' emblem'}/><span className="label">{w.name}</span></a>)}</div>;

}

/* ---------- the original maison, kept whole ---------- */
const CHAPTERS_LIST: [string, string, string, string, string, string][] = [
    ['/music', 'o-mk-home-music.jpg', 'MUSIC & EXPERIENCE', '음악은 저녁을 완성하는 것이 아니라,\n저녁을 작곡합니다.', 'Music does not finish the evening.\nIt composes it.', 'Explore Music'],
    ['/atelier', 'o-mk-home-atelier.jpg', 'ATELIER', '시간이 만들어내는 아름다움,\n섬세한 손끝에서 시작됩니다.', 'Beauty made by time\nbegins at the fingertips.', 'Explore Atelier'],
    ['/objects', 'o-mk-home-objects.jpg', 'OBJECTS', '오래도록 곁에 남는 오브제,\n일상의 순간을 특별하게.', 'Objects that stay with you,\nmaking the everyday special.', 'Explore Objects'],
    ['/private', 'o-mk-home-evening.jpg', 'THE EVENING', '특별한 저녁을 위한\n프라이빗한 경험을 제안합니다.', 'Private experiences\nfor an exceptional evening.', 'Explore Private Experiences'],
    ['/journal', 'o-mk-home-journal.jpg', 'JOURNAL', '예술, 사람, 공간의 이야기를\n기록합니다.', 'Stories of art,\npeople and places.', 'Explore Journal'],
];

/* ---------- from the house's own proposal: who we are, how an evening is built ---------- */
function TwoHouses() {
  const {t} = useT();
  return <section className="section two-houses"><Head eyebrow="Two Houses, One Evening" title={t('연주가 필요하시면 TWOTTIVA,\n저녁 전체의 음악이 필요하시면 BELiOR.', 'For a performance, TWOTTIVA.\nFor the music of a whole evening, BELiOR.')}/>
    <div className="th-grid">
      <div className="th-card"><span className="label">Role — Live Performance</span><h3>TWOTTIVA</h3><p className="th-tag">String Duo &amp; Ensemble · Where Love Becomes Music.</p>
        <p className="muted">{t('바이올린과 첼로, 두 대의 현악(TWO)으로 시작한 연주 브랜드. 정해진 시간, 준비된 프로그램, 흔들림 없는 연주.', 'A performance brand that began with two strings, violin and cello. Set times, prepared programmes, unwavering performance.')}</p></div>
      <div className="th-card"><span className="label">Role — Event Direction</span><h3>BELiOR</h3><p className="th-tag">Private Event Direction · Music · Art · People · Places</p>
        <p className="muted">{t('저녁의 각 순간에 음악이 맡을 역할을 설계합니다. 아티스트 캐스팅부터 브랜드 모먼트, 피날레까지.', 'We design the role music plays in every moment of the evening, from casting to the brand moment and the finale.')}</p></div>
    </div></section>;
}

function VisualTeam() {
  const {t} = useT();
  return <section className="visual" id="visual">
    <figure className="vs-main"><img src={V('visual-piano.jpg')} alt={t('샹들리에 아래 그랜드 피아노를 연주하는 여혜린', 'Hyerin Yeo at the grand piano beneath a chandelier')} loading="lazy"/></figure>
    <div className="vs-copy"><span className="label">BELiOR Visual</span><h2>{lines(t('모든 장면은\n우리가 직접 만듭니다.', 'Every scene,\nmade by the house.'))}</h2>
      <p className="muted">{t('BELiOR는 연주하고, 연출하고, 촬영합니다. 무대 위의 연주자가 곧 하우스의 얼굴이 되고, 그 저녁의 이미지가 됩니다.', 'BELiOR performs, directs and films. The artist on stage becomes the face of the house and the image of the evening.')}</p>
      <p className="vs-name">Hyerin Yeo — {t('바이올리니스트 · 피아노 · 모델 · 디렉터', 'Violinist · Piano · Model · Director')}</p></div>
    <figure className="vs-side"><img src={V('bu-violinist.jpg')} alt={t('잔디 위에서 바이올린을 든 여혜린', 'Hyerin Yeo with her violin on the lawn')} loading="lazy"/></figure>
  </section>;
}

function Founder() {
  const {t} = useT();
  const rows: [string, string, string][] = [
    ['기획 · 현장 총괄', 'Planning & direction', t('한국여성공인회계사회 제31회 정기총회 · 회장 이·취임식 — 엘리에나호텔, 2026', 'Korea Women CPA Association, 31st General Meeting & Inauguration — L’Eliena Hotel, 2026')],
    ['행사', 'Event', t('국회의원 내빈행사 · 사단법인', 'National Assembly guest event · Incorporated association')],
    ['연주', 'Performance', t('KBS Hall 한·체코 수교 35주년 기념음악회', 'KBS Hall, Korea–Czech 35th Anniversary Concert')],
    ['현장 진행', 'On site', t('식순이 앞당겨졌을 때 곡 해설 멘트로 행사 흐름을 직접 이음', 'Kept the evening flowing with spoken programme notes when the running order moved')],
    ['운영', 'Operation', t('사전 합주 · 앙상블 디렉팅 · 담당자 창구 단일화', 'Rehearsal, ensemble direction and a single point of contact')],
  ];
  return <section className="founder"><figure><img src={V('founder.jpg')} alt={t('바이올린을 든 여혜린 대표', 'Founder Hyerin Yeo with her violin')} loading="lazy"/></figure>
    <div className="fd-copy"><span className="label">Founder · Artistic Director · Chief Director</span><h2>{lines(t('여혜린', 'Hyerin Yeo'))}<small>Hyerin Yeo</small></h2>
      <p className="fd-role">{t('BELiOR · TWOTTIVA 대표 | 바이올리니스트 · 작곡 · 편곡', 'Founder of BELiOR & TWOTTIVA | Violinist · Composer · Arranger')}</p>
      <p className="muted">{t('갈라디너의 흐름을 이해하고, 행사에 차질이 없도록 사전 리허설과 현장을 총괄합니다.', 'She reads the flow of a gala dinner and leads rehearsal and the evening itself, so nothing falters.')}</p>
      <dl className="fd-list">{rows.map(([ko, en, v]) => <div key={ko}><dt>{t(ko, en)}</dt><dd>{v}</dd></div>)}</dl></div>
  </section>;
}

const PRINCIPALS: {im: string; ko: string; en: string; inst: string; role: [string, string]; edu: [string, string][]; stage: [string, string][]}[] = [
  {im: 'sa-hyerin.jpg', ko: '여혜린', en: 'Hyerin Yeo', inst: 'Violin I', role: ['바이올리니스트 · 예술감독 · 편곡', 'Violinist · Artistic Director · Arranger'],
    edu: [['TWOTTIVA 프로그램 기획 및 공연 총괄', 'Programme and performance director, TWOTTIVA']],
    stage: [['한국여성공인회계사회 이·취임식 총괄', 'Directed the Korea Women CPA Association inauguration'], ['국회의원 내빈행사 · 사단법인', 'National Assembly guest event · Incorporated association'], ['KBS홀 한·체코 수교 35주년 기념음악회', 'KBS Hall, Korea–Czech 35th anniversary concert']]},
  {im: 'sa-samuel.jpg', ko: '김사무엘', en: 'Samuel Kim', inst: 'Violin II', role: ['바이올리니스트', 'Violinist'],
    edu: [['한국예술종합학교 출신', 'Korea National University of Arts']],
    stage: [['청와대 영빈관 대통령 초청 만찬', 'Presidential state dinner, Cheong Wa Dae guest house'], ['2022 대통령 취임식 만찬 · 서울신라호텔', '2022 presidential inauguration dinner, The Shilla Seoul'], ['하나은행', 'Hana Bank']]},
  {im: 'sa-dohyun.jpg', ko: '김도현', en: 'Dohyun Kim', inst: 'Viola', role: ['비올리스트', 'Violist'],
    edu: [['한국예술종합학교 출신', 'Korea National University of Arts'], ['심포니송 단원', 'Member, Symphony S.O.N.G']],
    stage: [['삼성화재 초청 콘서트 · 시그니엘 서울', 'Samsung Fire & Marine concert · Signiel Seoul'], ['롯데호텔', 'Lotte Hotel'], ['2023 Carnegie Hall', '2023 Carnegie Hall']]},
  {im: 'sa-yohan.jpg', ko: '김요한', en: 'Yohan Kim', inst: 'Cello', role: ['첼리스트 · 아트 디렉터', 'Cellist · Art Director'],
    edu: [['미국 메네스 음악대학 · 신시내티 음악대학 출신', 'Mannes School of Music · Cincinnati College-Conservatory of Music'], ['국내외 주요 공연장 및 오케스트라 수석 연주', 'Principal chair with orchestras in Korea and abroad']],
    stage: [['주한 이탈리아대사관 초청 연주', 'Invited performance, Embassy of Italy in Korea'], ['CCM Philharmonia 수석', 'Principal, CCM Philharmonia']]},
];
const COLLECTIVE: [string, string, string, string, [string, string][]][] = [
  ['ac-hsb.jpg', '한솔빈', 'Solbin Han', 'Violin', [['이화여자대학교 출신', 'Ewha Womans University'], ['기업·호텔행사 현악앙상블 다수 활동', 'Corporate and hotel ensembles']]],
  ['ac-lsi.jpg', '이수인', 'Suin Lee', 'Viola', [['이화여자대학교 출신', 'Ewha Womans University'], ['실내악·행사 연주 다수 활동', 'Chamber music and events']]],
  ['ac-wks.jpg', '우경식', 'Kyungsik Woo', 'Viola', [['경희대학교 대학원 출신', 'Kyung Hee University, graduate school'], ['국립심포니콘서트오케스트라 단원', 'Member, National Symphony Concert Orchestra']]],
  ['ac-kse.jpg', '김송은', 'Songeun Kim', 'Cello', [['독일 국립 Augsburg, LMC 석사과정 재학', 'Master’s study, Leopold Mozart College, Augsburg']]],
  ['ac-jjh.jpg', '정자현', 'Jahyun Jung', 'Harp', [['한국예술종합학교 출신', 'Korea National University of Arts'], ['국내 주요 행사 하프 협연 활동', 'Harp at major events in Korea']]],
  ['ac-psj.jpg', '박승준', 'Seungjun Park', 'Timpani', [['서울대학교 출신', 'Seoul National University'], ['국내 오케스트라 및 행사 타악기 연주', 'Percussion with orchestras and events']]],
];

function Artists() {
  const {t} = useT();
  return <section className="section artists" id="artists"><Head eyebrow="The Artists · Signature Quartet" title="The Artists on Stage" text={t('BELiOR 무대에 서는 TWOTTIVA 시그니처 연주진입니다.', 'The TWOTTIVA signature quartet on the BELiOR stage.')}/>
    <div className="ar-grid">{PRINCIPALS.map(a => <figure className="ar" key={a.ko}><div className="ph"><img src={V(a.im)} alt={t(a.ko, a.en)} loading="lazy" style={{objectPosition: 'center 12%'}}/></div>
      <figcaption><span className="label">{a.inst}</span><h3>{lines(t(a.ko, a.en))}</h3><p className="ar-role">{t(...a.role)}</p>
        <ul className="ar-edu">{a.edu.map(([k, e]) => <li key={k}>{t(k, e)}</li>)}</ul>
        <ul>{a.stage.map(([k, e]) => <li key={k}>{t(k, e)}</li>)}</ul></figcaption></figure>)}</div>
    <div className="collective"><span className="label">Artist Collective</span><h3>{lines(t('함께 무대에 서는 연주자', 'Artists who join the stage'))}</h3>
      <p className="muted">{t('행사의 규모와 편성에 맞춰 함께하는 TWOTTIVA 협업 연주진입니다.', 'TWOTTIVA collaborators, joining as the occasion and ensemble require.')}</p>
      <div className="col-grid">{COLLECTIVE.map(([im, ko, en, inst, cv]) => <figure key={ko}><div className="ph"><img src={V(im)} alt={t(ko, en)} loading="lazy"/></div>
        <figcaption><span className="label">{inst}</span><h4>{lines(t(ko, en))}</h4><ul>{cv.map(([k, e]) => <li key={k}>{t(k, e)}</li>)}</ul></figcaption></figure>)}</div></div>
    <div className="quality"><span className="label">Quality Standard</span>
      <ol>{[['PROGRAMMING', '행사 목적과 분위기에 맞춘 프로그램 구성', 'A programme shaped to the purpose and mood'], ['DIRECTION', '사전 악보 및 연주 방향 공유', 'Scores and direction shared in advance'], ['REHEARSAL', '편성별 리허설과 음악 디렉팅', 'Rehearsal and musical direction for each ensemble'], ['SYSTEM CHECK', '큐시트·동선·음향 사전 확인', 'Cue sheet, movement and sound checked beforehand'], ['MANAGEMENT', '행사 당일 현장 진행 및 타임라인 관리', 'On-the-day running and timeline']].map(([en, ko, e], k) =>
        <li key={en}><span className="q-no">{String(k + 1).padStart(2, '0')}</span><div><b>{en}</b><p>{t(ko, e)}</p></div></li>)}</ol></div>
    <p className="muted small">{t('공연 이력은 TWOTTIVA와 각 연주자의 수행 경력입니다.', 'Credits are TWOTTIVA’s and each artist’s own performance history.')}</p></section>;
}

/* Home: the four principals, one tap from their full profiles */
function ArtistsStrip() {
  const {t} = useT();
  return <section className="artists-strip"><div className="as-head"><span className="label">The Artists</span><h2>{lines(t('무대에 서는 사람들', 'The people on stage'))}</h2>
      <a className="text-link" href="/music/artists">{t('연주진 전체 보기', 'Meet all the artists')} <span aria-hidden="true">↗</span></a></div>
    <div className="as-grid">{PRINCIPALS.map(a => <a href="/music/artists" key={a.ko}><div className="ph"><img src={V(a.im)} alt={t(a.ko, a.en)} loading="lazy"/></div>
      <span className="label">{a.inst}</span><h3>{lines(t(a.ko, a.en))}</h3><p>{t(...a.edu[0])}</p></a>)}</div></section>;
}

function GuestJourney() {
  const {t} = useT();
  const steps: [string, string, string, string][] = [
    ['Arrival', 'Daylight', t('게스트 도착 · 연주 준비 완료', 'Guests arrive · the ensemble is ready'), ''],
    ['Opening', 'Sunset', t('음악은 공간을 엽니다', 'Music opens the room'), 'Debussy + Harp'],
    ['Aperitivo', 'Sunset', t('음악은 대화를 돕습니다', 'Music carries the conversation'), 'Vivaldi'],
    ['Dinner', 'Dusk', t('음악은 공기를 채웁니다', 'Music fills the air'), 'Cinema'],
    ['Brand Moment', 'Dusk', t('음악은 시선을 모읍니다', 'Music gathers every gaze'), 'Bespoke Cue'],
    ['Dessert', 'Night', t('음악이 처음으로 주인공이 됩니다', 'Music takes the lead for the first time'), 'Morricone'],
    ['Farewell', 'Night', t('음악은 기억을 남깁니다', 'Music leaves the memory'), 'Soft Closing'],
  ];
  return <section className="section night journey"><Head eyebrow="The Guest Journey" title="Daylight → Sunset → Dusk → Night" text={t('저녁 전체를 한 곡처럼 — 도입에서 피날레까지 음악의 역할을 설계합니다.', 'The whole evening as one piece of music, from the first note to the finale.')}/>
    <ol className="gj">{steps.map(([n, time, d, cue], i) => <li key={n}><span className="gj-time">{time}</span><span className="gj-no">0{i + 1}</span><h3>{n}</h3><p>{d}</p>{cue && <span className="gj-cue">{cue}</span>}</li>)}</ol></section>;
}

function SymphonicAtelier() {
  const {t} = useT();
  return <section className="symphonic">
    <figure className="sy-a"><img src={V('sym-violin.jpg')} alt={t('바이올린 현과 활의 클로즈업', 'Violin strings and bow, close up')} loading="lazy"/></figure>
    <div className="sy-copy"><span className="label">BELiOR · Signature Ensemble</span><h2>The Symphonic Atelier</h2>
      <p className="muted">{t('현악의 골드 위에 하프와 클라리넷이 빛을 더하고, 타악과 일렉기타가 대담함을 완성합니다.', 'Harp and clarinet add light to the gold of the strings; percussion and electric guitar bring the daring cut.')}</p>
      <ol className="sy-list">
        <li><span className="label">Strings Quartet &amp; Ensemble + Contrabass</span><h3>The Golden Structure</h3><p>{t('정교함과 깊은 울림 — 저녁을 받치는 단단한 베이스', 'Precision and depth, the frame that holds the evening')}</p></li>
        <li><span className="label">Harp &amp; Clarinet</span><h3>The Gemstone Colour</h3><p>{t('하프의 투명한 아르페지오와 클라리넷의 음색', 'The clear arpeggios of the harp and the colour of the clarinet')}</p></li>
        <li><span className="label">Electric Guitar &amp; Drums · Timpani</span><h3>The Audacious Cut</h3><p>{t('클래식의 틀을 깨는 선율과 비트', 'Melody and beat that break the classical frame')}</p></li>
      </ol>
      <p className="small muted">{t('그리고 이 저녁에만 들을 수 있는 단 하나의 편곡을 준비합니다.', 'And one arrangement written only for that evening.')}</p></div>
    <figure className="sy-b"><img src={V('sym-timpani.jpg')} alt={t('구리 팀파니와 말렛', 'Copper timpani and mallets')} loading="lazy"/></figure>
  </section>;
}

function BeyondLogo() {
  const {t} = useT();
  const items: [string, string][] = [
    ['Signature Arrangement', t('VIP만을 위한 단 하나의 편곡 — 이 저녁에서만 들을 수 있는 곡', 'One arrangement for the guests, heard only that evening')],
    ['Jewellery on Stage', t('연주자가 컬렉션을 착용하고 연주 (브랜드 협의 시)', 'Artists perform wearing the collection (by agreement)')],
    ['Signature Light', t('클라이맥스에서 조명을 브랜드 시그니처 컬러로 전환 (조명팀과 협의)', 'Lighting turns to the brand colour at the climax (with the lighting team)')],
    ['Programme Card', t('곡 해설과 브랜드 헤리티지 스토리를 담은 프로그램 카드', 'A programme card with notes on the music and the brand’s heritage')],
    ['Artist Moment', t('공연 후 VVIP와 연주자의 짧은 인사와 기념 촬영', 'A short greeting and photograph with the artists after the performance')],
  ];
  return <section className="section beyond"><Head eyebrow="BELiOR · Brand Experience" title="Beyond the Logo." text={t('로고를 크게 거는 대신, 브랜드가 저녁 속에 스며들게 합니다.', 'Instead of a large logo, the brand is woven into the evening.')}/>
    <div className="rows">{items.map(([h, d]) => <div className="row" key={h}><h3>{h}</h3><p>{d}</p><span/></div>)}</div></section>;
}

function Operation() {
  const {t} = useT();
  const steps: [string, string][] = [
    ['Consultation & Program', t('행사 목적과 게스트에 맞춘 선곡, 순간별 음악 설계', 'Repertoire and moment-by-moment design for your purpose and guests')],
    ['Casting & Rehearsal', t('행사에 맞는 아티스트 캐스팅, 18시간 사전 합주', 'Artists cast for the event, 18 hours of rehearsal')],
    ['Cue Sheet & Technical', t('국·영문 큐시트, 동선·음향·무대 배치 사전 확정', 'Korean and English cue sheets; movement, sound and staging set in advance')],
    ['On-site Direction', t('담당자와 실시간 소통, 식순 변경에 즉시 대응', 'Live contact with your team, immediate response to any change')],
  ];
  return <section className="section night"><Head eyebrow="BELiOR · All-in-One Operation" title="From the First Call to the Final Cue." text={t('음악 큐와 음악 운영은 BELiOR가 책임집니다. 담당자는 창구 하나만 두시면 됩니다.', 'BELiOR takes charge of every music cue and its running. You keep a single point of contact.')}/>
    <div className="steps">{steps.map(([n, d]) => <div className="step" key={n}><h3>{n}</h3><p>{d}</p></div>)}</div></section>;
}

function MaisonHero() {
  const {t} = useT();
  return <section className="maison-hero"><img className="bg" src={V('o-hero-salon.jpg')} alt={t('BELiOR 메종 살롱 공간', 'The BELiOR maison salon')}/>
    <div className="mh-inner">
      <div className="mh-main"><span className="label">BELiOR · Maison de l’Art de Vivre</span>
        <h2>{lines(t('음악에서 시작된\n하나의 하우스.', 'A house that began\nin music.'))}</h2>
        <p className="mh-heritage">{lines('A heritage\nfor a brighter\ntomorrow')}</p>
        <div className="mh-actions"><a className="btn-line" href="/collection">{t('컬렉션 살펴보기', 'Explore the collection')}</a><a className="btn-line" href="/music">{t('연주 보기', 'See the performances')}</a><a className="more" href="/maison">DISCOVER BELiOR →</a></div></div>
      <ul className="mh-words" aria-label="Art · People · Places and beauty"><li>Art</li><li>People</li><li>Places</li><li>and beauty</li></ul>
    </div>
    <p className="mh-foot label">A More Beautiful Tomorrow</p>
  </section>;
}

function SwanGallery() {
  const {t} = useT();
  return <div className="gallery-chapter">
    <a className="gc-img" href="/collection/swan"><img src="/belior/ballet.webp" alt="BELiOR Gallery Chapter 02 Swan Lake" loading="lazy"/></a>
    <div className="gc-txt"><span className="label">BELiOR Gallery · Chapter 02</span><h3>SWAN LAKE</h3><p className="gc-work">Tchaikovsky — Swan Lake, Op. 20</p>
      <p className="gc-quote">We do not illustrate music. We give it form.</p><p className="muted">음악을 묘사하지 않습니다. 음악에 형태를 부여합니다.</p>
      <div className="gc-actions"><SoundButton label={t('Swan Lake 리허설 듣기', 'Listen — Swan Lake rehearsal')}/><a className="more" href="/collection/swan">{t('챕터 들어가기', 'Enter the chapter')} →</a></div></div>
  </div>;
}

function MaisonIntro() {
  const {t, en} = useT(); void t; void en;
  return <section className="section maison-intro" id="maison">
    <div className="mi-head"><span className="label">BELiOR · Maison de l’Art de Vivre</span>
      <h2 className="mi-title">{lines(t('예술이 머무는 저녁,\n더 아름다운 순간의 소리를 만듭니다.', 'An evening where art lingers,\nwe make the sound of a more beautiful moment.'))}</h2>
      <p className="muted">{t('BELiOR는 음악, 공간, 오브제, 향, 그리고 사람을 통해 일상의 순간들을 더 깊고 아름답게 만드는 라이프스타일 하우스입니다.', 'BELiOR is a lifestyle house that deepens everyday moments through music, space, objects, scent and people.')}</p></div>
    <div className="marquee" aria-hidden="true"><div>MUSIC · ART · PEOPLE · PLACES · OBJECTS · A MORE BEAUTIFUL TOMORROW · MUSIC · ART · PEOPLE · PLACES · OBJECTS · A MORE BEAUTIFUL TOMORROW ·</div></div>
    <SwanGallery/>
    <div className="chapters">{CHAPTERS_LIST.map(([h, im, name, ko, eng, c], i) =>
      <a className="chapter" href={h} key={name}><span className="num">0{i + 1}</span><div className="ch-img"><img src={V(im)} alt="" loading="lazy"/></div>
        <div className="ch-txt"><h3>{name}</h3><p>{lines(t(ko, eng))}</p><span className="more">{c} →</span></div></a>)}</div>
  </section>;
}

function TheHouse() {
  const {t, en} = useT(); void t; void en;
  return <section className="section night" id="house"><div className="spread">
    <figure className="c-6"><img src={V('o-gala-ensemble.jpg')} alt={t('연회장에서 연주하는 앙상블', 'Ensemble performing at a banquet')} loading="lazy"/><figcaption>BELiOR · Private Event Direction · with TWOTTIVA</figcaption></figure>
    <div className="copy c-6"><span className="label">The House</span><h3>{lines(t('무대에서 시작된 하우스', 'A house born on stage'))}</h3>
      <p className="muted">{t('실제 무대에서 태어난 BELiOR는 라이브 음악을 프라이빗 이벤트 연출과 예술 기획, 오브제, 그리고 하루 저녁보다 오래 남는 시각 언어로 넓혀 갑니다.', 'Born on real stages, BELiOR extends live music into private event direction, art planning, objects and a visual language that outlasts a single evening.')}</p>
      <h3 className="sub">{lines(t('무대는 TWOTTIVA가 연주합니다', 'The stage is played by TWOTTIVA'))}</h3>
      <p className="muted">{t('BELiOR의 음악은 서울에서 활동하는 현악앙상블 TWOTTIVA(뚜띠바 현악앙상블)가 연주합니다. 2021년부터 호텔·기업·공식 행사 무대에서 쌓아 온 TWOTTIVA의 연주 위에, BELiOR가 공간과 오브제와 연출을 더합니다.', 'BELiOR’s music is performed by TWOTTIVA string ensemble, based in Seoul. On the performances TWOTTIVA has built since 2021 at hotel, corporate and official events, BELiOR adds space, objects and direction.')}</p>
      <ul className="history"><li>{t('KBS홀 한·체코 수교 35주년 기념음악회', 'KBS Hall, Korea–Czech 35th Anniversary Concert')}</li><li>{t('한국여성공인회계사회 정기총회 및 회장 이·취임식', 'Korea Women CPA Association, General Meeting & Presidential Inauguration')}</li><li>{t('호텔 연회 · 기업행사 · VIP 리셉션', 'Hotel banquets · Corporate events · VIP receptions')}</li><li>Brand Gala Dinner Show · Seoul</li></ul>
      <p className="muted small">{t('공연 이력은 TWOTTIVA와 각 연주자의 이력입니다.', 'Performance history belongs to TWOTTIVA and its musicians.')}</p>
      <div className="links"><a className="more" href="https://twottiva.com" target="_blank" rel="noopener">TWOTTIVA ↗</a><a className="more" href="https://www.youtube.com/watch?v=3aVe656YBUc" target="_blank" rel="noopener">YouTube ↗</a></div></div>
  </div></section>;
}

function TheEvening() {
  const {t, en} = useT(); void t; void en;
  return <section className="section"><Head eyebrow="BELiOR Music · The Evening" title={t('음악이 머무는 저녁', 'An evening where music stays')}/>
    <div className="evening whole"><figure className="ev-photo"><img src={V('eve-quartet.jpg')} alt={t('행사장 앞 야외에서 연주하는 현악 4중주', 'A string quartet performing outdoors at the venue')} loading="lazy" width={1260} height={698}/></figure>
      <div className="ev-cards">
        <a className="ev-card" href="/music"><span className="label">01 · Music &amp; Experience</span><h3>{lines(t('그 저녁', 'The evening'))}</h3><p className="muted">{t('호텔, 브랜드, 프라이빗 갈라 디너를 위한 현악 4중주와 확장 편성, 그리고 맞춤 챔버 연출.', 'String quartets, larger ensembles and bespoke chamber direction for hotels, brands and private gala dinners.')}</p><span className="more">Explore</span></a>
        <a className="ev-card" href="/objects"><span className="label">02 · Objects</span><h3>{lines(t('일상으로 옮긴 예술', 'Art carried into daily life'))}</h3><p className="muted">{t('하우스의 시각 언어에서 출발한 스카프와 가죽 소품, 그리고 개인의 오브제.', 'Scarves, leather goods and personal objects drawn from the house’s visual language.')}</p><span className="more">Explore</span></a>
      </div></div></section>;
}

function AtelierContent() {
  const {t, en} = useT(); void t; void en;
  return <section className="section night" id="content"><div className="spread">
    <div className="copy c-5"><span className="label">BELiOR Atelier · Content</span><h3>{lines(t('무대를 완성하는 콘텐츠', 'Content that completes the stage'))}</h3>
      <p className="muted">{t('무대 배경 영상과 영상 편집, 프로그램 그래픽까지 그 저녁의 세계관에 맞춰 기획하고 제작합니다.', 'Stage visuals, film editing and programme graphics, made for the world of each evening.')}</p><a className="more" href="/atelier">{t('콘텐츠 제작 보기', 'See content direction')}</a></div>
    <div className="c-7 pair"><figure><img src={V('o-content-stage-video.jpg')} alt={t('무대 배경 영상과 함께하는 공연', 'Performance with stage visuals')} loading="lazy"/><figcaption>{t('무대 배경 영상', 'Stage visuals')}</figcaption></figure>
      <figure><img src={V('op-onsite.jpg')} alt={t('현장에서 큐를 맞추는 연출팀', 'The direction team cueing on site')} loading="lazy"/><figcaption>{t('현장 디렉션', 'On-site direction')}</figcaption></figure></div>
  </div></section>;
}

function OneWorld() {
  const {t, en} = useT(); void t; void en;
  return <Band img="o-maison-entrance.jpg" eyebrow="BELiOR Maison" title={t('하나의 세계,\n여러 형태.', 'One world,\nmany forms.')} text={t('음악과 오브제, 고요한 빛이 한 공간에 머무는 하우스.', 'A house where music, objects and quiet light share one space.')} href="/maison" cta={t('자세히 알아보기', 'Learn more')}/>;
}

function ObjectsRow() {
  const {t, en} = useT(); void t; void en;
  return <section className="section"><Head eyebrow="Selected Objects" title={t('곁에 두도록 만든 것들', 'Made to be kept close')}/>
    <div className="doors">
      <Door href="/objects" img="o-prod-5.jpg" eyebrow="Personal Objects" title={t('개인의 오브제', 'Personal objects')} text={t('매일 쓰는 기기의 케이스를 수집할 만한 표면으로 다룹니다.', 'Everyday device cases treated as collectible surfaces.')}/>
      <Door href="/maison#symbol" img="monogram-hd.jpg" eyebrow="The Monogram" title={t('B 모노그램', 'The B monogram')} text={t('현처럼 곧게 선 획 위에 별을 얹은 하우스의 이니셜.', 'The house initial: a stroke straight as a string, crowned with a star.')}/>
    </div></section>;
}

function Services() {
  const {t, en} = useT(); void t; void en;
  return <><section className="section night"><Head eyebrow="Services" title={t('하우스의 세 가지 챕터', 'Three chapters of the house')}/>
    <div className="rows">
      <a className="row" href="/atelier"><h3>Content Direction</h3><p>{t('브랜드 · 행사 콘텐츠 기획', 'Brand and event content')}</p><span className="more">Explore</span></a>
      <a className="row" href="/atelier#visual"><h3>Visual Team</h3><p>{t('촬영 · 영상 · 비주얼 디렉션', 'Photography · Film · Visual direction')}</p><span className="more">Explore</span></a>
      <a className="row" href="/music/inquiry"><h3>Performance Inquiry</h3><p>{t('공연 및 프라이빗 이벤트 문의', 'Performances and private events')}</p><span className="more">Inquire</span></a>
    </div></section>
    <section className="section"><div className="statement"><img src={V('mono-ivory.png')} alt="" width={34} height={67}/>
      <h2>{lines(t('“더 아름다운 내일은, 오늘의 한 순간을 어떻게 짜는가에서 시작됩니다.”', '“A more beautiful tomorrow begins with how we compose a single moment today.”'))}</h2><p className="label">BELiOR · Music · Art · People · Places</p></div></section></>;
}

export default function Belior({page = 'home', detail = ''}: {page?: string; detail?: string}) {
  const [en, setEn] = useState(false), [menu, setMenu] = useState(false);
  const [filmPaused, setFilmPaused] = useState(false), [slide, setSlide] = useState(0), [carHold, setCarHold] = useState(false);
  const filmRef = useRef<HTMLVideoElement>(null), curtainRef = useRef<HTMLDivElement>(null), trackRef = useRef<HTMLDivElement>(null);
  const t = (ko: string, eng: string) => en ? eng : ko;
  const path = page === 'home' ? '/' : '/' + page + (detail ? '/' + detail : '');

  useEffect(() => { try { setEn(localStorage.getItem('belior-language') === 'en'); } catch {} }, []);
  useEffect(() => { document.documentElement.lang = en ? 'en' : 'ko'; try { localStorage.setItem('belior-language', en ? 'en' : 'ko'); } catch {} }, [en]);
  useEffect(() => { document.body.style.overflow = menu ? 'hidden' : ''; }, [menu]);

  // the arriving page opens on the same animal that closed the last one
  useEffect(() => {
    const c = curtainRef.current; if (!c) return;
    try {
      const turn = JSON.parse(sessionStorage.getItem('belior-turn') || 'null') as Turn | null;
      if (turn) { paint(c, turn, LABELS[path] || 'BELiOR'); sessionStorage.removeItem('belior-turn'); }
    } catch {}
  }, [path]);

  useEffect(() => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null;
      const c = curtainRef.current;
      if (!a || !c || reduce || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target) return;
      const href = a.getAttribute('href') || '';
      if (!href.startsWith('/') || href.startsWith('/api') || href.startsWith('/office')) return;
      const [dest, hash] = href.split('#');
      if (dest === path && hash) { setMenu(false); return; }
      let turn = OWN[dest];
      if (!turn) {
        let n = 0;
        try { n = parseInt(sessionStorage.getItem('belior-seq') || '0', 10) || 0; sessionStorage.setItem('belior-seq', String(n + 1)); } catch {}
        turn = SEQUENCE[n % SEQUENCE.length];
      }
      e.preventDefault();
      paint(c, turn, LABELS[dest] || 'BELiOR');
      try { sessionStorage.setItem('belior-turn', JSON.stringify(turn)); } catch {}
      c.classList.remove('leaving'); void c.offsetWidth; c.classList.add('leaving');
      window.setTimeout(() => { window.location.href = href; }, 800);
    };
    const onShow = (e: PageTransitionEvent) => { if (e.persisted) curtainRef.current?.classList.remove('leaving'); };
    document.addEventListener('click', onClick);
    window.addEventListener('pageshow', onShow);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('pageshow', onShow); };
  }, [path]);

  // scenes settle as they arrive
  useEffect(() => {
    document.querySelector('.belior')?.classList.add('js');
    document.querySelectorAll('.belior .section-head, .belior .copy, .belior .ex-head > *, .belior .ex-card, .belior .b12-manifesto > *, .belior .b12-heading, .belior .b12-card, .belior .b12-split > div, .belior .b12-story > *, .belior .b12-visit > *, .belior .b12-journal article, .belior .b12-emblems > *, .belior .tc-copy, .belior .finale > *, .belior .gj li, .belior .ar-grid > *, .belior .th-grid > *, .belior .doors > *').forEach(el => { if (!el.classList.contains('seen')) el.classList.add('rv'); });
    const els = document.querySelectorAll('.belior .scene, .belior .world, .belior .rv');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('seen')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); } }), {threshold: .12});
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page, detail]);


  useEffect(() => {
    if (carHold || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setTimeout(() => { const tr = trackRef.current; if (!tr) return; const n = (slide + 1) % WORLDS.length; tr.scrollTo({left: n * tr.clientWidth, behavior: 'smooth'}); }, 6000);
    return () => window.clearTimeout(id);
  }, [slide, carHold, page]);

  /* ---------- pages ---------- */
  const home = <>
    <Scene img="eve-quartet.jpg" eyebrow="Music & Experience" title={'The Art of a\nLiving Moment'} lede={t('살아 있는 순간의 예술', 'The art of a living moment')} pos="86% 55%" href="/music"/>
    <div className="pf-page" id="enquiry"><InviteContact/></div>
    <B12Hero/><Manifesto/>
    <MuseFilm src="belior-film-v9.mp4" poster="film-poster.jpg" label="BELiOR brand film" audio={false}/>
    <Scene img="bu-aerial.jpg" eyebrow="Editorial" title={'Brand Gala\nDinner Show'} lede={t('강 위로 저무는 저녁', 'An evening setting over the river')} pos="center 60%" href="/music/gala"/>
    <ZoomStage img="lion-portrait.jpg" fx={50} fy={40} eyebrow="Collection" title={'One Symbol.\nEndless Worlds.'} lede={t('하나의 상징, 끝없는 세계', 'One symbol, endless worlds')} pos="center 30%" href="/collection"/>
    <section className={'carousel' + (carHold ? ' hold' : '')} aria-label={t('여섯 개의 컬렉션', 'Six collections')} onPointerDown={() => setCarHold(true)}>
      <div className="track" ref={trackRef} onScroll={e => setSlide(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}>
        {WORLDS.map(w => <div className="slide" role="group" aria-label={w.name} key={w.slug} style={{['--world' as string]: w.color}}>
          <img className="bg" src={V(w.img || 'phoenix.jpg')} alt="" loading="lazy" style={{objectPosition: posOf(w, 'center')}}/>
          <div className="inner"><span className="label">The Animal Collection</span><h2>{w.name}</h2><p className="lede">{w.kw}</p><Cta href={'/collection/' + w.slug}/></div></div>)}
      </div>
      <div className="dots">{WORLDS.map((w, i) => <button type="button" className="dot" key={w.slug} aria-label={w.name} aria-current={slide === i}
        onClick={() => trackRef.current?.scrollTo({left: i * (trackRef.current?.clientWidth || 0), behavior: 'smooth'})}>{slide === i && <i key={slide}/>}</button>)}</div>
      <button type="button" className="car-toggle" aria-label={carHold ? t('자동 넘김 재생', 'Play slides') : t('자동 넘김 정지', 'Pause slides')} onPointerDown={e => e.stopPropagation()} onClick={() => setCarHold(h => !h)}><span aria-hidden="true">{carHold ? '▶' : 'II'}</span></button>
    </section>
    <MaisonHero/><MaisonIntro/><TwoHouses/><ArtistsStrip/><VisualTeam/><TheHouse/><Founder/><TheEvening/><SymphonicAtelier/><GuestJourney/><AtelierContent/><OneWorld/>
    <section className="section night"><div className="spread">
      <figure className="c-5"><img src={V('no16-pool.jpg')} alt={t('숲속 물가에서 말에 오른 아이와 아버지', 'A child on a horse by a forest pool, her father beside her')} loading="lazy"/><figcaption>No. 16</figcaption></figure>
      <div className="copy c-6" style={{gridColumn: '7 / span 6'}}><span className="label">Parfum · No. 16</span><h3>A memory, held.</h3>
        <p className="muted">{t('어린 시절, 아버지와 함께했던 푸른 숲과 맑은 물가. 그 장면을 하나의 향에 담습니다.', 'A green forest and a clear pool, shared with my father as a child — that scene, kept in a scent.')}</p>
        <a className="more" href="/products/no-16">{t('No. 16 이야기', 'The story of No. 16')}</a></div></div></section>
    <Tchaikovsky/><Listening/><Experience/><ObjectsRow/><Services/><Finale/>
    <Scene img="visual-arrival.jpg" eyebrow="Private Enquiries · By Invitation" title="By Appointment" lede={t('공연과 컬렉션, 프라이빗 이벤트에 관한 문의', 'Enquiries for performances, collections and private events')} href="/private" cta={t('문의하기', 'Enquire')}/>
  </>;

  const maison = <>
    <MaisonIntro/><TheHouse/>
    <section className="section" id="symbol"><Head eyebrow="Symbol System" title={t('하나의 하우스, 하나의 심볼, 여섯 개의 세계', 'One house, one symbol, six worlds')}
      text={t('메종 심볼은 하우스 전체를, 사자-B 모노그램은 동물 세계관의 시작을, 여섯 엠블럼은 각 컬렉션을 대표합니다.', 'The maison symbol stands for the whole house, the lion-B monogram opens the animal worlds, and six emblems stand for each collection.')}/>
      <div className="symbols three">
        <div className="symbol-card"><div className="mark"><img src={V('mono-ivory.png')} alt="BELiOR maison symbol" width={76} height={150}/></div><span className="label">Maison Symbol</span><h3>{lines(t('메종 심볼', 'Maison symbol'))}</h3><p className="muted">{t('하우스의 공식 표기. 사이트 상단과 모든 공식 문서에 사용합니다.', 'The official mark of the house, used at the top of the site and on all official documents.')}</p></div>
        <div className="symbol-card"><div className="mark"><img src={V('monogram-hd.jpg')} alt="Lion-B monogram" style={{maxHeight: 150, borderRadius: 4}}/></div><span className="label">The Monogram</span><h3>{lines(t('사자-B 모노그램', 'Lion-B monogram'))}</h3><p className="muted">{t('현처럼 곧게 선 획 위에 별을 얹은 이니셜. 동물 세계관으로 들어가는 문입니다.', 'An initial straight as a string, crowned with a star. The door to the animal worlds.')}</p></div>
        <div className="symbol-card"><div className="mini">{WORLDS.map(w => <a href={'/collection/' + w.slug} key={w.slug}><img src={V('emblem-' + w.slug + '.jpg')} alt={w.name + ' emblem'}/></a>)}</div><span className="label">Collection Emblems</span><h3>{lines(t('여섯 엠블럼', 'Six emblems'))}</h3><p className="muted">LION · SWAN · ORCA · LEOPARD · PANTHER · PHOENIX.</p></div>
      </div></section>
    <section className="b12-manifesto"><span className="label">Our point of view</span><h2>Luxury is not a volume.<br/><span>It is a feeling.</span></h2>
      <p className="muted">{t('BELiOR는 서울에서 태어난 독립 메종입니다. 향과 패션, 오브제를 하나의 추구로 엮습니다. 처음 닿는 순간부터 나의 것으로 느껴지고, 오래도록 의미가 남는 것을 만듭니다.', 'BELiOR is an independent maison born in Seoul. We bring together fragrance, fashion and objects in a single pursuit: to create things that feel personal from the very first touch, and meaningful for a long time after.')}</p></section>
    <section className="b12-split night"><img src={V('b12-atelier.jpg')} alt={t('아틀리에에서 가죽 가방을 만드는 손', 'Hands making a leather bag in the atelier')} loading="lazy"/>
      <div><span className="label">The atelier</span><h2>Small gestures.<br/>Lasting things.</h2>
        <p className="muted">{t('우리는 계절이 아니라 소재에서 시작합니다. 서두를 수 없는 디테일 — 솔기의 가장자리, 캡의 균형, 표면이 빛을 모으는 방식 — 로 몇 번이고 돌아갑니다.', 'We begin with material, not a season. Our makers work with patience, returning to the details that cannot be hurried: the edge of a seam, the balance of a cap, the way a surface gathers light.')}</p>
        <p className="ko-line">{t('손끝의 작은 차이가 오래 기억됩니다.', 'Small differences at the fingertips are long remembered.')}</p>
        <a className="text-link" href="/private">Arrange a private conversation <span aria-hidden="true">↗</span></a></div></section>
    <section className="b12-emblems"><span className="label">Six emblems, six ways of seeing</span><h2>Follow your nature.</h2>
      <div>{WORLDS.map(w => <a href={'/collection/' + w.slug} key={w.slug}>{w.name.charAt(0) + w.name.slice(1).toLowerCase()} · {w.kw.split(' · ')[0]}</a>)}</div>
      <a className="text-link" href="/collection">Explore the collections <span aria-hidden="true">↗</span></a></section>
    <Experience/><OneWorld/><Services/><Visit/>
  </>;

  const music = <>
    <Scene img="eve-quartet.jpg" eyebrow="BELiOR Music & Experience" title={'The Art of a\nLiving Moment'} lede={t('살아 있는 순간의 예술. 실제 무대와 현장에서 연주하는 BELiOR의 음악입니다.', 'Music performed live, on real stages and at real events.')} pos="86% 55%"/>
    <YouTubeFilm/>
    <section className="section"><Head eyebrow="Music" title={t('음악은 저녁을 작곡합니다', 'Music composes the evening')} text="Where Music Becomes Memory."/>
      <div className="doors">
        <Door href="/music/artists" img="bu-backstage.jpg" eyebrow="Artists" title={t('연주진', 'Artists')} text={t('현장에서 함께 호흡하는 연주진.', 'The musicians on stage.')}/>
        <Door href="/music/performances" img="o-gala-ensemble.jpg" eyebrow="Performances" title={t('공연 포트폴리오', 'Performances')} text={t('BELiOR와 TWOTTIVA가 함께한 무대.', 'Stages shared by BELiOR and TWOTTIVA.')}/>
        <Door href="/music/gala" img="bu-violinist.jpg" eyebrow="Editorial" title="Brand Gala Dinner Show" text={t('현장 · 리셉션 · 백스테이지의 기록.', 'On site · Reception · Backstage.')} pos="center 20%"/>
        <Door href="/music/inquiry" img="bu-violin.jpg" eyebrow="Inquiry" title={t('공연 문의', 'Inquiry')} text={t('행사 정보를 남기면 프로그램을 제안드립니다.', 'Share your event and we will propose a programme.')}/>
      </div></section>
    <SeoulGala/><TwoHouses/><GuestJourney/><SymphonicAtelier/><BeyondLogo/><Operation/><TheEvening/>
    <section className="section"><div className="statement"><span className="label">An Evening</span><h2>An Evening, Beautifully Composed.</h2><p>{t('아름답게 구성된 하나의 저녁.', 'One evening, beautifully composed.')}</p><Cta href="/music/inquiry">{t('공연 문의', 'Inquire')}</Cta></div></section>
  </>;

  const artists = <>
    <Scene img="bu-backstage.jpg" eyebrow="Music · Artists" title={t('BELiOR 연주진', 'BELiOR Artists')} lede="Beyond Performance. An Experience." pos="center 35%"/>
    <Founder/><Artists/>
    <TheHouse/>
    <Band img="bu-violinist.jpg" eyebrow="En Plein Air" title={t('바람이 지나간 자리에\n선율이 남습니다', 'Where the wind passes,\na melody remains')} text={t('잔디 위의 바람, 테이블 위의 촛불. 그 저녁의 빛과 공기가 그대로 악보가 됩니다.', 'Wind over the lawn, a candle on the table. The light and air of the evening become the score.')} href="/music/performances" cta={t('공연 보기', 'Performances')} pos="center 68%"/>
  </>;

  const performances = <>
    <Scene img="o-gala-ensemble.jpg" eyebrow="Music · Performances" title={t('공연 포트폴리오', 'Performances')} lede="The Sound of an Extraordinary Evening."/>
    <MuseFilm src="muse-v2.mp4" poster="muse-v2-poster.jpg" label="The Muse of BELiOR"/>
    <section className="section"><Head eyebrow="Portfolio" title={t('함께한 저녁', 'Evenings we shared')}/>
      <div className="rows">
        <a className="row" href="/music/gala"><h3>Brand Gala Dinner Show</h3><p>{t('서울 · 한강을 내려다보는 야외 디너 · 현악 4중주 라이브 연주', 'Seoul · Outdoor dinner above the Han River · Live string quartet')}</p><span className="more">Editorial</span></a>
        <div className="row"><h3>{lines(t('KBS홀 한·체코 수교 35주년 기념음악회', 'KBS Hall, Korea–Czech 35th Anniversary Concert'))}</h3><p>TWOTTIVA</p><span/></div>
        <div className="row"><h3>{lines(t('한국여성공인회계사회 정기총회 및 회장 이·취임식', 'Korea Women CPA Association, Inauguration'))}</h3><p>TWOTTIVA</p><span/></div>
        <div className="row"><h3>{lines(t('호텔 연회 · 기업행사 · VIP 리셉션', 'Hotel banquets · Corporate events · VIP receptions'))}</h3><p>TWOTTIVA</p><span/></div>
      </div>
      <p className="muted small" style={{marginTop: 20}}>{t('공연 이력은 TWOTTIVA와 각 연주자의 이력입니다.', 'Performance history belongs to TWOTTIVA and its musicians.')}</p>
</section>
    <TheEvening/>
    <Band img="eve-quartet.jpg" eyebrow="For Your Evening" title={t('행사의 성격에 맞춘\n프로그램', 'A programme shaped\nto your event')} text={t('행사 일정과 장소, 진행 순서를 바탕으로 편성과 곡목을 제안드립니다.', 'We propose ensemble and repertoire around your schedule, venue and running order.')} href="/music/inquiry" cta={t('공연 문의', 'Inquire')} pos="86% 55%"/>
  </>;

  const gala = <>
    <Scene img="bu-aerial.jpg" eyebrow="Editorial · Brand Gala Dinner Show, Seoul" title={t('강 위로 저무는 저녁', 'An evening over the river')} lede={t('브랜드 갈라 디너 쇼에서 BELiOR는 현장의 라이브 연주를 맡았고, 연주에 대해 좋은 평가를 받았습니다.', 'At a brand gala dinner show, BELiOR performed live and was well received.')} pos="center 55%"/>
    <MuseFilm src="reel-scent.mp4" poster="reel-scent-poster.jpg" label="Scent of a Woman · performance" vertical/>
    <section className="section">
      <div className="spread"><figure className="c-8"><img src={V('eve-quartet.jpg')} alt={t('행사장 앞 야외 4중주', 'Outdoor quartet at the venue')} loading="lazy"/><figcaption>I. Reception</figcaption></figure>
        <div className="copy c-4"><span className="label">Reception</span><h3>{lines(t('손님이 도착하는 시간', 'As the guests arrive'))}</h3><p className="muted">{t('조명이 켜지기 시작할 무렵, 리셉션의 공기를 현악 4중주로 채웠습니다.', 'As the lights came on, a string quartet filled the reception.')}</p></div></div>
      <div className="spread"><div className="copy c-5"><span className="label">The Venue</span><h3>{lines(t('원형 테이블과 한강', 'Round tables and the river'))}</h3><p className="muted">{t('언덕 위 잔디에 놓인 원형 디너 테이블, 그 너머로 강과 다리가 이어지는 풍경입니다.', 'Round dinner tables on a hillside lawn, with the river and bridges beyond.')}</p></div>
        <figure className="c-6" style={{gridColumn: '7 / span 6'}}><img src={V('bu-violinist.jpg')} alt={t('잔디 위의 바이올리니스트', 'Violinist on the lawn')} loading="lazy"/><figcaption>II. Venue</figcaption></figure></div>
      <div className="spread"><figure className="c-5"><img src={V('bu-violin.jpg')} alt={t('바이올린 클로즈업', 'Violin close-up')} loading="lazy"/><figcaption>III. Detail</figcaption></figure>
        <figure className="c-7"><img src={V('bu-backstage.jpg')} alt={t('공연을 마친 연주진', 'The musicians after the show')} loading="lazy"/><figcaption>IV. Backstage</figcaption></figure></div>
    </section>
    <section className="section night"><div className="statement"><span className="label">BELiOR Music</span><h2>Where Music Becomes Memory.</h2><p>{t('음악이 기억이 되는 순간.', 'Where music becomes memory.')}</p><Cta href="/music/inquiry">{t('공연 문의', 'Inquire')}</Cta></div></section>
  </>;

  const musicInquiry = <div className="pf-page"><PerformanceInquiry/></div>;

  const collection = <>
    <LogoFilm/><div id="collections"><CollectionGrid/></div>
    <section className="section"><div className="spread">
      <div className="copy c-6"><span className="label">From the Maison</span><h3>{lines(t('메종에서 시작된 여섯 개의 세계', 'Six worlds that began in the maison'))}</h3>
        <p className="muted">{t('음악과 오브제로 쌓아 온 BELiOR의 하우스 위에, 사자의 모노그램에서 출발한 동물들의 세계관을 더합니다. 각 세계는 고유의 색과 소재, 향과 사물을 가집니다.', 'Upon the house of music and objects, BELiOR adds animal worlds that begin with the lion monogram. Each has its own colour, material, scent and objects.')}</p>
        <blockquote className="note-founder"><span className="label">Founder’s Note</span><p>{t('사자는 강인하고 멋집니다. 호랑이는 홀로 살아남아야 하는 자연의 섭리 속에서도 웅장합니다. 그 마음이 BELiOR의 세계관이 되었습니다.', 'The lion is strong and magnificent. The tiger, though nature asks it to survive alone, is grand. That feeling became the world of BELiOR.')}</p></blockquote>
        <a className="more" href="/maison">{t('메종 보기', 'The maison')}</a></div>
      <figure className="c-5" style={{gridColumn: '8 / span 5'}}><img src={V('monogram-hd.jpg')} alt="Lion-B monogram" loading="lazy"/><figcaption>The Monogram</figcaption></figure></div></section>
    <section className="section night"><Head eyebrow="Emblem Collection" title={t('여섯 개의 엠블럼', 'Six emblems')}/><Emblems items={WORLDS}/></section>
    <div className="worlds">{WORLDS.map(w => <a className="world" href={'/collection/' + w.slug} key={w.slug} style={{['--world' as string]: w.color}}>
      <img className="bg" src={V(w.img || 'phoenix.jpg')} alt="" loading="lazy" style={{objectPosition: posOf(w, 'center')}}/><span className="label mat" style={{color: w.color}}>{w.mat}</span>
      <div className="txt"><h3>{w.name}</h3><span className="kw">{w.kw}</span><span className="more" style={{color: w.color}}>Explore</span></div></a>)}</div>
    <section className="section"><Head eyebrow="Pattern & Motif" title={t('세계마다 다른 결', 'A texture for every world')}/>
      <div className="patterns">{WORLDS.map(w => <figure key={w.slug}><img src={V(w.slug + '-pattern.jpg')} alt={w.name + ' pattern'} loading="lazy"/><figcaption>{w.name} · {w.mat}</figcaption></figure>)}</div></section>
    <section className="section night" id="lines"><Head eyebrow="From World to Object" title={t('세계관이 사물이 되기까지', 'From world to object')} text={t('각 컬렉션은 PARFUM · BAGS · APPAREL · OBJECTS로 이어집니다. 제품은 공개 준비 중입니다.', 'Each collection extends into parfum, bags, apparel and objects. Products are in development.')}/>
      <div className="lines">{[['PARFUM', 'prod-parfum.jpg'], ['BAGS', 'prod-bag-hd.jpg'], ['APPAREL', 'prod-clothing-hd.jpg'], ['OBJECTS', 'prod-objects.jpg']].map(([n, im]) =>
        <div className="line-item" key={n}><div className="ph"><img src={V(im)} alt={n} loading="lazy" style={{objectPosition: im.includes('clothing') ? '66% center' : im.includes('bag') ? '56% center' : undefined}}/></div><span className="label">{n}</span></div>)}</div></section>
    <OneWorld/>
  </>;

  const worldPage = (w: World) => {
    const i = WORLDS.indexOf(w), nxt = WORLDS[(i + 1) % WORLDS.length];
    const lede = w.tag ? (en ? w.tag[0] : w.tag[0] + ' ' + w.tag[1]) : w.kw;
    const mock = w.slug !== 'phoenix';
    return <div className="world-page" style={{['--world' as string]: w.color}}>
      {w.img ? <ZoomStage key={w.slug} img={w.img} fx={(FOCAL[w.slug] || [50, 40])[0]} fy={(FOCAL[w.slug] || [50, 40])[1]} eyebrow={'The Animal Collection · ' + w.mat} title={w.name + '\nCollection'} lede={lede} pos={posOf(w)}/> :
        <section className="scene plain"><div className="inner"><div className="phoenix-frame"><img src={V('phoenix.jpg')} alt="Phoenix"/></div>
          <span className="label">{'The Animal Collection · ' + w.mat}</span><h1>{w.name}<br/><span className="accent">Collection</span></h1><p className="lede">{lede}</p></div></section>}
      {w.slug === 'swan' && <section className="section night"><Head eyebrow="Swan Lake · TWOTTIVA × BELiOR" title={t('달빛 아래의 호수', 'A lake under the moon')} text={t('리허설에서 녹음한 Swan Lake 연주입니다. 소리를 켜고 보세요.', 'Swan Lake, recorded in rehearsal. Watch with sound.')}/><video className="performance-video" controls playsInline preload="metadata" poster={V('swan-lake-poster.jpg')} src={V('swan-lake-film.mp4')}/></section>}
      <section className="section"><div className="spread">
        <div className="copy c-7"><span className="label">The World</span><p className="world-line">{w.world[en ? 1 : 0]}</p></div>
        <div className="c-4 emblem-side"><img src={V('emblem-' + w.slug + '.jpg')} alt={w.name + ' emblem'}/><span className="label">{w.name} Emblem</span></div></div>
        {w.slug === 'lion' && <blockquote className="note-founder"><span className="label">Founder’s Note</span><p>{t('사자를 좋아하는 이유는 강인하고 멋지기 때문입니다.', 'I love the lion because it is strong and magnificent.')}</p></blockquote>}
        <div className="facts">
          <div className="fact"><span className="label">Keywords</span><span className="val">{w.kw}</span></div>
          <div className="fact"><span className="label">Material · Tone</span><span className="val accent">{w.mat}</span><div className="chips">{w.chips.map(c => <span className="chip" key={c} style={{background: c}}/>)}</div></div>
          <div className="fact"><span className="label">Pattern & Motif</span><img className="pat" src={V(w.slug + '-pattern.jpg')} alt={w.name + ' pattern'}/></div>
        </div></section>
      <section className="section night"><Head eyebrow={w.name + ' Objects'} title={t(w.name + '의 사물들', 'Objects of ' + w.name)} text={t('향수와 가방, 의류와 캔들. 하나의 엠블럼이 여러 사물로 이어집니다.', 'Parfum, bags, apparel and candles. One emblem carried into many objects.')}/>
        {mock ? <figure className="wide-fig"><img src={V(w.slug + '-objects.jpg')} alt={w.name + ' objects'} loading="lazy"/><figcaption>Parfum · Bags · Apparel · Objects</figcaption></figure>
          : <p className="muted">{t('PHOENIX의 사물은 공개 준비 중입니다.', 'Phoenix objects are in development.')}</p>}</section>
      {w.notes && w.scent && <section className="section"><div className="spread">
        <figure className="c-5"><img src={V(w.slug + '-scent.jpg')} alt={w.name + ' fragrance'} loading="lazy"/><figcaption>Fragrance</figcaption></figure>
        <div className="copy c-6" style={{gridColumn: '7 / span 6'}}><span className="label">Fragrance</span><h3>{w.name}</h3><p className="notes accent">{w.notes}</p><p className="muted">{w.scent[en ? 1 : 0]}</p></div></div></section>}
      {w.atelier && <section className="section night"><div className="spread">
        <div className="copy c-5"><span className="label">Atelier</span><h3>{w.name} Atelier</h3><p className="muted">{w.atelier[en ? 1 : 0]}</p><a className="more" href="/atelier">{t('아틀리에 보기', 'The atelier')}</a></div>
        <figure className="c-6" style={{gridColumn: '7 / span 6'}}><img src={V(w.slug + '-atelier.jpg')} alt={w.name + ' atelier'} loading="lazy"/><figcaption>Leather · Emblem</figcaption></figure></div></section>}
      {w.slug === 'swan' && <section className="section"><figure className="wide-fig"><img src={V('swan-ballet.jpg')} alt={t('Swan Lake 1막 무대', 'Swan Lake, Act I on stage')} loading="lazy"/><figcaption>Swan Lake · Act I</figcaption></figure></section>}
      {w.alt && <section className="section"><figure className="wide-fig"><img src={V(w.alt)} alt="" loading="lazy"/><figcaption>The World of {w.name}</figcaption></figure></section>}
      <section className="section night"><Head eyebrow="Other Worlds" title={t('다른 세계로', 'Other worlds')}/><Emblems items={WORLDS.filter(x => x !== w)} five/></section>
      <section className="b12-story"><span className="label">A BELiOR expression</span><h2>{B12[w.slug].tag}</h2><p className="muted">{B12[w.slug].body[en ? 1 : 0]}</p>
        <p className="subtle">Fragrance · Objects · Form</p><a className="text-link" href="/private">Discover in private <span aria-hidden="true">↗</span></a></section>
      <nav className="b12-next" aria-label={t('다른 컬렉션', 'Other collections')}>{[['Previous', WORLDS[(i + WORLDS.length - 1) % WORLDS.length]], ['Next', nxt]].map(([l, c]) => { const x = c as World; return <a href={'/collection/' + x.slug} key={l as string}><img src={V(B12[x.slug].img)} alt="" loading="lazy" style={{objectPosition: B12[x.slug].pos || 'center'}}/><div><span>{l as string} collection</span><h3>{x.name}</h3></div></a>; })}</nav>
      <OneWorld/>
    </div>;
  };

  const no16 = <div className="no16">
    <section className="n16-hero"><img className="bg" src={V('no16-hero.jpg')} alt={t('푸른 숲에서 말에 오른 아이와 지켜보는 아버지', 'A child on a horse in a green forest, her father watching')}/>
      <div className="inner"><h1 className="keep">No.16<br/>A memory, held.</h1><p className="lede">{t('푸른 숲, 어린 시절의 한 장면.', 'A green forest, a childhood scene.')}</p>
        <a className="line-cta" href="#memory">DISCOVER THE STORY <span aria-hidden="true">→</span></a></div></section>
    <N16Poster/><CarDiffuser/>
    <section className="n16-stay"><div className="txt"><h2>The moments that stay.</h2>
      <p>{lines(t('향은 우리를 어떤 장소로 데려갑니다 —\n우리를 만든 감정과, 여전히 안에 살아 있는\n고요한 힘으로.', 'Scent can return us to a place —\nto the feelings that shaped us, and the quiet strength\nthat still lives within.'))}</p></div>
      <img src={V('no16-stream.jpg')} alt={t('햇살이 비치는 이끼와 시냇물', 'Moss and a sunlit stream')} loading="lazy"/></section>
    <section className="n16-memory" id="memory">
      <div className="n16-top"><div className="txt"><span className="label">No.16 / The Memory</span><h2>{lines('Before it was a scent,\nit was a memory.')}</h2>
        <p>{lines(t('어린 시절, 아빠와 함께 숲에 갔습니다.\n나뭇잎 사이로 빛이 내리고,\n물가에는 하얀 말이 서 있었습니다.', 'As a child, I went into the forest with my father.\nLight fell through the leaves,\nand a white horse stood by the water.'))}</p></div>
        <img src={V('no16-hand.jpg')} alt={t('말갈기에 얹은 아이의 손', 'A child’s hand on the horse’s mane')} loading="lazy"/></div>
      <div className="n16-three">{[['no16-forest.jpg', '01 — The Forest', t('이끼 낀 숲의 바닥', 'The mossy forest floor')], ['no16-warmth.jpg', '02 — The Warmth', t('햇살을 받은 말의 갈기', 'The horse’s mane in sunlight')], ['no16-presence.jpg', '03 — The Presence', t('말 위의 아이를 지켜보는 아버지', 'A father watching his child on horseback')]].map(([im, cap, alt]) =>
        <figure key={im}><img src={V(im)} alt={alt} loading="lazy"/><figcaption>{cap}</figcaption></figure>)}</div>
      <div className="n16-foot"><p>Some moments never leave us.</p><a className="line-cta" href="/journal">CONTINUE THE STORY <span aria-hidden="true">→</span></a></div>
    </section>
    <section className="n16-childhood"><span className="label">{t('어린 시절', 'Childhood')}</span>
      <p className="world-line">{t('푸릇푸릇한, 동화 속 같은 숲. 그 순간은 지금도 선명하게 남아 있습니다.', 'A green forest, like a fairy tale. That moment is still vivid.')}</p>
      <p>{t('BELiOR는 테마마다 하나의 이야기를 담습니다. No. 16은 그 첫 기억입니다.', 'BELiOR gives every theme a story of its own. No. 16 is the first memory.')}</p>
      <a className="line-cta" href="/private">{t('No. 16 프라이빗 문의', 'Enquire about No. 16')} <span aria-hidden="true">→</span></a></section>
  </div>;

  const productPage = (d: string) => {
    if (d === 'no-16') return no16;
    const items: [string, string, string, string][] = [['parfum', 'PARFUM', '향', 'prod-parfum.jpg'], ['bag', 'BAG', '가방', 'prod-bag-hd.jpg'], ['clothing', 'CLOTHING', '의류', 'prod-clothing-hd.jpg'], ['objects', 'OBJECTS', '오브제', 'prod-objects.jpg']];
    const one = items.find(x => x[0] === d);
    return <>
      <Scene img="o-mk-home-objects.jpg" eyebrow="Parfum · Bag · Clothing · Objects" title={one ? one[1] : 'The Art of Everyday'} lede={t('감각을 담는 소재, 오래 머무는 형태.', 'Materials that hold feeling. Forms that endure.')}/>
      {(d === '' || d === 'parfum') && <><Tchaikovsky/><CarDiffuser/><section className="b12-split"><img src={V('b12-fragrance.jpg')} alt={t('검은 향수병과 난초', 'A dark glass bottle beside an orchid')} loading="lazy"/>
        <div><span className="label">A considered object</span><h2>Kept close.<br/>Returned to.</h2>
          <p className="muted">{t('건축적인 유리, 무게감 있는 캡, 손안에 자연스럽게 놓이는 형태. 모든 디테일은 의도되었고, 어느 것도 주목을 요구하지 않습니다.', 'Architectural glass, a weighted cap, and a form designed to rest naturally in the hand. Every detail is intentional; nothing asks for attention.')}</p>
          <a className="text-link" href="/atelier">Our way of making <span aria-hidden="true">↗</span></a></div></section></>}
      {(d === '' || d === 'parfum') && <GiftScents/>}
      <section className="section"><Head eyebrow="The Art of Everyday" title={t('일상의 예술', 'The art of everyday')} text={t('출시 소식은 프라이빗 문의로 먼저 안내드립니다.', 'Launch news is shared first through private enquiries.')}/>
        <div className="lines">{items.map(([s, n, ko, im]) => <a className="line-item" href={'/products/' + s} key={s}><div className="ph"><img src={V(im)} alt={n} loading="lazy" style={{objectPosition: im.includes('clothing') ? '66% center' : im.includes('bag') ? '56% center' : undefined}}/></div><span className="label">{n}</span><p className="muted">{t(ko, n)}</p></a>)}</div></section>
      <ObjectsRow/><OneWorld/>
    </>;
  };

  const objects = <>
    <Scene img="o-m-bag.jpg" eyebrow="Objects" title="Live with Art" lede={t('오래도록 곁에 남는 오브제, 일상의 순간을 특별하게.', 'Objects that stay with you, making the everyday special.')}/>
    <ObjectsRow/>
    <HousePins/>
    <section className="section night"><div className="spread">
      <figure className="c-6"><img src={V('o-m-br-hero.jpg')} alt={t('B 모노그램 가죽 브레이슬릿', 'Leather bracelet with B monogram')} loading="lazy"/><figcaption>Leather · Monogram</figcaption></figure>
      <div className="copy c-5" style={{gridColumn: '8 / span 5'}}><span className="label">Leather Goods</span><h3>{lines(t('모노그램을 새긴 가죽 소품', 'Leather goods with the monogram'))}</h3><p className="muted">{t('하우스의 이니셜을 작은 사물에 옮깁니다.', 'The house initial, carried onto small objects.')}</p></div></div></section>
    <section className="section" id="lines"><Head eyebrow="Collection Lines" title={t('여섯 세계의 사물', 'Objects of six worlds')}/><Emblems items={WORLDS}/></section>
    <Band img="o-maison-objects.jpg" eyebrow="Maison" title={t('음악과 오브제가\n함께 머무는 곳', 'Where music and\nobjects live together')} text={t('하우스의 시각 언어에서 출발한 사물들.', 'Objects drawn from the house’s visual language.')} href="/maison" cta={t('메종 보기', 'The maison')}/>
  </>;

  const atelier = <>
    <Scene img="o-mk-home-atelier.jpg" eyebrow="Atelier" title="Craft Your Moment" lede={t('시간이 만들어내는 아름다움, 섬세한 손끝에서 시작됩니다.', 'Beauty made by time begins at the fingertips.')}/>
    <AtelierContent/>
    <VisualTeam/>
    <section className="section" id="process"><Head eyebrow="Process" title={t('제작의 순서', 'How we make')} text={t('세부 일정과 방식은 프로젝트마다 함께 정합니다.', 'Schedules and methods are agreed project by project.')}/>
      <div className="steps">{[['World', '행사와 브랜드의 세계관을 정합니다.', 'We set the world of the event or brand.'], ['Visual', '무대 배경 영상과 프로그램 그래픽을 설계합니다.', 'We design stage visuals and programme graphics.'], ['Object', '패키지와 오브제로 형태를 만듭니다.', 'We give it form in packaging and objects.'], ['Stage', '현장에서 음악과 함께 완성합니다.', 'We complete it on site, with music.']].map(([n, ko, eng]) =>
        <div className="step" key={n}><h3>{n}</h3><p>{t(ko, eng)}</p></div>)}</div></section>
    <section className="section night"><figure className="wide-fig"><img src={V('atelier-wide.jpg')} alt={t('패키지', 'Packaging')} loading="lazy"/><figcaption>Packaging</figcaption></figure></section>
    <Services/>
  </>;

  const journal = <>
    <Scene img="o-mk-home-journal.jpg" eyebrow="Journal" title={'Stories behind\nthe Maison'} lede={t('예술, 사람, 공간의 이야기를 기록합니다.', 'Stories of art, people and places.')}/>
    <section className="b12-jhero"><span className="label">Notes from the maison · Volume 01</span><h2>A slower kind<br/><em>of looking.</em></h2><p className="muted">{t('관찰하고, 머물고, 기억하는 것들.', 'What we observe, stay with and remember.')}</p></section>
    <section className="b12-journal">
      <article className="feature"><img src={V('b12-atelier.jpg')} alt={t('가죽을 다루는 손', 'A maker’s hands shaping leather')} loading="lazy"/><span className="label">Atelier notes · 04 min read</span><h3>The beauty of what takes time</h3>
        <p className="muted">{t('손으로 반복되는 몸짓, 그 아래에서 변해 가는 소재, 그리고 약간의 인내가 어떻게 하나의 오브제를 나의 것으로 만드는지에 대하여.', 'On the gestures repeated by hand, the material that changes beneath it, and why a little patience can make an object feel like yours.')}</p><a className="text-link" href="/maison">Read the note <span aria-hidden="true">↗</span></a></article>
      <article><img src={V('tchaikovsky-poster.jpg')} alt="The Tchaikovsky Edition" loading="lazy"/><span className="label">The scent journal · 03 min read</span><h3>The moment the curtain falls</h3>
        <p className="muted">{t('백조의 호수에 막이 내리는 순간, N° 01 The Tchaikovsky Edition의 첫 노트가 시작됩니다.', 'As the curtain falls on Swan Lake, N° 01 The Tchaikovsky Edition finds its first note.')}</p><a className="text-link" href="/products/parfum">Explore N° 01 <span aria-hidden="true">↗</span></a></article>
      <article><img src={V('b12-vinyl.jpg')} alt={t('어둠 속의 레코드', 'Vinyl and tonearm in low light')} loading="lazy"/><span className="label">Listening room · 01</span><h3>An evening, side A</h3>
        <p className="muted">{t('낮은 조명, 긴 그림자, 그리고 레코드가 도는 부드러운 결.', 'A sequence of low light, long shadows and the soft grain of a record turning.')}</p><a className="text-link" href="/music">Stay a while <span aria-hidden="true">↗</span></a></article>
    </section>
    <Listening/>
    <section className="section"><div className="rows">
      <a className="row" href="/products/no-16"><h3>{lines(t('No. 16 — 숲속 물가의 기억', 'No. 16 — A forest pool, remembered'))}</h3><p>Parfum · Story</p><span className="more">Read</span></a>
      <a className="row" href="/music/gala"><h3>{lines(t('Brand Gala Dinner Show, 그날의 기록', 'Brand Gala Dinner Show, that evening'))}</h3><p>Music · Reception · Backstage</p><span className="more">Read</span></a>
      <a className="row" href="/maison#house"><h3>{lines(t('무대에서 시작된 하우스', 'A house born on stage'))}</h3><p>Maison · BELiOR & TWOTTIVA</p><span className="more">Read</span></a>
      <a className="row" href="/collection"><h3>{lines(t('하나의 상징, 여섯 개의 세계', 'One symbol, six worlds'))}</h3><p>Collection</p><span className="more">Read</span></a>
      <a className="row" href="/maison#symbol"><h3>{lines(t('메종 심볼과 사자-B 모노그램', 'The maison symbol and the lion-B monogram'))}</h3><p>Maison · Symbols</p><span className="more">Read</span></a>
    </div></section>
    <OneWorld/><Visit/>
  </>;

  const privatePage = <>
    <section className="invite">
      <div className="iv-art"><img className="wide" src={V('invite.jpg')} alt="BELiOR Atelier"/><img className="narrow" src={V('invite-center.jpg')} alt="BELiOR Atelier"/></div>
      <div className="iv-body"><h1 className="keep">Three Cities. One Vision.</h1><p className="label">A More Beautiful Tomorrow.</p><span className="iv-rule"/>
        <p className="iv-only">Invitation Only</p><p className="iv-sub">Some things are not made for everyone.</p>
        <p className="muted">{t('프라이빗 공연, 브랜드 행사, 기업 선물과 아틀리에 협업은 초대와 개별 상담으로 진행합니다.', 'Private performances, brand events, corporate gifting and atelier collaborations are arranged by invitation.')}</p>
        <a className="iv-cta" href="#enquiry">{t('초대 요청하기', 'Request an invitation')} <span aria-hidden="true">↓</span></a></div>
      <div className="iv-foot"><span>Art · Objects · People · A Brighter Tomorrow</span><span>BELiOR Atelier</span></div>
    </section>
    <div className="pf-page" id="enquiry"><InviteContact/></div>
  </>;

  const world = WORLDS.find(w => w.slug === detail);
  const content =
    page === 'home' ? home :
    page === 'maison' ? maison :
    page === 'music' ? (detail === 'artists' ? artists : detail === 'performances' ? performances : detail === 'gala' ? gala : detail === 'inquiry' ? musicInquiry : music) :
    page === 'collection' ? (world ? worldPage(world) : collection) :
    page === 'products' ? productPage(detail) :
    page === 'objects' ? objects :
    page === 'atelier' ? atelier :
    page === 'journal' ? journal : page === 'lounge' ? <Lounge/> : privatePage;

  return <LangCtx.Provider value={en}><div className={'belior' + (page === 'products' && detail === 'no-16' ? ' ivory' : '')}>
    <div className="curtain" ref={curtainRef} aria-hidden="true"><div className="c-inner"><img className="c-mark" src={V('lion-motif.jpg')} alt=""/>
      <span className="c-world">LION</span><span className="c-line"/><span className="c-label">{LABELS[path] || 'BELiOR'}</span></div></div>
    <div className="topline"><span>A More Beautiful Tomorrow</span><span>Seoul</span></div>
    <header className="site-header">
      <button className="menu-btn" type="button" aria-expanded={menu} aria-controls="belior-menu" onClick={() => setMenu(!menu)}>{menu ? 'CLOSE' : 'MENU'}</button>
      <a className="brand" href="/" aria-label="BELiOR home"><img src={V(page === 'products' && detail === 'no-16' ? 'mono-black.png' : 'mono-ivory.png')} alt="BELiOR" width={22} height={43}/></a>
      <div className="head-right"><button className="lang" type="button" onClick={() => setEn(!en)} aria-label="Change language">{en ? 'KR' : 'EN'}</button><a className="head-link" href="/lounge">LOUNGE</a><a className="head-link" href="/private">PRIVATE ENQUIRIES</a></div>
    </header>
    <nav className="menu-panel" id="belior-menu" hidden={!menu} aria-label="Menu">
      <div className="m-grid">{MENU.map(m => <div className="m-col" key={m.href}>
        <a className="m-head" href={m.href} aria-current={path === m.href || path.startsWith(m.href + '/') ? 'page' : undefined}>{m.name}<small>{en ? '' : m.ko}</small></a>
        <div className="m-subs">{m.subs.map(([h, ko, eng]) => <a href={h} key={h}>{t(ko, eng)}</a>)}</div></div>)}</div>
      <div className="m-foot"><img src={V('lion-motif.jpg')} alt=""/><span className="label">BELiOR · Maison de l’Art de Vivre</span></div>
    </nav>
    <main>{content}</main>
    <footer className="site-footer">
      <div className="foot-top"><div className="foot-brand"><img src={V('mono-ivory.png')} alt="BELiOR" width={33} height={64}/><span className="wordmark">BELiOR</span><span className="label">Music · Art · People · Places</span></div>
        <nav className="foot-nav" aria-label="Footer">{MENU.map(m => <a href={m.href} key={m.href}>{m.name}</a>)}</nav></div>
      <p className="foot-mail"><a href={'mailto:' + MAIL}>{MAIL}</a><a href={'mailto:' + MAIL2}>{MAIL2}</a></p>
      <p className="foot-biz">{t('상호', 'Company')} 벨리오르(BELIOR) · {t('대표', 'CEO')} {t('여혜린', 'Hyerin Yeo')} · {t('사업자등록번호', 'Business No.')} 450-54-01129</p>
    </footer>
    <EnquiryDock/>
  </div></LangCtx.Provider>;
}

function paint(c: HTMLDivElement, turn: Turn, label: string) {
  const mark = c.querySelector('.c-mark') as HTMLImageElement | null, w = c.querySelector('.c-world'), l = c.querySelector('.c-label');
  if (mark) mark.src = turn.mark;
  if (w) w.textContent = turn.world;
  if (l) l.textContent = label;
  c.classList.toggle('round', turn.round);
  c.style.setProperty('--world', turn.color);
}
