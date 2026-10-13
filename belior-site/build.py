"""Generates the BELiOR multi-page site into this folder.

index.html is the artifact's main page (the host wraps it in a document skeleton),
every other page is a complete HTML document.
"""
from pathlib import Path

OUT = Path(__file__).parent
FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400'
         '&family=Jost:wght@400;500&family=Noto+Serif+KR:wght@400;500&display=swap">')
MAIL = "twottiva.business@gmail.com"

NAV = [("maison", "MAISON", "메종"), ("music", "MUSIC", "연주와 공연"), ("collection", "COLLECTION", "동물 컬렉션"),
       ("atelier", "ATELIER", "아틀리에"), ("journal", "JOURNAL", "저널"), ("private", "PRIVATE", "프라이빗 문의")]

WORLDS = [
    dict(slug="lion", name="LION", kw=["Nobility", "Strength", "Leadership"], mat="Textured Gold",
         color="#b98c4c", chips=["#c9a35f", "#8a6232", "#3a2a18", "#ece4d6"], img="lion-wide.jpg", alt="lion-portrait.jpg",
         tag=None, kr="흔들림 없는 시선과 무게. 사자는 메종의 가장 묵직한 세계입니다.",
         notes="Woody · Amber · Leather"),
    dict(slug="swan", name="SWAN", kw=["Grace", "Beauty", "Artistry"], mat="Textured Silver",
         color="#c7cbd3", chips=["#f1efe9", "#c7cbd3", "#8b97a8", "#4b5566"], img="swan-moon.jpg", alt="swan-gold.jpg",
         tag=None, kr="달빛 아래 고요한 수면. 백조는 절제된 아름다움의 세계입니다.",
         notes="Floral · Musk · Powdery"),
    dict(slug="orca", name="ORCA", kw=["Freedom", "Depth", "Journey"], mat="Deep Sapphire",
         color="#3fa3ad", chips=["#7cc7c9", "#2f8794", "#123c4f", "#0a1a26"], img="orca.jpg", alt=None,
         tag=None, kr="빛이 내려오는 깊은 바다. 범고래는 자유와 여정의 세계입니다.",
         notes="Aquatic · Amber · Marine"),
    dict(slug="leopard", name="LEOPARD", kw=["Elegance", "Independence", "Sensuality"], mat="Gold / Black",
         color="#c79b55", chips=["#d8ae63", "#a87a3a", "#3b2a16", "#111"], img="leopard.jpg", alt=None,
         tag=("Elegance Without Permission.", "허락을 구하지 않는 우아함."), kr=None,
         notes="Spicy · Floral · Amber"),
    dict(slug="panther", name="PANTHER", kw=["Mystery", "Intuition", "Night"], mat="Obsidian",
         color="#9a93a6", chips=["#5d586a", "#2c2a33", "#17161b", "#d08a3a"], img="panther.jpg", alt=None,
         tag=("The Power of Silence.", "침묵이 가진 압도적인 힘."), kr=None,
         notes="Woody · Musk · Spicy"),
    dict(slug="phoenix", name="PHOENIX", kw=["Renewal", "Elegance", "Transcendence"], mat="Fire Opal",
         color="#e2803a", chips=["#f2b25c", "#e2803a", "#9c3a1c", "#2a120a"], img=None, alt=None,
         tag=("Born Beyond Limits.", "한계를 넘어 다시 태어나다."), kr=None,
         notes=None),
]
LINES = [("PARFUM", "Scent of a story", "prod-parfum.jpg"), ("BAGS", "Carry a world", "prod-bag.jpg"),
         ("APPAREL", "Wear the tempo", "prod-clothing.jpg"), ("OBJECTS", "Live with art", "prod-objects.jpg")]


def header(active):
    cur = ' aria-current="page"'
    panel = "".join(f'<a href="{s}.html"{cur if s == active else ""}>{n}<small>{k}</small></a>' for s, n, k in NAV)
    return (f'<header class="site-header">'
            f'<button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu-panel">MENU</button>'
            f'<a class="brand" href="index.html" aria-label="BELiOR 홈"><img src="assets/img/mono-ivory.png" alt="BELiOR" width="22" height="43"></a>'
            f'<a class="head-link" href="private.html">PRIVATE</a></header>'
            f'<nav class="menu-panel" id="menu-panel" hidden aria-label="메뉴">{panel}</nav>')


