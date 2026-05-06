<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="backdrop" @click.self="$emit('close')">
        <Transition name="modal-panel" appear>
          <div class="panel">
            <!-- Header -->
            <div class="panel-header">
              <h2 class="panel-title">Manage Areas</h2>
              <button class="btn-close" @click="$emit('close')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Read-only toggle -->
            <div class="setting-row">
              <div class="setting-info">
                <span class="setting-name">Read-only mode</span>
                <span class="setting-desc">Hides add/edit controls for presentation use</span>
              </div>
              <button class="toggle" :class="{ active: readOnly }" @click="$emit('update:readOnly', !readOnly)">
                <span class="toggle-knob"></span>
              </button>
            </div>

            <div class="divider"></div>

            <!-- Add Swimlane -->
            <div class="add-lane-section">
              <p class="section-label">Add new area</p>
              <div class="add-lane-form">
                <input
                  v-model="newLane.name"
                  class="field-input"
                  placeholder="Area name"
                  @keyup.enter="doAddSwimlane"
                />
                <div class="color-row">
                  <button
                    v-for="c in PRESET_COLORS"
                    :key="c"
                    class="color-swatch"
                    :class="{ selected: newLane.color === c }"
                    :style="{ background: c }"
                    @click="newLane.color = c"
                  >
                    <svg v-if="newLane.color === c" width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>
                <button class="btn-add" :disabled="!newLane.name.trim()" @click="doAddSwimlane">
                  + Add area
                </button>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Swimlane list -->
            <div class="lanes-list">
              <p class="section-label">Existing areas</p>
              <div v-if="store.swimlanes.length === 0" class="empty">
                No areas defined yet.
              </div>

              <div v-for="(sw, si) in store.swimlanes" :key="sw.id" class="lane-item">

                <!-- Row 1: name + actions -->
                <div class="lane-header">
                  <span class="lane-dot" :style="{ background: sw.color }"></span>

                  <input
                    v-if="editing.id === sw.id && editing.type === 'lane'"
                    :ref="el => { if (el) el.focus() }"
                    class="inline-input"
                    v-model="editing.name"
                    @blur="saveEdit(sw)"
                    @keyup.enter="saveEdit(sw)"
                    @keyup.escape="cancelEdit"
                  />
                  <span v-else class="lane-name" @dblclick="startEdit(sw)">{{ sw.name }}</span>

                  <div class="lane-actions">
                    <button class="icon-btn" title="Move up" @click="moveSwimlane(sw.id, -1)" :disabled="si === 0">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 10V3M3 6.5l3.5-3.5 3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="icon-btn" title="Move down" @click="moveSwimlane(sw.id, 1)" :disabled="si === store.swimlanes.length - 1">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M6.5 3v7M10 6.5L6.5 10 3 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </button>
                    <button class="icon-btn danger" title="Delete area" @click="doDeleteSwimlane(sw.id)">
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                        <path d="M2 3h9M5 3V2h3v1M4.5 5.5l.5 5M8.5 5.5L8 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Row 2: color swatches (full width) -->
                <div class="lane-colors">
                  <button
                    v-for="c in PRESET_COLORS"
                    :key="c"
                    class="color-swatch sm"
                    :class="{ selected: sw.color === c }"
                    :style="{ background: c }"
                    @click="updateSwimlane(sw.id, { color: c })"
                  >
                    <svg v-if="sw.color === c" width="7" height="7" viewBox="0 0 10 10" fill="none">
                      <path d="M1.5 5l2.5 2.5 4.5-5" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </button>
                </div>

                <!-- Row 3: sub-areas -->
                <div class="sublanes">
                  <div v-for="sub in sw.subLanes" :key="sub.id" class="sublane-item">
                    <span class="sublane-dot" :style="{ background: sw.color }"></span>
                    <input
                      v-if="editing.id === sub.id && editing.type === 'sub'"
                      :ref="el => { if (el) el.focus() }"
                      class="inline-input sm"
                      v-model="editing.name"
                      @blur="saveSubEdit(sw.id, sub)"
                      @keyup.enter="saveSubEdit(sw.id, sub)"
                      @keyup.escape="cancelEdit"
                    />
                    <span v-else class="sublane-name" @dblclick="startSubEdit(sub)">{{ sub.name }}</span>
                    <button class="icon-btn danger" @click="deleteSubLane(sw.id, sub.id)">
                      <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                        <path d="M2 3h9M5 3V2h3v1M4.5 5.5l.5 5M8.5 5.5L8 10.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                      </svg>
                    </button>
                  </div>

                  <!-- Add sub-area -->
                  <div class="add-sub-row">
                    <input
                      v-model="newSubs[sw.id]"
                      class="field-input sm"
                      :placeholder="`Add sub-area to '${sw.name}'`"
                      @keyup.enter="doAddSubLane(sw.id)"
                    />
                    <button
                      class="btn-add-sub"
                      :disabled="!newSubs[sw.id]?.trim()"
                      @click="doAddSubLane(sw.id)"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-footer">
              <button class="btn-primary" @click="$emit('close')">Done</button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive } from 'vue'
