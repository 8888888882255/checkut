<template>
  <div class="tw-p-6 tw-min-h-screen tw-bg-gray-50 dark:tw-bg-gray-900">
    <h1 class="tw-text-3xl tw-font-semibold tw-mb-6 tw-text-gray-800 dark:tw-text-white">Quản lý Khách hàng</h1>

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
        <List class="tw-w-5 tw-h-5" /> Danh sách Khách hàng
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
          @input="filterCustomers"
        />
        <span class="tw-absolute tw-right-3 tw-top-2.5 tw-text-gray-400">
          <Search class="tw-w-5 tw-h-5" />
        </span>
      </div>

      <!-- Bộ lọc trạng thái -->
      <select
        v-model="statusFilter"
        class="tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
        @change="filterCustomers"
      >
        <option value="">Tất cả trạng thái</option>
        <option value="active">Hoạt động</option>
        <option value="inactive">Tạm dừng</option>
      </select>

      <!-- Nút thêm khách hàng mới -->
      <button
        @click="openModal('add', {})"
        class="tw-px-4 tw-py-2 tw-bg-[#086df9] tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-blue-700 tw-transition tw-flex tw-items-center tw-gap-2"
      >
        <PlusCircle class="tw-w-5 tw-h-5" /> Thêm khách hàng
      </button>
    </div>

    <!-- Bảng hiển thị khách hàng -->
    <div class="tw-overflow-x-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-xl tw-shadow-lg">
      <table class="tw-min-w-full tw-table-auto">
        <thead class="tw-bg-gray-100 dark:tw-bg-gray-700">
          <tr>
            <th class="tw-text-center tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">ID</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Họ tên</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Email</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Số điện thoại</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Vai trò</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Tenant</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Ngày tạo</th>
            <th class="tw-text-left tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Trạng thái</th>
            <th class="tw-text-center tw-px-6 tw-py-3 tw-text-sm tw-font-semibold dark:tw-text-white">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="customer in paginatedCustomers"
            :key="customer.user_id"
            class="tw-border-b dark:tw-border-gray-700 tw-transition tw-duration-200 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700"
          >
            <td class="tw-px-6 tw-py-4 tw-text-center tw-text-gray-700 dark:tw-text-gray-300">{{ customer.user_id }}</td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">{{ customer.full_name }}</td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">{{ customer.email }}</td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">{{ customer.phone_number }}</td>
            <td class="tw-px-6 tw-py-4">
              <span
                :class="[
                  'tw-inline-block tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full',
                  customer.role === 'global_admin' ? 'tw-bg-purple-100 tw-text-purple-700' :
                  customer.role === 'tenant_admin' ? 'tw-bg-blue-100 tw-text-blue-700' :
                  'tw-bg-green-100 tw-text-green-700'
                ]"
              >
                {{ 
                  customer.role === 'global_admin' ? 'Quản trị viên hệ thống' : 
                  customer.role === 'tenant_admin' ? 'Quản trị viên tenant' : 
                  'Người dùng tenant' 
                }}
              </span>
            </td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">
              <span v-if="customer.tenant_id">
                {{ customer.tenant?.name || `Tenant ID: ${customer.tenant_id}` }}
              </span>
              <span v-else class="tw-text-gray-400">Không có tenant</span>
            </td>
            <td class="tw-px-6 tw-py-4 tw-text-gray-700 dark:tw-text-gray-300">
              {{ new Date(customer.created_at || '').toLocaleDateString('vi-VN') }}
            </td>
            <td class="tw-px-6 tw-py-4">
              <span
                :class="[
                  'tw-inline-block tw-px-3 tw-py-1 tw-text-xs tw-font-medium tw-rounded-full',
                  customer.status === 'active' ? 'tw-bg-green-100 tw-text-green-700' :
                  customer.status === 'inactive' ? 'tw-bg-yellow-100 tw-text-yellow-700' :
                  'tw-bg-red-100 tw-text-red-700'
                ]"
              >
                {{ customer.status === 'active' ? 'Hoạt động' : customer.status === 'inactive' ? 'Tạm dừng' : 'Đã xóa' }}
              </span>
            </td>
            <td class="tw-px-6 tw-py-4 tw-text-center tw-flex tw-justify-center tw-gap-2">
              <button @click="openModal('view', customer)" class="tw-text-green-600 hover:tw-text-green-800 tw-transition">
                <Eye class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'list'" @click="openModal('edit', customer)" class="tw-text-[#086df9] hover:tw-text-blue-700 tw-transition">
                <Edit class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'list'" @click="moveToTrash(customer)" class="tw-text-red-600 hover:tw-text-red-800 tw-transition">
                <Trash2 class="tw-w-5 tw-h-5" />
              </button>
              <button v-if="currentTab === 'restore'" @click="restoreCustomer(customer)" class="tw-text-[#086df9] hover:tw-text-blue-700 tw-transition">
                <RefreshCcw class="tw-w-5 tw-h-5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Phân trang -->
    <div class="tw-mt-6 tw-flex tw-justify-between tw-items-center tw-text-gray-600 dark:tw-text-gray-300">
      <div class="tw-text-sm">
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, filteredCustomers.length) }} của {{ filteredCustomers.length }} khách hàng
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
            <PlusCircle v-if="modal.mode === 'add'" class="tw-w-6 tw-h-6 tw-text-[#086df9]" />
          </span>
          {{ 
            modal.mode === 'view' ? 'Chi tiết Khách hàng' : 
            modal.mode === 'edit' ? 'Chỉnh sửa Khách hàng' : 
            'Thêm Khách hàng mới' 
          }}
        </h2>

        <div class="tw-space-y-5">
          <div v-if="modal.mode === 'view' || modal.mode === 'edit'">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">ID</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Hash class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.customer?.user_id"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Họ tên</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <User class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                :disabled="modal.mode === 'view'"
                v-model="modal.customer.full_name"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Email</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Mail class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="email"
                :disabled="modal.mode !== 'add'"
                v-model="modal.customer.email"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div>
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Số điện thoại</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Phone class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                :disabled="modal.mode === 'view'"
                v-model="modal.customer.phone_number"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div v-if="modal.mode === 'add'">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Mật khẩu</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Lock class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="password"
                v-model="modal.customer.password"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div v-if="modal.mode === 'edit'">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Trạng thái</label>
            <select
              v-model="modal.customer.status"
              class="tw-w-full tw-px-4 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
            >
              <option value="active">Hoạt động</option>
              <option value="inactive">Tạm dừng</option>
            </select>
          </div>
          <div v-if="modal.mode === 'view'">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Ngày tạo</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Calendar class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="new Date(modal.customer?.created_at || '').toLocaleDateString('vi-VN')"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
          <div v-if="modal.mode === 'view' || modal.mode === 'edit'">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Vai trò</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Shield class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <select
                :disabled="modal.mode === 'view'"
                v-model="modal.customer.role"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-border-[#086df9] focus:tw-ring-2 focus:tw-ring-blue-200 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              >
                <option value="global_admin">Quản trị viên hệ thống</option>
                <option value="tenant_admin">Quản trị viên tenant</option>
                <option value="tenant_user">Người dùng tenant</option>
              </select>
            </div>
          </div>
          <div v-if="modal.mode === 'view' || modal.mode === 'edit'">
            <label class="tw-block tw-text-sm tw-font-medium tw-text-gray-700 dark:tw-text-gray-300 tw-mb-1">Tenant</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Building2 class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.customer.tenant?.name || (modal.customer.tenant_id ? `Tenant ID: ${modal.customer.tenant_id}` : 'Không có tenant')"
                class="tw-w-full tw-pl-10 tw-pr-3 tw-py-2 tw-border tw-border-gray-300 tw-rounded-lg tw-bg-gray-100 dark:tw-bg-gray-700 dark:tw-border-gray-600 dark:tw-text-white"
              />
            </div>
          </div>
        </div>

        <div v-if="modal.mode !== 'view'" class="tw-mt-8 tw-flex tw-justify-end tw-gap-3">
          <button
            @click="closeModal"
            class="tw-px-4 tw-py-2 tw-bg-gray-200 tw-text-gray-700 tw-rounded-lg tw-font-medium hover:tw-bg-gray-300 tw-transition dark:tw-bg-gray-700 dark:tw-text-gray-300 dark:hover:tw-bg-gray-600"
          >
            Hủy
          </button>
          <button
            @click="modal.mode === 'add' ? addCustomer() : updateCustomer()"
            class="tw-px-4 tw-py-2 tw-bg-[#086df9] tw-text-white tw-rounded-lg tw-font-medium hover:tw-bg-blue-700 tw-transition tw-flex tw-items-center"
          >
            <Save class="tw-w-4 tw-h-4 tw-mr-2" /> {{ modal.mode === 'add' ? 'Thêm' : 'Lưu' }}
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
  User,
  Mail,
  Phone,
  Calendar,
  X,
  Save,
  RefreshCcw,
  Search,
  List,
  Recycle,
  PlusCircle,
  Lock,
  Activity,
  Shield,
  Building2
} from 'lucide-vue-next'
import axios from 'axios'

