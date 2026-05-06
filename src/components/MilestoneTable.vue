<template>
  <div class="table-wrap">
    <table class="ms-table" :class="{ 'has-focus': !!hoveredMs }">
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
              @click="onCellClick(row, mi + 1)"
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
                  @click.stop="$emit('edit-milestone', m)"
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
            <span class="tf-val">{{ tooltip.ms.when }}</span>
          </div>
        </div>
        <!-- Dependency badges -->
        <div v-if="tooltip.ms.scenarios?.length" class="tooltip-links">
          <span class="tl-label">Linked to</span>
          <div class="tl-badges">
            <span
              v-for="s in tooltip.ms.scenarios"
              :key="s"
              class="tl-badge"
              :style="{ background: hexAlpha(tooltip.color, 0.12), color: tooltip.color, borderColor: hexAlpha(tooltip.color, 0.3) }"
            >{{ SCENARIO_LABELS[s] ?? s }}</span>
          </div>
        </div>
        <div v-if="relatedCount > 0" class="tooltip-related-count">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <circle cx="2" cy="6" r="1.5" fill="currentColor"/>
            <circle cx="10" cy="2" r="1.5" fill="currentColor"/>
            <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
            <path d="M3.5 5.5L8.5 2.5M3.5 6.5L8.5 9.5" stroke="currentColor" stroke-width="1"/>
          </svg>
          {{ relatedCount }} linked milestone{{ relatedCount !== 1 ? 's' : '' }} highlighted
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useAppStore, MONTHS, SCENARIO_LABELS, store } from '../stores/useAppStore.js'

const emit = defineEmits(['add-milestone', 'edit-milestone'])
const { cellMilestones } = useAppStore()

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
  const hm = hoveredMs.value
  const tags = new Set(hm.scenarios ?? [])
  const hoveredSwimlane = store.swimlanes.find(s => s.id === hm.swimlaneId)
  const isCustomer = hoveredSwimlane?.name === 'Customer Accounts'

  return new Set(
    store.milestones
      .filter(m => {
        if (m.id === hm.id) return false
        if (!(m.scenarios ?? []).some(t => tags.has(t))) return false
        // When hovering a Customer milestone, only show non-customer milestones
        // that already exist by that point in time (month <= hovered month)
        if (isCustomer) {
          const mSwimlane = store.swimlanes.find(s => s.id === m.swimlaneId)
          const mIsCustomer = mSwimlane?.name === 'Customer Hunting'
          if (!mIsCustomer && m.year === hm.year && m.month > hm.month) return false
        }
        return true
      })
      .map(m => m.id)
  )
})

const relatedCount = computed(() => relatedIds.value.size)

function chipState(m) {
  if (!hoveredMs.value) return ''
  if (m.id === hoveredMs.value.id) return 'chip-active'
  if (relatedIds.value.has(m.id)) return 'chip-related'
  return 'chip-dimmed'
}

// ── Tooltip ───────────────────────────────────────────────────────────────────
const tooltip = reactive({ visible: false, ms: null, x: 0, y: 0, color: '' })
let hideTimer = null

const tooltipStyle = computed(() => {
  const margin = 12
  const tipW = 296
  const left = Math.min(tooltip.x, window.innerWidth - tipW - margin)
  return {
    position: 'fixed',
    top: `${tooltip.y}px`,
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
  tooltip.y = rect.bottom + 8
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
  border-top: 2px solid rgba(0,113,227,0.25);
}
.td-current:hover { background: rgba(0,113,227,0.07) !important; }

.cell-add-hint {
  position: absolute; bottom: 4px; right: 6px;
  font-size: 16px; color: var(--clr-text-3);
  opacity: 0; transition: opacity 0.15s;
  line-height: 1; pointer-events: none;
}

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
  background: rgba(255,255,255,0.93);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(0,0,0,0.1);
  border-radius: var(--r-lg);
  box-shadow: var(--sh-lg);
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
.tl-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: var(--clr-text-3); display: block; margin-bottom: 6px; }
.tl-badges { display: flex; flex-wrap: wrap; gap: 4px; }
.tl-badge {
  font-size: 11px; font-weight: 500;
  padding: 2px 8px; border-radius: 100px;
  border: 1px solid;
}

.tooltip-related-count {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px 10px;
  font-size: 11px; color: var(--clr-text-3);
}
</style>