import { useAppStore, PRESET_COLORS, store } from '../stores/useAppStore.js'

defineProps({ readOnly: { type: Boolean, default: false } })
defineEmits(['close', 'update:readOnly'])

const { addSwimlane, updateSwimlane, deleteSwimlane, moveSwimlane, addSubLane, updateSubLane, deleteSubLane } = useAppStore()

const newLane = reactive({ name: '', color: PRESET_COLORS[0] })
const newSubs = reactive({})
const editing = reactive({ id: null, type: null, name: '' })

function doAddSwimlane() {
  if (!newLane.name.trim()) return
  addSwimlane(newLane.name.trim(), newLane.color)
  newLane.name = ''
}

function doAddSubLane(swimlaneId) {
  const name = newSubs[swimlaneId]?.trim()
  if (!name) return
  addSubLane(swimlaneId, name)
  newSubs[swimlaneId] = ''
}

function doDeleteSwimlane(id) {
  if (confirm('Delete area and all its milestones?')) deleteSwimlane(id)
}

function startEdit(sw) {
  editing.id = sw.id; editing.type = 'lane'; editing.name = sw.name
}
function saveEdit(sw) {
  if (editing.name.trim()) updateSwimlane(sw.id, { name: editing.name.trim() })
  cancelEdit()
}
function startSubEdit(sub) {
  editing.id = sub.id; editing.type = 'sub'; editing.name = sub.name
}
function saveSubEdit(swimlaneId, sub) {
  if (editing.name.trim()) updateSubLane(swimlaneId, sub.id, editing.name.trim())
  cancelEdit()
}
function cancelEdit() {
  editing.id = null; editing.type = null; editing.name = ''
}
</script>

<style scoped>
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
}

.panel {
  background: var(--clr-surface);
  border-radius: var(--r-xl);
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 64px);
  box-shadow: var(--sh-modal);
  overflow: hidden;
  margin: auto;
  display: flex;
  flex-direction: column;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px 16px;
  border-bottom: 1px solid var(--clr-border-light);
}

.panel-title {
  font-size: 18px; font-weight: 700; letter-spacing: -0.3px; color: var(--clr-text);
}

.btn-close {
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: var(--clr-surface-2);
  border-radius: 50%;
  color: var(--clr-text-2);
  transition: background 0.15s;
}
.btn-close:hover { background: var(--clr-border-light); }

/* ── Read-only toggle ────────────────────────────────────────────────── */
.setting-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  gap: 16px;
}
.setting-info { display: flex; flex-direction: column; gap: 2px; }
.setting-name { font-size: 14px; font-weight: 600; color: var(--clr-text); }
.setting-desc { font-size: 12px; color: var(--clr-text-3); }

.toggle {
  width: 42px; height: 26px;
  border-radius: 13px;
  background: var(--clr-border);
  position: relative;
  transition: background 0.22s;
  flex-shrink: 0;
}
.toggle.active { background: var(--clr-accent); }
.toggle-knob {
  position: absolute;
  width: 20px; height: 20px;
  border-radius: 50%;
  background: white;
  top: 3px; left: 3px;
  transition: transform 0.22s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.22);
}
.toggle.active .toggle-knob { transform: translateX(16px); }

/* ── Add section ─────────────────────────────────────────────────────── */
.add-lane-section { padding: 16px 20px 12px; }

.section-label {
  font-size: 11px; font-weight: 700;
  text-transform: uppercase; letter-spacing: 0.5px;
  color: var(--clr-text-3); margin-bottom: 10px;
}

.add-lane-form { display: flex; flex-direction: column; gap: 10px; }

.color-row { display: flex; gap: 6px; flex-wrap: wrap; }

.color-swatch {
  width: 24px; height: 24px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  transition: transform 0.12s, box-shadow 0.12s;
  flex-shrink: 0;
}
.color-swatch:hover { transform: scale(1.15); }
.color-swatch.selected { box-shadow: 0 0 0 2px white, 0 0 0 4px currentColor; }
.color-swatch.sm { width: 18px; height: 18px; }