interface Customer {
  user_id: number
  email: string
  full_name: string
  phone_number: string
  status: 'active' | 'inactive' | 'deleted'
  created_at?: string
  password?: string
  role?: string
  tenant_id?: number
  tenant?: { name: string }
}

const customers = ref<Customer[]>([])
const modal = ref<{ open: boolean; mode: 'view' | 'edit' | 'add'; customer: Customer }>({  
  open: false,
  mode: 'view',
  customer: {} as Customer
})
const currentPage = ref(1)
const itemsPerPage = 20
const currentTab = ref('list')
const searchQuery = ref('')
const statusFilter = ref('')
const loading = ref(false)
const error = ref('')

const filteredCustomers = computed(() => {
  let result = customers.value
  if (currentTab.value === 'list') {
    result = result.filter(c => c.status === 'active' || c.status === 'inactive')
  } else {
    result = result.filter(c => c.status === 'deleted')
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(c => 
      c.full_name.toLowerCase().includes(query) || 
      c.email.toLowerCase().includes(query) ||
      c.phone_number.includes(query)
    )
  }
  if (statusFilter.value && statusFilter.value !== '') {
    result = result.filter(c => c.status === statusFilter.value)
  }
  return result
})

const sortedCustomers = computed(() =>
  [...filteredCustomers.value].sort((a, b) => {
    const dateA = new Date(a.created_at || '').getTime()
    const dateB = new Date(b.created_at || '').getTime()
    return dateB - dateA
  })
)

