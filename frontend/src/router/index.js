import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import ChangePasswordPage from '../views/ChangePasswordPage.vue'
import ForgotPasswordPage from '../views/ForgotPasswordPage.vue'
import TenantPage from '../views/TenantPage.vue'
import PackagePage from '../views/PackagePage.vue'
import Shop from '../views/Shop.vue'
import { Package } from 'lucide-vue-next'
import CategoryPage from '../views/CategoryPage.vue'
import CustomerPage from '../views/CustomerPage.vue'
import ServiceDataPage from '../views/ServiceDataPage.vue'
import TenantUserDashboard from '../views/TenantUserDashboard.vue'
import PaymentSuccess from '../views/PaymentSuccess.vue';
import AboutPage from '../views/AboutPage.vue'
import PurchasesPage from '../views/PurchasesPage.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
    meta: { layout: 'none' }
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage,
    meta: { layout: 'none' }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPasswordPage,
    meta: { layout: 'none' }
  },
  {
  path: '/payment-success',
    name: 'PaymentSuccess',
    component: PaymentSuccess
  },
  
  {
    path: '/',
    children: [
      { path: '', name: 'Home', component: HomePage },
      { path: 'dashboard', name: 'Dashboard', component: HomePage },
      { path: 'about', name: 'About', component: AboutPage },
      { path: 'profile', name: 'Profile', component: ProfilePage },
      { path: 'change-password', name: 'ChangePassword', component: ChangePasswordPage },
      { path: 'tenant', name: 'Tenant', component: TenantPage },
      { path: 'shop', name: 'Shop', component: Shop },
      { path: 'categories', name: 'Category', component: CategoryPage },
      { path: 'customers', name: 'Customer', component: CustomerPage },
      { path: 'service-data', name: 'ServiceData', component: ServiceDataPage },
      { path: 'purchases', name: 'Purchases', component: PurchasesPage },
      { path: 'orders', name: 'Orders', component: HomePage },
      { path: 'inventory', name: 'Inventory', component: HomePage },
      { path: 'promotions', name: 'Promotions', component: HomePage },
      { path: 'reports', name: 'Reports', component: HomePage },
      { path: 'settings', name: 'Settings', component: HomePage },
      { path: 'logout', name: 'Logout', component: HomePage },
      { path: 'privacy-policy', name: 'PrivacyPolicy', component: HomePage },
      { path: 'terms', name: 'Terms', component: HomePage }
    ]
  },
  {
    path: '/tenant-user',
    children: [
      { path: 'files', name: 'TenantUserDashboard', component: TenantUserDashboard },
      { path: 'databases', name: 'TenantUserDatabases', component: HomePage },
      { path: 'domains', name: 'TenantUserDomains', component: HomePage },
      { path: 'profile', name: 'TenantUserProfile', component: ProfilePage },
      { path: 'forgotpassword', name: 'Forgotpassword', component: ForgotPasswordPage },
      { path: 'package', name: 'Package', component: PackagePage },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// Global navigation guard cho tenant_user
router.beforeEach((to, from, next) => {
  const userStr = localStorage.getItem('user') || sessionStorage.getItem('user')
  const user = userStr ? JSON.parse(userStr) : null

  // Xử lý logout
  if (to.path === '/logout') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    return next('/login');
  }

  // Các route cho phép tenant_user truy cập
  const allowedTenantUserRoutes = [
    '/login', '/register', '/forgot-password', '/logout'
  ]

  if (user && user.role === 'tenant_user') {
    // Nếu không phải route /tenant-user hoặc các route cho phép, redirect về dashboard user
    if (!to.path.startsWith('/tenant-user') && !allowedTenantUserRoutes.includes(to.path)) {
      return next('/tenant-user/dashboard')
    }
  }
  next()
})

export default router
