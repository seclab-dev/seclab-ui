<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";

/**
 * @file SecLabDateTimeRangePicker.vue
 * @description SecLab 自研日期时间范围选择器，支持快捷范围、日历选择与时间列表选择。
 */

export interface DateTimeRangeValue {
  startAt: number | null;
  endAt: number | null;
}

interface ShortcutOption {
  label: string;
  value: "15m" | "1h" | "24h" | "7d" | "today";
}

interface Props {
  /** 绑定的时间范围，使用 Unix epoch milliseconds。 */
  modelValue: DateTimeRangeValue;
  /** 占位文案 */
  placeholder: string;
  /** 起始端标签 */
  startLabel: string;
  /** 结束端标签 */
  endLabel: string;
  /** 快捷范围标题 */
  shortcutsLabel: string;
  /** 日历标题 */
  calendarLabel: string;
  /** 时间标题 */
  timeLabel: string;
  /** 清空按钮文案 */
  clearLabel: string;
  /** 确认按钮文案 */
  confirmLabel: string;
  /** 取消按钮文案 */
  cancelLabel: string;
  /** 当前应用语言 */
  locale: string;
  /** 星期标题，长度为 7。 */
  weekDays: string[];
  /** 快捷范围选项 */
  shortcuts: ShortcutOption[];
  /** 是否禁用 */
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: DateTimeRangeValue): void;
  (e: "apply", value: DateTimeRangeValue): void;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const panelRef = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const activeBoundary = ref<"start" | "end">("start");
const draft = ref<DateTimeRangeValue>({ startAt: null, endAt: null });
const visibleMonth = ref(startOfMonth(new Date()));
const panelStyle = ref<Record<string, string>>({});

const hours = Array.from({ length: 24 }, (_, index) => index);
const minutes = Array.from({ length: 12 }, (_, index) => index * 5);

const displayText = computed(() => {
  if (!props.modelValue.startAt && !props.modelValue.endAt)
    return props.placeholder;
  return `${formatDateTime(props.modelValue.startAt)} - ${formatDateTime(props.modelValue.endAt)}`;
});

const activeDate = computed(() =>
  timestampToDate(draft.value[`${activeBoundary.value}At`]),
);
const activeHour = computed(() => activeDate.value.getHours());
const activeMinute = computed(
  () => Math.floor(activeDate.value.getMinutes() / 5) * 5,
);

const calendarTitle = computed(() =>
  visibleMonth.value.toLocaleDateString(
    props.locale === "zh" ? "zh-CN" : "en-US",
    {
      year: "numeric",
      month: "long",
    },
  ),
);

const calendarDays = computed(() => {
  const monthStart = startOfMonth(visibleMonth.value);
  const firstDay = monthStart.getDay();
  const gridStart = addDays(monthStart, -firstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    const timestamp = date.getTime();
    const start = draft.value.startAt
      ? startOfDay(new Date(draft.value.startAt)).getTime()
      : null;
    const end = draft.value.endAt
      ? startOfDay(new Date(draft.value.endAt)).getTime()
      : null;
    const rangeStart =
      start !== null && end !== null ? Math.min(start, end) : null;
    const rangeEnd =
      start !== null && end !== null ? Math.max(start, end) : null;

    return {
      date,
      key: toDateKey(date),
      label: String(date.getDate()),
      muted: date.getMonth() !== visibleMonth.value.getMonth(),
      today: toDateKey(date) === toDateKey(new Date()),
      selectedStart: start === timestamp,
      selectedEnd: end === timestamp,
      inRange:
        rangeStart !== null &&
        rangeEnd !== null &&
        timestamp > rangeStart &&
        timestamp < rangeEnd,
    };
  });
});

function normalizeRange(value: DateTimeRangeValue): DateTimeRangeValue {
  const startAt = value.startAt ?? null;
  const endAt = value.endAt ?? null;

  if (startAt !== null && endAt !== null && startAt > endAt) {
    return { startAt: endAt, endAt: startAt };
  }

  return { startAt, endAt };
}

function timestampToDate(value: number | null | undefined) {
  return value ? new Date(value) : new Date();
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1, 0, 0, 0, 0);
}

function startOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
}

