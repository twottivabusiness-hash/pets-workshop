"""Generates the BELiOR multi-page site into this folder.

index.html is the artifact's main page (the host wraps it in a document skeleton),
every other page is a complete HTML document.
"""
import json
from pathlib import Path

OUT = Path(__file__).parent
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400'
         '&family=Jost:wght@400;500&family=Noto+Serif+KR:wght@400;500&display=swap">')
MAIL = "twottiva.business@gmail.com"

WORLDS = [
    dict(slug="lion", name="LION", kw=["Nobility", "Strength", "Leadership"], mat="Textured Gold", color="#c9a35f",
         chips=["#c9a35f", "#8a6232", "#3a2a18", "#ece4d6"], img="lion-wide.jpg", alt="lion-portrait.jpg", tag=None,
         world="사자의 시선은 언제나 앞으로 향합니다. 흔들림 없는 세상 속에서도 흔들리지 않는 존재감을 선사합니다.",
         notes="Woody · Amber · Leather", scent="깊고 묵직한 우디 노트에 따뜻한 앰버가 더해진, 품격 있는 향.",
         atelier="프리미엄 소재와 장인정신으로 완성한 BELiOR의 오브제."),
    dict(slug="swan", name="SWAN", kw=["Grace", "Beauty", "Artistry"], mat="Textured Silver", color="#c7cbd3",
         chips=["#f1efe9", "#c7cbd3", "#8b97a8", "#4b5566"], img="swan-moon.jpg", alt="swan-gold.jpg", tag=None,
         world="백조의 우아함은 단순한 아름다움이 아닌, 시간을 초월한 순수함의 언어입니다.",
         notes="Floral · Musk · Powdery", scent="섬세한 플로럴 노트와 부드러운 머스크가 어우러진, 우아한 향.",
         atelier="백조의 날개에서 영감을 받은 섬세한 디테일의 오브제."),
    dict(slug="orca", name="ORCA", kw=["Freedom", "Depth", "Journey"], mat="Deep Sapphire", color="#3fa3ad",
         chips=["#7cc7c9", "#2f8794", "#123c4f", "#0a1a26"], img="orca.jpg", alt=None, tag=None,
         world="깊은 바다를 유영하는 범고래처럼, 자유롭고 강한 에너지가 일상을 채웁니다.",
         notes="Aquatic · Amber · Marine", scent="차가운 바다의 신선함과 묵직한 앰버의 조화. 자유로운 향.",
         atelier="물결과 곡선에서 영감을 받은 다이내믹한 오브제."),
    dict(slug="leopard", name="LEOPARD", kw=["Elegance", "Independence", "Sensuality"], mat="Gold / Black", color="#d1a457",
         chips=["#d8ae63", "#a87a3a", "#3b2a16", "#111111"], img="leopard.jpg", alt=None,
         tag=("Elegance Without Permission.", "허락을 구하지 않는 우아함."),
         world="표범의 우아함은 부드러움 속의 강함. 그 자체로 하나의 예술입니다.",
         notes="Spicy · Floral · Amber", scent="스파이시한 향신료와 플로럴 노트가 어우러진, 관능적인 향.",
         atelier="고유의 패턴과 질감에서 영감을 받은 오브제."),
    dict(slug="panther", name="PANTHER", kw=["Mystery", "Intuition", "Night"], mat="Obsidian", color="#a39cb0",
         chips=["#5d586a", "#2c2a33", "#17161b", "#d08a3a"], img="panther.jpg", alt=None,
         tag=("The Power of Silence.", "침묵이 가진 압도적인 힘."),
         world="침묵 속에 숨겨진 강렬한 존재감. 그것이 팬서의 세계입니다.",
         notes="Woody · Musk · Spicy", scent="깊은 우디 노트와 머스크가 어우러진, 신비롭고 매혹적인 향.",
         atelier="어둠과 빛의 대비에서 탄생한 시크한 오브제."),
    dict(slug="phoenix", name="PHOENIX", kw=["Renewal", "Elegance", "Transcendence"], mat="Fire Opal", color="#e2803a",
         chips=["#f2b25c", "#e2803a", "#9c3a1c", "#2a120a"], img=None, alt=None,
         tag=("Born Beyond Limits.", "한계를 넘어 다시 태어나다."),
         world="불꽃 속에서 다시 태어나는 불사조. 끝이 아닌 시작을 노래하는 세계입니다.",
         notes=None, scent=None, atelier=None),
]
WMAP = {w["slug"]: w for w in WORLDS}

MENU = [
    ("maison", "MAISON", "메종", [("maison.html", "하우스 소개"), ("maison.html#house", "무대에서 시작된 하우스"), ("maison.html#symbol", "심볼 체계")]),
    ("music", "MUSIC & EXPERIENCE", "음악과 경험", [("music-artists.html", "연주진"), ("music-performances.html", "공연 포트폴리오"),
                                                 ("music-gala.html", "Brand Gala Dinner Show"), ("music-inquiry.html", "공연 문의")]),
    ("collection", "COLLECTION", "동물 컬렉션", [(f'collection-{w["slug"]}.html', w["name"].title()) for w in WORLDS]),
    ("objects", "OBJECTS", "오브제", [("objects.html", "Selected Objects"), ("objects.html#lines", "컬렉션 라인")]),
    ("atelier", "ATELIER", "아틀리에", [("atelier.html", "콘텐츠 제작"), ("atelier.html#poster", "포스터 아틀리에"), ("atelier.html#process", "제작의 순서")]),
    ("journal", "JOURNAL", "저널", [("journal.html", "모든 이야기")]),
    ("private", "PRIVATE ENQUIRIES", "프라이빗 문의", [("private.html", "문의하기")]),
]
LINES = [("PARFUM", "Scent of a story"), ("BAGS", "Carry a world"), ("APPAREL", "Wear the tempo"), ("OBJECTS", "Live with art")]

CHAPTERS = {}  # slug -> destination label for the page-turn curtain


