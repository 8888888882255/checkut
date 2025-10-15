<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gray-50 dark:tw-bg-gray-900">
    <form @submit.prevent="handleSubmit" class="tw-bg-white dark:tw-bg-gray-800 tw-p-8 tw-rounded-lg tw-shadow-md tw-w-full tw-max-w-md">
      <h2 class="tw-text-2xl tw-font-bold tw-mb-6 dark:tw-text-white">Đăng ký</h2>

      <div class="tw-space-y-4">
        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Họ và tên</label>
          <input
            v-model="form.fullName"
            type="text"
            placeholder="Nguyễn Văn A"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Số điện thoại</label>
          <input
            v-model="form.phoneNumber"
            type="tel"
            placeholder="0123456789"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="example@email.com"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Mật khẩu</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="********"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Nhập lại mật khẩu</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="********"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <div>
          <label class="tw-block tw-text-gray-700 dark:tw-text-gray-300">Tên Tenant (tùy chọn)</label>
          <input
            v-model="form.tenantName"
            type="text"
            placeholder="Nhập tên tenant (có thể để trống)"
            class="tw-w-full tw-border tw-rounded tw-px-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="tw-mt-4 tw-w-full tw-bg-[#086df9] tw-text-white tw-py-2 tw-rounded hover:tw-bg-blue-700 disabled:tw-opacity-50"
        >
          {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
        </button>

        <p class="tw-mt-4 tw-text-sm dark:tw-text-gray-300">
          Đã có tài khoản?
          <RouterLink to="/login" class="tw-text-[#086df9] hover:underline">Đăng nhập</RouterLink>
        </p>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const loading = ref(false)

const form = ref({
  fullName: '',
  phoneNumber: '',
  email: '',
  password: '',
  confirmPassword: '',
  tenantName: ''
})

const handleSubmit = async () => {
  try {
    if (!form.value.email || !form.value.password || !form.value.confirmPassword || 
        !form.value.fullName || !form.value.phoneNumber) {
      alert('Vui lòng điền đầy đủ thông tin.')
      return
    }

    if (form.value.password !== form.value.confirmPassword) {
      alert('Mật khẩu không trùng khớp.')
      return
    }

    loading.value = true

    const response = await axios.post('http://localhost:3000/api/users/register', {
      full_name: form.value.fullName,
      phone_number: form.value.phoneNumber,
      email: form.value.email,
      password: form.value.password,
      tenant_name: form.value.tenantName
    })

    if (response.data) {
      alert('Đăng ký thành công!')
      router.push('/login')
    }
  } catch (error) {
    console.error('Lỗi đăng ký:', error)
    alert(error.response?.data?.error || 'Có lỗi xảy ra khi đăng ký')
  } finally {
    loading.value = false
  }
}
</script>
