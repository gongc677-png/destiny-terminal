# 甲骨文字形子集

字形来源：**方正甲骨文**（方正字库官方免费商用字体，2021 年发布，字符集：大陆繁体 GB12345-90，共 1400 字）。
授权说明：方正官网标注「免费字 · 仅商业发布范围使用，可下载直接使用无需获得书面授权」。

本站通过 npm 包 `cn-fontsource-fz-jia-gu-wen-regular`（jsDelivr CDN）取得 woff2 子集，
再用 fontTools 仅保留本站用到的字形重新子集化，存放在 `sub/` 目录，规则内联于 `src/index.css`。

如需补充字形，可运行：
```
pip install fonttools brotli
python - <<'PY'
from fontTools.ttLib import TTFont
from fontTools import subset
# ... 用 fontTools 对源字体子集化到所需字符
PY
```

源字体获取：https://www.foundertype.com/index.php/FontInfo/index/id/5528
