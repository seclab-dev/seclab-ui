<script setup lang="ts">
import { computed } from "vue";
import { getIcon } from "@seclab-dev/icons";
import type { IconNamespace } from "@seclab-dev/icons";

interface Props {
  name?: string | null;
  namespace?: IconNamespace;
  size?: number | string;
  label?: string;
  decorative?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  name: "fallback",
  namespace: "common",
  size: 24,
  label: "",
  decorative: true,
});

const iconName = computed(() => {
  const normalized = (props.name ?? "").trim().toLowerCase();
  return /^[a-z0-9-]+$/.test(normalized) ? normalized : "fallback";
});

const iconSource = computed(() => getIcon(iconName.value, props.namespace));
const iconSize = computed(() =>
  typeof props.size === "number" ? `${props.size}px` : props.size,
);
</script>

<template>
  <span
    class="sl-icon"
    :style="{ '--sl-icon-size': iconSize }"
    :aria-hidden="decorative ? 'true' : undefined"
    :role="decorative ? undefined : 'img'"
    :aria-label="decorative ? undefined : label || iconName"
    v-html="iconSource"
  ></span>
</template>

<style scoped>
.sl-icon {
  width: var(--sl-icon-size);
  height: var(--sl-icon-size);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
  line-height: 1;
  flex-shrink: 0;
}

.sl-icon :deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
