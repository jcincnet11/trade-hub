import { OHLCCandle, PatternResult } from '../types/market'
import * as P from './patterns'

export function detectPatterns(candles: OHLCCandle[]): PatternResult[] {
  if (!candles || candles.length < 3) return []
  const results: PatternResult[] = []
  const len = candles.length
  const c = candles[len - 1]
  const prev1 = candles[len - 2]
  const prev2 = candles[len - 3]
  const history = candles.slice(0, len - 1)

  const singles = [
    P.detectDoji(c),
    P.detectLongLeggedDoji(c),
    P.detectGravestoneDoji(c),
    P.detectDragonflyDoji(c),
    P.detectMarubozu(c),
    P.detectSpinningTop(c),
    P.detectHammer(c, history),
    P.detectHangingMan(c, history),
    P.detectInvertedHammer(c, history),
    P.detectShootingStar(c, history),
  ]

  const doubles = [
    P.detectBullishEngulfing(c, prev1),
    P.detectBearishEngulfing(c, prev1),
    P.detectBullishHarami(c, prev1),
    P.detectBearishHarami(c, prev1),
    P.detectPiercingLine(c, prev1),
    P.detectDarkCloudCover(c, prev1),
    P.detectTweezers(c, prev1),
  ]

  const triples = [
    P.detectMorningStar(c, prev1, prev2),
    P.detectEveningStar(c, prev1, prev2),
    P.detectThreeWhiteSoldiers(c, prev1, prev2),
    P.detectThreeBlackCrows(c, prev1, prev2),
  ]

  ;[...singles, ...doubles, ...triples].forEach((r) => {
    if (r) results.push(r)
  })

  return results.sort((a, b) => b.confidence - a.confidence)
}
