# 🎯 MM Confluence Strategy v2

**Trade Hub Personal Trading System**
Built from: Perfil del Trader, Candlestick Patterns, Análisis Técnico, Estrategia Para No Perder, Market Maker Method.

> **v1 implementation scope**
> - **Crypto only.** Forex symbols in the watchlist are skipped with `forex-no-ohlc` — there is no OHLC data source wired up yet (ExchangeRate API is spot-only). Add an OHLC provider (e.g. Alpha Vantage) to unlock forex.
> - **Timeframes: 30min / 4H / 1D** — CoinGecko's free `/ohlc` endpoint locks granularity to the `days` param (1d→30min, 2-30d→4H, 31d+→daily). Native 1H is not available without a paid tier or resampling.
> - **Higher-TF alignment** uses EMA 200 when ≥200 candles are available, otherwise falls back to EMA 50.

## Filosofía

Entramos donde el retail se equivoca. No cazamos movimientos — esperamos que el Market Maker termine su stop hunt, y nos montamos en la dirección real con confirmación de vela, momentum y confluencia técnica.

**No se sobre-opera. No hay trades C. No hay entradas sin plan escrito.**

## Los 4 Pilares de Entrada

Los 4 deben cumplirse. Si falta uno → no hay trade.

### Pilar 1 — Contexto Macro (Multi-Timeframe)
- En el timeframe superior, el precio debe estar a favor de la EMA 200
- Tu TF de entrada debe ser ~4x menor que tu TF de contexto

| TF entrada | TF contexto |
|------------|-------------|
| 15m | 1H |
| 1H | 4H |
| 4H | Daily |
| Daily | Weekly |

### Pilar 2 — Setup (MM + EMA Confluence)
Uno de estos tres:
1. **Formación W** con stop hunt (long)
2. **Formación M** con stop hunt (short)
3. **Rebote limpio en EMA 50** que coincide con S/R histórico

### Pilar 3 — Momentum (RSI)
- Long: RSI < 35
- Short: RSI > 65
- Bonus: divergencia RSI = +1 al score

### Pilar 4 — Gatillo (Vela + Volumen)
Patrón de reversión del pattern engine. Crypto: volumen > 1.5x promedio de últimas 20. Forex: solo la vela.

## Setup Quality Scoring

| # | Condición | Puntos |
|---|-----------|--------|
| 1 | Alineación MTF | 1 |
| 2 | M/W con stop hunt | 1 |
| 3 | Confluencia EMA 50 | 1 |
| 4 | Confluencia S/R | 1 |
| 5 | RSI extremo | 1 |
| 6 | Divergencia RSI | 1 |
| 7 | Vela + volumen (crypto) | 1 |

| Score | Grade | Riesgo |
|-------|-------|--------|
| 6-7 | A | 1% |
| 4-5 | B | 0.5% |
| 0-3 | C | SKIP |

## Session Filter

**Forex (EST):**
- Pre-Londres 1:00-2:30 AM → buscar setup
- Londres open 2:30-4:00 AM → alta probabilidad
- NY open 8:00-10:00 AM → segunda ventana
- Resto → no operar

**Crypto (EST):**
- 8 AM-12 PM (overlap EU/US) → ideal
- 8 PM-12 AM (Asia) → moves grandes
- Weekends → skip setups marginales

## Invalidación

El setup queda muerto si:
1. Stop hunt wick > 2% del rango de 20 velas (ruptura real)
2. Vela de confirmación no aparece en 3 velas
3. Rompe estructura previa en dirección contraria
4. Cambio de sesión
5. News en menos de 30 min
6. Vela dominante contraria antes del gatillo

## Gestión de Riesgo

- Riesgo 1% (A) o 0.5% (B)
- SL al otro lado del stop hunt + colchón 0.3-0.5%
- Secuencia: ANÁLISIS → SL → TAMAÑO
- TP1 50% en EMA 50 o S/R cercano
- TP2 50% con trailing sobre estructura
- Mínimo RR 1:2

**Límites:**
- Diario -2% → apagar PC
- Semanal -5% → pausar, revisar journal
- Mensual -10% → stop total del mes

## Checklist de Decisión

1. ¿TF superior a favor? NO = skip
2. ¿Setup M/W o rebote EMA? NO = skip
3. ¿RSI extremo? NO = skip
4. ¿Vela de confirmación? NO = wait
5. ¿Volumen OK (crypto)? NO = skip
6. ¿Sesión correcta? NO = skip
7. ¿Grade A o B? C = skip
8. ¿Invalidación activa? SÍ = skip
9. ¿RR 1:2 mínimo? NO = skip
10. Journal llenado → EJECUTAR

## Reglas de Oro

1. El SL lo determina la estructura, no tu tolerancia al riesgo
2. Corta pérdidas, deja correr ganancias
3. Nunca entres sin vela de confirmación
4. 2 pérdidas hoy → se acabó el día
5. No operar en exceso — siempre viene otro patrón
6. El mercado se mueve hacia donde más traders pierden — no seas uno

---
v2.0 — Revisar después de 30 trades registrados.
