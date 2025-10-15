<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Quản lý Đơn hàng</h1>
            <p class="mt-2 text-gray-600">Danh sách tất cả đơn hàng đã bán trong hệ thống</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="fetchPurchaseStats"
              :disabled="statsLoading"
              class="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg v-if="statsLoading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              {{ statsLoading ? 'Đang tải...' : 'Làm mới thống kê' }}
            </button>
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="stats" class="px-4 sm:px-0 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">Tổng đơn hàng</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stats.totalPurchases }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div v-for="stat in stats.statusStats" :key="stat.status" class="bg-white overflow-hidden shadow rounded-lg">
            <div class="p-5">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-gray-500 truncate">{{ getStatusText(stat.status) }}</dt>
                    <dd class="text-lg font-medium text-gray-900">{{ stat.count }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="px-4 sm:px-0 mb-6">
        <div class="bg-white shadow rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select v-model="filters.status" @change="applyFilters" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Tất cả</option>
                <option value="completed">Hoàn thành</option>
                <option value="pending">Chờ xử lý</option>
                <option value="canceled">Đã hủy</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Tenant ID</label>
              <input v-model="filters.tenant_id" @input="applyFilters" type="number" placeholder="Nhập Tenant ID" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input v-model="filters.user_id" @input="applyFilters" type="number" placeholder="Nhập User ID" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Package ID</label>
              <input v-model="filters.package_id" @input="applyFilters" type="number" placeholder="Nhập Package ID" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
          </div>
        </div>
      </div>

      <!-- Purchases Table -->
      <div class="px-4 sm:px-0">
        <div class="bg-white shadow overflow-hidden sm:rounded-md">
          <div v-if="loading" class="text-center py-12">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải danh sách đơn hàng...
            </div>
          </div>
          
          <div v-else-if="error" class="text-center py-12">
            <div class="text-red-600 mb-4">{{ error }}</div>
            <button @click="refreshData" class="text-blue-600 hover:text-blue-800">Thử lại</button>
          </div>
          
          <div v-else-if="purchases.length === 0" class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Không có đơn hàng nào</h3>
            <p class="mt-1 text-sm text-gray-500">Chưa có đơn hàng nào được tạo.</p>
          </div>
          
          <ul v-else class="divide-y divide-gray-200">
            <li v-for="purchase in purchases" :key="purchase.purchase_id" class="px-6 py-4">
              <div class="flex items-center justify-between">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-gray-900 truncate">
                        Đơn hàng #{{ purchase.purchase_id }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ purchase.user?.email }} - {{ purchase.package?.name }}
                      </p>
                      <p class="text-sm text-gray-500">
                        {{ formatDate(purchase.purchase_date) }}
                      </p>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span :class="getStatusBadgeClass(purchase.status)" class="px-2 py-1 text-xs font-medium rounded-full">
                        {{ getStatusText(purchase.status) }}
                      </span>
                      <span class="text-sm font-medium text-gray-900">
                        {{ formatPrice(purchase.package?.price) }}
                      </span>
                    </div>
                  </div>
                  <div class="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Tenant ID: {{ purchase.tenant_id }}</span>
                    <span>User ID: {{ purchase.user_id }}</span>
                    <span>Package ID: {{ purchase.package_id }}</span>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    @click="sendInvoiceEmail(purchase.purchase_id)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Gửi email
                  </button>
                  <button
                    @click="downloadInvoicePDF(purchase.purchase_id)"
                    class="text-green-600 hover:text-green-800 text-sm"
                  >
                    Tải PDF
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-4 sm:px-0 mt-6">
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Trước
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Sau
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Hiển thị <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span> đến 
                <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span> 
                trong tổng số <span class="font-medium">{{ pagination.total }}</span> kết quả
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  @click="changePage(pagination.page - 1)"
                  :disabled="pagination.page <= 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Trước</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
                <button
                  v-for="page in getPageNumbers()"
                  :key="page"
                  @click="changePage(page)"
                  :class="[
                    page === pagination.page
                      ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="changePage(pagination.page + 1)"
                  :disabled="pagination.page >= pagination.totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Sau</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useUserPurchases } from '../composables/useUserPurchases'

const {
  purchases,
  loading,
  error,
  pagination,
  stats,
  statsLoading,
  fetchPurchases,
  fetchPurchaseStats,
  sendInvoiceEmail,
  downloadInvoicePDF,
  formatDate,
  formatPrice,
  getStatusBadgeClass,
  getStatusText
} = useUserPurchases()

// Filters
const filters = reactive({
  status: '',
  tenant_id: '',
  user_id: '',
  package_id: ''
})

// Methods
const refreshData = async () => {
  await fetchPurchases(getFilterParams())
}

const applyFilters = () => {
  pagination.value.page = 1
  refreshData()
}

const getFilterParams = () => {
  const params = { page: pagination.value.page }
  if (filters.status) params.status = filters.status
  if (filters.tenant_id) params.tenant_id = filters.tenant_id
  if (filters.user_id) params.user_id = filters.user_id
  if (filters.package_id) params.package_id = filters.package_id
  return params
}

const changePage = async (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    await fetchPurchases(getFilterParams())
  }
}

const getPageNumbers = () => {
  const pages = []
  const current = pagination.value.page
  const total = pagination.value.totalPages
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }
  
  return pages
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    fetchPurchases(),
    fetchPurchaseStats()
  ])
})
</script> 