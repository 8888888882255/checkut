<template>
  <div class="bg-white shadow-md rounded-lg overflow-hidden">
    <!-- Header với tìm kiếm và filter -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Quản lý Dữ liệu Dịch vụ</h2>
          <p class="text-gray-600 mt-1">Theo dõi và quản lý dữ liệu sử dụng dịch vụ</p>
        </div>
        <button
          @click="showCreateModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Thêm dữ liệu
        </button>
      </div>

      <!-- Filters -->
      <div class="mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
          <select v-model="filters.status" @change="handleFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
            <option value="deleted">Đã xóa</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Gói dịch vụ</label>
          <select v-model="filters.package_id" @change="handleFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả gói</option>
            <option v-for="pkg in packages" :key="pkg.package_id" :value="pkg.package_id">
              {{ pkg.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
          <select v-model="filters.user_id" @change="handleFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tất cả người dùng</option>
            <option v-for="user in users" :key="user.user_id" :value="user.user_id">
              {{ user.email }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Hiển thị</label>
          <select v-model="filters.limit" @change="handleFilter" class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="10">10 dòng</option>
            <option value="25">25 dòng</option>
            <option value="50">50 dòng</option>
            <option value="100">100 dòng</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-blue-600">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang tải dữ liệu...
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="p-8 text-center">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ error }}</p>
        <button @click="fetchData" class="mt-2 text-blue-600 hover:text-blue-800">Thử lại</button>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gói dịch vụ</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dung lượng</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Băng thông</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Database</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">API Calls</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="item in serviceData" :key="item.data_id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ item.data_id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div class="font-medium">{{ item.user?.email }}</div>
                <div class="text-gray-500 text-xs">{{ item.user?.role }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              <div>
                <div class="font-medium">{{ item.package?.name }}</div>
                <div class="text-gray-500 text-xs">{{ formatFileSize(item.package?.file_storage_limit || 0) }}</div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatFileSize(item.file_size) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatBandwidth(item.bandwidth_used) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatFileSize(item.database_used) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ item.api_calls_used.toLocaleString() }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(item.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusText(item.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ formatDate(item.created_at) }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <div class="flex space-x-2">
                <button
                  @click="editItem(item)"
                  class="text-blue-600 hover:text-blue-900"
                  title="Chỉnh sửa"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </button>
                <button
                  @click="deleteItem(item)"
                  class="text-red-600 hover:text-red-900"
                  title="Xóa"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div class="flex-1 flex justify-between sm:hidden">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page <= 1"
          class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Trước
        </button>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages"
          class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sau
        </button>
      </div>
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Hiển thị
            <span class="font-medium">{{ (pagination.page - 1) * pagination.limit + 1 }}</span>
            đến
            <span class="font-medium">{{ Math.min(pagination.page * pagination.limit, pagination.total) }}</span>
            trong tổng số
            <span class="font-medium">{{ pagination.total }}</span>
            kết quả
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              @click="changePage(pagination.page - 1)"
              :disabled="pagination.page <= 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
              :class="page === pagination.page ? 'bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
              class="relative inline-flex items-center px-4 py-2 border text-sm font-medium"
            >
              {{ page }}
            </button>
            <button
              @click="changePage(pagination.page + 1)"
              :disabled="pagination.page >= pagination.totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

    <!-- Create/Edit Modal -->
    <div v-if="showCreateModal || showEditModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            {{ showEditModal ? 'Chỉnh sửa dữ liệu' : 'Thêm dữ liệu mới' }}
          </h3>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Người dùng</label>
                <select v-model="formData.user_id" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn người dùng</option>
                  <option v-for="user in users" :key="user.user_id" :value="user.user_id">
                    {{ user.email }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Gói dịch vụ</label>
                <select v-model="formData.package_id" required class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Chọn gói dịch vụ</option>
                  <option v-for="pkg in packages" :key="pkg.package_id" :value="pkg.package_id">
                    {{ pkg.name }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Object Key</label>
                <input
                  v-model="formData.object_key"
                  type="text"
                  required
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập object key"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Dung lượng file (bytes)</label>
                <input
                  v-model="formData.file_size"
                  type="number"
                  min="0"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Băng thông sử dụng (bytes)</label>
                <input
                  v-model="formData.bandwidth_used"
                  type="number"
                  min="0"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Database sử dụng (bytes)</label>
                <input
                  v-model="formData.database_used"
                  type="number"
                  min="0"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">API Calls sử dụng</label>
                <input
                  v-model="formData.api_calls_used"
                  type="number"
                  min="0"
                  class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {{ showEditModal ? 'Cập nhật' : 'Tạo' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useServiceData } from '../composables/useServiceData'

const {
  serviceData,
  loading,
  error,
  pagination,
  fetchServiceData,
  createServiceData,
  updateServiceData,
  deleteServiceData,
  formatFileSize,
  formatBandwidth
} = useServiceData()

// State
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingItem = ref(null)
const packages = ref([])
const users = ref([])

// Filters
const filters = reactive({
  status: '',
  package_id: '',
  user_id: '',
  limit: 10,
  page: 1
})

// Form data
const formData = reactive({
  user_id: '',
  package_id: '',
  object_key: '',
  file_size: 0,
  bandwidth_used: 0,
  database_used: 0,
  api_calls_used: 0
})

// Methods
const fetchData = async () => {
  await fetchServiceData(filters)
}

const handleFilter = () => {
  filters.page = 1
  fetchData()
}

const changePage = (page) => {
  filters.page = page
  fetchData()
}

const getPageNumbers = () => {
  const pages = []
  const start = Math.max(1, pagination.value.page - 2)
  const end = Math.min(pagination.value.totalPages, pagination.value.page + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
}

const editItem = (item) => {
  editingItem.value = item
  Object.assign(formData, {
    user_id: item.user_id,
    package_id: item.package_id,
    object_key: item.object_key,
    file_size: item.file_size,
    bandwidth_used: item.bandwidth_used,
    database_used: item.database_used,
    api_calls_used: item.api_calls_used
  })
  showEditModal.value = true
}

const deleteItem = async (item) => {
  if (confirm('Bạn có chắc chắn muốn xóa dữ liệu này?')) {
    try {
      await deleteServiceData(item.data_id)
    } catch (err) {
      console.error('Error deleting item:', err)
    }
  }
}

const handleSubmit = async () => {
  try {
    if (showEditModal.value) {
      await updateServiceData(editingItem.value.data_id, formData)
    } else {
      await createServiceData(formData)
    }
    closeModal()
  } catch (err) {
    console.error('Error submitting form:', err)
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingItem.value = null
  Object.assign(formData, {
    user_id: '',
    package_id: '',
    object_key: '',
    file_size: 0,
    bandwidth_used: 0,
    database_used: 0,
    api_calls_used: 0
  })
}

const getStatusClass = (status) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800'
    case 'inactive':
      return 'bg-yellow-100 text-yellow-800'
    case 'deleted':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Hoạt động'
    case 'inactive':
      return 'Không hoạt động'
    case 'deleted':
      return 'Đã xóa'
    default:
      return 'Không xác định'
  }
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Load initial data
onMounted(async () => {
  await fetchData()
  
  // TODO: Load packages and users data
  // This would typically come from other composables or API calls
})
</script> 