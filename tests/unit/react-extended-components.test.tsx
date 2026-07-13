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
import {
  SecLabActionMenu,
  SecLabAlert,
  SecLabBreadcrumb,
  SecLabBreadcrumbItem,
  SecLabButton,
  SecLabCard,
  SecLabDateTimeRangePicker,
  SecLabDescriptions,
  SecLabDialog,
  SecLabDrawer,
  SecLabEmpty,
  SecLabIcon,
  SecLabMenu,
  SecLabPagination,
  SecLabTabs,
  SecLabTag,
  SecLabTooltip,
} from "../../packages/react/src";

afterEach(cleanup);

describe("React 扩展组件行为", () => {
  it("ActionMenu 支持键盘打开和执行", async () => {
    const handler = vi.fn();
    render(<SecLabActionMenu actions={[{ label: "执行", handler }]} />);
    fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
    await userEvent.click(await screen.findByRole("menuitem"));
    expect(handler).toHaveBeenCalledOnce();
  });

  it("Tooltip 渲染提示语义", async () => {
    render(
      <SecLabTooltip text="帮助" delay={0}>
        <button>目标</button>
      </SecLabTooltip>,
    );
    fireEvent.mouseEnter(
      screen.getByRole("button", { name: "目标" }).parentElement!,
    );
    await waitFor(() =>
      expect(screen.getByRole("tooltip")).toHaveTextContent("帮助"),
    );
  });

  it("Dialog 与 Drawer 响应 Escape", async () => {
    const closeDialog = vi.fn();
    const view = render(
      <SecLabDialog visible title="对话框" onClose={closeDialog}>
        内容
      </SecLabDialog>,
    );
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeDialog).toHaveBeenCalledOnce();
    view.unmount();
    const closeDrawer = vi.fn();
    render(
      <SecLabDrawer visible title="抽屉" onClose={closeDrawer}>
        内容
      </SecLabDrawer>,
    );
    await screen.findByRole("dialog");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(closeDrawer).toHaveBeenCalledOnce();
  });

  it("嵌套模态关闭一层后继续保持滚动锁", async () => {
    const view = render(
      <>
        <SecLabDialog visible title="外层">
          内容
        </SecLabDialog>
        <SecLabDrawer visible title="内层">
          内容
        </SecLabDrawer>
      </>,
    );
    await waitFor(() => expect(document.body.style.overflow).toBe("hidden"));
    view.rerender(
      <SecLabDrawer visible title="内层">
        内容
      </SecLabDrawer>,
    );
    expect(document.body.style.overflow).toBe("hidden");
    view.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("Tabs、Menu 与 Pagination 支持键盘或原生按钮交互", async () => {
    const onTab = vi.fn();
    const view = render(
      <SecLabTabs
        value="a"
        onChange={onTab}
        tabs={[
          { name: "a", label: "A" },
          { name: "b", label: "B" },
        ]}
      />,
    );
    fireEvent.keyDown(screen.getAllByRole("tab")[0], { key: "ArrowRight" });
    expect(onTab).toHaveBeenCalledWith("b");
    view.unmount();
    render(
      <SecLabMenu
        value="a"
        onChange={vi.fn()}
        items={[
          {
            key: "group",
            label: "分组",
            children: [
              { key: "a", label: "A" },
              { key: "b", label: "B" },
            ],
          },
        ]}
      />,
    );
    const menuButtons = screen.getAllByRole("button");
    menuButtons[0].focus();
    fireEvent.keyDown(menuButtons[0], { key: "ArrowDown" });
    expect(menuButtons[1]).toHaveFocus();
    cleanup();
    const onPage = vi.fn();
    render(
      <SecLabPagination currentPage={1} totalPages={3} onPageChange={onPage} />,
    );
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onPage).toHaveBeenCalledWith(2);
  });

  it("DateTimeRangePicker 提供可操作触发器", () => {
    render(
      <SecLabDateTimeRangePicker
        value={{ startAt: null, endAt: null }}
        onChange={vi.fn()}
        placeholder="选择时间"
        startLabel="开始"
        endLabel="结束"
        shortcutsLabel="快捷"
        calendarLabel="日历"
        timeLabel="时间"
        clearLabel="清除"
        confirmLabel="确认"
        cancelLabel="取消"
        locale="zh"
        weekDays={["一", "二", "三", "四", "五", "六", "日"]}
        shortcuts={[]}
      />,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("展示组件渲染公开状态", async () => {
    const view = render(<SecLabButton loading>保存</SecLabButton>);
    expect(screen.getByRole("button")).toBeDisabled();
    view.rerender(<SecLabTag type="success">正常</SecLabTag>);
    expect(screen.getByText("正常")).toHaveClass("sl-tag");
    view.rerender(<SecLabCard>内容</SecLabCard>);
    expect(screen.getByText("内容")).toBeInTheDocument();
    const onClose = vi.fn();
    view.rerender(<SecLabAlert title="警告" closable onClose={onClose} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledOnce();
    view.rerender(<SecLabEmpty description="暂无" />);
    expect(screen.getByText("暂无")).toBeInTheDocument();
    view.rerender(
      <SecLabDescriptions items={[{ label: "名称", value: "节点" }]} />,
    );
    expect(screen.getByText("节点")).toBeInTheDocument();
    view.rerender(<SecLabIcon name="info" decorative={false} label="信息" />);
    expect(screen.getByLabelText("信息")).toBeInTheDocument();
    view.rerender(
      <SecLabBreadcrumb>
        <SecLabBreadcrumbItem>首页</SecLabBreadcrumbItem>
      </SecLabBreadcrumb>,
    );
    expect(screen.getByText("首页")).toBeInTheDocument();
  });
});
