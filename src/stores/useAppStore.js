import { reactive, watch } from 'vue'

const KEY = 'milestone-plan-v6'

let _counter = Date.now()
const uid = () => `${++_counter}`

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const SCENARIO_LABELS = {
  bmw:         'BMW',
  mercedes:    'Mercedes',
  vw:          'VW Group',
  stellantis:  'Stellantis',
  renault:     'Renault',
  toyota:      'Toyota',
  bosch:       'Bosch',
  continental: 'Continental',
  ces:         'CES 2026',
  iaa:         'IAA Mobility',
  autosens:    'AutoSens',
  ncap:        'NCAP Compliance',
  release:     'Annual Release',
  ota:         'OTA Rollout',
  alpha:       'Tool Alpha',
  beta:        'Tool Beta',
  gamma:       'Tool Gamma',
}

export const SCENARIO_GROUPS = [
  { label: 'Customer Accounts', keys: ['bmw', 'mercedes', 'vw', 'stellantis', 'renault', 'toyota'] },
  { label: 'Partnerships',      keys: ['bosch', 'continental'] },
  { label: 'Events',            keys: ['ces', 'iaa', 'autosens'] },
  { label: 'Programs',          keys: ['ncap', 'release', 'ota'] },
  { label: 'Tools',             keys: ['alpha', 'beta', 'gamma'] },
]

export const PRESET_COLORS = [
  '#0A84FF',
  '#30D158',
  '#FF9F0A',
  '#FF375F',
  '#BF5AF2',
  '#5AC8FA',
  '#FFCC00',
  '#FF6961',
  '#32ADE6',
  '#AC8E68',
  '#636366',
  '#1C1C1E',
]

