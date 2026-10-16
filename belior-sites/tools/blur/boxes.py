# Background-guest boxes (x0, y0, x1, y1) at 1920x1080, by time segment.
SEG_A = [(930, 520, 1270, 1010), (1480, 420, 1655, 1040), (215, 550, 375, 700)]   # opening close framing, t < 1.7s
SEG_B = [(995, 515, 1440, 765), (1440, 515, 1690, 692), (995, 765, 1440, 945), (215, 545, 388, 705), (900, 535, 1000, 655), (1862, 540, 1920, 730)]
def boxes(t):
    return SEG_A if t < 1.7 else SEG_B
