import io

import easyocr
import numpy as np
from PIL import Image

_reader: easyocr.Reader | None = None


def get_reader() -> easyocr.Reader:
    """Lazy-loaded singleton: EasyOCR downloads/loads model weights on first
    use, which is slow — doing it once per process instead of per-request
    keeps request latency reasonable after the first call."""
    global _reader
    if _reader is None:
        _reader = easyocr.Reader(["es"], gpu=False)
    return _reader


def read_text(image_bytes: bytes) -> str:
    """Runs OCR on the full image and returns the concatenated detected text.
    MVP: no YOLO pre-crop — relies on staff framing the letrero closely
    (see vision-service/README.md photo protocol)."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    reader = get_reader()
    detections = reader.readtext(np.array(image), detail=0)
    return " ".join(detections)
