

const API_URL = '/api'

export interface User {
    displayName: string
    email: string
    id: string
    imageUrl?: string
    token?: string
}

export interface LoginDto {
    email: string
    password: string
}

export interface RegisterDto {
    email: string
    password: string
    displayName: string
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }))
        throw new Error(error.message || error.title || 'An error occurred')
    }
    return response.json()
}

export const api = {
    login: async (data: LoginDto) => {
        const response = await fetch(`${API_URL}/account/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return handleResponse<{ message: string }>(response)
    },

    register: async (data: RegisterDto) => {
        const response = await fetch(`${API_URL}/account/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return handleResponse<{ message: string; userId: string }>(response)
    },

    logout: async () => {
        const response = await fetch(`${API_URL}/account/logout`, {
            method: 'POST',
        })
        return handleResponse<{ message: string }>(response)
    },

    getUser: async () => {
        const response = await fetch(`${API_URL}/account/user-info`)
        if (response.status === 204) return null
        if (response.status === 401) return null
        return handleResponse<User>(response)
    },
}
