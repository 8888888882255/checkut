<template>
  <div class="tw-p-6">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4 dark:tw-text-white">Quản lý gói dịch vụ</h1>

    <!-- Loading overlay -->
    <div v-if="isLoading" class="tw-fixed tw-inset-0 tw-bg-black/30 tw-flex tw-items-center tw-justify-center tw-z-50">
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-p-4 tw-shadow-lg">
        <svg class="tw-animate-spin tw-h-8 tw-w-8 tw-text-[#086df9]" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="tw-opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="tw-opacity-75" fill="currentColor" d="0 0 0 0"></path>
        </svg>
      </div>
    </div>

    <!-- Thanh điều hướng và nút thêm -->
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
      <div class="tw-flex tw-gap-4">
        <button @click="currentTab = 'list'"
          :class="{ 'tw-bg-[#086df9] tw-text-white': currentTab === 'list', 'tw-bg-gray-200': currentTab !== 'list' }"
          class="tw-px-4 tw-py-2 tw-rounded">
          Danh sách gói dịch vụ
        </button>
        <button @click="currentTab = 'restore'"
          :class="{ 'tw-bg-[#086df9] tw-text-white': currentTab === 'restore', 'tw-bg-gray-200': currentTab !== 'restore' }"
          class="tw-px-4 tw-py-2 tw-rounded">
          Khôi phục
        </button>
      </div>
      <button v-if="isGlobalAdmin" @click="openCreateModal"
        class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded tw-flex tw-items-center hover:tw-bg-blue-700">
        <Plus class="tw-w-4 tw-h-4 tw-mr-2" /> Thêm gói dịch vụ
      </button>
    </div>

    <!-- Bảng hiển thị service packages -->
    <div class="tw-overflow-x-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow">
      <table class="tw-min-w-full tw-table-auto">
        <thead class="tw-bg-gray-100 dark:tw-bg-gray-700">
          <tr>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">ID</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Tên gói</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Danh mục</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Giá</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Loại gói</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Chu kỳ</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Giới hạn lưu trữ (bytes)">Lưu trữ (B)
            </th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Giới hạn băng thông (bytes)">Băng thông
              (B)</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Số lượng cơ sở dữ liệu">Cơ sở dữ liệu
            </th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white" title="Số lượng API Calls">API Calls</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Ngày tạo</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Trạng thái</th>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="servicePackage in paginatedServicePackages" :key="servicePackage.package_id"
            class="tw-border-b dark:tw-border-gray-700 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700">
            <td class="tw-px-4 tw-py-2 tw-text-center">{{ servicePackage.package_id }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.name }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.category_id ? categoriesMap[servicePackage.category_id]?.name
              || 'Chưa xác định' : '-' }}</td>
            <td class="tw-px-4 tw-py-2">${{ Math.floor(servicePackage.price) }}</td>
            <td class="tw-px-4 tw-py-2">
              {{ servicePackage.package_type === 'free' ? 'Free' :
                servicePackage.package_type === 'pro' ? 'Pro' :
                  servicePackage.package_type === 'vip_pro' ? 'VIP Pro' :
                    servicePackage.package_type === 'enterprise' ? 'Enterprise' : '' }}
            </td>
            <td class="tw-px-4 tw-py-2">
              {{ servicePackage.billing_cycle === 'monthly' ? 'Hàng tháng' :
                servicePackage.billing_cycle === 'quarterly' ? 'Hàng quý' :
                  servicePackage.billing_cycle === 'yearly' ? 'Hàng năm' :
                    servicePackage.billing_cycle === 'one-time' ? 'Một lần' :
                      servicePackage.billing_cycle === 'indefinite' ? 'Vô thời hạn' : '' }}
            </td>
            <td class="tw-px-4 tw-py-2">{{ formatBytes(servicePackage.file_storage_limit || 0) }}</td>
            <td class="tw-px-4 tw-py-2">{{ formatBytes(servicePackage.bandwidth_limit || 0) }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.database_limit || 0 }}</td>
            <td class="tw-px-4 tw-py-2">{{ servicePackage.api_call_limit || 0 }}</td>
            <td class="tw-px-4 tw-py-2">{{ formatDate(servicePackage.created_at) }}</td>
            <td class="tw-px-4 tw-py-2">
              <span :class="[
                'tw-inline-block tw-px-2 tw-py-1 tw-text-xs tw-rounded-full',
                servicePackage.status === 'active' ? 'tw-bg-green-100 tw-text-green-700' :
                  servicePackage.status === 'inactive' ? 'tw-bg-yellow-100 tw-text-yellow-700' :
                    'tw-bg-red-100 tw-text-red-700'
              ]">
                {{ servicePackage.status === 'active' ? 'Hoạt động' :
                  servicePackage.status === 'inactive' ? 'Tạm dừng' :
                    'Đã xóa' }}
              </span>
            </td>
            <td class="tw-px-4 tw-py-2 tw-text-center">
              <div class="tw-flex tw-justify-center tw-gap-2">
                <button @click="openModal('view', servicePackage)" class="tw-text-green-600 hover:tw-text-green-800"
                  title="Xem chi tiết">
                  <Eye class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'list'" @click="openModal('edit', servicePackage)"
                  class="tw-text-[#086df9] hover:tw-text-blue-800" title="Chỉnh sửa">
                  <Edit class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'list'" @click="moveToTrash(servicePackage)"
                  class="tw-text-red-600 hover:tw-text-red-800" title="Xóa vào thùng rác">
                  <Trash2 class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'restore'" @click="restoreServicePackage(servicePackage)"
                  class="tw-text-[#086df9] hover:tw-text-blue-800" title="Khôi phục">
                  <RefreshCcw class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'restore'" @click="permanentlyDelete(servicePackage)"
                  class="tw-text-red-600 hover:tw-text-red-800" title="Xóa vĩnh viễn">
                  <Trash2 class="tw-w-5 tw-h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="tw-mt-4 tw-flex tw-justify-between tw-items-center">
      <div class="tw-text-sm tw-text-gray-600 dark:tw-text-gray-300">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage,
          sortedServicePackages.length) }} của {{ sortedServicePackages.length }} gói dịch vụ
      </div>
      <div class="tw-flex tw-gap-2">
        <button @click="currentPage = Math.max(currentPage - 1, 1)" :disabled="currentPage === 1 || isLoading"
          class="tw-px-3 tw-py-1 tw-rounded tw-bg-[#086df9] tw-text-white disabled:tw-opacity-50 hover:tw-bg-blue-700">
          <ArrowLeft class="tw-w-4 tw-h-4" />
        </button>
        <span class="tw-px-3 tw-py-1 tw-text-sm dark:tw-text-white">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button @click="currentPage = Math.min(currentPage + 1, totalPages)"
          :disabled="currentPage === totalPages || isLoading"
          class="tw-px-3 tw-py-1 tw-rounded tw-bg-[#086df9] tw-text-white disabled:tw-opacity-50 hover:tw-bg-blue-700">
          <ArrowRight class="tw-w-4 tw-h-4" />
        </button>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="modal.open" class="tw-fixed tw-inset-0 tw-bg-black/30 tw-flex tw-items-center tw-justify-center tw-z-50"
      @click.self="closeModal">
      <div
        class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-lg tw-w-full tw-max-w-lg tw-p-6 tw-relative tw-max-h-[80vh] tw-overflow-y-auto">
        <button @click="closeModal" class="tw-absolute tw-top-2 tw-right-2 tw-text-[#086df9] hover:tw-text-blue-700"
          title="Đóng">
          <X class="tw-w-5 tw-h-5" />
        </button>
        <h2 class="tw-text-xl tw-font-bold tw-mb-4 dark:tw-text-white tw-flex tw-items-center">
          <span class="tw-mr-2">
            <Info v-if="modal.mode === 'view'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
            <Edit v-if="modal.mode === 'edit'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
            <Plus v-if="modal.mode === 'create'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
          </span>
          {{ modal.mode === 'view' ? 'Chi tiết gói dịch vụ' : modal.mode === 'edit' ? 'Chỉnh sửa gói dịch vụ' : 'Thêm gói dịch vụ' }}
        </h2>

        <form @submit.prevent="modal.mode === 'create' ? createServicePackage() : updateServicePackage()">
          <div class="tw-space-y-4">
            <div v-if="modal.mode !== 'create'" class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">ID</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Hash class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="text" disabled :value="modal.servicePackage?.package_id"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white" />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Tên gói <span
                  class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Building class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="text" :disabled="modal.mode === 'view' || isLoading" v-model="modal.servicePackage.name"
                  required maxlength="255"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.name }" />
                <p v-if="formErrors.name" class="tw-text-red-500 tw-text-xs tw-mt-1">{{ formErrors.name }}</p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Mô tả</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Info class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <textarea :disabled="modal.mode === 'view' || isLoading" v-model="modal.servicePackage.description"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"></textarea>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Danh mục</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Folder class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select v-model="modal.servicePackage.category_id" :disabled="modal.mode === 'view' || isLoading"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.category_id }">
                  <option value="">Chọn danh mục</option>
                  <option v-for="category in availableCategories" :key="category.category_id"
                    :value="category.category_id">
                    {{ category.name }}
                  </option>
                </select>
                <p v-if="formErrors.category_id" class="tw-text-red-500 tw-text-xs tw-mt-1">{{ formErrors.category_id }}
                </p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Loại gói <span
                  class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Package class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select v-model="modal.servicePackage.package_type" :disabled="modal.mode === 'view' || isLoading"
                  required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.package_type }">
                  <option value="free">Miễn phí</option>
                  <option value="pro">Pro</option>
                  <option value="vip_pro">VIP Pro</option>
                  <option value="enterprise">Doanh nghiệp</option>
                </select>
                <p v-if="formErrors.package_type" class="tw-text-red-500 tw-text-xs tw-mt-1">{{ formErrors.package_type
                  }}</p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giá (USD) <span
                  class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <DollarSign class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="number" step="0.01" min="0"
                  :disabled="modal.mode === 'view' || modal.servicePackage.package_type === 'free' || isLoading"
                  v-model="modal.servicePackage.price" required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.price }" />
                <p v-if="formErrors.price" class="tw-text-red-500 tw-text-xs tw-mt-1">{{ formErrors.price }}</p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Chu kỳ thanh toán <span
                  class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Clock class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select v-model="modal.servicePackage.billing_cycle" :disabled="modal.mode === 'view' || isLoading"
                  required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.billing_cycle }">
                  <option value="monthly">Hàng tháng</option>
                  <option value="quarterly">Hàng quý</option>
                  <option value="yearly">Hàng năm</option>
                  <option value="one-time">Một lần</option>
                  <option value="indefinite">Vô thời hạn</option>
                </select>
                <p v-if="formErrors.billing_cycle" class="tw-text-red-500 tw-text-xs tw-mt-1">{{
                  formErrors.billing_cycle }}</p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn lưu trữ
                (B)</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <HardDrive class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="number" min="0" step="1" :disabled="modal.mode === 'view' || isLoading"
                  v-model="modal.servicePackage.file_storage_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.file_storage_limit }" />
                <p v-if="formErrors.file_storage_limit" class="tw-text-red-500 tw-text-xs tw-mt-1">{{
                  formErrors.file_storage_limit }}</p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn băng thông
                (B)</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Network class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="number" min="0" step="1" :disabled="modal.mode === 'view' || isLoading"
                  v-model="modal.servicePackage.bandwidth_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.bandwidth_limit }" />
                <p v-if="formErrors.bandwidth_limit" class="tw-text-red-500 tw-text-xs tw-mt-1">{{
                  formErrors.bandwidth_limit }}</p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn cơ sở dữ
                liệu</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Database class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="number" min="0" step="1" :disabled="modal.mode === 'view' || isLoading"
                  v-model="modal.servicePackage.database_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.database_limit }" />
                <p v-if="formErrors.database_limit" class="tw-text-red-500 tw-text-xs tw-mt-1">{{
                  formErrors.database_limit }}</p>
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Giới hạn API
                Calls</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Code class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="number" min="0" step="1" :disabled="modal.mode === 'view' || isLoading"
                  v-model="modal.servicePackage.api_call_limit"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.api_call_limit }" />
                <p v-if="formErrors.api_call_limit" class="tw-text-red-500 tw-text-xs tw-mt-1">{{
                  formErrors.api_call_limit }}</p>
              </div>
            </div>
            <div class="tw-relative" v-if="modal.mode !== 'create'">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Ngày tạo</label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Calendar class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <input type="text" disabled :value="formatDate(modal.servicePackage.created_at)"
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white" />
              </div>
            </div>
            <div class="tw-relative">
              <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Trạng thái <span
                  class="tw-text-red-500">*</span></label>
              <div class="tw-relative">
                <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                  <Activity class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
                </span>
                <select v-model="modal.servicePackage.status" :disabled="modal.mode === 'view' || isLoading" required
                  class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
                  :class="{ 'tw-border-red-500': formErrors.status }">
                  <option value="active">Hoạt động</option>
                  <option value="inactive">Tạm dừng</option>
                  <option value="deleted">Đã xóa</option>
                </select>
                <p v-if="formErrors.status" class="tw-text-red-500 tw-text-xs tw-mt-1">{{ formErrors.status }}</p>
              </div>
            </div>
          </div>

          <div class="tw-flex tw-justify-end tw-mt-6 tw-gap-2">
            <button type="button" @click="closeModal" :disabled="isLoading"
              class="tw-bg-gray-200 dark:tw-bg-gray-600 tw-text-gray-800 dark:tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-gray-300 dark:hover:tw-bg-gray-500 tw-flex tw-items-center">
              <X class="tw-w-4 tw-h-4 tw-mr-1" /> Đóng
            </button>
            <button v-if="modal.mode === 'edit'" type="submit" :disabled="isLoading"
              class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-800 tw-flex tw-items-center">
              <Save class="tw-w-4 tw-h-4 tw-mr-1" /> Lưu
            </button>
            <button v-if="modal.mode === 'create'" type="submit" :disabled="isLoading"
              class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-800 tw-flex tw-items-center">
              <Plus class="tw-w-4 tw-h-4 tw-mr-1" /> Tạo
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import Swal from 'sweetalert2';
import {
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Info,
  Hash,
  Building,
  Calendar,
  Activity,
  X,
  Save,
  RefreshCcw,
  DollarSign,
  Package,
  HardDrive,
  Plus,
  Clock,
  Folder,
  Network,
  Database,
  Code,
} from 'lucide-vue-next';

