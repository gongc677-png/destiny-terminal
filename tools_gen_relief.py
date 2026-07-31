from PIL import Image, ImageFilter

SIZE = 360

# 平滑噪声：小图高斯噪声放大，形成石纹/皮质肌理
noise = Image.effect_noise((90, 90), 115).convert("L")
noise = noise.resize((SIZE, SIZE), Image.BILINEAR)

# 浮雕：EMBOSS 提取明暗交界
emb = noise.filter(ImageFilter.EMBOSS)

out = Image.new("RGB", (SIZE, SIZE))
op = out.load()
ep = emb.load()

dark_hi = (10, 8, 6)
light_hi = (170, 132, 78)
dark_lo = (2, 2, 2)

for y in range(SIZE):
    for x in range(SIZE):
        v = ep[x, y]
        d = (v - 128) / 128  # -1..1
        if d < 0:
            k = -d
            r = int(dark_lo[0] + (dark_hi[0] - dark_lo[0]) * k)
            g = int(dark_lo[1] + (dark_hi[1] - dark_lo[1]) * k)
            b = int(dark_lo[2] + (dark_hi[2] - dark_lo[2]) * k)
        else:
            k = d
            r = int(dark_hi[0] + (light_hi[0] - dark_hi[0]) * k)
            g = int(dark_hi[1] + (light_hi[1] - dark_hi[1]) * k)
            b = int(dark_hi[2] + (light_hi[2] - dark_hi[2]) * k)
        op[x, y] = (max(0, min(255, r)), max(0, min(255, g)), max(0, min(255, b)))

out.save("src/assets/relief.png")

# 统计
import collections
cnt = collections.Counter()
rs = []
for y in range(0, SIZE, 2):
    for x in range(0, SIZE, 2):
        c = op[x, y]
        cnt[c] += 1
        rs.append(c[0])
print("mean_r=%.1f min=%d max=%d distinct=%d" % (sum(rs) / len(rs), min(rs), max(rs), len(cnt)))
print("top:", cnt.most_common(4))
