<template>
  <div class="app">
    <TheHeader
      :year="store.year"
      @prev-year="prevYear"
      @next-year="nextYear"
      @manage="manageOpen = true"
    />

    <MilestoneTable
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
        @close="manageOpen = false"
      />
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useAppStore, store } from './stores/useAppStore.js'
import TheHeader from './components/TheHeader.vue'
import MilestoneTable from './components/MilestoneTable.vue'
import MilestoneModal from './components/MilestoneModal.vue'
import ManageModal from './components/ManageModal.vue'

const { prevYear, nextYear } = useAppStore()

const manageOpen = ref(false)

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
