<template>
  <div class="tw-p-6">
    <h1 class="tw-text-2xl tw-font-bold tw-mb-4 dark:tw-text-white">Quản lý danh mục</h1>

    <!-- Thanh điều hướng và nút thêm -->
    <div class="tw-flex tw-justify-between tw-items-center tw-mb-4">
      <div class="tw-flex tw-gap-4">
        <button @click="currentTab = 'list'" :class="{'tw-bg-[#086df9] tw-text-white': currentTab === 'list', 'tw-bg-gray-200': currentTab !== 'list'}" class="tw-px-4 tw-py-2 tw-rounded">
          Danh sách danh mục
        </button>
        <button @click="currentTab = 'restore'" :class="{'tw-bg-[#086df9] tw-text-white': currentTab === 'restore', 'tw-bg-gray-200': currentTab !== 'restore'}" class="tw-px-4 tw-py-2 tw-rounded">
          Khôi phục
        </button>
      </div>
      <button v-if="isGlobalAdmin" @click="openCreateModal" class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded tw-flex tw-items-center hover:tw-bg-blue-700">
        <Plus class="tw-w-4 tw-h-4 tw-mr-2" /> Thêm danh mục
      </button>
    </div>

    <!-- Bảng hiển thị categories -->
    <div class="tw-overflow-x-auto tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow">
      <table class="tw-min-w-full tw-table-auto">
        <thead class="tw-bg-gray-100 dark:tw-bg-gray-700">
          <tr>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">ID</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Tên danh mục</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Danh mục cha</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Mô tả</th>
            <th class="tw-text-left tw-px-4 tw-py-2 dark:tw-text-white">Ngày tạo</th>
            <th class="tw-text-left tw-px tw-py-2 dark:tw-text-white">Trạng thái</th>
            <th class="tw-text-center tw-px-4 tw-py-2 dark:tw-text-white">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="category in paginatedCategories"
            :key="category.category_id"
            class="tw-border-b dark:tw-border-gray-700 hover:tw-bg-gray-50 dark:hover:tw-bg-gray-700"
          >
            <td class="tw-px-4 tw-py-2 tw-text-center">{{ category.category_id }}</td>
            <td class="tw-px-4 tw-py-2">{{ category.name }}</td>
            <td class="tw-px-4 tw-py-2">{{ category.parent_id ? category.parent_id : '-' }}</td>
            <td class="tw-px-4 tw-py-2">{{ category.description || '-' }}</td>
            <td class="tw-px-4 tw-py-2">
              {{ new Date(category.created_at || '').toLocaleDateString('vi-VN') }}
            </td>
            <td class="tw-px-4 tw-py-2">
              <span
                :class="[
                  'tw-inline-block tw-px-2 tw-py-1 tw-text-xs tw-rounded-full',
                  category.status === 'active' ? 'tw-bg-green-100 tw-text-green-700' :
                  category.status === 'inactive' ? 'tw-bg-yellow-100 tw-text-yellow-700' :
                  'tw-bg-red-100 tw-text-red-700'
                ]"
              >
                {{ category.status }}
              </span>
            </td>
            <td class="tw-px-4 tw-py-2 tw-text-center">
              <div class="tw-relative">
                <button @click="openModal('view', category)" class="tw-mr-2 tw-text-green-600">
                  <Eye class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'list'" @click="openModal('edit', category)" class="tw-mr-2 tw-text-[#086df9]">
                  <Edit class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'list'" @click="moveToTrash(category)" class="tw-text-red-600">
                  <Trash2 class="tw-w-5 tw-h-5" />
                </button>
                <button v-if="isGlobalAdmin && currentTab === 'restore'" @click="restoreCategory(category)" class="tw-mr-2 tw-text-[#086df9]">
                  <RefreshCcw class="tw-w-5 tw-h-5" />
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
        Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, sortedCategories.length) }} của {{ sortedCategories.length }} danh mục
      </div>
      <div class="tw-flex tw-gap-2">
        <button
          @click="currentPage = Math.max(currentPage - 1, 1)"
          :disabled="currentPage === 1"
          class="tw-px-3 tw-py-1 tw-rounded tw-bg-[#086df9] tw-text-white disabled:tw-opacity-50 hover:tw-bg-blue-700"
        >
          <ArrowLeft class="tw-w-4 tw-h-4" />
        </button>
        <span class="tw-px-3 tw-py-1 tw-text-sm dark:tw-text-white">Trang {{ currentPage }} / {{ totalPages }}</span>
        <button
          @click="currentPage = Math.min(currentPage + 1, totalPages)"
          :disabled="currentPage === totalPages"
          class="tw-px-3 tw-py-1 tw-rounded tw-bg-[#086df9] tw-text-white disabled:tw-opacity-50 hover:tw-bg-blue-700"
        >
          <ArrowRight class="tw-w-4 tw-h-4" />
        </button>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="modal.open" class="tw-fixed tw-inset-0 tw-bg-black/30 tw-flex tw-items-center tw-justify-center tw-z-50" @click.self="closeModal">
      <div class="tw-bg-white dark:tw-bg-gray-800 tw-rounded-lg tw-shadow-lg tw-w-full tw-max-w-lg tw-p-6 tw-relative tw-max-h-[80vh] tw-overflow-y-auto">
        <button @click="closeModal" class="tw-absolute tw-top-2 tw-right-2 tw-text-[#086df9] hover:tw-text-blue-700">
          <X class="tw-w-5 tw-h-5" />
        </button>
        <h2 class="tw-text-xl tw-font-bold tw-mb-4 dark:tw-text-white tw-flex tw-items-center">
          <span class="tw-mr-2">
            <Info v-if="modal.mode === 'view'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
            <Edit v-if="modal.mode === 'edit'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
            <Plus v-if="modal.mode === 'create'" class="tw-w-5 tw-h-5 tw-text-[#086df9]" />
          </span>
          {{ modal.mode === 'view' ? 'Chi tiết danh mục' : modal.mode === 'edit' ? 'Chỉnh sửa danh mục' : 'Thêm danh mục' }}
        </h2>

        <div class="tw-space-y-4">
          <div v-if="modal.mode !== 'create'" class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">ID</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Hash class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="modal.category?.category_id"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              />
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Tên danh mục</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Building class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                :disabled="modal.mode === 'view'"
                v-model="modal.category.name"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              />
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Mô tả</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Info class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <textarea
                :disabled="modal.mode === 'view'"
                v-model="modal.category.description"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              ></textarea>
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Danh mục cha</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Link class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <select
                v-model="modal.category.parent_id"
                :disabled="modal.mode === 'view'"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              >
                <option value="null">Không có danh mục cha</option>
                <option v-for="cat in availableCategories" :key="cat.category_id" :value="cat.category_id">
                  {{ cat.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Trạng thái</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Activity class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <select
                v-model="modal.category.status"
                :disabled="modal.mode === 'view'"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Tạm dừng</option>
                <option value="deleted">Đã xóa</option>
              </select>
            </div>
          </div>
          <div v-if="modal.mode !== 'create'" class="tw-relative">
            <label class="tw-block tw-text-sm tw-text-gray-600 dark:tw-text-gray-300 tw-mb-1">Ngày tạo</label>
            <div class="tw-relative">
              <span class="tw-absolute tw-inset-y-0 tw-left-0 tw-flex tw-items-center tw-pl-3">
                <Calendar class="tw-w-4 tw-h-4 tw-text-[#086df9]" />
              </span>
              <input
                type="text"
                disabled
                :value="formatDate(modal.category.created_at)"
                class="tw-w-full tw-border tw-border-[#086df9] tw-rounded tw-pl-10 tw-pr-3 tw-py-2 dark:tw-bg-gray-700 dark:tw-text-white"
              />
            </div>
          </div>
        </div>

        <div class="tw-flex tw-justify-end tw-mt-6 tw-gap-2">
          <button
            @click="closeModal"
            class="tw-bg-gray-300 tw-text-gray-800 tw-px-4 tw-py-2 tw-rounded hover:tw-bg-gray-400 tw-flex tw-items-center"
          >
            <X class="tw-w-4 tw-h-4 tw-mr-2" /> Đóng
          </button>
          <button
            v-if="modal.mode === 'edit'"
            @click="updateCategory"
            class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center"
          >
            <Save class="tw-w-4 tw-h-4 tw-mr-2" /> Lưu
          </button>
          <button
            v-if="modal.mode === 'create'"
            @click="createCategory"
            class="tw-bg-[#086df9] tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-blue-700 tw-flex tw-items-center"
          >
            <Plus class="tw-w-4 tw-h-4 tw-mr-2" /> Tạo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
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
  Link,
  Plus,
} from 'lucide-vue-next';

interface Category {
  category_id?: number;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'deleted';
  parent_id?: number;
  created_at?: string;
}

const categories = ref<Category[]>([]);
const modal = ref<{ open: boolean; mode: 'view' | 'edit' | 'create'; category: Category }>({
  open: false,
  mode: 'view',
  category: {} as Category,
});
const currentPage = ref(1);
const itemsPerPage = 20;
const currentTab = ref('list');
const availableCategories = computed(() => categories.value.filter(c => c.status !== 'deleted'));

// Lấy role từ localStorage/sessionStorage
const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
const isGlobalAdmin = computed(() => user && user.role === 'global_admin');

// Format date function
const formatDate = (dateStr?: string): string => {
  if (!dateStr || dateStr === '') return '-';
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? '-' : date.toLocaleDateString('vi-VN');
};

// Lọc categories dựa trên tab hiện tại
const filteredCategories = computed(() => {
  if (currentTab.value === 'list') {
    return categories.value.filter(c => c.status === 'active' || c.status === 'inactive');
  } else {
    return categories.value.filter(c => c.status === 'deleted');
  }
});

// Sắp xếp categories theo created_at giảm dần
const sortedCategories = computed(() =>
  [...filteredCategories.value].sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  })
);