def footer():
    links = "".join(f'<a href="{s}.html">{n}</a>' for s, n, _ in NAV)
    return (f'<footer class="site-footer"><div class="foot-top"><div class="foot-brand">'
            f'<img src="assets/img/mono-ivory.png" alt="BELiOR 기본 심볼" width="33" height="64">'
            f'<span class="wordmark">BELiOR</span><span class="label">Seoul · The Evening, Composed.</span></div>'
            f'<nav class="foot-nav" aria-label="하단 메뉴">{links}</nav></div><hr class="rule">'
            f'<div class="foot-base"><span class="label">Music · Collection · Atelier</span>'
            f'<span class="label" style="text-transform:none;letter-spacing:.08em">{MAIL}</span></div></footer>')


CHAPTERS = {}  # slug -> (label, mark image, round emblem?) used by the page-turn curtain


def curtain(slug):
    label, mark, rnd = CHAPTERS.get(slug, ("BELiOR", "mono-ivory.png", False))
    return (f'<div class="curtain{" round" if rnd else ""}" aria-hidden="true"><div class="c-inner">'
            f'<img class="c-mark" src="assets/img/{mark}" alt=""><span class="c-line"></span>'
            f'<span class="c-label">{label}</span></div></div>')


def page(slug, title, body, active=None, extra_style="", chapter=None):
    CHAPTERS[slug] = chapter or (title.replace("BELiOR ", "").upper() if title != "BELiOR" else "BELiOR", "mono-ivory.png", False)
    head = (f'<title>{title}</title><meta name="description" content="BELiOR — The Evening, Composed.">'
            f'{FONTS}<link rel="stylesheet" href="assets/site.css">{extra_style}')
    main = (curtain(slug) + header(active) + f'<main id="top">{body}</main>' + footer()
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


def scene(img, eyebrow, h1, lede="", full=True, pos="center", href=None, cta_text="알아보기", **_):
    return (f'<section class="scene{" scene--full" if full else ""}">'
            f'<img class="bg" src="assets/img/{img}" alt="" style="object-position:{pos}">'
            f'<div class="inner"><span class="label">{eyebrow}</span><h1>{h1}</h1>'
            f'{f"<p class=lede>{lede}</p>" if lede else ""}{cta(href, cta_text) if href else ""}</div></section>')


def door(href, img, title, text, pos="center"):
    return (f'<a class="door" href="{href}"><div class="ph"><img src="assets/img/{img}" alt="" loading="lazy" '
            f'style="object-position:{pos}"></div><span class="label">{title[0]}</span><h3>{title[1]}</h3>'
            f'<p>{text}</p><span class="more">Explore</span></a>')


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
{scene("bu-quartet.jpg", "Music", "The Art of a<br>Living Moment", "살아 있는 순간의 예술", pos="60% center", href="music.html")}
{scene("bu-aerial.jpg", "Editorial", "Brand Gala Dinner Show", "강 위로 저무는 저녁", pos="center 60%", href="music-gala.html")}
{scene("lion-portrait.jpg", "Collection", "One Symbol.<br>Endless Worlds.", "하나의 상징, 끝없는 세계", pos="center 30%", href="collection.html")}
<section class="carousel" aria-label="여섯 개의 컬렉션">
  <div class="track">{world_slides}</div>
  <div class="dots">{dots}</div>
</section>
<section class="scene scene--full plain">
  <div class="inner"><img class="plain-mark" src="assets/img/mono-ivory.png" alt="" width="40" height="79"><span class="label">Maison</span>
    <h1>Not Made to Be Seen.<br>Made to Be Remembered.</h1><p class="lede">보여지기 위해서가 아닌, 기억되기 위해.</p>{cta("maison.html")}</div>
</section>
{scene("panther.jpg", "Private", "By Appointment", "공연과 컬렉션에 관한 프라이빗 문의", pos="center 30%", href="private.html", cta_text="문의하기")}''')

# ---------------- maison ----------------
emb_mini = "".join(f'<img src="assets/img/emblem-{w["slug"]}.jpg" alt="{w["name"]} 엠블럼">' for w in WORLDS)
page("maison", "BELiOR Maison", f'''
{scene("lion-portrait.jpg", "The Maison · Seoul", "More than a brand.<br>A way of life.", "벨리오르는 단순한 브랜드가 아닙니다. 예술과 향, 그리고 당신의 일상이 만나는 하우스입니다.", pos="center 25%")}
<section class="section">
  <div class="spread">
    <div class="copy c-6"><span class="label">Philosophy</span><h3>The Evening, Composed.</h3>
      <div class="prose"><p>한 번의 저녁은 음악과 공간, 향과 사물이 함께 만드는 하나의 작품입니다.</p>
      <p class="muted">BELiOR는 그 저녁을 두 개의 세계로 나누어 준비합니다. 사람이 연주하는 <strong>MUSIC</strong>, 그리고 동물의 상징으로 이어지는 <strong>COLLECTION</strong>입니다.</p></div></div>
    <div class="c-6"><p class="quote">One Symbol. Endless Worlds.<small>하나의 상징, 끝없는 세계.</small></p></div>
  </div>
</section>
<section class="section section--night" id="symbol">
  <div class="section-head"><span class="label">Symbol System</span><h2>하나의 기본 심볼, 여섯 개의 엠블럼</h2></div>
  <div class="symbols">
    <div class="symbol-card"><div class="mark"><img src="assets/img/mono-ivory.png" alt="BELiOR 기본 심볼" width="76" height="150"></div>
      <span class="label">Maison Symbol</span><h3 style="font-size:1.8rem">BELiOR 기본 심볼</h3>
      <p class="muted">메종 전체를 대표합니다. MAISON · MUSIC · PRIVATE와 모든 공식 표기에 사용합니다.</p></div>
    <div class="symbol-card"><div class="mini">{emb_mini}</div>
      <span class="label">Collection Emblems</span><h3 style="font-size:1.8rem">동물 컬렉션 엠블럼</h3>
      <p class="muted">LION · SWAN · ORCA · LEOPARD · PANTHER · PHOENIX. 각 컬렉션 안에서만 사용하며, 음악 영역에는 쓰지 않습니다.</p></div>
  </div>
</section>
<section class="section">
  <div class="doors">
    {door("music.html", "bu-backstage.jpg", ("BELiOR Music", "MUSIC"), "실제 연주진과 공연 포트폴리오.")}
    {door("collection.html", "panther.jpg", ("BELiOR Collection", "COLLECTION"), "여섯 동물의 독립된 세계.")}
    {door("private.html", "bu-violin.jpg", ("By Appointment", "PRIVATE"), "공연과 컬렉션에 관한 프라이빗 문의.")}
  </div>
</section>''', "maison")

# ---------------- music ----------------
page("music", "BELiOR Music", f'''
{scene("bu-quartet.jpg", "BELiOR Music", "The Art of a<br>Living Moment.", "살아 있는 순간의 예술. 실제 무대와 현장에서 연주하는 BELiOR의 음악입니다.", pos="60% center")}
<section class="section">
  <div class="section-head"><span class="label">Music</span><h2>음악이 기억이 되는 순간</h2>
    <p class="muted">Where Music Becomes Memory.</p></div>
  <div class="doors">
    {door("music-artists.html", "bu-backstage.jpg", ("Artists", "연주진"), "현장에서 함께 호흡하는 BELiOR 연주진.")}
    {door("music-performances.html", "bu-aerial.jpg", ("Performances", "공연 포트폴리오"), "BELiOR가 함께한 행사와 무대.")}
    {door("music-gala.html", "bu-violinist.jpg", ("Editorial", "브랜드 갈라 디너 쇼"), "현장 · 리셉션 · 백스테이지의 기록.", pos="center 20%")}
    {door("music-inquiry.html", "bu-violin.jpg", ("Inquiry", "공연 문의"), "행사 정보를 남기면 프로그램을 제안드립니다.")}
  </div>
</section>
<section class="section section--night">
  <div class="statement"><span class="label">An Evening</span><h2>An Evening, Beautifully Composed.</h2><p>아름답게 구성된 하나의 저녁.</p></div>
</section>''', "music")

page("music-artists", "BELiOR Artists", f'''
{scene("bu-backstage.jpg", "Music · Artists", "BELiOR 연주진", "Beyond Performance. An Experience. 연주를 넘어, 하나의 경험.", pos="center 35%")}
<section class="section">
  <div class="section-head"><span class="label">The Ensemble</span><h2>현악 4중주 편성</h2>
    <p class="muted">연주자별 프로필은 확정 후 이 페이지에 게재합니다.</p></div>
  <div class="roles">
    <div class="role"><span class="label">Violin I</span><h3>제1 바이올린</h3><p class="muted">프로필 준비 중</p></div>
    <div class="role"><span class="label">Violin II</span><h3>제2 바이올린</h3><p class="muted">프로필 준비 중</p></div>
    <div class="role"><span class="label">Viola</span><h3>비올라</h3><p class="muted">프로필 준비 중</p></div>
    <div class="role"><span class="label">Cello</span><h3>첼로</h3><p class="muted">프로필 준비 중</p></div>
  </div>
</section>
<section class="section section--night">
  <div class="spread">
    <figure class="c-5"><img src="assets/img/bu-violinist.jpg" alt="행사장 잔디 위에서 바이올린을 든 연주자" loading="lazy"><figcaption>Brand Gala Dinner Show, Seoul</figcaption></figure>
    <div class="copy c-6 push-1" style="grid-column:7 / span 6"><span class="label">On Site</span><h3>무대가 아닌 곳에서도, 무대처럼</h3>
      <p class="muted">야외 잔디와 리셉션 공간, 디너 테이블 사이에서 행사의 흐름에 맞춰 연주합니다.</p>
      <a class="more" href="music-performances.html">Performances</a></div>
  </div>
</section>''', "music")

page("music-performances", "BELiOR Performances", f'''
{scene("bu-aerial.jpg", "Music · Performances", "공연 포트폴리오", "The Sound of an Extraordinary Evening. 특별한 저녁을 완성하는 선율.", pos="center 60%")}
<section class="section">
  <div class="section-head"><span class="label">Portfolio</span><h2>함께한 저녁</h2></div>
  <div class="rows">
    <a class="row" href="music-gala.html"><h3>Brand Gala Dinner Show</h3>
      <p>서울 · 한강을 내려다보는 야외 디너 · 현악 4중주 라이브 연주</p><span class="more">Editorial</span></a>
  </div>
  <p class="muted" style="margin-top:28px">추가 공연은 확인된 행사부터 순서대로 게재합니다.</p>
</section>
<section class="section section--night">
  <div class="spread">
    <div class="copy c-6"><span class="label">For Your Evening</span><h3>행사의 성격에 맞춘 프로그램</h3>
      <p class="muted">행사 일정과 장소, 진행 순서를 바탕으로 편성과 곡목을 제안드립니다.</p>
      <a class="more" href="music-inquiry.html">공연 문의</a></div>
    <figure class="c-6"><img src="assets/img/bu-quartet.jpg" alt="행사장 앞 야외 4중주" loading="lazy"><figcaption>Reception · Brand Gala Dinner Show</figcaption></figure>
  </div>
</section>''', "music")

page("music-gala", "Brand Gala Dinner Show", f'''
{scene("bu-aerial.jpg", "Editorial · Brand Gala Dinner Show, Seoul", "강 위로 저무는 저녁", "브랜드 갈라 디너 쇼에서 BELiOR는 현장의 라이브 연주를 맡았고, 연주에 대해 좋은 평가를 받았습니다.", pos="center 55%")}
<section class="section">
  <div class="spread">
    <figure class="c-8"><img src="assets/img/bu-quartet.jpg" alt="주황 조명 아래 행사장 앞에서 연주하는 4중주" loading="lazy"><figcaption>I. Reception — 하우스 앞 야외 4중주</figcaption></figure>
    <div class="copy c-4"><span class="label">Reception</span><h3>손님이 도착하는 시간</h3>
      <p class="muted">조명이 켜지기 시작할 무렵, 리셉션의 공기를 현악 4중주로 채웠습니다.</p></div>
  </div>
  <div class="spread">
    <div class="copy c-5"><span class="label">The Venue</span><h3>원형 테이블과 한강</h3>
      <p class="muted">언덕 위 잔디에 놓인 원형 디너 테이블, 그 너머로 강과 다리가 이어지는 풍경입니다.</p></div>
    <figure class="c-6 push-1" style="grid-column:7 / span 6"><img src="assets/img/bu-violinist.jpg" alt="디너 테이블 옆 잔디 위의 바이올리니스트" loading="lazy"><figcaption>II. Venue — 디너 테이블 옆에서</figcaption></figure>
  </div>
  <div class="spread">
    <figure class="c-5"><img src="assets/img/bu-violin.jpg" alt="바이올린과 활의 클로즈업" loading="lazy"><figcaption>III. Detail</figcaption></figure>
    <figure class="c-7"><img src="assets/img/bu-backstage.jpg" alt="행사장 입구에 선 연주진" loading="lazy"><figcaption>IV. Backstage — 공연을 마친 연주진</figcaption></figure>
  </div>
</section>
<section class="section section--night">
  <div class="statement"><span class="label">BELiOR Music</span><h2>Where Music Becomes Memory.</h2><p>음악이 기억이 되는 순간.</p>
    <a class="more" href="music-inquiry.html">공연 문의</a></div>
</section>''', "music")

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
</section>''', "music")