interface ServicePackage {
  package_id?: number;
  name: string;
  description?: string;
  price: number;
  package_type: 'free' | 'pro' | 'vip_pro' | 'enterprise';
  file_storage_limit?: number;
  bandwidth_limit?: number;
  database_limit?: number;
  api_call_limit?: number;
  start_date?: string | null;
  end_date?: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at?: string;
  billing_cycle?: 'monthly' | 'quarterly' | 'yearly' | 'one-time' | 'indefinite';
  category_id?: number | null;
}

interface Category {
  category_id: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'deleted';
  parent_id?: number;
  created_at?: string;
}

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  package_type?: string;
  billing_cycle?: string;
  file_storage_limit?: string;
  bandwidth_limit?: string;
  database_limit?: string;
  api_call_limit?: string;
  category_id?: string;
  status?: string;
}

const servicePackages = ref<ServicePackage[]>([]);
const categories = ref<Category[]>([]);
const modal = ref<{ open: boolean; mode: 'view' | 'edit' | 'create'; servicePackage: ServicePackage }>({
  open: false,
  mode: 'view',
  servicePackage: {} as ServicePackage,
});
const currentPage = ref(1);
const itemsPerPage = 20;
const currentTab = ref('list');
const isLoading = ref(false);
const formErrors = ref<FormErrors>({});

