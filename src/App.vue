<template>
  <div class="app">
    <TheHeader
      :year="store.year"
      :zoom="zoom"
      @prev-year="prevYear"
      @next-year="nextYear"
      @manage="manageOpen = true"
      @zoom-in="zoom = Math.min(1.5, Math.round((zoom + 0.1) * 10) / 10)"
      @zoom-out="zoom = Math.max(0.6, Math.round((zoom - 0.1) * 10) / 10)"
    />

    <MilestoneTable
      :zoom="zoom"
      :read-only="readOnly"
      @add-milestone="openAdd"
      @edit-milestone="openEdit"
    />

    <Transition name="modal">
      <MilestoneModal
        v-if="modal.show"
        :mode="modal.mode"
        :swimlane="modal.swimlane"
        :sub-lane="modal.subLane"
        :month="modal.month"
        :year="modal.year"
        :milestone="modal.milestone"
        @close="modal.show = false"
      />
    </Transition>

    <Transition name="modal">
      <ManageModal
        v-if="manageOpen"
        :read-only="readOnly"
        @update:readOnly="readOnly = $event"
        @close="manageOpen = false"
      />
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { useAppStore, store } from './stores/useAppStore.js'
import TheHeader from './components/TheHeader.vue'
import MilestoneTable from './components/MilestoneTable.vue'
import MilestoneModal from './components/MilestoneModal.vue'
import ManageModal from './components/ManageModal.vue'

const { prevYear, nextYear } = useAppStore()

const manageOpen = ref(false)
const zoom = ref(1)
const readOnly = ref(localStorage.getItem('atlas-readonly') === 'true')
watch(readOnly, v => localStorage.setItem('atlas-readonly', v))

const modal = reactive({
  show: false,
  mode: 'add',
  swimlane: null,
  subLane: null,
  month: 1,
  year: store.year,
  milestone: null,
})

function openAdd({ swimlane, subLane, month }) {
  Object.assign(modal, {
    show: true,
    mode: 'add',
    swimlane,
    subLane,
    month,
    year: store.year,
    milestone: null,
  })
}

function openEdit(milestone) {
  const swimlane = store.swimlanes.find(s => s.id === milestone.swimlaneId)
  const subLane = swimlane?.subLanes.find(s => s.id === milestone.subLaneId) ?? null
  Object.assign(modal, {
    show: true,
    mode: 'edit',
    swimlane,
    subLane,
    month: milestone.month,
    year: milestone.year,
    milestone,
  })
}
</script>

<style>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>
