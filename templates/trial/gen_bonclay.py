# TRIAL: painted full-bleed clue scenes (original art only) for one quiz.
# usage: python3 gen_bonclay.py OUT.html
import sys, random, math
R = random.Random(7)
W, HH = 1080, 1260  # art canvas (full bleed behind the header, fades into the slide under the card)

def common_defs(p, fade_to):
    return f'''
<filter id="{p}grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" stitchTiles="stitch" seed="3"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .10"/></feComponentTransfer></filter>
<filter id="{p}glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="22"/></filter>
<filter id="{p}soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="{p}blur3"><feGaussianBlur stdDeviation="3"/></filter>
<filter id="{p}shadow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="18" stdDeviation="16" flood-color="#000" flood-opacity=".55"/></filter>
<linearGradient id="{p}fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="{fade_to}" stop-opacity="0"/><stop offset="1" stop-color="{fade_to}"/></linearGradient>
<filter id="{p}paint" x="-2%" y="-2%" width="104%" height="104%"><feTurbulence type="fractalNoise" baseFrequency=".022" numOctaves="3" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G"/></filter>
<filter id="{p}canvas" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .35" numOctaves="2" seed="5"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="table" tableValues="0 .07"/></feComponentTransfer></filter>
<filter id="{p}bokeh" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4"/></filter>
<radialGradient id="{p}vig" cx=".5" cy=".42" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>'''

def finish(p):
    return f'''<rect width="{W}" height="{HH}" fill="url(#{p}vig)"/><rect width="{W}" height="{HH}" filter="url(#{p}grain)"/>
<rect y="{HH-330}" width="{W}" height="330" fill="url(#{p}fade)"/>'''

def svg(p, fade_to, defs, body, fx=''):
    return (f'<svg class="art" viewBox="0 0 {W} {HH}" preserveAspectRatio="xMidYMid slice" style="top:0;height:{HH}px"><defs>{common_defs(p, fade_to)}{defs}</defs>'
            f'<g filter="url(#{p}paint)">{body}</g>{fx}<rect width="{W}" height="{HH}" filter="url(#{p}canvas)"/>{finish(p)}</svg>')

def bokeh(p, n, cols, x0, x1, y0, y1, rmin=8, rmax=34, seed=2, op=(.12, .35)):
    r = random.Random(seed); out = ''
    for _ in range(n):
        out += f'<circle cx="{r.uniform(x0,x1):.0f}" cy="{r.uniform(y0,y1):.0f}" r="{r.uniform(rmin,rmax):.0f}" fill="{r.choice(cols)}" opacity="{r.uniform(*op):.2f}" filter="url(#{p}bokeh)"/>'
    return out

def motes(n, x0, x1, y0, y1, col='#fff', seed=3):
    r = random.Random(seed)
    return ''.join(f'<circle cx="{r.uniform(x0,x1):.0f}" cy="{r.uniform(y0,y1):.0f}" r="{r.uniform(1,3.2):.1f}" fill="{col}" opacity="{r.uniform(.3,.9):.2f}"/>' for _ in range(n))

def godrays(p, cx, cy, n, length, col, spread=(0, 6.28), op=.16, seed=4, width=.06):
    r = random.Random(seed); out = ''
    for k in range(n):
        a = spread[0] + (spread[1] - spread[0]) * (k + r.uniform(0, 1)) / n
        w = width * r.uniform(.5, 1.4)
        out += f'<path d="M{cx} {cy} L{cx+math.cos(a-w)*length:.0f} {cy+math.sin(a-w)*length:.0f} L{cx+math.cos(a+w)*length:.0f} {cy+math.sin(a+w)*length:.0f}Z" fill="{col}" opacity="{op*r.uniform(.5,1.2):.2f}" filter="url(#{p}soft)"/>'
    return out

def stars(n, y0, y1, rmax=2.4, seed=1, op=(0.4, 1)):
    r = random.Random(seed); s = ''
    for _ in range(n):
        x, y, rr = r.uniform(0, W), r.uniform(y0, y1), r.uniform(0.6, rmax)
        s += f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{rr:.1f}" fill="#fff" opacity="{r.uniform(*op):.2f}"/>'
    return s

def sparkle(x, y, s, col='#fff', op=1):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 -40 C4 -8 8 -4 40 0 C8 4 4 8 0 40 C-4 8 -8 4 -40 0 C-8 -4 -4 -8 0 -40Z" fill="{col}" opacity="{op}"/>'

