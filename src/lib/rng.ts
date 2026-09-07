/** Deterministic PRNG (mulberry32) so a seed fully reproduces a data set. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0
}

/** A seeded array of integers in [min, max]. */
export function seededArray(seed: number, size: number, min = 5, max = 100): number[] {
  const rand = mulberry32(seed)
  return Array.from({ length: size }, () => Math.floor(rand() * (max - min + 1)) + min)
}

/** A seeded array of `count` distinct integers in [1, poolMax], in shuffled order. */
export function seededDistinct(seed: number, count: number, poolMax = 99): number[] {
  const rand = mulberry32(seed)
  const pool = Array.from({ length: poolMax }, (_, i) => i + 1)
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool.slice(0, count)
}
