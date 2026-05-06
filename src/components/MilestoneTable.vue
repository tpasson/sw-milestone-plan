<template>
  <div class="table-wrap">
    <table class="ms-table" :class="{ 'has-focus': !!hoveredMs, 'is-readonly': props.readOnly }" :style="{ zoom: props.zoom }">
      <thead>
        <tr>
          <th class="th-area">Area</th>
          <th class="th-sub">Sub-Area</th>
          <th
            v-for="(m, i) in MONTHS"
            :key="i"
            class="th-month"
            :class="{ 'th-current': isCurrentMonth(i + 1) }"
          >
            {{ m }}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in tableRows" :key="rowKey(row)">
          <tr :class="{ 'row-first': row.showLaneCell }">
            <td
              v-if="row.showLaneCell"
              :rowspan="row.rowspan"
              class="td-area"
              :style="{ '--lane': row.swimlane.color }"
            >
              <div class="area-label">
                <span class="area-dot" :style="{ background: row.swimlane.color }"></span>
                <span class="area-name">{{ row.swimlane.name }}</span>
              </div>
            </td>

            <td class="td-sub">
              <span class="sub-name">{{ row.subLane?.name ?? '' }}</span>
            </td>

            <td
              v-for="(_, mi) in MONTHS"
              :key="mi"
              class="td-month"
              :class="{ 'td-current': isCurrentMonth(mi + 1) }"
              @click="props.readOnly ? null : onCellClick(row, mi + 1)"
            >
              <div class="chips">
                <div
                  v-for="m in cellMilestones(row.swimlane.id, row.subLane?.id ?? null, mi + 1)"
                  :key="m.id"
                  class="chip"
                  :class="chipState(m)"
                  :style="chipStyle(row.swimlane.color)"
                  @mouseenter="onChipEnter($event, m, row.swimlane.color)"
                  @mouseleave="onChipLeave"
                  @click.stop="props.readOnly ? null : $emit('edit-milestone', m)"
                >
                  {{ m.title }}
                </div>
              </div>
              <div class="cell-add-hint">+</div>
            </td>
          </tr>
        </template>

        <tr v-if="tableRows.length === 0">
          <td :colspan="14" class="empty-state">
            No areas defined yet. Click "Manage Areas" to get started.
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Tooltip -->
  <Teleport to="body">
    <Transition name="tooltip">
      <div
        v-if="tooltip.visible && tooltip.ms"
        class="ms-tooltip"
        :style="tooltipStyle"
        @mouseenter="onTooltipEnter"
        @mouseleave="onChipLeave"
      >
        <div class="tooltip-header">
          <span class="tooltip-dot" :style="{ background: tooltip.color }"></span>
          <span class="tooltip-title">{{ tooltip.ms.title }}</span>
        </div>
        <div class="tooltip-fields">
          <div v-if="tooltip.ms.what" class="tooltip-field">
            <span class="tf-label">What</span>
            <span class="tf-val">{{ tooltip.ms.what }}</span>
          </div>
          <div v-if="tooltip.ms.why" class="tooltip-field">
            <span class="tf-label">Why</span>
            <span class="tf-val">{{ tooltip.ms.why }}</span>
          </div>
          <div v-if="tooltip.ms.how" class="tooltip-field">
            <span class="tf-label">How</span>
            <span class="tf-val">{{ tooltip.ms.how }}</span>
          </div>
          <div v-if="tooltip.ms.who" class="tooltip-field">
            <span class="tf-label">Who</span>
            <span class="tf-val">{{ tooltip.ms.who }}</span>
          </div>
          <div v-if="tooltip.ms.when" class="tooltip-field">
            <span class="tf-label">When</span>
            <span class="tf-val">{{ formatDate(tooltip.ms.when) }}</span>
          </div>
        </div>
        <!-- Linked milestones -->
        <div v-if="linkedMilestones.length > 0" class="tooltip-links">
          <span class="tl-label">Linked to</span>
          <div class="tl-items">
            <div v-for="lm in linkedMilestones.slice(0, 10)" :key="lm.id" class="tl-item">
              <span class="tl-dot" :style="{ background: swimlaneColor(lm.swimlaneId) }"></span>
              <span class="tl-title">{{ lm.title }}</span>
              <span v-if="lm.when" class="tl-date">{{ formatDate(lm.when) }}</span>
            </div>
            <div v-if="linkedMilestones.length > 10" class="tl-more">
              +{{ linkedMilestones.length - 10 }} more
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useAppStore, MONTHS, store } from '../stores/useAppStore.js'

