import { naive } from './naive'
import { kmp } from './kmp'
import { rabinKarp } from './rabinKarp'
import { boyerMoore } from './boyerMoore'
import type { StringAlgorithm } from '@/types/stringmatch'

export const stringAlgorithms: StringAlgorithm[] = [naive, kmp, boyerMoore, rabinKarp]

export const stringAlgorithmsById: Record<string, StringAlgorithm> = Object.fromEntries(
  stringAlgorithms.map((a) => [a.id, a]),
)