def header(active):
    cols = []
    for slug, name, kr, subs in MENU:
        cur = ' aria-current="page"' if slug == active else ""
        sub = "".join(f'<a href="{h}">{t}</a>' for h, t in subs)
        cols.append(f'<div class="m-col"><a class="m-head" href="{slug}.html"{cur}>{name}<small>{kr}</small></a><div class="m-subs">{sub}</div></div>')
    return (f'<div class="topline"><span>A More Beautiful Tomorrow</span><span>Seoul</span></div>'
            f'<header class="site-header">'
            f'<button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-panel">MENU</button>'
            f'<a class="brand" href="index.html" aria-label="BELiOR 홈"><img src="assets/img/mono-ivory.png" alt="BELiOR" width="22" height="43"></a>'
            f'<a class="head-link" href="private.html">PRIVATE ENQUIRIES</a></header>'
            f'<nav class="menu-panel" id="menu-panel" hidden aria-label="메뉴"><div class="m-grid">{"".join(cols)}</div>'
            f'<div class="m-foot"><img src="assets/img/lion-motif.jpg" alt=""><span class="label">BELiOR · Maison de l’Art de Vivre</span></div></nav>')


def footer():
    links = "".join(f'<a href="{s}.html">{n}</a>' for s, n, _, _ in MENU)
    return (f'<footer class="site-footer"><div class="foot-top"><div class="foot-brand">'
            f'<img src="assets/img/mono-ivory.png" alt="BELiOR 기본 심볼" width="33" height="64">'
            f'<span class="wordmark">BELiOR</span><span class="label">Music · Art · People · Places</span></div>'
            f'<nav class="foot-nav" aria-label="하단 메뉴">{links}</nav></div><hr class="rule">'
            f'<dl class="biz"><div><dt>상호</dt><dd>벨리오르(BELIOR)</dd></div><div><dt>대표</dt><dd>여혜린</dd></div>'
            f'<div><dt>사업자등록번호</dt><dd>450-54-01129</dd></div><div><dt>사업장</dt><dd>경기도 용인시 수지구 동천로135번길 21</dd></div>'
            f'<div><dt>메일</dt><dd>{MAIL}</dd></div></dl>'
            f'<div class="foot-base"><span class="label">A More Beautiful Tomorrow.</span>'
            f'<span class="muted small">제품·공간 이미지는 컬렉션 콘셉트이며 실제 제품과 다를 수 있습니다. © 2026 BELiOR</span></div></footer>')


def page(slug, title, body, active=None, extra_style="", chapter=None):
    CHAPTERS[slug] = chapter or ("BELiOR" if slug == "index" else title.replace("BELiOR ", "").upper())
    head = (f'<title>{title}</title><meta name="description" content="BELiOR — Maison de l’Art de Vivre.">'
            f'{FONTS}<link rel="stylesheet" href="assets/site.css">{extra_style}')
    curtain = ('<div class="curtain" aria-hidden="true"><div class="c-inner"><img class="c-mark" src="assets/img/lion-motif.jpg" alt="">'
               f'<span class="c-world">LION</span><span class="c-line"></span><span class="c-label">{CHAPTERS[slug]}</span></div></div>'
               '<script>try{var t=JSON.parse(sessionStorage.getItem("belior-turn")||"null");if(t){var c=document.currentScript.previousElementSibling;'
               'c.querySelector(".c-mark").src=t.mark;c.querySelector(".c-world").textContent=t.world;c.classList.toggle("round",!!t.round);'
               'c.style.setProperty("--world",t.color);sessionStorage.removeItem("belior-turn")}}catch(e){}</script>')
    main = (curtain + header(active) + f'<main id="top">{body}</main>' + footer()
            + '<script src="assets/pages.js"></script><script src="assets/site.js"></script>')
    if slug == "index":
        html = head + main  # host adds doctype, charset and viewport
    else:
        html = ('<!doctype html><html lang="ko"><head><meta charset="utf-8">'
                '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
                f'{head}</head><body>{main}</body></html>')
    (OUT / f"{slug}.html").write_text(html, encoding="utf-8")


def cta(href, text="알아보기"):
    return f'<a class="cta" href="{href}"><span>{text}</span><span class="ring" aria-hidden="true">&#8250;</span></a>'


def scene(img, eyebrow, h1, lede="", pos="center", href=None, cta_text="알아보기"):
    return (f'<section class="scene scene--full"><img class="bg" src="assets/img/{img}" alt="" style="object-position:{pos}">'
            f'<div class="inner"><span class="label">{eyebrow}</span><h1>{h1}</h1>'
            f'{f"<p class=lede>{lede}</p>" if lede else ""}{cta(href, cta_text) if href else ""}</div></section>')


def door(href, img, eyebrow, title, text, pos="center"):
    return (f'<a class="door" href="{href}"><div class="ph"><img src="assets/img/{img}" alt="" loading="lazy" '
            f'style="object-position:{pos}"></div><span class="label">{eyebrow}</span><h3>{title}</h3>'
            f'<p>{text}</p><span class="more">Explore</span></a>')


def band(img, eyebrow, title, text, href, cta_text="알아보기", pos="center"):
    return (f'<section class="band"><img class="bg" src="assets/img/{img}" alt="" loading="lazy" style="object-position:{pos}">'
            f'<div class="inner"><span class="label">{eyebrow}</span><h2>{title}</h2><p class="lede">{text}</p>{cta(href, cta_text)}</div></section>')


# ---------- shared maison blocks (the original house, kept whole) ----------
CHAPTER_LIST = [
    ("music.html", "o-mk-home-music.jpg", "MUSIC &amp; EXPERIENCE", "음악은 저녁을 완성하는 것이 아니라,<br>저녁을 작곡합니다.", "Explore Music"),
    ("atelier.html", "o-mk-home-atelier.jpg", "ATELIER", "시간이 만들어내는 아름다움,<br>섬세한 손끝에서 시작됩니다.", "Explore Atelier"),
    ("objects.html", "o-mk-home-objects.jpg", "OBJECTS", "오래도록 곁에 남는 오브제,<br>일상의 순간을 특별하게.", "Explore Objects"),
    ("private.html", "o-mk-home-evening.jpg", "THE EVENING", "특별한 저녁을 위한<br>프라이빗한 경험을 제안합니다.", "Explore Private Experiences"),
    ("journal.html", "o-mk-home-journal.jpg", "JOURNAL", "예술, 사람, 공간의 이야기를<br>기록합니다.", "Explore Journal"),
]


