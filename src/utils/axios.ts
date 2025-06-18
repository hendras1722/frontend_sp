import axios, { AxiosError, AxiosResponse, AxiosRequestConfig } from 'axios'
import Cookies from 'js-cookie'

const baseURL =
  typeof window !== 'undefined'
    ? '/v1/'
    :' process.env.NEXT_PUBLIC_BASE_URL' + '/v1/'
console.log('Base URL:',' process.env.NEXT_PUBLIC_BASE_URL')
axios.defaults.baseURL = baseURL

const getToken = async (): Promise<string | undefined> => {
  try {
    if (typeof window === 'undefined') {
      // Server-side
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      console.log(cookieStore.get('accessToken'))
      const token = cookieStore.get('accessToken')?.value
      console.log(token)
      return token
    } else {
      // Client-side
      const token = Cookies.get('accessToken')
      return token
    }
  } catch (error) {
    console.error('Error getting token:', error)
    return undefined
  }
}

axios.interceptors.request.use(
  async (config) => {
    try {
      const token = await getToken()

      if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
        console.log(
          'Token set in headers:',
          `Bearer ${token.substring(0, 10)}...`
        )
      } else {
        console.log('No token found, proceeding without authorization')
      }

      return config
    } catch (error) {
      console.error('Error in request interceptor:', error)
      return config
    }
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor remains the same
axios.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (!error?.response) return Promise.reject(error)

    const { data, status } = error.response

    switch (status) {
      case 400:
        console.error('Bad Request:', data)
        break

      case 401:
        console.error('Unauthorized - Invalid or expired token')
        // Optionally clear invalid token
        if (typeof window !== 'undefined') {
          Cookies.remove('accessToken')
        }
        break
      case 401:
        console.error('Unauthorized - Invalid or expired token')
        // Optionally clear invalid token
        if (typeof window !== 'undefined') {
          Cookies.remove('accessToken')
        }
        break

      case 404:
        console.error('Not Found:', data)
        break

      case 500:
        console.error('Server Error:', data)
        break

      default:
        console.error(`HTTP ${status}:`, data)
    }

    return Promise.reject(error)
  }
)

const responseBody = <T>(response: AxiosResponse<T>) => response.data

export const axiosFetch = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    axios.get<T>(url, config).then(responseBody),
  post: <T>(url: string, body: {}) =>
    axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
}

// Helper function to manually set token (useful after login)
export const setAuthToken = (token: string) => {
  if (typeof window !== 'undefined') {
    Cookies.set('accessToken', token, {
      expires: 7,
      secure: true,
      sameSite: 'sameSite',
    })
  }
}

// Helper function to clear token (useful for logout)
export const clearAuthToken = () => {
  if (typeof window !== 'undefined') {
    Cookies.remove('accessToken')
    fetch('/api/logout', {
      method: 'POST',
      cache: 'force-cache',
    })
  }
}
