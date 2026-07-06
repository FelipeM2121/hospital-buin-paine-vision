# Vision Service — Reconocimiento de Recintos

Servicio Python (FastAPI) que recibe una foto del letrero de una sala del hospital y devuelve el `recinto` (código de sala, ej. `C.5.3.5.1`) más probable, matcheado contra `recintos.json`.

## Enfoque (MVP)

OCR de la foto completa (EasyOCR) → normalizar texto → fuzzy match contra los recintos conocidos (RapidFuzz). Sin detector YOLO todavía: se agrega solo si el OCR se confunde con otros carteles en la foto (ver `app/detector.py`).

## Protocolo de foto (importante para la precisión)

- Acercarse y encuadrar el letrero de la sala, evitando que aparezcan otros carteles (evacuación, extintores) en el cuadro.
- Buena iluminación, evitar reflejos/contraluz.
- No incluir personas, pantallas con datos de pacientes, ni información sensible en el fondo.

## Correr localmente

```bash
cd vision-service
python -m venv .venv
.venv\Scripts\activate       # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Probar el endpoint:

```bash
curl -X POST http://localhost:8000/recognize-recinto -F "file=@foto-letrero.jpg"
```

## Regenerar `recintos.json`

La lista canónica de recintos se genera desde `src/data/raw.ts` (mismo dataset que usa el dashboard):

```bash
node ../scripts/generate-recintos.mjs
```

## Docker

```bash
docker build -t vision-service .
docker run -p 8000:8000 vision-service
docker stats   # verificar consumo de memoria antes de elegir plan de hosting
```
