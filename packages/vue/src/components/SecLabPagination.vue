<script setup lang="ts">
import { computed } from "vue";

/**
 * @file SecLabPagination.vue
 * @description SecLab 平台自研分页组件，严格遵循 SDL 设计规范。
 */

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
  maxVisibleButtons: {
    type: Number,
    default: 5,
  },
  ariaLabel: { type: String, default: "Pagination" },
  previousLabel: { type: String, default: "Previous page" },
  nextLabel: { type: String, default: "Next page" },
});

const emit = defineEmits(["page-change"]);

const pages = computed(() => {
  const total = props.totalPages;
  const current = props.currentPage;
  const max = props.maxVisibleButtons;
  const r: (number | string)[] = [];

  if (total <= max) {
    for (let i = 1; i <= total; i++) {
      r.push(i);
    }
  } else {
    const half = Math.floor(max / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(total, current + half);

    if (current - start < half) {
      end += half - (current - start);
    }
    if (end - current < half) {
      start -= half - (end - current);
    }

    start = Math.max(1, start);
    end = Math.min(total, end);

    if (start > 1) {
      r.push(1);
      if (start > 2) {
        r.push("...");
      }
    }
    for (let i = start; i <= end; i++) {
      r.push(i);
    }
    if (end < total) {
      if (end < total - 1) {
        r.push("...");
      }
      r.push(total);
    }
  }
  return r;
});

function changePage(page: number | string) {
  if (typeof page === "number" && page !== props.currentPage) {
    emit("page-change", page);
  }
}
</script>

<template>
  <nav class="sl-pagination" v-if="totalPages > 1" :aria-label="ariaLabel">
    <button
      class="sl-pagination-btn"
      type="button"
      :aria-label="previousLabel"
      @click="changePage(currentPage - 1)"
      :disabled="currentPage === 1"
    >
      &lt;
    </button>
    <template
      v-for="(page, index) in pages"
      :key="index"
    >
      <span v-if="typeof page === 'string'" class="sl-pagination-ellipsis" aria-hidden="true">…</span>
      <button
      v-else
      type="button"
      class="sl-pagination-btn"
      :class="{
        active: page === currentPage,
      }"
      :aria-current="page === currentPage ? 'page' : undefined"
      :aria-label="`Page ${page}`"
      @click="changePage(page)"
    >
      {{ page }}
      </button>
    </template>
    <button
      class="sl-pagination-btn"
      type="button"
      :aria-label="nextLabel"
      @click="changePage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    >
      &gt;
    </button>
  </nav>
</template>

<style scoped>
.sl-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--sdl-space-2);
}
.sl-pagination-ellipsis { min-width: 32px; text-align: center; color: var(--sdl-text-muted); }
.sl-pagination-btn:focus-visible { outline: none; box-shadow: var(--sdl-focus-ring); }

.sl-pagination-btn {
  min-width: 32px;
  height: 32px;
  padding: 0 var(--sdl-space-2);
  border: 1px solid var(--sdl-border-default);
  background-color: var(--sdl-bg-card);
  color: var(--sdl-text-secondary);
  cursor: pointer;
  border-radius: var(--sdl-radius-md);
  font-size: var(--sdl-font-body-sm);
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sl-pagination-btn:hover:not(:disabled) {
  background-color: var(--sdl-bg-hover);
  border-color: var(--sdl-border-brand);
  color: var(--sdl-text-primary);
}

.sl-pagination-btn:disabled {
  cursor: not-allowed;
  opacity: 0.4;
}

.sl-pagination-btn.active {
  background-color: var(--sdl-primary);
  color: var(--sdl-text-inverse);
  border-color: var(--sdl-primary);
  font-weight: 600;
}

.sl-pagination-btn.ellipsis {
  border: none;
  background-color: transparent;
  cursor: default;
}
</style>