# ------------------------------------------------------------ 1: a secret party paradise hidden deep in a prison
def scene1():
    p = 's1'
    bricks = ''
    for row in range(0, 14):
        y = 80 + row * 64; off = (row % 2) * 70
        for c in range(-1, 9):
            x = c * 140 + off
            sh = R.uniform(-.06, .06)
            bricks += f'<rect x="{x+4}" y="{y+4}" width="132" height="56" rx="10" fill="url(#{p}brick)" opacity="{0.82+sh:.2f}"/>'
            bricks += f'<path d="M{x+12} {y+10} L{x+128} {y+10}" stroke="#6a5e78" stroke-width="3" opacity=".35"/>'
            if R.random() < .12: bricks += f'<path d="M{x+40} {y+12} l14 18 l-8 12 l16 14" stroke="#0c0910" stroke-width="3" fill="none" opacity=".7"/>'
    confetti = ''
    cols = ['#ff5fa8', '#ffd34d', '#7fe0ff', '#b98cff', '#ffffff', '#ff8a3d']
    for _ in range(120):
        x, y = R.uniform(330, 750), R.uniform(250, 980)
        confetti += f'<rect x="{x:.0f}" y="{y:.0f}" width="{R.uniform(8,18):.0f}" height="{R.uniform(4,9):.0f}" rx="2" fill="{R.choice(cols)}" transform="rotate({R.uniform(0,180):.0f} {x:.0f} {y:.0f})" opacity="{R.uniform(.6,1):.2f}"/>'
    facets = ''
    for i in range(-5, 6):
        for j in range(-5, 6):
            if i * i + j * j > 26: continue
            l = R.uniform(.35, 1)
            facets += f'<rect x="{i*15-7}" y="{j*15-7}" width="14" height="14" fill="rgb({int(180*l+60)},{int(170*l+60)},{int(210*l+45)})"/>'
    beams = ''.join(f'<path d="M540 360 L{540+math.cos(a)*900:.0f} {360+math.sin(a)*900:.0f} L{540+math.cos(a+.05)*900:.0f} {360+math.sin(a+.05)*900:.0f}Z" fill="{c}" opacity=".18"/>'
                    for a, c in [(0.3, '#ff5fa8'), (0.9, '#7fe0ff'), (1.6, '#ffd34d'), (2.3, '#b98cff'), (2.75, '#ff5fa8')])
    defs = f'''
<linearGradient id="{p}brick" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3b3346"/><stop offset="1" stop-color="#211c29"/></linearGradient>
<radialGradient id="{p}door" cx=".5" cy=".55" r=".6"><stop offset="0" stop-color="#fff3fb"/><stop offset=".35" stop-color="#ff9ad0"/><stop offset=".75" stop-color="#e0368f"/><stop offset="1" stop-color="#5a0f45"/></radialGradient>
<linearGradient id="{p}spill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ff8ccc" stop-opacity=".75"/><stop offset="1" stop-color="#ff8ccc" stop-opacity="0"/></linearGradient>
<linearGradient id="{p}gold" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".45" stop-color="#f5c23a"/><stop offset="1" stop-color="#8a5a0c"/></linearGradient>
<linearGradient id="{p}bar" x1="0" x2="1"><stop offset="0" stop-color="#0d0b10"/><stop offset=".7" stop-color="#2b2630"/><stop offset="1" stop-color="#ff7cc0"/></linearGradient>
<radialGradient id="{p}ball" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
<clipPath id="{p}arch"><path d="M380 1000 L380 460 A160 160 0 0 1 700 460 L700 1000Z"/></clipPath>
<clipPath id="{p}ballc"><circle r="80"/></clipPath>'''
    body = f'''<rect width="{W}" height="{HH}" fill="#120e17"/>{bricks}
<rect width="{W}" height="{HH}" fill="#0b0810" opacity=".35"/>
<!-- floor in perspective -->
<path d="M0 1000 L1080 1000 L1080 1260 L0 1260Z" fill="#1a1520"/>
{''.join(f'<line x1="{540+(i-8)*16}" y1="1000" x2="{540+(i-8)*170}" y2="1260" stroke="#2c2533" stroke-width="3"/>' for i in range(17))}
{''.join(f'<line x1="0" y1="{1000+k*k*6}" x2="1080" y2="{1000+k*k*6}" stroke="#2c2533" stroke-width="3"/>' for k in range(1, 8))}
<!-- glow + doorway -->
<ellipse cx="540" cy="640" rx="420" ry="460" fill="#ff5fae" opacity=".35" filter="url(#{p}glow)"/>
<path d="M352 1000 L352 452 A188 188 0 0 1 728 452 L728 1000Z" fill="#2a2330" stroke="#4a4152" stroke-width="10"/>
{''.join(f'<path d="M{540+math.cos(a)*190:.0f} {452+math.sin(a)*190:.0f} L{540+math.cos(a)*226:.0f} {452+math.sin(a)*226:.0f}" stroke="#4a4152" stroke-width="12"/>' for a in [math.pi*(1+k/8) for k in range(1,8)])}
<g clip-path="url(#{p}arch)"><rect x="380" y="280" width="320" height="720" fill="url(#{p}door)"/>{beams}{confetti}
 <path d="M380 1000 L460 900 L620 900 L700 1000Z" fill="#ffb3dc" opacity=".35"/></g>
<path d="M380 1000 L700 1000 L1000 1260 L80 1260Z" fill="url(#{p}spill)"/>
<!-- disco ball on a chain -->
<line x1="540" y1="260" x2="540" y2="350" stroke="#b9b2c2" stroke-width="4"/>
<g transform="translate(540 430)"><circle r="92" fill="#fff" opacity=".25" filter="url(#{p}soft)"/><g clip-path="url(#{p}ballc)">{facets}</g><circle r="80" fill="url(#{p}ball)"/><circle r="80" fill="none" stroke="#5c5470" stroke-width="4"/></g>
{sparkle(470, 380, .55)}{sparkle(612, 470, .4, '#ffd34d')}{sparkle(520, 520, .3)}
<!-- floating crown -->
<g transform="translate(540 210)" filter="url(#{p}shadow)"><ellipse cx="0" cy="10" rx="190" ry="90" fill="#ffd34d" opacity=".35" filter="url(#{p}glow)"/>
 <path d="M-120 40 L-140 -70 L-70 -10 L0 -95 L70 -10 L140 -70 L120 40Z" fill="url(#{p}gold)" stroke="#6b4508" stroke-width="5" stroke-linejoin="round"/>
 <rect x="-126" y="34" width="252" height="40" rx="10" fill="url(#{p}gold)" stroke="#6b4508" stroke-width="5"/>
 <circle cx="0" cy="54" r="12" fill="#e0368f" stroke="#6b4508" stroke-width="3"/><circle cx="-70" cy="54" r="9" fill="#7fe0ff" stroke="#6b4508" stroke-width="3"/><circle cx="70" cy="54" r="9" fill="#7fe0ff" stroke="#6b4508" stroke-width="3"/>
 <circle cx="-140" cy="-74" r="10" fill="#fff2b0"/><circle cx="140" cy="-74" r="10" fill="#fff2b0"/><circle cx="0" cy="-99" r="12" fill="#fff2b0"/>
 <path d="M-100 -2 L-110 -50" stroke="#fff" stroke-width="5" opacity=".6" stroke-linecap="round"/></g>
{sparkle(360, 170, .5, '#ffd34d')}{sparkle(735, 150, .6, '#fff')}
<!-- prison bars in the foreground -->
{''.join(f'<rect x="{x}" y="0" width="34" height="1260" fill="url(#{p}bar)" opacity=".95"/>' for x in [40, 150, 896, 1006])}
<rect x="0" y="120" width="230" height="26" fill="#1a1620"/><rect x="850" y="120" width="230" height="26" fill="#1a1620"/>'''
    chains = ''.join(f'<g opacity=".9">' + ''.join(f'<ellipse cx="{cx}" cy="{40+i*34}" rx="{9 if i%2 else 13}" ry="18" fill="none" stroke="#6b6378" stroke-width="6"/>' for i in range(n)) + '</g>' for cx, n in [(290, 9), (800, 7)])
    pools = ''.join(f'<ellipse cx="{x}" cy="{y}" rx="70" ry="44" fill="{c}" opacity=".22" filter="url(#{p}soft)"/>' for x, y, c in [(250, 420, '#ff5fa8'), (830, 360, '#7fe0ff'), (230, 760, '#ffd34d'), (860, 700, '#b98cff'), (300, 230, '#7fe0ff'), (780, 600, '#ff5fa8')])
    refl = f'<g opacity=".35" transform="translate(0 2000) scale(1 -1)"><rect x="380" y="760" width="320" height="240" fill="url(#{p}door)"/></g>'
    fx = (godrays(p, 540, 720, 9, 700, '#ffc0e4', (0.9, 2.25), .22, seed=11, width=.05) + refl
          + bokeh(p, 28, ['#ff5fa8', '#ffd34d', '#7fe0ff', '#fff'], 300, 780, 220, 1000, seed=5) + motes(60, 340, 740, 300, 1100, '#ffe6f4', 6))
    return svg(p, '#120e17', defs, chains + pools + body, fx)

