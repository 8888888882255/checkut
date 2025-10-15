<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Dịch vụ đã mua</h1>
            <p class="mt-2 text-gray-600">Quản lý các gói dịch vụ đã mua và kích hoạt cho tenant</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              {{ loading ? 'Đang tải...' : 'Làm mới' }}
            </button>
            <button
              @click="goToShop"
              class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Mua thêm gói
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      <div v-if="stats" class="px-4 sm:px-0 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Tổng đơn hàng -->
          <div class="bg-gradient-to-r from-blue-500 to-blue-600 overflow-hidden shadow-lg rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-blue-100 truncate">Tổng đơn hàng</dt>
                    <dd class="text-2xl font-bold text-white">{{ stats.totalPurchases || 0 }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Tổng dung lượng -->
          <div class="bg-gradient-to-r from-green-500 to-green-600 overflow-hidden shadow-lg rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-green-100 truncate">Tổng dung lượng</dt>
                    <dd class="text-2xl font-bold text-white">{{ getTotalStorage() }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Tổng Bandwidth -->
          <div class="bg-gradient-to-r from-purple-500 to-purple-600 overflow-hidden shadow-lg rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-purple-100 truncate">Tổng Bandwidth</dt>
                    <dd class="text-2xl font-bold text-white">{{ getTotalBandwidth() }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Gói đang hoạt động -->
          <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 overflow-hidden shadow-lg rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-indigo-100 truncate">Gói đang hoạt động</dt>
                    <dd class="text-2xl font-bold text-white">{{ getCompletedCount() }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <!-- Gói chờ kích hoạt -->
          <div class="bg-gradient-to-r from-yellow-500 to-yellow-600 overflow-hidden shadow-lg rounded-lg">
            <div class="p-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="ml-5 w-0 flex-1">
                  <dl>
                    <dt class="text-sm font-medium text-yellow-100 truncate">Chờ kích hoạt</dt>
                    <dd class="text-2xl font-bold text-white">{{ getPendingCount() }}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="px-4 sm:px-0 mb-6">
        <div class="bg-white shadow-sm rounded-lg p-6 border border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Bộ lọc</h3>
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select v-model="filters.status" @change="applyFilters" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                <option value="">Tất cả</option>
                <option value="completed">Hoàn thành</option>
                <option value="pending">Chờ kích hoạt</option>
                <option value="canceled">Đã hủy</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <input v-model="filters.user_id" @input="applyFilters" type="number" placeholder="Nhập User ID" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Package ID</label>
              <input v-model="filters.package_id" @input="applyFilters" type="number" placeholder="Nhập Package ID" class="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex items-end">
              <button
                @click="clearFilters"
                class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
                Xóa bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="px-4 sm:px-0">
        <div class="bg-white shadow-sm rounded-lg p-12">
          <div class="text-center">
            <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600">
              <svg class="animate-spin -ml-1 mr-3 h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang tải danh sách đơn hàng...
            </div>
          </div>
        </div>
      </div>
      
      <!-- Error State -->
      <div v-else-if="error" class="px-4 sm:px-0">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Có lỗi xảy ra</h3>
              <div class="mt-2 text-sm text-red-700">{{ error }}</div>
              <div class="mt-4">
                <button @click="refreshData" class="bg-red-100 px-3 py-2 rounded-md text-sm font-medium text-red-800 hover:bg-red-200">
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Empty State -->
      <div v-else-if="purchases.length === 0" class="px-4 sm:px-0">
        <div class="bg-white shadow-sm rounded-lg p-12">
          <div class="text-center">
            <svg class="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Chưa có dịch vụ nào</h3>
            <p class="mt-2 text-sm text-gray-500">Bạn chưa mua dịch vụ nào cho tenant này.</p>
            <div class="mt-6">
              <button @click="goToShop" class="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                Mua gói dịch vụ ngay
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Purchases Grid -->
      <div v-else class="px-4 sm:px-0">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div v-for="purchase in purchases" :key="purchase.purchase_id" class="bg-white shadow-sm rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
            <div class="p-6">
              <!-- Header -->
              <div class="flex items-start justify-between mb-4">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ purchase.package?.name || `Gói #${purchase.package_id}` }}
                  </h3>
                  <p class="text-sm text-gray-500">Đơn hàng #{{ purchase.purchase_id }}</p>
                </div>
                <span :class="[
                  'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                  getStatusBadgeClass(purchase.status)
                ]">
                  {{ getStatusText(purchase.status) }}
                </span>
              </div>

              <!-- Package Info -->
              <div v-if="purchase.package" class="bg-gray-50 rounded-lg p-4 mb-4">
                <div class="grid grid-cols-1 gap-3">
                  <!-- Dung lượng Storage -->
                  <div class="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                      </svg>
                      <span class="text-sm font-medium text-blue-800">Storage</span>
                    </div>
                    <span class="text-lg font-bold text-blue-900">{{ formatFileSize(purchase.package.file_storage_limit) }}</span>
                  </div>
                  
                  <!-- Bandwidth Limit -->
                  <div v-if="purchase.package.bandwidth_limit" class="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                      </svg>
                      <span class="text-sm font-medium text-purple-800">Bandwidth</span>
                    </div>
                    <span class="text-lg font-bold text-purple-900">{{ formatBandwidth(purchase.package.bandwidth_limit) }}</span>
                  </div>

                  <!-- Database Limit -->
                  <div v-if="purchase.package.database_limit" class="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 011-1h1m0 0h1m0 0h1m0 0a1 1 0 001 1v1m0 0v1m0 0v1"></path>
                      </svg>
                      <span class="text-sm font-medium text-orange-800">Database</span>
                    </div>
                    <span class="text-lg font-bold text-orange-900">{{ formatNumber(purchase.package.database_limit) }} DBs</span>
                  </div>

                  <!-- API Call Limit -->
                  <div v-if="purchase.package.api_call_limit && purchase.package.api_call_limit > 0" class="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                      <span class="text-sm font-medium text-indigo-800">API Calls</span>
                    </div>
                    <span class="text-lg font-bold text-indigo-900">{{ formatNumber(purchase.package.api_call_limit) }}/tháng</span>
                  </div>
                  
                  <!-- Giá -->
                  <div class="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div class="flex items-center">
                      <svg class="h-5 w-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                      </svg>
                      <span class="text-sm font-medium text-green-800">Giá gói</span>
                    </div>
                    <span class="text-lg font-bold text-green-900">{{ formatPriceUSD(purchase.package.price) }}</span>
                  </div>
                </div>
              </div>

              <!-- Purchase Details -->
              <div class="space-y-3 mb-4">
                <div class="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">User ID:</span>
                    <span class="text-gray-900 ml-2">{{ purchase.user_id }}</span>
                  </div>
                  <div>
                    <span class="font-medium text-gray-700">Tenant ID:</span>
                    <span class="text-gray-900 ml-2">{{ purchase.tenant_id }}</span>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span class="font-medium text-gray-700">Ngày mua:</span>
                    <span class="text-gray-900 ml-2">{{ formatDate(purchase.purchase_date) }}</span>
                  </div>
                  <div v-if="purchase.start_date">
                    <span class="font-medium text-gray-700">Ngày bắt đầu:</span>
                    <span class="text-gray-900 ml-2">{{ formatDate(purchase.start_date) }}</span>
                  </div>
                  <div v-if="purchase.end_date">
                    <span class="font-medium text-gray-700">Ngày kết thúc:</span>
                    <span class="text-gray-900 ml-2">{{ formatDate(purchase.end_date) }}</span>
                  </div>
                </div>

                <div v-if="purchase.payment_id" class="text-sm">
                  <span class="font-medium text-gray-700">Payment ID:</span>
                  <span class="text-gray-900 ml-2 font-mono text-xs">{{ purchase.payment_id }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                <button
                  v-if="purchase.status === 'pending'"
                  @click="activatePackage(purchase.purchase_id)"
                  :disabled="activating === purchase.purchase_id"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="activating === purchase.purchase_id" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  {{ activating === purchase.purchase_id ? 'Đang kích hoạt...' : 'Kích hoạt gói' }}
                </button>
                
                <button
                  @click="sendInvoiceEmail(purchase.purchase_id)"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Gửi email
                </button>
                
                <button
                  @click="downloadInvoicePDF(purchase.purchase_id)"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Tải PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="px-4 sm:px-0 mt-8">
        <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 rounded-lg shadow-sm">
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
import { toast } from 'vue3-toastify'

const {
  purchases,
  loading,
  error,
  pagination,
  stats,
  statsLoading,
  fetchPurchases,
  fetchPurchaseStats,
  activatePackageForTenant,
  sendInvoiceEmail,
  downloadInvoicePDF,
  formatDate,
  formatPrice,
  getStatusBadgeClass,
  getStatusText
} = useUserPurchases()

// State
const activating = ref(null)

// Filters
const filters = reactive({
  status: '',
  user_id: '',
  package_id: ''
})

// Helper functions
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0 || bytes === null || bytes === undefined) return '0 Bytes'
  
  // Convert to number if it's a string
  const numBytes = parseInt(bytes)
  if (isNaN(numBytes)) return '0 Bytes'
  
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(numBytes) / Math.log(1024))
  
  if (i === 0) return numBytes + ' ' + sizes[i]
  
  const size = numBytes / Math.pow(1024, i)
  return Math.round(size * 100) / 100 + ' ' + sizes[i]
}