def chapters():
    rows = "".join(
        f'<a class="chapter" href="{h}"><span class="num">0{i + 1}</span><div class="ch-img"><img src="assets/img/{im}" alt="" loading="lazy"></div>'
        f'<div class="ch-txt"><h3>{t}</h3><p>{d}</p><span class="more">{c} &#8594;</span></div></a>'
        for i, (h, im, t, d, c) in enumerate(CHAPTER_LIST))
    return f'<div class="chapters">{rows}</div>'


MAISON_INTRO = f'''
<section class="section maison-intro" id="maison">
  <div class="mi-head"><span class="label">BELiOR · Maison de l’Art de Vivre</span>
    <h2>예술이 머무는 저녁,<br>더 아름다운 내일을 위한 집.</h2>
    <p class="muted">BELiOR는 음악, 공간, 오브제, 향, 그리고 사람을 통해 일상의 순간들을 더 깊고 아름답게 만드는 라이프스타일 하우스입니다.</p></div>
  <div class="marquee" aria-hidden="true"><div>MUSIC · ART · PEOPLE · PLACES · OBJECTS · A MORE BEAUTIFUL TOMORROW · MUSIC · ART · PEOPLE · PLACES · OBJECTS · A MORE BEAUTIFUL TOMORROW ·</div></div>
  {chapters()}
</section>'''

THE_HOUSE = '''
<section class="section section--night" id="house">
  <div class="spread">
    <figure class="c-6"><img src="assets/img/o-gala-ensemble.jpg" alt="연회장에서 연주하는 앙상블" loading="lazy"><figcaption>BELiOR · Private Event Direction · with TWOTTIVA</figcaption></figure>
    <div class="copy c-6"><span class="label">The House</span><h3>무대에서 시작된 하우스</h3>
      <p class="muted">실제 무대에서 태어난 BELiOR는 라이브 음악을 프라이빗 이벤트 연출과 예술 기획, 오브제, 그리고 하루 저녁보다 오래 남는 시각 언어로 넓혀 갑니다.</p>
      <h3 style="font-size:1.5rem;margin-top:14px">무대는 TWOTTIVA가 연주합니다</h3>
      <p class="muted">BELiOR의 음악은 서울에서 활동하는 현악앙상블 TWOTTIVA(뚜띠바 현악앙상블)가 연주합니다. 2021년부터 호텔·기업·공식 행사 무대에서 쌓아 온 TWOTTIVA의 연주 위에, BELiOR가 공간과 오브제와 연출을 더합니다.</p>
      <ul class="history"><li>KBS홀 한·체코 수교 35주년 기념음악회</li><li>한국여성공인회계사회 정기총회 및 회장 이·취임식</li><li>호텔 연회 · 기업행사 · VIP 리셉션</li><li>Brand Gala Dinner Show · Seoul</li></ul>
      <p class="muted small">공연 이력은 TWOTTIVA와 각 연주자의 이력입니다.</p>
      <div class="links"><a class="more" href="https://twottiva.com" target="_blank" rel="noopener">TWOTTIVA 홈페이지 &#8599;</a>
        <a class="more" href="https://www.youtube.com/watch?v=3aVe656YBUc" target="_blank" rel="noopener">YouTube에서 보기 &#8599;</a></div></div>
  </div>
</section>'''

THE_EVENING = '''
<section class="section">
  <div class="section-head"><span class="label">BELiOR Music · The Evening</span><h2>음악이 머무는 저녁</h2></div>
  <div class="evening">
    <figure class="ev-film"><video src="assets/media/o-gala.mp4" poster="assets/img/o-gala-ensemble.jpg" muted loop playsinline autoplay preload="metadata"></video><figcaption>프라이빗 갈라 · 콘셉트 필름</figcaption></figure>
    <div class="ev-cards">
      <a class="ev-card" href="music.html"><span class="label">01 · Music &amp; Experience</span><h3>그 저녁</h3><p class="muted">호텔, 브랜드, 프라이빗 갈라 디너를 위한 현악 4중주와 확장 편성, 그리고 맞춤 챔버 연출.</p><span class="more">Explore</span></a>
      <a class="ev-card" href="objects.html"><span class="label">02 · Objects</span><h3>일상으로 옮긴 예술</h3><p class="muted">하우스의 시각 언어에서 출발한 스카프와 가죽 소품, 그리고 개인의 오브제.</p><span class="more">Explore</span></a>
    </div>
  </div>
</section>'''

ATELIER_CONTENT = '''
<section class="section section--night" id="poster">
  <div class="spread">
    <div class="copy c-5"><span class="label">BELiOR Atelier · Content</span><h3>무대를 완성하는 콘텐츠</h3>
      <p class="muted">무대 배경 영상과 영상 편집, 프로그램 그래픽, 연주자 포스터까지 행사의 콘셉트에 맞춰 기획하고 제작합니다.</p>
      <a class="more" href="atelier.html">콘텐츠 제작 보기</a></div>
    <div class="c-7 pair"><figure><img src="assets/img/o-content-stage-video.jpg" alt="무대 배경 영상과 함께하는 공연" loading="lazy"><figcaption>무대 배경 영상</figcaption></figure>
    <figure><img src="assets/img/o-poster-pirates.jpg" alt="연주자 포스터" loading="lazy"><figcaption>연주자 포스터</figcaption></figure></div>
  </div>
</section>'''

ONE_WORLD = band("o-maison-entrance.jpg", "BELiOR Maison", "하나의 세계,<br>여러 형태.", "음악과 오브제, 고요한 빛이 한 공간에 머무는 하우스.", "maison.html", "자세히 알아보기")

