import "@testing-library/jest-dom/vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SecLabCheckbox } from "../../packages/react/src/components/SecLabCheckbox/SecLabCheckbox";
import { SecLabFormItem } from "../../packages/react/src/components/SecLabFormItem/SecLabFormItem";
import { SecLabInput } from "../../packages/react/src/components/SecLabInput/SecLabInput";
import { SecLabLoading } from "../../packages/react/src/components/SecLabLoading/SecLabLoading";
import { SecLabModal } from "../../packages/react/src/components/SecLabModal/SecLabModal";
import { SecLabSelect } from "../../packages/react/src/components/SecLabSelect/SecLabSelect";
import { SecLabSwitch } from "../../packages/react/src/components/SecLabSwitch/SecLabSwitch";
import { SecLabTable } from "../../packages/react/src/components/SecLabTable/SecLabTable";
import { SecLabToast } from "../../packages/react/src/components/SecLabToast/SecLabToast";

afterEach(cleanup);

describe("React 公共组件行为", () => {
  it("Select 支持键盘选择并暴露 listbox 语义", async () => {
    const onChange = vi.fn();
    render(
      <SecLabSelect
        value={null}
        options={[{ label: "可用", value: "enabled" }]}
        onChange={onChange}
      />,
    );
    const combobox = screen.getByRole("combobox");
    await userEvent.type(combobox, "{enter}");
    await userEvent.type(combobox, "{enter}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith("enabled");
  });

  it("Modal 响应 Escape 并恢复触发器焦点", async () => {
    const onCancel = vi.fn();
    const trigger = document.createElement("button");
    document.body.append(trigger);
    trigger.focus();
    const view = render(
      <SecLabModal
        visible
        title="确认"
        message="继续操作"
        onCancel={onCancel}
      />,
    );
    await waitFor(() =>
      expect(screen.getByRole("alertdialog")).toContainElement(
        document.activeElement as HTMLElement,
      ),
    );
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
    view.rerender(
      <SecLabModal
        visible={false}
        title="确认"
        message="继续操作"
        onCancel={onCancel}
      />,
    );
    expect(trigger).toHaveFocus();
  });

  it("Switch 与 Checkbox 暴露原生状态", async () => {
    const onChange = vi.fn();
    const { rerender } = render(
      <SecLabSwitch value={false} onChange={onChange} />,
    );
    await userEvent.click(screen.getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
    rerender(
      <SecLabCheckbox checked={false} indeterminate onChange={vi.fn()} />,
    );
    expect(screen.getByRole("checkbox")).toBePartiallyChecked();
  });

  it("FormItem 关联 label、hint 与 error", () => {
    render(
      <SecLabFormItem
        label="端口"
        htmlFor="port"
        hint="1-65535"
        error="无效端口"
      >
        <input id="port" />
      </SecLabFormItem>,
    );
    expect(screen.getByLabelText("端口")).toHaveAttribute("id", "port");
    expect(screen.getByRole("alert")).toHaveTextContent("无效端口");
  });

  it("Input 数字模式发出 number 或 null", () => {
    const onChange = vi.fn();
    render(
      <SecLabInput<number | null>
        type="number"
        value={1}
        onChange={onChange}
      />,
    );
    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "42" },
    });
    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "" } });
    expect(onChange).toHaveBeenNthCalledWith(1, 42);
    expect(onChange).toHaveBeenNthCalledWith(2, null);
  });

  it("Table 累计固定列偏移", () => {
    render(
      <SecLabTable
        data={[{ id: "row-1", name: "节点" }]}
        rowKey="id"
        columns={[
          { prop: "id", label: "ID", width: 80, fixed: "left" },
          { prop: "name", label: "名称", width: 120, fixed: "left" },
        ]}
      />,
    );
    expect(screen.getByText("节点").closest("td")).toHaveStyle({
      left: "80px",
    });
  });

  it("Toast 仅由关闭按钮关闭，Loading 暴露 busy 状态", async () => {
    const onClose = vi.fn();
    const view = render(
      <SecLabToast
        toasts={[{ id: "1", type: "info", title: "标题", message: "内容" }]}
        onClose={onClose}
      />,
    );
    await userEvent.click(screen.getByText("内容"));
    expect(onClose).not.toHaveBeenCalled();
    await userEvent.click(
      screen.getByRole("button", { name: "Close notification" }),
    );
    expect(onClose).toHaveBeenCalledWith("1");
    view.rerender(<SecLabLoading loading text="加载" />);
    expect(
      screen.getByText("加载").closest('[aria-busy="true"]'),
    ).not.toBeNull();
  });
});
