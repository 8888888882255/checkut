<template>
  <div class="tw-p-6 tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900">
    <h1 class="tw-text-3xl tw-font-semibold tw-mb-6 tw-text-gray-800 dark:tw-text-white">Quản lý Tenant</h1>

    <!-- Thanh điều hướng -->
    <div class="tw-flex tw-gap-4 tw-mb-6">
      <button
        @click="currentTab = 'list'"
        :class="{
          'tw-bg-[#086df9] tw-text-white': currentTab === 'list',
          'tw-bg-gray-200 tw-text-gray-700 dark:tw-bg-gray-700 dark:tw-text-gray-300': currentTab !== 'list'
        }"
        class="tw-px-5 tw-py-2 tw-rounded-lg tw-font-medium tw-transition tw-duration-300 hover:tw-bg-blue-600 hover:tw-text-white tw-flex tw-items-center tw-gap-2"
      >
        <List class="tw-w-5 tw-h-5" /> Danh sách Tenant
      </button>

      <button
        @click="currentTab = 'restore'"
        :class="{
          'tw-bg-[#086df9] tw-text-white': currentTab === 'restore',
          'tw-bg-gray-200 tw-text-gray-700 dark:tw-bg-gray-700 dark:tw-text-gray-300': currentTab !== 'restore'
        }"
        class="tw-px-5 tw-py-2 tw-rounded-lg tw-font-medium tw-transition tw-duration-300 hover:tw-bg-blue-600 hover:tw-text-white tw-flex tw-items-center tw-gap-2"
      >
        <Recycle class="tw-w-5 tw-h-5" /> Khôi phục
      </button>
    </div>

    <!-- Tìm kiếm và bộ lọc -->
    <div class="tw-mb-6 tw-flex tw-gap-4 tw-items-center">
      <!-- Tìm kiếm -->
      <div class="tw-relative tw-w-full tw-max-w-md">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm kiếm..."
          class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white dark:tw-placeholder-gray-400"
          @input="filterTenants"
        />
        <span class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400">
          <Search class="tw-w-5 tw-h-5" />
        </span>
      </div>

      <!-- Bộ lọc trạng thái -->
      <select
        v-model="statusFilter"
        class="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
        @change="filterTenants"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Tạm dừng</option>
      </select>
    </div>

    <!-- Danh sách Tenant và Thống kê -->
    <div v-for="tenant in paginatedTenants" :key="tenant.tenant_id" class="tw-mb-8">
      <!-- Header Tenant với thông tin cơ bản -->
      <div class="tw-bg-gradient-to-r tw-from-blue-600 tw-to-blue-700 tw-rounded-t-xl tw-p-6 tw-text-white">
        <div class="tw-flex tw-justify-between tw-items-center">
          <div class="tw-flex tw-items-center tw-gap-4">
            <div class="tw-w-12 tw-h-12 tw-bg-white tw-bg-opacity-20 tw-rounded-full tw-flex tw-items-center tw-justify-center">
              <Building class="tw-w-6 tw-h-6 tw-text-white" />
            </div>
            <div>
              <h3 class="tw-text-xl tw-font-bold">{{ tenant.name }}</h3>
              <p class="tw-text-blue-100 tw-text-sm">{{ tenant.adminUser?.email || '—' }}</p>
              <p class="tw-text-blue-100 tw-text-xs">ID: {{ tenant.tenant_id }} • Tạo: {{ new Date(tenant.created_at || '').toLocaleDateString('vi-VN') }}</p>
            </div>
          </div>
          <div class="tw-flex tw-items-center tw-gap-4">
            <span
              :class="[
                'tw-inline-block tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full',
                tenant.status === 'active' ? 'tw-bg-green-500 tw-text-white' :
                tenant.status === 'inactive' ? 'tw-bg-yellow-500 tw-text-white' :
                'tw-bg-red-500 tw-text-white'
              ]"
            >
              {{ tenant.status === 'active' ? 'Hoạt động' : tenant.status === 'inactive' ? 'Tạm dừng' : 'Đã xóa' }}
            </span>
            <div class="tw-flex tw-gap-2">
              <button @click="openModal('view', tenant)" class="tw-text-white hover:tw-bg-white hover:tw-bg-opacity-20 tw-p-2 tw-rounded-lg tw-transition">
                <Eye class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'list'" @click="openModal('edit', tenant)" class="tw-text-white hover:tw-bg-white hover:tw-bg-opacity-20 tw-p-2 tw-rounded-lg tw-transition">
                <Edit class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'list'" @click="moveToTrash(tenant)" class="tw-text-white hover:tw-bg-red-500 tw-p-2 tw-rounded-lg tw-transition">
                <Trash2 class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'restore'" @click="restoreTenant(tenant)" class="tw-text-white hover:tw-bg-white hover:tw-bg-opacity-20 tw-p-2 tw-rounded-lg tw-transition">
                <RefreshCcw class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'restore'" @click="permanentlyDelete(tenant)" class="tw-text-white hover:tw-bg-red-500 tw-p-2 tw-rounded-lg tw-transition">
                <Trash2 class="tw-w-5 tw-h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Container cho tất cả thống kê -->
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-b-xl tw-shadow-lg tw-overflow-hidden">
        
        <!-- Thống kê người dùng cơ bản -->
        <div class="tw-p-6 tw-border-b tw-border-gray-200 dark:tw-border-gray-700">
          <h4 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-gray-800 dark:tw-text-white tw-flex tw-items-center">
            <Users class="tw-w-5 tw-h-5 tw-mr-2 tw-text-blue-600" />
            Thống kê Người dùng
          </h4>
          <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
            <div class="tw-bg-blue-50 dark:tw-bg-blue-900 tw-rounded-lg tw-p-4 tw-text-center">
              <div class="tw-text-2xl tw-font-bold tw-text-blue-600 dark:tw-text-blue-400">
                {{ tenantStats[tenant.tenant_id]?.totalUsers || 0 }}
              </div>
              <div class="tw-text-sm tw-text-blue-600 dark:tw-text-blue-400 tw-mt-1">Tổng người dùng</div>
            </div>
            <div class="tw-bg-green-50 dark:tw-bg-green-900 tw-rounded-lg tw-p-4 tw-text-center">
              <div class="tw-text-2xl tw-font-bold tw-text-green-600 dark:tw-text-green-400">
                {{ tenantStats[tenant.tenant_id]?.recentUsers || 0 }}
              </div>
              <div class="tw-text-sm tw-text-green-600 dark:tw-text-green-400 tw-mt-1">Mới (7 ngày)</div>
            </div>
            <div class="tw-bg-purple-50 dark:tw-bg-purple-900 tw-rounded-lg tw-p-4 tw-text-center">
              <div class="tw-text-sm tw-text-purple-600 dark:tw-text-purple-400 tw-font-medium">Vai trò</div>
              <div class="tw-mt-1 tw-space-y-1">
                <div v-for="(count, role) in tenantStats[tenant.tenant_id]?.usersByRole || {}" :key="role" class="tw-flex tw-justify-between tw-text-xs">
                  <span class="tw-text-purple-600 dark:tw-text-purple-400">{{ formatRole(role) }}</span>
                  <span class="tw-font-bold tw-text-purple-700 dark:tw-text-purple-300">{{ count }}</span>
                </div>
              </div>
            </div>
            <div class="tw-bg-yellow-50 dark:tw-bg-yellow-900 tw-rounded-lg tw-p-4 tw-text-center">
              <div class="tw-text-sm tw-text-yellow-600 dark:tw-text-yellow-400 tw-font-medium">Trạng thái</div>
              <div class="tw-mt-1 tw-space-y-1">
                <div v-for="(count, status) in tenantStats[tenant.tenant_id]?.usersByStatus || {}" :key="status" class="tw-flex tw-justify-between tw-text-xs">
                  <span class="tw-text-yellow-600 dark:tw-text-yellow-400">{{ formatStatus(status) }}</span>
                  <span class="tw-font-bold tw-text-yellow-700 dark:tw-text-yellow-300">{{ count }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Thống kê dung lượng -->
        <div v-if="tenantStats[tenant.tenant_id]?.totalUsage" class="tw-p-6 tw-border-b tw-border-gray-200 dark:tw-border-gray-700">
          <h4 class="tw-text-lg tw-font-semibold tw-mb-4 tw-text-gray-800 dark:tw-text-white tw-flex tw-items-center">
            <HardDrive class="tw-w-5 tw-h-5 tw-mr-2 tw-text-green-600" />
            Thống kê Tài nguyên
          </h4>
          <div class="tw-grid tw-grid-cols-2 md:tw-grid-cols-4 tw-gap-4">
            <div class="tw-bg-gradient-to-br tw-from-blue-500 tw-to-blue-600 tw-rounded-lg tw-p-4 tw-text-white tw-text-center">
              <HardDrive class="tw-w-8 tw-h-8 tw-mx-auto tw-mb-2 tw-opacity-80" />
              <div class="tw-text-lg tw-font-bold">
                {{ formatFileSize(tenantStats[tenant.tenant_id]?.totalUsage?.file_size || 0) }}
              </div>
              <div class="tw-text-sm tw-opacity-90">Dung lượng</div>
            </div>
            <div class="tw-bg-gradient-to-br tw-from-purple-500 tw-to-purple-600 tw-rounded-lg tw-p-4 tw-text-white tw-text-center">
              <Wifi class="tw-w-8 tw-h-8 tw-mx-auto tw-mb-2 tw-opacity-80" />
              <div class="tw-text-lg tw-font-bold">
                {{ formatFileSize(tenantStats[tenant.tenant_id]?.totalUsage?.bandwidth_used || 0) }}
              </div>
              <div class="tw-text-sm tw-opacity-90">Băng thông</div>
            </div>
            <div class="tw-bg-gradient-to-br tw-from-orange-500 tw-to-orange-600 tw-rounded-lg tw-p-4 tw-text-white tw-text-center">
              <Database class="tw-w-8 tw-h-8 tw-mx-auto tw-mb-2 tw-opacity-80" />
              <div class="tw-text-lg tw-font-bold">
                {{ formatFileSize(tenantStats[tenant.tenant_id]?.totalUsage?.database_used || 0) }}
              </div>
              <div class="tw-text-sm tw-opacity-90">Database</div>
            </div>
            <div class="tw-bg-gradient-to-br tw-from-indigo-500 tw-to-indigo-600 tw-rounded-lg tw-p-4 tw-text-white tw-text-center">
              <Zap class="tw-w-8 tw-h-8 tw-mx-auto tw-mb-2 tw-opacity-80" />
              <div class="tw-text-lg tw-font-bold">
                {{ (tenantStats[tenant.tenant_id]?.totalUsage?.api_calls_used || 0).toLocaleString() }}
              </div>
              <div class="tw-text-sm tw-opacity-90">API Calls</div>
            </div>
          </div>
        </div>

        <!-- Thống kê theo gói dịch vụ - Collapsible -->
        <div v-if="tenantStats[tenant.tenant_id]?.storageStatsByPackage?.length > 0" class="tw-border-b tw-border-gray-200 dark:tw-border-gray-700">
          <button 
            @click="togglePackageStats(tenant.tenant_id)"
            class="tw-w-full tw-p-6 tw-text-left hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition-colors"
          >
            <div class="tw-flex tw-items-center tw-justify-between">
              <h4 class="tw-text-lg tw-font-semibold tw-text-gray-800 dark:tw-text-white tw-flex tw-items-center">
                <BarChart3 class="tw-w-5 tw-h-5 tw-mr-2 tw-text-purple-600" />
                Chi tiết Gói dịch vụ ({{ tenantStats[tenant.tenant_id]?.storageStatsByPackage?.length }})
              </h4>
              <div class="tw-transform tw-transition-transform" :class="{ 'tw-rotate-180': expandedPackages[tenant.tenant_id] }">
                <ArrowRight class="tw-w-5 tw-h-5 tw-text-gray-400" />
              </div>
            </div>
          </button>
          
          <div v-if="expandedPackages[tenant.tenant_id]" class="tw-px-6 tw-pb-6">
            <div class="tw-grid tw-grid-cols-1 lg:tw-grid-cols-2 tw-gap-4">
              <div v-for="packageStat in tenantStats[tenant.tenant_id]?.storageStatsByPackage" :key="packageStat.package_id" 
                   class="tw-border tw-border-gray-200 dark:tw-border-gray-600 tw-rounded-lg tw-p-4 tw-bg-gray-50 dark:tw-bg-gray-700">
                
                <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
                  <h5 class="tw-font-semibold tw-text-gray-800 dark:tw-text-white tw-flex tw-items-center">
                    <Package class="tw-w-4 tw-h-4 tw-mr-2 tw-text-blue-600" />
                    {{ packageStat.package_name }}
                  </h5>
                  <span class="tw-text-sm tw-text-green-600 tw-font-medium">
                    {{ formatCurrency(packageStat.price) }}
                  </span>
                </div>
                
                <!-- Compact metrics grid -->
                <div class="tw-grid tw-grid-cols-2 tw-gap-3 tw-text-sm">
                  <div>
                    <div class="tw-text-gray-600 dark:tw-text-gray-400">Dung lượng</div>
                    <div class="tw-font-semibold tw-text-blue-600">{{ formatFileSize(packageStat.usage.file_size) }}</div>
                    <div class="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-1 tw-mt-1">
                      <div class="tw-bg-blue-500 tw-h-1 tw-rounded-full" 
                           :style="{ width: formatPercentage(packageStat.usage.file_size, packageStat.limits.file_storage_limit) + '%' }"></div>
                    </div>
                  </div>
                  <div>
                    <div class="tw-text-gray-600 dark:tw-text-gray-400">Băng thông</div>
                    <div class="tw-font-semibold tw-text-purple-600">{{ formatFileSize(packageStat.usage.bandwidth_used) }}</div>
                    <div class="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-1 tw-mt-1">
                      <div class="tw-bg-purple-500 tw-h-1 tw-rounded-full" 
                           :style="{ width: formatPercentage(packageStat.usage.bandwidth_used, packageStat.limits.bandwidth_limit) + '%' }"></div>
                    </div>
                  </div>
                  <div>
                    <div class="tw-text-gray-600 dark:tw-text-gray-400">Database</div>
                    <div class="tw-font-semibold tw-text-orange-600">{{ formatFileSize(packageStat.usage.database_used) }}</div>
                    <div class="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-1 tw-mt-1">
                      <div class="tw-bg-orange-500 tw-h-1 tw-rounded-full" 
                           :style="{ width: formatPercentage(packageStat.usage.database_used, packageStat.limits.database_limit) + '%' }"></div>
                    </div>
                  </div>
                  <div>
                    <div class="tw-text-gray-600 dark:tw-text-gray-400">API Calls</div>
                    <div class="tw-font-semibold tw-text-indigo-600">{{ packageStat.usage.api_calls_used.toLocaleString() }}</div>
                    <div class="tw-w-full tw-bg-gray-200 tw-rounded-full tw-h-1 tw-mt-1">
                      <div class="tw-bg-indigo-500 tw-h-1 tw-rounded-full" 
                           :style="{ width: formatPercentage(packageStat.usage.api_calls_used, packageStat.limits.api_call_limit) + '%' }"></div>
                    </div>
                  </div>
                </div>
                
                <div class="tw-text-xs tw-text-gray-500 dark:tw-text-gray-400 tw-mt-3 tw-text-center">
                  {{ packageStat.usage.total_records }} bản ghi
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gói dịch vụ đang hoạt động - Collapsible -->
        <div v-if="tenantStats[tenant.tenant_id]?.activePackages?.length > 0">
          <button 
            @click="toggleActivePackages(tenant.tenant_id)"
            class="tw-w-full tw-p-6 tw-text-left hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700 tw-transition-colors"
          >
            <div class="tw-flex tw-items-center tw-justify-between">
              <h4 class="tw-text-lg tw-font-semibold tw-text-gray-800 dark:tw-text-white tw-flex tw-items-center">
                <PieChart class="tw-w-5 tw-h-5 tw-mr-2 tw-text-green-600" />
                Gói đang hoạt động ({{ tenantStats[tenant.tenant_id]?.activePackages?.length }})
              </h4>
              <div class="tw-transform tw-transition-transform" :class="{ 'tw-rotate-180': expandedActivePackages[tenant.tenant_id] }">
                <ArrowRight class="tw-w-5 tw-h-5 tw-text-gray-400" />
              </div>
            </div>
          </button>
          
          <div v-if="expandedActivePackages[tenant.tenant_id]" class="tw-px-6 tw-pb-6">
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 lg:tw-grid-cols-3 tw-gap-4">
              <div v-for="pkg in tenantStats[tenant.tenant_id]?.activePackages" :key="pkg.purchase_id" 
                   class="tw-border tw-border-gray-200 dark:tw-border-gray-600 tw-rounded-lg tw-p-4 tw-bg-gradient-to-br tw-from-green-50 tw-to-green-100 dark:tw-from-green-900 dark:tw-to-green-800">
                <div class="tw-flex tw-items-center tw-mb-3">
                  <div class="tw-w-8 tw-h-8 tw-bg-green-500 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mr-3">
                    <span class="tw-text-white tw-font-bold tw-text-sm">{{ pkg.user_email.charAt(0).toUpperCase() }}</span>
                  </div>
                  <div class="tw-flex-1">
                    <div class="tw-font-semibold tw-text-gray-900 tw-text-sm">{{ pkg.package_name }}</div>
                    <div class="tw-text-xs tw-text-gray-600">{{ pkg.user_email }}</div>
                  </div>
                </div>
                
                <div class="tw-flex tw-justify-between tw-items-center tw-mb-2">
                  <span class="tw-text-xs tw-bg-green-200 tw-text-green-800 tw-px-2 tw-py-1 tw-rounded-full">
                    {{ formatRole(pkg.user_role) }}
                  </span>
                  <span class="tw-text-sm tw-font-bold tw-text-green-700">{{ formatCurrency(pkg.price) }}</span>
                </div>
                
                <div class="tw-text-xs tw-text-gray-600">
                  <div>{{ new Date(pkg.start_date).toLocaleDateString('vi-VN') }}</div>
                  <div v-if="pkg.end_date">đến {{ new Date(pkg.end_date).toLocaleDateString('vi-VN') }}</div>
                  <div v-else class="tw-text-green-600 tw-font-medium">Không giới hạn</div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Phân trang -->
    <div class="tw-mt-6 tw-flex tw-justify-between tw-items-center tw-text-gray-600 dark:tw-text-gray-300">
      <div class="tw-text-sm">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredTenants.length) }} của {{ filteredTenants.length }} tenant
      </div>
      <div class="tw-flex tw-gap-3">
        <button
          @click="currentPage = Math.max(currentPage - 1, 1)"
          :disabled="currentPage === 1"
          class="tw-px-4 tw-py-2 tw-rounded-lg tw-bg-[#086df9] tw-text-white disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed hover:tw-bg-blue-700 tw-transition"
        >
          <ArrowLeft class="tw-w-4 tw-h-4" />
        </button>
        <span class="tw-px-4 tw-py-2 tw-text-sm tw-font-medium dark:tw-text-white">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="currentPage = Math.min(currentPage + 1, totalPages)"
          :disabled="currentPage === totalPages"
          class="tw-px-4 tw-py-2 tw-rounded-lg tw-bg-[#086df9] tw-text-white disabled:tw-bg-gray-400 disabled:tw-cursor-not-allowed hover:tw-bg-blue-700 tw-transition"
        >
          <ArrowRight class="tw-w-4 tw-h-4" />
        </button>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="modal.open" class="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50" @click.self="closeModal">
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-2xl tw-w-full tw-max-w-lg tw-p-6 tw-relative tw-animate-fade-in">
        <button @click="closeModal" class="tw-absolute tw-top-3 tw-right-3 tw-text-gray-500 hover:tw-text-[#086df9] tw-transition">
          <X class="tw-w-6 tw-h-6" />
        </button>
        <h2 class="tw-text-2xl tw-font-semibold tw-mb-6 tw-text-gray-800 dark:tw-text-white tw-flex tw-items-center">
          <span class="tw-mr-3">
            <Info v-if="modal.mode === 'view'" class="tw-w-6 tw-h-6 tw-text-[#086df9]" />
            <Edit v-if="modal.mode === 'edit'" class="tw-w-6 tw-h-6 tw-text-[#086df9]" />
          </span>
          {{ modal.mode === 'view' ? 'Chi tiết Tenant' : 'Chỉnh sửa Tenant' }}
        </h2>

        <div class="tw-space-y-5">
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">ID</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Hash class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.tenant?.tenant_id"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Tên doanh nghiệp</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Building class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                :disabled="modal.mode !== 'edit'"
                v-model="modal.tenant.name"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Admin Email</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Mail class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.tenant?.adminUser?.email"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Ngày tạo</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Calendar class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="new Date(modal.tenant.created_at || '').toLocaleDateString('vi-VN')"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Trạng thái</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Activity class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <select
                v-model="modal.tenant.status"
                :disabled="modal.mode !== 'edit'"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="deleted">Đã xóa</option>
              </select>
            </div>
          </div>
        </div>

        <div class="tw-flex tw-justify-end tw-mt-6 tw-gap-3">
          <button
            @click="closeModal"
            class="tw-px-4 tw-py-2 tw-bg-gray-200 tw-text-gray-700 tw-rounded-lg tw-font-medium hover:tw-bg-gray-300 tw-transition tw-flex tw-items-center"
          >
            <X class="tw-w-4 tw-h-4 tw-mr-2" /> Đóng
          </button>
          <button
            v-if="modal.mode === 'edit'"
            @click="updateTenant"
            class="tw-px-4 tw-py-2 tw-bg-[#086df9] tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-blue-700 tw-transition tw-flex tw-items-center"
          >
            <Save class="tw-w-4 tw-h-4 tw-mr-2" /> Lưu
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import Swal from 'sweetalert2'
import {
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Info,
  Hash,
  Building,
  Mail,
  Calendar,
  Activity,
  X,
  Save,
  RefreshCcw,
  Search,
  List,
  Recycle,
  Users,
  UserPlus,
  UserCog,
  HardDrive,
  Wifi,
  Database,
  Zap,
  Package,
  DollarSign,
  BarChart3,
  PieChart
} from 'lucide-vue-next'

