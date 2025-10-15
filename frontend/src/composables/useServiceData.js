import { ref, computed } from 'vue'
import axios from 'axios'

const serviceData = ref([])
const loading = ref(false)
const error = ref(null)
const pagination = ref({
  page: 1,
  total: 0,
  totalPages: 0,
  limit: 10
})

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Lấy token từ localStorage hoặc sessionStorage
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token');
}

// Cấu hình axios với token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Interceptor để thêm token vào header
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken()
  console.log('Token check:', {
    hasToken: !!token,
    tokenLength: token ? token.length : 0,
    tokenStart: token ? token.substring(0, 20) + '...' : 'none'
  })
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor để xử lý lỗi
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Token không hợp lệ hoặc đã hết hạn')
      // Không redirect tự động, để component xử lý
    }
    return Promise.reject(error)
  }
)

export function useServiceData() {
  // Lấy danh sách service data
  const fetchServiceData = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/api/service-data', { params })
      serviceData.value = response.data.data
      pagination.value = {
        page: response.data.page,
        total: response.data.total,
        totalPages: response.data.totalPages,
        limit: response.data.limit || 10
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải dữ liệu'
      console.error('Error fetching service data:', err)
    } finally {
      loading.value = false
    }
  }

  // Lấy service data theo ID
  const fetchServiceDataById = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get(`/api/service-data/${id}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải dữ liệu'
      console.error('Error fetching service data by ID:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Tạo service data mới
  const createServiceData = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post('/api/service-data', data)
      await fetchServiceData() // Refresh danh sách
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tạo dữ liệu'
      console.error('Error creating service data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Cập nhật service data
  const updateServiceData = async (id, data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.put(`/api/service-data/${id}`, data)
      await fetchServiceData() // Refresh danh sách
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi cập nhật dữ liệu'
      console.error('Error updating service data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Xóa service data
  const deleteServiceData = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await apiClient.delete(`/api/service-data/${id}`)
      await fetchServiceData() // Refresh danh sách
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi xóa dữ liệu'
      console.error('Error deleting service data:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy thống kê theo tenant
  const fetchTenantStats = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/api/service-data/stats/tenant')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải thống kê'
      console.error('Error fetching tenant stats:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy thống kê theo user
  const fetchUserStats = async (userId = null) => {
    loading.value = true
    error.value = null
    
    try {
      const url = userId ? `/api/service-data/stats/user/${userId}` : '/api/service-data/stats/user'
      const response = await apiClient.get(url)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải thống kê'
      console.error('Error fetching user stats:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Kiểm tra giới hạn sử dụng
  const checkUsageLimits = async (data) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post('/api/service-data/check-limits', data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi kiểm tra giới hạn'
      console.error('Error checking usage limits:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Kiểm tra trạng thái kích hoạt service data của tenant
  const checkTenantActivation = async () => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/api/service-data/activation/check')
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi kiểm tra trạng thái kích hoạt'
      console.error('Error checking tenant activation:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Format bandwidth
  const formatBandwidth = (bytes) => {
    return formatFileSize(bytes)
  }

  return {
    // State
    serviceData: computed(() => serviceData.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    pagination: computed(() => pagination.value),
    
    // Methods
    fetchServiceData,
    fetchServiceDataById,
    createServiceData,
    updateServiceData,
    deleteServiceData,
    fetchTenantStats,
    fetchUserStats,
    checkUsageLimits,
    checkTenantActivation,
    formatFileSize,
    formatBandwidth
  }
} 