# ------------------------------------------------------------ 2: giant iron gates opening onto a stormy sea
def scene2():
    p = 's2'
    rivets = ''.join(f'<circle cx="{x}" cy="{y}" r="7" fill="url(#{p}riv)"/>' for x in range(190, 540, 70) for y in range(230, 1000, 90))
    rivets += ''.join(f'<circle cx="{x}" cy="{y}" r="7" fill="url(#{p}riv)"/>' for x in range(600, 900, 70) for y in range(230, 1000, 90))
    clouds = ''.join(f'<ellipse cx="{R.uniform(-50,1130):.0f}" cy="{R.uniform(20,260):.0f}" rx="{R.uniform(120,260):.0f}" ry="{R.uniform(40,80):.0f}" fill="#{R.choice(["2a3963","34477a","1e2b4f"])}" opacity=".9" filter="url(#{p}soft)"/>' for _ in range(16))
    rain = ''.join(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x-14:.0f}" y2="{y+46:.0f}" stroke="#b8c8ff" stroke-width="2" opacity=".35"/>' for x, y in [(R.uniform(0, W), R.uniform(0, 1100)) for _ in range(110)])
    defs = f'''
<linearGradient id="{p}sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#070b1c"/><stop offset=".6" stop-color="#1b2a55"/><stop offset="1" stop-color="#2d3f75"/></linearGradient>
<linearGradient id="{p}iron" x1="0" x2="1"><stop offset="0" stop-color="#1c2230"/><stop offset=".45" stop-color="#3f4a5e"/><stop offset=".55" stop-color="#4c586d"/><stop offset="1" stop-color="#232a38"/></linearGradient>
<linearGradient id="{p}band" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#5a6478"/><stop offset=".5" stop-color="#8d98ad"/><stop offset="1" stop-color="#3a4254"/></linearGradient>
<radialGradient id="{p}riv" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#d8deea"/><stop offset="1" stop-color="#2b3140"/></radialGradient>
<linearGradient id="{p}beam" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff8dc" stop-opacity=".95"/><stop offset="1" stop-color="#ffd36b" stop-opacity="0"/></linearGradient>
<linearGradient id="{p}sea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#16244a"/><stop offset="1" stop-color="#070c1c"/></linearGradient>'''
    body = f'''<rect width="{W}" height="{HH}" fill="url(#{p}sky)"/>{clouds}
<path d="M760 0 L700 120 L740 125 L660 280" stroke="#e6edff" stroke-width="7" fill="none" opacity=".9"/><path d="M760 0 L700 120 L740 125 L660 280" stroke="#9fb6ff" stroke-width="26" fill="none" opacity=".35" filter="url(#{p}soft)"/>
<!-- light pouring through the gap -->
<path d="M520 200 L560 200 L1080 1260 L0 1260Z" fill="url(#{p}beam)" opacity=".55"/>
<rect x="515" y="190" width="50" height="830" fill="#fff4c8" filter="url(#{p}glow)"/>
<rect x="528" y="190" width="24" height="830" fill="#fffbe8"/>
<!-- the two gate leaves, slightly open -->
<g filter="url(#{p}shadow)">
 <path d="M150 190 L520 200 L520 1020 L150 1020Z" fill="url(#{p}iron)"/>
 <path d="M560 200 L930 190 L930 1020 L560 1020Z" fill="url(#{p}iron)"/>
 {''.join(f'<rect x="150" y="{y}" width="370" height="26" fill="url(#{p}band)"/><rect x="560" y="{y}" width="370" height="26" fill="url(#{p}band)"/>' for y in (260, 480, 700, 920))}
 <rect x="130" y="170" width="820" height="40" rx="8" fill="url(#{p}band)"/>
 {rivets}
 <path d="M520 200 L520 1020" stroke="#ffe9a8" stroke-width="5" opacity=".9"/><path d="M560 200 L560 1020" stroke="#ffe9a8" stroke-width="5" opacity=".9"/>
 <circle cx="490" cy="610" r="30" fill="none" stroke="#a5afc2" stroke-width="12"/><circle cx="590" cy="610" r="30" fill="none" stroke="#a5afc2" stroke-width="12"/>
</g>
<!-- stone pillars -->
<rect x="60" y="120" width="100" height="920" fill="#262c3a"/><rect x="920" y="120" width="100" height="920" fill="#262c3a"/>
<rect x="60" y="120" width="100" height="920" fill="#000" opacity=".25"/><rect x="980" y="120" width="40" height="920" fill="#000" opacity=".3"/>
{rain}
<!-- sea -->
<path d="M0 1000 Q90 970 180 1000 T360 1000 T540 1000 T720 1000 T900 1000 T1080 1000 L1080 1260 L0 1260Z" fill="url(#{p}sea)"/>
<path d="M420 1000 L660 1000 L900 1260 L180 1260Z" fill="#ffe9a8" opacity=".22"/>
{''.join(f'<path d="M{x} {y} q30 -16 60 0" stroke="#d9e4ff" stroke-width="4" fill="none" opacity=".55"/>' for x, y in [(R.uniform(0, 1000), R.uniform(1010, 1200)) for _ in range(22)])}
<!-- tiny ship slipping through the light -->
<g transform="translate(540 1040) scale(.55)"><path d="M-120 0 L120 0 L90 46 L-90 46Z" fill="#120d0a"/><line x1="0" y1="0" x2="0" y2="-170" stroke="#120d0a" stroke-width="8"/><path d="M6 -160 Q90 -100 6 -30Z" fill="#120d0a"/><path d="M-6 -150 Q-70 -100 -6 -40Z" fill="#120d0a"/></g>
{sparkle(540, 220, .7, '#fffbe8')}'''
    panels = ''.join(f'<rect x="{x}" y="{y}" width="140" height="170" rx="10" fill="none" stroke="#6c778e" stroke-width="5" opacity=".55"/><path d="M{x+70} {y+30} l40 55 l-40 55 l-40 -55Z" fill="none" stroke="#6c778e" stroke-width="4" opacity=".5"/>' for x in (190, 350, 600, 760) for y in (300, 520, 740))
    foam = ''.join(f'<path d="M{x:.0f} {y:.0f} q40 -26 80 0 q-18 -6 -40 -4 q-22 2 -40 4Z" fill="#e8f0ff" opacity=".7"/>' for x, y in [(R.uniform(0, 1000), R.uniform(1000, 1180)) for _ in range(16)])
    lantern = f'<circle cx="575" cy="1000" r="30" fill="#ffd36b" opacity=".6" filter="url(#{p}soft)"/><circle cx="575" cy="1000" r="5" fill="#fff6c8"/>'
    near = ''.join(f'<line x1="{x:.0f}" y1="{y:.0f}" x2="{x-26:.0f}" y2="{y+90:.0f}" stroke="#dbe6ff" stroke-width="3.5" opacity=".28"/>' for x, y in [(R.uniform(0, W), R.uniform(0, 1100)) for _ in range(40)])
    fx = (f'<ellipse cx="700" cy="160" rx="360" ry="200" fill="#9fb6ff" opacity=".22" filter="url(#{p}glow)"/>' + foam + lantern + near
          + f'<rect x="0" y="930" width="1080" height="120" fill="#b8c8ff" opacity=".12" filter="url(#{p}glow)"/>' + motes(40, 380, 700, 200, 1000, '#fff6d8', 8))
    body = body.replace('{rivets}', '')
    return svg(p, '#0a1022', defs, body.replace('<rect x="130" y="170"', panels + '<rect x="130" y="170"', 1), fx)

