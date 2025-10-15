<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-float"></div>
      <div class="absolute top-40 right-32 w-24 h-24 bg-purple-200 rounded-full opacity-20 animate-float-delayed"></div>
      <div class="absolute bottom-32 left-40 w-28 h-28 bg-indigo-200 rounded-full opacity-20 animate-float"></div>
    </div>

    <div class="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl text-center max-w-md w-full border border-white/20">
      <!-- Success Icon with animation -->
      <div class="mb-6 relative">
        <div class="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto flex items-center justify-center animate-bounce-in">
          <svg class="w-10 h-10 text-white animate-check-mark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <!-- Pulse effect -->
        <div class="absolute inset-0 w-20 h-20 bg-green-400 rounded-full mx-auto animate-pulse-ring"></div>
      </div>

      <!-- Success Message -->
      <h1 class="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4 animate-fade-in">
        Thanh toán thành công!
      </h1>

      <!-- Celebration emoji -->
      <div class="text-4xl mb-4 animate-bounce">🎉</div>

      <!-- Package Info -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6 border border-blue-100">
        <p class="text-gray-700 mb-3 text-lg">
          Cảm ơn bạn đã mua gói:
        </p>
        <p class="text-2xl font-bold text-indigo-700 mb-4">{{ packageName }}</p>
        
        <div class="flex items-center justify-center mb-3">
          <span class="text-sm text-gray-500 mr-2">Tổng tiền:</span>
          <span class="text-2xl font-bold text-green-600">{{ formatPrice(price) }}</span>
        </div>
        
        <div class="flex items-center justify-center text-sm text-gray-500 mb-4">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          Mã đơn hàng: {{ purchaseId }}
        </div>

        <!-- Service Data Activation Status -->
        <div class="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-semibold text-green-700">Dịch vụ đã được kích hoạt!</span>
          </div>
          <p class="text-xs text-green-600">
            Gói data đã được kích hoạt cho tất cả người dùng trong tenant. Bạn có thể bắt đầu upload file, ảnh và sử dụng các tính năng khác.
          </p>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          @click="goHome"
          class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg transform transition-all duration-200 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <span class="flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Về trang chủ
          </span>
        </button>
        
        <button
          @click="checkActivationStatus"
          :disabled="checkingStatus"
          class="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-6 rounded-2xl font-medium transition-all duration-200 hover:from-green-700 hover:to-emerald-700 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="flex items-center justify-center">
            <svg v-if="checkingStatus" class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            {{ checkingStatus ? 'Đang kiểm tra...' : 'Kiểm tra trạng thái dịch vụ' }}
          </span>
        </button>
        
        <button
          @click="downloadReceipt"
          class="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-2xl font-medium transition-all duration-200 hover:bg-gray-200 hover:shadow-md"
        >
          <span class="flex items-center justify-center">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Tải hóa đơn
          </span>
        </button>
      </div>

      <!-- Service Status Details -->
      <div v-if="activationStatus" class="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h3 class="text-sm font-semibold text-blue-800 mb-2">Chi tiết dịch vụ:</h3>
        <div class="text-xs text-blue-700 space-y-1">
          <p><strong>Gói:</strong> {{ activationStatus.package?.name }}</p>
          <p><strong>Giới hạn lưu trữ:</strong> {{ formatStorage(activationStatus.limits?.file_storage_limit) }}</p>
          <p><strong>Giới hạn băng thông:</strong> {{ formatStorage(activationStatus.limits?.bandwidth_limit) }}</p>
          <p v-if="activationStatus.limits?.database_limit"><strong>Giới hạn database:</strong> {{ activationStatus.limits.database_limit }}</p>
          <p v-if="activationStatus.limits?.api_call_limit"><strong>Giới hạn API calls:</strong> {{ activationStatus.limits.api_call_limit }}</p>
        </div>
      </div>

      <!-- Thank you message -->
      <p class="text-sm text-gray-500 mt-6 italic">
        Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi! ❤️
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useServiceData } from '../composables/useServiceData';
import { toast } from 'vue3-toastify';

const router = useRouter();
const { checkTenantActivation, formatFileSize } = useServiceData();

const purchaseId = ref('');
const packageName = ref('');
const price = ref(0);
const activationStatus = ref(null);
const checkingStatus = ref(false);

const formatPrice = (price) => {
  if (!price) return '$0.00';
  
  // Chuyển đổi từ VND sang USD (giả sử tỷ giá 1 USD = 24,000 VND)
  const exchangeRate = 24000;
  const usdPrice = price / exchangeRate;
  
  // Format theo USD
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(usdPrice);
};

const formatStorage = (bytes) => {
  if (!bytes || bytes === 0) return 'Không giới hạn';
  return formatFileSize(bytes);
};

const goHome = () => {
  router.push('/');
};

const checkActivationStatus = async () => {
  checkingStatus.value = true;
  try {
    const data = await checkTenantActivation();
    activationStatus.value = data;
    if (data.isActivated) {
      toast.success('Dịch vụ đã được kích hoạt thành công!', {
        timeout: 3000,
      });
    } else {
      toast.warning('Dịch vụ chưa được kích hoạt. Vui lòng thử lại sau.', {
        timeout: 3000,
      });
    }
  } catch (error) {
    console.error('Error checking activation status:', error);
    toast.error('Có lỗi khi kiểm tra trạng thái dịch vụ.', {
      timeout: 3000,
    });
  } finally {
    checkingStatus.value = false;
  }
};

const downloadReceipt = () => {
    window.location.href = `http://localhost:3000/api/user-purchases/invoice-pdf/${purchaseId.value}`;
  console.log('Downloading receipt...');
};

onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  purchaseId.value = urlParams.get('purchase_id') || 'PH' + Date.now();
  packageName.value = decodeURIComponent(urlParams.get('package_name') || 'Gói Premium');
  price.value = parseFloat(urlParams.get('price') || 299000);
  
  // Tự động kiểm tra trạng thái kích hoạt sau 2 giây
  setTimeout(() => {
    checkActivationStatus();
  }, 2000);
});
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes float-delayed {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(-3deg); }
}

@keyframes bounce-in {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.3; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes check-mark {
  0% { stroke-dasharray: 0, 100; }
  100% { stroke-dasharray: 100, 0; }
}

@keyframes fade-in {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out;
}

.animate-pulse-ring {
  animation: pulse-ring 2s ease-out infinite;
}

.animate-check-mark {
  stroke-dasharray: 100;
  animation: check-mark 0.8s ease-out 0.3s both;
}

.animate-fade-in {
  animation: fade-in 0.8s ease-out 0.5s both;
}
</style>