"""Blur background guests in a 1920x1080 clip while keeping baked-in white titles sharp.
usage: python3 -I blur.py FFMPEG IN OUT"""
import sys, subprocess, numpy as np, cv2
sys.path.insert(0, __file__.rsplit('/', 1)[0])
from boxes import boxes
ff, src, dst = sys.argv[1:4]
W, H, FPS = 1920, 1080, 30
dec = subprocess.Popen([ff, '-v', 'error', '-i', src, '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-'], stdout=subprocess.PIPE)
enc = subprocess.Popen([ff, '-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-s', f'{W}x{H}', '-r', str(FPS), '-i', '-',
                        '-i', src, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-crf', '20', '-pix_fmt', 'yuv420p',
                        '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', dst], stdin=subprocess.PIPE)
n = 0
while True:
    buf = dec.stdout.read(W * H * 3)
    if len(buf) < W * H * 3: break
    f = np.frombuffer(buf, np.uint8).reshape(H, W, 3).copy()
    mask = np.zeros((H, W), np.float32)
    for x0, y0, x1, y1 in boxes(n / FPS): mask[y0:y1, x0:x1] = 1
    mask = cv2.GaussianBlur(mask, (0, 0), 14)                      # soft edges
    text = (f.min(axis=2) > 205).astype(np.uint8)                   # baked-in white titles
    text = cv2.GaussianBlur(cv2.dilate(text, np.ones((3, 3), np.uint8)).astype(np.float32), (0, 0), 1.2)
    mask = np.clip(mask - text * 1.5, 0, 1)[..., None]
    blur = cv2.GaussianBlur(f, (0, 0), 22)
    out = (f * (1 - mask) + blur * mask).astype(np.uint8)
    enc.stdin.write(out.tobytes()); n += 1
enc.stdin.close(); enc.wait(); dec.wait(); print('frames', n)