// Tính toán dữ liệu phân trang
const totalPages = computed(() => Math.ceil(sortedCategories.value.length / itemsPerPage));
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return sortedCategories.value.slice(start, end);
});

const openModal = (mode: 'view' | 'edit', category: Category) => {
  modal.value = {
    open: true,
    mode,
    category: { ...category },
  };
};

const openCreateModal = () => {
  modal.value = {
    open: true,
    mode: 'create',
    category: {
      name: '',
      description: '',
      status: 'active',
      parent_id: null,
    },
  };
};

const closeModal = () => {
  modal.value.open = false;
};
const token = localStorage.getItem('token') || sessionStorage.getItem('token');

const fetchCategories = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Lỗi khi gọi API');
    const { data } = await res.json();
    categories.value = data;
    console.log('Fetched categories:', data);
  } catch (err) {
    console.error('Lỗi khi tải danh mục:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể tải danh sách danh mục!',
      confirmButtonColor: '#086df9',
    });
  }
};

const createCategory = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories`, {
      method: 'POST',
      headers: {
         'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`

       },
      body: JSON.stringify(modal.value.category),
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Lỗi khi tạo danh mục');
      console.log('Error data:', errorData);
      
    }
    await fetchCategories();
    closeModal();
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Tạo danh mục thành công!',
      confirmButtonColor: '#086df9',
    });
  } catch (err) {
    console.error('Lỗi tạo:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể tạo danh mục!',
      confirmButtonColor: '#086df9',
    });
  }
};

