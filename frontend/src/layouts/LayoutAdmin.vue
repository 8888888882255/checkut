<template>
  <div class="tw-flex tw-h-screen tw-bg-gray-50 dark:tw-bg-gray-900">
    <!-- Sidebar -->
    <HeaderAdmin />

    <!-- Nội dung -->
    <div class="tw-flex-1 tw-flex tw-flex-col">
      <!-- Topbar: cố định -->
      <header
        class="tw-sticky tw-top-0 tw-z-50 tw-h-16 tw-flex tw-items-center tw-justify-between tw-px-6 tw-border-b tw-bg-white dark:tw-bg-gray-800 dark:tw-border-gray-700">
        <!-- Tìm kiếm -->
        <div class="tw-flex tw-items-center tw-gap-4">
          <!-- Thêm lời chào -->

          <div class="tw-relative tw-w-64">
            <input type="text" placeholder="Tìm kiếm..."
              class="tw-w-full tw-border tw-border-gray-300 dark:tw-border-gray-600 tw-bg-white dark:tw-bg-gray-800 tw-text-gray-800 dark:tw-text-gray-100 tw-rounded-md tw-px-4 tw-py-1 focus:tw-outline-none focus:tw-ring focus:tw-ring-[#086df9]/40" />
            <Search class="tw-w-4 tw-h-4 tw-absolute tw-top-2 tw-right-3 tw-text-gray-400" />
          </div>
        </div>

        <!-- Icon + User -->
        <div class="tw-relative tw-flex tw-items-center tw-gap-4">
          <button @click="toggleDarkMode" class="tw-cursor-pointer">
            <Sun v-if="!isDark" class="tw-w-6 tw-h-6 tw-text-gray-700 hover:tw-text-[#086df9] dark:tw-text-gray-200" />
            <Moon v-else class="tw-w-6 tw-h-6 tw-text-gray-200 hover:tw-text-[#086df9]" />
          </button>

          <div class="tw-relative">
            <!-- Hiển thị nút đăng nhập/đăng ký khi chưa đăng nhập -->
            <div v-if="!userInfo.full_name" class="tw-flex tw-items-center tw-gap-4">
              <RouterLink to="/login"
                class="tw-text-gray-700 dark:tw-text-gray-200 hover:tw-text-[#086df9] tw-font-medium">
                Đăng nhập
              </RouterLink>
              <RouterLink to="/register"
                class="tw-text-gray-700 dark:tw-text-gray-200 hover:tw-text-[#086df9] tw-font-medium">
                Đăng ký
              </RouterLink>
            </div>

            <!-- Hiển thị menu dropdown khi đã đăng nhập -->
            <div v-else @click="toggleDropdown">
              <User
                class="tw-w-7 tw-h-7 tw-text-gray-700 dark:tw-text-gray-200 tw-cursor-pointer hover:tw-text-[#086df9]" />
              <div v-if="dropdownOpen"
                class="tw-absolute tw-right-0 tw-mt-2 tw-w-48 tw-bg-white dark:tw-bg-gray-800 tw-rounded-md tw-shadow-lg tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-z-50">

                <div class="tw-px-4 tw-py-2 tw-border-b dark:tw-border-gray-600 tw-font-semibold dark:tw-text-white">
                  Xin chào, {{ userInfo.full_name }}
                </div>
                <RouterLink to="/profile"
                  class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 dark:tw-text-gray-200">
                  <User class="tw-w-4 tw-h-4" /> Hồ sơ
                </RouterLink>
                <RouterLink to="/change-password"
                  class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 dark:tw-text-gray-200">
                  <Settings class="tw-w-4 tw-h-4" /> Đổi mật khẩu
                </RouterLink>
                <a href="#" @click.prevent="handleLogout"
                  class="tw-flex tw-items-center tw-gap-2 tw-px-4 tw-py-2 tw-text-red-600 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-cursor-pointer">
                  <LogOut class="tw-w-4 tw-h-4" /> Đăng xuất
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main content cuộn được -->
      <main class="tw-flex-1 tw-overflow-y-auto tw-p-4 dark:tw-text-white">
        <router-view />
      </main>

      <!-- Footer -->
      <FooterAdmin />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import HeaderAdmin from './HeaderAdmin.vue'
import FooterAdmin from './FooterAdmin.vue'
import { User, LogOut, Search, Settings, Sun, Moon } from 'lucide-vue-next'

const router = useRouter()
const dropdownOpen = ref(false)

// Thêm computed property để lấy thông tin user
const userInfo = computed(() => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : {}
})

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const isDark = ref(false)

const toggleDarkMode = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
}

const handleLogout = () => {
  // Xóa token và thông tin user khỏi storage
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  sessionStorage.removeItem('token')
  sessionStorage.removeItem('user')

  // Đóng dropdown
  dropdownOpen.value = false

  // Chuyển hướng về trang đăng nhập
  router.push('/login')
}

onMounted(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
  document.documentElement.classList.toggle('dark', isDark.value)
})
</script>