# ---------------- collection ----------------
emblems = "".join(f'<a class="emblem" href="collection-{w["slug"]}.html"><img src="assets/img/emblem-{w["slug"]}.jpg" alt="{w["name"]} 엠블럼"><span class="label">{w["name"]}</span></a>' for w in WORLDS)


def world_card(w):
    img = w["img"] or "phoenix.jpg"
    return (f'<a class="world" href="collection-{w["slug"]}.html" style="--world:{w["color"]}">'
            f'<img class="bg" src="assets/img/{img}" alt="" loading="lazy">'
            f'<span class="label mat" style="color:{w["color"]}">{w["mat"]}</span>'
            f'<div class="txt"><h3>{w["name"]}</h3><span class="kw">{" · ".join(w["kw"])}</span>'
            f'<span class="more" style="color:{w["color"]}">Explore</span></div></a>')


page("collection", "BELiOR Collection", f'''
{scene("lion-wide.jpg", "The Animal Collection", "One Symbol.<br>Endless Worlds.", "하나의 상징, 끝없는 세계. BELiOR는 여섯 동물의 상징으로 각기 다른 감각의 세계를 선보입니다.", pos="center 35%")}
<section class="section">
  <div class="section-head"><span class="label">Emblem Collection</span><h2>여섯 개의 엠블럼</h2></div>
  <div class="emblems">{emblems}</div>
</section>
<div class="worlds">{"".join(world_card(w) for w in WORLDS)}</div>
<section class="section section--night">
  <div class="section-head"><span class="label">From World to Object</span><h2>세계관이 사물이 되기까지</h2>
    <p class="muted">각 컬렉션은 PARFUM · BAGS · APPAREL · OBJECTS로 이어집니다. 제품은 공개 준비 중입니다.</p></div>
  <div class="lines">{"".join(f'<div class="line-item"><div class="ph"><img src="assets/img/{i}" alt="{n} 콘셉트 이미지" loading="lazy"></div><span class="label" style="color:var(--ivory)">{n}</span><p class="muted">{s}</p></div>' for n, s, i in LINES)}</div>
</section>''', "collection")

