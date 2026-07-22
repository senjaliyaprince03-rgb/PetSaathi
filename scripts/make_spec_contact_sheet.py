from __future__ import annotations

import re
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path("analysis/specs")
OUTPUT = Path("analysis/spec-contact-sheet.png")
CELL_WIDTH = 320
CELL_HEIGHT = 430
THUMB_WIDTH = 280
THUMB_HEIGHT = 350


def page_number(path: Path) -> int:
    match = re.search(r"page-(\d+)\.png$", path.name)
    return int(match.group(1)) if match else 0


def pick_pages(folder: Path) -> list[Path]:
    pages = sorted((folder / "pages").glob("page-*.png"), key=page_number)
    if not pages:
        return []
    picks = [pages[0], pages[len(pages) // 2], pages[-1]]
    return list(dict.fromkeys(picks))


def main() -> None:
    selected: list[tuple[str, Path]] = []
    for folder in sorted(path for path in ROOT.iterdir() if path.is_dir()):
        for page in pick_pages(folder):
            selected.append((folder.name.replace("PetSaathi_", ""), page))

    columns = 4
    rows = (len(selected) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * CELL_WIDTH, rows * CELL_HEIGHT), "#f6efe5")
    draw = ImageDraw.Draw(sheet)
    font = ImageFont.load_default(size=16)

    for index, (document, page_path) in enumerate(selected):
        row, column = divmod(index, columns)
        x = column * CELL_WIDTH
        y = row * CELL_HEIGHT
        with Image.open(page_path) as page:
            thumbnail = ImageOps.contain(page.convert("RGB"), (THUMB_WIDTH, THUMB_HEIGHT))
        tx = x + (CELL_WIDTH - thumbnail.width) // 2
        ty = y + 12
        sheet.paste(thumbnail, (tx, ty))
        label = f"{document}\nPage {page_number(page_path)}"
        draw.multiline_text((x + 18, y + THUMB_HEIGHT + 28), label, fill="#2d241f", font=font, spacing=4)

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    sheet.save(OUTPUT, format="PNG", optimize=True)
    print(OUTPUT.resolve())


if __name__ == "__main__":
    main()