const totalPages = computed(() => Math.ceil(sortedCustomers.value.length / itemsPerPage))
const paginatedCustomers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedCustomers.value.slice(start, end)
})

const openModal = (mode: 'view' | 'edit' | 'add', customer: Customer) => {
  modal.value = { open: true, mode, customer: { ...customer } }
}

const closeModal = () => {
  modal.value.open = false
}

const fetchCustomers = async () => {
  try {
    loading.value = true;
    error.value = '';
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    if (!token) {
      throw new Error('Không tìm thấy token xác thực');
    }

    // Get current user info
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!userStr) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }

    const currentUser = JSON.parse(userStr);
    console.log('Current user:', currentUser);

    // Fetch users with tenant information
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params: {
        include: 'tenant'
      }
    });

    // Filter users based on role
    if (currentUser.role === 'global_admin') {
      customers.value = response.data;
    } else if (currentUser.role === 'tenant_admin') {
      customers.value = response.data.filter(user => 
        user.tenant_id === currentUser.tenant_id && 
        user.user_id !== currentUser.user_id
      );
    }

    filteredCustomers.value = customers.value;

    if (customers.value.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'Thông báo',
        text: 'Chưa có khách hàng nào trong hệ thống',
        confirmButtonColor: '#086df9',
      });
    }
  } catch (err) {
    console.error('Lỗi khi tải khách hàng:', err);
    error.value = err.response?.data?.error || err.message || 'Không thể tải danh sách khách hàng!';
    
    if (err.response?.status === 401) {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi xác thực',
        text: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
        confirmButtonColor: '#086df9',
      }).then(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/login';
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: error.value,
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
  } finally {
    loading.value = false;
  }
};

const saveCustomer = async () => {
  try {
    if (modal.value.mode === 'add') {
      await axios.post('/api/users', modal.value.customer);
    } else if (modal.value.mode === 'edit') {
      await axios.put(`/api/users/${modal.value.customer.user_id}`, modal.value.customer);
    }
    await fetchCustomers();
    closeModal();
  } catch (error) {
    console.error('Error saving customer:', error);
  }
};