interface AdminUser {
  user_id: number
  email: string
}

interface Tenant {
  tenant_id: number
  name: string
  status: 'active' | 'inactive' | 'deleted'
  adminUser?: AdminUser
  created_at?: string
}

interface UserStatistics {
  totalUsers: number;
  usersByRole: Record<string, number>;
  usersByStatus: Record<string, number>;
  recentUsers: number;
  storageStatsByPackage: Array<{
    package_id: number;
    package_name: string;
    usage: {
      file_size: number;
      bandwidth_used: number;
      database_used: number;
      api_calls_used: number;
      total_records: number;
    };
    limits: {
      file_storage_limit: number;
      bandwidth_limit: number;
      database_limit: number;
      api_call_limit: number;
    };
    price: number;
  }>;
  totalUsage: {
    file_size: number;
    bandwidth_used: number;
    database_used: number;
    api_calls_used: number;
  };
  activePackages: Array<{
    purchase_id: number;
    package_id: number;
    package_name: string;
    user_email: string;
    user_role: string;
    start_date: string;
    end_date: string;
    status: string;
    limits: {
      file_storage_limit: number;
      bandwidth_limit: number;
      database_limit: number;
      api_call_limit: number;
    };
    price: number;
  }>;
}

const tenants = ref<Tenant[]>([])
const tenantStats = ref<Record<number, UserStatistics>>({})
const expandedPackages = ref<Record<number, boolean>>({})
const expandedActivePackages = ref<Record<number, boolean>>({})
const modal = ref<{ open: boolean; mode: 'view' | 'edit'; tenant: Tenant }>({
  open: false,
  mode: 'view',
  tenant: {} as Tenant,
})
const currentPage = ref(1)
const itemsPerPage = 20
const currentTab = ref('list')
const searchQuery = ref('')
const statusFilter = ref('')