.field-input {
  border: 1.5px solid var(--clr-border);
  border-radius: var(--r-md);
  padding: 9px 12px;
  font-size: 14px;
  color: var(--clr-text);
  background: var(--clr-bg);
  outline: none;
  width: 100%;
  transition: border-color 0.15s, box-shadow 0.15s;
}
.field-input:focus {
  border-color: var(--clr-accent);
  box-shadow: 0 0 0 3px rgba(0,113,227,0.12);
  background: #fff;
}
.field-input.sm { padding: 6px 10px; font-size: 13px; }
.field-input::placeholder { color: var(--clr-text-3); }

.btn-add {
  align-self: flex-start;
  padding: 8px 16px;
  font-size: 13px; font-weight: 600;
  color: var(--clr-accent);
  background: rgba(0,113,227,0.08);
  border-radius: var(--r-md);
  transition: background 0.15s;
}
.btn-add:hover:not(:disabled) { background: rgba(0,113,227,0.14); }
.btn-add:disabled { opacity: 0.4; cursor: not-allowed; }

.divider { height: 1px; background: var(--clr-border-light); }

/* ── Lane list ───────────────────────────────────────────────────────── */
.lanes-list {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.empty { font-size: 13px; color: var(--clr-text-3); text-align: center; padding: 20px 0; }

.lane-item {
  background: var(--clr-bg);
  border: 1px solid var(--clr-border-light);
  border-radius: var(--r-lg);
  overflow: hidden;
  flex-shrink: 0;
}

/* Row 1: name + arrows + delete */
.lane-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 10px 10px 12px;
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border-light);
}

.lane-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.lane-name {
  flex: 1;
  font-size: 13px; font-weight: 600; color: var(--clr-text);
  cursor: pointer;
  padding: 2px 4px;
  border-radius: var(--r-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.12s;
}
.lane-name:hover { background: var(--clr-border-light); }

.inline-input {
  flex: 1;
  border: 1.5px solid var(--clr-accent);
  border-radius: var(--r-sm);
  padding: 3px 8px;
  font-size: 13px; font-weight: 600; color: var(--clr-text);
  background: #fff; outline: none;
  box-shadow: 0 0 0 3px rgba(0,113,227,0.12);
}
.inline-input.sm { font-size: 12.5px; font-weight: 500; }

.lane-actions { display: flex; gap: 2px; flex-shrink: 0; }

.icon-btn {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: transparent;
  border-radius: var(--r-sm);
  color: var(--clr-text-2);
  transition: background 0.12s, color 0.12s;
}
.icon-btn:hover:not(:disabled) { background: var(--clr-border-light); color: var(--clr-text); }
.icon-btn.danger:hover:not(:disabled) { background: rgba(255,59,48,0.1); color: var(--clr-danger); }
.icon-btn:disabled { opacity: 0.3; cursor: not-allowed; }

/* Row 2: color swatches */
.lane-colors {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  padding: 8px 12px;
  background: var(--clr-surface);
  border-bottom: 1px solid var(--clr-border-light);
}

/* Row 3: sub-areas */
.sublanes {
  padding: 8px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.sublane-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 8px;
  background: var(--clr-surface);
  border-radius: var(--r-sm);
  border: 1px solid var(--clr-border-light);
}

.sublane-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
  opacity: 0.7;
}

.sublane-name {
  flex: 1;
  font-size: 12.5px; color: var(--clr-text-2);
  cursor: pointer;
  padding: 1px 3px;
  border-radius: var(--r-xs);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: background 0.12s;
}
.sublane-name:hover { background: var(--clr-border-light); }

.add-sub-row { display: flex; gap: 6px; margin-top: 2px; }

.btn-add-sub {
  width: 34px; height: 34px;
  flex-shrink: 0;
  background: rgba(0,113,227,0.08);
  color: var(--clr-accent);
  border-radius: var(--r-md);
  font-size: 18px;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.15s;
}
.btn-add-sub:hover:not(:disabled) { background: rgba(0,113,227,0.14); }
.btn-add-sub:disabled { opacity: 0.35; cursor: not-allowed; }

/* ── Footer ──────────────────────────────────────────────────────────── */
.panel-footer {
  padding: 14px 20px 20px;
  border-top: 1px solid var(--clr-border-light);
  display: flex;
  justify-content: flex-end;
}

.btn-primary {
  padding: 9px 24px;
  font-size: 14px; font-weight: 600;
  color: #fff;
  background: var(--clr-accent);
  border-radius: var(--r-md);
  transition: background 0.15s;
}
.btn-primary:hover { background: var(--clr-accent-hover); }
</style>
