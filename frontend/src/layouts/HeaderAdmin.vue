<template>
  <aside class="tw-w-64 tw-bg-white tw-border-r tw-shadow-sm tw-h-screen tw-flex tw-flex-col">
    <!-- Logo -->
    <div class="tw-p-4">
        <RouterLink to="/" class="tw-flex tw-justify-center">
            <img src="/logo.jpg" alt="Logo" class="tw-h-14 tw-w-full tw-object-contain" />
        </RouterLink>
    </div>

    <!-- Menu dọc -->
    <nav class="tw-flex-1 tw-flex tw-flex-col tw-gap-2 tw-px-4">
      <RouterLink to="/dashboard" :class="navClass('/dashboard')">
        <LayoutDashboard class="tw-w-4 tw-h-4 tw-text-blue-600" />
        Tổng quan
      </RouterLink>

      <RouterLink v-if="isGlobalAdmin" to="/categories" :class="navClass('/categories')">
        <FolderKanban class="tw-w-4 tw-h-4 tw-text-orange-500" />
        Quản lý danh mục
      </RouterLink>

      <RouterLink v-if="isGlobalAdmin" to="/tenant-user/package" :class="navClass('/package')">
        <Boxes class="tw-w-4 tw-h-4 tw-text-green-600" />
        Quản lý sản phẩm
      </RouterLink>

      <RouterLink to="/tenant" :class="navClass('/tenant')">
        <FolderKanban class="tw-w-4 tw-h-4 tw-text-yellow-500" />
        Tenant
      </RouterLink>

      <RouterLink to="/orders" :class="navClass('/orders')">
        <Receipt class="tw-w-4 tw-h-4 tw-text-red-500" />
        Quản lý đơn hàng
      </RouterLink>

      <RouterLink to="/customers" :class="navClass('/customers')">
        <Users class="tw-w-4 tw-h-4 tw-text-purple-500" />
        Người dùng
      </RouterLink>

      <RouterLink to="/purchases" :class="navClass('/purchases')">
        <Receipt class="tw-w-4 tw-h-4 tw-text-green-500" />
        {{ isGlobalAdmin ? 'Quản lý đơn hàng' : 'Dịch vụ đã mua' }}
      </RouterLink>

      <RouterLink to="/service-data" :class="navClass('/service-data')">
        <Database class="tw-w-4 tw-h-4 tw-text-cyan-500" />
        Dữ liệu dịch vụ
      </RouterLink>

      <RouterLink to="/shop" :class="navClass('/shop')">
        <Store class="tw-w-4 tw-h-4 tw-text-blue-500" />
        Cửa hàng
      </RouterLink>

      <RouterLink to="/reports" :class="navClass('/reports')">
        <BarChart2 class="tw-w-4 tw-h-4 tw-text-indigo-500" />
        Báo cáo thống kê
      </RouterLink>

      <RouterLink to="/settings" :class="navClass('/settings')">
        <Settings class="tw-w-4 tw-h-4 tw-text-gray-700" />
        Cài đặt hệ thống
      </RouterLink>
    </nav>

    <!-- Footer -->
    <div class="tw-px-4 tw-py-3 tw-border-t tw-text-sm tw-text-gray-500 tw-flex tw-items-center tw-gap-4">
      <RouterLink
        to="/profile"
        :class="[
          'tw-flex tw-items-center tw-gap-1 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent hover:tw-border-[#086df9] hover:tw-text-[#086df9]',
          route.path === '/profile' ? 'tw-border-[#086df9] tw-text-[#086df9]' : 'tw-text-gray-500'
        ]"
      >
        <User class="tw-w-4 tw-h-4 tw-text-gray-500" />
        Tài khoản
      </RouterLink>

      <RouterLink
        to="/logout"
        class="tw-flex tw-items-center tw-gap-1 tw-py-2 tw-px-3 tw-rounded tw-border tw-border-transparent hover:tw-border-red-600 hover:tw-text-red-600 tw-text-gray-500"
      >
        <LogOut class="tw-w-4 tw-h-4 tw-text-gray-500" />
        Đăng xuất
      </RouterLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { RouterLink, useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Boxes,
  FolderKanban,
  Receipt,
  Users,
  Warehouse,
  Gift,
  BarChart2,
  Settings,
  User,
  LogOut,
  Store,
  Database
} from 'lucide-vue-next'

const route = useRoute()

// Helper: active path -> đổi text + border, icon vẫn giữ màu riêng
const navClass = (path: string) => {
  const base = 'tw-flex tw-items-center tw-gap-2 tw-py-2 tw-px-3 tw-rounded tw-border tw-transition-colors'
  const active = 'tw-border-[#086df9] tw-text-[#086df9]'
  const inactive = 'tw-border-transparent tw-text-gray-700 hover:tw-border-[#086df9] hover:tw-text-[#086df9]'
  return [base, route.path === path ? active : inactive]
}

// Lấy role từ localStorage/sessionStorage
const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
const user = userStr ? JSON.parse(userStr) : null;
const isGlobalAdmin = user && user.role === 'global_admin';
</script>
