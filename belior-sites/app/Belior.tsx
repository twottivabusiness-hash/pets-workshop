"use client";
import {createContext, Fragment, useContext, useEffect, useRef, useState} from 'react';
import type {FormEvent, ReactNode} from 'react';
import './belior.css';

/* BELiOR — the maison site.
   The film and chapter scenes open the house, the original maison follows below,
   and the animal collection extends it world by world. */

const V = (n: string) => '/belior/v3/' + n;
const MAIL = 'twottiva.business@gmail.com';

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
    chips: ['#f2b25c', '#e2803a', '#9c3a1c', '#2a120a'], img: null, alt: null, tag: ['Born Beyond Limits.', '한계를 넘어 다시 태어나다.'],
    world: ['불꽃 속에서 다시 태어나는 불사조. 끝이 아닌 시작을 노래하는 세계입니다.', 'The phoenix, reborn in fire. A world that sings of beginnings, not endings.'],
    notes: null, scent: null, atelier: null},
];

const MENU: {href: string; name: string; ko: string; subs: [string, string, string][]}[] = [
  {href: '/maison', name: 'MAISON', ko: '메종', subs: [['/maison', '하우스 소개', 'The house'], ['/maison#house', '무대에서 시작된 하우스', 'Born on stage'], ['/maison#symbol', '심볼 체계', 'Symbol system']]},
  {href: '/music', name: 'MUSIC & EXPERIENCE', ko: '음악과 경험', subs: [['/music/artists', '연주진', 'Artists'], ['/music/performances', '공연 포트폴리오', 'Performances'], ['/music/gala', 'Brand Gala Dinner Show', 'Brand Gala Dinner Show'], ['/music/inquiry', '공연 문의', 'Performance inquiry']]},
  {href: '/collection', name: 'COLLECTION', ko: '동물 컬렉션', subs: WORLDS.map(w => ['/collection/' + w.slug, w.name[0] + w.name.slice(1).toLowerCase(), w.name[0] + w.name.slice(1).toLowerCase()] as [string, string, string])},
  {href: '/products', name: 'PARFUM & OBJECTS', ko: '향과 오브제', subs: [['/products/no-16', 'No. 16 — 숲과 말', 'No. 16 — Forest & Horse'], ['/products/parfum', 'Parfum', 'Parfum'], ['/objects', 'Selected Objects', 'Selected Objects']]},
  {href: '/atelier', name: 'ATELIER', ko: '아틀리에', subs: [['/atelier', '콘텐츠 제작', 'Content direction'], ['/atelier#poster', '포스터 아틀리에', 'Poster atelier'], ['/atelier#process', '제작의 순서', 'Process']]},
  {href: '/journal', name: 'JOURNAL', ko: '저널', subs: [['/journal', '모든 이야기', 'All stories']]},
  {href: '/private', name: 'PRIVATE ENQUIRIES', ko: '프라이빗 문의', subs: [['/private', '문의하기', 'Enquire']]},
];

// page-turn: the destination label, and the animal shown on each turn (Lion first, then the house in order)
const LABELS: Record<string, string> = {
  '/': 'BELiOR', '/maison': 'MAISON', '/music': 'MUSIC & EXPERIENCE', '/music/artists': 'ARTISTS', '/music/performances': 'PERFORMANCES',
  '/music/gala': 'BRAND GALA DINNER SHOW', '/music/inquiry': 'PERFORMANCE INQUIRY', '/collection': 'THE COLLECTION', '/products': 'PARFUM & OBJECTS',
  '/products/no-16': 'No. 16', '/objects': 'OBJECTS', '/atelier': 'ATELIER', '/journal': 'JOURNAL', '/private': 'PRIVATE ENQUIRIES',
};
WORLDS.forEach(w => { LABELS['/collection/' + w.slug] = w.name + ' COLLECTION'; });
type Turn = {world: string; mark: string; round: boolean; color: string};
const SEQUENCE: Turn[] = [{world: 'LION', mark: V('lion-motif.jpg'), round: false, color: '#c9a35f'},
  ...WORLDS.slice(1).map(w => ({world: w.name, mark: V('emblem-' + w.slug + '.jpg'), round: true, color: w.color}))];
const OWN: Record<string, Turn> = Object.fromEntries(WORLDS.map((w, i) => ['/collection/' + w.slug, i === 0 ? SEQUENCE[0] : {world: w.name, mark: V('emblem-' + w.slug + '.jpg'), round: true, color: w.color}]));

const lines = (s: string) => s.split('\n').map((p, i, a) => <Fragment key={i}>{p}{i < a.length - 1 && <br/>}</Fragment>);

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

/* Swan Lake rehearsal, one shared player with a slow fade-in */
let swanAudio: HTMLAudioElement | null = null;
function swan() {
  if (!swanAudio) { swanAudio = new Audio('/belior/v3/swan-lake.m4a'); swanAudio.loop = true; swanAudio.preload = 'none'; }
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
  return <a className="door" href={href}><div className="ph"><img src={V(img)} alt="" loading="lazy" style={{objectPosition: pos}}/></div><span className="label">{eyebrow}</span><h3>{title}</h3><p>{text}</p><span className="more">Explore</span></a>;
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
      <h2>{lines(t('예술이 머무는 저녁,\n더 아름다운 내일을 위한 집.', 'An evening where art lingers,\na house for a more beautiful tomorrow.'))}</h2>
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
    <div className="copy c-6"><span className="label">The House</span><h3>{t('무대에서 시작된 하우스', 'A house born on stage')}</h3>
      <p className="muted">{t('실제 무대에서 태어난 BELiOR는 라이브 음악을 프라이빗 이벤트 연출과 예술 기획, 오브제, 그리고 하루 저녁보다 오래 남는 시각 언어로 넓혀 갑니다.', 'Born on real stages, BELiOR extends live music into private event direction, art planning, objects and a visual language that outlasts a single evening.')}</p>
      <h3 className="sub">{t('무대는 TWOTTIVA가 연주합니다', 'The stage is played by TWOTTIVA')}</h3>
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
        <a className="ev-card" href="/music"><span className="label">01 · Music &amp; Experience</span><h3>{t('그 저녁', 'The evening')}</h3><p className="muted">{t('호텔, 브랜드, 프라이빗 갈라 디너를 위한 현악 4중주와 확장 편성, 그리고 맞춤 챔버 연출.', 'String quartets, larger ensembles and bespoke chamber direction for hotels, brands and private gala dinners.')}</p><span className="more">Explore</span></a>
        <a className="ev-card" href="/objects"><span className="label">02 · Objects</span><h3>{t('일상으로 옮긴 예술', 'Art carried into daily life')}</h3><p className="muted">{t('하우스의 시각 언어에서 출발한 스카프와 가죽 소품, 그리고 개인의 오브제.', 'Scarves, leather goods and personal objects drawn from the house’s visual language.')}</p><span className="more">Explore</span></a>
      </div></div></section>;
}

