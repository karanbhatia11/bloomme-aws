import type { ApiResponse } from './types'

export async function fetchAPI<T>(
  url: string,
  options: RequestInit & { token?: string } = {}
): Promise<ApiResponse<T>> {
  try {
    const { token, ...fetchOptions } = options
    const headers = new Headers(fetchOptions.headers || {})
    headers.set('Content-Type', 'application/json')

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${url}`,
      { ...fetchOptions, headers }
    )

    const data = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: `HTTP_${response.status}`,
          message: data?.error?.message || 'Request failed',
        },
      }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    }
  }
}

export async function postAPI<T>(
  url: string,
  body: unknown,
  token?: string
): Promise<ApiResponse<T>> {
  return fetchAPI<T>(url, {
    method: 'POST',
    body: JSON.stringify(body),
    token,
  })
}

export async function getAPI<T>(
  url: string,
  token?: string
): Promise<ApiResponse<T>> {
  return fetchAPI<T>(url, { method: 'GET', token })
}

export async function patchAPI<T>(
  url: string,
  body: unknown,
  token?: string
): Promise<ApiResponse<T>> {
  return fetchAPI<T>(url, {
    method: 'PATCH',
    body: JSON.stringify(body),
    token,
  })
}

export async function deleteAPI<T>(
  url: string,
  token?: string
): Promise<ApiResponse<T>> {
  return fetchAPI<T>(url, { method: 'DELETE', token })
}