// Lấy role từ localStorage/sessionStorage
const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
const isGlobalAdmin = computed(() => user && user.role === 'global_admin');

// Map categories to quickly look up names by ID
const categoriesMap = computed(() => {
  return categories.value.reduce((map, cat) => {
    map[cat.category_id] = cat;
    return map;
  }, {} as { [key: number]: Category });
});

const availableCategories = computed(() => categories.value.filter(c => c.status !== 'deleted'));

// Format date function
const formatDate = (dateStr?: string): string => {
  if (!dateStr || dateStr === '') return '-';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('vi-VN');
};

// Format bytes to display only in bytes
const formatBytes = (bytes: number): string => {
  return `${bytes.toFixed(0)} B`;
};

// Lọc service packages dựa trên tab hiện tại
const filteredServicePackages = computed(() => {
  if (currentTab.value === 'list') {
    return servicePackages.value.filter(p => p.status === 'active' || p.status === 'inactive');
  } else {
    return servicePackages.value.filter(p => p.status === 'deleted');
  }
});

// Sắp xếp service packages theo created_at giảm dần
const sortedServicePackages = computed(() =>
  [...filteredServicePackages.value].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  })
);

// Tính toán dữ liệu phân trang
const totalPages = computed(() => Math.ceil(sortedServicePackages.value.length / itemsPerPage));
const paginatedServicePackages = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedServicePackages.value.slice(start, end);
});

