'use client';

import useSWR from 'swr';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const fetcher = (url) => fetch(url).then((r) => r.json());

/**
 * Fetch a single escrow by ID.
 * Polls every 30 seconds; pauses automatically when the page is hidden.
 *
 * @param {number|string} id — escrow_id
 * @returns {{ escrow: object|null, isLoading: boolean, error: Error|null, mutate: Function }}
 */
export function useEscrow(id) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `${API_URL}/api/escrows/${id}` : null,
    fetcher,
    {
      refreshInterval: 30_000, // poll every 30 seconds
      refreshWhenHidden: false, // pause polling when page is not visible
    },
  );
  return { escrow: data, isLoading, error, mutate };
}

/**
 * Fetch all escrows for the connected user.
 *
 * @param {string} address — Stellar public key
 * @param {'client'|'freelancer'|'all'} role
 * @returns {{ escrows: Array, isLoading: boolean, error: Error|null, mutate: Function }}
 */
export function useUserEscrows(address, role = 'all') {
  const params = new URLSearchParams();
  if (role !== 'all') params.set('role', role);

  const { data, error, isLoading, mutate } = useSWR(
    address ? `${API_URL}/api/escrows/user/${address}?${params}` : null,
    fetcher,
    {
      refreshInterval: 30_000,
      refreshWhenHidden: false,
    },
  );

  return {
    escrows: data?.escrows ?? data ?? [],
    isLoading,
    error,
    mutate,
  };
}

/**
 * Fetch paginated list of all escrows (for Explorer).
 *
 * @param {{ page: number, limit: number, status: string }} options
 * @returns {{ escrows: Array, total: number, isLoading: boolean, error: Error|null, mutate: Function }}
 */
export function useEscrowList({ page = 1, limit = 20, status = '' } = {}) {
  const params = new URLSearchParams({ page, limit });
  if (status) params.set('status', status);

  const { data, error, isLoading, mutate } = useSWR(
    `${API_URL}/api/escrows?${params}`,
    fetcher,
    {
      refreshInterval: 60_000,
      refreshWhenHidden: false,
    },
  );

  return {
    escrows: data?.escrows ?? data?.items ?? [],
    total: data?.total ?? 0,
    isLoading,
    error,
    mutate,
  };
}