// Get current user info
const getCurrentUser = () => {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

const currentUser = getCurrentUser()

const filteredTenants = computed(() => {
  let result = tenants.value
  
  // If user is tenant_admin, only show their own tenant
  if (currentUser?.role === 'tenant_admin') {
    result = result.filter(t => t.tenant_id === currentUser.tenant_id)
  }
  
  if (currentTab.value === 'list') {
    result = result.filter(t => t.status === 'active' || t.status === 'inactive')
  } else {
    result = result.filter(t => t.status === 'deleted')
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(t => 
      t.name.toLowerCase().includes(query) || 
      (t.adminUser?.email?.toLowerCase() || '').includes(query)
    )
  }
  if (statusFilter.value && statusFilter.value !== '') {
    result = result.filter(t => t.status === statusFilter.value)
  }
  return result
})

// Check if current user can edit/delete tenants
const canManageTenants = computed(() => {
  return currentUser?.role === 'global_admin'
})

// Check if current user can see restore tab
const canAccessRestoreTab = computed(() => {
  return currentUser?.role === 'global_admin'
})

const sortedTenants = computed(() =>
  [...filteredTenants.value].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime()
    const dateB = new Date(b.created_at || '').getTime()
    return dateB - dateA
  })
)

const totalPages = computed(() => Math.ceil(sortedTenants.value.length / itemsPerPage))
const paginatedTenants = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedTenants.value.slice(start, end)
})

