import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/layout'

Vue.use(Router)

/**
 * Note: 子菜单仅在路由children.length> = 1时出现
 *
 * hidden: true                   如果设置为true，则项目不会显示在边栏中（默认为false）
 * alwaysShow: true               如果设置为true，将始终显示根菜单
 *                                如果未设置alwaysShow，则当项具有多个子路线时，
 *                                它将变为嵌套模式，否则不显示根菜单
 * redirect: noRedirect           如果设置noRedirect，则不会在面包屑中重定向
 * name:'router-name'             该名称由<keep-alive>使用（必须设置！！！）
 * meta : {
    permissions: ['admin','editor']    控制页面权限
    title: 'title'               名称显示在侧边栏和面包屑中（推荐设置）
    icon: 'svg-name'/'el-icon-x' 侧栏中的图标显示
    noCache: true                如果设置为true，将不缓存页面（默认为false）
    affix: true                  如果设置为true，则标签将粘贴在标签视图中
    breadcrumb: false            如果设置为false，则该项目将隐藏在面包屑中（默认为true）
    activeMenu: '/example/list'  如果设置了路径，则侧边栏将突出显示您设置的路径
  }
 */

/**
 * constantRoutes
 * 没有权限要求的基本页面
 * 所有角色都可以访问
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '主页', icon: 'dashboard', affix: true }
      }
    ]
  },
  // 个人中心页
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/information/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user', noCache: true }
      }
    ]
  }
]

/**
 * asyncRoutes
 * 需要根据用户权限动态加载的路由
 */
export const asyncRoutes = [
  // 系统管理
  {
    path: '/system',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'system',
    meta: {
      permissions: ['admin', 'system'],
      title: '系统管理',
      icon: 'system'
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/system/users'),
        name: 'system-users',
        meta: { permissions: ['admin', 'system-users'], title: '用户管理', icon: 'user', noCache: true }
      },
      {
        path: 'roles',
        component: () => import('@/views/system/roles'),
        name: 'system-roles',
        meta: { permissions: ['admin', 'system-roles'], title: '角色管理', icon: 'role', noCache: true }
      },
      {
        path: 'permissions',
        component: () => import('@/views/system/permissions'),
        name: 'system-permissions',
        meta: { permissions: ['admin', 'system-permissions'], title: '权限管理', icon: 'permission', noCache: true }
      },
      {
        path: 'departments',
        component: () => import('@/views/system/departments'),
        name: 'system-departments',
        meta: { permissions: ['admin', 'system-departments'], title: '部门管理', icon: 'dept', noCache: true }
      },
      {
        path: 'jobs',
        component: () => import('@/views/system/jobs'),
        name: 'system-jobs',
        meta: { permissions: ['admin', 'system-jobs'], title: '任务调度', icon: 'task -2', noCache: true }
      }
    ]
  },

  // 系统监控
  {
    path: '/monitor',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'monitor',
    meta: {
      permissions: ['admin', 'monitor'],
      title: '系统监控',
      icon: 'monitor'
    },
    children: [
      {
        path: 'users',
        component: () => import('@/views/monitor/users'),
        name: 'monitor-users',
        meta: { permissions: ['admin', 'monitor-users'], title: '在线用户', icon: 'Steve-Jobs', noCache: true }
      },
      {
        path: 'ip',
        component: () => import('@/views/monitor/ip'),
        name: 'monitor-ip',
        meta: { permissions: ['admin', 'monitor-ip'], title: 'IP黑名单', icon: 'ipvisits', noCache: true }
      },
      // {
      //   path: 'crud',
      //   component: () => import('@/views/monitor/crud'),
      //   name: 'monitor-crud',
      //   meta: { permissions: ['admin', 'monitor-crud'], title: 'crud日志', icon: 'log', noCache: true }
      // },
      {
        path: 'error',
        component: () => import('@/views/monitor/error'),
        name: 'monitor-error',
        meta: { permissions: ['admin', 'monitor-error'], title: '错误日志', icon: 'error', noCache: true }
      },
      {
        path: 'service',
        component: () => import('@/views/monitor/service'),
        name: 'monitor-service',
        meta: { permissions: ['admin', 'monitor-service'], title: '服务监控', icon: 'codeConsole', noCache: true }
      }
    ]
  },

  // 资产管理
  {
    path: '/cmdb',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'cmdb',
    meta: {
      permissions: ['admin', 'cmdb'],
      title: '资产管理',
      icon: 'resources'
    },
    children: [
      {
        path: 'server',
        component: () => import('@/views/cmdb/servers'),
        name: 'cmdb-servers',
        meta: { permissions: ['admin', 'cmdb-servers'], title: '服务器', icon: 'server', noCache: true }
      }
      // {
      //   path: 'network',
      //   component: () => import('@/views/monitor/ip'),
      //   name: 'cmdb-network',
      //   meta: { title: '网络设备', icon: 'network', noCache: true }
      // },
      // {
      //   path: 'storage',
      //   component: () => import('@/views/monitor/error'),
      //   name: 'cmdb-storage',
      //   meta: { title: '存储设备', icon: 'storage', noCache: true }
      // },
      // {
      //   path: 'security',
      //   component: () => import('@/views/monitor/service'),
      //   name: 'cmdb-security',
      //   meta: { title: '安全设备', icon: 'security', noCache: true }
      // }
    ]
  },

  // 系统工具
  {
    path: '/tool',
    component: Layout,
    redirect: 'noRedirect',
    alwaysShow: true,
    name: 'tool',
    meta: {
      permissions: ['admin', 'tool'],
      title: '系统工具',
      icon: 'sys-tools'
    },
    children: [
      {
        path: 'swagger',
        component: () => import('@/views/tool/swagger'),
        name: 'tool-swagger',
        meta: { permissions: ['admin', 'tool-swagger'], title: '系统接口', icon: 'swagger', noCache: true }
      }

    ]
  },

  // git外链
  {
    path: '/git-link',
    component: Layout,
    children: [
      {
        path: 'https://github.com/TianPangJi/drf_admin',
        meta: { title: 'Git', icon: 'github' }
      }
    ]
  },

  // icon
  {
    path: '/icon',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/icons/index'),
        name: 'Icons',
        meta: { title: 'Icons', icon: 'icon', noCache: true }
      }
    ]
  },

  // 404页必须放在最后！
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
