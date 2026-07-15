<script setup lang="ts">
import { ref } from "vue";
import {
  SecLabButton,
  SecLabInput,
  SecLabSwitch,
  SecLabTag,
  SecLabIcon,
  SecLabCard,
  SecLabCheckbox,
  SecLabEmpty,
  SecLabAlert,
  SecLabLoading,
  SecLabBreadcrumb,
  SecLabBreadcrumbItem,
  SecLabToast,
  SecLabTooltip,
  ToastItem,
  SecLabDescriptions,
  SecLabFormItem,
  SecLabTabs,
  SecLabMenu,
  SecLabActionMenu,
  SecLabDialog,
  SecLabDrawer,
  SecLabModal,
  SecLabPagination,
  SecLabSelect,
  SecLabTable,
  SecLabDateTimeRangePicker,
} from "@seclab-dev/vue";

const textVal = ref("Hello SecLab UI");
const switchVal = ref(true);
const checkboxVal = ref(false);
const loadingVal = ref(false);

// Dialog / Drawer / Modal trigger states
const dialogVisible = ref(false);
const drawerVisible = ref(false);
const modalVisible = ref(false);

// Pagination & Select states
const currentPageVal = ref(1);
const totalPagesVal = ref(10);
const selectVal = ref("opt1");
const selectOptions = [
  {
    value: "opt1",
    label: "主要通信节点 (Primary)",
    hint: "运行主力防火墙策略",
  },
  { value: "opt2", label: "备用节点 A (Backup A)" },
  {
    value: "opt3",
    label: "只读节点 B (Readonly B)",
    disabled: true,
    hint: "处于离线维护状态",
  },
];

// Table mock data and columns
const tableData = ref([
  {
    id: "1",
    name: "网络边界防火墙 A",
    ip: "10.0.1.100",
    status: "active",
    traffic: "1.2 Gbps",
  },
  {
    id: "2",
    name: "数据中心路由器 B",
    ip: "10.0.2.1",
    status: "active",
    traffic: "850 Mbps",
  },
  {
    id: "3",
    name: "入侵检测系统 C",
    ip: "10.0.5.50",
    status: "maintenance",
    traffic: "0 bps",
  },
]);

const tableColumns = [
  { prop: "name", label: "节点名称", width: "200px" },
  { prop: "ip", label: "节点 IP", width: "150px" },
  { prop: "traffic", label: "当前流量", width: "120px" },
  { slot: "status", label: "运行状态", width: "120px" },
  { slot: "actions", label: "操作", width: "100px" },
];

// Date picker states
const rangeVal = ref({
  startAt: new Date(2025, 4, 20, 9, 30).getTime(),
  endAt: new Date(2025, 4, 20, 10, 30).getTime(),
});

const shortcutOptions = [
  { label: "最近 15 分钟", value: "15m" as const },
  { label: "最近 1 小时", value: "1h" as const },
  { label: "最近 24 小时", value: "24h" as const },
  { label: "最近 7 天", value: "7d" as const },
  { label: "今天", value: "today" as const },
];

const weekDaysList = ["日", "一", "二", "三", "四", "五", "六"];

// Tabs active state
const activeTab = ref("tab1");
const tabsList = [
  { label: "基础配置", name: "tab1" },
  { label: "高级设置", name: "tab2" },
  { label: "只读历史", name: "tab3", disabled: true },
];

// Menu active state & categories
const activeMenu = ref("item1");
const menuItems = [
  {
    key: "group1",
    label: "核心资源",
    children: [
      { key: "item1", label: "容器管理" },
      { key: "item2", label: "镜像仓库" },
    ],
  },
  {
    key: "group2",
    label: "高级功能",
    children: [
      { key: "item3", label: "负载均衡" },
      { key: "item4", label: "审计日志" },
    ],
  },
];

// Descriptions items & mock data
const descItems = [
  { label: "服务名称", value: "Security Core Services" },
  { label: "当前版本", value: "v2.4.12-release" },
  { label: "状态", slot: "status" },
  { label: "节点数", value: 8, span: 1 },
  {
    label: "备注信息",
    value:
      "This cluster runs core node authentication and firewall dispatch policies.",
    span: 2,
  },
];
const descData = {
  statusText: "正常运行",
};

