<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50 dark:tw-bg-gray-900">
    <form @submit.prevent="handleLogin" class="tw-bg-white dark:tw-bg-gray-800 tw-p-8 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-md">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Đăng nhập</h2>

      <div class="tw-mb-4">
        <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Email</label>
        <div class="tw-relative">
          <Mail class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
          <input
            v-model="form.email"
            type="email"
            class="tw-w-full tw-border tw-rounded tw-px-10 tw-py-2 tw-mt-1 dark:tw-bg-gray-700 dark:tw-text-white"
            placeholder="example@email.com"
            required
          />
        </div>
      </div>

      <div class="tw-mb-4">
        <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mật khẩu</label>
        <div class="tw-relative">
          <Lock class="tw-absolute tw-left-3 tw-top-2.5 tw-text-gray-400" />
          <input
            v-model="form.password"
            :type="showPassword ? 'text' : 'password'"
            class="tw-w-full tw-border tw-rounded tw-px-10 tw-pr-10 tw-py-2 tw-mt-1 dark:tw-bg-gray-700 dark:tw-text-white"
            placeholder="********"
            required
          />
          <Eye
            v-if="!showPassword"
            @click="togglePassword"
            class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400 tw-cursor-pointer"
          />
          <EyeOff
            v-else
            @click="togglePassword"
            class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400 tw-cursor-pointer"
          />
        </div>
      </div>

      <div class="tw-flex tw-items-center tw-justify-between tw-mb-4">
        <label class="tw-flex tw-items-center tw-gap-2 tw-text-gray-600 dark:tw-text-gray-300">
          <input v-model="form.remember" type="checkbox" class="tw-form-checkbox tw-rounded tw-text-[#086df9]" />
          Ghi nhớ đăng nhập
        </label>
        <RouterLink to="/forgot-password" class="tw-text-sm tw-text-[#086df9] hover:underline">
          Quên mật khẩu?
        </RouterLink>
      </div>

      <div v-if="error" class="tw-text-red-500 tw-text-sm tw-mb-4">{{ error }}</div>

      <button
        type="submit"
        :disabled="loading"
        class="tw-mt-2 tw-w-full tw-bg-[#086df9] tw-text-white tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center tw-justify-center tw-gap-2 disabled:tw-opacity-50"
      >
        <template v-if="!loading">
          <LogIn class="tw-w-4 tw-h-4" /> Đăng nhập
        </template>
        <template v-else>
          <span class="tw-animate-spin">⌛</span> Đang xử lý...
        </template>
      </button>

      <p class="tw-mt-4 tw-text-sm dark:tw-text-gray-300">
        Chưa có tài khoản?
        <RouterLink to="/register" class="tw-text-[#086df9] hover:underline">Đăng ký</RouterLink>
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-vue-next'
import { apiClient } from '../composables/useApiClient'

const router = useRouter()
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: false
})

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

const handleLogin = async () => {
  try {
    loading.value = true
    error.value = ''

    const response = await apiClient.post(`/api/users/login`, {
      email: form.email,
      password: form.password
    })

    // Lưu token vào localStorage hoặc sessionStorage
    const storage = form.remember ? localStorage : sessionStorage
    storage.setItem('token', response.data.token)
    storage.setItem('user', JSON.stringify(response.data.user))

    // Chuyển hướng theo role
    if (response.data.user.role === 'tenant_user') {
      router.push('/tenant-user/dashboard').then(() => window.location.reload())
    } else {
      router.push('/').then(() => window.location.reload())
    }
  } catch (err) {
    if (err.response?.data?.error) {
      error.value = err.response.data.error
    } else {
      error.value = 'Có lỗi xảy ra, vui lòng thử lại sau'
    }
  } finally {
    loading.value = false
  }
}
</script>