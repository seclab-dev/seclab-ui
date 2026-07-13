import { enableAutoUnmount, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import SecLabActionMenu from "../../packages/vue/src/components/SecLabActionMenu.vue";
import SecLabAlert from "../../packages/vue/src/components/SecLabAlert.vue";
import SecLabBreadcrumb from "../../packages/vue/src/components/SecLabBreadcrumb.vue";
import SecLabBreadcrumbItem from "../../packages/vue/src/components/SecLabBreadcrumbItem.vue";
import SecLabButton from "../../packages/vue/src/components/SecLabButton.vue";
import SecLabCard from "../../packages/vue/src/components/SecLabCard.vue";
import SecLabDateTimeRangePicker from "../../packages/vue/src/components/SecLabDateTimeRangePicker.vue";
import SecLabDescriptions from "../../packages/vue/src/components/SecLabDescriptions.vue";
import SecLabDialog from "../../packages/vue/src/components/SecLabDialog.vue";
import SecLabDrawer from "../../packages/vue/src/components/SecLabDrawer.vue";
import SecLabEmpty from "../../packages/vue/src/components/SecLabEmpty.vue";
import SecLabIcon from "../../packages/vue/src/components/SecLabIcon.vue";
import SecLabMenu from "../../packages/vue/src/components/SecLabMenu.vue";
import SecLabPagination from "../../packages/vue/src/components/SecLabPagination.vue";
import SecLabTabs from "../../packages/vue/src/components/SecLabTabs.vue";
import SecLabTag from "../../packages/vue/src/components/SecLabTag.vue";
import SecLabTooltip from "../../packages/vue/src/components/SecLabTooltip.vue";

enableAutoUnmount(afterEach);

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("Vue 扩展组件行为", () => {
  it("ActionMenu 支持键盘打开和执行", async () => {
    const handler = vi.fn();
    const wrapper = mount(SecLabActionMenu, {
      attachTo: document.body,
      props: { actions: [{ label: "执行", handler }] },
    });
    await wrapper.get(".sl-action-btn").trigger("keydown", { key: "Enter" });
    document.querySelector<HTMLButtonElement>('[role="menuitem"]')!.click();
    expect(handler).toHaveBeenCalledOnce();
  });

  it("Tooltip 渲染提示语义", async () => {
    const wrapper = mount(SecLabTooltip, {
      attachTo: document.body,
      props: { text: "帮助", delay: 0 },
      slots: { default: "<button>目标</button>" },
    });
    await wrapper.get(".sl-tooltip-wrapper").trigger("mouseenter");
    await new Promise((resolve) => setTimeout(resolve));
    expect(document.querySelector('[role="tooltip"]')?.textContent).toContain(
      "帮助",
    );
  });

  it("Dialog 与 Drawer 响应 Escape", async () => {
    const dialog = mount(SecLabDialog, {
      attachTo: document.body,
      props: { visible: true, title: "对话框" },
    });
    await new Promise((resolve) => setTimeout(resolve));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(dialog.emitted("close")).toHaveLength(1);
    dialog.unmount();
    const drawer = mount(SecLabDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: "抽屉" },
    });
    await new Promise((resolve) => setTimeout(resolve));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(drawer.emitted("update:modelValue")?.at(-1)).toEqual([false]);
  });

  it("嵌套模态关闭一层后继续保持滚动锁", async () => {
    const dialog = mount(SecLabDialog, {
      attachTo: document.body,
      props: { visible: true, title: "外层" },
    });
    const drawer = mount(SecLabDrawer, {
      attachTo: document.body,
      props: { modelValue: true, title: "内层" },
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(document.body.style.overflow).toBe("hidden");
    drawer.unmount();
    expect(document.body.style.overflow).toBe("hidden");
    dialog.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("Tabs、Menu 与 Pagination 支持键盘或原生按钮交互", async () => {
    const tabs = mount(SecLabTabs, {
      props: {
        modelValue: "a",
        tabs: [
          { name: "a", label: "A" },
          { name: "b", label: "B" },
        ],
      },
    });
    await tabs.get('[role="tab"]').trigger("keydown", { key: "ArrowRight" });
    expect(tabs.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);
    const menu = mount(SecLabMenu, {
      attachTo: document.body,
      props: {
        modelValue: "a",
        items: [
          {
            key: "group",
            label: "分组",
            children: [
              { key: "a", label: "A" },
              { key: "b", label: "B" },
            ],
          },
        ],
      },
    });
    menu.findAll("button")[0].element.focus();
    await menu.findAll("button")[0].trigger("keydown", { key: "ArrowDown" });
    expect(document.activeElement).toBe(menu.findAll("button")[1].element);
    const pagination = mount(SecLabPagination, {
      props: { currentPage: 1, totalPages: 3 },
    });
    await pagination.findAll("button").at(-1)!.trigger("click");
    expect(pagination.emitted("page-change")?.at(-1)).toEqual([2]);
  });

  it("DateTimeRangePicker 提供可操作触发器", () => {
    const wrapper = mount(SecLabDateTimeRangePicker, {
      props: {
        modelValue: { startAt: null, endAt: null },
        placeholder: "选择时间",
        startLabel: "开始",
        endLabel: "结束",
        shortcutsLabel: "快捷",
        calendarLabel: "日历",
        timeLabel: "时间",
        clearLabel: "清除",
        confirmLabel: "确认",
        cancelLabel: "取消",
        locale: "zh",
        weekDays: ["一", "二", "三", "四", "五", "六", "日"],
        shortcuts: [],
      },
    });
    expect(wrapper.find("button").exists()).toBe(true);
  });

  it("展示组件渲染公开状态", async () => {
    expect(
      mount(SecLabButton, {
        props: { loading: true },
        slots: { default: "保存" },
      })
        .get("button")
        .attributes("disabled"),
    ).toBeDefined();
    expect(
      mount(SecLabTag, {
        props: { type: "success" },
        slots: { default: "正常" },
      }).classes(),
    ).toContain("sl-tag");
    expect(mount(SecLabCard, { slots: { default: "内容" } }).text()).toContain(
      "内容",
    );
    const alert = mount(SecLabAlert, {
      props: { title: "警告", closable: true },
    });
    await alert.get("button").trigger("click");
    expect(alert.emitted("close")).toHaveLength(1);
    expect(
      mount(SecLabEmpty, { props: { description: "暂无" } }).text(),
    ).toContain("暂无");
    expect(
      mount(SecLabDescriptions, {
        props: { items: [{ label: "名称", value: "节点" }] },
      }).text(),
    ).toContain("节点");
    expect(
      mount(SecLabIcon, {
        props: { name: "info", decorative: false, label: "信息" },
      }).attributes("aria-label"),
    ).toBe("信息");
    expect(
      mount(SecLabBreadcrumb, {
        slots: { default: [SecLabBreadcrumbItem] },
      }).exists(),
    ).toBe(true);
  });
});
