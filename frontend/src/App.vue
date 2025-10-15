<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import LayoutAdmin from './layouts/LayoutAdmin.vue'
import TenantUserLayout from './layouts/TenantUserLayout.vue'

const route = useRoute()

const layout = computed(() => {
  // Lấy user từ localStorage/sessionStorage
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null
  if (user && user.role === 'tenant_user') {
    return TenantUserLayout
  }
  return route.meta.layout === 'none' ? 'div' : LayoutAdmin
})
</script>
