import { reactive, watch } from 'vue'

const KEY = 'milestone-plan-v10'

let _counter = Date.now()
const uid = () => `${++_counter}`

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const PRESET_COLORS = [
  '#0A84FF', '#30D158', '#FF9F0A', '#FF375F',
  '#BF5AF2', '#5AC8FA', '#FFCC00', '#FF6961',
  '#32ADE6', '#AC8E68', '#636366', '#1C1C1E',
]

function seed() {
  const year = new Date().getFullYear()

  const CA = uid(), EV = uid(), DP = uid(), SY = uid(), FN = uid(), TL = uid(), RM = uid()
  const CA_BMW = uid(), CA_MER = uid(), CA_VW = uid()
  const CA_ST  = uid(), CA_REN = uid(), CA_TOY = uid()
  const CA_BSH = uid(), CA_CON = uid()
  const EV_CES = uid(), EV_IAA = uid(), EV_AS = uid()
  const DP_PR = uid(), DP_DS = uid(), DP_TS = uid(), DP_RE = uid()
  const SY_AD = uid(), SY_IV = uid(), SY_PT = uid(), SY_CH = uid(), SY_BE = uid()
  const FN_FD = uid(), FN_VA = uid(), FN_IN = uid(), FN_HO = uid()
  const TL_A = uid(), TL_B = uid(), TL_G = uid()
  const RM_SP = uid(), RM_QA = uid(), RM_SO = uid(), RM_DE = uid()

  const ms = (swimlaneId, subLaneId, month, title, what, why, how, who, when) =>
    ({ id: uid(), swimlaneId, subLaneId, year, month, title, what, why, how, who, when })

  // date helper: produces YYYY-MM-DD for the seed year
  const d = (month, day) =>
    `${year}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`

  // ── Named milestones (needed for links) ─────────────────────────────────

  // Customer Accounts
  const mBMW_ADAS   = ms(CA, CA_BMW, 6,  'ADAS Presentation',    'Present ADAS stack to BMW procurement team',        'Strategic partnership potential exceeding €5M',   'Executive presentation at BMW HQ Munich',     'Sales Lead',         d(6,15))
  const mBMW_FW     = ms(CA, CA_BMW, 9,  'Framework Agreement',  'Sign framework agreement for 2027 series supply',   'Lock in BMW as anchor customer',                 'Legal negotiation + executive sign-off',      'CEO + Legal',        d(9,15))
  const mMER_POC    = ms(CA, CA_MER, 5,  'Driving Functions PoC','Proof-of-concept for driving functions',             'Gateway to serial production order 2027',        'Joint workshop in Stuttgart',                 'Key Account Manager',d(5,29))
  const mMER_DEC    = ms(CA, CA_MER, 10, 'Series Order Decision','Mercedes decides on series supply award',            'Convert PoC into revenue',                       'Steering committee presentation',             'CEO + Sales',        d(10,15))
  const mVW_REV     = ms(CA, CA_VW,  7,  'Platform Review',      'Annual review with Volkswagen Group',               'Prepare framework agreement for 2027',           'Presentation of all ATLAS modules',           'CEO + Sales',        d(7,9))
  const mST_INTRO   = ms(CA, CA_ST,  1,  'Intro Call',           'First contact with Stellantis software division',   'Open up new OEM channel',                        'Conference call via LinkedIn lead',           'BDM',                d(1,15))
  const mST_WSHOP   = ms(CA, CA_ST,  6,  'Technical Workshop',   'Deep-dive into Stellantis SW architecture needs',   'Qualify opportunity for tool deployment',        'On-site workshop at Stellantis Paris',        'CTO + Sales',        d(6,18))
  const mREN_WSHOP  = ms(CA, CA_REN, 4,  'Requirements Workshop','Technical deep-dive with Renault software team',    'Understand requirements for 2028 platform',      '2-day workshop in Paris',                     'CTO + Sales',        d(4,7))
  const mTOY_PITCH  = ms(CA, CA_TOY, 8,  'Strategic Pitch',      'Strategic proposal to Toyota Europe',               'Expand into Asian OEM market',                   'Formal RFI response document',                'Sales Lead',         d(8,20))
  const mBSH_MOU    = ms(CA, CA_BSH, 3,  'MoU Signing',          'Sign cooperation agreement with Bosch',             'Joint go-to-market strategy',                    'Legal review + signing event',                'CEO + Legal',        d(3,20))
  const mCON_JDA    = ms(CA, CA_CON, 7,  'JDA Signed',           'Joint Development Agreement with Continental',      'Develop shared ADAS platform',                   'Contract negotiation + NDA',                  'Business Dev',       d(7,31))

  // Events / Demo
  const mIAA        = ms(EV, EV_IAA, 9,  'IAA Mobility',         'Exhibition at IAA Munich',                          'Reach European OEMs in one place',               'Demo vehicle + keynote slot',                 'CEO + Marketing',    d(9,10))
  const mPreIAA     = ms(DP, DP_RE, 9,   'Pre-IAA Rehearsal',    'Final rehearsal before IAA',                        'Ensure smooth customer presentation',             'Dress rehearsal at exhibition stand',         'Demo Team',          d(9,3))
  const mDemoVeh    = ms(DP, DP_PR, 5,   'Demo Vehicle Ready',   'Test vehicle fully equipped',                       'Hardware base for customer demos',               'Vehicle conversion + ECU integration',        'Systems Lead',       d(5,15))
  const mDemoV2     = ms(DP, DP_PR, 8,   'Demo v2 Update',       'Extend demo with new features',                     'Show current software status',                   'Feature integration + test run',              'Engineering',        d(8,28))
  const mHiLRig     = ms(DP, DP_TS, 3,   'HiL Rig Setup',        'Hardware-in-the-loop demo rig',                    'Enable demos without physical vehicle',           'HiL procurement + configuration',             'HW Engineer',        d(3,31))

  // Systems
  const mSensorFuse = ms(SY, SY_AD, 3,  'Sensor Fusion v2',      'New sensor fusion architecture',                    'Reduce false positives by 40%',                  'Algorithm update + calibration',              'ADAS Architect',     d(3,31))
  const mPercept    = ms(SY, SY_AD, 6,  'Perception Stack R2',   'Camera/radar/lidar fusion release',                 'Foundation for L3 functions',                    'Software development + SIL verification',     'Perception Team',    d(6,30))
  const mNCAPComp   = ms(SY, SY_AD, 10, 'NCAP Compliance',       'Euro NCAP 2026 requirements check',                 'Ensure conformity for series vehicles',           'Gap analysis + action plan',                  'Safety Engineer',    d(10,31))
  const mIVI        = ms(SY, SY_IV, 2,  'IVI Platform Update',   'Infotainment platform upgraded to Android 14',      'Meet new OEM requirements',                      'BSP update + app validation',                 'IVI Lead',           d(2,28))
  const mOTA        = ms(SY, SY_IV, 7,  'OTA Framework',         'Over-the-air update framework live',                'Enable remote vehicle fleet updates',             'Backend integration + rollout plan',          'Cloud Engineer',     d(7,31))
  const mBMS        = ms(SY, SY_PT, 3,  'BMS Integration',       'Battery management system connected',               'Unlock energy efficiency functions',              'CAN protocol + calibration',                  'Powertrain Eng',     d(3,31))
  const mTorque     = ms(SY, SY_PT, 9,  'Torque Vectoring',      'Software torque vectoring function',                'Improve all-wheel drive dynamics',                'Model development + HiL test',                'Control Systems',    d(9,30))
  const mBrake      = ms(SY, SY_CH, 4,  'Brake-by-Wire Val.',    'Validation of electric braking system',             'Functional safety ASIL-D',                       'Test campaign per ISO 26262',                 'Safety Eng',         d(4,30))
  const mSuspension = ms(SY, SY_CH, 10, 'Suspension Control',    'Adaptive suspension software update',               'Implement comfort/sport profiles',                'Parameterization + driving trials',           'Chassis Team',       d(10,31))
  const mGateway    = ms(SY, SY_BE, 1,  'Gateway ECU Flasher',   'Diagnostic tool for gateway ECU',                   'Digitize field service process',                 'SW development + DoIP integration',           'Diagnostics Eng',    d(1,31))

  // Functions
  const mLKA        = ms(FN, FN_FD, 2,  'Lane Keep Assist',      'LKA function development start',                    'Core function for L2 automation',                'Agile sprints in AUTOSAR environment',        'Feature Team',       d(2,20))
  const mACC        = ms(FN, FN_FD, 5,  'Adaptive Cruise',       'ACC with stop & go completed',                      'Customer requirement from BMW & VW',             'Algorithm + driver assistance HMI',           'Feature Lead',       d(5,31))
  const mAEB        = ms(FN, FN_FD, 9,  'Emergency Brake',       'AEB function integrated',                           'Mandatory for Euro NCAP 2026',                   'Sensor fusion + brake intervention',          'Safety Functions',   d(9,30))
  const mSIL        = ms(FN, FN_VA, 3,  'SIL Suite v1',          'Software-in-the-loop test suite',                   'Early defect detection in SW process',           'CI pipeline integration',                     'Test Automation',    d(3,31))
  const mHiLQ2      = ms(FN, FN_VA, 6,  'HiL Campaign Q2',       'Full HiL test coverage for Q2',                     'Demonstrate maturity for customer demo',         'Test case execution + reporting',             'Validation Team',    d(6,30))
  const mRoadTest   = ms(FN, FN_VA, 11, 'Road Test Sign-off',    'Acceptance drives completed',                       'Clearance for series production',                'Test drives at proving ground',               'Test Driver + QA',   d(11,30))
  const mCICD       = ms(FN, FN_IN, 1,  'CI/CD Pipeline',        'Automated build pipeline live',                     'Nightly builds & immediate feedback',            'Jenkins + GitLab CI configuration',           'DevOps',             d(1,31))
  const mTypeAppr   = ms(FN, FN_HO, 7,  'Type Approval Filing',  'Type approval submission to authority',             'Market approval for DE/EU',                      'Document package + authority liaison',        'Homologation Eng',   d(7,31))
  const mUNECE      = ms(FN, FN_HO, 10, 'UNECE R155 Audit',      'Cybersecurity audit per UNECE R155',               'Mandatory for new type approvals from 2026',     'External auditor + CSMS evidence',            'Cybersecurity Lead', d(10,31))

  // Tools
  const mBeta       = ms(TL, TL_B, 3,   'Beta Pilot Rollout',    'Pilot with 3 internal teams',                       'Gather real-world feedback before broad rollout','Controlled rollout + feedback loops',          'Product Owner',      d(3,31))
  const mGamma      = ms(TL, TL_G, 4,   'Gamma Prototype',       'Working Gamma prototype',                           'Validate concept before full development',        'Rapid prototyping sprint',                    'Gamma Team',         d(4,30))

  // Release Management
  const mQ1Kick     = ms(RM, RM_SP, 1,  'Q1 Sprint Kickoff',     'Sprint planning for Q1',                            'Align priorities and capacity',                  'PI planning session',                         'Scrum Master',       d(1,5))
  const mQ3Kick     = ms(RM, RM_SP, 7,  'Q3 Sprint Kickoff',     'Sprint planning for Q3',                            'Recalibrate mid-year goals',                     'PI planning session',                         'Scrum Master',       d(7,1))
  const mSysTest    = ms(RM, RM_QA, 7,  'System Test Campaign',  'Full system test campaign H1',                      'Demonstrate release maturity',                   'Test report + defect review',                 'QA Team',            d(7,31))
  const mFreeze     = ms(RM, RM_SO, 9,  'Feature Freeze',        'No new features after this date',                   'Enter stabilisation phase',                      'Management decision documented',              'PM + CTO',           d(9,30))
  const mRCApproval = ms(RM, RM_SO, 11, 'RC Approval',           'Release candidate officially approved',             'Green light for deployment',                     'Review meeting + sign-off document',          'Steering Committee', d(11,13))
  const mAnnualRel  = ms(RM, RM_DE, 12, 'Annual Release',        'Production release 2026',                           'Deliver all annual features',                    'Deployment + hypercare phase',                'Release Manager',    d(12,31))

  const milestones = [
    // ── Customer Accounts ─────────────────────────────────────────────────
    mBMW_ADAS, mBMW_FW,
    mMER_POC, mMER_DEC,
    mVW_REV,
    mST_INTRO, mST_WSHOP,
    mREN_WSHOP,
    mTOY_PITCH,
    mBSH_MOU,
    mCON_JDA,

    // ── Events ────────────────────────────────────────────────────────────
    ms(EV, EV_CES, 1,  'CES 2026',              'Exhibition at Consumer Electronics Show',           'Build international visibility',                 'Booth setup + live ADAS demo',                'Marketing + Eng',     d(1,8)),
    mIAA,
    ms(EV, EV_AS,  10, 'AutoSens Brussels',     'Sensor & Perception conference',                   'Establish technical thought leadership',          'Paper submission + panel discussion',         'CTO',                 d(10,22)),

    // ── Demo Planning / Demo Preparation ─────────────────────────────────
    ms(DP, DP_PR, 2,  'Demo Concept v1',        'Concept for interactive ADAS live demo',            'Unified demo story for all customers',           'Workshop with Sales + Engineering',           'Product Manager',     d(2,27)),
    mDemoVeh, mDemoV2,

    // ── Demo Planning / Presentation Design ──────────────────────────────
    ms(DP, DP_DS, 1,  'Deck Template',          'Unified presentation template',                     'Maintain corporate identity',                    'Design agency briefing',                      'Marketing',           d(1,30)),
    ms(DP, DP_DS, 6,  'Product Brochure',       'Updated ATLAS product brochure',                    'Sales material for H2 2026',                    'Copywriting + design + print',                'Marketing Lead',      d(6,30)),

    // ── Demo Planning / Technical Setup ──────────────────────────────────
    mHiLRig,
    ms(DP, DP_TS, 7,  'Test Track Booking',     'Book test track for Q3 demos',                     'Ensure safe driving demo environment',            'Coordination with facility team',             'Office Manager',      d(7,1)),

    // ── Demo Planning / Rehearsal ─────────────────────────────────────────
    ms(DP, DP_RE, 4,  'Internal Dry Run',       'Full rehearsal before CES preparation',            'Identify weaknesses early',                       'Complete demo run-through internally',        'Demo Team',           d(4,2)),
    mPreIAA,

    // ── Systems / ADAS ────────────────────────────────────────────────────
    mSensorFuse, mPercept, mNCAPComp,

    // ── Systems / Infotainment ────────────────────────────────────────────
    mIVI, mOTA,

    // ── Systems / Powertrain ──────────────────────────────────────────────
    mBMS, mTorque,

    // ── Systems / Chassis ─────────────────────────────────────────────────
    mBrake, mSuspension,

    // ── Systems / Body Electronics ────────────────────────────────────────
    mGateway,
    ms(SY, SY_BE, 6,  'Smart Lighting Ctrl',   'Adaptive lighting system software',                'Automatic glare reduction',                      'Actuator interface + control algorithm',      'Body Elec. Team',     d(6,30)),

    // ── Functions / Feature Development ──────────────────────────────────
    mLKA, mACC, mAEB,

    // ── Functions / Validation ────────────────────────────────────────────
    mSIL, mHiLQ2, mRoadTest,

    // ── Functions / Integration ───────────────────────────────────────────
    mCICD,
    ms(FN, FN_IN, 5,  'Cross-ECU Integration', 'All ECUs tested in system network',                'Ensure end-to-end system behaviour',             'Integration testbench set up',                'Systems Integrator',  d(5,31)),

    // ── Functions / Homologation ──────────────────────────────────────────
    mTypeAppr, mUNECE,

    // ── Tools / Tool Alpha ────────────────────────────────────────────────
    ms(TL, TL_A, 2,  'Alpha v1.0 Release',     'First production release of Tool Alpha',           'Enable internal teams to go live',               'Feature freeze + packaging',                  'Tool Alpha Team',     d(2,28)),
    ms(TL, TL_A, 6,  'Alpha Training',         'User training roll-out',                           'Ensure adoption across all teams',               'Workshop series + documentation',             'Product Owner',       d(6,30)),
    ms(TL, TL_A, 10, 'Alpha v2.0',             'Major release with new features',                  'Q1+Q2 customer feedback incorporated',           'Agile development + beta test',               'Tool Alpha Team',     d(10,31)),

    // ── Tools / Tool Beta ─────────────────────────────────────────────────
    mBeta,
    ms(TL, TL_B, 5,  'Beta Training',          'Training materials + workshop',                    'Promote self-service usage',                     'E-learning course created',                   'Trainer',             d(5,15)),
    ms(TL, TL_B, 9,  'Beta GA Release',        'General availability of Tool Beta',               'Migrate all teams',                               'Migration guide + support hotline',           'Tool Beta Team',      d(9,30)),

    // ── Tools / Tool Gamma ────────────────────────────────────────────────
    mGamma,
    ms(TL, TL_G, 7,  'Gamma Integration Test', 'Integration with Tool Alpha + Beta',              'Ensure toolchain compatibility',                  'API tests + end-to-end scenarios',            'QA + Tool Team',      d(7,31)),
    ms(TL, TL_G, 11, 'Gamma Prod. Ready',      'Production-ready certification',                  'Clearance for customer projects',                 'Security scan + performance test',            'Gamma Lead',          d(11,30)),

    // ── Release Management / Sprint Planning ──────────────────────────────
    mQ1Kick,
    ms(RM, RM_SP, 4,  'Q2 Sprint Kickoff',     'Sprint planning for Q2',                           'Incorporate Q1 learnings',                       'PI planning session',                         'Scrum Master',        d(4,1)),
    mQ3Kick,
    ms(RM, RM_SP, 10, 'Q4 Sprint Kickoff',     'Sprint planning for Q4',                           'Year-end wrap-up & 2027 roadmap',               'PI planning session',                         'Scrum Master',        d(10,1)),

    // ── Release Management / QA & Testing ────────────────────────────────
    ms(RM, RM_QA, 3,  'Regression Suite',      'Automated regression test suite v1',               'Quality gate for every release',                 'Test case development + CI integration',      'QA Lead',             d(3,31)),
    mSysTest,
    ms(RM, RM_QA, 11, 'Final Acceptance Test', 'Acceptance test for annual release',              'Formal customer sign-off',                       'Test protocol + customer acceptance',         'QA + PM',             d(11,30)),

    // ── Release Management / Sign-off ─────────────────────────────────────
    mFreeze, mRCApproval,

    // ── Release Management / Deployment ───────────────────────────────────
    ms(RM, RM_DE, 5,  'OTA Rollout v1.0',      'First OTA update to vehicle fleet',               'Validate field update process',                  'Staged rollout 10% to 100%',                  'DevOps + Fleet Mgmt', d(5,31)),
    mAnnualRel,
  ]

  const links = [
    // ── BMW ───────────────────────────────────────────────────────────────
    { a: mBMW_ADAS.id, b: mSensorFuse.id  },
    { a: mBMW_ADAS.id, b: mDemoVeh.id    },
    { a: mBMW_ADAS.id, b: mPercept.id    },
    { a: mBMW_ADAS.id, b: mLKA.id        },
    { a: mBMW_ADAS.id, b: mACC.id        },
    { a: mBMW_FW.id,   b: mBMW_ADAS.id  },
    { a: mBMW_FW.id,   b: mAEB.id        },
    { a: mBMW_FW.id,   b: mNCAPComp.id  },
    { a: mBMW_FW.id,   b: mRoadTest.id  },

    // ── Mercedes ──────────────────────────────────────────────────────────
    { a: mMER_POC.id,  b: mLKA.id        },
    { a: mMER_POC.id,  b: mACC.id        },
    { a: mMER_POC.id,  b: mSIL.id        },
    { a: mMER_POC.id,  b: mHiLRig.id    },
    { a: mMER_POC.id,  b: mDemoVeh.id   },
    { a: mMER_DEC.id,  b: mMER_POC.id   },
    { a: mMER_DEC.id,  b: mHiLQ2.id     },
    { a: mMER_DEC.id,  b: mRoadTest.id  },

    // ── VW ────────────────────────────────────────────────────────────────
    { a: mVW_REV.id,   b: mQ3Kick.id    },
    { a: mVW_REV.id,   b: mSysTest.id   },
    { a: mVW_REV.id,   b: mDemoVeh.id   },
    { a: mVW_REV.id,   b: mNCAPComp.id  },

    // ── Stellantis ────────────────────────────────────────────────────────
    { a: mST_INTRO.id, b: mCICD.id      },
    { a: mST_INTRO.id, b: mGateway.id   },
    { a: mST_INTRO.id, b: mQ1Kick.id    },
    { a: mST_WSHOP.id, b: mOTA.id       },
    { a: mST_WSHOP.id, b: mBeta.id      },
    { a: mST_WSHOP.id, b: mIVI.id       },

    // ── Renault ───────────────────────────────────────────────────────────
    { a: mREN_WSHOP.id, b: mBMS.id      },
    { a: mREN_WSHOP.id, b: mTypeAppr.id },
    { a: mREN_WSHOP.id, b: mUNECE.id    },

    // ── Toyota ────────────────────────────────────────────────────────────
    { a: mTOY_PITCH.id, b: mNCAPComp.id },
    { a: mTOY_PITCH.id, b: mAEB.id      },
    { a: mTOY_PITCH.id, b: mSensorFuse.id },
    { a: mTOY_PITCH.id, b: mPercept.id  },

    // ── Bosch ─────────────────────────────────────────────────────────────
    { a: mBSH_MOU.id,  b: mSensorFuse.id },
    { a: mBSH_MOU.id,  b: mHiLRig.id    },
    { a: mBSH_MOU.id,  b: mGamma.id     },

    // ── Continental ───────────────────────────────────────────────────────
    { a: mCON_JDA.id,  b: mBrake.id     },
    { a: mCON_JDA.id,  b: mTorque.id    },
    { a: mCON_JDA.id,  b: mSuspension.id },

    // ── Events ────────────────────────────────────────────────────────────
    { a: mIAA.id,      b: mPreIAA.id    },
    { a: mIAA.id,      b: mDemoV2.id    },
    { a: mIAA.id,      b: mBMW_ADAS.id },
    { a: mIAA.id,      b: mMER_POC.id  },

    // ── Release chain ─────────────────────────────────────────────────────
    { a: mNCAPComp.id, b: mBrake.id     },
    { a: mFreeze.id,   b: mRCApproval.id },
    { a: mRCApproval.id, b: mAnnualRel.id },
  ]

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
    milestones,
    links,
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
  function prevYear() { store.year-- }
  function nextYear() { store.year++ }

  function addSwimlane(name, color) {
    store.swimlanes.push({ id: uid(), name, color, subLanes: [] })
  }
  function updateSwimlane(id, patch) {
    const s = store.swimlanes.find(s => s.id === id)
    if (s) Object.assign(s, patch)
  }
  function deleteSwimlane(id) {
    const msIds = store.milestones.filter(m => m.swimlaneId === id).map(m => m.id)
    store.swimlanes = store.swimlanes.filter(s => s.id !== id)
    store.milestones = store.milestones.filter(m => m.swimlaneId !== id)
    store.links = store.links.filter(l => !msIds.includes(l.a) && !msIds.includes(l.b))
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
    const msIds = store.milestones
      .filter(m => m.swimlaneId === swimlaneId && m.subLaneId === subId)
      .map(m => m.id)
    store.milestones = store.milestones.filter(
      m => !(m.swimlaneId === swimlaneId && m.subLaneId === subId)
    )
    store.links = store.links.filter(l => !msIds.includes(l.a) && !msIds.includes(l.b))
  }

  function addMilestone(data) {
    const m = { id: uid(), ...data }
    store.milestones.push(m)
    return m
  }
  function updateMilestone(id, data) {
    const m = store.milestones.find(m => m.id === id)
    if (m) Object.assign(m, data)
  }
  function deleteMilestone(id) {
    store.milestones = store.milestones.filter(m => m.id !== id)
    store.links = store.links.filter(l => l.a !== id && l.b !== id)
  }

  function addLink(idA, idB) {
    if (idA === idB) return
    const exists = store.links.some(l =>
      (l.a === idA && l.b === idB) || (l.a === idB && l.b === idA)
    )
    if (!exists) store.links.push({ a: idA, b: idB })
  }
  function removeLink(idA, idB) {
    store.links = store.links.filter(l =>
      !((l.a === idA && l.b === idB) || (l.a === idB && l.b === idA))
    )
  }
  function getLinkedIds(id) {
    return new Set(
      store.links
        .filter(l => l.a === id || l.b === id)
        .map(l => l.a === id ? l.b : l.a)
    )
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
    addLink, removeLink, getLinkedIds,
    cellMilestones,
  }
}
