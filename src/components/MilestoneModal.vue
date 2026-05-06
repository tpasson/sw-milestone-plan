<template>
  <Teleport to="body">
    <Transition name="modal">
      <div class="backdrop" @click.self="$emit('close')">
        <Transition name="modal-panel" appear>
          <div class="panel">
            <!-- Header -->
            <div class="panel-header">
              <div class="panel-meta">
                <span class="panel-badge" :style="{ background: swimlane?.color }">
                  {{ swimlane?.name }}
                </span>
                <span v-if="subLane" class="panel-sub">{{ subLane.name }}</span>
                <span class="panel-month">{{ MONTHS[month - 1] }} {{ year }}</span>
              </div>
              <h2 class="panel-title">{{ mode === 'edit' ? 'Edit Milestone' : 'New Milestone' }}</h2>
              <button class="btn-close" @click="$emit('close')">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form class="panel-form" @submit.prevent="submit">
              <div class="field">
                <label class="field-label">Title <span class="req">*</span></label>
                <input
                  v-model="form.title"
                  class="field-input"
                  placeholder="Short description of the milestone"
                  autocomplete="off"
                  required
                  ref="titleInput"
                />
              </div>

              <div class="two-col">
                <div class="field">
                  <label class="field-label">What</label>
                  <textarea v-model="form.what" class="field-textarea" rows="3" placeholder="What will be achieved?"></textarea>
                </div>
                <div class="field">
                  <label class="field-label">Why</label>
                  <textarea v-model="form.why" class="field-textarea" rows="3" placeholder="Why is this important?"></textarea>
                </div>
              </div>

              <div class="two-col">
                <div class="field">
                  <label class="field-label">How</label>
                  <textarea v-model="form.how" class="field-textarea" rows="3" placeholder="How will it be implemented?"></textarea>
                </div>
                <div class="field">
                  <label class="field-label">Who</label>
                  <input v-model="form.who" class="field-input" placeholder="Responsible person / team"/>
                </div>
              </div>

              <div class="field">
                <label class="field-label">When</label>
                <input v-model="form.when" class="field-input" placeholder="e.g. End of Q1, Week 15 – specific date"/>
              </div>

              <!-- Links -->
              <div class="field">
                <label class="field-label">Links</label>
                <div class="link-groups">
                  <div v-for="group in SCENARIO_GROUPS" :key="group.label" class="link-group">
                    <span class="link-group-label">{{ group.label }}</span>
                    <div class="link-tags">
                      <button
                        v-for="key in group.keys"
                        :key="key"
                        type="button"
                        class="link-tag"
                        :class="{ active: form.scenarios.includes(key) }"
                        :style="form.scenarios.includes(key) ? activeTagStyle(swimlane?.color) : {}"
                        @click="toggleScenario(key)"
                      >
                        {{ SCENARIO_LABELS[key] }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div class="panel-actions">
                <button
                  v-if="mode === 'edit'"
                  type="button"
                  class="btn-danger"
                  @click="remove"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2 3.5h10M5.5 3.5V2.5h3v1M5 6l.5 5M9 6l-.5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                  </svg>
                  Delete
                </button>
                <div class="actions-right">
                  <button type="button" class="btn-ghost" @click="$emit('close')">Cancel</button>
                  <button type="submit" class="btn-primary">
                    {{ mode === 'edit' ? 'Save' : 'Create' }}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useAppStore, MONTHS, SCENARIO_LABELS, SCENARIO_GROUPS } from '../stores/useAppStore.js'

const props = defineProps({
  mode:      { type: String,  default: 'add' },
  swimlane:  { type: Object,  default: null },
  subLane:   { type: Object,  default: null },
  month:     { type: Number,  default: 1 },
  year:      { type: Number,  default: 2026 },
  milestone: { type: Object,  default: null },
})

const emit = defineEmits(['close'])
const { addMilestone, updateMilestone, deleteMilestone } = useAppStore()

const form = reactive({
  title:     props.milestone?.title     ?? '',
  what:      props.milestone?.what      ?? '',
  why:       props.milestone?.why       ?? '',
  how:       props.milestone?.how       ?? '',
  who:       props.milestone?.who       ?? '',
  when:      props.milestone?.when      ?? '',
  scenarios: [...(props.milestone?.scenarios ?? [])],
})

const titleInput = ref(null)
onMounted(() => titleInput.value?.focus())

function toggleScenario(key) {
  const i = form.scenarios.indexOf(key)
  if (i === -1) form.scenarios.push(key)
  else form.scenarios.splice(i, 1)
}

function activeTagStyle(color) {
  if (!color) return {}
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)
  return {
    background: `rgba(${r},${g},${b},0.12)`,
    borderColor: `rgba(${r},${g},${b},0.45)`,
    color,
  }
}