OBJECTS_ROW = '''
<section class="section">
  <div class="section-head"><span class="label">Selected Objects</span><h2>곁에 두도록 만든 것들</h2></div>
  <div class="doors">
    <a class="door" href="objects.html"><div class="ph"><img src="assets/img/o-prod-5.jpg" alt="별이 빛나는 밤 패턴의 기기 케이스" loading="lazy"></div><span class="label">Personal Objects</span><h3>개인의 오브제</h3><p>매일 쓰는 기기의 케이스를 수집할 만한 표면으로 다룹니다.</p></a>
    <a class="door" href="objects.html"><div class="ph"><img src="assets/img/o-prod-3.jpg" alt="흑백 실크 스카프" loading="lazy"></div><span class="label">Silk &amp; Textile</span><h3>실크와 직물</h3><p>물성과 움직임, 그리고 밤하늘의 붓결.</p></a>
    <a class="door" href="maison.html#symbol"><div class="ph"><img src="assets/img/lion-motif.jpg" alt="사자와 B를 결합한 은빛 모노그램" loading="lazy"></div><span class="label">The Monogram</span><h3>B 모노그램</h3><p>현처럼 곧게 선 획 위에 별을 얹은 하우스의 이니셜.</p></a>
  </div>
</section>'''

SERVICES = '''
<section class="section section--night">
  <div class="section-head"><span class="label">Services</span><h2>하우스의 세 가지 챕터</h2></div>
  <div class="rows">
    <a class="row" href="atelier.html"><h3>Content Direction</h3><p>브랜드 · 행사 콘텐츠 기획</p><span class="more">Explore</span></a>
    <a class="row" href="atelier.html#poster"><h3>Poster Atelier</h3><p>포스터 및 비주얼 제작</p><span class="more">Explore</span></a>
    <a class="row" href="music-inquiry.html"><h3>Performance Inquiry</h3><p>공연 및 프라이빗 이벤트 문의</p><span class="more">Inquire</span></a>
  </div>
</section>
<section class="section">
  <div class="statement"><img src="assets/img/mono-ivory.png" alt="" width="34" height="67">
    <h2>“더 아름다운 내일은, 오늘의 한 순간을 어떻게 짜는가에서 시작됩니다.”</h2><p class="label">BELiOR · Music · Art · People · Places</p></div>
</section>'''

# ---------------- index ----------------
world_slides = "".join(
    f'<div class="slide" role="group" aria-label="{w["name"]}" style="--world:{w["color"]}">'
    f'<img class="bg" src="assets/img/{w["img"] or "phoenix.jpg"}" alt="" loading="lazy">'
    f'<div class="inner"><span class="label">The Animal Collection</span><h2>{w["name"]}</h2>'
    f'<p class="lede">{" · ".join(w["kw"])}</p>{cta("collection-" + w["slug"] + ".html")}</div></div>' for w in WORLDS)
dots = "".join(f'<button type="button" class="dot" aria-label="{w["name"]}"></button>' for w in WORLDS)

page("index", "BELiOR", f'''
<section class="scene scene--full film" aria-label="BELiOR 브랜드 필름">
  <video class="bg" src="assets/media/belior-film.webm" poster="assets/img/film-poster.jpg" muted loop playsinline autoplay preload="metadata"></video>
  <button class="film-toggle" type="button" aria-label="영상 일시정지"><span aria-hidden="true">II</span></button>
</section>
{scene("bu-quartet.jpg", "Music &amp; Experience", "The Art of a<br>Living Moment", "살아 있는 순간의 예술", pos="60% center", href="music.html")}
{scene("bu-aerial.jpg", "Editorial", "Brand Gala<br>Dinner Show", "강 위로 저무는 저녁", pos="center 60%", href="music-gala.html")}
{scene("lion-portrait.jpg", "Collection", "One Symbol.<br>Endless Worlds.", "하나의 상징, 끝없는 세계", pos="center 30%", href="collection.html")}
<section class="carousel" aria-label="여섯 개의 컬렉션"><div class="track">{world_slides}</div><div class="dots">{dots}</div></section>
{MAISON_INTRO}
{THE_HOUSE}
{THE_EVENING}
{ATELIER_CONTENT}
{ONE_WORLD}
{OBJECTS_ROW}
{SERVICES}
{scene("panther.jpg", "Private Enquiries", "By Appointment", "공연과 컬렉션, 프라이빗 이벤트에 관한 문의", pos="center 30%", href="private.html", cta_text="문의하기")}''')

# ---------------- maison ----------------
emb_mini = "".join(f'<a href="collection-{w["slug"]}.html"><img src="assets/img/emblem-{w["slug"]}.jpg" alt="{w["name"]} 엠블럼"></a>' for w in WORLDS)
page("maison", "BELiOR Maison", f'''
{scene("o-hero-salon.jpg", "Maison de l’Art de Vivre", "A Heritage for a<br>Brighter Tomorrow", "음악에서 시작된 하나의 하우스. Art · People · Places and beauty.")}
{MAISON_INTRO}
{THE_HOUSE}
<section class="section" id="symbol">
  <div class="section-head"><span class="label">Symbol System</span><h2>하나의 하우스, 하나의 심볼, 여섯 개의 세계</h2>
    <p class="muted">메종 심볼은 하우스 전체를, 사자-B 모노그램은 동물 세계관의 시작을, 여섯 엠블럼은 각 컬렉션을 대표합니다.</p></div>
  <div class="symbols three">
    <div class="symbol-card"><div class="mark"><img src="assets/img/mono-ivory.png" alt="BELiOR 메종 심볼" width="76" height="150"></div>
      <span class="label">Maison Symbol</span><h3>메종 심볼</h3><p class="muted">하우스의 공식 표기. 사이트 상단과 모든 공식 문서에 사용합니다.</p></div>
    <div class="symbol-card"><div class="mark"><img src="assets/img/lion-motif.jpg" alt="사자-B 모노그램" style="max-height:150px;border-radius:4px"></div>
      <span class="label">The Monogram</span><h3>사자-B 모노그램</h3><p class="muted">현처럼 곧게 선 획 위에 별을 얹은 이니셜. 동물 세계관으로 들어가는 문입니다.</p></div>
    <div class="symbol-card"><div class="mini">{emb_mini}</div>
      <span class="label">Collection Emblems</span><h3>여섯 엠블럼</h3><p class="muted">LION · SWAN · ORCA · LEOPARD · PANTHER · PHOENIX. 각 컬렉션 안에서 사용합니다.</p></div>
  </div>
</section>
{ONE_WORLD}
{SERVICES}''', "maison")

