#!/usr/bin/env node

/**
 * Genera vision-service/recintos.json: lista única de recintos (código de sala)
 * con su zona/servicio/piso, a partir de src/data/raw.ts (mismo dataset que usa el dashboard).
 * Este JSON es la referencia contra la que el servicio de OCR hace fuzzy-match.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rawPath = path.join(__dirname, '../src/data/raw.ts');
const outPath = path.join(__dirname, '../vision-service/recintos.json');

const content = fs.readFileSync(rawPath, 'utf8');
const marker = 'RAW: RawItem[] = ';
const startOfArray = content.indexOf('[', content.indexOf(marker) + marker.length);
const arrayLiteral = content.slice(startOfArray, content.lastIndexOf(']') + 1);
const raw = JSON.parse(arrayLiteral);

const byRecinto = new Map();
for (const it of raw) {
  if (!it.recinto) continue;
  if (!byRecinto.has(it.recinto)) {
    byRecinto.set(it.recinto, {
      recinto: it.recinto,
      zona: it.zona,
      servicio: it.servicio,
      piso: it.piso,
    });
  }
}

const recintos = Array.from(byRecinto.values()).sort((a, b) =>
  a.recinto.localeCompare(b.recinto)
);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(recintos, null, 2));

console.log(`recintos.json generado con ${recintos.length} recintos únicos -> ${outPath}`);