# ------------------------------------------------------------ 3: decoy ship with a theatre mask sail draws a fleet away at sunset
def ship(x, y, s, sail='#f4e6cc', hull='#3a2214', mask=False, p='s3'):
    m = ''
    if mask:
        m = f'''<g transform="translate(18 -165) scale(1.05)"><path d="M-70 -60 Q0 -95 70 -60 Q78 20 0 70 Q-78 20 -70 -60Z" fill="#fff" stroke="#2a1a10" stroke-width="5"/>
<path d="M-44 -22 q16 -16 32 0" stroke="#2a1a10" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M12 -22 q16 -16 32 0" stroke="#2a1a10" stroke-width="7" fill="none" stroke-linecap="round"/>
<path d="M-38 16 Q0 52 38 16" fill="#c8262c" stroke="#2a1a10" stroke-width="5"/><circle cx="-52" cy="8" r="9" fill="#ff9fb8" opacity=".7"/><circle cx="52" cy="8" r="9" fill="#ff9fb8" opacity=".7"/></g>'''
    return f'''<g transform="translate({x} {y}) scale({s})">
<path d="M-190 0 L200 0 L150 70 L-150 70Z" fill="{hull}"/><path d="M-190 0 L200 0 L190 14 L-180 14Z" fill="#000" opacity=".25"/>
<line x1="10" y1="0" x2="10" y2="-330" stroke="{hull}" stroke-width="12"/><line x1="-110" y1="0" x2="-110" y2="-210" stroke="{hull}" stroke-width="9"/>
<path d="M18 -310 Q170 -180 18 -40Z" fill="{sail}"/><path d="M18 -310 Q170 -180 18 -40" fill="none" stroke="#000" stroke-opacity=".15" stroke-width="6"/>
<path d="M2 -300 Q-120 -190 2 -50Z" fill="{sail}" opacity=".9"/><path d="M-104 -200 Q-30 -130 -104 -40Z" fill="{sail}" opacity=".9"/>
{m}</g>'''

