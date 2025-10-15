<template>
  <div>
    <!-- Global Admin View -->
    <GlobalAdminPurchases v-if="userRole === 'global_admin'" />
    
    <!-- Tenant Admin View -->
    <TenantAdminPurchases v-else-if="userRole === 'tenant_admin'" />
    
    <!-- Tenant User View -->
    <div v-else-if="userRole === 'tenant_user'" class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Quyền truy cập bị hạn chế</h3>
            <p class="mt-1 text-sm text-gray-500">
              Bạn không có quyền truy cập trang này. Vui lòng liên hệ Tenant Admin.
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Loading -->
    <div v-else class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="text-center">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải...
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import GlobalAdminPurchases from '../components/GlobalAdminPurchases.vue'
import TenantAdminPurchases from '../components/TenantAdminPurchases.vue'

const userRole = ref(null)

const getStoredUser = () => {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

onMounted(() => {
  const user = getStoredUser()
  if (user) {
    userRole.value = user.role
  }
})
</script> 