# v2 TikTok carousel (owner-approved 2026-11-24): 6 painted clue slides + the new final slide.
# usage: python3 templates/v2/build6.py work/clues_<name>.html work/<name>.html
#   then: python3 templates/shoot.py work/<name>.html work/<name>   -> slide_1..slide_7.png (6 clues + final)
#   publish them as slides/<date>-<name>/slide_2.jpg .. slide_8.jpg (slide 1 = slides/cover.jpg)
import sys, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
TPL = os.path.dirname(HERE)
base = open(os.path.join(TPL, 'base.html')).read()
css = base[base.index('<style>'):base.index('</style>') + 8]
fin = open(os.path.join(HERE, 'final.html')).read()
fcss = fin[fin.index('<style>') + 7:fin.index('</style>')]
fsec = fin[fin.index('<section class="slide fin">'):fin.index('</section>') + 10]
fsec = fsec.replace('src="../cover.jpg"', 'src="file://' + os.path.join(TPL, 'cover.jpg') + '"')
clues = open(sys.argv[1]).read()
n = clues.count('<section class="slide"')
assert n == 6, f'expected 6 clue slides, found {n}'
html = f'<!DOCTYPE html><html><head><meta charset="utf-8">{css}<style>{fcss}</style></head><body>{clues}\n{fsec}</body></html>'
open(sys.argv[2], 'w').write(html)
print('built', sys.argv[2])