# ---------------- music ----------------
page("music", "BELiOR Music", f'''
{scene("bu-quartet.jpg", "BELiOR Music &amp; Experience", "The Art of a<br>Living Moment", "살아 있는 순간의 예술. 실제 무대와 현장에서 연주하는 BELiOR의 음악입니다.", pos="60% center")}
<section class="section">
  <div class="section-head"><span class="label">Music</span><h2>음악은 저녁을 작곡합니다</h2><p class="muted">Where Music Becomes Memory. 음악이 기억이 되는 순간.</p></div>
  <div class="doors">
    {door("music-artists.html", "bu-backstage.jpg", "Artists", "연주진", "현장에서 함께 호흡하는 연주진.")}
    {door("music-performances.html", "o-gala-ensemble.jpg", "Performances", "공연 포트폴리오", "BELiOR와 TWOTTIVA가 함께한 무대.")}
    {door("music-gala.html", "bu-violinist.jpg", "Editorial", "Brand Gala Dinner Show", "현장 · 리셉션 · 백스테이지의 기록.", pos="center 20%")}
    {door("music-inquiry.html", "bu-violin.jpg", "Inquiry", "공연 문의", "행사 정보를 남기면 프로그램을 제안드립니다.")}
  </div>
</section>
{THE_EVENING}
{THE_HOUSE}
<section class="section"><div class="statement"><span class="label">An Evening</span><h2>An Evening, Beautifully Composed.</h2><p>아름답게 구성된 하나의 저녁.</p>{cta("music-inquiry.html", "공연 문의")}</div></section>''', "music", chapter="MUSIC & EXPERIENCE")

page("music-artists", "BELiOR Artists", f'''
{scene("bu-backstage.jpg", "Music · Artists", "BELiOR 연주진", "Beyond Performance. An Experience. 연주를 넘어, 하나의 경험.", pos="center 35%")}
<section class="section">
  <div class="section-head"><span class="label">The Ensemble</span><h2>현악 4중주 편성</h2><p class="muted">BELiOR의 무대는 현악앙상블 TWOTTIVA가 연주합니다. 연주자별 프로필은 확정 후 게재합니다.</p></div>
  <div class="roles">
    <div class="role"><span class="label">Violin I</span><h3>제1 바이올린</h3><p class="muted">프로필 준비 중</p></div>
    <div class="role"><span class="label">Violin II</span><h3>제2 바이올린</h3><p class="muted">프로필 준비 중</p></div>
    <div class="role"><span class="label">Viola</span><h3>비올라</h3><p class="muted">프로필 준비 중</p></div>
    <div class="role"><span class="label">Cello</span><h3>첼로</h3><p class="muted">프로필 준비 중</p></div>
  </div>
</section>
{THE_HOUSE}
{band("bu-violinist.jpg", "On Site", "무대가 아닌 곳에서도,<br>무대처럼", "야외 잔디와 리셉션 공간, 디너 테이블 사이에서 행사의 흐름에 맞춰 연주합니다.", "music-performances.html", "공연 보기", pos="center 25%")}''', "music")

page("music-performances", "BELiOR Performances", f'''
{scene("o-gala-ensemble.jpg", "Music · Performances", "공연 포트폴리오", "The Sound of an Extraordinary Evening. 특별한 저녁을 완성하는 선율.")}
<section class="section">
  <div class="section-head"><span class="label">Portfolio</span><h2>함께한 저녁</h2></div>
  <div class="rows">
    <a class="row" href="music-gala.html"><h3>Brand Gala Dinner Show</h3><p>서울 · 한강을 내려다보는 야외 디너 · 현악 4중주 라이브 연주</p><span class="more">Editorial</span></a>
    <div class="row"><h3>KBS홀 한·체코 수교 35주년 기념음악회</h3><p>TWOTTIVA 공연 이력</p><span></span></div>
    <div class="row"><h3>한국여성공인회계사회 정기총회 및 회장 이·취임식</h3><p>TWOTTIVA 공연 이력</p><span></span></div>
    <div class="row"><h3>호텔 연회 · 기업행사 · VIP 리셉션</h3><p>TWOTTIVA 공연 이력</p><span></span></div>
  </div>
  <p class="muted small" style="margin-top:20px">공연 이력은 TWOTTIVA와 각 연주자의 이력입니다.</p>
</section>
{THE_EVENING}
{band("bu-quartet.jpg", "For Your Evening", "행사의 성격에 맞춘<br>프로그램", "행사 일정과 장소, 진행 순서를 바탕으로 편성과 곡목을 제안드립니다.", "music-inquiry.html", "공연 문의", pos="60% center")}''', "music")

page("music-gala", "Brand Gala Dinner Show", f'''
{scene("bu-aerial.jpg", "Editorial · Brand Gala Dinner Show, Seoul", "강 위로 저무는 저녁", "브랜드 갈라 디너 쇼에서 BELiOR는 현장의 라이브 연주를 맡았고, 연주에 대해 좋은 평가를 받았습니다.", pos="center 55%")}
<section class="section">
  <div class="spread">
    <figure class="c-8"><img src="assets/img/bu-quartet.jpg" alt="주황 조명 아래 행사장 앞에서 연주하는 4중주" loading="lazy"><figcaption>I. Reception — 하우스 앞 야외 4중주</figcaption></figure>
    <div class="copy c-4"><span class="label">Reception</span><h3>손님이 도착하는 시간</h3><p class="muted">조명이 켜지기 시작할 무렵, 리셉션의 공기를 현악 4중주로 채웠습니다.</p></div>
  </div>
  <div class="spread">
    <div class="copy c-5"><span class="label">The Venue</span><h3>원형 테이블과 한강</h3><p class="muted">언덕 위 잔디에 놓인 원형 디너 테이블, 그 너머로 강과 다리가 이어지는 풍경입니다.</p></div>
    <figure class="c-6" style="grid-column:7 / span 6"><img src="assets/img/bu-violinist.jpg" alt="디너 테이블 옆 잔디 위의 바이올리니스트" loading="lazy"><figcaption>II. Venue — 디너 테이블 옆에서</figcaption></figure>
  </div>
  <div class="spread">
    <figure class="c-5"><img src="assets/img/bu-violin.jpg" alt="바이올린과 활의 클로즈업" loading="lazy"><figcaption>III. Detail</figcaption></figure>
    <figure class="c-7"><img src="assets/img/bu-backstage.jpg" alt="행사장 입구에 선 연주진" loading="lazy"><figcaption>IV. Backstage — 공연을 마친 연주진</figcaption></figure>
  </div>
</section>
<section class="section section--night"><div class="statement"><span class="label">BELiOR Music</span><h2>Where Music Becomes Memory.</h2><p>음악이 기억이 되는 순간.</p>{cta("music-inquiry.html", "공연 문의")}</div></section>''', "music")

