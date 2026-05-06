<template>
  <header class="header">
    <div class="header-inner">
      <div class="brand">
        <div class="brand-icon">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <rect x="2" y="2" width="8" height="8" rx="2" fill="white" opacity="0.9"/>
            <rect x="12" y="2" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
            <rect x="2" y="12" width="8" height="8" rx="2" fill="white" opacity="0.6"/>
            <rect x="12" y="12" width="8" height="8" rx="2" fill="white" opacity="0.35"/>
          </svg>
        </div>
        <div class="brand-text">
          <span class="brand-title">ATLAS</span>
        </div>
      </div>

      <div class="year-nav">
        <button class="year-btn" @click="$emit('prev-year')">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 11L5 7l4-4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <span class="year-label">{{ year }}</span>
        <button class="year-btn" @click="$emit('next-year')">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M5 3l4 4-4 4" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <div class="header-actions">
        <button class="btn-manage" @click="$emit('manage')">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M7.5 1v2M7.5 12v2M1 7.5h2M12 7.5h2M3.1 3.1l1.4 1.4M10.5 10.5l1.4 1.4M10.5 4.5l1.4-1.4M3.1 11.9l1.4-1.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="7.5" cy="7.5" r="2.5" stroke="currentColor" stroke-width="1.5"/>
          </svg>
          Manage Areas
        </button>
      </div>
    </div>
    <div class="header-trim"></div>
  </header>
</template>

<script setup>
defineProps({ year: Number })
defineEmits(['prev-year', 'next-year', 'manage'])
</script>

<style scoped>
.header {
  background: var(--clr-header);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 0 rgba(255,255,255,0.06), var(--sh-md);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 64px;
  gap: 20px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.brand-icon {
  width: 38px;
  height: 38px;
  background: rgba(255,255,255,0.08);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,255,255,0.1);
  flex-shrink: 0;
}

.brand-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.brand-title {
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: -0.2px;
}


.year-nav {
  display: flex;
  align-items: center;
  gap: 2px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 100px;
  padding: 4px;
}

.year-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border-radius: 100px;
  color: rgba(255,255,255,0.7);
  transition: background 0.15s, color 0.15s;
}

.year-btn:hover {
  background: rgba(255,255,255,0.12);
  color: #FFFFFF;
}

.year-label {
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  padding: 0 12px;
  letter-spacing: -0.3px;
  min-width: 54px;
  text-align: center;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: flex-end;
}

.btn-manage {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 8px 14px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.85);
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--r-md);
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}

.btn-manage:hover {
  background: rgba(255,255,255,0.14);
  color: #FFFFFF;
  border-color: rgba(255,255,255,0.2);
}

.header-trim {
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(255,255,255,0.06) 20%,
    rgba(0,113,227,0.5) 50%,
    rgba(255,255,255,0.06) 80%,
    transparent 100%
  );
}
</style>