// Custom format price function with USD exchange rate
const formatPriceUSD = (price) => {
  if (!price || price === 0) return 'Miễn phí'
  
  // Tỷ giá USD/VND (có thể lấy từ API hoặc config)
  const exchangeRate = 24500 // 1 USD = 24,500 VND
  const usdPrice = price / exchangeRate
  
  // Format USD
  const usdFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(usdPrice)
  
  // Format VND
  const vndFormatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price)
  
  return `${usdFormatted} (${vndFormatted})`
}

// Format bandwidth (giả sử đơn vị là Mbps)
const formatBandwidth = (bandwidth) => {
  if (!bandwidth) return 'Không giới hạn'
  
  if (bandwidth >= 1000) {
    return `${(bandwidth / 1000).toFixed(1)} Gbps`
  }
  return `${bandwidth} Mbps`
}

// Format numbers with commas
const formatNumber = (number) => {
  if (!number) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const getTotalStorage = () => {
  if (!purchases.value || purchases.value.length === 0) return '0 GB'
  
  const totalBytes = purchases.value.reduce((total, purchase) => {
    if (purchase.status === 'completed' && purchase.package?.file_storage_limit) {
      return total + purchase.package.file_storage_limit
    }
    return total
  }, 0)
  
  return formatFileSize(totalBytes)
}

const getTotalBandwidth = () => {
  if (!purchases.value || purchases.value.length === 0) return '0 Mbps'
  
  const totalBandwidth = purchases.value.reduce((total, purchase) => {
    if (purchase.status === 'completed' && purchase.package?.bandwidth_limit) {
      return total + purchase.package.bandwidth_limit
    }
    return total
  }, 0)
  
  return formatBandwidth(totalBandwidth)
}

const getCompletedCount = () => {
  if (!stats.value?.statusStats) return 0
  const completed = stats.value.statusStats.find(s => s.status === 'completed')
  return completed?.count || 0
}

const getPendingCount = () => {
  if (!stats.value?.statusStats) return 0
  const pending = stats.value.statusStats.find(s => s.status === 'pending')
  return pending?.count || 0
}

// Methods
const refreshData = async () => {
  await Promise.all([
    fetchPurchases(getFilterParams()),
    fetchPurchaseStats()
  ])
  
  // Debug: Log package data to check file_storage_limit
  if (purchases.value && purchases.value.length > 0) {
    console.log('Debug - Purchases loaded:', purchases.value.length)
    console.log('Debug - First purchase package data:', purchases.value[0].package)
    console.log('Debug - file_storage_limit value:', purchases.value[0].package?.file_storage_limit)
    console.log('Debug - package keys:', Object.keys(purchases.value[0].package || {}))
  }
}

const applyFilters = () => {
  pagination.value.page = 1
  fetchPurchases(getFilterParams())
}

const clearFilters = () => {
  filters.status = ''
  filters.user_id = ''
  filters.package_id = ''
  applyFilters()
}

const getFilterParams = () => {
  const params = { page: pagination.value.page }
  if (filters.status) params.status = filters.status
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

const activatePackage = async (purchaseId) => {
  activating.value = purchaseId
  try {
    await activatePackageForTenant(purchaseId)
    toast.success('Kích hoạt gói dịch vụ thành công!')
    await refreshData()
  } catch (error) {
    console.error('Error activating package:', error)
    toast.error('Có lỗi xảy ra khi kích hoạt gói dịch vụ')
  } finally {
    activating.value = null
  }
}

const goToShop = () => {
  window.location.href = '/shop'
}

// Lifecycle
onMounted(async () => {
  await refreshData()
})
</script> 