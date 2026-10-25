"""Export the supplied ten-second hero into lightweight scroll sequences.

Run with Python 3 and FFmpeg on PATH, or pass --ffmpeg /path/to/ffmpeg.
Only hero delivery assets are written; the original video/poster are preserved.
"""

import argparse
import shutil
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/media/video/hero/hero-scrub.mp4"
SCENES = ROOT / "public/media/images/scenes/hero"
SEQUENCES = ROOT / "public/media/sequences/hero"
VARIANTS = (
    {"name": "desktop", "fps": 15, "count": 150, "filter": "scale=1152:648", "quality": 62, "poster": "first-frame.webp"},
    {"name": "mobile", "fps": 12, "count": 120, "filter": "crop=405:720:437:0,scale=450:800", "quality": 65, "poster": "first-frame-m.webp"},
)

def export(ffmpeg: str) -> None:
    for variant in VARIANTS:
        output = SEQUENCES / variant["name"]
        output.mkdir(parents=True, exist_ok=True)
        encoding = ["-an", "-c:v", "libwebp", "-quality", str(variant["quality"]), "-compression_level", "6"]
        command = [ffmpeg, "-hide_banner", "-loglevel", "error", "-y", "-i", str(SOURCE)]
        subprocess.run(command + ["-vf", f"fps={variant['fps']},{variant['filter']}", "-frames:v", str(variant["count"])] + encoding + [str(output / "f_%04d.webp")], check=True)
        # The fps filter can select the next source sample. Force frame zero and
        # copy it so the poster/canvas handoff is visually identical.
        subprocess.run(command + ["-vf", variant["filter"], "-frames:v", "1"] + encoding + ["-update", "1", str(output / "f_0001.webp")], check=True)
        shutil.copyfile(output / "f_0001.webp", SCENES / variant["poster"])
        frames = sorted(output.glob("f_[0-9][0-9][0-9][0-9].webp"))
        if len(frames) != variant["count"]:
            raise RuntimeError(f"Expected {variant['count']} {variant['name']} frames, found {len(frames)}")
        size = sum(frame.stat().st_size for frame in frames)
        print(f"{variant['name']}: {len(frames)} frames, {size:,} bytes, {variant['fps']} fps", flush=True)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", default=shutil.which("ffmpeg") or "ffmpeg")
    export(parser.parse_args().ffmpeg)
