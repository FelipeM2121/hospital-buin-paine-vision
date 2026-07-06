import json
import re
from functools import lru_cache
from pathlib import Path

RECINTOS_PATH = Path(__file__).resolve().parent.parent / "recintos.json"

with open(RECINTOS_PATH, "r", encoding="utf-8") as f:
    RECINTOS = json.load(f)

_BY_CODE = {r["recinto"]: r for r in RECINTOS}
_CODES = list(_BY_CODE.keys())


def normalize_code(text: str) -> str:
    """Normaliza un código de recinto tolerando errores típicos de OCR:
    espacios en vez de puntos, guiones largos, y O/0 confundidos junto a dígitos.
    Misma lógica que matchRecintoCode en src/components/Chat/ChatService.ts,
    ya validada ahí contra fotos reales."""
    text = text.strip().upper()
    text = re.sub(r"\s+", "", text)
    text = re.sub(r"[–—−]", "-", text)
    text = re.sub(r"O(?=\d)", "0", text)
    text = re.sub(r"(?<=\d)O", "0", text)
    return text


@lru_cache(maxsize=1)
def _normalized_codes() -> dict[str, str]:
    return {normalize_code(code): code for code in _CODES}


def _levenshtein(a: str, b: str) -> int:
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            cost = 0 if a[i - 1] == b[j - 1] else 1
            dp[i][j] = min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    return dp[m][n]


def _candidate_tokens(ocr_text: str) -> list[str]:
    """EasyOCR devuelve un fragmento de texto por cada región detectada
    (nombre de sala, código, otros carteles...); el código de recinto suele
    venir como uno de esos fragmentos, no como todo el texto de la foto.
    Probamos cada palabra suelta y el texto completo como candidatos."""
    words = [w for w in re.split(r"\s+", ocr_text.strip()) if w]
    whole = ocr_text.strip()
    return list(dict.fromkeys(words + ([whole] if whole else [])))


def match_recinto(ocr_text: str, top_n: int = 3):
    """Busca códigos de recinto conocidos (ej. 'C.5.3.5.1') dentro del texto
    leído por OCR, tolerando errores de reconocimiento vía distancia de
    Levenshtein acotada por longitud. Devuelve (recinto_dict, score) ordenado
    por mejor coincidencia, score en [0, 1]."""
    candidates = _candidate_tokens(ocr_text)
    if not candidates or not _CODES:
        return []

    by_normalized = _normalized_codes()
    best_by_code: dict[str, float] = {}

    for token in candidates:
        normalized_input = normalize_code(token)
        if not normalized_input:
            continue
        for norm_code, original_code in by_normalized.items():
            dist = _levenshtein(normalized_input, norm_code)
            max_len = max(len(normalized_input), len(norm_code), 1)
            score = max(0.0, 1 - dist / max_len)
            if score > best_by_code.get(original_code, -1.0):
                best_by_code[original_code] = score

    scored = sorted(best_by_code.items(), key=lambda x: x[1], reverse=True)
    return [(_BY_CODE[code], score) for code, score in scored[:top_n]]