const formatRole = (role: string) => {
  const roleMap: Record<string, string> = {
    'tenant_admin': 'Quản trị viên',
    'tenant_user': 'Người dùng',
    'tenant_staff': 'Nhân viên',
    'tenant_manager': 'Quản lý'
  };
  return roleMap[role] || role;
};

const formatStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    'active': 'Hoạt động',
    'inactive': 'Tạm dừng',
    'deleted': 'Đã xóa'
  };
  return statusMap[status] || status;
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatPercentage = (used: number, limit: number): number => {
  if (limit === 0) return 0;
  return Math.min((used / limit) * 100, 100);
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

const togglePackageStats = (tenantId: number) => {
  expandedPackages.value[tenantId] = !expandedPackages.value[tenantId]
}

const toggleActivePackages = (tenantId: number) => {
  expandedActivePackages.value[tenantId] = !expandedActivePackages.value[tenantId]
}

const fetchUserStatistics = async (tenantId: number) => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/extended-statistics/${tenantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Lỗi khi lấy thống kê người dùng');
    }

    const data = await res.json();
    tenantStats.value[tenantId] = data;
  } catch (error) {
    console.error('Lỗi khi lấy thống kê:', error);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể lấy thống kê người dùng!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    });
  }
};

const openModal = async (mode: 'view' | 'edit', tenant: Tenant) => {
  modal.value = { open: true, mode, tenant: { ...tenant } };
  if (mode === 'view') {
    await fetchUserStatistics(tenant.tenant_id);
  }
};

