<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="px-4 py-6 sm:px-0">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Quản lý Dữ liệu Dịch vụ</h1>
            <p class="mt-2 text-gray-600">Theo dõi và quản lý dữ liệu sử dụng dịch vụ của doanh nghiệp</p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="debugServiceData"
              :disabled="debugging"
              class="inline-flex items-center px-4 py-2 border border-blue-300 rounded-md shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <svg v-if="debugging" class="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {{ debugging ? 'Đang debug...' : 'Debug Service Data' }}
            </button>
            <button
              @click="checkActivationStatus"
              :disabled="checkingActivation"
              class="inline-flex items-center px-4 py-2 border border-green-300 rounded-md shadow-sm text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              <svg v-if="checkingActivation" class="animate-spin -ml-1 mr-2 h-4 w-4 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              {{ checkingActivation ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái dịch vụ' }}
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

      <!-- Activation Status Alert -->
      <div v-if="activationStatus" class="px-4 sm:px-0 mb-6">
        <div v-if="activationStatus.isActivated" class="bg-green-50 border border-green-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-sm font-semibold text-green-800">Dịch vụ đã được kích hoạt</h3>
              <p class="text-sm text-green-700 mt-1">
                <span v-if="getStoredUser()?.role === 'tenant_admin'">
                  ✅ Bạn đã mua gói dịch vụ và kích hoạt cho toàn bộ tenant
                </span>
                <span v-else>
                  ✅ Tenant Admin đã mua gói dịch vụ và kích hoạt cho bạn
                </span>
                <br>
                <span class="font-medium">Gói:</span> {{ activationStatus.package?.name }} | 
                <span class="font-medium">Lưu trữ:</span> {{ formatFileSize(activationStatus.usage?.file_size || 0) }} / {{ formatFileSize(activationStatus.limits?.file_storage_limit || 0) }}
              </p>
            </div>
          </div>
        </div>
        <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <div>
              <h3 class="text-sm font-semibold text-yellow-800">Dịch vụ chưa được kích hoạt</h3>
              <p class="text-sm text-yellow-700 mt-1">
                <span v-if="getStoredUser()?.role === 'tenant_admin'">
                  {{ activationStatus.message || 'Vui lòng mua gói dịch vụ để kích hoạt tính năng upload file cho toàn bộ tenant.' }}
                </span>
                <span v-else>
                  {{ activationStatus.message || 'Tenant Admin chưa mua gói dịch vụ. Vui lòng liên hệ Tenant Admin để mua gói và kích hoạt tính năng upload file.' }}
                </span>
              </p>
              <button v-if="getStoredUser()?.role === 'tenant_admin'" @click="goToShop" class="mt-2 text-sm text-yellow-800 hover:text-yellow-900 underline">
                Mua gói dịch vụ ngay
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Debug Information -->
      <div v-if="debugInfo" class="px-4 sm:px-0 mb-6">
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-blue-800">Thông tin Debug</h3>
            <button @click="debugInfo = null" class="text-blue-600 hover:text-blue-800">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 text-sm">
            <!-- User Info -->
            <div>
              <h4 class="font-medium text-blue-800 mb-2">Thông tin User</h4>
              <div class="space-y-1 text-blue-700">
                <p><span class="font-medium">ID:</span> {{ debugInfo.user?.user_id }}</p>
                <p><span class="font-medium">Email:</span> {{ debugInfo.user?.email }}</p>
                <p><span class="font-medium">Role:</span> {{ debugInfo.user?.role }}</p>
                <p><span class="font-medium">Tenant ID:</span> {{ debugInfo.user?.tenant_id }}</p>
              </div>
            </div>

            <!-- Tenant Info -->
            <div>
              <h4 class="font-medium text-blue-800 mb-2">Thông tin Tenant</h4>
              <div class="space-y-1 text-blue-700">
                <p><span class="font-medium">ID:</span> {{ debugInfo.tenant?.tenant_id }}</p>
                <p><span class="font-medium">Name:</span> {{ debugInfo.tenant?.name }}</p>
              </div>
            </div>

            <!-- Service Data -->
            <div class="lg:col-span-2">
              <h4 class="font-medium text-blue-800 mb-2">Service Data ({{ debugInfo.serviceData?.length || 0 }})</h4>
              <div v-if="debugInfo.serviceData?.length > 0" class="space-y-2">
                <div v-for="sd in debugInfo.serviceData" :key="sd.data_id" class="bg-white rounded p-2 border">
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <p><span class="font-medium">Data ID:</span> {{ sd.data_id }}</p>
                    <p><span class="font-medium">Package ID:</span> {{ sd.package_id }}</p>
                    <p><span class="font-medium">Status:</span> 
                      <span :class="sd.status === 'active' ? 'text-green-600' : 'text-red-600'">
                        {{ sd.status }}
                      </span>
                    </p>
                    <p><span class="font-medium">File Size:</span> {{ formatFileSize(sd.file_size || 0) }}</p>
                    <p v-if="sd.package" class="col-span-2">
                      <span class="font-medium">Package:</span> {{ sd.package.name }} 
                      (Limit: {{ formatFileSize(sd.package.file_storage_limit || 0) }})
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-blue-600 italic">Không có service data nào</div>
            </div>

            <!-- Tenant Offered Packages -->
            <div class="lg:col-span-2">
              <h4 class="font-medium text-blue-800 mb-2">Tenant Offered Packages ({{ debugInfo.tenantOfferedPackages?.length || 0 }})</h4>
              <div v-if="debugInfo.tenantOfferedPackages?.length > 0" class="space-y-2">
                <div v-for="top in debugInfo.tenantOfferedPackages" :key="`${top.tenant_id}-${top.package_id}`" class="bg-white rounded p-2 border">
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <p><span class="font-medium">Package ID:</span> {{ top.package_id }}</p>
                    <p><span class="font-medium">Status:</span> 
                      <span :class="top.status === 'active' ? 'text-green-600' : 'text-red-600'">
                        {{ top.status }}
                      </span>
                    </p>
                    <p v-if="top.package" class="col-span-2">
                      <span class="font-medium">Package:</span> {{ top.package.name }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-blue-600 italic">Không có tenant offered packages nào</div>
            </div>

            <!-- User Purchases -->
            <div class="lg:col-span-2">
              <h4 class="font-medium text-blue-800 mb-2">User Purchases ({{ debugInfo.userPurchases?.length || 0 }})</h4>
              <div v-if="debugInfo.userPurchases?.length > 0" class="space-y-2">
                <div v-for="up in debugInfo.userPurchases" :key="up.purchase_id" class="bg-white rounded p-2 border">
                  <div class="grid grid-cols-2 gap-2 text-xs">
                    <p><span class="font-medium">Purchase ID:</span> {{ up.purchase_id }}</p>
                    <p><span class="font-medium">Package ID:</span> {{ up.package_id }}</p>
                    <p><span class="font-medium">Status:</span> 
                      <span :class="up.status === 'completed' ? 'text-green-600' : 'text-red-600'">
                        {{ up.status }}
                      </span>
                    </p>
                    <p><span class="font-medium">Date:</span> {{ new Date(up.purchase_date).toLocaleDateString() }}</p>
                    <p v-if="up.package" class="col-span-2">
                      <span class="font-medium">Package:</span> {{ up.package.name }}
                    </p>
                  </div>
                </div>
              </div>
              <div v-else class="text-blue-600 italic">Không có user purchases nào</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="px-4 sm:px-0">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm'
              ]"
            >
              {{ tab.name }}
            </button>
          </nav>
        </div>
      </div>

      <!-- Tab Content -->
      <div class="mt-6">
        <!-- Danh sách dữ liệu -->
        <div v-if="activeTab === 'list'" class="px-4 sm:px-0">
          <tableServiceData />
        </div>

        <!-- Upload File -->
        <div v-else-if="activeTab === 'upload'" class="px-4 sm:px-0">
          <div v-if="!activationStatus?.isActivated" class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <svg class="w-12 h-12 text-yellow-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">Dịch vụ chưa được kích hoạt</h3>
            <p class="text-yellow-700 mb-4">
              <span v-if="getStoredUser()?.role === 'tenant_admin'">
                Vui lòng mua gói dịch vụ để kích hoạt tính năng upload file cho toàn bộ tenant.
              </span>
              <span v-else>
                Tenant Admin chưa mua gói dịch vụ. Vui lòng liên hệ Tenant Admin để mua gói và kích hoạt tính năng upload file.
              </span>
            </p>
            <button v-if="getStoredUser()?.role === 'tenant_admin'" @click="goToShop" class="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors">
              Mua gói dịch vụ ngay
            </button>
          </div>
          <div v-else class="space-y-6">
            <div class="bg-green-50 border border-green-200 rounded-lg p-4">
              <div class="flex items-center">
                <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h3 class="text-sm font-semibold text-green-800">Dịch vụ đã được kích hoạt</h3>
                  <p class="text-sm text-green-700">
                    <span v-if="getStoredUser()?.role === 'tenant_admin'">
                      ✅ Bạn đã mua gói dịch vụ và kích hoạt cho toàn bộ tenant
                    </span>
                    <span v-else>
                      ✅ Tenant Admin đã mua gói dịch vụ và kích hoạt cho bạn
                    </span>
                    <br>
                    <span class="font-medium">Gói:</span> {{ activationStatus.package?.name }} | 
                    <span class="font-medium">Đã sử dụng:</span> {{ formatFileSize(activationStatus.usage?.file_size || 0) }} / 
                    {{ formatFileSize(activationStatus.limits?.file_storage_limit || 0) }}
                  </p>
                </div>
              </div>
            </div>
            
            <FileUpload
              :tenant-id="getStoredUser()?.tenant_id"
              :user-id="getStoredUser()?.user_id"
              :package-id="activationStatus.package?.package_id"
              @upload-success="handleUploadSuccess"
              @upload-error="handleUploadError"
            />
          </div>
        </div>

        <!-- Thống kê -->
        <div v-else-if="activeTab === 'stats'" class="px-4 sm:px-0">
          <!-- Thống kê tổng quan của Tenant (chỉ cho tenant_admin) -->
          <div v-if="getStoredUser()?.role === 'tenant_admin'" class="mb-8">
            <h3 class="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Thống kê Tổng quan Tenant
            </h3>
            
            <!-- Cards thống kê tổng quan -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-blue-100 text-sm">Tổng dung lượng</p>
                    <p class="text-2xl font-bold">{{ safeFormatFileSize(getTotalUsage().file_size) }}</p>
                  </div>
                  <svg class="w-8 h-8 text-blue-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"></path>
                  </svg>
                </div>
              </div>

              <div class="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-green-100 text-sm">Băng thông</p>
                    <p class="text-2xl font-bold">{{ safeFormatBandwidth(getTotalUsage().bandwidth_used) }}</p>
                  </div>
                  <svg class="w-8 h-8 text-green-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"></path>
                  </svg>
                </div>
              </div>

              <div class="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-purple-100 text-sm">Database</p>
                    <p class="text-2xl font-bold">{{ safeFormatFileSize(getTotalUsage().database_used) }}</p>
                  </div>
                  <svg class="w-8 h-8 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                </div>
              </div>

              <div class="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-orange-100 text-sm">API Calls</p>
                    <p class="text-2xl font-bold">{{ safeNumber(getTotalUsage().api_calls_used).toLocaleString() }}</p>
                  </div>
                  <svg class="w-8 h-8 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Grid layout cho thống kê -->
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Thống kê theo gói dịch vụ -->
            <div class="bg-white shadow-lg rounded-xl overflow-hidden">
              <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                  </svg>
                  Thống kê theo Gói dịch vụ
                </h3>
              </div>
              
              <div class="p-6">
                <div v-if="tenantStatsLoading" class="text-center py-8">
                  <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải thống kê...
                  </div>
                </div>
                
                <div v-else-if="tenantStatsError" class="text-center py-8">
                  <div class="text-red-600 mb-4">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ tenantStatsError }}
                  </div>
                  <button @click="loadTenantStats" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Thử lại
                  </button>
                </div>
                
                <div v-else-if="tenantStats.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <p class="text-lg">Chưa có dữ liệu sử dụng dịch vụ</p>
                  <p class="text-sm mt-2">Bắt đầu upload file để xem thống kê</p>
                </div>
                
                <div v-else class="space-y-6">
                  <div v-for="stat in tenantStats" :key="stat.package_id" class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <h4 class="font-semibold text-gray-900 text-lg flex items-center">
                          <span class="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                          {{ stat.package?.name }}
                        </h4>
                        <p class="text-sm text-gray-500 mt-1">{{ stat.total_records }} bản ghi • Giới hạn: {{ formatFileSize(stat.package?.file_storage_limit || 0) }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-lg font-bold text-gray-900">{{ safeFormatFileSize(stat.total_file_size) }}</p>
                        <p class="text-xs text-gray-500">Đã sử dụng</p>
                      </div>
                    </div>
                    
                    <!-- Progress bar cho dung lượng -->
                    <div class="mb-4">
                      <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Dung lượng lưu trữ</span>
                        <span>{{ getUsagePercentage(safeNumber(stat.total_file_size), safeNumber(stat.package?.file_storage_limit)).toFixed(1) }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                          :style="{ width: Math.min(getUsagePercentage(safeNumber(stat.total_file_size), safeNumber(stat.package?.file_storage_limit)), 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- Grid metrics -->
                    <div class="grid grid-cols-3 gap-4 mt-4">
                      <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 mb-1">Băng thông</p>
                        <p class="font-semibold text-sm text-gray-900">{{ safeFormatBandwidth(stat.total_bandwidth) }}</p>
                      </div>
                      <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 mb-1">Database</p>
                        <p class="font-semibold text-sm text-gray-900">{{ safeFormatFileSize(stat.total_database) }}</p>
                      </div>
                      <div class="text-center p-3 bg-gray-50 rounded-lg">
                        <p class="text-xs text-gray-500 mb-1">API Calls</p>
                        <p class="font-semibold text-sm text-gray-900">{{ safeNumber(stat.total_api_calls).toLocaleString() }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Thống kê theo người dùng -->
            <div class="bg-white shadow-lg rounded-xl overflow-hidden">
              <div class="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Thống kê của bạn
                </h3>
              </div>
              
              <div class="p-6">
                <div v-if="userStatsLoading" class="text-center py-8">
                  <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-green-600">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải thống kê...
                  </div>
                </div>
                
                <div v-else-if="userStatsError" class="text-center py-8">
                  <div class="text-red-600 mb-4">
                    <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    {{ userStatsError }}
                  </div>
                  <button @click="loadUserStats" class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Thử lại
                  </button>
                </div>
                
                <div v-else-if="userStats.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <p class="text-lg">Bạn chưa có dữ liệu sử dụng</p>
                  <p class="text-sm mt-2">Upload file đầu tiên của bạn để xem thống kê</p>
                </div>
                
                <div v-else class="space-y-6">
                  <div v-for="stat in userStats" :key="stat.package_id" class="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                    <div class="flex justify-between items-start mb-4">
                      <div>
                        <h4 class="font-semibold text-gray-900 text-lg flex items-center">
                          <span class="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                          {{ stat.package?.name }}
                        </h4>
                        <p class="text-sm text-gray-500 mt-1">{{ safeNumber(stat.total_records) }} bản ghi của bạn • Giới hạn: {{ safeFormatFileSize(stat.package?.file_storage_limit) }}</p>
                      </div>
                      <div class="text-right">
                        <p class="text-lg font-bold text-gray-900">{{ safeFormatFileSize(stat.total_file_size) }}</p>
                        <p class="text-xs text-gray-500">Bạn đã dùng</p>
                      </div>
                    </div>
                    
                    <!-- Progress bar cho dung lượng cá nhân -->
                    <div class="mb-4">
                      <div class="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Dung lượng của bạn</span>
                        <span>{{ getUsagePercentage(safeNumber(stat.total_file_size), safeNumber(stat.package?.file_storage_limit)).toFixed(1) }}%</span>
                      </div>
                      <div class="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          class="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full transition-all duration-300"
                          :style="{ width: Math.min(getUsagePercentage(safeNumber(stat.total_file_size), safeNumber(stat.package?.file_storage_limit)), 100) + '%' }"
                        ></div>
                      </div>
                    </div>
                    
                    <!-- Grid metrics cá nhân -->
                    <div class="grid grid-cols-3 gap-4 mt-4">
                      <div class="text-center p-3 bg-green-50 rounded-lg">
                        <p class="text-xs text-green-600 mb-1">Băng thông</p>
                        <p class="font-semibold text-sm text-gray-900">{{ safeFormatBandwidth(stat.total_bandwidth) }}</p>
                      </div>
                      <div class="text-center p-3 bg-green-50 rounded-lg">
                        <p class="text-xs text-green-600 mb-1">Database</p>
                        <p class="font-semibold text-sm text-gray-900">{{ safeFormatFileSize(stat.total_database) }}</p>
                      </div>
                      <div class="text-center p-3 bg-green-50 rounded-lg">
                        <p class="text-xs text-green-600 mb-1">API Calls</p>
                        <p class="font-semibold text-sm text-gray-900">{{ safeNumber(stat.total_api_calls).toLocaleString() }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Thống kê chi tiết theo tất cả người dùng trong tenant (chỉ cho tenant_admin) -->
          <div v-if="getStoredUser()?.role === 'tenant_admin'" class="mt-8">
            <div class="bg-white shadow-lg rounded-xl overflow-hidden">
              <div class="bg-gradient-to-r from-purple-600 to-purple-700 px-6 py-4">
                <h3 class="text-lg font-semibold text-white flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                  Thống kê tất cả người dùng trong Tenant
                </h3>
              </div>
              
              <div class="p-6">
                <div v-if="allUsersStatsLoading" class="text-center py-8">
                  <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-purple-600">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Đang tải thống kê người dùng...
                  </div>
                </div>
                
                <div v-else-if="allUsersStats.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                  </svg>
                  <p class="text-lg">Chưa có người dùng nào sử dụng dịch vụ</p>
                </div>
                
                <div v-else class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói dịch vụ</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dung lượng</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Băng thông</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Database</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Calls</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bản ghi</th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="userStat in allUsersStats" :key="`${userStat.user_id}-${userStat.package_id}`" class="hover:bg-gray-50">
                        <td class="px-6 py-4 whitespace-nowrap">
                          <div class="flex items-center">
                            <div class="flex-shrink-0 h-8 w-8">
                              <div class="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                                <span class="text-xs font-medium text-purple-800">{{ getUserInitials(userStat.user?.email) }}</span>
                              </div>
                            </div>
                            <div class="ml-3">
                              <div class="text-sm font-medium text-gray-900">{{ userStat.user?.email }}</div>
                              <div class="text-sm text-gray-500">{{ getRoleLabel(userStat.user?.role) }}</div>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                          <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {{ userStat.package?.name }}
                          </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ safeFormatFileSize(userStat.total_file_size) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ safeFormatBandwidth(userStat.total_bandwidth) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ safeFormatFileSize(userStat.total_database) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ safeNumber(userStat.total_api_calls).toLocaleString() }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {{ safeNumber(userStat.total_records) }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kiểm tra giới hạn -->
        <div v-else-if="activeTab === 'limits'" class="px-4 sm:px-0">
          <div class="bg-white shadow rounded-lg p-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Kiểm tra Giới hạn Sử dụng</h3>
            <form @submit.prevent="checkLimits" class="space-y-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
                  <select v-model="limitCheck.user_id" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Chọn người dùng</option>
                    <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                      {{ user.email }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Gói dịch vụ</label>
                  <select v-model="limitCheck.package_id" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Chọn gói dịch vụ</option>
                    <option v-for="pkg in packages" :key="pkg.package_id" :value="pkg.package_id">
                      {{ pkg.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Dung lượng cần thêm (bytes)</label>
                  <input
                    v-model="limitCheck.file_size"
                    type="number"
                    min="0"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="limitCheckLoading"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  <svg v-if="limitCheckLoading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Kiểm tra
                </button>
              </div>
            </form>

            <!-- Kết quả kiểm tra -->
            <div v-if="limitCheckResult" class="mt-6 border border-gray-200 rounded-lg p-4">
              <h4 class="font-medium text-gray-900 mb-3">Kết quả kiểm tra</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Gói dịch vụ</p>
                  <p class="font-medium">{{ limitCheckResult.package.name }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Giới hạn</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.package.file_storage_limit) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Đã sử dụng</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.usage.current) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Yêu cầu thêm</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.usage.requested) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Tổng cộng</p>
                  <p class="font-medium">{{ formatFileSize(limitCheckResult.usage.total) }}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Còn lại</p>
                  <p class="font-medium">{{ limitCheckResult.usage.remaining > 0 ? formatFileSize(limitCheckResult.usage.remaining) : 'Không giới hạn' }}</p>
                </div>
              </div>
              <div class="mt-4">
                <span :class="limitCheckResult.isWithinLimit ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-3 py-1 rounded-full text-sm font-medium">
                  {{ limitCheckResult.isWithinLimit ? '✓ Trong giới hạn' : '✗ Vượt quá giới hạn' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useServiceData } from '../composables/useServiceData'
import { useFileUpload } from '../composables/useFileUpload'
import tableServiceData from '../components/tableServiceData.vue'
import FileUpload from '../components/FileUpload.vue'
import axios from 'axios'

// Create axios client for additional API calls
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add token to axios requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

const {
  loading,
  fetchServiceData,
  fetchTenantStats,
  fetchUserStats,
  checkUsageLimits,
  checkTenantActivation,
  formatFileSize,
  formatBandwidth
} = useServiceData()

// State
const activeTab = ref('list')
const tenantStats = ref([])
const userStats = ref([])
const allUsersStats = ref([])
const tenantStatsLoading = ref(false)
const userStatsLoading = ref(false)
const allUsersStatsLoading = ref(false)
const tenantStatsError = ref(null)
const userStatsError = ref(null)
const limitCheckLoading = ref(false)
const limitCheckResult = ref(null)
const packages = ref([])
const users = ref([])
const activationStatus = ref(null)
const checkingActivation = ref(false)
const debugging = ref(false)
const debugInfo = ref(null)

// Tabs
const tabs = [
  { id: 'list', name: 'Danh sách dữ liệu' },
  { id: 'upload', name: 'Upload File' },
  { id: 'stats', name: 'Thống kê' },
  { id: 'limits', name: 'Kiểm tra giới hạn' }
]

// Limit check form
const limitCheck = reactive({
  user_id: '',
  package_id: '',
  file_size: 0
})

// Methods
const refreshData = async () => {
  if (activeTab.value === 'list') {
    await fetchServiceData()
  } else if (activeTab.value === 'stats') {
    await loadTenantStats()
    await loadUserStats()
    if (getStoredUser()?.role === 'tenant_admin') {
      await loadAllUsersStats()
    }
  }
}

const loadTenantStats = async () => {
  tenantStatsLoading.value = true
  tenantStatsError.value = null
  try {
    const data = await fetchTenantStats()
    tenantStats.value = data
  } catch (err) {
    tenantStatsError.value = err.message
  } finally {
    tenantStatsLoading.value = false
  }
}

const loadUserStats = async () => {
  userStatsLoading.value = true
  userStatsError.value = null
  try {
    const data = await fetchUserStats()
    userStats.value = data
  } catch (err) {
    userStatsError.value = err.message
  } finally {
    userStatsLoading.value = false
  }
}

const loadAllUsersStats = async () => {
  allUsersStatsLoading.value = true
  try {
    const user = getStoredUser()
    if (!user?.tenant_id) return
    
    // Gọi API để lấy tất cả service data trong tenant với thông tin user
    const response = await apiClient.get('/api/service-data', {
      params: { 
        limit: 1000,
        include_user: true 
      }
    })
    
    // Group by user_id và package_id để tính tổng
    const userStatsMap = new Map()
    
    if (response.data?.data) {
      response.data.data.forEach(item => {
        const key = `${item.user_id}-${item.package_id}`
        if (!userStatsMap.has(key)) {
          userStatsMap.set(key, {
            user_id: item.user_id,
            package_id: item.package_id,
            user: item.user,
            package: item.package,
            total_file_size: 0,
            total_bandwidth: 0,
            total_database: 0,
            total_api_calls: 0,
            total_records: 0
          })
        }
        
        const stats = userStatsMap.get(key)
        stats.total_file_size += safeNumber(item.file_size)
        stats.total_bandwidth += safeNumber(item.bandwidth_used)
        stats.total_database += safeNumber(item.database_used)
        stats.total_api_calls += safeNumber(item.api_calls_used)
        stats.total_records += 1
      })
    }
    
    allUsersStats.value = Array.from(userStatsMap.values())
  } catch (err) {
    console.error('Error loading all users stats:', err)
  } finally {
    allUsersStatsLoading.value = false
  }
}

const getTotalUsage = () => {
  if (!tenantStats.value.length) {
    return {
      file_size: 0,
      bandwidth_used: 0,
      database_used: 0,
      api_calls_used: 0
    }
  }
  
  return tenantStats.value.reduce((total, stat) => ({
    file_size: total.file_size + (parseInt(stat.total_file_size) || 0),
    bandwidth_used: total.bandwidth_used + (parseInt(stat.total_bandwidth) || 0),
    database_used: total.database_used + (parseInt(stat.total_database) || 0),
    api_calls_used: total.api_calls_used + (parseInt(stat.total_api_calls) || 0)
  }), {
    file_size: 0,
    bandwidth_used: 0,
    database_used: 0,
    api_calls_used: 0
  })
}

const getUsagePercentage = (used, limit) => {
  if (!limit || limit === 0 || !used) return 0
  return (used / limit) * 100
}

const getUserInitials = (email) => {
  if (!email) return '??'
  const parts = email.split('@')[0]
  return parts.length >= 2 ? parts.substring(0, 2).toUpperCase() : parts.charAt(0).toUpperCase()
}

const getRoleLabel = (role) => {
  const roleMap = {
    'tenant_admin': 'Admin',
    'tenant_user': 'User',
    'global_admin': 'Global Admin'
  }
  return roleMap[role] || role
}

// Helper function để đảm bảo giá trị numeric
const safeNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined || value === '' || value === 'undefined') {
    return defaultValue
  }
  const num = parseFloat(value)
  return isNaN(num) ? defaultValue : num
}

const safeFormatFileSize = (bytes) => {
  const safeBytes = safeNumber(bytes, 0)
  return formatFileSize(safeBytes)
}

const safeFormatBandwidth = (bytes) => {
  const safeBytes = safeNumber(bytes, 0)
  return formatBandwidth(safeBytes)
}

const checkLimits = async () => {
  limitCheckLoading.value = true
  limitCheckResult.value = null
  try {
    const result = await checkUsageLimits(limitCheck)
    limitCheckResult.value = result
  } catch (err) {
    console.error('Error checking limits:', err)
  } finally {
    limitCheckLoading.value = false
  }
}

const checkActivationStatus = async () => {
  checkingActivation.value = true
  try {
    const data = await checkTenantActivation()
    activationStatus.value = data
  } catch (err) {
    console.error('Error checking activation status:', err)
  } finally {
    checkingActivation.value = false
  }
}

const goToShop = () => {
  window.location.href = '/shop'
}

const getStoredUser = () => {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

const handleUploadSuccess = () => {
  // Refresh activation status to update usage
  checkActivationStatus()
}

const handleUploadError = (error) => {
  console.error('Upload error:', error)
}

const debugServiceData = async () => {
  debugging.value = true
  try {
    const user = getStoredUser()
    if (!user) {
      console.error('No user found')
      return
    }

    const { debugServiceData: debugAPI } = useFileUpload()
    const result = await debugAPI(user.tenant_id, user.user_id)
    debugInfo.value = result
    console.log('Debug info:', result)
  } catch (error) {
    console.error('Debug error:', error)
    // Hiển thị thông báo lỗi
  } finally {
    debugging.value = false
  }
}

// Watch for tab changes
watch(activeTab, (newTab) => {
  if (newTab === 'stats') {
    loadTenantStats()
    loadUserStats()
    if (getStoredUser()?.role === 'tenant_admin') {
      loadAllUsersStats()
    }
  }
})

// Load initial data
onMounted(async () => {
  // Kiểm tra token
  const token = localStorage.getItem('token') || sessionStorage.getItem('token')
  if (!token) {
    console.log('Không có token, redirect về login')
    window.location.href = '/login'
    return
  }
  
  console.log('Token found:', token ? 'Có token' : 'Không có token')
  
  // Kiểm tra trạng thái kích hoạt service data
  await checkActivationStatus()
  
  // TODO: Load packages and users data
  // This would typically come from other composables or API calls
})
</script> 