const props = defineProps({
  zoom: { type: Number, default: 1 },
  readOnly: { type: Boolean, default: false },
})
const emit = defineEmits(['add-milestone', 'edit-milestone'])
const { cellMilestones, getLinkedIds } = useAppStore()

// ── Table rows ────────────────────────────────────────────────────────────────
const tableRows = computed(() => {
  const rows = []
  for (const sw of store.swimlanes) {
    if (sw.subLanes.length === 0) {
      rows.push({ swimlane: sw, subLane: null, showLaneCell: true, rowspan: 1 })
    } else {
      sw.subLanes.forEach((sub, i) => {
        rows.push({ swimlane: sw, subLane: sub, showLaneCell: i === 0, rowspan: sw.subLanes.length })
      })
    }
  }
  return rows
})

function rowKey(row) {
  return `${row.swimlane.id}-${row.subLane?.id ?? 'root'}`
}

function isCurrentMonth(month) {
  const now = new Date()
  return now.getFullYear() === store.year && (now.getMonth() + 1) === month
}

function onCellClick(row, month) {
  emit('add-milestone', { swimlane: row.swimlane, subLane: row.subLane, month })
}

// ── Chip styling ──────────────────────────────────────────────────────────────
function chipStyle(color) {
  return {
    background: hexAlpha(color, 0.13),
    borderColor: hexAlpha(color, 0.32),
    color,
  }
}

function hexAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

// ── Dependency hover ──────────────────────────────────────────────────────────
const hoveredMs = ref(null)

const relatedIds = computed(() => {
  if (!hoveredMs.value) return new Set()
  return getLinkedIds(hoveredMs.value.id)
})

const linkedMilestones = computed(() => {
  if (!hoveredMs.value) return []
  const ids = relatedIds.value
  return store.milestones.filter(m => ids.has(m.id))
})

const relatedCount = computed(() => relatedIds.value.size)

