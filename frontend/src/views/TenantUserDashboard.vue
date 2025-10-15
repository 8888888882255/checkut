<template>
  <div class="min-h-screen bg-gray-50">
    <div class="tw-flex tw-flex-col md:tw-flex-row tw-gap-8 tw-w-full tw-py-8">
      <!-- Upload Card -->
      <div class="tw-bg-white tw-rounded-lg tw-shadow tw-p-8 tw-flex-1 tw-flex tw-flex-col tw-items-center tw-justify-center tw-border tw-border-gray-200 tw-w-full tw-max-w-5xl tw-mx-auto">
        <h2 class="tw-text-2xl tw-font-bold tw-mb-4 tw-text-blue-700">Tải lên tệp tin</h2>
        <!-- Alert trạng thái dịch vụ -->
        <div v-if="activationStatus" class="tw-w-full tw-mb-6">
          <div v-if="activationStatus.isActivated" class="tw-bg-green-50 tw-border tw-border-green-200 tw-rounded-lg tw-p-4">
            <div class="tw-flex tw-items-center">
              <svg class="tw-w-5 tw-h-5 tw-text-green-600 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h3 class="tw-text-sm tw-font-semibold tw-text-green-800">Dịch vụ đã được kích hoạt</h3>
                <p class="tw-text-sm tw-text-green-700 tw-mt-1">
                  <span v-if="getStoredUser()?.role === 'tenant_admin'">
                    ✅ Bạn đã mua gói dịch vụ và kích hoạt cho toàn bộ tenant
                  </span>
                  <span v-else>
                    ✅ Tenant Admin đã mua gói dịch vụ và kích hoạt cho bạn
                  </span>
                  <br>
                  <span class="tw-font-medium">Gói:</span> {{ activationStatus.package?.name }} |
                  <span class="tw-font-medium">Lưu trữ:</span> {{ formatFileSize(activationStatus.usage?.file_size || 0) }} / {{ formatFileSize(activationStatus.limits?.file_storage_limit || 0) }}
                </p>
              </div>
            </div>
          </div>
          <div v-else class="tw-bg-yellow-50 tw-border tw-border-yellow-200 tw-rounded-lg tw-p-4">
            <div class="tw-flex tw-items-center">
              <svg class="tw-w-5 tw-h-5 tw-text-yellow-600 tw-mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
              </svg>
              <div>
                <h3 class="tw-text-sm tw-font-semibold tw-text-yellow-800">Dịch vụ chưa được kích hoạt</h3>
                <p class="tw-text-sm tw-text-yellow-700 tw-mt-1">
                  <span v-if="getStoredUser()?.role === 'tenant_admin'">
                    {{ activationStatus.message || 'Vui lòng mua gói dịch vụ để kích hoạt tính năng upload file cho toàn bộ tenant.' }}
                  </span>
                  <span v-else>
                    {{ activationStatus.message || 'Tenant Admin chưa mua gói dịch vụ. Vui lòng liên hệ Tenant Admin để mua gói và kích hoạt tính năng upload file.' }}
                  </span>
                </p>
                <button v-if="getStoredUser()?.role === 'tenant_admin'" @click="goToShop" class="tw-mt-2 tw-text-sm tw-text-yellow-800 hover:tw-text-yellow-900 tw-underline">
                  Mua gói dịch vụ ngay
                </button>
              </div>
            </div>
          </div>
        </div>
        <!-- Khung upload file -->
        <div v-if="activationStatus?.isActivated" class="tw-w-full">
          <FileUpload
            :tenant-id="getStoredUser()?.tenant_id"
            :user-id="getStoredUser()?.user_id"
            :package-id="activationStatus.package?.package_id"
            @upload-success="handleUploadSuccess"
            @upload-error="handleUploadError"
          />
        </div>
      </div>
 
    
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useFileUpload } from '../composables/useFileUpload'
import { useServiceData } from '../composables/useServiceData'
import FileUpload from '../components/FileUpload.vue'
import axios from 'axios'

const usage = ref({ used: 0, limit: 0 })
const activationStatus = ref(null)

const { formatFileSize } = useServiceData()

function getStoredUser() {
  const userStr = sessionStorage.getItem('user') || localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

function goToShop() {
  window.location.href = '/shop'
}

async function checkActivationStatus() {
  try {
    const { checkTenantActivation } = useServiceData()
    const data = await checkTenantActivation()
    activationStatus.value = data
  } catch (err) {
    activationStatus.value = null
  }
}

function handleUploadSuccess() {
  checkActivationStatus()
}

function handleUploadError(error) {
  // Có thể show toast hoặc log lỗi
  console.error('Upload error:', error)
}

onMounted(async () => {
  await checkActivationStatus()
})

function isImage(file) {
  return file.mimeType?.startsWith('image/') || file.originalName?.match(/\.(jpg|jpeg|png|gif|webp)$/i)
}
</script> 