INQ_FIELDS = [("q-event", "event", "행사명", "text", True, False), ("q-date", "date", "행사 일자 · 시간", "text", True, False),
              ("q-venue", "venue", "장소", "text", True, False), ("q-guests", "guests", "예상 인원", "text", False, False),
              ("q-type", "type", "행사 성격", "select", True, False), ("q-time", "time", "연주 시간", "text", False, False),
              ("q-budget", "budget", "예산", "text", False, False), ("q-name", "name", "담당자 · 연락처", "text", True, False),
              ("q-note", "note", "요청 사항", "textarea", False, True)]


def fields(spec, types):
    out = []
    for fid, name, lab, kind, req, wide in spec:
        r = " required" if req else ""
        if kind == "select":
            opts = "".join(f"<option>{t}</option>" for t in types)
            ctl = f'<select id="{fid}" name="{name}"{r}><option value="">선택</option>{opts}</select>'
        elif kind == "textarea":
            ctl = f'<textarea id="{fid}" name="{name}"{r}></textarea>'
        else:
            ctl = f'<input id="{fid}" name="{name}" type="text" autocomplete="off"{r}>'
        out.append(f'<div class="field{" wide" if wide else ""}"><label for="{fid}">{lab}</label>{ctl}</div>')
    return "".join(out)


def result_box(rid):
    return (f'<div class="result" id="{rid}" hidden><span class="label">문의 내용</span><pre></pre>'
            f'<p class="muted">이 화면에서는 문의가 전송되지 않습니다. 아래 주소로 위 내용을 보내주세요.</p>'
            f'<p class="addr">{MAIL}</p><div class="actions"><button class="btn" type="button" data-copy>내용 복사</button></div></div>')


page("music-inquiry", "BELiOR Music Inquiry", f'''
{scene("bu-violin.jpg", "Music · Inquiry", "공연 문의", "행사 정보를 남겨주시면 일정과 편성을 확인해 프로그램을 제안드립니다.")}
<section class="section">
  <div class="section-head"><span class="label">Your Evening</span><h2>행사 정보</h2><p class="muted">모르는 항목은 비워두셔도 됩니다. 통화로 함께 확인합니다.</p></div>
  <form class="form" data-inquiry="music-result" data-title="BELiOR MUSIC 공연 문의" novalidate>
    {fields(INQ_FIELDS, ["기업 공식행사", "호텔 리셉션", "갈라 디너", "브랜드 행사", "VIP 리셉션", "기타"])}
    <button class="btn" type="submit">문의 내용 정리</button>
  </form>
  <div style="margin-top:36px">{result_box("music-result")}</div>
</section>
{THE_EVENING}''', "music")

# ---------------- collection ----------------
emblems = "".join(f'<a class="emblem" href="collection-{w["slug"]}.html"><img src="assets/img/emblem-{w["slug"]}.jpg" alt="{w["name"]} 엠블럼"><span class="label">{w["name"]}</span></a>' for w in WORLDS)


def world_card(w):
    return (f'<a class="world" href="collection-{w["slug"]}.html" style="--world:{w["color"]}">'
            f'<img class="bg" src="assets/img/{w["img"] or "phoenix.jpg"}" alt="" loading="lazy">'
            f'<span class="label mat" style="color:{w["color"]}">{w["mat"]}</span>'
            f'<div class="txt"><h3>{w["name"]}</h3><span class="kw">{" · ".join(w["kw"])}</span>'
            f'<span class="more" style="color:{w["color"]}">Explore</span></div></a>')


patterns = "".join(f'<figure><img src="assets/img/{w["slug"]}-pattern.jpg" alt="{w["name"]} 패턴" loading="lazy"><figcaption>{w["name"].title()} · {w["mat"]}</figcaption></figure>' for w in WORLDS)
line_items = "".join(
    f'<div class="line-item"><div class="ph"><img src="assets/img/{i}" alt="{n} 콘셉트 이미지" loading="lazy"></div><span class="label" style="color:var(--ivory)">{n}</span><p class="muted">{s}</p></div>'
    for (n, s), i in zip(LINES, ["prod-parfum.jpg", "prod-bag.jpg", "prod-clothing.jpg", "prod-objects.jpg"]))
page("collection", "BELiOR Collection", f'''
{scene("lion-wide.jpg", "The Animal Collection", "One Symbol.<br>Endless Worlds.", "하나의 상징, 끝없는 세계. BELiOR의 메종 위에 여섯 동물의 세계가 펼쳐집니다.", pos="center 35%")}
<section class="section">
  <div class="spread">
    <div class="copy c-6"><span class="label">From the Maison</span><h3>메종에서 시작된 여섯 개의 세계</h3>
      <p class="muted">음악과 오브제로 쌓아 온 BELiOR의 하우스 위에, 사자의 모노그램에서 출발한 동물들의 세계관을 더합니다. 각 세계는 고유의 색과 소재, 향과 사물을 가집니다.</p>
      <a class="more" href="maison.html">메종 보기</a></div>
    <figure class="c-5" style="grid-column:8 / span 5"><img src="assets/img/lion-motif.jpg" alt="사자-B 모노그램" loading="lazy"><figcaption>The Monogram · 동물 세계관의 시작</figcaption></figure>
  </div>
</section>
<section class="section section--night"><div class="section-head"><span class="label">Emblem Collection</span><h2>여섯 개의 엠블럼</h2></div><div class="emblems">{emblems}</div></section>
<div class="worlds">{"".join(world_card(w) for w in WORLDS)}</div>
<section class="section"><div class="section-head"><span class="label">Pattern &amp; Motif</span><h2>세계마다 다른 결</h2></div><div class="patterns">{patterns}</div></section>
<section class="section section--night" id="lines">
  <div class="section-head"><span class="label">From World to Object</span><h2>세계관이 사물이 되기까지</h2>
    <p class="muted">각 컬렉션은 PARFUM · BAGS · APPAREL · OBJECTS로 이어집니다. 제품은 공개 준비 중입니다.</p></div>
  <div class="lines">{line_items}</div>
</section>
{ONE_WORLD}''', "collection", chapter="THE COLLECTION")