for i, w in enumerate(WORLDS):
    prev_w, next_w = WORLDS[i - 1], WORLDS[(i + 1) % len(WORLDS)]
    style = f'<style>:root{{--world:{w["color"]}}}</style>'
    if w["img"]:
        hero = scene(w["img"], f'The Animal Collection · {w["mat"]}', f'{w["name"]}<br><span class="accent">Collection</span>',
                     (f'{w["tag"][0]} {w["tag"][1]}' if w["tag"] else w["kr"]),
                     pos="center 35%", mark=f'emblem-{w["slug"]}.jpg', round_mark=True)
    else:
        hero = (f'<section class="section" style="padding-top:150px"><div class="spread">'
                f'<div class="copy c-6"><span class="label">The Animal Collection · {w["mat"]}</span>'
                f'<h1 style="font-size:clamp(2.6rem,7vw,6rem)">{w["name"]}<br><span class="accent">Collection</span></h1>'
                f'<p class="lede">{w["tag"][0]}<br><span class="muted">{w["tag"][1]}</span></p></div>'
                f'<div class="c-6"><div class="phoenix-frame"><img src="assets/img/phoenix.jpg" alt="불꽃 날개를 펼친 불사조"></div></div></div></section>')
    chips = "".join(f'<span class="chip" style="background:{c}"></span>' for c in w["chips"])
    notes = (f'<div class="fact"><span class="label">Fragrance · Concept Notes</span><span class="val">{w["notes"]}</span></div>'
             if w["notes"] else
             '<div class="fact"><span class="label">Fragrance</span><span class="val">공개 준비 중</span></div>')
    second = ""
    if w["alt"]:
        second = (f'<section class="section"><div class="spread"><figure class="c-6"><img src="assets/img/{w["alt"]}" alt="" loading="lazy"></figure>'
                  f'<div class="copy c-5 push-1" style="grid-column:8 / span 5"><img src="assets/img/emblem-{w["slug"]}.jpg" alt="{w["name"]} 엠블럼" style="width:120px;border-radius:50%">'
                  f'<span class="label">{w["name"]} Emblem</span><p class="muted">{w["name"]} 컬렉션의 모든 사물에는 이 엠블럼이 새겨집니다.</p></div></div></section>')
    else:
        second = (f'<section class="section"><div class="statement"><img src="assets/img/emblem-{w["slug"]}.jpg" alt="{w["name"]} 엠블럼" style="width:140px;border-radius:50%">'
                  f'<span class="label">{w["name"]} Emblem</span><p>{w["name"]} 컬렉션의 모든 사물에는 이 엠블럼이 새겨집니다.</p></div></section>')
    page(f'collection-{w["slug"]}', f'{w["name"].title()} Collection', f'''
<div class="world-page">
{hero}
<section class="section">
  <div class="facts">
    <div class="fact"><span class="label">Keywords</span><span class="val">{" · ".join(w["kw"])}</span></div>
    <div class="fact"><span class="label">Material · Tone</span><span class="val accent">{w["mat"]}</span><div class="chips">{chips}</div></div>
    {notes}
  </div>
</section>
{second}
<section class="section section--night">
  <div class="section-head"><span class="label">{w["name"]} Lines</span><h2>{w["name"]}의 사물들</h2><p class="muted">제품 사양과 출시 일정은 확정 후 공개합니다.</p></div>
  <div class="lines">{"".join(f'<div class="line-item"><div class="ph"><img src="assets/img/{im}" alt="{n} 콘셉트 이미지" loading="lazy"></div><span class="label" style="color:var(--ivory)">{n}</span></div>' for n, s, im in LINES)}</div>
</section>
<section class="section">
  <nav class="pager" aria-label="다른 컬렉션">
    <a href="collection-{prev_w["slug"]}.html"><span class="label">Previous</span><span class="wordmark">{prev_w["name"]}</span></a>
    <a href="collection.html" style="align-self:center"><span class="more">All Collections</span></a>
    <a href="collection-{next_w["slug"]}.html"><span class="label">Next</span><span class="wordmark">{next_w["name"]}</span></a>
  </nav>
</section>
</div>''', "collection", style, chapter=(f'{w["name"]} COLLECTION', f'emblem-{w["slug"]}.jpg', True))

