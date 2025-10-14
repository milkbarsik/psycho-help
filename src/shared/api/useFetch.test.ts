import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useFetch } from './useFetch';
import { AxiosError } from 'axios';

describe('useFetch', () => {
  it('должен успешно вызвать foo и обновить состояния загрузки', async () => {
    const mockFoo = vi.fn().mockResolvedValue('ok');
    const { result } = renderHook(() => useFetch(mockFoo));

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error.message).toBe('');

    await act(async () => {
      await result.current.fetching();
    });

    expect(mockFoo).toHaveBeenCalledTimes(1);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error.message).toBe('');
  });

  it('должен обработать ошибку AxiosError и установить error', async () => {
    const axiosError = new AxiosError('Request failed', 'ERR_BAD_REQUEST', {} as any, {}, { status: 400 } as any);
    const mockFoo = vi.fn().mockRejectedValue(axiosError);
    const { result } = renderHook(() => useFetch(mockFoo));

    await act(async () => {
      await result.current.fetching();
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error.message).toBe('Request failed');
    expect(result.current.error.status).toBe(400);
  });
});