function seed() {
  const year = new Date().getFullYear()

  // Swimlane IDs
  const CA = uid(), EV = uid(), DP = uid(), SY = uid(), FN = uid(), TL = uid(), RM = uid()

  // Customer Accounts sub-lanes (one per customer/partner)
  const CA_BMW = uid(), CA_MER = uid(), CA_VW = uid()
  const CA_ST  = uid(), CA_REN = uid(), CA_TOY = uid()
  const CA_BSH = uid(), CA_CON = uid()

  // Events sub-lanes
  const EV_CES = uid(), EV_IAA = uid(), EV_AS = uid()

  // Demo Planning
  const DP_PR = uid(), DP_DS = uid(), DP_TS = uid(), DP_RE = uid()
  // Systems
  const SY_AD = uid(), SY_IV = uid(), SY_PT = uid(), SY_CH = uid(), SY_BE = uid()
  // Functions
  const FN_FD = uid(), FN_VA = uid(), FN_IN = uid(), FN_HO = uid()
  // Tools
  const TL_A = uid(), TL_B = uid(), TL_G = uid()
  // Release Management
  const RM_SP = uid(), RM_QA = uid(), RM_SO = uid(), RM_DE = uid()

  const ms = (swimlaneId, subLaneId, month, title, what, why, how, who, when, scenarios = []) =>
    ({ id: uid(), swimlaneId, subLaneId, year, month, title, what, why, how, who, when, scenarios })

  return {
    year,
    swimlanes: [
      {
        id: CA, name: 'Customer Accounts', color: '#0A84FF', subLanes: [
          { id: CA_BMW, name: 'BMW' },
          { id: CA_MER, name: 'Mercedes' },
          { id: CA_VW,  name: 'VW Group' },
          { id: CA_ST,  name: 'Stellantis' },
          { id: CA_REN, name: 'Renault' },
          { id: CA_TOY, name: 'Toyota' },
          { id: CA_BSH, name: 'Bosch' },
          { id: CA_CON, name: 'Continental' },
        ]
      },
      {
        id: EV, name: 'Events', color: '#FFCC00', subLanes: [
          { id: EV_CES, name: 'CES 2026' },
          { id: EV_IAA, name: 'IAA Mobility' },
          { id: EV_AS,  name: 'AutoSens Brussels' },
        ]
      },
      {
        id: DP, name: 'Demo Planning', color: '#30D158', subLanes: [
          { id: DP_PR, name: 'Demo Preparation' },
          { id: DP_DS, name: 'Presentation Design' },
          { id: DP_TS, name: 'Technical Setup' },
          { id: DP_RE, name: 'Rehearsal' },
        ]
      },
      {
        id: SY, name: 'Systems', color: '#FF9F0A', subLanes: [
          { id: SY_AD, name: 'ADAS' },
          { id: SY_IV, name: 'Infotainment' },
          { id: SY_PT, name: 'Powertrain' },
          { id: SY_CH, name: 'Chassis' },
          { id: SY_BE, name: 'Body Electronics' },
        ]
      },
      {
        id: FN, name: 'Functions', color: '#FF375F', subLanes: [
          { id: FN_FD, name: 'Feature Development' },
          { id: FN_VA, name: 'Validation' },
          { id: FN_IN, name: 'Integration' },
          { id: FN_HO, name: 'Homologation' },
        ]
      },
      {
        id: TL, name: 'Tools', color: '#BF5AF2', subLanes: [
          { id: TL_A, name: 'Tool Alpha' },
          { id: TL_B, name: 'Tool Beta' },
          { id: TL_G, name: 'Tool Gamma' },
        ]
      },
      {
        id: RM, name: 'Release Management', color: '#32ADE6', subLanes: [
          { id: RM_SP, name: 'Sprint Planning' },
          { id: RM_QA, name: 'QA & Testing' },
          { id: RM_SO, name: 'Sign-off' },
          { id: RM_DE, name: 'Deployment' },
        ]
      },
    ],
    milestones: [
      // ── Customer Accounts ─────────────────────────────────────────────────
      ms(CA, CA_BMW, 2,  'ADAS Presentation',     'Present ADAS stack to BMW procurement team', 'Strategic partnership potential exceeding €5M', 'Executive presentation at BMW HQ Munich', 'Sales Lead', 'Mid February',      ['bmw', 'iaa']),
      ms(CA, CA_BMW, 9,  'Framework Agreement',   'Sign framework agreement for 2027 series supply', 'Lock in BMW as anchor customer', 'Legal negotiation + executive sign-off', 'CEO + Legal', 'September',                 ['bmw', 'release']),
      ms(CA, CA_MER, 5,  'Driving Functions PoC', 'Proof-of-concept for driving functions', 'Gateway to serial production order 2027', 'Joint workshop in Stuttgart', 'Key Account Manager', 'End of May',                   ['mercedes']),
      ms(CA, CA_MER, 10, 'Series Order Decision', 'Mercedes decides on series supply award', 'Convert PoC into revenue', 'Steering committee presentation', 'CEO + Sales', 'October',                                        ['mercedes', 'release']),
      ms(CA, CA_VW,  7,  'Platform Review',       'Annual review with Volkswagen Group', 'Prepare framework agreement for 2027', 'Presentation of all ATLAS modules', 'CEO + Sales', 'Week 37',                               ['vw', 'release']),
      ms(CA, CA_ST,  1,  'Intro Call',            'First contact with Stellantis software division', 'Open up new OEM channel', 'Conference call via LinkedIn lead', 'BDM', 'January',                                       ['stellantis', 'ota']),
      ms(CA, CA_ST,  6,  'Technical Workshop',    'Deep-dive into Stellantis SW architecture needs', 'Qualify opportunity for tool deployment', 'On-site workshop at Stellantis Paris', 'CTO + Sales', 'June',               ['stellantis', 'beta']),
      ms(CA, CA_REN, 4,  'Requirements Workshop', 'Technical deep-dive with Renault software team', 'Understand requirements for 2028 platform', '2-day workshop in Paris', 'CTO + Sales', 'Week 15',                        ['renault']),
      ms(CA, CA_TOY, 8,  'Strategic Pitch',       'Strategic proposal to Toyota Europe', 'Expand into Asian OEM market', 'Formal RFI response document', 'Sales Lead', 'August',                                             ['toyota', 'ncap']),
      ms(CA, CA_BSH, 3,  'MoU Signing',           'Sign cooperation agreement with Bosch', 'Joint go-to-market strategy', 'Legal review + signing event', 'CEO + Legal', 'March',                                           ['bosch']),
      ms(CA, CA_CON, 7,  'JDA Signed',            'Joint Development Agreement with Continental', 'Develop shared ADAS platform', 'Contract negotiation + NDA', 'Business Dev', 'Q3',                                       ['continental']),

      // ── Events ────────────────────────────────────────────────────────────
      ms(EV, EV_CES, 1,  'CES 2026',              'Exhibition at Consumer Electronics Show', 'Build international visibility', 'Booth setup + live ADAS demo', 'Marketing + Engineering', 'Week 2, Las Vegas',              ['ces', 'ota', 'alpha']),
      ms(EV, EV_IAA, 9,  'IAA Mobility',          'Exhibition at IAA Munich', 'Reach European OEMs in one place', 'Demo vehicle + keynote slot', 'CEO + Marketing', 'Week 37, Munich',                                      ['iaa', 'bmw', 'ncap']),
      ms(EV, EV_AS,  10, 'AutoSens Brussels',     'Sensor & Perception conference', 'Establish technical thought leadership', 'Paper submission + panel discussion', 'CTO', 'October',                                       ['autosens', 'ncap']),

      // ── Demo Planning / Demo Preparation ─────────────────────────────────
      ms(DP, DP_PR, 2,  'Demo Concept v1',        'Concept for interactive ADAS live demo', 'Unified demo story for all customers', 'Workshop with Sales + Engineering', 'Product Manager', 'End of February',              ['ces', 'iaa']),
      ms(DP, DP_PR, 5,  'Demo Vehicle Ready',     'Test vehicle fully equipped', 'Hardware base for customer demos', 'Vehicle conversion + ECU integration', 'Systems Lead', 'Week 20',                                     ['iaa', 'bmw', 'mercedes']),
      ms(DP, DP_PR, 8,  'Demo v2 Update',         'Extend demo with new features', 'Show current software status', 'Feature integration + test run', 'Engineering', 'August',                                               ['iaa', 'toyota']),

      // ── Demo Planning / Presentation Design ──────────────────────────────
      ms(DP, DP_DS, 1,  'Deck Template',          'Unified presentation template', 'Maintain corporate identity', 'Design agency briefing', 'Marketing', 'January',                                                         ['ces']),
      ms(DP, DP_DS, 6,  'Product Brochure',       'Updated ATLAS product brochure', 'Sales material for H2 2026', 'Copywriting + design + print', 'Marketing Lead', 'June',                                                 ['iaa', 'vw']),

      // ── Demo Planning / Technical Setup ──────────────────────────────────
      ms(DP, DP_TS, 3,  'HiL Rig Setup',          'Hardware-in-the-loop demo rig', 'Enable demos without physical vehicle', 'HiL procurement + configuration', 'HW Engineer', 'March',                                     ['ces', 'autosens']),
      ms(DP, DP_TS, 7,  'Test Track Booking',     'Book test track for Q3 demos', 'Ensure safe driving demo environment', 'Coordination with facility team', 'Office Manager', 'July',                                      ['iaa', 'mercedes']),

      // ── Demo Planning / Rehearsal ─────────────────────────────────────────
      ms(DP, DP_RE, 4,  'Internal Dry Run',       'Full rehearsal before CES preparation', 'Identify weaknesses early', 'Complete demo run-through internally', 'Demo Team', 'Week 14',                                     ['ces']),
      ms(DP, DP_RE, 9,  'Pre-IAA Rehearsal',      'Final rehearsal before IAA', 'Ensure smooth customer presentation', 'Dress rehearsal at exhibition stand', 'Demo Team', 'Week 36',                                       ['iaa', 'bmw']),

      // ── Systems / ADAS ────────────────────────────────────────────────────
      ms(SY, SY_AD, 3,  'Sensor Fusion v2',       'New sensor fusion architecture', 'Reduce false positives by 40%', 'Algorithm update + calibration', 'ADAS Architect', 'End of Q1',                                      ['bmw', 'toyota', 'autosens', 'bosch']),
      ms(SY, SY_AD, 6,  'Perception Stack R2',    'Camera/radar/lidar fusion release', 'Foundation for L3 functions', 'Software development + SIL verification', 'Perception Team', 'June',                                ['bmw', 'toyota', 'autosens']),
      ms(SY, SY_AD, 10, 'NCAP Compliance',        'Euro NCAP 2026 requirements check', 'Ensure conformity for series vehicles', 'Gap analysis + action plan', 'Safety Engineer', 'October',                                ['ncap', 'toyota', 'iaa']),

      // ── Systems / Infotainment ────────────────────────────────────────────
      ms(SY, SY_IV, 2,  'IVI Platform Update',    'Infotainment platform upgraded to Android 14', 'Meet new OEM requirements', 'BSP update + app validation', 'IVI Lead', 'February',                                     ['ces', 'renault', 'stellantis']),
      ms(SY, SY_IV, 7,  'OTA Framework',          'Over-the-air update framework live', 'Enable remote vehicle fleet updates', 'Backend integration + rollout plan', 'Cloud Engineer', 'July',                             ['ota', 'stellantis', 'ces']),

      // ── Systems / Powertrain ──────────────────────────────────────────────
      ms(SY, SY_PT, 3,  'BMS Integration',        'Battery management system connected', 'Unlock energy efficiency functions', 'CAN protocol + calibration', 'Powertrain Eng', 'March',                                    ['renault']),
      ms(SY, SY_PT, 9,  'Torque Vectoring',       'Software torque vectoring function', 'Improve all-wheel drive dynamics', 'Model development + HiL test', 'Control Systems', 'September',                                ['continental', 'mercedes']),

      // ── Systems / Chassis ─────────────────────────────────────────────────
      ms(SY, SY_CH, 4,  'Brake-by-Wire Val.',     'Validation of electric braking system', 'Functional safety ASIL-D', 'Test campaign per ISO 26262', 'Safety Eng', 'Q2',                                                  ['continental', 'mercedes', 'ncap']),
      ms(SY, SY_CH, 10, 'Suspension Control',     'Adaptive suspension software update', 'Implement comfort/sport profiles', 'Parameterization + driving trials', 'Chassis Team', 'October',                               ['continental']),

      // ── Systems / Body Electronics ────────────────────────────────────────
      ms(SY, SY_BE, 1,  'Gateway ECU Flasher',    'Diagnostic tool for gateway ECU', 'Digitize field service process', 'SW development + DoIP integration', 'Diagnostics Eng', 'January',                                  ['stellantis']),
      ms(SY, SY_BE, 6,  'Smart Lighting Ctrl',    'Adaptive lighting system software', 'Automatic glare reduction', 'Actuator interface + control algorithm', 'Body Elec. Team', 'June',                                   ['iaa', 'mercedes']),

      // ── Functions / Feature Development ──────────────────────────────────
      ms(FN, FN_FD, 2,  'Lane Keep Assist',       'LKA function development start', 'Core function for L2 automation', 'Agile sprints in AUTOSAR environment', 'Feature Team', 'Sprint 3',                                 ['bmw', 'ncap']),
      ms(FN, FN_FD, 5,  'Adaptive Cruise',        'ACC with stop & go completed', 'Customer requirement from BMW & VW', 'Algorithm + driver assistance HMI', 'Feature Lead', 'May',                                        ['bmw', 'vw']),
      ms(FN, FN_FD, 9,  'Emergency Brake',        'AEB function integrated', 'Mandatory for Euro NCAP 2026', 'Sensor fusion + brake intervention', 'Safety Functions', 'September',                                        ['ncap', 'toyota']),

      // ── Functions / Validation ────────────────────────────────────────────
      ms(FN, FN_VA, 3,  'SIL Suite v1',           'Software-in-the-loop test suite', 'Early defect detection in SW process', 'CI pipeline integration', 'Test Automation', 'March',                                        ['autosens', 'mercedes']),
      ms(FN, FN_VA, 6,  'HiL Campaign Q2',        'Full HiL test coverage for Q2', 'Demonstrate maturity for customer demo', 'Test case execution + reporting', 'Validation Team', 'End of June',                          ['bmw', 'autosens']),
      ms(FN, FN_VA, 11, 'Road Test Sign-off',     'Acceptance drives completed', 'Clearance for series production', 'Test drives at proving ground', 'Test Driver + QA', 'November',                                       ['mercedes', 'ncap', 'release']),

      // ── Functions / Integration ───────────────────────────────────────────
      ms(FN, FN_IN, 1,  'CI/CD Pipeline',         'Automated build pipeline live', 'Nightly builds & immediate feedback', 'Jenkins + GitLab CI configuration', 'DevOps', 'January',                                        ['stellantis', 'release']),
      ms(FN, FN_IN, 5,  'Cross-ECU Integration',  'All ECUs tested in system network', 'Ensure end-to-end system behaviour', 'Integration testbench set up', 'Systems Integrator', 'May',                                  ['bosch', 'release']),

      // ── Functions / Homologation ──────────────────────────────────────────
      ms(FN, FN_HO, 7,  'Type Approval Filing',   'Type approval submission to authority', 'Market approval for DE/EU', 'Document package + authority liaison', 'Homologation Eng', 'July',                                ['renault', 'release']),
      ms(FN, FN_HO, 10, 'UNECE R155 Audit',       'Cybersecurity audit per UNECE R155', 'Mandatory for new type approvals from 2026', 'External auditor + CSMS evidence', 'Cybersecurity Lead', 'October',                ['renault', 'release']),

      // ── Tools / Tool Alpha ────────────────────────────────────────────────
      ms(TL, TL_A, 2,  'Alpha v1.0 Release',      'First production release of Tool Alpha', 'Enable internal teams to go live', 'Feature freeze + packaging', 'Tool Alpha Team', 'February',                               ['ces', 'alpha']),
      ms(TL, TL_A, 6,  'Alpha Training',          'User training roll-out', 'Ensure adoption across all teams', 'Workshop series + documentation', 'Product Owner', 'June',                                                ['alpha']),
      ms(TL, TL_A, 10, 'Alpha v2.0',              'Major release with new features', 'Q1+Q2 customer feedback incorporated', 'Agile development + beta test', 'Tool Alpha Team', 'October',                                ['alpha', 'release']),

      // ── Tools / Tool Beta ─────────────────────────────────────────────────
      ms(TL, TL_B, 3,  'Beta Pilot Rollout',      'Pilot with 3 internal teams', 'Gather real-world feedback before broad rollout', 'Controlled rollout + feedback loops', 'Product Owner', 'March',                       ['stellantis', 'beta']),
      ms(TL, TL_B, 5,  'Beta Training',           'Training materials + workshop', 'Promote self-service usage', 'E-learning course created', 'Trainer', 'Week 20',                                                        ['beta']),
      ms(TL, TL_B, 9,  'Beta GA Release',         'General availability of Tool Beta', 'Migrate all teams', 'Migration guide + support hotline', 'Tool Beta Team', 'September',                                            ['beta', 'iaa']),

      // ── Tools / Tool Gamma ────────────────────────────────────────────────
      ms(TL, TL_G, 4,  'Gamma Prototype',         'Working Gamma prototype', 'Validate concept before full development', 'Rapid prototyping sprint', 'Gamma Team', 'April',                                                 ['bosch', 'gamma']),
      ms(TL, TL_G, 7,  'Gamma Integration Test',  'Integration with Tool Alpha + Beta', 'Ensure toolchain compatibility', 'API tests + end-to-end scenarios', 'QA + Tool Team', 'July',                                    ['bosch', 'gamma']),
      ms(TL, TL_G, 11, 'Gamma Prod. Ready',       'Production-ready certification', 'Clearance for customer projects', 'Security scan + performance test', 'Gamma Lead', 'November',                                       ['gamma', 'release']),

      // ── Release Management / Sprint Planning ──────────────────────────────
      ms(RM, RM_SP, 1,  'Q1 Sprint Kickoff',      'Sprint planning for Q1', 'Align priorities and capacity', 'PI planning session', 'Scrum Master', 'Week 1',                                                               ['ces']),
      ms(RM, RM_SP, 4,  'Q2 Sprint Kickoff',      'Sprint planning for Q2', 'Incorporate Q1 learnings', 'PI planning session', 'Scrum Master', 'Week 14',                                                                   ['mercedes']),
      ms(RM, RM_SP, 7,  'Q3 Sprint Kickoff',      'Sprint planning for Q3', 'Recalibrate mid-year goals', 'PI planning session', 'Scrum Master', 'Week 27',                                                                 ['iaa']),
      ms(RM, RM_SP, 10, 'Q4 Sprint Kickoff',      'Sprint planning for Q4', 'Year-end wrap-up & 2027 roadmap', 'PI planning session', 'Scrum Master', 'Week 40',                                                            ['vw', 'release']),

      // ── Release Management / QA & Testing ────────────────────────────────
      ms(RM, RM_QA, 3,  'Regression Suite',       'Automated regression test suite v1', 'Quality gate for every release', 'Test case development + CI integration', 'QA Lead', 'March',                                    ['release']),
      ms(RM, RM_QA, 7,  'System Test Campaign',   'Full system test campaign H1', 'Demonstrate release maturity', 'Test report + defect review', 'QA Team', 'July',                                                        ['release', 'mercedes']),
      ms(RM, RM_QA, 11, 'Final Acceptance Test',  'Acceptance test for annual release', 'Formal customer sign-off', 'Test protocol + customer acceptance', 'QA + PM', 'November',                                          ['vw', 'release']),

      // ── Release Management / Sign-off ─────────────────────────────────────
      ms(RM, RM_SO, 9,  'Feature Freeze',         'No new features after this date', 'Enter stabilisation phase', 'Management decision documented', 'PM + CTO', 'End of September',                                        ['release', 'vw']),
      ms(RM, RM_SO, 11, 'RC Approval',            'Release candidate officially approved', 'Green light for deployment', 'Review meeting + sign-off document', 'Steering Committee', 'Week 46',                            ['release', 'vw']),

      // ── Release Management / Deployment ───────────────────────────────────
      ms(RM, RM_DE, 5,  'OTA Rollout v1.0',       'First OTA update to vehicle fleet', 'Validate field update process', 'Staged rollout 10% to 100%', 'DevOps + Fleet Mgmt', 'May',                                        ['ota', 'stellantis']),
      ms(RM, RM_DE, 12, 'Annual Release',         'Production release 2026', 'Deliver all annual features', 'Deployment + hypercare phase', 'Release Manager', 'December',                                                 ['release', 'vw']),
    ],
  }
}

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