// ActionMenu actions list
const actionsList = [
  {
    label: "启动服务",
    icon: "status-running",
    className: "app-btn-start",
    handler: () => {
      addToast("success", "指令已发送", "服务启动指令下发成功。");
    },
  },
  {
    label: "暂停服务",
    icon: "settings",
    className: "app-btn-stop",
    handler: () => {
      addToast("warning", "指令已发送", "服务暂停指令下发成功。");
    },
  },
  {
    label: "删除容器",
    icon: "trash",
    className: "app-btn-delete",
    handler: () => {
      addToast("error", "删除警告", "此操作无法撤销。");
    },
  },
];

function triggerLoading() {
  loadingVal.value = true;
  setTimeout(() => {
    loadingVal.value = false;
  }, 2000);
}

// Toast demonstration state
const toasts = ref<ToastItem[]>([]);

function addToast(type: ToastItem["type"], title: string, message: string) {
  const id = Math.random().toString(36).substring(2, 9);
  toasts.value.push({ id, type, title, message });

  // Auto-remove in 3s
  setTimeout(() => {
    removeToast(id);
  }, 3000);
}

function removeToast(id: string) {
  toasts.value = toasts.value.filter((t) => t.id !== id);
}

// Theme switching logic
const theme = ref("light");
document.documentElement.setAttribute("data-theme", theme.value);

function toggleTheme() {
  theme.value = theme.value === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme.value);
}
</script>