for i, w in enumerate(WORLDS):
    others = [x for x in WORLDS if x is not w]
    nxt = WORLDS[(i + 1) % len(WORLDS)]
    style = f'<style>:root{{--world:{w["color"]}}}</style>'
    chips = "".join(f'<span class="chip" style="background:{c}"></span>' for c in w["chips"])
    lede = f'{w["tag"][0]} {w["tag"][1]}' if w["tag"] else " · ".join(w["kw"])
    if w["img"]:
        hero = scene(w["img"], f'The Animal Collection · {w["mat"]}', f'{w["name"]}<br><span class="accent">Collection</span>', lede, pos="center 35%")
    else:
        hero = (f'<section class="scene scene--full plain"><div class="inner"><div class="phoenix-frame"><img src="assets/img/phoenix.jpg" alt="불꽃 날개를 펼친 불사조"></div>'
                f'<span class="label">The Animal Collection · {w["mat"]}</span><h1>{w["name"]}<br><span class="accent">Collection</span></h1><p class="lede">{lede}</p></div></section>')
    has_mock = w["slug"] in ("lion", "swan", "orca", "leopard", "panther")
    if has_mock:
        objects_fig = (f'<figure class="wide-fig"><img src="assets/img/{w["slug"]}-objects.jpg" alt="{w["name"]} 컬렉션 사물 콘셉트" loading="lazy">'
                       f'<figcaption>Parfum · Bags · Apparel · Objects · Concept</figcaption></figure>')
    else:
        objects_fig = '<p class="muted">PHOENIX의 사물은 공개 준비 중입니다.</p>'
    objects_block = (f'<section class="section section--night"><div class="section-head"><span class="label">{w["name"]} Objects</span>'
                     f'<h2>{w["name"].title()}의 사물들</h2><p class="muted">향수와 가방, 의류와 캔들. 하나의 엠블럼이 여러 사물로 이어집니다.</p></div>'
                     f'{objects_fig}</section>')
    scent_block = ""
    if w["notes"]:
        scent_block = (f'<section class="section"><div class="spread"><figure class="c-5"><img src="assets/img/{w["slug"]}-scent.jpg" alt="{w["name"]} 향수 콘셉트" loading="lazy"><figcaption>Fragrance · Concept</figcaption></figure>'
                       f'<div class="copy c-6" style="grid-column:7 / span 6"><span class="label">Fragrance</span><h3>{w["name"]}</h3><p class="notes accent">{w["notes"]}</p>'
                       f'<p class="muted">{w["scent"]}</p><span class="small muted">향 노트는 시안 단계의 콘셉트입니다.</span></div></div></section>')
    atelier_block = ""
    if w["atelier"]:
        atelier_block = (f'<section class="section section--night"><div class="spread"><div class="copy c-5"><span class="label">Atelier</span><h3>{w["name"].title()} Atelier</h3>'
                         f'<p class="muted">{w["atelier"]}</p><a class="more" href="atelier.html">아틀리에 보기</a></div>'
                         f'<figure class="c-6" style="grid-column:7 / span 6"><img src="assets/img/{w["slug"]}-atelier.jpg" alt="{w["name"]} 아틀리에 콘셉트" loading="lazy"><figcaption>Leather · Emblem · Concept</figcaption></figure></div></section>')
    second = (f'<section class="section"><figure class="wide-fig"><img src="assets/img/{w["alt"]}" alt="" loading="lazy"><figcaption>The World of {w["name"].title()}</figcaption></figure></section>' if w["alt"] else "")
    other_cards = "".join(f'<a class="emblem" href="collection-{x["slug"]}.html"><img src="assets/img/emblem-{x["slug"]}.jpg" alt="{x["name"]} 엠블럼"><span class="label">{x["name"]}</span></a>' for x in others)
    page(f'collection-{w["slug"]}', f'{w["name"].title()} Collection', f'''
<div class="world-page">
{hero}
<section class="section">
  <div class="spread">
    <div class="copy c-7"><span class="label">The World</span><p class="world-line">{w["world"]}</p>
      <p class="muted small">컬렉션 문구는 시안 단계의 초안입니다.</p></div>
    <div class="c-4 emblem-side"><img src="assets/img/emblem-{w["slug"]}.jpg" alt="{w["name"]} 엠블럼"><span class="label">{w["name"]} Emblem</span></div>
  </div>
  <div class="facts" style="margin-top:56px">
    <div class="fact"><span class="label">Keywords</span><span class="val">{" · ".join(w["kw"])}</span></div>
    <div class="fact"><span class="label">Material · Tone</span><span class="val accent">{w["mat"]}</span><div class="chips">{chips}</div></div>
    <div class="fact"><span class="label">Pattern &amp; Motif</span><img class="pat" src="assets/img/{w["slug"]}-pattern.jpg" alt="{w["name"]} 패턴"></div>
  </div>
</section>
{objects_block}
{scent_block}
{atelier_block}
{second}
<section class="section section--night">
  <div class="section-head"><span class="label">Other Worlds</span><h2>다른 세계로</h2></div>
  <div class="emblems five">{other_cards}</div>
</section>
{band(nxt["img"] or "lion-wide.jpg", "Next World", nxt["name"], " · ".join(nxt["kw"]), f'collection-{nxt["slug"]}.html', "다음 세계")}
{ONE_WORLD}
</div>''', "collection", style, chapter=f'{w["name"]} COLLECTION')

