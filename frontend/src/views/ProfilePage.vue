<template>
  <div class="tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900 tw-py-10 tw-px-4 sm:tw-px-6 lg:tw-px-8">
    <div class="tw-max-w-2xl tw-mx-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-md tw-p-8">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Hồ sơ cá nhân</h2>

      <form class="tw-space-y-4" @submit.prevent="handleSave">
        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Họ và tên</label>
          <div class="tw-relative">
            <User class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.full_name"
              type="text"
              required
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Email</label>
          <div class="tw-relative">
            <Mail class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.email"
              type="email"
              disabled
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 tw-bg-gray-100 dark:tw-bg-gray-600 dark:tw-text-gray-300"
            />
          </div>
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Số điện thoại</label>
          <div class="tw-relative">
            <Phone class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
            <input
              v-model="profile.phone_number"
              type="text"
              required
              class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
            />
          </div>
        </div>

        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-text-sm tw-text-red-500" v-if="error">
            {{ error }}
          </div>
          <div class="tw-text-sm tw-text-green-500" v-if="success">
            {{ success }}
          </div>
          <button
            type="submit"
            :disabled="loading"
            class="tw-bg-[#086df9] tw-text-white tw-px-6 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center tw-gap-2 disabled:tw-opacity-50"
          >
            <template v-if="!loading">
              <Save class="tw-w-4 tw-h-4" /> Lưu thay đổi
            </template>
            <template v-else>
              <span class="tw-animate-spin">⌛</span> Đang xử lý...
            </template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { User, Mail, Phone, Save } from 'lucide-vue-next'
import axios from 'axios'

// Tạo axios instance với cấu hình mặc định
const api = axios.create({
  baseURL: '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  // Add retry logic
  retry: 3,
  retryDelay: 1000
})

// Add retry interceptor
api.interceptors.response.use(undefined, async (err) => {
  const { config } = err;
  if (!config || !config.retry) {
    return Promise.reject(err);
  }

  config.retryCount = config.retryCount || 0;

  if (config.retryCount >= config.retry) {
    return Promise.reject(err);
  }

  config.retryCount += 1;
  console.log(`Retrying request (${config.retryCount}/${config.retry}):`, config.url);

  const backoff = new Promise(resolve => {
    setTimeout(() => resolve(), config.retryDelay || 1000);
  });

  await backoff;
  return api(config);
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log('Request:', {
      method: config.method,
      url: config.url,
      headers: config.headers,
      data: config.data
    })
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
      headers: response.headers
    })
    return response
  },
  (error) => {
    console.error('Response error:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status
    })
    return Promise.reject(error)
  }
)

const profile = ref({
  full_name: '',
  email: '',
  phone_number: ''
})

const loading = ref(false)
const error = ref('')
const success = ref('')

onMounted(async () => {
  try {
    // Lấy thông tin từ storage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (userStr) {
      const user = JSON.parse(userStr)
      profile.value = {
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || user.phone || ''
      }
    }

    // Lấy thông tin mới nhất từ server
    const response = await api.get('/users/profile')
    if (response.data && response.data.user) {
      profile.value = {
        full_name: response.data.user.full_name,
        email: response.data.user.email,
        phone_number: response.data.user.phone_number
      }
    }
  } catch (err) {
    console.error('Error fetching profile:', err)
  }
})

const validatePhoneNumber = (phone: string) => {
  const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/
  return phoneRegex.test(phone)
}

const handleSave = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = ''

    // Validate dữ liệu
    if (!profile.value.full_name.trim()) {
      error.value = 'Vui lòng nhập họ tên'
      return
    }

    if (!validatePhoneNumber(profile.value.phone_number)) {
      error.value = 'Số điện thoại không hợp lệ'
      return
    }

    // Kiểm tra token
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) {
      error.value = 'Vui lòng đăng nhập lại'
      return
    }

    // Chuẩn bị dữ liệu gửi đi
    const updateData = {
      full_name: profile.value.full_name.trim(),
      phone_number: profile.value.phone_number
    }

    console.log('Sending update request with data:', updateData)

    try {
      const response = await api.put('/users/profile', updateData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        timeout: 30000,
        retry: 3,
        retryDelay: 1000
      })

      if (response.data) {
        // Cập nhật storage
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage
        const userStr = storage.getItem('user')
        if (userStr) {
          const user = JSON.parse(userStr)
          const updatedUser = {
            ...user,
            full_name: response.data.user.full_name,
            phone_number: response.data.user.phone_number
          }
          storage.setItem('user', JSON.stringify(updatedUser))
          console.log('Updated user in storage:', updatedUser)
        }

        success.value = response.data.message || 'Cập nhật thông tin thành công'
      }
    } catch (apiError) {
      console.error('API Error:', {
        message: apiError.message,
        code: apiError.code,
        response: apiError.response?.data,
        status: apiError.response?.status
      })

      if (apiError.code === 'ECONNABORTED') {
        error.value = 'Yêu cầu bị hủy do timeout, vui lòng thử lại'
      } else if (apiError.code === 'ERR_NETWORK') {
        error.value = 'Lỗi kết nối mạng, vui lòng kiểm tra kết nối và thử lại'
      } else if (apiError.response?.status === 404) {
        error.value = 'Không tìm thấy endpoint cập nhật thông tin'
      } else if (apiError.response?.status === 401) {
        error.value = 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại'
        setTimeout(() => {
          window.location.href = '/login'
        }, 1500)
      } else {
        error.value = apiError.response?.data?.error || 'Có lỗi xảy ra khi cập nhật thông tin'
      }
      throw apiError
    }
  } catch (err) {
    console.error('Error updating profile:', err)
  } finally {
    loading.value = false
  }
}
</script>