function swimlaneColor(swimlaneId) {
  return store.swimlanes.find(s => s.id === swimlaneId)?.color ?? '#888'
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  // Parse as local date to avoid timezone shifts
  const [y, m, day] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, day).toLocaleDateString('en-US', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function chipState(m) {
  if (!hoveredMs.value) return ''
  if (m.id === hoveredMs.value.id) return 'chip-active'
  if (relatedIds.value.has(m.id)) return 'chip-related'
  return 'chip-dimmed'
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
const tooltip = reactive({ visible: false, ms: null, x: 0, chipTop: 0, chipBottom: 0, color: '' })
let hideTimer = null

const tooltipStyle = computed(() => {
  const margin = 12
  const tipW = 296
  const estimatedHeight = 340
  const left = Math.min(tooltip.x, window.innerWidth - tipW - margin)
  const spaceBelow = window.innerHeight - tooltip.chipBottom
  const openUp = spaceBelow < estimatedHeight + margin

  return {
    position: 'fixed',
    ...(openUp
      ? { bottom: `${window.innerHeight - tooltip.chipTop + 8}px`, top: 'auto' }
      : { top: `${tooltip.chipBottom + 8}px`, bottom: 'auto' }),
    left: `${Math.max(margin, left)}px`,
    width: `${tipW}px`,
    zIndex: 9999,
  }
})

function onChipEnter(e, m, color) {
  clearTimeout(hideTimer)
  hoveredMs.value = m
  const rect = e.currentTarget.getBoundingClientRect()
  tooltip.x = rect.left
  tooltip.chipTop = rect.top
  tooltip.chipBottom = rect.bottom
  tooltip.ms = m
  tooltip.color = color
  tooltip.visible = true
}

function onChipLeave() {
  hideTimer = setTimeout(() => {
    tooltip.visible = false
    hoveredMs.value = null
  }, 200)
}

function onTooltipEnter() {
  clearTimeout(hideTimer)
}
</script>

<style scoped>
.table-wrap {
  overflow: auto;
  height: calc(100vh - 68px);
  background: var(--clr-bg);
}

.ms-table {
  border-collapse: separate;
  border-spacing: 0;
  width: max-content;
  min-width: 100%;
}

/* --- Header row --- */
thead tr { background: var(--clr-header); }

thead th {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 14px 12px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
  white-space: nowrap;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  background: var(--clr-header);
  user-select: none;
}

.th-area {
  position: sticky; left: 0; z-index: 30;
  width: 168px; min-width: 168px; text-align: left;
}
.th-sub {
  position: sticky; left: 168px; z-index: 30;
  width: 148px; min-width: 148px; text-align: left;
  border-left: 1px solid rgba(255,255,255,0.06);
}
.th-month { text-align: center; width: 110px; min-width: 110px; }
.th-current { color: rgba(0,180,255,0.85) !important; }

/* --- Body cells --- */
.td-area {
  position: sticky; left: 0; z-index: 10;
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border-light);
  border-right: 3px solid var(--lane);
  padding: 12px 14px;
  vertical-align: middle;
}

.area-label { display: flex; align-items: center; gap: 8px; }
.area-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.area-name { font-size: 13px; font-weight: 600; color: var(--clr-text); letter-spacing: -0.1px; }

.td-sub {
  position: sticky; left: 168px; z-index: 10;
  background: var(--clr-surface-2);
  border-bottom: 1px solid var(--clr-border-light);
  border-right: 1px solid var(--clr-border-light);
  padding: 10px 14px;
  vertical-align: middle;
  white-space: nowrap;
}
.sub-name { font-size: 12px; color: var(--clr-text-2); font-weight: 500; }

.td-month {
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border-light);
  border-right: 1px solid var(--clr-border-light);
  padding: 8px 8px;
  vertical-align: top;
  cursor: pointer;
  transition: background 0.12s;
  min-height: 52px;
  position: relative;
}
.td-month:hover { background: #F0F0F5; }
.td-month:hover .cell-add-hint { opacity: 1; }
.td-current {
  background: rgba(0,113,227,0.03) !important;
}
.td-current:hover { background: rgba(0,113,227,0.07) !important; }

.cell-add-hint {
  position: absolute; bottom: 4px; right: 6px;
  font-size: 16px; color: var(--clr-text-3);
  opacity: 0; transition: opacity 0.15s;
  line-height: 1; pointer-events: none;
}

/* --- Read-only --- */
.is-readonly .td-month { cursor: default; }
.is-readonly .td-month:hover { background: var(--clr-surface); }
.is-readonly .td-current:hover { background: rgba(0,113,227,0.03) !important; }
.is-readonly .cell-add-hint { display: none; }

/* --- Chips --- */
.chips { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }

.chip {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 100px;
  font-size: 11.5px;
  font-weight: 500;
  border: 1px solid;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  user-select: none;
  transition: opacity 0.22s ease, filter 0.22s ease, transform 0.18s ease, box-shadow 0.18s ease;
}

.chip:hover { filter: brightness(0.88); }

/* Dependency states */
.chip-active {
  transform: scale(1.06) !important;
  box-shadow: 0 0 0 2px currentColor, 0 2px 10px rgba(0,0,0,0.14) !important;
  filter: brightness(1.08) !important;
  z-index: 2;
  position: relative;
}

.chip-related {
  box-shadow: 0 0 0 1.5px currentColor;
  filter: brightness(1.04);
  opacity: 1 !important;
  transform: scale(1.02);
}

.chip-dimmed {
  opacity: 0.16 !important;
  filter: grayscale(0.4) !important;
  transform: scale(0.97);
}

/* --- Empty state --- */
.empty-state {
  text-align: center; padding: 80px 20px;
  color: var(--clr-text-3); font-size: 14px;
}

/* --- Tooltip --- */
.ms-tooltip {
  background: rgba(240,244,255,0.28);
  backdrop-filter: blur(28px) saturate(1.8);
  -webkit-backdrop-filter: blur(28px) saturate(1.8);
  border: 1px solid rgba(255,255,255,0.70);
  border-radius: var(--r-lg);
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  overflow: hidden;
}

.tooltip-header {
  display: flex; align-items: center; gap: 8px;
  padding: 12px 14px 10px;
  border-bottom: 1px solid var(--clr-border-light);
}
.tooltip-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.tooltip-title { font-size: 13px; font-weight: 600; color: var(--clr-text); letter-spacing: -0.1px; }

.tooltip-fields { padding: 10px 14px 8px; display: flex; flex-direction: column; gap: 7px; }

.tooltip-field { display: grid; grid-template-columns: 38px 1fr; gap: 8px; align-items: baseline; }
.tf-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--clr-text-3); }
.tf-val { font-size: 12.5px; color: var(--clr-text); line-height: 1.45; }

.tooltip-links {
  padding: 8px 14px 10px;
  border-top: 1px solid var(--clr-border-light);
}
.tl-label {
  font-size: 10px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--clr-text-3); display: block; margin-bottom: 6px;
}
.tl-items { display: flex; flex-direction: column; gap: 5px; }
.tl-item { display: flex; align-items: center; gap: 6px; min-width: 0; }
.tl-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
.tl-title { font-size: 12.5px; color: var(--clr-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.tl-date { font-size: 11px; color: var(--clr-text-3); white-space: nowrap; margin-left: auto; padding-left: 8px; flex-shrink: 0; }
.tl-more { font-size: 11px; color: var(--clr-text-3); padding-left: 12px; }
</style>
