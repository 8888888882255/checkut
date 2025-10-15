<template>
  <div class="tw-flex tw-h-screen tw-bg-gray-50 dark:tw-bg-gray-900">
    <!-- Sidebar -->
    <aside class="tw-w-64 tw-bg-white tw-border-r tw-shadow-sm tw-h-screen tw-flex tw-flex-col">
      <div class="tw-p-4">
        <RouterLink to="/tenant-user/files" class="tw-flex tw-justify-center">
          <img src="/logo.jpg" alt="Logo" class="tw-h-14 tw-w-full tw-object-contain" />
        </RouterLink>
      </div>
      <nav class="tw-flex-1 tw-flex tw-flex-col tw-gap-2 tw-px-4">
        <RouterLink to="/tenant-user/files" class="tw-flex tw-items-center tw-gap-2 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-[#086df9] tw-text-[#086df9]">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>
          Tải File
        </RouterLink>
        <!-- <RouterLink to="/tenant-user/files" class="tw-flex tw-items-center tw-gap-2 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent tw-text-gray-700 hover:tw-border-[#086df9] hover:tw-text-[#086df9]">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>
          Quản lý File
        </RouterLink>
        <RouterLink to="/tenant-user/databases" class="tw-flex tw-items-center tw-gap-2 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent tw-text-gray-700 hover:tw-border-[#086df9] hover:tw-text-[#086df9]">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><ellipse cx="12" cy="7" rx="8" ry="3"/><path d="M4 7v10c0 1.657 3.582 3 8 3s8-1.343 8-3V7"/></svg>
          Quản lý Database
        </RouterLink>
        <RouterLink to="/tenant-user/domains" class="tw-flex tw-items-center tw-gap-2 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent tw-text-gray-700 hover:tw-border-[#086df9] hover:tw-text-[#086df9]">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
          Quản lý Domain
        </RouterLink> -->
        <RouterLink to="/tenant-user/profile" class="tw-flex tw-items-center tw-gap-2 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent tw-text-gray-700 hover:tw-border-[#086df9] hover:tw-text-[#086df9]">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a8.38 8.38 0 0 1 13 0"/></svg>
          Tài khoản
        </RouterLink>
      </nav>
      <div class="tw-px-4 tw-py-3 tw-border-t tw-text-sm tw-text-gray-500 tw-flex tw-items-center tw-gap-4">
        <RouterLink to="/logout" class="tw-flex tw-items-center tw-gap-1 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent hover:tw-border-red-600 hover:tw-text-red-600 tw-text-gray-500">
          <svg class="tw-w-4 tw-h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7"/><path d="M3 21V3a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v4"/></svg>
          Đăng xuất
        </RouterLink>
      </div>
    </aside>
    <!-- Main content -->
    <div class="tw-flex-1 tw-flex tw-flex-col">
      <header class="tw-sticky tw-top-0 tw-z-50 tw-h-16 tw-flex tw-items-center tw-justify-between tw-px-6 tw-border-b tw-bg-white dark:tw-bg-gray-800 dark:tw-border-gray-700">
        <slot name="header">
          <h1 class="tw-text-xl tw-font-bold">Bảng điều khiển Tenant User</h1>
        </slot>
      </header>
      <main class="tw-flex-1 tw-overflow-y-auto tw-p-8">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script> 