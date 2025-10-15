import { ref, computed } from 'vue'
import axios from 'axios'

const purchases = ref([])
const loading = ref(false)
const error = ref(null)
const pagination = ref({
  page: 1,
  total: 0,
  totalPages: 0,
  limit: 10
})

const stats = ref(null)
const statsLoading = ref(false)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

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
  console.log('Token gửi lên:', token)
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
    }
    return Promise.reject(error)
  }
)

export function useUserPurchases() {
  // Lấy danh sách đơn hàng
  const fetchPurchases = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/api/user-purchases', { params })
      purchases.value = response.data.data
      pagination.value = {
        page: response.data.page,
        total: response.data.total,
        totalPages: response.data.totalPages,
        limit: response.data.limit || 10
      }
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải danh sách đơn hàng'
      console.error('Error fetching purchases:', err)
    } finally {
      loading.value = false
    }
  }

  // Lấy đơn hàng theo ID
  const fetchPurchaseById = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get(`/api/user-purchases/${id}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải đơn hàng'
      console.error('Error fetching purchase by ID:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Lấy thống kê đơn hàng
  const fetchPurchaseStats = async () => {
    statsLoading.value = true
    error.value = null
    
    try {
      const response = await apiClient.get('/api/user-purchases/stats/overview')
      stats.value = response.data
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải thống kê'
      console.error('Error fetching purchase stats:', err)
      throw err
    } finally {
      statsLoading.value = false
    }
  }

  // Kích hoạt gói cho tenant
  const activatePackageForTenant = async (purchaseId) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await apiClient.post(`/api/user-purchases/${purchaseId}/activate`)
      // Refresh danh sách sau khi kích hoạt
      await fetchPurchases()
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi kích hoạt gói'
      console.error('Error activating package:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Gửi email hóa đơn
  const sendInvoiceEmail = async (purchaseId) => {
    try {
      const response = await apiClient.get(`/api/user-purchases/invoice/${purchaseId}`)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi gửi email'
      console.error('Error sending invoice email:', err)
      throw err
    }
  }

  // Tải hóa đơn PDF
  const downloadInvoicePDF = async (purchaseId) => {
    try {
      const response = await apiClient.get(`/api/user-purchases/invoice-pdf/${purchaseId}`, {
        responseType: 'blob'
      })
      
      // Tạo link download
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `invoice_${purchaseId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải PDF'
      console.error('Error downloading invoice PDF:', err)
      throw err
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'canceled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành'
      case 'pending':
        return 'Chờ xử lý'
      case 'canceled':
        return 'Đã hủy'
      default:
        return status
    }
  }

  return {
    // State
    purchases: computed(() => purchases.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    pagination: computed(() => pagination.value),
    stats: computed(() => stats.value),
    statsLoading: computed(() => statsLoading.value),
    
    // Methods
    fetchPurchases,
    fetchPurchaseById,
    fetchPurchaseStats,
    activatePackageForTenant,
    sendInvoiceEmail,
    downloadInvoicePDF,
    formatDate,
    formatPrice,
    getStatusBadgeClass,
    getStatusText
  }
} 