const openModal = (mode: 'view' | 'edit', servicePackage: ServicePackage) => {
  modal.value = {
    open: true,
    mode,
    servicePackage: {
      ...servicePackage,
      file_storage_limit: Number(servicePackage.file_storage_limit) || 0,
      bandwidth_limit: Number(servicePackage.bandwidth_limit) || 0,
      database_limit: Number(servicePackage.database_limit) || 0,
      api_call_limit: Number(servicePackage.api_call_limit) || 0,
      start_date: servicePackage.start_date || null,
      end_date: servicePackage.end_date || null,
      category_id: servicePackage.category_id || null,
    },
  };
  formErrors.value = {};
};

const openCreateModal = () => {
  modal.value = {
    open: true,
    mode: 'create',
    servicePackage: {
      name: '',
      description: '',
      price: 0,
      package_type: 'free',
      file_storage_limit: 0,
      bandwidth_limit: 0,
      database_limit: 0,
      api_call_limit: 0,
      start_date: null,
      end_date: null,
      status: 'active',
      billing_cycle: 'indefinite',
      category_id: null,
    },
  };
  formErrors.value = {};
};

const closeModal = () => {
  modal.value.open = false;
  formErrors.value = {};
};

// Theo dõi thay đổi package_type để điều chỉnh giá
watch(() => modal.value.servicePackage.package_type, (newType) => {
  if (newType === 'free') {
    modal.value.servicePackage.price = 0;
  }
});