def scene3():
    p = 's3'
    defs = f'''
<linearGradient id="{p}sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#2b1a55"/><stop offset=".38" stop-color="#b8407a"/><stop offset=".62" stop-color="#ff8a4c"/><stop offset=".75" stop-color="#ffcf7a"/></linearGradient>
<linearGradient id="{p}sea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#6b2d5a"/><stop offset=".4" stop-color="#2f1d4a"/><stop offset="1" stop-color="#120c22"/></linearGradient>
<radialGradient id="{p}sun" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff6d8"/><stop offset=".5" stop-color="#ffd27a"/><stop offset="1" stop-color="#ff8a4c" stop-opacity="0"/></radialGradient>'''
    hz = 760
    refl = ''.join(f'<rect x="{540-w/2:.0f}" y="{y}" width="{w:.0f}" height="6" rx="3" fill="#ffd98f" opacity="{.75-(y-hz)/700:.2f}"/>' for y, w in [(hz + 14 + k * 26, R.uniform(80, 340) * (1 + k * .08)) for k in range(16)])
    waves = ''.join(f'<path d="M{x:.0f} {y:.0f} q22 -10 44 0" stroke="#ffb88a" stroke-width="3" fill="none" opacity=".45"/>' for x, y in [(R.uniform(0, 1040), R.uniform(hz + 20, 1200)) for _ in range(40)])
    smoke = ''.join(f'<circle cx="{x}" cy="{y}" r="{r}" fill="#e8d6e8" opacity=".55" filter="url(#{p}soft)"/>' for x, y, r in [(905, 665, 26), (930, 650, 18), (790, 690, 22), (812, 672, 16)])
    gulls = ''.join(f'<path d="M{x} {y} q14 -14 28 0 q14 -14 28 0" stroke="#2b1a35" stroke-width="5" fill="none"/>' for x, y in [(160, 300), (230, 260), (760, 330)])
    body = f'''<rect width="{W}" height="{HH}" fill="url(#{p}sky)"/>
<circle cx="540" cy="{hz}" r="300" fill="url(#{p}sun)"/><circle cx="540" cy="{hz}" r="120" fill="#fff1c8" opacity=".95"/>
{''.join(f'<ellipse cx="{x}" cy="{y}" rx="{rx}" ry="{ry}" fill="#ff9ab0" opacity=".45" filter="url(#{p}soft)"/>' for x, y, rx, ry in [(200, 420, 240, 30), (820, 380, 260, 26), (600, 520, 200, 18)])}
<rect y="{hz}" width="{W}" height="{HH-hz}" fill="url(#{p}sea)"/>{refl}{waves}
<!-- the chasing fleet, far right -->
<g opacity=".85">{ship(870, hz+8, .32, '#cfc3d8', '#3b2f45')}{ship(780, hz+14, .38, '#cfc3d8', '#3b2f45')}{ship(960, hz+4, .26, '#cfc3d8', '#3b2f45')}</g>{smoke}
<!-- the real ship slipping away, far left -->
<g opacity=".7">{ship(140, hz+4, .18, '#f1dcc0', '#2b1a24')}</g>
<!-- the decoy ship with a smiling theatre mask on its sail -->
<g filter="url(#{p}shadow)">{ship(470, hz+170, 1.15, '#f6e8d2', '#3a2214', True)}</g>
<path d="M210 {hz+250} q140 30 520 0" stroke="#ffd9b0" stroke-width="6" fill="none" opacity=".6"/>
{gulls}{sparkle(300, 520, .4, '#fff1c8')}'''
    rays = godrays(p, 540, hz, 14, 900, '#ffe3a8', (math.pi * 1.05, math.pi * 1.95), .2, seed=13, width=.04)
    wake = f'<path d="M170 {hz+250} Q60 {hz+260} 0 {hz+300}" stroke="#ffe2c4" stroke-width="10" fill="none" opacity=".5"/><path d="M200 {hz+262} Q90 {hz+290} 20 {hz+350}" stroke="#ffe2c4" stroke-width="6" fill="none" opacity=".35"/>'
    splash = f'<g transform="translate(700 {hz+190})"><path d="M-30 0 Q-20 -90 0 -120 Q20 -90 30 0Z" fill="#ffe9d8" opacity=".85"/><path d="M-60 0 Q-50 -50 -30 -60" stroke="#ffe9d8" stroke-width="6" fill="none"/><path d="M60 0 Q50 -50 30 -60" stroke="#ffe9d8" stroke-width="6" fill="none"/><ellipse rx="70" ry="12" fill="#ffe9d8" opacity=".6"/></g>'
    flashes = ''.join(f'<circle cx="{x}" cy="{y}" r="14" fill="#ffd27a" opacity=".9" filter="url(#{p}blur3)"/>' for x, y in [(845, hz - 2), (752, hz + 4)])
    glints = ''.join(f'<path d="M{x:.0f} {y:.0f} l6 -2 l-6 -2 l-2 -6 l-2 6 l-6 2 l6 2 l2 6Z" fill="#fff6d8" opacity=".9"/>' for x, y in [(R.uniform(380, 700), R.uniform(hz + 20, hz + 260)) for _ in range(16)])
    rim = ''.join(f'<ellipse cx="{x}" cy="{y+12}" rx="{rx}" ry="5" fill="#ffd9a0" opacity=".6"/>' for x, y, rx in [(200, 420, 200), (820, 380, 220), (600, 520, 160)])
    return svg(p, '#140d24', defs, body.replace('<rect y="{hz}"'.replace('{hz}', str(hz)), rays + rim + '<rect y="' + str(hz) + '"', 1), wake + splash + flashes + glints)

