<template>
  <div class="file-upload-container">
    <!-- Upload Area -->
    <div class="upload-area">
      <div
        @drop.prevent="handleDrop"
        @dragover.prevent="dragover = true"
        @dragleave.prevent="dragover = false"
        :class="[
          'upload-zone',
          { 'drag-over': dragover },
          { 'uploading': uploading }
        ]"
      >
        <input
          ref="fileInput"
          type="file"
          @change="handleFileSelect"
          accept="image/*,.pdf,.txt,.doc,.docx,.xls,.xlsx"
          class="hidden"
        />
        
        <div v-if="!uploading" class="upload-content">
          <div class="upload-icon">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
          <div class="upload-text">
            <p class="text-lg font-medium text-gray-900">
              Kéo thả file vào đây hoặc
              <button
                @click="$refs.fileInput.click()"
                class="text-blue-600 hover:text-blue-700 underline"
              >
                chọn file
              </button>
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Hỗ trợ: JPG, PNG, GIF, WebP, PDF, TXT, DOC, DOCX, XLS, XLSX (tối đa 50MB)
            </p>
          </div>
        </div>

        <!-- Upload Progress -->
        <div v-if="uploading" class="upload-progress">
          <div class="progress-icon">
            <svg class="w-8 h-8 text-blue-600 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <div class="progress-text">
            <p class="text-lg font-medium text-gray-900">Đang upload...</p>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <p class="text-sm text-gray-500">{{ uploadProgress }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <div class="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
        <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <span class="text-red-800">{{ error }}</span>
      </div>
    </div>

    <!-- Files List -->
    <div v-if="files.length > 0" class="files-list">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Files đã upload</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="file in files"
          :key="file.name"
          class="file-card bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <!-- File Preview -->
          <div class="file-preview mb-3">
            <div v-if="isImage(file.mimeType || '')" class="image-preview">
              <img
                :src="file.fileUrl"
                :alt="file.originalName"
                class="w-full h-32 object-cover rounded-lg"
                @error="handleImageError"
              />
            </div>
            <div v-else class="file-icon">
              <div class="text-4xl">{{ getFileIcon(file.mimeType || '') }}</div>
            </div>
          </div>

          <!-- File Info -->
          <div class="file-info">
            <h4 class="font-medium text-gray-900 truncate" :title="file.originalName">
              {{ file.originalName }}
            </h4>
            <p class="text-sm text-gray-500">{{ formatFileSize(file.size) }}</p>
            <p class="text-xs text-gray-400">{{ new Date(file.lastModified || file.uploadDate).toLocaleDateString() }}</p>
          </div>

          <!-- File Actions -->
          <div class="file-actions mt-3 flex space-x-2">
            <button
              @click="downloadFile(file)"
              class="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Tải
            </button>
            <button
              @click="deleteFileHandler(file.name)"
              class="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useFileUpload } from '../composables/useFileUpload'
import { toast } from 'vue3-toastify'

const props = defineProps({
  tenantId: {
    type: [Number, String],
    required: true
  },
  userId: {
    type: [Number, String],
    required: true
  },
  packageId: {
    type: [Number, String],
    required: true
  }
})

const emit = defineEmits(['upload-success', 'upload-error'])

const {
  files,
  uploading,
  error,
  uploadProgress,
  uploadFile,
  getFiles,
  deleteFile,
  getFileUrl,
  formatFileSize,
  getFileIcon,
  isImage,
  validateFile
} = useFileUpload()

const dragover = ref(false)
const fileInput = ref(null)

// Load files on mount
onMounted(async () => {
  try {
    await getFiles(props.tenantId, props.userId, props.packageId)
  } catch (err) {
    console.error('Error loading files:', err)
  }
})

// Watch for upload success
watch(uploading, (newValue, oldValue) => {
  if (oldValue && !newValue && !error.value) {
    toast.success('Upload file thành công!')
    emit('upload-success')
  }
})

// Watch for errors
watch(error, (newError) => {
  if (newError) {
    toast.error(newError)
    emit('upload-error', newError)
  }
})

const handleDrop = (e) => {
  dragover.value = false
  const droppedFiles = Array.from(e.dataTransfer.files)
  if (droppedFiles.length > 0) {
    processFile(droppedFiles[0])
  }
}

const handleFileSelect = (e) => {
  const selectedFiles = Array.from(e.target.files)
  if (selectedFiles.length > 0) {
    processFile(selectedFiles[0])
  }
}

const processFile = async (file) => {
  try {
    // Validate file
    validateFile(file)
    
    // Upload file
    await uploadFile(file, props.tenantId, props.userId, props.packageId)
  } catch (err) {
    console.error('Error processing file:', err)
    toast.error(err.message || 'Có lỗi xảy ra khi xử lý file')
  }
}

const downloadFile = async (file) => {
  try {
    const url = await getFileUrl(file.name)
    const link = document.createElement('a')
    link.href = url
    link.download = file.originalName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (err) {
    console.error('Error downloading file:', err)
    toast.error('Có lỗi xảy ra khi tải file')
  }
}

const deleteFileHandler = async (objectName) => {
  if (!confirm('Bạn có chắc chắn muốn xóa file này?')) return;
  try {
    await deleteFile(objectName, props.tenantId, props.userId, props.packageId)
    await getFiles(props.tenantId, props.userId, props.packageId)
    toast.success('Xóa file thành công!')
  } catch (err) {
    console.error('Error deleting file:', err)
    toast.error('Có lỗi xảy ra khi xóa file')
  }
}

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTQgMTZMMTAgMTBMMTQgMTRMMjAgOEwyMCAxNkgyMEg0VjE2WiIgZmlsbD0iI0Q5RDlEOSIvPgo8cGF0aCBkPSJNMTQgMTRMMTAgMTBMMTQgMTRaIiBmaWxsPSIjRDlEOUQ5Ii8+CjxwYXRoIGQ9Ik0xNCAxNEwyMCA4TDE0IDE0WiIgZmlsbD0iI0Q5RDlEOSIvPgo8L3N2Zz4K'
}
</script>

<style scoped>
.file-upload-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.upload-area {
  width: 100%;
}

.upload-zone {
  border: 2px dashed #d1d5db;
  border-radius: 0.5rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.2s;
}

.upload-zone:hover {
  border-color: #60a5fa;
  background-color: #eff6ff;
}

.upload-zone.drag-over {
  border-color: #3b82f6;
  background-color: #dbeafe;
}

.upload-zone.uploading {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.upload-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-icon {
  margin: 0 auto;
}

.upload-text {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.upload-progress {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.progress-icon {
  flex-shrink: 0;
}

.progress-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-bar {
  width: 100%;
  background-color: #e5e7eb;
  border-radius: 9999px;
  height: 0.5rem;
}

.progress-fill {
  background-color: #2563eb;
  height: 0.5rem;
  border-radius: 9999px;
  transition: all 0.3s;
}

.error-message {
  margin-top: 1rem;
}

.files-list {
  margin-top: 2rem;
}

.file-card {
  transition: all 0.2s;
}

.file-preview {
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview {
  width: 100%;
}

.file-icon {
  width: 100%;
  height: 8rem;
  background-color: #f3f4f6;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.file-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.hidden {
  display: none;
}
</style> 