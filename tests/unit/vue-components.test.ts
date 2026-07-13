import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it } from "vitest";
import SecLabCheckbox from "../../packages/vue/src/components/SecLabCheckbox.vue";
import SecLabFormItem from "../../packages/vue/src/components/SecLabFormItem.vue";
import SecLabInput from "../../packages/vue/src/components/SecLabInput.vue";
import SecLabLoading from "../../packages/vue/src/components/SecLabLoading.vue";
import SecLabModal from "../../packages/vue/src/components/SecLabModal.vue";
import SecLabSelect from "../../packages/vue/src/components/SecLabSelect.vue";
import SecLabSwitch from "../../packages/vue/src/components/SecLabSwitch.vue";
import SecLabTable from "../../packages/vue/src/components/SecLabTable.vue";
import SecLabToast from "../../packages/vue/src/components/SecLabToast.vue";

afterEach(() => {
  document.body.innerHTML = "";
});

describe("Vue 公共组件行为", () => {
  it("Select 支持键盘选择并暴露 listbox 语义", async () => {
    const wrapper = mount(SecLabSelect, {
      attachTo: document.body,
      props: {
        modelValue: null,
        options: [
          { label: "禁用", value: "disabled", disabled: true },
          { label: "可用", value: "enabled" },
        ],
      },
    });
    const combobox = wrapper.get('[role="combobox"]');
    await combobox.trigger("keydown", { key: "Enter" });
    expect(document.querySelector('[role="listbox"]')).not.toBeNull();
    await combobox.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["enabled"]);
  });

  it("Modal 限制焦点、响应 Escape 并恢复触发器焦点", async () => {
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const wrapper = mount(SecLabModal, {
      attachTo: document.body,
      props: { visible: true, title: "确认", message: "继续操作" },
    });
    await new Promise((resolve) => setTimeout(resolve));
    expect(
      document.activeElement?.closest('[role="alertdialog"]'),
    ).not.toBeNull();
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(wrapper.emitted("cancel")).toHaveLength(1);
    await wrapper.setProps({ visible: false });
    expect(document.activeElement).toBe(trigger);
  });

  it("Switch 与 Checkbox 暴露原生状态", async () => {
    const switchWrapper = mount(SecLabSwitch, { props: { modelValue: false } });
    await switchWrapper.get('button[role="switch"]').trigger("click");
    expect(switchWrapper.emitted("change")?.[0]).toEqual([true]);
    const checkbox = mount(SecLabCheckbox, {
      props: { modelValue: false, indeterminate: true },
    });
    await checkbox.vm.$nextTick();
    expect(checkbox.get("input").element.indeterminate).toBe(true);
    expect(checkbox.get("input").attributes("aria-checked")).toBe("mixed");
  });

  it("FormItem 关联 label、hint 与 error", () => {
    const wrapper = mount(SecLabFormItem, {
      props: { label: "端口", for: "port", hint: "1-65535", error: "无效端口" },
      slots: { default: '<input id="port" />' },
    });
    expect(wrapper.get("label").attributes("for")).toBe("port");
    expect(wrapper.get('[role="alert"]').text()).toBe("无效端口");
  });

  it("Input 数字模式发出 number 或 null", async () => {
    const wrapper = mount(SecLabInput, {
      props: { modelValue: 1, type: "number" },
    });
    await wrapper.get("input").setValue("42");
    await wrapper.get("input").setValue("");
    expect(wrapper.emitted("update:modelValue")).toEqual([[42], [null]]);
  });

  it("Table 使用稳定行键并累计固定列偏移", () => {
    const wrapper = mount(SecLabTable, {
      props: {
        data: [{ id: "row-1", name: "节点" }],
        rowKey: "id",
        columns: [
          { prop: "id", label: "ID", width: 80, fixed: "left" },
          { prop: "name", label: "名称", width: 120, fixed: "left" },
        ],
      },
    });
    const cells = wrapper.findAll("tbody td");
    expect(cells[1].attributes("style")).toContain("left: 80px");
  });

  it("Toast 仅由关闭按钮关闭，Loading 暴露 busy 状态", async () => {
    const toast = mount(SecLabToast, {
      attachTo: document.body,
      props: {
        toasts: [{ id: "1", type: "info", title: "标题", message: "内容" }],
      },
    });
    const item = document.querySelector<HTMLElement>(".sl-toast-item")!;
    item.click();
    expect(toast.emitted("close")).toBeUndefined();
    document.querySelector<HTMLButtonElement>(".sl-toast-close")!.click();
    expect(toast.emitted("close")?.[0]).toEqual(["1"]);
    const loading = mount(SecLabLoading, {
      props: { loading: true, text: "加载" },
    });
    expect(loading.get(".sl-loading-host").attributes("aria-busy")).toBe(
      "true",
    );
    expect(loading.get('[role="status"]').text()).toContain("加载");
  });
});