const updateCategory = async () => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${modal.value.category.category_id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
       },
      body: JSON.stringify(modal.value.category),
    });
    if (!res.ok) throw new Error('Lỗi khi cập nhật');
    await fetchCategories();
    closeModal();
    Swal.fire({
      icon: 'success',
      title: 'Thành công',
      text: 'Cập nhật danh mục thành công!',
      confirmButtonColor: '#086df9',
    });
  } catch (err) {
    console.error('Lỗi cập nhật:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể cập nhật danh mục!',
      confirmButtonColor: '#086df9',
    });
  }
};

const moveToTrash = async (category: Category) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn chuyển danh mục ${category.name} vào thùng rác?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Chuyển',
    cancelButtonText: 'Hủy',
  });
  if (result.isConfirmed) {
    try {
      const updatedCategory = { ...category, status: 'deleted' };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${category.category_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify(updatedCategory),
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật');
      await fetchCategories();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Danh mục đã được chuyển vào thùng rác!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể chuyển danh mục!',
        confirmButtonColor: '#086df9',
      });
    }
  }
};

const restoreCategory = async (category: Category) => {
  const result = await Swal.fire({
    title: 'Xác nhận',
    text: `Bạn có chắc muốn khôi phục danh mục ${category.name}?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#086df9',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Khôi phục',
    cancelButtonText: 'Hủy',
  });
  if (result.isConfirmed) {
    try {
      const updatedCategory = { ...category, status: 'active' };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${category.category_id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify(updatedCategory),
      });
      if (!res.ok) throw new Error('Lỗi khi cập nhật');
      await fetchCategories();
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Danh mục đã được khôi phục!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể khôi phục danh mục!',
        confirmButtonColor: '#086df9',
      });
    }
  }
};

const permanentlyDelete = async (category: Category) => {
  const result = await Swal.fire({
    title: 'Xác nhận xóa vĩnh viễn',
    text: `Bạn có chắc muốn xóa vĩnh viễn danh mục ${category.name}? Hành động này không thể hoàn tác.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Xóa vĩnh viễn',
    cancelButtonText: 'Hủy',
  });
  if (result.isConfirmed) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/categories/${category.category_id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
         },
      });
      if (!res.ok) throw new Error('Lỗi xóa');
      await fetchCategories();
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa',
        text: 'Danh mục đã được xóa vĩnh viễn!',
        confirmButtonColor: '#086df9',
      });
    } catch (err) {
      console.error('Lỗi xóa:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: 'Không thể xóa danh mục!',
        confirmButtonColor: '#086df9',
      });
    }
  }
};

onMounted(() => {
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
}
</style>