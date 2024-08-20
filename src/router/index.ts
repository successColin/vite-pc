import routeSettings from "@/config/route"
import { type RouteRecordRaw, createRouter } from "vue-router"
import { flatMultiLevelRoutes, history } from "./helper"

const Layouts = () => import("@/layouts/index.vue")

/**
 * 常驻路由
 * 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    component: Layouts,
    redirect: "/home",
    name: "HomeIndex",
    children: [
      {
        path: "home",
        component: () => import("@/views/home/index.vue"),
        name: "Home",
        meta: {
          title: "首页",
          elIcon: "FolderOpened"
        }
      }
    ]
  },
  {
    path: "/repair",
    component: Layouts,
    redirect: "/repair/work-order",
    meta: {
      title: "报修管理",
      elIcon: "FolderOpened"
    },
    name: "RepairManagement",
    children: [
      {
        path: "work-order",
        component: () => import("@/views/repair/work-order.vue"),
        name: "WorkOrder",
        meta: {
          title: "报修工单",
          keepAlive: true
        }
      },
      {
        path: "indemnity-note",
        component: () => import("@/views/repair/indemnity-note.vue"),
        name: "IndemnityNote",
        meta: {
          title: "赔付单管理",
          keepAlive: true
        }
      },

      {
        path: "complaint-data",
        component: () => import("@/views/repair/complaint-data.vue"),
        name: "ComplaintData",
        meta: {
          title: "投诉数据",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/out-repair",
    component: Layouts,
    redirect: "/out-repair/data",
    name: "OutSchoolManage",
    meta: {
      title: "校外维修管理",
      elIcon: "FolderOpened"
    },
    children: [
      {
        path: "data",
        component: () => import("@/views/out-repair/data.vue"),
        name: "OutRepairDate",
        meta: {
          title: "校外维修数据",
          keepAlive: true
        }
      },
      {
        path: "payment-request",
        component: () => import("@/views/out-repair/payment-request.vue"),
        name: "PaymentRequest",
        meta: {
          title: "维修款支付申请",
          keepAlive: true
        }
      },
      {
        path: "audit-approval",
        component: () => import("@/views/out-repair/audit-approval.vue"),
        name: "AuditApproval",
        meta: {
          title: "维修款出纳打款",
          keepAlive: true
        }
      }
      // {
      //   path: "payment-approval",
      //   component: () => import("@/views/out-repair/payment-approval.vue"),
      //   name: "PaymentApproval",
      //   meta: {
      //     title: "维修款支付审批",
      //     keepAlive: true
      //   }
      // }
    ]
  },
  {
    path: "/purchase",
    component: Layouts,
    redirect: "/purchase/request",
    name: "PurchasingManagement",
    meta: {
      title: "采购管理",
      elIcon: "FolderOpened"
    },
    children: [
      {
        path: "request",
        component: () => import("@/views/purchase/request.vue"),
        name: "request",
        meta: {
          title: "材料采购申请",
          keepAlive: true
        }
      },
      {
        path: "approval",
        component: () => import("@/views/purchase/approval.vue"),
        name: "approval",
        meta: {
          title: "打款凭证上传",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/repertory",
    component: Layouts,
    redirect: "/repertory/in-warehouse",
    meta: {
      title: "出入库管理",
      elIcon: "FolderOpened"
    },
    children: [
      {
        path: "in-warehouse",
        component: () => import("@/views/repertory/in-warehouse.vue"),
        name: "InWarehouse",
        meta: {
          title: "入库",
          keepAlive: true
        }
      },
      {
        path: "out-warehouse",
        component: () => import("@/views/repertory/out-warehouse.vue"),
        name: "OutWarehouse",
        meta: {
          title: "出库",
          keepAlive: true
        }
      },
      {
        path: "data-warehouse",
        component: () => import("@/views/repertory/data-warehouse.vue"),
        name: "DataWarehouse",
        meta: {
          title: "库存数据",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/notice",
    component: Layouts,
    redirect: "/notice/index",
    children: [
      {
        path: "index",
        component: () => import("@/views/notice/index.vue"),
        name: "NoticeIndex",
        meta: {
          title: "公告列表",
          elIcon: "FolderOpened",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/system-config",
    component: Layouts,
    redirect: "/system-config/category",
    meta: {
      title: "系统设置",
      elIcon: "setting"
    },
    children: [
      {
        path: "category",
        component: () => import("@/views/system-config/category.vue"),
        name: "Category",
        meta: {
          title: "维修类目设置"
        }
      },
      {
        path: "complain-type",
        component: () => import("@/views/system-config/complain-type.vue"),
        name: "ComplainType",
        meta: {
          title: "投诉类型设置",
          keepAlive: true
        }
      },
      {
        path: "stock-control",
        component: () => import("@/views/system-config/stock-control.vue"),
        name: "StockControl",
        meta: {
          title: "出入库类型维护",
          keepAlive: true
        }
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/views/error-page/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/views/error-page/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  }
  // {
  //   path: "/login",
  //   component: () => import("@/views/login/index.vue"),
  //   meta: {
  //     hidden: true
  //   }
  // }
  // {
  //   path: "/",
  //   component: Layouts,
  //   redirect: "/dashboard",
  //   name: "Table",
  //   meta: {
  //     title: "首页",
  //     elIcon: "Grid"
  //   },
  //   children: [
  //     {
  //       path: "/dashboard",
  //       component: () => import("@/views/table/element-plus/index.vue"),
  //       name: "ElementPlus",
  //       meta: {
  //         title: "Element Plus",
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: "/",
  //   component: Layouts,
  //   redirect: "/table/element-plus",
  //   name: "Table",
  //   meta: {
  //     title: "表格",
  //     elIcon: "Grid"
  //   },
  //   children: [
  //     {
  //       path: "/table/element-plus",
  //       component: () => import("@/views/table/element-plus/index.vue"),
  //       name: "ElementPlus",
  //       meta: {
  //         title: "Element Plus",
  //         keepAlive: true
  //       }
  //     },
  //     {
  //       path: "/table/vxe-table",
  //       component: () => import("@/views/table/vxe-table/index.vue"),
  //       name: "VxeTable",
  //       meta: {
  //         title: "Vxe Table",
  //         keepAlive: true
  //       }
  //     }
  //   ]
  // },
]

/**
 * 动态路由
 * 用来放置有权限 (Roles 属性) 的路由
 * 必须带有 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = []

const router = createRouter({
  history,
  routes: routeSettings.thirdLevelRouteCache ? flatMultiLevelRoutes(constantRoutes) : constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  // 注意：所有动态路由路由必须带有 Name 属性，否则可能会不能完全重置干净
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && meta.roles?.length) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    // 强制刷新浏览器也行，只是交互体验不是很好
    window.location.reload()
  }
}

export default router