# ---------------- objects ----------------
page("objects", "BELiOR Objects", f'''
{scene("o-m-bag.jpg", "Objects", "Live with Art", "오래도록 곁에 남는 오브제, 일상의 순간을 특별하게.")}
{OBJECTS_ROW}
<section class="section section--night">
  <div class="spread">
    <figure class="c-6"><img src="assets/img/o-m-br-hero.jpg" alt="B 모노그램이 새겨진 가죽 브레이슬릿" loading="lazy"><figcaption>Leather · Monogram</figcaption></figure>
    <div class="copy c-5" style="grid-column:8 / span 5"><span class="label">Leather Goods</span><h3>모노그램을 새긴 가죽 소품</h3><p class="muted">하우스의 이니셜을 작은 사물에 옮깁니다.</p></div>
  </div>
</section>
<section class="section" id="lines">
  <div class="section-head"><span class="label">Collection Lines</span><h2>여섯 세계의 사물</h2><p class="muted">각 동물 컬렉션의 사물은 컬렉션 페이지에서 볼 수 있습니다.</p></div>
  <div class="emblems">{emblems}</div>
</section>
{band("o-maison-objects.jpg", "Maison", "음악과 오브제가<br>함께 머무는 곳", "하우스의 시각 언어에서 출발한 사물들.", "maison.html", "메종 보기")}''', "objects")

# ---------------- atelier ----------------
page("atelier", "BELiOR Atelier", f'''
{scene("o-mk-home-atelier.jpg", "Atelier", "Craft Your Moment", "시간이 만들어내는 아름다움, 섬세한 손끝에서 시작됩니다.")}
{ATELIER_CONTENT}
<section class="section" id="process">
  <div class="section-head"><span class="label">Process</span><h2>제작의 순서</h2><p class="muted">세부 일정과 방식은 프로젝트마다 함께 정합니다.</p></div>
  <div class="steps">
    <div class="step"><h3>Concept</h3><p>행사와 브랜드의 콘셉트, 세계관을 정합니다.</p></div>
    <div class="step"><h3>Visual</h3><p>무대 배경 영상과 프로그램 그래픽을 설계합니다.</p></div>
    <div class="step"><h3>Object</h3><p>포스터, 패키지, 오브제로 형태를 만듭니다.</p></div>
    <div class="step"><h3>Stage</h3><p>현장에서 음악과 함께 완성합니다.</p></div>
  </div>
</section>
<section class="section section--night"><figure class="wide-fig"><img src="assets/img/atelier-wide.jpg" alt="박스, 실링 왁스, 향수와 캔들 패키지 콘셉트" loading="lazy"><figcaption>Packaging · Concept</figcaption></figure></section>
{SERVICES}''', "atelier")

# ---------------- journal ----------------
page("journal", "BELiOR Journal", f'''
{scene("o-mk-home-journal.jpg", "Journal", "Stories behind<br>the Maison", "예술, 사람, 공간의 이야기를 기록합니다.")}
<section class="section">
  <div class="rows">
    <a class="row" href="music-gala.html"><h3>Brand Gala Dinner Show, 그날의 기록</h3><p>Music · 현장 · 리셉션 · 백스테이지</p><span class="more">Read</span></a>
    <a class="row" href="maison.html#house"><h3>무대에서 시작된 하우스</h3><p>Maison · BELiOR와 TWOTTIVA</p><span class="more">Read</span></a>
    <a class="row" href="collection.html"><h3>하나의 상징, 여섯 개의 세계</h3><p>Collection · Lion · Swan · Orca · Leopard · Panther · Phoenix</p><span class="more">Read</span></a>
    <a class="row" href="maison.html#symbol"><h3>메종 심볼과 사자-B 모노그램</h3><p>Maison · 심볼 체계</p><span class="more">Read</span></a>
  </div>
</section>
{ONE_WORLD}''', "journal")

# ---------------- private ----------------
PRIV_FIELDS = [("p-topic", "topic", "문의 분야", "select", True, False), ("p-name", "name", "성함", "text", True, False),
               ("p-contact", "contact", "연락처", "text", True, False), ("p-date", "date", "희망 일정", "text", False, False),
               ("p-note", "note", "문의 내용", "textarea", True, True)]
page("private", "BELiOR Private", f'''
{scene("panther.jpg", "Private Enquiries · By Appointment", "Extraordinary<br>Moments", "공연과 컬렉션, 프라이빗 이벤트에 관한 문의는 개별 상담으로 진행합니다.", pos="center 30%")}
<section class="section">
  <div class="section-head"><span class="label">Private Enquiries</span><h2>프라이빗 문의</h2><p class="muted">남겨주신 내용을 확인한 뒤 담당자가 직접 연락드립니다.</p></div>
  <form class="form" data-inquiry="private-result" data-title="BELiOR PRIVATE 문의" novalidate>
    {fields(PRIV_FIELDS, ["MUSIC · 공연", "PRIVATE EVENT · 프라이빗 이벤트", "COLLECTION · 컬렉션", "ATELIER · 콘텐츠 제작", "기타"])}
    <button class="btn" type="submit">문의 내용 정리</button>
  </form>
  <div style="margin-top:36px">{result_box("private-result")}</div>
</section>
{SERVICES}''', "private", chapter="PRIVATE ENQUIRIES")

# page-turn data: destination labels plus the animal sequence shown on each turn
seq = [{"world": "LION", "mark": "assets/img/lion-motif.jpg", "round": False, "color": WMAP["lion"]["color"]}] + [
    {"world": w["name"], "mark": f'assets/img/emblem-{w["slug"]}.jpg', "round": True, "color": w["color"]} for w in WORLDS[1:]]
own = {f'collection-{w["slug"]}': {"world": w["name"], "mark": f'assets/img/emblem-{w["slug"]}.jpg', "round": True, "color": w["color"]} for w in WORLDS}
own["collection-lion"] = seq[0]
(OUT / "assets/pages.js").write_text(
    "window.BELIOR_PAGES=" + json.dumps({"labels": CHAPTERS, "sequence": seq, "own": own}, ensure_ascii=False) + ";", encoding="utf-8")
print(sorted(p.name for p in OUT.glob("*.html")))