# ---------------- atelier ----------------
page("atelier", "BELiOR Atelier", f'''
{scene("prod-atelier.jpg", "Atelier", "Craft Your Moment.", "하나의 세계관이 손에 잡히는 사물이 되기까지의 과정입니다.", pos="center 70%")}
<section class="section">
  <div class="section-head"><span class="label">Process</span><h2>제작의 순서</h2><p class="muted">아틀리에 운영 방식과 제작 일정은 확정 후 안내합니다.</p></div>
  <div class="steps">
    <div class="step"><h3>World</h3><p>컬렉션의 동물과 키워드, 소재와 색을 정합니다.</p></div>
    <div class="step"><h3>Scent</h3><p>세계관에 맞는 향의 방향을 잡습니다.</p></div>
    <div class="step"><h3>Object</h3><p>향수와 가방, 의류와 오브제로 형태를 만듭니다.</p></div>
    <div class="step"><h3>Seal</h3><p>엠블럼을 새기고 패키지로 마무리합니다.</p></div>
  </div>
</section>
<section class="section section--night">
  <figure style="margin:0;display:grid;gap:12px"><img src="assets/img/atelier-wide.jpg" alt="박스, 실링 왁스, 향수와 캔들 패키지 콘셉트" loading="lazy" style="width:100%"><figcaption class="label">Packaging · Concept</figcaption></figure>
</section>''', "atelier")

