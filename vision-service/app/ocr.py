import io

import pytesseract
from PIL import Image


def read_text(image_bytes: bytes) -> str:
    """Runs OCR on the full image and returns the detected text.
    MVP: no YOLO pre-crop — relies on staff framing the letrero closely
    (see vision-service/README.md photo protocol).

    Usa Tesseract (vía pytesseract) en vez de EasyOCR: EasyOCR carga PyTorch
    (~600MB) y no cabe en el plan gratis de Render (512MB RAM, se caía al
    cargar el modelo). Tesseract no depende de PyTorch y corre cómodo ahí."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    return pytesseract.image_to_string(image, lang="spa").strip()