export const store = reactive(load() || seed())

watch(store, v => {
  localStorage.setItem(KEY, JSON.stringify(v))
}, { deep: true })

export function useAppStore() {
  // --- Year ---
  function prevYear() { store.year-- }
  function nextYear() { store.year++ }

  // --- Swimlanes ---
  function addSwimlane(name, color) {
    store.swimlanes.push({ id: uid(), name, color, subLanes: [] })
  }
  function updateSwimlane(id, patch) {
    const s = store.swimlanes.find(s => s.id === id)
    if (s) Object.assign(s, patch)
  }
  function deleteSwimlane(id) {
    store.swimlanes = store.swimlanes.filter(s => s.id !== id)
    store.milestones = store.milestones.filter(m => m.swimlaneId !== id)
  }
  function moveSwimlane(id, dir) {
    const i = store.swimlanes.findIndex(s => s.id === id)
    if (i < 0) return
    const j = i + dir
    if (j < 0 || j >= store.swimlanes.length) return
    const tmp = store.swimlanes[i]
    store.swimlanes[i] = store.swimlanes[j]
    store.swimlanes[j] = tmp
  }

  // --- Sub-lanes ---
  function addSubLane(swimlaneId, name) {
    const sl = store.swimlanes.find(s => s.id === swimlaneId)
    if (sl) sl.subLanes.push({ id: uid(), name })
  }
  function updateSubLane(swimlaneId, subId, name) {
    const sl = store.swimlanes.find(s => s.id === swimlaneId)
    const sub = sl?.subLanes.find(s => s.id === subId)
    if (sub) sub.name = name
  }
  function deleteSubLane(swimlaneId, subId) {
    const sl = store.swimlanes.find(s => s.id === swimlaneId)
    if (sl) sl.subLanes = sl.subLanes.filter(s => s.id !== subId)
    store.milestones = store.milestones.filter(
      m => !(m.swimlaneId === swimlaneId && m.subLaneId === subId)
    )
  }

  // --- Milestones ---
  function addMilestone(data) {
    store.milestones.push({ id: uid(), ...data })
  }
  function updateMilestone(id, data) {
    const m = store.milestones.find(m => m.id === id)
    if (m) Object.assign(m, data)
  }
  function deleteMilestone(id) {
    store.milestones = store.milestones.filter(m => m.id !== id)
  }

  function cellMilestones(swimlaneId, subLaneId, month) {
    return store.milestones.filter(m =>
      m.swimlaneId === swimlaneId &&
      m.subLaneId  === subLaneId  &&
      m.month      === month      &&
      m.year       === store.year
    )
  }

  return {
    store,
    prevYear, nextYear,
    addSwimlane, updateSwimlane, deleteSwimlane, moveSwimlane,
    addSubLane, updateSubLane, deleteSubLane,
    addMilestone, updateMilestone, deleteMilestone,
    cellMilestones,
  }
}
