import { ref, computed } from 'vue'
import axios from 'axios'

const files = ref([])
const uploading = ref(false)
const error = ref(null)
const uploadProgress = ref(0)

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Lấy token từ sessionStorage hoặc localStorage
const getAuthToken = () => {
  return sessionStorage.getItem('token') || localStorage.getItem('token')
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

export function useFileUpload() {
  // Upload file
  const uploadFile = async (file, tenantId, userId, packageId) => {
    uploading.value = true
    error.value = null
    uploadProgress.value = 0
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tenant_id', tenantId)
      formData.append('user_id', userId)
      formData.append('package_id', packageId)

      const response = await apiClient.post('/api/file-upload/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      })

      // Add new file to list
      files.value.unshift(response.data.file)
      
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi upload file'
      console.error('Error uploading file:', err)
      throw err
    } finally {
      uploading.value = false
      uploadProgress.value = 0
    }
  }

  // Get files list
  const getFiles = async (tenantId, userId, packageId) => {
    try {
      const response = await apiClient.get('/api/file-upload/files', {
        params: {
          tenant_id: tenantId,
          user_id: userId,
          package_id: packageId
        }
      })
      
      files.value = response.data.files
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi tải danh sách file'
      console.error('Error getting files:', err)
      throw err
    }
  }

  // Delete file
  const deleteFile = async (objectName, tenantId, userId, packageId) => {
    try {
      await apiClient.delete(`/api/file-upload/files/${encodeURIComponent(objectName)}`, {
        data: {
          tenant_id: tenantId,
          user_id: userId,
          package_id: packageId
        }
      })

      // Remove file from list
      const index = files.value.findIndex(file => file.name === objectName)
      if (index > -1) {
        files.value.splice(index, 1)
      }

      return true
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi xóa file'
      console.error('Error deleting file:', err)
      throw err
    }
  }

  // Get file URL
  const getFileUrl = async (objectName, expiryHours = 24) => {
    try {
      const response = await apiClient.get(`/api/file-upload/files/${encodeURIComponent(objectName)}/url`, {
        params: { expiryHours }
      })
      return response.data.fileUrl
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi lấy URL file'
      console.error('Error getting file URL:', err)
      throw err
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

  // Get file icon based on mime type
  const getFileIcon = (mimeType) => {
    if (mimeType.startsWith('image/')) {
      return '🖼️'
    } else if (mimeType === 'application/pdf') {
      return '📄'
    } else if (mimeType.startsWith('text/')) {
      return '📝'
    } else if (mimeType.includes('word')) {
      return '📘'
    } else if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) {
      return '📊'
    } else {
      return '📎'
    }
  }

  // Check if file is image
  const isImage = (mimeType) => {
    return mimeType.startsWith('image/')
  }

  // Validate file before upload
  const validateFile = (file) => {
    const maxSize = 50 * 1024 * 1024 // 50MB
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]

    if (file.size > maxSize) {
      throw new Error('File quá lớn. Kích thước tối đa là 50MB.')
    }

    if (!allowedTypes.includes(file.type)) {
      throw new Error('Loại file không được hỗ trợ.')
    }

    return true
  }

  // Debug service data
  const debugServiceData = async (tenantId, userId) => {
    try {
      const response = await apiClient.get('/api/file-upload/debug/service-data', {
        params: {
          tenant_id: tenantId,
          user_id: userId
        }
      })
      
      console.log('Debug service data:', response.data)
      return response.data
    } catch (err) {
      error.value = err.response?.data?.error || 'Có lỗi xảy ra khi debug service data'
      console.error('Error debugging service data:', err)
      throw err
    }
  }

  return {
    // State
    files: computed(() => files.value),
    uploading: computed(() => uploading.value),
    error: computed(() => error.value),
    uploadProgress: computed(() => uploadProgress.value),
    
    // Methods
    uploadFile,
    getFiles,
    deleteFile,
    getFileUrl,
    formatFileSize,
    getFileIcon,
    isImage,
    validateFile,
    debugServiceData
  }
} 