const addCustomer = async () => {
  try {
    const { full_name, email, phone_number, password } = modal.value.customer
    
    if (!email || !password || !full_name || !phone_number) {
      Swal.fire({
        icon: 'warning',
        title: 'Thiếu thông tin',
        text: 'Vui lòng điền đầy đủ thông tin bắt buộc',
        confirmButtonColor: '#086df9',
      })
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Email không hợp lệ',
        text: 'Vui lòng nhập email đúng định dạng',
        confirmButtonColor: '#086df9',
      })
      return
    }

    // Check if email already exists in the current list
    const emailExists = customers.value.some(customer => 
      customer.email.toLowerCase() === email.toLowerCase()
    );
    if (emailExists) {
      Swal.fire({
        icon: 'warning',
        title: 'Email đã tồn tại',
        text: 'Email này đã được sử dụng bởi một người dùng khác',
        confirmButtonColor: '#086df9',
      })
      return
    }

    // Validate phone number format (VN format)
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(phone_number)) {
      Swal.fire({
        icon: 'warning',
        title: 'Số điện thoại không hợp lệ',
        text: 'Vui lòng nhập số điện thoại đúng định dạng Việt Nam',
        confirmButtonColor: '#086df9',
      })
      return
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordRegex.test(password)) {
      Swal.fire({
        icon: 'warning',
        title: 'Mật khẩu không đủ mạnh',
        text: 'Mật khẩu phải có ít nhất 6 ký tự và chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt',
        confirmButtonColor: '#086df9',
      })
      return
    }

    // Get current user info from localStorage or sessionStorage
    const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
    if (!userStr) {
      throw new Error('Không tìm thấy thông tin người dùng')
    }

    const currentUser = JSON.parse(userStr)
    console.log('Current user info:', currentUser) // Debug log

    if (!currentUser.tenant_id) {
      throw new Error('Không tìm thấy thông tin tenant')
    }
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (!token) {
      throw new Error('Không tìm thấy token xác thực')
    }

    console.log('Sending request with data:', {
      ...modal.value.customer,
      role: 'tenant_user',
      tenant_id: currentUser.tenant_id
    }) // Debug log

    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/users`,
      {
        ...modal.value.customer,
        role: 'tenant_user',
        tenant_id: currentUser.tenant_id
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    await fetchCustomers()
    closeModal()
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Thêm người dùng mới thành công!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    })
  } catch (err: any) {
    console.error('Lỗi thêm người dùng:', err)
    // Kiểm tra nếu lỗi là do email trùng lặp từ server
    if (err.response?.data?.error?.includes('Email đã được sử dụng')) {
      Swal.fire({
        icon: 'warning',
        title: 'Email đã tồn tại',
        text: 'Email này đã được sử dụng bởi một người dùng khác',
        confirmButtonColor: '#086df9',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.message || err.response?.data?.error || 'Không thể thêm người dùng!',
        confirmButtonColor: '#086df9',
      })
    }
  }
}

const updateCustomer = async () => {
  try {
    const { user_id, full_name, phone_number, status } = modal.value.customer
    
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const res = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/users/${user_id}`,
      { full_name, phone_number, status },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      }
    )
    
    await fetchCustomers()
    closeModal()
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Cập nhật thông tin người dùng thành công!',
      confirmButtonColor: '#086df9',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
      showCloseButton: true,
    })
  } catch (err: any) {
    console.error('Lỗi cập nhật:', err)
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: err.response?.data?.error || 'Không thể cập nhật thông tin người dùng!',
      confirmButtonColor: '#086df9',
    })
  }
}

const moveToTrash = async (customer: Customer) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn chuyển người dùng ${customer.full_name} vào thùng rác?`,
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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      const res = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/users/${customer.user_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      await fetchCustomers()
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Người dùng đã được chuyển vào thùng rác!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err: any) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.response?.data?.error || 'Không thể chuyển người dùng vào thùng rác!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const restoreCustomer = async (customer: Customer) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn khôi phục người dùng ${customer.full_name}?`,
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
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')
      // Sử dụng PUT để cập nhật trạng thái người dùng
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/users/${customer.user_id}`,
        { status: 'active' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      await fetchCustomers()
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Người dùng đã được khôi phục!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    } catch (err: any) {
      console.error('Lỗi:', err)
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: err.response?.data?.error || 'Không thể khôi phục người dùng!',
        confirmButtonColor: '#086df9',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        showCloseButton: true,
      })
    }
  }
}

const filterCustomers = () => {
  currentPage.value = 1
}

onMounted(() => {
  fetchCustomers()
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
</style>