function submit() {
  if (!form.title.trim()) return
  const payload = {
    swimlaneId: props.swimlane?.id,
    subLaneId:  props.subLane?.id ?? null,
    year:       props.year,
    month:      props.month,
    ...form,
    title: form.title.trim(),
  }
  if (props.mode === 'edit') {
    updateMilestone(props.milestone.id, payload)
  } else {
    addMilestone(payload)
  }
  emit('close')
}

function remove() {
  if (props.milestone) {
    deleteMilestone(props.milestone.id)
    emit('close')
  }
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
  align-items: center;
  justify-content: center;
  padding: 24px;
}

.panel {
  background: var(--clr-surface);
  border-radius: var(--r-xl);
  width: 100%;
  max-width: 600px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: var(--sh-modal);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 20px 20px 0;
  position: relative;
  flex-shrink: 0;
}

.panel-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  flex-wrap: wrap;
}

.panel-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 2px 9px;
  border-radius: 100px;
  color: #fff;
  letter-spacing: 0.2px;
}

.panel-sub { font-size: 12px; color: var(--clr-text-2); font-weight: 500; }
.panel-month { font-size: 12px; color: var(--clr-text-3); }

.panel-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.4px;
  color: var(--clr-text);
  margin-bottom: 20px;
}

.btn-close {
  position: absolute;
  top: 18px; right: 18px;
  width: 30px; height: 30px;
  display: flex; align-items: center; justify-content: center;
  background: var(--clr-surface-2);
  border-radius: 50%;
  color: var(--clr-text-2);
  transition: background 0.15s;
}
.btn-close:hover { background: var(--clr-border-light); }

.panel-form {
  padding: 0 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  overflow-y: auto;
}

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.field { display: flex; flex-direction: column; gap: 5px; }

.field-label {
  font-size: 11.5px; font-weight: 600;
  color: var(--clr-text-2);
  text-transform: uppercase; letter-spacing: 0.4px;
}
.req { color: var(--clr-danger); }

.field-input,
.field-textarea {
  border: 1.5px solid var(--clr-border);
  border-radius: var(--r-md);
  padding: 9px 12px;
  font-size: 14px;
  color: var(--clr-text);
  background: var(--clr-bg);
  transition: border-color 0.15s, box-shadow 0.15s;
  resize: none;
  outline: none;
  width: 100%;
}
.field-input:focus,
.field-textarea:focus {
  border-color: var(--clr-accent);
  box-shadow: 0 0 0 3px rgba(0,113,227,0.12);
  background: #fff;
}
.field-input::placeholder,
.field-textarea::placeholder { color: var(--clr-text-3); }

/* Links */
.link-groups {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: var(--clr-bg);
  border: 1.5px solid var(--clr-border);
  border-radius: var(--r-md);
}

.link-group { display: flex; flex-direction: column; gap: 6px; }

.link-group-label {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--clr-text-3);
}

.link-tags { display: flex; flex-wrap: wrap; gap: 5px; }

.link-tag {
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 100px;
  border: 1.5px solid var(--clr-border);
  color: var(--clr-text-2);
  background: var(--clr-surface);
  cursor: pointer;
  transition: all 0.15s;
}
.link-tag:hover:not(.active) {
  border-color: var(--clr-text-3);
  color: var(--clr-text);
}
.link-tag.active {
  font-weight: 600;
}

/* Actions */
.panel-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 4px;
  padding-top: 16px;
  border-top: 1px solid var(--clr-border-light);
  flex-shrink: 0;
}

.actions-right { display: flex; gap: 8px; margin-left: auto; }

.btn-primary {
  padding: 9px 20px;
  font-size: 14px; font-weight: 600;
  color: #fff;
  background: var(--clr-accent);
  border-radius: var(--r-md);
  transition: background 0.15s, transform 0.1s;
}
.btn-primary:hover { background: var(--clr-accent-hover); }
.btn-primary:active { transform: scale(0.98); }

.btn-ghost {
  padding: 9px 16px;
  font-size: 14px; font-weight: 500;
  color: var(--clr-text-2);
  background: transparent;
  border-radius: var(--r-md);
  transition: background 0.15s;
}
.btn-ghost:hover { background: var(--clr-surface-2); }

.btn-danger {
  display: flex; align-items: center; gap: 6px;
  padding: 9px 14px;
  font-size: 13px; font-weight: 500;
  color: var(--clr-danger);
  background: rgba(255,59,48,0.07);
  border-radius: var(--r-md);
  transition: background 0.15s;
}
.btn-danger:hover { background: rgba(255,59,48,0.14); }
</style>