const closeModal = () => {
  modal.value.open = false;
};

const fetchTenants = async () => {
  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }
    
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) throw new Error('Lỗi khi gọi API');
    const data = await res.json();
    tenants.value = data;

    // Fetch statistics for each tenant
    for (const tenant of data) {
      await fetchUserStatistics(tenant.tenant_id);
    }
  } catch (err) {
    console.error('Lỗi khi tải tenants:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể tải danh sách tenant!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    });
  }
}

const updateTenant = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${modal.value.tenant.tenant_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modal.value.tenant),
    })
    if (!res.ok) throw new Error('Lỗi khi cập nhật')
    await fetchTenants()
    closeModal()
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Cập nhật tenant thành công!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    })
  } catch (err) {
    console.error('Lỗi cập nhật:', err)
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể cập nhật tenant!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    })
  }
}

const moveToTrash = async (tenant: Tenant) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn chuyển tenant ${tenant.name} vào thùng rác?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#086519',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Chuyển',
    cancelButtonText: 'Hủy',
    showCloseButton: true,
  })
  if (result.isConfirmed) {
    try {
      const updatedTenant = { ...tenant, status: 'deleted' }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${tenant.tenant_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTenant),
      })
      if (!res.ok) throw new Error('Lỗi khi cập nhật')
      await fetchTenants()
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Tenant đã được chuyển vào thùng rác!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể chuyển tenant!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const restoreTenant = async (tenant: Tenant) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn khôi phục tenant ${tenant.name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Khôi phục',
    cancelButtonText: 'Hủy',
    showCloseButton: true,
  })
  if (result.isConfirmed) {
    try {
      const updatedTenant = { ...tenant, status: 'active' }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${tenant.tenant_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedTenant),
      })
      if (!res.ok) throw new Error('Lỗi khi cập nhật')
      await fetchTenants()
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Tenant đã được khôi phục!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể khôi phục tenant!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const permanentlyDelete = async (tenant: Tenant) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa vĩnh viễn',
    text: `Bạn có chắc muốn xóa vĩnh viễn tenant ${tenant.name}? Hành động này không thể hoàn tác.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa vĩnh viễn',
    cancelButtonText: 'Hủy',
    showCloseButton: true,
  })
  if (result.isConfirmed) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/tenants/${tenant.tenant_id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Lỗi xóa')
      await fetchTenants()
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa',
        text: 'Tenant đã được xóa vĩnh viễn!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err) {
      console.error('Lỗi xóa:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xóa tenant!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const filterTenants = () => {
  currentPage.value = 1
}

onMounted(() => {
  fetchTenants()
})
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}

input:focus,
select:focus {
  outline: none;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>