const token = localStorage.getItem('token') || sessionStorage.getItem('token');

const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.status === 500 && res.statusText.includes('Redis')) {
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      return res;
    } catch (err) {
      if (i === retries - 1) throw err;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  throw new Error('Không thể kết nối sau nhiều lần thử');
};

const fetchServicePackages = async () => {
  isLoading.value = true;
  try {
    const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL}/api/service-packages`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Không thể tải danh sách gói dịch vụ');
    const { data } = await res.json();
    servicePackages.value = data.map((pkg: ServicePackage) => ({
      ...pkg,
      file_storage_limit: Number(pkg.file_storage_limit) || 0,
      bandwidth_limit: Number(pkg.bandwidth_limit) || 0,
      database_limit: Number(pkg.database_limit) || 0,
      api_call_limit: Number(pkg.api_call_limit) || 0,
      category_id: pkg.category_id || null,
    }));
  } catch (err) {
    console.error('Lỗi khi tải gói dịch vụ:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể tải danh sách gói dịch vụ!',
      confirmButtonColor: '#086df9',
    });
  } finally {
    isLoading.value = false;
  }
};

const fetchCategories = async () => {
  isLoading.value = true;
  try {
    const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Không thể tải danh sách danh mục');
    const { data } = await res.json();
    categories.value = data;
  } catch (err) {
    console.error('Lỗi khi tải danh mục:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể tải danh sách danh mục!',
      confirmButtonColor: '#086df9',
    });
  } finally {
    isLoading.value = false;
  }
};

const validateServicePackage = (pkg: ServicePackage): FormErrors => {
  const errors: FormErrors = {};
  if (!pkg.name.trim()) errors.name = 'Tên gói dịch vụ là bắt buộc';
  else if (pkg.name.length > 255) errors.name = 'Tên gói không được vượt quá 255 ký tự';
  if (!pkg.package_type) errors.package_type = 'Loại gói dịch vụ là bắt buộc';
  else if (!['free', 'pro', 'vip_pro', 'enterprise'].includes(pkg.package_type))
    errors.package_type = 'Loại gói không hợp lệ';
  if (!pkg.billing_cycle) errors.billing_cycle = 'Chu kỳ thanh toán là bắt buộc';
  else if (!['monthly', 'quarterly', 'yearly', 'one-time', 'indefinite'].includes(pkg.billing_cycle))
    errors.billing_cycle = 'Chu kỳ thanh toán không hợp lệ';
  if (!pkg.status) errors.status = 'Trạng thái là bắt buộc';
  else if (!['active', 'inactive', 'deleted'].includes(pkg.status)) errors.status = 'Trạng thái không hợp lệ';
  if (pkg.price === undefined || pkg.price === null) errors.price = 'Giá là bắt buộc';
  else if (pkg.price < 0) errors.price = 'Giá không thể âm';
  if (pkg.file_storage_limit && pkg.file_storage_limit < 0) errors.file_storage_limit = 'Giới hạn lưu trữ không thể âm';
  if (pkg.bandwidth_limit && pkg.bandwidth_limit < 0) errors.bandwidth_limit = 'Giới hạn băng thông không thể âm';
  if (pkg.database_limit && pkg.database_limit < 0) errors.database_limit = 'Giới hạn cơ sở dữ liệu không thể âm';
  if (pkg.api_call_limit && pkg.api_call_limit < 0) errors.api_call_limit = 'Giới hạn API calls không thể âm';
  if (pkg.category_id && !categories.value.some(c => c.category_id === pkg.category_id && c.status !== 'deleted'))
    errors.category_id = 'Danh mục không hợp lệ hoặc đã bị xóa';
  return errors;
};

const createServicePackage = async () => {
  formErrors.value = validateServicePackage(modal.value.servicePackage);
  if (Object.keys(formErrors.value).length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Vui lòng kiểm tra các trường dữ liệu!',
      confirmButtonColor: '#086df9',
    });
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      ...modal.value.servicePackage,
      price: modal.value.servicePackage.package_type === 'free' ? 0 : Number(modal.value.servicePackage.price),
      category_id: modal.value.servicePackage.category_id || null,
    };

    // Kiểm tra payload
    console.log('Create Payload:', JSON.stringify(payload));

    const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL}/api/service-packages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      if (errorData.errors) {
        formErrors.value = errorData.errors.reduce((acc: FormErrors, err: any) => {
          acc[err.path] = err.msg; // Sử dụng err.path thay vì err.param
          return acc;
        }, {});
        throw new Error('Dữ liệu không hợp lệ, vui lòng kiểm tra lại');
      }
      throw new Error(errorData.message || 'Không thể tạo gói dịch vụ');
    }

    await fetchServicePackages();
    closeModal();
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Tạo gói dịch vụ thành công!',
      confirmButtonColor: '#086df9',
    });
  } catch (err) {
    console.error('Lỗi tạo:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể tạo gói dịch vụ!',
      confirmButtonColor: '#086df9',
    });
  } finally {
    isLoading.value = false;
  }
};

const updateServicePackage = async () => {
  formErrors.value = validateServicePackage(modal.value.servicePackage);
  if (Object.keys(formErrors.value).length > 0) {
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Vui lòng kiểm tra các trường dữ liệu!',
      confirmButtonColor: '#086df9',
    });
    return;
  }

  isLoading.value = true;
  try {
    const payload = {
      ...modal.value.servicePackage,
      price: modal.value.servicePackage.package_type === 'free' ? 0 : Number(modal.value.servicePackage.price),
      category_id: modal.value.servicePackage.category_id || null,
    };

    // Kiểm tra payload
    console.log('Update Payload:', JSON.stringify(payload));

    const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL}/api/service-packages/${modal.value.servicePackage.package_id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      if (errorData.errors) {
        formErrors.value = errorData.errors.reduce((acc: FormErrors, err: any) => {
          acc[err.path] = err.msg; // Sử dụng err.path thay vì err.param
          return acc;
        }, {});
        throw new Error('Dữ liệu không hợp lệ, vui lòng kiểm tra lại');
      }
      throw new Error(errorData.message || 'Không thể cập nhật gói dịch vụ');
    }

    await fetchServicePackages();
    closeModal();
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Cập nhật gói dịch vụ thành công!',
      confirmButtonColor: '#086df9',
    });
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.message || 'Không thể cập nhật gói dịch vụ!',
      confirmButtonColor: '#086df9',
    });
  } finally {
    isLoading.value = false;
  }
};

const moveToTrash = async (servicePackage: ServicePackage) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn chuyển gói dịch vụ ${servicePackage.name} vào thùng rác?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Chuyển',
    cancelButtonText: 'Hủy',
  });

  if (result.isConfirmed) {
    isLoading.value = true;
    try {
      // Tạo payload với đầy đủ các trường
      const payload = {
        name: servicePackage.name,
        status: 'deleted',
        package_type: servicePackage.package_type,
        price: servicePackage.package_type === 'free' ? 0 : Number(servicePackage.price),
        billing_cycle: servicePackage.billing_cycle,
        category_id: servicePackage.category_id || null,
        description: servicePackage.description || '',
        file_storage_limit: Number(servicePackage.file_storage_limit) || 0,
        bandwidth_limit: Number(servicePackage.bandwidth_limit) || 0,
        database_limit: Number(servicePackage.database_limit) || 0,
        api_call_limit: Number(servicePackage.api_call_limit) || 0,
        start_date: servicePackage.start_date || null,
        end_date: servicePackage.end_date || null,
      };

      console.log('Move to Trash Payload:', JSON.stringify(payload)); // Debug payload

      const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL}/api/service-packages/${servicePackage.package_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errors) {
          formErrors.value = errorData.errors.reduce((acc: FormErrors, err: any) => {
            acc[err.path] = err.msg;
            return acc;
          }, {});
          throw new Error('Dữ liệu không hợp lệ, vui lòng kiểm tra lại');
        }
        throw new Error(errorData.message || 'Không thể chuyển gói dịch vụ');
      }

      await fetchServicePackages();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Gói dịch vụ đã chuyển vào thùng rác!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể chuyển gói dịch vụ!',
        confirmButtonColor: '#086df9',
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const restoreServicePackage = async (servicePackage: ServicePackage) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn khôi phục gói dịch vụ ${servicePackage.name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Khôi phục',
    cancelButtonText: 'Hủy',
  });

  if (result.isConfirmed) {
    isLoading.value = true;
    try {
      // Tạo payload với đầy đủ các trường
      const payload = {
        name: servicePackage.name,
        status: 'active',
        package_type: servicePackage.package_type,
        price: servicePackage.package_type === 'free' ? 0 : Number(servicePackage.price),
        billing_cycle: servicePackage.billing_cycle,
        category_id: servicePackage.category_id || null,
        description: servicePackage.description || '',
        file_storage_limit: Number(servicePackage.file_storage_limit) || 0,
        bandwidth_limit: Number(servicePackage.bandwidth_limit) || 0,
        database_limit: Number(servicePackage.database_limit) || 0,
        api_call_limit: Number(servicePackage.api_call_limit) || 0,
        start_date: servicePackage.start_date || null,
        end_date: servicePackage.end_date || null,
      };

      console.log('Restore Payload:', JSON.stringify(payload)); // Debug payload

      const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL}/api/service-packages/${servicePackage.package_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        if (errorData.errors) {
          formErrors.value = errorData.errors.reduce((acc: FormErrors, err: any) => {
            acc[err.path] = err.msg;
            return acc;
          }, {});
          throw new Error('Dữ liệu không hợp lệ, vui lòng kiểm tra lại');
        }
        throw new Error(errorData.message || 'Không thể khôi phục gói dịch vụ');
      }

      await fetchServicePackages();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Gói dịch vụ đã được khôi phục!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể khôi phục gói dịch vụ!',
        confirmButtonColor: '#086df9',
      });
    } finally {
      isLoading.value = false;
    }
  }
};

const permanentlyDelete = async (servicePackage: ServicePackage) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa vĩnh viễn',
    text: `Bạn có chắc muốn xóa vĩnh viễn gói dịch vụ ${servicePackage.name}? Hành động này không thể hoàn tác.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa vĩnh viễn',
    cancelButtonText: 'Hủy',
  });
  if (result.isConfirmed) {
    isLoading.value = true;
    try {
      const res = await fetchWithRetry(`${import.meta.env.VITE_API_URL}/api/service-packages/${servicePackage.package_id}/permanent`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Không thể xóa gói dịch vụ');
      }
      await fetchServicePackages();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Gói dịch vụ đã được xóa vĩnh viễn!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi xóa:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || 'Không thể xóa gói dịch vụ!',
        confirmButtonColor: '#086df9',
      });
    } finally {
      isLoading.value = false;
    }
  }
};

onMounted(() => {
  fetchServicePackages();
  fetchCategories();
});
</script>

<style scoped>
table th,
table td {
  white-space: nowrap;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #086df9;
  box-shadow: 0 0 0 3px rgba(8, 109, 249, 0.3);
}

textarea {
  min-height: 100px;
  resize: vertical;
}

@media (max-width: 768px) {
  .tw-overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }
}
</style>