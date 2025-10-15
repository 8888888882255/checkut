<template>
  <footer class="tw-bg-white tw-text-gray-600 tw-py-4 tw-border-t">
    <div class="tw-grid md:tw-grid-cols-2 tw-gap-4 tw-text-sm tw-px-4">
      <!-- Bản quyền -->
      <div class="tw-flex tw-items-center tw-justify-center md:tw-justify-start">
        <p>© 2025 Tenant. Mọi quyền được bảo lưu.</p>
      </div>

      <!-- Chính sách và điều khoản -->
      <div class="tw-flex tw-items-center tw-justify-center md:tw-justify-end tw-flex-wrap">
        <RouterLink
          to="/privacy-policy"
          class="hover:tw-text-[#086df9] transition-colors duration-200"
        >
          Chính sách bảo mật
        </RouterLink>
        <span class="tw-mx-2">|</span>
        <RouterLink
          to="/terms"
          class="hover:tw-text-[#086df9] transition-colors duration-200"
        >
          Điều khoản sử dụng
        </RouterLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped></style>