function AtelierContent() {
  const {t, en} = useT(); void t; void en;
  return <section className="section night" id="poster"><div className="spread">
    <div className="copy c-5"><span className="label">BELiOR Atelier · Content</span><h3>{t('무대를 완성하는 콘텐츠', 'Content that completes the stage')}</h3>
      <p className="muted">{t('무대 배경 영상과 영상 편집, 프로그램 그래픽, 연주자 포스터까지 행사의 콘셉트에 맞춰 기획하고 제작합니다.', 'Stage visuals, film editing, programme graphics and artist posters, planned and made to the concept of each event.')}</p><a className="more" href="/atelier">{t('콘텐츠 제작 보기', 'See content direction')}</a></div>
    <div className="c-7 pair"><figure><img src={V('o-content-stage-video.jpg')} alt={t('무대 배경 영상과 함께하는 공연', 'Performance with stage visuals')} loading="lazy"/><figcaption>{t('무대 배경 영상', 'Stage visuals')}</figcaption></figure>
      <figure><img src={V('o-poster-pirates.jpg')} alt={t('연주자 포스터', 'Artist poster')} loading="lazy"/><figcaption>{t('연주자 포스터', 'Artist poster')}</figcaption></figure></div>
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
      <Door href="/objects" img="o-prod-3.jpg" eyebrow="Silk & Textile" title={t('실크와 직물', 'Silk & textile')} text={t('물성과 움직임, 그리고 밤하늘의 붓결.', 'Material, movement and brushstrokes of the night sky.')}/>
      <Door href="/maison#symbol" img="lion-motif.jpg" eyebrow="The Monogram" title={t('B 모노그램', 'The B monogram')} text={t('현처럼 곧게 선 획 위에 별을 얹은 하우스의 이니셜.', 'The house initial: a stroke straight as a string, crowned with a star.')}/>
    </div></section>;
}

function Services() {
  const {t, en} = useT(); void t; void en;
  return <><section className="section night"><Head eyebrow="Services" title={t('하우스의 세 가지 챕터', 'Three chapters of the house')}/>
    <div className="rows">
      <a className="row" href="/atelier"><h3>Content Direction</h3><p>{t('브랜드 · 행사 콘텐츠 기획', 'Brand and event content')}</p><span className="more">Explore</span></a>
      <a className="row" href="/atelier#poster"><h3>Poster Atelier</h3><p>{t('포스터 및 비주얼 제작', 'Posters and visuals')}</p><span className="more">Explore</span></a>
      <a className="row" href="/music/inquiry"><h3>Performance Inquiry</h3><p>{t('공연 및 프라이빗 이벤트 문의', 'Performances and private events')}</p><span className="more">Inquire</span></a>
    </div></section>
    <section className="section"><div className="statement"><img src={V('mono-ivory.png')} alt="" width={34} height={67}/>
      <h2>{t('“더 아름다운 내일은, 오늘의 한 순간을 어떻게 짜는가에서 시작됩니다.”', '“A more beautiful tomorrow begins with how we compose a single moment today.”')}</h2><p className="label">BELiOR · Music · Art · People · Places</p></div></section></>;
}

function InquiryForm({music}: {music?: boolean}) {
  const {t, en} = useT(); void en;
  const [status, setStatus] = useState(''), [sending, setSending] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>, compose?: (d: Record<string, string>) => string) {
    e.preventDefault(); setSending(true); setStatus('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    if (compose) data.message = compose(data);
    try {
      const r = await fetch('/api/inquiries', {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data)});
      if (!r.ok) throw Error();
      setStatus(t('문의가 접수되었습니다. 남겨주신 이메일로 회신드리겠습니다.', 'Your inquiry has been received. We will reply to your email.'));
      form.reset();
    } catch { setStatus(t('접수하지 못했습니다. 이메일로 문의해 주세요.', 'Unable to submit. Please contact us by email.')); }
    finally { setSending(false); }
  }

    const compose = music ? (d: Record<string, string>) => [
      `${t('행사명', 'Event')}: ${d.event || '-'}`, `${t('장소', 'Venue')}: ${d.venue || '-'}`, `${t('예상 인원', 'Guests')}: ${d.guests || '-'}`,
      `${t('연주 시간', 'Performance length')}: ${d.length || '-'}`, `${t('예산', 'Budget')}: ${d.budget || '-'}`, '', d.message || ''].join('\n') : undefined;
    return <form className="form" onSubmit={e => submit(e, compose)}>
      <div className="field"><label htmlFor="f-name">{t('성함 / 회사', 'Name / Company')}</label><input id="f-name" name="name" required maxLength={120}/></div>
      <div className="field"><label htmlFor="f-email">{t('이메일', 'Email')}</label><input id="f-email" type="email" name="email" required maxLength={180}/></div>
      <div className="field"><label htmlFor="f-type">{t('문의 유형', 'Inquiry type')}</label><select id="f-type" name="type">
        {(music ? ['Corporate event', 'Hotel reception', 'Gala dinner', 'Brand event', 'VIP reception', 'Private performance'] : ['Private performance', 'Brand / corporate event', 'Corporate gifting', 'Atelier collaboration', 'Collection']).map(o => <option key={o}>{o}</option>)}</select></div>
      <div className="field"><label htmlFor="f-date">{t('예정일', 'Preferred date')}</label><input id="f-date" type="date" name="date"/></div>
      {music && <><div className="field"><label htmlFor="f-event">{t('행사명', 'Event')}</label><input id="f-event" name="event" maxLength={120}/></div>
        <div className="field"><label htmlFor="f-venue">{t('장소', 'Venue')}</label><input id="f-venue" name="venue" maxLength={120}/></div>
        <div className="field"><label htmlFor="f-guests">{t('예상 인원', 'Guests')}</label><input id="f-guests" name="guests" maxLength={40}/></div>
        <div className="field"><label htmlFor="f-length">{t('연주 시간', 'Performance length')}</label><input id="f-length" name="length" maxLength={60}/></div>
        <div className="field wide"><label htmlFor="f-budget">{t('예산', 'Budget')}</label><input id="f-budget" name="budget" maxLength={60}/></div></>}
      <div className="field wide"><label htmlFor="f-msg">{t('문의 내용', 'Your inquiry')}</label><textarea id="f-msg" name="message" required rows={5} maxLength={3400}/></div>
      <label className="consent wide"><input type="checkbox" required/>{t('문의 응대를 위한 성함·이메일·문의 내용 수집에 동의합니다. 처리 후 1년 이내 삭제하며 이메일로 삭제를 요청할 수 있습니다.', 'I consent to the collection of my name, email and inquiry for response purposes. Records are deleted within one year of resolution; deletion may be requested by email.')}</label>
      <button className="btn" disabled={sending}>{sending ? t('접수 중…', 'Submitting…') : t('문의 보내기', 'Send inquiry')}</button>
      <p className="wide" role="status">{status}</p>
    </form>;
  
}