<template>
  <div class="playground-wrapper">
    <header class="playground-header">
      <div>
        <h2>SecLab UI Component Workspace</h2>
        <p>调试设计语言 tokens、自研图标及基础 UI 组件</p>
      </div>
      <SecLabButton type="primary" @click="toggleTheme">
        切换为 {{ theme === "dark" ? "明亮" : "暗黑" }} 主题
      </SecLabButton>
    </header>

    <main class="playground-content">
      <!-- Buttons section -->
      <section class="card">
        <h3>Buttons 按钮</h3>
        <div class="row">
          <SecLabButton type="primary">主要按钮 (Primary)</SecLabButton>
          <SecLabButton type="secondary">次要按钮 (Secondary)</SecLabButton>
          <SecLabButton type="danger">危险按钮 (Danger)</SecLabButton>
          <SecLabButton type="warning">警告按钮 (Warning)</SecLabButton>
          <SecLabButton type="info">信息按钮 (Info)</SecLabButton>
        </div>
        <div class="row">
          <SecLabButton type="primary" size="small">小型按钮</SecLabButton>
          <SecLabButton type="primary">默认按钮</SecLabButton>
          <SecLabButton type="primary" size="large">大型按钮</SecLabButton>
          <SecLabButton type="primary" disabled>禁用按钮</SecLabButton>
          <SecLabButton type="primary" loading>加载中</SecLabButton>
        </div>
      </section>

      <!-- Input section -->
      <section class="card">
        <h3>Inputs 输入框</h3>
        <div
          class="row"
          style="flex-direction: column; align-items: stretch; max-width: 400px"
        >
          <div class="form-item">
            <label>常规文本输入框</label>
            <SecLabInput v-model="textVal" placeholder="请输入内容" />
            <span class="hint">当前输入值: {{ textVal }}</span>
          </div>

          <div class="form-item">
            <label>密码输入框</label>
            <SecLabInput
              v-model="textVal"
              type="password"
              show-password
              placeholder="请输入密码"
            />
          </div>

          <div class="form-item">
            <label>多行文本输入框</label>
            <SecLabInput
              v-model="textVal"
              type="textarea"
              :rows="3"
              placeholder="请输入详细描述"
            />
          </div>
        </div>
      </section>

      <!-- Switch section -->
      <section class="card">
        <h3>Switches 开关</h3>
        <div class="row">
          <SecLabSwitch v-model="switchVal" active-text="系统功能开关" />
          <SecLabSwitch
            :model-value="false"
            disabled
            active-text="禁用未激活"
          />
          <SecLabSwitch :model-value="true" disabled active-text="禁用激活" />
        </div>
      </section>

      <!-- Tags section -->
      <section class="card">
        <h3>Tags 标签</h3>
        <div class="row">
          <SecLabTag type="default">默认标签</SecLabTag>
          <SecLabTag type="primary">主要标签</SecLabTag>
          <SecLabTag type="success">成功标签</SecLabTag>
          <SecLabTag type="warning">警告标签</SecLabTag>
          <SecLabTag type="danger">危险标签</SecLabTag>
          <SecLabTag type="info">信息标签</SecLabTag>
        </div>
      </section>

      <!-- Icons section -->
      <section class="card">
        <h3>Icons 矢量图标</h3>
        <div class="row icons-grid">
          <div class="icon-item">
            <SecLabIcon name="desktop" :size="24" />
            <span>desktop</span>
          </div>
          <div class="icon-item">
            <SecLabIcon name="settings" :size="24" />
            <span>settings</span>
          </div>
          <div class="icon-item">
            <SecLabIcon name="lock" :size="24" />
            <span>lock</span>
          </div>
          <div class="icon-item">
            <SecLabIcon name="trash" :size="24" />
            <span>trash</span>
          </div>
          <div class="icon-item">
            <SecLabIcon name="terminal" :size="24" />
            <span>terminal</span>
          </div>
          <div class="icon-item">
            <SecLabIcon name="copy" :size="24" />
            <span>copy</span>
          </div>
          <div class="icon-item">
            <SecLabIcon name="error" :size="24" />
            <span>error</span>
          </div>
          <div class="icon-item">
            <SecLabIcon name="status-running" :size="24" />
            <span>running</span>
          </div>
        </div>
      </section>

      <!-- Cards section -->
      <section class="card">
        <h3>Cards 卡片</h3>
        <div class="row" style="align-items: stretch">
          <SecLabCard style="width: 280px" shadow="always">
            <template #header>总是显示阴影 (always)</template>
            <div>这是卡片主体内容，遵循 SDL 设计规范。</div>
          </SecLabCard>
          <SecLabCard style="width: 280px" shadow="hover">
            <template #header>悬浮显示阴影 (hover)</template>
            <div>鼠标悬浮时才显示卡片投影效果。</div>
          </SecLabCard>
          <SecLabCard style="width: 280px" shadow="never">
            <template #header>从不显示阴影 (never)</template>
            <div>纯扁平无阴影样式的卡片容器。</div>
          </SecLabCard>
        </div>
      </section>

      <!-- Checkbox section -->
      <section class="card">
        <h3>Checkboxes 复选框</h3>
        <div class="row">
          <SecLabCheckbox v-model="checkboxVal">
            默认复选框 (值: {{ checkboxVal }})
          </SecLabCheckbox>
          <SecLabCheckbox :model-value="true" disabled>
            禁用已勾选
          </SecLabCheckbox>
          <SecLabCheckbox :model-value="false" disabled>
            禁用未勾选
          </SecLabCheckbox>
        </div>
      </section>

      <!-- Alert section -->
      <section class="card">
        <h3>Alerts 警告横幅</h3>
        <div
          class="row"
          style="flex-direction: column; align-items: stretch; gap: 16px"
        >
          <SecLabAlert
            type="info"
            show-icon
            title="提示信息"
            description="这是一条普通的提示信息横幅。"
          />
          <SecLabAlert
            type="success"
            show-icon
            title="成功提示"
            description="操作已成功完成，系统已更新。"
            closable
          />
          <SecLabAlert
            type="warning"
            show-icon
            title="警告提示"
            description="此操作可能影响系统的正常运行，请谨慎操作。"
          />
          <SecLabAlert
            type="error"
            show-icon
            title="错误提示"
            description="系统连接超时，请检查网络设置后重试。"
            closable
          />
        </div>
      </section>

      <!-- Loading and Empty section -->
      <section class="card">
        <h3>Loading & Empty 加载与空状态</h3>
        <div class="row" style="justify-content: space-around; width: 100%">
          <SecLabCard style="width: 320px">
            <template #header>空状态示例</template>
            <SecLabEmpty description="自定义暂无数据文案">
              <template #extra>
                <SecLabButton type="primary" size="small"
                  >重新加载</SecLabButton
                >
              </template>
            </SecLabEmpty>
          </SecLabCard>

          <SecLabCard style="width: 320px">
            <template #header>加载中遮罩</template>
            <SecLabLoading :loading="loadingVal" text="正在拼命加载中...">
              <div style="padding: 40px 20px; text-align: center">
                <p>点击下方按钮体验局部 Loading 遮罩</p>
                <SecLabButton
                  type="primary"
                  size="small"
                  @click="triggerLoading"
                >
                  触发 2 秒 Loading
                </SecLabButton>
              </div>
            </SecLabLoading>
          </SecLabCard>
        </div>
      </section>

      <!-- Navigation & Popups (Breadcrumb, Tooltip, Toast) -->
      <section class="card">
        <h3>
          Navigation & Popups (Breadcrumb, Tooltip, Toast) 面包屑、提示、通知
        </h3>

        <!-- Breadcrumb section -->
        <div
          class="row"
          style="flex-direction: column; align-items: flex-start; gap: 8px"
        >
          <label
            style="
              font-size: 13px;
              color: var(--sdl-text-secondary);
              font-weight: 500;
            "
            >面包屑导航</label
          >
          <SecLabBreadcrumb>
            <SecLabBreadcrumbItem>首页</SecLabBreadcrumbItem>
            <SecLabBreadcrumbItem>系统管理</SecLabBreadcrumbItem>
            <SecLabBreadcrumbItem>安全配置</SecLabBreadcrumbItem>
          </SecLabBreadcrumb>
        </div>

        <hr
          style="
            border: none;
            border-top: 1px solid var(--sdl-border-default);
            width: 100%;
            margin: 8px 0;
          "
        />

        <!-- Tooltip section -->
        <div
          class="row"
          style="flex-direction: column; align-items: flex-start; gap: 12px"
        >
          <label
            style="
              font-size: 13px;
              color: var(--sdl-text-secondary);
              font-weight: 500;
            "
            >文字提示 (Tooltip)</label
          >
          <div class="row">
            <SecLabTooltip
              data-ui="qa-tooltip"
              text="这里是上方的提示内容"
              position="top"
            >
              <SecLabButton size="small">上方提示</SecLabButton>
            </SecLabTooltip>
            <SecLabTooltip text="这里是下方的提示内容" position="bottom">
              <SecLabButton size="small">下方提示</SecLabButton>
            </SecLabTooltip>
            <SecLabTooltip text="这里是左侧的提示内容" position="left">
              <SecLabButton size="small">左侧提示</SecLabButton>
            </SecLabTooltip>
            <SecLabTooltip text="这里是右侧的提示内容" position="right">
              <SecLabButton size="small">右侧提示</SecLabButton>
            </SecLabTooltip>
          </div>
        </div>

        <hr
          style="
            border: none;
            border-top: 1px solid var(--sdl-border-default);
            width: 100%;
            margin: 8px 0;
          "
        />

        <!-- Toast section -->
        <div
          class="row"
          style="flex-direction: column; align-items: flex-start; gap: 12px"
        >
          <label
            style="
              font-size: 13px;
              color: var(--sdl-text-secondary);
              font-weight: 500;
            "
            >通知提示 (Toast)</label
          >
          <div class="row">
            <SecLabButton
              type="primary"
              size="small"
              @click="
                addToast(
                  'success',
                  '成功通知',
                  '这是一条操作成功的消息提示，3秒后自动消失。',
                )
              "
            >
              触发成功通知
            </SecLabButton>
            <SecLabButton
              type="danger"
              size="small"
              @click="
                addToast('error', '错误通知', '系统遭遇异常，请查看审计日志。')
              "
            >
              触发错误通知
            </SecLabButton>
            <SecLabButton
              type="warning"
              size="small"
              @click="
                addToast(
                  'warning',
                  '警告通知',
                  '磁盘空间不足，请及时清理缓存文件。',
                )
              "
            >
              触发警告通知
            </SecLabButton>
            <SecLabButton
              type="info"
              size="small"
              @click="
                addToast(
                  'info',
                  '常规通知',
                  '系统于今晚 24:00 进行常规维护升级。',
                )
              "
            >
              触发常规通知
            </SecLabButton>
          </div>
          <!-- Real time toast renderer -->
          <SecLabToast :toasts="toasts" @close="removeToast" />
        </div>
      </section>

      <!-- Layout & Controls (Tabs, Menu, Descriptions, FormItem, ActionMenu) -->
      <section class="card">
        <h3>Layout & Controls 布局与控制组件</h3>

        <!-- Tabs & ActionMenu demo -->
        <div
          class="row"
          style="
            justify-content: space-between;
            width: 100%;
            align-items: flex-end;
          "
        >
          <div style="flex: 1; max-width: 500px">
            <SecLabTabs
              data-ui="qa-tabs"
              v-model="activeTab"
              :tabs="tabsList"
            />
          </div>
          <div>
            <SecLabActionMenu
              data-ui="qa-action-menu"
              :actions="actionsList"
              label="管理操作"
            />
          </div>
        </div>

        <div style="padding: 12px 0">
          <p
            v-if="activeTab === 'tab1'"
            style="font-size: 13px; color: var(--sdl-text-secondary)"
          >
            [基础配置] 标签页激活。下方是详情列表与表单展示：
          </p>
          <p
            v-else-if="activeTab === 'tab2'"
            style="font-size: 13px; color: var(--sdl-text-secondary)"
          >
            [高级设置] 标签页激活。可以在此处设置高吞吐防火墙规则。
          </p>
        </div>

        <div
          class="row"
          style="align-items: flex-start; gap: 24px; width: 100%"
        >
          <!-- Menu demo on left -->
          <div
            style="
              width: 200px;
              flex-shrink: 0;
              background-color: var(--sdl-bg-panel);
              border: 1px solid var(--sdl-border-default);
              border-radius: var(--sdl-radius-md);
              padding: 12px;
            "
          >
            <SecLabMenu
              data-ui="qa-menu"
              v-model="activeMenu"
              :items="menuItems"
            />
          </div>

          <!-- Descriptions & Form demo on right -->
          <div
            style="flex: 1; display: flex; flex-direction: column; gap: 20px"
          >
            <SecLabCard shadow="never" style="padding: 16px">
              <template #header>服务状态详情列表 (Descriptions)</template>
              <SecLabDescriptions
                :items="descItems"
                :data="descData"
                :column="2"
                border
              >
                <template #status="{ data }">
                  <SecLabTag type="success">{{ data?.statusText }}</SecLabTag>
                </template>
              </SecLabDescriptions>
            </SecLabCard>

            <SecLabCard shadow="never" style="padding: 16px">
              <template #header>表单项配置 (FormItem)</template>
              <SecLabFormItem
                data-ui="qa-form-error"
                label="目标节点地址"
                required
                hint="请填写合法的 IPv4/IPv6 节点通信地址"
                error="示例错误：请输入合法的节点地址"
              >
                <SecLabInput
                  v-model="textVal"
                  placeholder="例如 192.168.1.100"
                />
              </SecLabFormItem>
              <SecLabFormItem
                label="启用节点自动备份"
                hint="每天凌晨 02:00 自动冷备份"
              >
                <SecLabSwitch :model-value="true" />
              </SecLabFormItem>
            </SecLabCard>
          </div>
        </div>
      </section>

      <!-- Overlays & Popups (Dialog, Drawer, Modal) -->
      <section class="card">
        <h3>Overlays & Popups 弹窗、抽屉与模态框</h3>
        <div class="row">
          <SecLabButton
            data-ui="qa-open-dialog"
            type="primary"
            @click="dialogVisible = true"
            >打开对话框 (Dialog)</SecLabButton
          >
          <SecLabButton
            data-ui="qa-open-drawer"
            type="secondary"
            @click="drawerVisible = true"
            >打开右侧抽屉 (Drawer)</SecLabButton
          >
          <SecLabButton type="danger" @click="modalVisible = true"
            >打开模态框 (Modal)</SecLabButton
          >
        </div>

        <!-- Dialog demonstration -->
        <SecLabDialog
          data-ui="qa-dialog"
          :visible="dialogVisible"
          title="安全审计详情"
          width="550px"
          @close="dialogVisible = false"
        >
          <div style="display: flex; flex-direction: column; gap: 12px">
            <p>
              这里是对话框的主体内容，支持溢出自动滚动。您可以在这里放置复杂的表单或详情数据：
            </p>
            <SecLabDescriptions
              :items="[
                { label: '审计对象', value: 'API Gateway /auth' },
                { label: '威胁等级', value: 'CRITICAL' },
                { label: '拦截策略', value: 'DROP CONNECTION' },
              ]"
              :column="1"
              border
            />
          </div>
          <template #footer>
            <SecLabButton size="small" @click="dialogVisible = false"
              >关闭</SecLabButton
            >
            <SecLabButton
              type="primary"
              size="small"
              @click="
                addToast('success', '审计确认', '审计数据已存档');
                dialogVisible = false;
              "
            >
              确认并封禁
            </SecLabButton>
          </template>
        </SecLabDialog>

        <!-- Drawer demonstration -->
        <SecLabDrawer
          data-ui="qa-drawer"
          v-model="drawerVisible"
          title="集群高级策略配置"
          width="450px"
          @close="drawerVisible = false"
        >
          <div style="display: flex; flex-direction: column; gap: 20px">
            <p>侧边抽屉通常用于复杂表单的配置，如网关策略、负载均衡参数等。</p>
            <SecLabFormItem
              label="通信加密级别"
              hint="建议在生产环境启用 TLS 1.3"
            >
              <div
                style="
                  border: 1px solid var(--sdl-border-default);
                  border-radius: var(--sdl-radius-md);
                  padding: 8px 12px;
                  font-size: 13px;
                  background-color: var(--sdl-bg-muted);
                  color: var(--sdl-text-muted);
                "
              >
                TLS 1.3 (默认)
              </div>
            </SecLabFormItem>
            <SecLabFormItem
              label="最大并发连接数"
              hint="超过此连接数将进行流量限速"
            >
              <SecLabInput v-model="textVal" placeholder="例如 10000" />
            </SecLabFormItem>
            <SecLabFormItem label="启用 IP 白名单机制">
              <SecLabSwitch v-model="switchVal" />
            </SecLabFormItem>
          </div>
          <template #footer>
            <SecLabButton size="small" @click="drawerVisible = false"
              >取消</SecLabButton
            >
            <SecLabButton
              type="primary"
              size="small"
              @click="
                addToast('success', '保存成功', '高级配置已生效');
                drawerVisible = false;
              "
            >
              保存策略
            </SecLabButton>
          </template>
        </SecLabDrawer>

        <!-- Modal demonstration -->
        <SecLabModal
          :visible="modalVisible"
          title="系统警告"
          message="您确定要彻底删除该容器及其绑定的数据卷吗？此操作属于敏感高危操作，可能会导致宿主机数据丢失，且无法撤销。"
          type="danger"
          confirm-text="强制删除"
          cancel-text="暂不删除"
          @confirm="
            addToast('error', '删除成功', '容器已强制销毁');
            modalVisible = false;
          "
          @cancel="modalVisible = false"
        />
      </section>

      <!-- Selection & Data Pagination (Select, Pagination) -->
      <section class="card">
        <h3>Selection & Pagination 下拉选择与分页</h3>

        <div
          class="row"
          style="
            flex-direction: column;
            align-items: flex-start;
            gap: 20px;
            width: 100%;
          "
        >
          <!-- Select demo -->
          <div style="width: 100%; max-width: 320px">
            <SecLabFormItem
              label="通信通道选择"
              hint="请选择当前要审计的网络通信通道"
            >
              <SecLabSelect
                v-model="selectVal"
                :options="selectOptions"
                @option-disabled="
                  (opt) =>
                    addToast('warning', '选项禁用', `${opt.label} 当前不可选`)
                "
              />
            </SecLabFormItem>
            <span style="font-size: 12px; color: var(--sdl-text-muted)">
              当前选中值:
              <SecLabTag type="primary" size="small">{{ selectVal }}</SecLabTag>
            </span>
          </div>

          <hr
            style="
              border: none;
              border-top: 1px solid var(--sdl-border-default);
              width: 100%;
              margin: 8px 0;
            "
          />

          <!-- Pagination demo -->
          <div
            style="
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 12px;
            "
          >
            <label
              style="
                font-size: 13px;
                color: var(--sdl-text-secondary);
                font-weight: 500;
              "
              >数据分页导航</label
            >
            <div
              style="
                display: flex;
                align-items: center;
                gap: 20px;
                flex-wrap: wrap;
              "
            >
              <SecLabPagination
                data-ui="qa-pagination"
                :current-page="currentPageVal"
                :total-pages="totalPagesVal"
                @page-change="
                  (page) => {
                    currentPageVal = page;
                    addToast('info', '页面切换', `已导航至第 ${page} 页`);
                  }
                "
              />
              <span style="font-size: 12px; color: var(--sdl-text-muted)">
                当前页数:
                <SecLabTag type="success" size="small"
                  >{{ currentPageVal }} / {{ totalPagesVal }}</SecLabTag
                >
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tables & DateTime Range Pickers -->
      <section class="card">
        <h3>Tables & DatePickers 表格与日期时间选择器</h3>

        <div
          class="row"
          style="
            flex-direction: column;
            align-items: flex-start;
            gap: 24px;
            width: 100%;
          "
        >
          <!-- Date picker demo -->
          <div style="width: 100%; max-width: 450px">
            <SecLabFormItem
              label="统计时间范围 (DateTimeRangePicker)"
              hint="点击输入框选择自定义的时间窗口"
            >
              <SecLabDateTimeRangePicker
                data-ui="qa-date-time-range"
                v-model="rangeVal"
                placeholder="请选择时间范围"
                start-label="起始时间"
                end-label="结束时间"
                shortcuts-label="快捷范围"
                calendar-label="日历选择"
                time-label="具体时间"
                clear-label="清空"
                confirm-label="确认"
                cancel-label="取消"
                locale="zh"
                :week-days="weekDaysList"
                :shortcuts="shortcutOptions"
                @apply="
                  (val) => addToast('success', '时间范围已应用', `已选中范围。`)
                "
              />
            </SecLabFormItem>
          </div>

          <hr
            style="
              border: none;
              border-top: 1px solid var(--sdl-border-default);
              width: 100%;
              margin: 8px 0;
            "
          />

          <!-- Table demo -->
          <div style="width: 100%">
            <label
              style="
                font-size: 13px;
                color: var(--sdl-text-secondary);
                font-weight: 500;
                display: block;
                margin-bottom: 12px;
              "
            >
              自研数据表格 (SecLabTable)
            </label>
            <SecLabTable
              data-ui="qa-table"
              :data="tableData"
              :columns="tableColumns"
              border
            >
              <template #status="{ row }">
                <SecLabTag
                  :type="row.status === 'active' ? 'success' : 'warning'"
                >
                  {{ row.status === "active" ? "正常运行" : "正在维护" }}
                </SecLabTag>
              </template>
              <template #actions="{ row }">
                <SecLabButton
                  type="primary"
                  size="small"
                  @click="
                    addToast('info', '节点操作', `正在连接到 ${row.name}`)
                  "
                >
                  管理
                </SecLabButton>
              </template>
            </SecLabTable>
          </div>

          <!-- Empty table demo -->
          <div style="width: 100%">
            <label
              style="
                font-size: 13px;
                color: var(--sdl-text-secondary);
                font-weight: 500;
                display: block;
                margin-bottom: 12px;
              "
            >
              表格无数据占位状态 (SecLabTable Empty)
            </label>
            <SecLabTable
              :data="[]"
              :columns="tableColumns"
              border
              empty-text="当前网段内未发现可用的安全通信节点。"
            />
          </div>
        </div>
      </section>
    </main>
    <div class="viewport-edge-select" data-ui="select-viewport-edge-demo">
      <span>每页显示</span>
      <SecLabSelect v-model="selectVal" :options="selectOptions" />
    </div>
  </div>