# ------------------------------------------------------------ 4: moonlit lake, two swans and satin ballet shoes
def swan(x, y, s, flip=1):
    return f'''<g transform="translate({x} {y}) scale({s*flip} {s})">
<path d="M-120 20 C-130 -40 -40 -70 40 -40 C90 -20 120 0 150 -30 C130 30 60 60 -40 60 C-90 60 -115 45 -120 20Z" fill="url(#s4swan)"/>
<path d="M-60 -10 C-20 -50 60 -60 110 -20" stroke="#cfd8ea" stroke-width="6" fill="none" opacity=".8"/>
<path d="M-100 0 C-110 -60 -100 -150 -60 -190 C-35 -215 -5 -200 -12 -175 C-20 -150 -60 -140 -70 -80 C-74 -50 -70 -20 -60 10" fill="url(#s4swan)"/>
<path d="M-14 -182 L28 -172 L-10 -160Z" fill="#ff8c2e"/><path d="M-14 -182 L-2 -177 L-10 -160Z" fill="#1a1a1a"/><circle cx="-32" cy="-185" r="5" fill="#1a1a1a"/>
</g>'''

def scene4():
    p = 's4'
    trees = ''.join(f'<path d="M{x} 700 L{x+30} {700-h} L{x+60} 700Z" fill="#0b1a2a"/>' for x, h in [(R.uniform(-40, 1060), R.uniform(80, 200)) for _ in range(40)])
    lily = ''.join(f'<g transform="translate({x} {y})"><ellipse rx="44" ry="13" fill="#1e5a4e"/><path d="M0 -4 l-12 -18 l12 6 l12 -6Z" fill="#ffb6d2"/></g>' for x, y in [(160, 960), (900, 900), (780, 1010)])
    petals = ''.join(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="9" ry="5" fill="#ffc2dc" opacity=".85" transform="rotate({R.uniform(0,180):.0f} {x:.0f} {y:.0f})"/>' for x, y in [(R.uniform(60, 1020), R.uniform(150, 1100)) for _ in range(26)])
    defs = f'''
<linearGradient id="{p}sky" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#050a22"/><stop offset=".55" stop-color="#14305a"/><stop offset="1" stop-color="#2a5a7a"/></linearGradient>
<linearGradient id="{p}lake" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#1d4766"/><stop offset="1" stop-color="#06101f"/></linearGradient>
<radialGradient id="{p}moon" cx=".4" cy=".4" r=".6"><stop offset="0" stop-color="#ffffff"/><stop offset=".8" stop-color="#e6eefc"/><stop offset="1" stop-color="#b9c8e6"/></radialGradient>
<linearGradient id="{p}swan" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".7" stop-color="#e3e9f5"/><stop offset="1" stop-color="#9fb0cc"/></linearGradient>
<linearGradient id="{p}satin" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#ffe0ec"/><stop offset=".4" stop-color="#ffb3cf"/><stop offset="1" stop-color="#d9709a"/></linearGradient>'''
    body = f'''<rect width="{W}" height="{HH}" fill="url(#{p}sky)"/>{stars(150, 0, 600, seed=4)}
<circle cx="760" cy="260" r="190" fill="#cfe0ff" opacity=".35" filter="url(#{p}glow)"/><circle cx="760" cy="260" r="110" fill="url(#{p}moon)"/>
<circle cx="725" cy="235" r="18" fill="#c8d4ee" opacity=".6"/><circle cx="790" cy="290" r="12" fill="#c8d4ee" opacity=".6"/>
{trees}
<rect y="700" width="{W}" height="{HH-700}" fill="url(#{p}lake)"/>
{''.join(f'<rect x="{760-w/2:.0f}" y="{y}" width="{w:.0f}" height="5" rx="2" fill="#dfe9ff" opacity="{.6-(y-700)/900:.2f}"/>' for y, w in [(712 + k * 22, R.uniform(60, 220)) for k in range(14)])}
<!-- swans facing each other (their necks make a heart) -->
<g filter="url(#{p}shadow)">{swan(400, 850, 1.05, -1)}{swan(680, 850, 1.05, 1)}</g>
<ellipse cx="540" cy="915" rx="330" ry="22" fill="#9fc0ff" opacity=".18"/>
{lily}
{petals}{sparkle(280, 600, .45)}{sparkle(880, 520, .35)}'''
    refl = f'<g opacity=".28" filter="url(#{p}blur3)" transform="translate(0 1720) scale(1 -1)">{swan(400, 850, 1.05, -1)}{swan(680, 850, 1.05, 1)}</g>'
    ripples = ''.join(f'<ellipse cx="{cx}" cy="905" rx="{r}" ry="{r*.12:.0f}" fill="none" stroke="#cfe0ff" stroke-width="2.5" opacity="{.5-k*.1:.2f}"/>' for cx in (400, 680) for k, r in enumerate([150, 200, 250]))
    flies = ''.join(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.1f}" fill="#fff6a8"/><circle cx="{x:.0f}" cy="{y:.0f}" r="{r*5:.0f}" fill="#fff6a8" opacity=".25" filter="url(#{p}blur3)"/>' for x, y, r in [(R.uniform(80, 1000), R.uniform(560, 1000), R.uniform(2, 3.5)) for _ in range(22)])
    mist = f'<ellipse cx="540" cy="720" rx="700" ry="70" fill="#9fc0e8" opacity=".28" filter="url(#{p}glow)"/>'
    body = body.replace('<!-- swans facing each other', refl + ripples + '<!-- swans facing each other', 1)
    return svg(p, '#071224', defs, body, mist + flies + bokeh(p, 14, ['#cfe0ff', '#ffc2dc'], 0, 1080, 100, 700, seed=9, op=(.08, .2)))

# ------------------------------------------------------------ 5: a right hand pressed to a magic mirror, copying a face
def scene5():
    p = 's5'
    rings = ''.join(f'<ellipse cx="540" cy="600" rx="{r}" ry="{r*1.25:.0f}" fill="none" stroke="#c8a8ff" stroke-width="{6-k}" opacity="{.7-k*.12:.2f}"/>' for k, r in enumerate([70, 120, 170, 220, 260]))
    swirls = ''.join(f'<path d="M{540+math.cos(a)*40:.0f} {600+math.sin(a)*50:.0f} Q{540+math.cos(a+.8)*200:.0f} {600+math.sin(a+.8)*260:.0f} {540+math.cos(a+1.6)*300:.0f} {600+math.sin(a+1.6)*380:.0f}" stroke="#a88cff" stroke-width="4" fill="none" opacity=".35"/>' for a in [k * math.pi / 4 for k in range(8)])
    defs = f'''
<radialGradient id="{p}bg" cx=".5" cy=".45" r=".8"><stop offset="0" stop-color="#3a1f5e"/><stop offset=".6" stop-color="#1c0f33"/><stop offset="1" stop-color="#0a0614"/></radialGradient>
<radialGradient id="{p}glass" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#e8ddff"/><stop offset=".45" stop-color="#8c6ad9"/><stop offset="1" stop-color="#2a1550"/></radialGradient>
<linearGradient id="{p}gold" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".35" stop-color="#e0a92c"/><stop offset=".7" stop-color="#8a5a0c"/><stop offset="1" stop-color="#f3c955"/></linearGradient>
<linearGradient id="{p}curtain" x1="0" x2="1"><stop offset="0" stop-color="#5a0f2a"/><stop offset=".5" stop-color="#a3214e"/><stop offset="1" stop-color="#4a0b22"/></linearGradient>
<linearGradient id="{p}hand" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#ffe0c4"/><stop offset="1" stop-color="#d9a07a"/></linearGradient>
<clipPath id="{p}oval"><ellipse cx="540" cy="600" rx="290" ry="380"/></clipPath>'''
    hand = '''<path d="M0 0 C-10 -60 -6 -120 4 -170 C10 -196 40 -194 42 -168 L46 -90 L58 -210 C62 -238 96 -236 96 -208 L92 -86 L114 -200 C120 -226 152 -222 150 -194 L134 -78 L164 -160 C172 -184 202 -176 196 -150 L160 -20 C150 40 120 90 60 110 C20 124 -30 110 -60 80 L-130 0 C-150 -20 -126 -50 -100 -34 L-40 4Z" fill="url(#s5hand)" stroke="#7a4a2a" stroke-width="5" stroke-linejoin="round"/>'''
    body = f'''<rect width="{W}" height="{HH}" fill="url(#{p}bg)"/>
<!-- velvet curtains -->
<path d="M0 0 L250 0 C220 300 260 700 180 1260 L0 1260Z" fill="url(#{p}curtain)"/><path d="M1080 0 L830 0 C860 300 820 700 900 1260 L1080 1260Z" fill="url(#{p}curtain)"/>
{''.join(f'<path d="M{x} 0 C{x-20} 400 {x+10} 800 {x-30} 1260" stroke="#000" stroke-opacity=".25" stroke-width="10" fill="none"/>' for x in (70, 160, 920, 1010))}
<ellipse cx="540" cy="600" rx="380" ry="470" fill="#8c6ad9" opacity=".4" filter="url(#{p}glow)"/>
<!-- the ornate mirror -->
<g filter="url(#{p}shadow)">
 <ellipse cx="540" cy="600" rx="330" ry="420" fill="url(#{p}gold)"/>
 {''.join(f'<circle cx="{540+math.cos(a)*318:.0f}" cy="{600+math.sin(a)*408:.0f}" r="16" fill="url(#{p}gold)" stroke="#6b4508" stroke-width="3"/>' for a in [k*math.pi/10 for k in range(20)])}
 <ellipse cx="540" cy="600" rx="300" ry="390" fill="#6b4508"/>
 <path d="M540 150 l40 -60 l-40 -40 l-40 40Z" fill="url(#{p}gold)" stroke="#6b4508" stroke-width="4"/>
 <path d="M540 1050 l50 50 l-50 40 l-50 -40Z" fill="url(#{p}gold)" stroke="#6b4508" stroke-width="4"/>
</g>
<g clip-path="url(#{p}oval)"><rect x="200" y="180" width="700" height="860" fill="url(#{p}glass)"/>{swirls}{rings}
 <!-- the copied "?" face forming inside the glass -->
 <g opacity=".85"><ellipse cx="540" cy="470" rx="110" ry="135" fill="#2a1550" opacity=".55"/><text x="540" y="520" text-anchor="middle" font-family="Inter" font-weight="900" font-size="170" fill="#f1eaff">?</text></g>
 <path d="M300 260 L420 200 L330 420Z" fill="#fff" opacity=".25"/><path d="M700 820 L780 760 L760 900Z" fill="#fff" opacity=".15"/></g>
<!-- the right hand pressed to the glass, glowing where it touches -->
<g transform="translate(560 860) rotate(-10) scale(1.25)"><g filter="url(#{p}soft)" opacity=".8"><g transform="scale(1.06)">{hand.replace('url(#s5hand)', '#c8a8ff').replace('#7a4a2a', '#c8a8ff')}</g></g>{hand}</g>
<g transform="translate(420 1120) rotate(-8)"><rect x="-60" y="-40" width="120" height="80" rx="16" fill="#ffd34d" stroke="#111" stroke-width="5"/><text x="0" y="16" text-anchor="middle" font-family="Inter" font-weight="900" font-size="48" fill="#111">R</text></g>
{sparkle(330, 280, .6, '#f1eaff')}{sparkle(770, 360, .45, '#ffd34d')}{sparkle(800, 960, .5)}{sparkle(250, 760, .35)}'''
    def candle(x, y):
        return (f'<rect x="{x-18}" y="{y}" width="36" height="150" rx="6" fill="#f3e6cf"/><rect x="{x-18}" y="{y}" width="12" height="150" fill="#fff" opacity=".5"/>'
                f'<ellipse cx="{x}" cy="{y-30}" rx="70" ry="90" fill="#ffb84a" opacity=".35" filter="url(#{p}glow)"/>'
                f'<path d="M{x} {y-60} C{x+18} {y-30} {x+12} {y-4} {x} {y-2} C{x-12} {y-4} {x-18} {y-30} {x} {y-60}Z" fill="#ffcf5a"/><path d="M{x} {y-40} C{x+8} {y-22} {x+5} {y-8} {x} {y-6} C{x-5} {y-8} {x-8} {y-22} {x} {y-40}Z" fill="#fff6d8"/>'
                f'<rect x="{x-40}" y="{y+150}" width="80" height="16" rx="6" fill="url(#{p}gold)"/>')
    fil = ''.join(f'<path d="M{540+sx*240} {600+sy*360} q{sx*60} {sy*-10} {sx*70} {sy*-70} q{sx*-30} 10 {sx*-40} 40" stroke="url(#{p}gold)" stroke-width="8" fill="none"/>' for sx in (-1, 1) for sy in (-1, 1))
    parts = ''.join(f'<circle cx="{540+math.cos(a)*d:.0f}" cy="{720+math.sin(a)*d*1.2:.0f}" r="{R.uniform(1.5,4):.1f}" fill="#e6d8ff" opacity="{R.uniform(.4,1):.2f}"/>' for a, d in [(R.uniform(0, 6.28), R.uniform(60, 330)) for _ in range(90)])
    streak = f'<path d="M330 300 L460 230 L360 520Z" fill="#fff" opacity=".16"/><path d="M640 860 L760 780 L720 960Z" fill="#fff" opacity=".1"/>'
    body = body.replace('<!-- the right hand pressed', fil + '<!-- the right hand pressed', 1)
    return svg(p, '#0e0820', defs, body + candle(130, 700) + candle(950, 700), parts + streak + bokeh(p, 16, ['#c8a8ff', '#ffd34d'], 200, 880, 150, 1050, seed=12, op=(.1, .25)))

CLUES = [
    ('#120e17', scene1, "After the timeskip, I became <em>queen of a secret paradise</em> hidden deep inside a prison. 👑", '🧠', 'GENIUS', 'next clue'),
    ('#0a1022', scene2, "I stayed behind in disguise to <em>open the Gates of Justice</em> for my friends. ⛓️", '🔥', 'TRUE FAN', 'next clue'),
    ('#140d24', scene3, "My crew dressed up as <em>the pirates we'd just fought</em> to lure a Marine fleet away. 🎭", '😎', 'SOLID', 'next clue'),
    ('#071224', scene4, "I fight with <em>ballet-style kicks</em>, and two swans sit on the back of my coat. 🦢", '👍', 'NOT BAD', 'last clue'),
    ('#0e0820', scene5, "One touch of my <em>right hand</em> and I can copy anyone's face. 🪞", '😅', '...it’s ok', 'answer time'),
]
out = []
for k, (bg, fn, clue, emo, rank, swipe) in enumerate(CLUES, 1):
    out.append(f'''<section class="slide" style="background:{bg}">
  {fn()}
  <div class="head"><div class="tag">GUESS THAT CHARACTER</div><div class="clueN">CLUE {k}/5</div></div>
  <div class="card"><div class="paper"><div class="ribbon">CLUE #{k}</div>
    <div class="clue">{clue}</div></div>
    <div class="rank">get it here = {emo} {rank}</div></div>
  <div class="swipe">{swipe} <b>→</b></div>
</section>''')
open(sys.argv[1], 'w').write('\n'.join(out))
print('ok')
