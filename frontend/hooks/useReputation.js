/**
 * useReputation Hook
 *
 * Fetches reputation data for a Stellar address from the backend API.
 *
 * Usage:
 *   const { reputation, badge, isLoading } = useReputation(address);
 */

'use client';

import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const fetcher = (url) => fetch(url).then((r) => r.json());

const BADGE_THRESHOLDS = {
  ELITE: 1000,
  EXPERT: 500,
  VERIFIED: 250,
  TRUSTED: 100,
};

/**
 * Derives the reputation badge label from a score.
 *
 * @param {number} score
 * @returns {'ELITE'|'EXPERT'|'VERIFIED'|'TRUSTED'|'NEW'}
 */
export function getBadgeFromScore(score) {
  if (score >= BADGE_THRESHOLDS.ELITE) return 'ELITE';
  if (score >= BADGE_THRESHOLDS.EXPERT) return 'EXPERT';
  if (score >= BADGE_THRESHOLDS.VERIFIED) return 'VERIFIED';
  if (score >= BADGE_THRESHOLDS.TRUSTED) return 'TRUSTED';
  return 'NEW';
}

/**
 * @param {string|null} address — Stellar public key
 * @returns {{ reputation: object|null, badge: string, isLoading: boolean, error: Error|null, mutate: Function }}
 */
export function useReputation(address) {
  const { data, error, isLoading, mutate } = useSWR(
    address ? `${API_URL}/api/reputation/${address}` : null,
    fetcher,
    {
      // Reputation changes infrequently — cache aggressively
      revalidateOnFocus: false,
      refreshInterval: 120_000,
    },
  );

  const score = data?.totalScore ?? data?.total_score ?? 0;

  return {
    reputation: data ?? null,
    badge: getBadgeFromScore(score),
    isLoading,
    error: error ?? null,
    mutate,
  };
}