</template>

<style>
/* CSS overrides to style the playground wrapper */
html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  font-family: var(--sdl-font-family);
  background-color: var(--sdl-bg-canvas);
  color: var(--sdl-text-primary);
  overflow-y: auto !important;
}

.playground-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.playground-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--sdl-border-default);
  padding-bottom: 20px;
}

.playground-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}

.playground-header p {
  margin: 4px 0 0 0;
  color: var(--sdl-text-muted);
  font-size: 14px;
}

.playground-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background-color: var(--sdl-bg-panel);
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-lg);
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  border-left: 3px solid var(--sdl-primary);
  padding-left: 10px;
}

.row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-size: 13px;
  color: var(--sdl-text-secondary);
  font-weight: 500;
}

.form-item .hint {
  font-size: 12px;
  color: var(--sdl-text-muted);
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
}

.icon-item {
  background-color: var(--sdl-bg-muted);
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-md);
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--sdl-text-primary);
}

.icon-item span {
  font-size: 11px;
  color: var(--sdl-text-muted);
  text-align: center;
  word-break: break-all;
}

.viewport-edge-select {
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: var(--sdl-z-index-popover);
  display: grid;
  grid-template-columns: auto 180px;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-md);
  background: var(--sdl-bg-panel);
  box-shadow: var(--sdl-shadow-panel);
  color: var(--sdl-text-secondary);
  font-size: var(--sdl-font-body-sm);
}
</style>