function endOfDay(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function toDateKey(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatDateTime(value: number | null) {
  if (!value) return "--";
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hour = String(date.getHours()).padStart(2, "0");
  const minute = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

function updatePanelPosition() {
  const trigger = triggerRef.value;
  if (!trigger) return;

  const rect = trigger.getBoundingClientRect();
  const width = 620;
  const gap = 8;
  const left = Math.min(Math.max(8, rect.left), window.innerWidth - width - 8);
  const top = Math.min(rect.bottom + gap, window.innerHeight - 468);

  panelStyle.value = {
    width: `${width}px`,
    left: `${left}px`,
    top: `${Math.max(8, top)}px`,
  };
}

function openPanel() {
  if (props.disabled) return;

  draft.value = normalizeRange(props.modelValue);
  const anchor = draft.value.startAt ?? draft.value.endAt ?? Date.now();
  visibleMonth.value = startOfMonth(new Date(anchor));
  isOpen.value = true;
  void nextTick(updatePanelPosition);
  window.addEventListener("resize", updatePanelPosition);
  window.addEventListener("scroll", updatePanelPosition, true);
  document.addEventListener("mousedown", handleOutsideClick);
  document.addEventListener("keydown", handleKeydown);
}

function closePanel() {
  isOpen.value = false;
  window.removeEventListener("resize", updatePanelPosition);
  window.removeEventListener("scroll", updatePanelPosition, true);
  document.removeEventListener("mousedown", handleOutsideClick);
  document.removeEventListener("keydown", handleKeydown);
}

function handleOutsideClick(event: MouseEvent) {
  const target = event.target as Node;
  if (triggerRef.value?.contains(target) || panelRef.value?.contains(target))
    return;
  closePanel();
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closePanel();
}

function shiftMonth(offset: number) {
  visibleMonth.value = new Date(
    visibleMonth.value.getFullYear(),
    visibleMonth.value.getMonth() + offset,
    1,
  );
}

function setBoundaryDate(date: Date) {
  const current = activeDate.value;
  const next = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    current.getHours(),
    current.getMinutes(),
    0,
    0,
  );
  draft.value = normalizeRange({
    ...draft.value,
    [`${activeBoundary.value}At`]: next.getTime(),
  });
}

function setBoundaryTime(hour: number, minute: number) {
  const current = activeDate.value;
  const next = new Date(
    current.getFullYear(),
    current.getMonth(),
    current.getDate(),
    hour,
    minute,
    0,
    0,
  );
  draft.value = normalizeRange({
    ...draft.value,
    [`${activeBoundary.value}At`]: next.getTime(),
  });
}

function applyShortcut(value: ShortcutOption["value"]) {
  const now = new Date();
  let next: DateTimeRangeValue;

  if (value === "today") {
    next = {
      startAt: startOfDay(now).getTime(),
      endAt: endOfDay(now).getTime(),
    };
  } else {
    const spanMap = {
      "15m": 15 * 60 * 1000,
      "1h": 60 * 60 * 1000,
      "24h": 24 * 60 * 60 * 1000,
      "7d": 7 * 24 * 60 * 60 * 1000,
    };
    next = {
      startAt: now.getTime() - spanMap[value],
      endAt: now.getTime(),
    };
  }

  draft.value = next;
  visibleMonth.value = startOfMonth(new Date(next.startAt ?? Date.now()));
}

function clearRange() {
  const empty = { startAt: null, endAt: null };
  draft.value = empty;
  emit("update:modelValue", empty);
  emit("apply", empty);
  closePanel();
}

function confirmRange() {
  const next = normalizeRange(draft.value);
  emit("update:modelValue", next);
  emit("apply", next);
  closePanel();
}

watch(
  () => props.modelValue,
  (value) => {
    if (!isOpen.value) draft.value = normalizeRange(value);
  },
  { deep: true },
);

onBeforeUnmount(closePanel);
</script>

<template>
  <div class="sl-date-time-range-picker" data-ui="date-time-range-picker">
    <button
      ref="triggerRef"
      type="button"
      class="range-trigger"
      :class="{ 'is-placeholder': !modelValue.startAt && !modelValue.endAt }"
      :disabled="disabled"
      @click="isOpen ? closePanel() : openPanel()"
    >
      <span class="trigger-text">{{ displayText }}</span>
    </button>

    <Teleport to="body">
      <div v-if="isOpen" ref="panelRef" class="range-panel" :style="panelStyle">
        <aside class="shortcut-column">
          <div class="panel-title">{{ shortcutsLabel }}</div>
          <button
            v-for="shortcut in shortcuts"
            :key="shortcut.value"
            type="button"
            class="shortcut-button"
            @click="applyShortcut(shortcut.value)"
          >
            {{ shortcut.label }}
          </button>
        </aside>

        <section class="calendar-column">
          <div class="panel-title">{{ calendarLabel }}</div>
          <div class="boundary-switch">
            <button
              type="button"
              class="boundary-button"
              :class="{ 'is-active': activeBoundary === 'start' }"
              @click="activeBoundary = 'start'"
            >
              <span>{{ startLabel }}</span>
              <strong>{{ formatDateTime(draft.startAt) }}</strong>
            </button>
            <button
              type="button"
              class="boundary-button"
              :class="{ 'is-active': activeBoundary === 'end' }"
              @click="activeBoundary = 'end'"
            >
              <span>{{ endLabel }}</span>
              <strong>{{ formatDateTime(draft.endAt) }}</strong>
            </button>
          </div>

          <div class="calendar-header">
            <button type="button" class="month-button" @click="shiftMonth(-1)">
              ‹
            </button>
            <span>{{ calendarTitle }}</span>
            <button type="button" class="month-button" @click="shiftMonth(1)">
              ›
            </button>
          </div>

          <div class="week-grid">
            <span v-for="day in weekDays" :key="day">{{ day }}</span>
          </div>

          <div class="day-grid">
            <button
              v-for="day in calendarDays"
              :key="day.key"
              type="button"
              class="day-button"
              :class="{
                'is-muted': day.muted,
                'is-today': day.today,
                'is-selected-start': day.selectedStart,
                'is-selected-end': day.selectedEnd,
                'is-in-range': day.inRange,
              }"
              @click="setBoundaryDate(day.date)"
            >
              {{ day.label }}
            </button>
          </div>
        </section>

        <section class="time-column">
          <div class="panel-title">{{ timeLabel }}</div>
          <div class="time-lists">
            <div class="time-list">
              <button
                v-for="hour in hours"
                :key="hour"
                type="button"
                class="time-option"
                :class="{ 'is-active': activeHour === hour }"
                @click="setBoundaryTime(hour, activeMinute)"
              >
                {{ String(hour).padStart(2, "0") }}
              </button>
            </div>
            <div class="time-list">
              <button
                v-for="minute in minutes"
                :key="minute"
                type="button"
                class="time-option"
                :class="{ 'is-active': activeMinute === minute }"
                @click="setBoundaryTime(activeHour, minute)"
              >
                {{ String(minute).padStart(2, "0") }}
              </button>
            </div>
          </div>
        </section>

        <footer class="panel-actions">
          <button type="button" class="text-button" @click="clearRange">
            {{ clearLabel }}
          </button>
          <span class="action-spacer"></span>
          <button type="button" class="text-button" @click="closePanel">
            {{ cancelLabel }}
          </button>
          <button type="button" class="confirm-button" @click="confirmRange">
            {{ confirmLabel }}
          </button>
        </footer>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.sl-date-time-range-picker {
  width: 100%;
}

.range-trigger {
  display: flex;
  align-items: center;
  width: 100%;
  height: 36px;
  padding: 0 var(--sdl-space-3);
  border: 1px solid var(--sdl-border-default);
  border-radius: var(--sdl-radius-md);
  background: var(--sdl-bg-input);
  color: var(--sdl-text-primary);
  font-family: var(--sdl-font-code);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.2s,
    box-shadow 0.2s,
    background-color 0.2s;
}

.range-trigger:hover:not(:disabled),
.range-trigger:focus-visible {
  border-color: var(--sdl-primary);
  box-shadow: var(--sdl-focus-ring);
  outline: none;
}

.range-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.range-trigger.is-placeholder {
  color: var(--sdl-text-subtle);
}

.trigger-text {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.range-panel {
  position: fixed;
  z-index: 5000;
  display: grid;
  grid-template-columns: 120px 1fr 116px;
  grid-template-rows: auto 48px;
  gap: var(--sdl-space-3);
  padding: var(--sdl-space-3);
  border: 1px solid var(--sdl-border-strong);
  border-radius: var(--sdl-radius-lg);
  background: var(--sdl-bg-panel);
  color: var(--sdl-text-primary);
  box-shadow: var(--sdl-shadow-panel);
  box-sizing: border-box;
}

.shortcut-column,
.calendar-column,
.time-column {
  min-width: 0;
}

.panel-title {
  margin-bottom: var(--sdl-space-2);
  color: var(--sdl-text-muted);
  font-size: var(--sdl-font-caption);
  font-weight: 600;
}

.shortcut-column {
  display: flex;
  flex-direction: column;
  gap: var(--sdl-space-1);
}

.shortcut-button,
.boundary-button,
.month-button,
.day-button,
.time-option,
.text-button,
.confirm-button {
  border: 1px solid transparent;
  font-family: var(--sdl-font-family);
  cursor: pointer;
}

.shortcut-button {
  height: 30px;
  border-radius: var(--sdl-radius-sm);
  background: var(--sdl-bg-muted);
  color: var(--sdl-text-secondary);
  font-size: var(--sdl-font-caption);
  text-align: left;
}

.shortcut-button:hover {
  border-color: var(--sdl-border-brand);
  color: var(--sdl-text-primary);
}

.boundary-switch {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--sdl-space-2);
  margin-bottom: var(--sdl-space-2);
}

.boundary-button {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  padding: var(--sdl-space-2);
  border-radius: var(--sdl-radius-md);
  background: var(--sdl-bg-input);
  color: var(--sdl-text-muted);
  text-align: left;
}

.boundary-button strong {
  overflow: hidden;
  color: var(--sdl-text-primary);
  font-family: var(--sdl-font-code);
  font-size: 12px;
  font-weight: 500;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.boundary-button.is-active {
  border-color: var(--sdl-border-brand);
  box-shadow: inset 0 0 0 1px rgba(0, 200, 255, 0.16);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 30px;
  margin-bottom: var(--sdl-space-1);
  font-size: var(--sdl-font-body-sm);
  font-weight: 600;
}

.month-button {
  width: 28px;
  height: 28px;
  border-radius: var(--sdl-radius-sm);
  background: var(--sdl-bg-muted);
  color: var(--sdl-text-primary);
  font-size: 18px;
}

.week-grid,
.day-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.week-grid {
  margin-bottom: var(--sdl-space-1);
  color: var(--sdl-text-subtle);
  font-size: 11px;
  text-align: center;
}

.day-grid {
  gap: 3px;
}

.day-button {
  position: relative;
  height: 28px;
  border-radius: var(--sdl-radius-sm);
  background: transparent;
  color: var(--sdl-text-secondary);
  font-size: 12px;
}

.day-button:hover {
  background: var(--sdl-bg-hover);
  color: var(--sdl-text-primary);
}

.day-button.is-muted {
  color: var(--sdl-text-subtle);
  opacity: 0.55;
}

.day-button.is-today {
  border-color: var(--sdl-border-brand);
}

.day-button.is-in-range {
  background: rgba(0, 200, 255, 0.08);
}

.day-button.is-selected-start,
.day-button.is-selected-end {
  background: var(--sdl-primary);
  color: var(--sdl-text-inverse);
}

.time-lists {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sdl-space-2);
}

.time-list {
  height: 284px;
  overflow-y: auto;
  border: 1px solid var(--sdl-border-subtle);
  border-radius: var(--sdl-radius-md);
  background: var(--sdl-bg-input);
}

.time-option {
  display: block;
  width: 100%;
  height: 28px;
  background: transparent;
  color: var(--sdl-text-secondary);
  font-family: var(--sdl-font-code);
  font-size: 12px;
}

.time-option:hover,
.time-option.is-active {
  background: var(--sdl-bg-active);
  color: var(--sdl-text-primary);
}

.panel-actions {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: var(--sdl-space-2);
  border-top: 1px solid var(--sdl-border-subtle);
  padding-top: var(--sdl-space-3);
}

.action-spacer {
  flex: 1;
}

.text-button,
.confirm-button {
  height: 30px;
  padding: 0 var(--sdl-space-3);
  border-radius: var(--sdl-radius-md);
  font-size: var(--sdl-font-body-sm);
}

.text-button {
  background: var(--sdl-bg-muted);
  color: var(--sdl-text-secondary);
}

.confirm-button {
  background: var(--sdl-primary);
  color: var(--sdl-text-inverse);
}
</style>