# ---------------- journal ----------------
page("journal", "BELiOR Journal", f'''
<section class="section" style="padding-top:150px">
  <div class="section-head"><span class="label">Journal</span><h1 style="font-size:clamp(2.6rem,7vw,5.4rem)">Stories behind the Maison.</h1><p class="muted">브랜드 뒤의 이야기.</p></div>
  <div class="rows">
    <a class="row" href="music-gala.html"><h3>브랜드 갈라 디너 쇼, 그날의 기록</h3><p>Music · 현장 · 리셉션 · 백스테이지</p><span class="more">Read</span></a>
    <a class="row" href="collection.html"><h3>하나의 상징, 여섯 개의 세계</h3><p>Collection · Lion · Swan · Orca · Leopard · Panther · Phoenix</p><span class="more">Read</span></a>
    <a class="row" href="maison.html#symbol"><h3>기본 심볼과 컬렉션 엠블럼</h3><p>Maison · BELiOR의 심볼 체계</p><span class="more">Read</span></a>
  </div>
</section>''', "journal")

# ---------------- private ----------------
PRIV_FIELDS = [("p-topic", "topic", "문의 분야", "select", True, False), ("p-name", "name", "성함", "text", True, False),
               ("p-contact", "contact", "연락처", "text", True, False), ("p-date", "date", "희망 일정", "text", False, False),
               ("p-note", "note", "문의 내용", "textarea", True, True)]
page("private", "BELiOR Private", f'''
{scene("panther.jpg", "Private · By Appointment", "Extraordinary<br>moments.", "공연과 컬렉션에 관한 문의는 개별 상담으로 진행합니다.", pos="center 30%")}
<section class="section">
  <div class="section-head"><span class="label">Private Inquiry</span><h2>프라이빗 문의</h2><p class="muted">남겨주신 내용을 확인한 뒤 담당자가 직접 연락드립니다.</p></div>
  <form class="form" data-inquiry="private-result" data-title="BELiOR PRIVATE 문의" novalidate>
    {fields(PRIV_FIELDS, ["MUSIC · 공연", "COLLECTION · 컬렉션", "ATELIER · 맞춤 제작", "기타"])}
    <button class="btn" type="submit">문의 내용 정리</button>
  </form>
  <div style="margin-top:36px">{result_box("private-result")}</div>
</section>''', "private")

import json
(OUT / "assets/pages.js").write_text("window.BELIOR_PAGES=" + json.dumps(
    {k: {"label": v[0], "mark": "assets/img/" + v[1], "round": v[2]} for k, v in CHAPTERS.items()}, ensure_ascii=False) + ";", encoding="utf-8")
print(sorted(p.name for p in OUT.glob("*.html")))
