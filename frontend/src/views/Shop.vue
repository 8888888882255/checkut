<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    <!-- Main Content -->
    <main class="p-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h1 class="text-3xl font-bold text-slate-800 mb-2">Cửa hàng</h1>
            <p class="text-slate-600">Khám phá các gói dịch vụ phù hợp với nhu cầu của bạn</p>
          </div>
          <button
            @click="isFilterOpen = !isFilterOpen"
            class="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all duration-200 shadow-sm text-slate-700 font-medium"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Bộ lọc
          </button>
        </div>

        <!-- Category Quick Filters -->
        <div class="mb-6">
          <div class="flex flex-wrap gap-3">
            <button
              @click="updateCategory('')"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              :class="{ 
                'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md': filters.category === '',
                'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50': filters.category !== ''
              }"
            >
              Tất cả
            </button>
            <button
              v-for="category in categories"
              :key="category.category_id"
              @click="updateCategory(category.category_id)"
              class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              :class="{ 
                'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md': filters.category === category.category_id,
                'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50': filters.category !== category.category_id
              }"
            >
              {{ category.name }}
            </button>
          </div>
        </div>

        <!-- Advanced Filters -->
        <transition name="slideDown">
          <div v-if="isFilterOpen" class="bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 shadow-sm mb-6">
            <h3 class="text-lg font-semibold text-slate-800 mb-4">Bộ lọc nâng cao</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-3">Loại gói</label>
                <select
                  v-model="filters.package_type"
                  class="w-full border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white transition-all duration-200"
                  @change="fetchPackages"
                >
                  <option value="">Tất cả loại gói</option>
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                  <option value="vip_pro">VIP Pro</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-3">Loại dịch vụ</label>
                <select
                  v-model="filters.service_type"
                  class="w-full border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white transition-all duration-200"
                  @change="fetchPackages"
                >
                  <option value="">Tất cả dịch vụ</option>
                  <option value="vps">VPS</option>
                  <option value="hosting">Hosting</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 mb-3">Sắp xếp theo</label>
                <select
                  v-model="sortBy"
                  class="w-full border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white transition-all duration-200"
                  @change="sortPackages"
                >
                  <option value="name">Tên gói</option>
                  <option value="price_low">Giá thấp đến cao</option>
                  <option value="price_high">Giá cao đến thấp</option>
                  <option value="storage">Dung lượng lưu trữ</option>
                </select>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- Service Packages -->
      <div v-if="loading" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
        <p class="text-slate-600 text-lg">Đang tải gói dịch vụ...</p>
      </div>
      
      <div v-else-if="error" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-red-600 text-lg font-medium">{{ error }}</p>
      </div>
      
      <div v-else-if="packages.length === 0" class="text-center py-16">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clip-rule="evenodd" />
          </svg>
        </div>
        <p class="text-slate-600 text-lg">Không tìm thấy gói phù hợp</p>
        <button
          @click="resetFilters"
          class="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Xóa bộ lọc
        </button>
      </div>
      
      <div v-else class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <div
          v-for="pkg in packages"
          :key="pkg.id"
          class="group bg-white/70 backdrop-blur-sm border border-slate-200/50 rounded-2xl shadow-sm hover:shadow-xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1"
          @click="openModal(pkg)"
        >
          <!-- Package Header -->
          <div class="mb-6">
            <div class="flex items-start justify-between mb-3">
              <h3 class="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors duration-200">{{ pkg.name }}</h3>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">Hoạt động</span>
            </div>
            <div class="flex items-baseline gap-1 mb-2">
              <span class="text-3xl font-bold text-slate-800">${{ Math.floor(pkg.price) }}</span>
              <span class="text-slate-500 text-sm">/{{ pkg.billing_cycle }}</span>
            </div>
          </div>

          <!-- Package Features -->
          <div class="space-y-3 mb-6">
            <div v-if="pkg.cpu" class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <span class="text-slate-700 font-medium">CPU: {{ pkg.cpu }}</span>
            </div>
            <div v-if="pkg.ram" class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <span class="text-slate-700 font-medium">RAM: {{ pkg.ram }}</span>
            </div>
            <div v-if="pkg.file_storage_limit" class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <span class="text-slate-700 font-medium">Storage: {{ formatStorage(pkg.file_storage_limit) }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <span class="text-slate-700 font-medium">Băng thông: {{ formatStorage(pkg.bandwidth_limit) }}</span>
            </div>
          </div>

          <!-- CTA Button -->
          <button class="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md">
            Xem chi tiết
          </button>
        </div>
      </div>
    </main>

    <!-- Modal Popup -->
    <transition name="modal">
      <div v-if="modalOpen" class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
          <button
            @click="closeModal"
            class="absolute top-6 right-6 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full p-2 transition-all duration-200"
            title="Đóng"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>

          <!-- Modal Header -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-slate-800 mb-2">{{ selectedPackage.name }}</h2>
            <div class="flex items-center gap-4 mb-4">
              <span class="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">{{ selectedPackage.category_name || 'Chưa xác định' }}</span>
              <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">{{ selectedPackage.package_type }}</span>
            </div>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-bold text-slate-800">${{ Math.floor(selectedPackage.price) }}</span>
              <span class="text-slate-500">/{{ selectedPackage.billing_cycle }}</span>
            </div>
          </div>

          <!-- Package Features -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div v-if="selectedPackage.cpu" class="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
              <div class="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <div>
                <p class="text-slate-600 text-sm">CPU</p>
                <p class="font-semibold text-slate-800">{{ selectedPackage.cpu }}</p>
              </div>
            </div>
            <div v-if="selectedPackage.ram" class="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
              <div class="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <div>
                <p class="text-slate-600 text-sm">RAM</p>
                <p class="font-semibold text-slate-800">{{ selectedPackage.ram }}</p>
              </div>
            </div>
            <div v-if="selectedPackage.file_storage_limit" class="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
              <div class="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <div>
                <p class="text-slate-600 text-sm">Storage</p>
                <p class="font-semibold text-slate-800">{{ formatStorage(selectedPackage.file_storage_limit) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 p-4 bg-orange-50 rounded-xl">
              <div class="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <div>
                <p class="text-slate-600 text-sm">Băng thông</p>
                <p class="font-semibold text-slate-800">{{ formatStorage(selectedPackage.bandwidth_limit) }}</p>
              </div>
            </div>
            <div v-if="selectedPackage.database_limit" class="flex items-center gap-4 p-4 bg-indigo-50 rounded-xl">
              <div class="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <div>
                <p class="text-slate-600 text-sm">Cơ sở dữ liệu</p>
                <p class="font-semibold text-slate-800">{{ selectedPackage.database_limit }}</p>
              </div>
            </div>
            <div v-if="selectedPackage.api_call_limit" class="flex items-center gap-4 p-4 bg-rose-50 rounded-xl">
              <div class="w-10 h-10 bg-rose-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
              </div>
              <div>
                <p class="text-slate-600 text-sm">API Calls</p>
                <p class="font-semibold text-slate-800">{{ selectedPackage.api_call_limit }}</p>
              </div>
            </div>
          </div>

          <!-- Order Summary -->
          <div class="bg-slate-50 rounded-2xl p-6 mb-8">
            <h3 class="text-lg font-bold text-slate-800 mb-4">Tóm tắt đơn hàng</h3>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between">
                <span class="text-slate-600">Tên gói:</span>
                <span class="font-medium text-slate-800">{{ selectedPackage.name }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Loại gói:</span>
                <span class="font-medium text-slate-800">{{ selectedPackage.package_type }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Chu kỳ thanh toán:</span>
                <span class="font-medium text-slate-800">{{ selectedPackage.billing_cycle }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-600">Phí cài đặt:</span>
                <span class="font-medium text-slate-800">$0.00</span>
              </div>
              <div class="border-t border-slate-200 pt-3">
                <div class="flex justify-between items-center">
                  <span class="font-bold text-slate-800">Tổng tiền:</span>
                  <span class="text-2xl font-bold text-blue-600">${{ Math.floor(selectedPackage.price) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <transition name="slideDown">
            <div v-if="showPaymentForm" class="bg-blue-50 rounded-2xl p-6 mb-6">
              <h3 class="text-lg font-bold text-slate-800 mb-4">Thông tin thanh toán</h3>
              <div class="mb-4">
                <label class="block text-sm font-semibold text-slate-700 mb-3">Phương thức thanh toán</label>
                <select v-model="paymentMethod" class="w-full border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm p-3 bg-white">
                  <option value="paypal">PayPal</option>
                </select>
              </div>
              <button
                @click="processPayment"
                class="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Xác nhận thanh toán
              </button>
            </div>
          </transition>

          <!-- Action Buttons -->
          <div v-if="!showPaymentForm" class="flex gap-4">
            <button
              @click="closeModal"
              class="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Hủy
            </button>
            <button
              @click="showPaymentForm = true"
              :disabled="selectedPackage.status !== 'active'"
              class="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 disabled:bg-slate-400 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
            >
              Thanh toán ngay
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

const packages = ref([]);
const loading = ref(false);
const error = ref(null);
const filters = ref({
  package_type: '',
  service_type: '',
  category: '',
});
const categories = ref([]);
const isFilterOpen = ref(false);
const modalOpen = ref(false);
const selectedPackage = ref({});
const showPaymentForm = ref(false);
const paymentMethod = ref('paypal');
const sortBy = ref('name');
const urlBase = import.meta.env.VITE_API_URL;

const getToken = () => {
  return (
    sessionStorage.getItem('token') ||
    document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1] ||
    localStorage.getItem('token')
  );
};

const getStoredUser = () => {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const clearTokens = () => {
  sessionStorage.removeItem('token');
  localStorage.removeItem('token');
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

const checkPaymentStatus = async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const paymentId = urlParams.get('paymentId');
  const payerId = urlParams.get('PayerID');

  if (paymentId && payerId) {
    try {
      const token = getToken();
      const response = await fetch(`${urlBase}/api/user-purchases/paypal/success?paymentId=${paymentId}&PayerID=${payerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Không thể xác nhận thanh toán');
      }

      const result = await response.json();
      toast.success(`Thanh toán thành công cho gói ${result.package_name}! Tổng tiền: $${Math.floor(result.price)}`, {
        timeout: 5000,
      });

      window.history.replaceState({}, document.title, window.location.pathname);
    } catch (error) {
      console.error('Lỗi xác nhận thanh toán:', error);
      toast.error(`Lỗi khi xác nhận thanh toán: ${error.message}`);
    }
  }
};

const fetchPackages = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = new URLSearchParams();
    if (filters.value.package_type) params.append('package_type', filters.value.package_type);
    if (filters.value.service_type) params.append('service_type', filters.value.service_type);
    if (filters.value.category) params.append('category_id', filters.value.category);
    params.append('status', 'active');

    const token = getToken();
    if (!token) {
      error.value = 'Vui lòng đăng nhập để xem gói dịch vụ.';
      return;
    }

    const res = await fetch(`${urlBase}/api/service-packages?${params.toString()}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearTokens();
        window.location.href = '/login';
        return;
      }
      throw new Error(`Lỗi ${res.status}`);
    }

    const data = await res.json();
    packages.value = data.data.map(pkg => ({
      id: pkg.package_id,
      name: pkg.name,
      price: pkg.price,
      billing_cycle: pkg.billing_cycle || 'Chưa xác định',
      package_type: pkg.package_type,
      service_type: pkg.service_type,
      file_storage_limit: pkg.file_storage_limit || 'Chưa xác định',
      bandwidth_limit: pkg.bandwidth_limit || 'Chưa xác định',
      database_limit: pkg.database_limit || 'Chưa xác định',
      api_call_limit: pkg.api_call_limit || 'Chưa xác định',
      category_name: categories.value.find(cat => cat.category_id === pkg.category_id)?.name || 'Chưa xác định',
      status: pkg.status || 'pending',
      hostname: pkg.hostname || 'interdata1749627983',
      root_password: pkg.root_password || 'Mật khẩu Root',
      os: pkg.os || 'WPTangToc-OLS-6.4.2',
      cpu: pkg.cpu,
      ram: pkg.ram,
      network: pkg.network,
    }));
  } catch (err) {
    error.value = err.message || 'Lỗi khi tải dữ liệu.';
  } finally {
    loading.value = false;
  }
};

const fetchCategories = async () => {
  try {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${urlBase}/api/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      if (res.status === 401) {
        clearTokens();
        window.location.href = '/login';
        return;
      }
      throw new Error(`Lỗi ${res.status}`);
    }

    const data = await res.json();
    categories.value = data.data;
  } catch (err) {
    console.error('Lỗi khi tải danh mục:', err);
  }
};

const updateCategory = (categoryId) => {
  filters.value.category = categoryId;
  fetchPackages();
};

const sortPackages = () => {
  const sortedPackages = [...packages.value];
  
  switch (sortBy.value) {
    case 'price_low':
      sortedPackages.sort((a, b) => a.price - b.price);
      break;
    case 'price_high':
      sortedPackages.sort((a, b) => b.price - a.price);
      break;
    case 'storage':
      sortedPackages.sort((a, b) => {
        const aStorage = parseInt(a.file_storage_limit) || 0;
        const bStorage = parseInt(b.file_storage_limit) || 0;
        return bStorage - aStorage;
      });
      break;
    case 'name':
    default:
      sortedPackages.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
      break;
  }
  
  packages.value = sortedPackages;
};

const resetFilters = () => {
  filters.value = {
    package_type: '',
    service_type: '',
    category: '',
  };
  sortBy.value = 'name';
  fetchPackages();
};

const formatStorage = (bytes) => {
  const numericBytes = Number(bytes);
  if (isNaN(numericBytes) || numericBytes < 0) {
    return 'Dữ liệu không hợp lệ';
  }
  if (numericBytes === 0) return 'Không giới hạn';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = numericBytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

const processPayment = async () => {
  if (paymentMethod.value !== 'paypal') {
    toast.error('Phương thức thanh toán không được hỗ trợ.');
    return;
  }

  let user;
  try {
    const token = getToken();
    if (!token) {
      toast.error('Vui lòng đăng nhập để tiếp tục.');
      window.location.href = '/login';
      return;
    }

    const response = await fetch(`${urlBase}/api/users/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        clearTokens();
        window.location.href = '/login';
        return;
      }
      throw new Error(`Lỗi lấy thông tin người dùng: ${response.status} - ${await response.text()}`);
    }

    user = await response.json();
    console.log('API User Response:', user); // Debug log
  } catch (error) {
    console.error('Lỗi lấy thông tin người dùng:', error);
    const storedUser = getStoredUser();
    if (storedUser && storedUser.user_id && storedUser.tenant_id) {
      user = storedUser;
      console.warn('Falling back to stored user data:', user);
    } else {
      toast.error('Không thể lấy thông tin người dùng. Vui lòng thử lại.');
      return;
    }
  }

  if (!user?.user_id || !user?.tenant_id) {
    console.error('Thiếu thông tin người dùng:', { user_id: user?.user_id, tenant_id: user?.tenant_id });
    toast.error('Thông tin người dùng không đầy đủ. Vui lòng đăng nhập lại.');
    return;
  }

  if (!selectedPackage.value?.id) {
    toast.error('Vui lòng chọn một gói trước khi thanh toán.');
    return;
  }

  try {
    const token = getToken();
    const createPurchaseResponse = await fetch(`${urlBase}/api/user-purchases`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({
        user_id: user.user_id,
        package_id: selectedPackage.value.id,
        tenant_id: user.tenant_id,
        status: 'pending',
        start_date: new Date().toISOString(),
      }),
    });

    if (!createPurchaseResponse.ok) {
      const errorText = await createPurchaseResponse.text();
      if (createPurchaseResponse.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        clearTokens();
        window.location.href = '/login';
        return;
      }
      throw new Error(`Lỗi tạo đơn hàng: ${createPurchaseResponse.status} - ${errorText}`);
    }

    const purchaseData = await createPurchaseResponse.json();
    const purchaseId = purchaseData.purchase_id;

    const payPalResponse = await fetch(`${urlBase}/api/user-purchases/paypal/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      credentials: 'include',
      body: JSON.stringify({ purchaseId }),
    });

    if (!payPalResponse.ok) {
      const errorText = await payPalResponse.text();
      if (payPalResponse.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        clearTokens();
        window.location.href = '/login';
        return;
      }
      throw new Error(`Lỗi tạo đơn hàng PayPal: ${payPalResponse.status} - ${errorText}`);
    }

    const payPalData = await payPalResponse.json();
    if (payPalData.approval_url) {
      window.location.href = payPalData.approval_url;
    } else {
      throw new Error('Không nhận được URL xác nhận từ PayPal.');
    }
  } catch (error) {
    console.error('Lỗi trong quá trình thanh toán:', error);
    toast.error(`Lỗi khi thanh toán: ${error.message}`);
  } finally {
    showPaymentForm.value = false;
  }
};

const openModal = (pkg) => {
  selectedPackage.value = pkg;
  modalOpen.value = true;
};

const closeModal = () => {
  modalOpen.value = false;
  showPaymentForm.value = false;
};

onMounted(() => {
  fetchPackages();
  fetchCategories();
  checkPaymentStatus();
});
</script>

<style scoped>
/* Font and Base Styles */
body { 
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
}

/* Smooth Transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Slide Down Animation */
.slideDown-enter-active,
.slideDown-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.slideDown-enter-from {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}

.slideDown-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}

/* Fade Animation */
.fade-enter-active, 
.fade-leave-active { 
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
}

.fade-enter-from, 
.fade-leave-to { 
  opacity: 0; 
}

/* Modal Animation */
.modal-enter-active, 
.modal-leave-active { 
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
}

.modal-enter-from, 
.modal-leave-to { 
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Enhanced Shadows */
.shadow-glow { 
  box-shadow: 0 4px 20px rgba(59, 130, 246, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05); 
}

.hover\:shadow-xl:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Backdrop Blur Support */
.backdrop-blur-sm {
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

/* Smooth Hover Effects */
.group:hover .group-hover\:text-blue-600 {
  color: rgb(37 99 235);
}

/* Custom Gradient Backgrounds */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Smooth Scroll */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background-color: rgba(156, 163, 175, 0.5);
}

/* Loading Animation Enhancement */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Enhanced Focus States */
select:focus,
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Card Hover Effects */
.hover\:-translate-y-1:hover {
  transform: translateY(-0.25rem);
}

/* Smooth Color Transitions */
.transition-colors {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Button Enhancements */
button {
  position: relative;
  overflow: hidden;
}

button:active {
  transform: scale(0.98);
}

/* Responsive Grid Improvements */
@media (max-width: 768px) {
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  
  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1280px) {
  .xl\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Text Truncation */
.truncate { 
  overflow: hidden; 
  text-overflow: ellipsis; 
  white-space: nowrap; 
}

/* Glass Effect for Cards */
.bg-white\/70 {
  background-color: rgba(255, 255, 255, 0.7);
}

.bg-white\/80 {
  background-color: rgba(255, 255, 255, 0.8);
}

/* Border Opacity */
.border-slate-200\/50 {
  border-color: rgba(226, 232, 240, 0.5);
}

/* Enhanced Spacing */
.space-y-3 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.75rem;
}

.space-y-2 > :not([hidden]) ~ :not([hidden]) {
  margin-top: 0.5rem;
}

/* Modal Scrolling */
.max-h-\[90vh\] {
  max-height: 90vh;
}

/* Improved Button States */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:disabled:hover {
  transform: none;
}

/* Enhanced Package Feature Icons */
.w-8.h-8 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2rem;
  min-height: 2rem;
}

.w-10.h-10 {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 2.5rem;
  min-height: 2.5rem;
}
</style>