export default function Belior({page = 'home', detail = ''}: {page?: string; detail?: string}) {
  const [en, setEn] = useState(false), [menu, setMenu] = useState(false);
  const [filmPaused, setFilmPaused] = useState(false), [slide, setSlide] = useState(0);
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
    const els = document.querySelectorAll('.belior .scene, .belior .world');
    if (!('IntersectionObserver' in window)) { els.forEach(el => el.classList.add('seen')); return; }
    const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); } }), {threshold: .2});
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [page, detail]);


  /* ---------- pages ---------- */
  const home = <>
    <section className="scene film" aria-label="BELiOR brand film">
      <video ref={filmRef} className="bg" src={V('belior-film.webm')} poster={V('film-poster.jpg')} muted loop playsInline autoPlay preload="metadata"/>
      <button className="film-toggle" type="button" aria-label={filmPaused ? t('영상 재생', 'Play film') : t('영상 일시정지', 'Pause film')}
        onClick={() => { const f = filmRef.current; if (!f) return; if (f.paused) { void f.play().catch(() => {}); setFilmPaused(false); } else { f.pause(); setFilmPaused(true); } }}>
        <span aria-hidden="true">{filmPaused ? '▶' : 'II'}</span></button>
      <div className="film-sound"><SoundButton label="Swan Lake · Rehearsal"/></div>
    </section>
    <Scene img="bu-quartet.jpg" eyebrow="Music & Experience" title={'The Art of a\nLiving Moment'} lede={t('살아 있는 순간의 예술', 'The art of a living moment')} pos="60% center" href="/music"/>
    <Scene img="bu-aerial.jpg" eyebrow="Editorial" title={'Brand Gala\nDinner Show'} lede={t('강 위로 저무는 저녁', 'An evening setting over the river')} pos="center 60%" href="/music/gala"/>
    <Scene img="lion-portrait.jpg" eyebrow="Collection" title={'One Symbol.\nEndless Worlds.'} lede={t('하나의 상징, 끝없는 세계', 'One symbol, endless worlds')} pos="center 30%" href="/collection"/>
    <section className="carousel" aria-label={t('여섯 개의 컬렉션', 'Six collections')}>
      <div className="track" ref={trackRef} onScroll={e => setSlide(Math.round(e.currentTarget.scrollLeft / Math.max(1, e.currentTarget.clientWidth)))}>
        {WORLDS.map(w => <div className="slide" role="group" aria-label={w.name} key={w.slug} style={{['--world' as string]: w.color}}>
          <img className="bg" src={V(w.img || 'phoenix.jpg')} alt="" loading="lazy"/>
          <div className="inner"><span className="label">The Animal Collection</span><h2>{w.name}</h2><p className="lede">{w.kw}</p><Cta href={'/collection/' + w.slug}/></div></div>)}
      </div>
      <div className="dots">{WORLDS.map((w, i) => <button type="button" className="dot" key={w.slug} aria-label={w.name} aria-current={slide === i}
        onClick={() => trackRef.current?.scrollTo({left: i * (trackRef.current?.clientWidth || 0), behavior: 'smooth'})}/>)}</div>
    </section>
    <MaisonHero/><MaisonIntro/><TheHouse/><TheEvening/><AtelierContent/><OneWorld/>
    <section className="section night"><div className="spread">
      <figure className="c-5"><img src={V('no16-hero.jpg')} alt={t('숲속에서 말에 오른 아이', 'A child on a horse in the forest')} loading="lazy"/><figcaption>No. 16</figcaption></figure>
      <div className="copy c-6" style={{gridColumn: '7 / span 6'}}><span className="label">Parfum · No. 16</span><h3>A memory, held.</h3>
        <p className="muted">{t('어린 시절, 아버지가 지켜보는 가운데 처음 말에 올랐던 순간. 무서웠지만 나를 지탱해 주던 말과 푸릇한 숲의 기억을 하나의 향에 담습니다.', 'As a child, I rode a horse for the first time while my father watched. I was afraid, yet the horse held me steady. That green, fairy-tale forest becomes a scent.')}</p>
        <a className="more" href="/products/no-16">{t('No. 16 이야기', 'The story of No. 16')}</a></div></div></section>
    <ObjectsRow/><Services/>
    <Scene img="gala-hall.jpg" eyebrow="Private Enquiries · By Invitation" title="By Appointment" lede={t('공연과 컬렉션, 프라이빗 이벤트에 관한 문의', 'Enquiries for performances, collections and private events')} href="/private" cta={t('문의하기', 'Enquire')}/>
  </>;

  const maison = <>
    <Scene img="o-hero-salon.jpg" eyebrow="Maison de l’Art de Vivre" title={'A Heritage for a\nBrighter Tomorrow'} lede={t('음악에서 시작된 하나의 하우스. Art · People · Places and beauty.', 'A house that began in music. Art · People · Places and beauty.')}/>
    <MaisonIntro/><TheHouse/>
    <section className="section" id="symbol"><Head eyebrow="Symbol System" title={t('하나의 하우스, 하나의 심볼, 여섯 개의 세계', 'One house, one symbol, six worlds')}
      text={t('메종 심볼은 하우스 전체를, 사자-B 모노그램은 동물 세계관의 시작을, 여섯 엠블럼은 각 컬렉션을 대표합니다.', 'The maison symbol stands for the whole house, the lion-B monogram opens the animal worlds, and six emblems stand for each collection.')}/>
      <div className="symbols three">
        <div className="symbol-card"><div className="mark"><img src={V('mono-ivory.png')} alt="BELiOR maison symbol" width={76} height={150}/></div><span className="label">Maison Symbol</span><h3>{t('메종 심볼', 'Maison symbol')}</h3><p className="muted">{t('하우스의 공식 표기. 사이트 상단과 모든 공식 문서에 사용합니다.', 'The official mark of the house, used at the top of the site and on all official documents.')}</p></div>
        <div className="symbol-card"><div className="mark"><img src={V('lion-motif.jpg')} alt="Lion-B monogram" style={{maxHeight: 150, borderRadius: 4}}/></div><span className="label">The Monogram</span><h3>{t('사자-B 모노그램', 'Lion-B monogram')}</h3><p className="muted">{t('현처럼 곧게 선 획 위에 별을 얹은 이니셜. 동물 세계관으로 들어가는 문입니다.', 'An initial straight as a string, crowned with a star. The door to the animal worlds.')}</p></div>
        <div className="symbol-card"><div className="mini">{WORLDS.map(w => <a href={'/collection/' + w.slug} key={w.slug}><img src={V('emblem-' + w.slug + '.jpg')} alt={w.name + ' emblem'}/></a>)}</div><span className="label">Collection Emblems</span><h3>{t('여섯 엠블럼', 'Six emblems')}</h3><p className="muted">LION · SWAN · ORCA · LEOPARD · PANTHER · PHOENIX.</p></div>
      </div></section>
    <OneWorld/><Services/>
  </>;

  const music = <>
    <Scene img="bu-quartet.jpg" eyebrow="BELiOR Music & Experience" title={'The Art of a\nLiving Moment'} lede={t('살아 있는 순간의 예술. 실제 무대와 현장에서 연주하는 BELiOR의 음악입니다.', 'Music performed live, on real stages and at real events.')} pos="60% center"/>
    <section className="section"><Head eyebrow="Music" title={t('음악은 저녁을 작곡합니다', 'Music composes the evening')} text="Where Music Becomes Memory."/>
      <div className="doors">
        <Door href="/music/artists" img="bu-backstage.jpg" eyebrow="Artists" title={t('연주진', 'Artists')} text={t('현장에서 함께 호흡하는 연주진.', 'The musicians on stage.')}/>
        <Door href="/music/performances" img="o-gala-ensemble.jpg" eyebrow="Performances" title={t('공연 포트폴리오', 'Performances')} text={t('BELiOR와 TWOTTIVA가 함께한 무대.', 'Stages shared by BELiOR and TWOTTIVA.')}/>
        <Door href="/music/gala" img="bu-violinist.jpg" eyebrow="Editorial" title="Brand Gala Dinner Show" text={t('현장 · 리셉션 · 백스테이지의 기록.', 'On site · Reception · Backstage.')} pos="center 20%"/>
        <Door href="/music/inquiry" img="bu-violin.jpg" eyebrow="Inquiry" title={t('공연 문의', 'Inquiry')} text={t('행사 정보를 남기면 프로그램을 제안드립니다.', 'Share your event and we will propose a programme.')}/>
      </div></section>
    <TheEvening/><TheHouse/>
    <section className="section"><div className="statement"><span className="label">An Evening</span><h2>An Evening, Beautifully Composed.</h2><p>{t('아름답게 구성된 하나의 저녁.', 'One evening, beautifully composed.')}</p><Cta href="/music/inquiry">{t('공연 문의', 'Inquire')}</Cta></div></section>
  </>;

  const artists = <>
    <Scene img="bu-backstage.jpg" eyebrow="Music · Artists" title={t('BELiOR 연주진', 'BELiOR Artists')} lede="Beyond Performance. An Experience." pos="center 35%"/>
    <section className="section"><Head eyebrow="The Ensemble" title={t('현악 4중주 편성', 'String quartet')} text={t('BELiOR의 무대는 현악앙상블 TWOTTIVA가 연주합니다.', 'BELiOR’s stage is performed by TWOTTIVA string ensemble.')}/>
      <div className="roles">{[['여혜린', 'Hyerin Yeo', 'Violin I · Founder & Artistic Director'], ['김사무엘', 'Samuel Kim', 'Violin II'], ['김도현', 'Dohyun Kim', 'Viola'], ['김요한', 'Yohan Kim', 'Cello']].map(([ko, eng, role]) =>
        <div className="role" key={ko}><span className="label">{role}</span><h3>{t(ko, eng)}</h3></div>)}</div></section>
    <TheHouse/>
    <Band img="bu-violinist.jpg" eyebrow="On Site" title={t('무대가 아닌 곳에서도,\n무대처럼', 'On stage,\neven off stage')} text={t('야외 잔디와 리셉션 공간, 디너 테이블 사이에서 행사의 흐름에 맞춰 연주합니다.', 'On lawns, in reception halls and between dinner tables, we play to the flow of the event.')} href="/music/performances" cta={t('공연 보기', 'Performances')} pos="center 25%"/>
  </>;

  const performances = <>
    <Scene img="o-gala-ensemble.jpg" eyebrow="Music · Performances" title={t('공연 포트폴리오', 'Performances')} lede="The Sound of an Extraordinary Evening."/>
    <section className="section"><Head eyebrow="Portfolio" title={t('함께한 저녁', 'Evenings we shared')}/>
      <div className="rows">
        <a className="row" href="/music/gala"><h3>Brand Gala Dinner Show</h3><p>{t('서울 · 한강을 내려다보는 야외 디너 · 현악 4중주 라이브 연주', 'Seoul · Outdoor dinner above the Han River · Live string quartet')}</p><span className="more">Editorial</span></a>
        <div className="row"><h3>{t('KBS홀 한·체코 수교 35주년 기념음악회', 'KBS Hall, Korea–Czech 35th Anniversary Concert')}</h3><p>TWOTTIVA</p><span/></div>
        <div className="row"><h3>{t('한국여성공인회계사회 정기총회 및 회장 이·취임식', 'Korea Women CPA Association, Inauguration')}</h3><p>TWOTTIVA</p><span/></div>
        <div className="row"><h3>{t('호텔 연회 · 기업행사 · VIP 리셉션', 'Hotel banquets · Corporate events · VIP receptions')}</h3><p>TWOTTIVA</p><span/></div>
      </div>
      <p className="muted small" style={{marginTop: 20}}>{t('공연 이력은 TWOTTIVA와 각 연주자의 이력입니다.', 'Performance history belongs to TWOTTIVA and its musicians.')}</p>
      <video className="performance-video" controls playsInline preload="metadata" src="/belior/rehearsal.mp4"/></section>
    <TheEvening/>
    <Band img="bu-quartet.jpg" eyebrow="For Your Evening" title={t('행사의 성격에 맞춘\n프로그램', 'A programme shaped\nto your event')} text={t('행사 일정과 장소, 진행 순서를 바탕으로 편성과 곡목을 제안드립니다.', 'We propose ensemble and repertoire around your schedule, venue and running order.')} href="/music/inquiry" cta={t('공연 문의', 'Inquire')} pos="60% center"/>
  </>;

  const gala = <>
    <Scene img="bu-aerial.jpg" eyebrow="Editorial · Brand Gala Dinner Show, Seoul" title={t('강 위로 저무는 저녁', 'An evening over the river')} lede={t('브랜드 갈라 디너 쇼에서 BELiOR는 현장의 라이브 연주를 맡았고, 연주에 대해 좋은 평가를 받았습니다.', 'At a brand gala dinner show, BELiOR performed live and was well received.')} pos="center 55%"/>
    <section className="section">
      <div className="spread"><figure className="c-8"><img src={V('bu-quartet.jpg')} alt={t('행사장 앞 야외 4중주', 'Outdoor quartet at the venue')} loading="lazy"/><figcaption>I. Reception</figcaption></figure>
        <div className="copy c-4"><span className="label">Reception</span><h3>{t('손님이 도착하는 시간', 'As the guests arrive')}</h3><p className="muted">{t('조명이 켜지기 시작할 무렵, 리셉션의 공기를 현악 4중주로 채웠습니다.', 'As the lights came on, a string quartet filled the reception.')}</p></div></div>
      <div className="spread"><div className="copy c-5"><span className="label">The Venue</span><h3>{t('원형 테이블과 한강', 'Round tables and the river')}</h3><p className="muted">{t('언덕 위 잔디에 놓인 원형 디너 테이블, 그 너머로 강과 다리가 이어지는 풍경입니다.', 'Round dinner tables on a hillside lawn, with the river and bridges beyond.')}</p></div>
        <figure className="c-6" style={{gridColumn: '7 / span 6'}}><img src={V('bu-violinist.jpg')} alt={t('잔디 위의 바이올리니스트', 'Violinist on the lawn')} loading="lazy"/><figcaption>II. Venue</figcaption></figure></div>
      <div className="spread"><figure className="c-5"><img src={V('bu-violin.jpg')} alt={t('바이올린 클로즈업', 'Violin close-up')} loading="lazy"/><figcaption>III. Detail</figcaption></figure>
        <figure className="c-7"><img src={V('bu-backstage.jpg')} alt={t('공연을 마친 연주진', 'The musicians after the show')} loading="lazy"/><figcaption>IV. Backstage</figcaption></figure></div>
    </section>
    <section className="section night"><div className="statement"><span className="label">BELiOR Music</span><h2>Where Music Becomes Memory.</h2><p>{t('음악이 기억이 되는 순간.', 'Where music becomes memory.')}</p><Cta href="/music/inquiry">{t('공연 문의', 'Inquire')}</Cta></div></section>
  </>;

  const musicInquiry = <>
    <section className="lux-hero"><img className="bg" src={V('gala-hall.jpg')} alt={t('촛불이 켜진 연회장에서 연주하는 앙상블', 'An ensemble performing in a candlelit hall')}/>
      <div className="inner"><span className="label">BELiOR Music · Performance Enquiry</span><h1 className="keep">{lines(t('당신의 저녁을 위해\n작곡합니다.', 'An evening,\ncomposed for you.'))}</h1></div></section>
    <section className="lux-form"><div className="lf-intro"><span className="label">The Enquiry</span><h2>{lines(t('일정과 장소,\n원하시는 분위기를 들려주세요.', 'Tell us the date, the place\nand the atmosphere you imagine.'))}</h2>
      <p className="muted">{t('모르는 항목은 비워두셔도 됩니다. 확인 후 프로그램과 편성을 제안드립니다.', 'Leave blank anything you are unsure of. We will reply with a programme and ensemble.')}</p>
      <p className="lf-mail">{MAIL}</p></div>
      <InquiryForm music/></section>
  </>;

  const collection = <>
    <Scene img="lion-wide.jpg" eyebrow="The Animal Collection" title={'One Symbol.\nEndless Worlds.'} lede={t('하나의 상징, 끝없는 세계. BELiOR의 메종 위에 여섯 동물의 세계가 펼쳐집니다.', 'One symbol, endless worlds. Six animal worlds unfold upon the maison.')} pos="center 35%"/>
    <section className="section"><div className="spread">
      <div className="copy c-6"><span className="label">From the Maison</span><h3>{t('메종에서 시작된 여섯 개의 세계', 'Six worlds that began in the maison')}</h3>
        <p className="muted">{t('음악과 오브제로 쌓아 온 BELiOR의 하우스 위에, 사자의 모노그램에서 출발한 동물들의 세계관을 더합니다. 각 세계는 고유의 색과 소재, 향과 사물을 가집니다.', 'Upon the house of music and objects, BELiOR adds animal worlds that begin with the lion monogram. Each has its own colour, material, scent and objects.')}</p>
        <blockquote className="note-founder"><span className="label">Founder’s Note</span><p>{t('사자는 강인하고 멋집니다. 호랑이는 홀로 살아남아야 하는 자연의 섭리 속에서도 웅장합니다. 그 마음이 BELiOR의 세계관이 되었습니다.', 'The lion is strong and magnificent. The tiger, though nature asks it to survive alone, is grand. That feeling became the world of BELiOR.')}</p></blockquote>
        <a className="more" href="/maison">{t('메종 보기', 'The maison')}</a></div>
      <figure className="c-5" style={{gridColumn: '8 / span 5'}}><img src={V('lion-motif.jpg')} alt="Lion-B monogram" loading="lazy"/><figcaption>The Monogram</figcaption></figure></div></section>
    <section className="section night"><Head eyebrow="Emblem Collection" title={t('여섯 개의 엠블럼', 'Six emblems')}/><Emblems items={WORLDS}/></section>
    <div className="worlds">{WORLDS.map(w => <a className="world" href={'/collection/' + w.slug} key={w.slug} style={{['--world' as string]: w.color}}>
      <img className="bg" src={V(w.img || 'phoenix.jpg')} alt="" loading="lazy"/><span className="label mat" style={{color: w.color}}>{w.mat}</span>
      <div className="txt"><h3>{w.name}</h3><span className="kw">{w.kw}</span><span className="more" style={{color: w.color}}>Explore</span></div></a>)}</div>
    <section className="section"><Head eyebrow="Pattern & Motif" title={t('세계마다 다른 결', 'A texture for every world')}/>
      <div className="patterns">{WORLDS.map(w => <figure key={w.slug}><img src={V(w.slug + '-pattern.jpg')} alt={w.name + ' pattern'} loading="lazy"/><figcaption>{w.name} · {w.mat}</figcaption></figure>)}</div></section>
    <section className="section night" id="lines"><Head eyebrow="From World to Object" title={t('세계관이 사물이 되기까지', 'From world to object')} text={t('각 컬렉션은 PARFUM · BAGS · APPAREL · OBJECTS로 이어집니다. 제품은 공개 준비 중입니다.', 'Each collection extends into parfum, bags, apparel and objects. Products are in development.')}/>
      <div className="lines">{[['PARFUM', 'prod-parfum.jpg'], ['BAGS', 'prod-bag.jpg'], ['APPAREL', 'prod-clothing.jpg'], ['OBJECTS', 'prod-objects.jpg']].map(([n, im]) =>
        <div className="line-item" key={n}><div className="ph"><img src={V(im)} alt={n} loading="lazy"/></div><span className="label">{n}</span></div>)}</div></section>
    <OneWorld/>
  </>;

  const worldPage = (w: World) => {
    const i = WORLDS.indexOf(w), nxt = WORLDS[(i + 1) % WORLDS.length];
    const lede = w.tag ? (en ? w.tag[0] : w.tag[0] + ' ' + w.tag[1]) : w.kw;
    const mock = w.slug !== 'phoenix';
    return <div className="world-page" style={{['--world' as string]: w.color}}>
      {w.img ? <Scene img={w.img} eyebrow={'The Animal Collection · ' + w.mat} title={w.name + '\nCollection'} lede={lede} pos="center 35%"/> :
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
      {w.alt && <section className="section"><figure className="wide-fig"><img src={V(w.alt)} alt="" loading="lazy"/><figcaption>The World of {w.name}</figcaption></figure></section>}
      <section className="section night"><Head eyebrow="Other Worlds" title={t('다른 세계로', 'Other worlds')}/><Emblems items={WORLDS.filter(x => x !== w)} five/></section>
      <Band img={nxt.img || 'lion-wide.jpg'} eyebrow="Next World" title={nxt.name} text={nxt.kw} href={'/collection/' + nxt.slug} cta={t('다음 세계', 'Next world')}/>
      <OneWorld/>
    </div>;
  };

  const no16 = <div className="no16">
    <section className="n16-hero"><img className="bg" src={V('no16-hero.jpg')} alt={t('푸른 숲에서 말에 오른 아이와 지켜보는 아버지', 'A child on a horse in a green forest, her father watching')}/>
      <div className="inner"><h1 className="keep">No.16<br/>A memory, held.</h1><p className="lede">{t('푸른 숲, 나를 지탱해주던 기억.', 'A green forest, and the memory that held me.')}</p>
        <a className="line-cta" href="#memory">DISCOVER THE STORY <span aria-hidden="true">→</span></a></div></section>
    <section className="n16-stay"><div className="txt"><h2>The moments that stay.</h2>
      <p>{lines(t('향은 우리를 어떤 장소로 데려갑니다 —\n우리를 만든 감정과, 여전히 안에 살아 있는\n고요한 힘으로.', 'Scent can return us to a place —\nto the feelings that shaped us, and the quiet strength\nthat still lives within.'))}</p></div>
      <img src={V('no16-stream.jpg')} alt={t('햇살이 비치는 이끼와 시냇물', 'Moss and a sunlit stream')} loading="lazy"/></section>
    <section className="n16-memory" id="memory">
      <div className="n16-top"><div className="txt"><span className="label">No.16 / The Memory</span><h2>{lines('Before it was a scent,\nit was a memory.')}</h2>
        <p>{lines(t('어린 시절, 아빠가 권했던 말 위에 올랐습니다.\n무서웠지만, 말은 나를 지탱하고 있었고\n아빠는 그 모습을 지켜보고 있었습니다.', 'As a child, I climbed onto the horse my father offered.\nI was afraid, but the horse held me steady,\nand my father stood watching.'))}</p></div>
        <img src={V('no16-hand.jpg')} alt={t('말갈기에 얹은 아이의 손', 'A child’s hand on the horse’s mane')} loading="lazy"/></div>
      <div className="n16-three">{[['no16-forest.jpg', '01 — The Forest', t('이끼 낀 숲의 바닥', 'The mossy forest floor')], ['no16-warmth.jpg', '02 — The Warmth', t('햇살을 받은 말의 갈기', 'The horse’s mane in sunlight')], ['no16-presence.jpg', '03 — The Presence', t('말 위의 아이를 지켜보는 아버지', 'A father watching his child on horseback')]].map(([im, cap, alt]) =>
        <figure key={im}><img src={V(im)} alt={alt} loading="lazy"/><figcaption>{cap}</figcaption></figure>)}</div>
      <div className="n16-foot"><p>Some moments never leave us.</p><a className="line-cta" href="/journal">CONTINUE THE STORY <span aria-hidden="true">→</span></a></div>
    </section>
    <section className="n16-childhood"><span className="label">{t('어린 시절', 'Childhood')}</span>
      <p className="world-line">{t('푸릇푸릇한, 동화 속 같은 숲. 무서웠지만 나를 지탱해 주던 말. 그 순간은 지금도 선명하게 남아 있습니다.', 'A green forest, like a fairy tale. I was afraid, but the horse held me. That moment is still vivid.')}</p>
      <p>{t('BELiOR는 테마마다 하나의 이야기를 담습니다. No. 16은 그 첫 기억입니다.', 'BELiOR gives every theme a story of its own. No. 16 is the first memory.')}</p>
      <a className="line-cta" href="/private">{t('No. 16 프라이빗 문의', 'Enquire about No. 16')} <span aria-hidden="true">→</span></a></section>
  </div>;

  const productPage = (d: string) => {
    if (d === 'no-16') return no16;
    const items: [string, string, string, string][] = [['parfum', 'PARFUM', '향', 'prod-parfum.jpg'], ['bag', 'BAG', '가방', 'prod-bag.jpg'], ['clothing', 'CLOTHING', '의류', 'prod-clothing.jpg'], ['objects', 'OBJECTS', '오브제', 'prod-objects.jpg']];
    const one = items.find(x => x[0] === d);
    return <>
      <Scene img="o-mk-home-objects.jpg" eyebrow="Parfum · Bag · Clothing · Objects" title={one ? one[1] : 'The Art of Everyday'} lede={t('감각을 담는 소재, 오래 머무는 형태.', 'Materials that hold feeling. Forms that endure.')}/>
      {(d === '' || d === 'parfum') && <section className="section night"><div className="spread">
        <figure className="c-5"><img src={V('no16-horse.jpg')} alt={t('검은 말', 'A black horse')} loading="lazy"/><figcaption>No. 16</figcaption></figure>
        <div className="copy c-6" style={{gridColumn: '7 / span 6'}}><span className="label">Parfum · No. 16</span><h3>{t('숲, 그리고 나를 지탱해 준 말', 'The forest, and the horse that held me')}</h3><a className="more" href="/products/no-16">{t('이야기 보기', 'Read the story')}</a></div></div></section>}
      <section className="section"><Head eyebrow="The Art of Everyday" title={t('일상의 예술', 'The art of everyday')} text={t('출시 소식은 프라이빗 문의로 먼저 안내드립니다.', 'Launch news is shared first through private enquiries.')}/>
        <div className="lines">{items.map(([s, n, ko, im]) => <a className="line-item" href={'/products/' + s} key={s}><div className="ph"><img src={V(im)} alt={n} loading="lazy"/></div><span className="label">{n}</span><p className="muted">{t(ko, n)}</p></a>)}</div></section>
      <ObjectsRow/><OneWorld/>
    </>;
  };

  const objects = <>
    <Scene img="o-m-bag.jpg" eyebrow="Objects" title="Live with Art" lede={t('오래도록 곁에 남는 오브제, 일상의 순간을 특별하게.', 'Objects that stay with you, making the everyday special.')}/>
    <ObjectsRow/>
    <section className="section night"><div className="spread">
      <figure className="c-6"><img src={V('o-m-br-hero.jpg')} alt={t('B 모노그램 가죽 브레이슬릿', 'Leather bracelet with B monogram')} loading="lazy"/><figcaption>Leather · Monogram</figcaption></figure>
      <div className="copy c-5" style={{gridColumn: '8 / span 5'}}><span className="label">Leather Goods</span><h3>{t('모노그램을 새긴 가죽 소품', 'Leather goods with the monogram')}</h3><p className="muted">{t('하우스의 이니셜을 작은 사물에 옮깁니다.', 'The house initial, carried onto small objects.')}</p></div></div></section>
    <section className="section" id="lines"><Head eyebrow="Collection Lines" title={t('여섯 세계의 사물', 'Objects of six worlds')}/><Emblems items={WORLDS}/></section>
    <Band img="o-maison-objects.jpg" eyebrow="Maison" title={t('음악과 오브제가\n함께 머무는 곳', 'Where music and\nobjects live together')} text={t('하우스의 시각 언어에서 출발한 사물들.', 'Objects drawn from the house’s visual language.')} href="/maison" cta={t('메종 보기', 'The maison')}/>
  </>;

  const atelier = <>
    <Scene img="o-mk-home-atelier.jpg" eyebrow="Atelier" title="Craft Your Moment" lede={t('시간이 만들어내는 아름다움, 섬세한 손끝에서 시작됩니다.', 'Beauty made by time begins at the fingertips.')}/>
    <AtelierContent/>
    <section className="section" id="process"><Head eyebrow="Process" title={t('제작의 순서', 'How we make')} text={t('세부 일정과 방식은 프로젝트마다 함께 정합니다.', 'Schedules and methods are agreed project by project.')}/>
      <div className="steps">{[['Concept', '행사와 브랜드의 콘셉트, 세계관을 정합니다.', 'We set the concept and world of the event or brand.'], ['Visual', '무대 배경 영상과 프로그램 그래픽을 설계합니다.', 'We design stage visuals and programme graphics.'], ['Object', '포스터, 패키지, 오브제로 형태를 만듭니다.', 'We give it form in posters, packaging and objects.'], ['Stage', '현장에서 음악과 함께 완성합니다.', 'We complete it on site, with music.']].map(([n, ko, eng]) =>
        <div className="step" key={n}><h3>{n}</h3><p>{t(ko, eng)}</p></div>)}</div></section>
    <section className="section night"><figure className="wide-fig"><img src={V('atelier-wide.jpg')} alt={t('패키지 콘셉트', 'Packaging concept')} loading="lazy"/><figcaption>Packaging</figcaption></figure></section>
    <Services/>
  </>;

  const journal = <>
    <Scene img="o-mk-home-journal.jpg" eyebrow="Journal" title={'Stories behind\nthe Maison'} lede={t('예술, 사람, 공간의 이야기를 기록합니다.', 'Stories of art, people and places.')}/>
    <section className="section"><div className="rows">
      <a className="row" href="/products/no-16"><h3>{t('No. 16 — 숲, 그리고 나를 지탱해 준 말', 'No. 16 — The forest, and the horse that held me')}</h3><p>Parfum · Story</p><span className="more">Read</span></a>
      <a className="row" href="/music/gala"><h3>{t('Brand Gala Dinner Show, 그날의 기록', 'Brand Gala Dinner Show, that evening')}</h3><p>Music · Reception · Backstage</p><span className="more">Read</span></a>
      <a className="row" href="/maison#house"><h3>{t('무대에서 시작된 하우스', 'A house born on stage')}</h3><p>Maison · BELiOR & TWOTTIVA</p><span className="more">Read</span></a>
      <a className="row" href="/collection"><h3>{t('하나의 상징, 여섯 개의 세계', 'One symbol, six worlds')}</h3><p>Collection</p><span className="more">Read</span></a>
      <a className="row" href="/maison#symbol"><h3>{t('메종 심볼과 사자-B 모노그램', 'The maison symbol and the lion-B monogram')}</h3><p>Maison · Symbols</p><span className="more">Read</span></a>
    </div></section>
    <OneWorld/>
  </>;

  const privatePage = <>
    <section className="invite">
      <div className="iv-art"><img className="wide" src={V('invite.jpg')} alt="BELiOR Atelier"/><img className="narrow" src={V('invite-center.jpg')} alt="BELiOR Atelier"/></div>
      <div className="iv-body"><h1 className="keep">Three Cities. One Vision.</h1><p className="label">A More Beautiful Tomorrow.</p><span className="iv-rule"/>
        <p className="iv-only">Invitation Only</p><p className="iv-sub">Some things are not made for everyone.</p>
        <p className="muted">{t('프라이빗 공연, 브랜드 행사, 기업 선물과 아틀리에 협업은 초대와 개별 상담으로 진행합니다.', 'Private performances, brand events, corporate gifting and atelier collaborations are arranged by invitation.')}</p>
        <InquiryForm/></div>
      <div className="iv-foot"><span>Art · Objects · People · A Brighter Tomorrow</span><span>BELiOR Atelier</span></div>
    </section>
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
    page === 'journal' ? journal : privatePage;

  return <LangCtx.Provider value={en}><div className={'belior' + (page === 'products' && detail === 'no-16' ? ' ivory' : '')}>
    <div className="curtain" ref={curtainRef} aria-hidden="true"><div className="c-inner"><img className="c-mark" src={V('lion-motif.jpg')} alt=""/>
      <span className="c-world">LION</span><span className="c-line"/><span className="c-label">{LABELS[path] || 'BELiOR'}</span></div></div>
    <div className="topline"><span>A More Beautiful Tomorrow</span><span>Seoul</span></div>
    <header className="site-header">
      <button className="menu-btn" type="button" aria-expanded={menu} aria-controls="belior-menu" onClick={() => setMenu(!menu)}>{menu ? 'CLOSE' : 'MENU'}</button>
      <a className="brand" href="/" aria-label="BELiOR home"><img src={V(page === 'products' && detail === 'no-16' ? 'mono-black.png' : 'mono-ivory.png')} alt="BELiOR" width={22} height={43}/></a>
      <div className="head-right"><button className="lang" type="button" onClick={() => setEn(!en)} aria-label="Change language">{en ? 'KR' : 'EN'}</button><a className="head-link" href="/private">PRIVATE ENQUIRIES</a></div>
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
        <nav className="foot-nav" aria-label="Footer">{MENU.map(m => <a href={m.href} key={m.href}>{m.name}</a>)}<a href="/office">OFFICE</a></nav></div>
      <hr className="rule"/>
      <dl className="biz"><div><dt>{t('상호', 'Company')}</dt><dd>벨리오르(BELIOR)</dd></div><div><dt>{t('대표', 'CEO')}</dt><dd>{t('여혜린', 'Hyerin Yeo')}</dd></div>
        <div><dt>{t('사업자등록번호', 'Business No.')}</dt><dd>450-54-01129</dd></div><div><dt>{t('사업장', 'Address')}</dt><dd>{t('경기도 용인시 수지구 동천로135번길 21', '21, Dongcheon-ro 135beon-gil, Suji-gu, Yongin-si, Gyeonggi-do')}</dd></div>
        <div><dt>Mail</dt><dd>{MAIL}</dd></div></dl>
      <div className="foot-base"><span className="label">A More Beautiful Tomorrow.</span><span className="muted small">© {new Date().getFullYear()} BELiOR</span></div>
    </footer>
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
