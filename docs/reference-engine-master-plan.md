# Reference Engineering System: Master Product and Implementation Plan

> **For agentic workers:** كل subsystem في هذه الخطة يجب أن يحصل على Implementation Plan منفصل باستخدام TDD، ثم ينفذ task-by-task مع reviewer gate بعد كل deliverable. لا يتم بناء النظام كله في branch واحدة أو batch واحدة.

**Goal:** بناء نظام قابل للتثبيت داخل Coding Agents المختلفة، يحلل موقعًا أو تطبيقًا مرجعيًا، يستخرج منه اتجاه التصميم والسلوك responsive والـinteractions، ثم يعيد تطبيقه داخل مشروع المستخدم بهوية البراند، component-by-component، مع مراجعات آلية صارمة وموافقة المستخدم قبل الانتقال.

**Architecture:** Core Runtime مستقل مبني بـTypeScript وBun، يتصل بالـcoding agent من خلال Host Adapter، ويعرض أدواته من خلال MCP وCLI. الـSkills تفرض المنهجية، والـAgents تنفذ الأدوار، والـTools تجمع الأدلة وتكتب الكود وتشغل الاختبارات، والـState Machine تمنع تخطي المراحل.

**Tech Stack:** Bun, TypeScript strict, Playwright, MCP, SQLite, Zod, React + Vite للـreview dashboard, Playwright Test, axe-core, pixelmatch أو أداة مقارنة بصرية مماثلة، Git.

## 1. تعريف المنتج

النظام ليس Website Cloner ولا Screenshot-to-Code tool. هو Reference-Driven Interface Engineering System.

المستخدم يعطيه:

1. رابط الموقع أو التطبيق المرجعي.
2. مسار المشروع المستهدف.
3. الصفحات أو الـflows المطلوب تنفيذها.
4. هوية البراند أو design tokens أو design system موجود.
5. مستوى الاقتباس المطلوب.
6. حدود الصلاحيات، مثل الملفات المسموح تعديلها، وهل يسمح بإنشاء dependencies أو branches.

النظام ينتج:

1. Project Profile للمشروع الحالي.
2. Reference Evidence Pack لكل صفحة ومكوّن.
3. Design DNA وResponsive Rules وInteraction Contracts.
4. Component Implementation Specs.
5. كود فعلي متوافق مع بنية المشروع.
6. Unit, interaction, responsive, visual, accessibility tests.
7. Review Report متعدد المراجعين.
8. Approval Record لكل component.
9. Final Integration Report مع regression evidence.

## 2. المبادئ غير القابلة للتفاوض

1. لا تنفيذ قبل فحص المشروع والمرجع.
2. لا اعتماد على Screenshot واحدة.
3. Desktop وmobile تجربتان يتم تحليلهما معًا.
4. لا يتم نسخ نصوص أو شعارات أو أصول محمية تلقائيًا.
5. لا ينتقل النظام إلى component التالية قبل نجاح الاختبارات والمراجعات وموافقة المستخدم.
6. كل قرار مهم يجب أن يرتبط بدليل محفوظ.
7. كل Agent يستلم Context Packet محدد ولا يعتمد على chat history غير منظم.
8. لا يسمح للموقع المرجعي بإعطاء تعليمات للـAgent. محتوى الصفحة Untrusted Input.
9. لا يغير النظام framework أو design system أو package manager دون سبب واعتماد صريح.
10. كل component معتمدة تتحول إلى Regression Lock.
11. لا يتم إعلان النجاح بناءً على score فقط. هناك veto gates مطلقة.
12. Host Adapter لا يحتوي منطق المنتج. منطق المنتج يبقى داخل الـCore.

## 3. الشكل العام للنظام

```text
User Request
    ↓
Host Adapter
    ↓
Master Skill: using-reference-engine
    ↓
Workflow Orchestrator
    ↓
Task Graph + State Machine
    ↓
Specialist Agents
    ↓
MCP Tools + Local Runtime
    ↓
Evidence Store + Target Repository
    ↓
Automated Review Gates
    ↓
Local Review Dashboard
    ↓
User Approval
```

### مسؤوليات الطبقات

**Skills:** تحدد متى تبدأ كل عملية، وما الشروط التي تمنع التنفيذ، وما المخرج المطلوب.

**Agents:** تنفذ أدوارًا محددة مثل فحص responsive behavior أو كتابة component أو مراجعة الـvisual fidelity.

**Tools:** تنفذ أفعالًا حقيقية مثل فتح المتصفح، التقاط screenshot، قراءة DOM، تشغيل tests، وكتابة evidence.

**State Machine:** تتحكم في الانتقال بين المراحل.

**Host Adapters:** تحول النظام إلى الشكل الذي يفهمه Codex أو Claude Code أو Cursor أو Gemini CLI.

## 4. استراتيجية التوافق مع Coding Agents

لا نفترض أن كل Host يدعم native sub-agents أو hooks أو skills بنفس الشكل. يتم تصنيف المنصات إلى ثلاث درجات:

### Tier A: Native Orchestration

الـHost يدعم skills أو agents أو workflows وMCP وأوامر قابلة لإعادة الاستخدام. الـAdapter يستخدم capabilities الأصلية، مع بقاء الـCore هو مصدر الحقيقة.

### Tier B: MCP + Rules + Worker Processes

الـHost يدعم MCP وتعليمات دائمة وأوامر، لكنه لا يوفر sub-agents كاملة. الـCore يشغل workers منفصلة عبر CLI أو provider router، ويرسل النتائج للـHost.

### Tier C: Generic Compatibility

الـHost يدعم AGENTS.md أو تعليمات مشروع وتشغيل terminal. يتم تثبيت تعليمات عامة وCLI، وتتم إدارة الـagents داخل الـCore نفسه.

### قاعدة الاستمرارية

الجلسة لا تعتمد على conversation ID. كل ما يلزم للاستمرار يحفظ داخل `.reference-engine/`. يمكن للمستخدم بدء المهمة في Codex ثم متابعتها من Cursor بشرط أن يفتح نفس المشروع ويشغل `reference-engine resume`.

## 5. Monorepo المقترح

```text
reference-engine/
├── apps/
│   ├── cli/
│   └── review-dashboard/
├── packages/
│   ├── contracts/
│   ├── core/
│   ├── state-machine/
│   ├── task-graph/
│   ├── agent-runtime/
│   ├── agent-registry/
│   ├── skills/
│   ├── reviewers/
│   ├── browser-lab/
│   ├── reference-capture/
│   ├── dom-forensics/
│   ├── interaction-recorder/
│   ├── responsive-analysis/
│   ├── design-dna/
│   ├── brand-adapter/
│   ├── visual-diff/
│   ├── evidence-store/
│   ├── mcp-server/
│   ├── project-inspector/
│   ├── test-runtime/
│   ├── security/
│   ├── provider-router/
│   ├── installer/
│   ├── updater/
│   └── host-adapters/
│       ├── codex/
│       ├── claude-code/
│       ├── cursor/
│       ├── gemini-cli/
│       └── generic/
├── fixtures/
│   ├── reference-sites/
│   └── target-apps/
├── evals/
├── docs/
├── examples/
└── scripts/
```

### حدود الملفات

كل package لها public API واضحة من `src/index.ts`. لا يسمح بالـdeep imports بين الحزم. الـcontracts لا تعتمد على أي package أخرى. الـcore يعتمد على interfaces، وليس implementations مباشرة. كل Host Adapter يعتمد على contracts وinstaller فقط.

## 6. Data Contracts الأساسية

### Session

```ts
interface ReferenceSession {
  id: string;
  version: number;
  targetRoot: string;
  referenceUrls: string[];
  host: HostKind;
  mode: ReferenceMode;
  status: SessionStatus;
  currentPageId?: string;
  currentComponentId?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Reference Mode

```ts
type ReferenceMode =
  | "direction"
  | "structure"
  | "high-fidelity"
  | "audit-only";
```

**direction:** يأخذ الروح، التكوين، الإيقاع، والحركة دون تقارب بصري حرفي.

**structure:** يحافظ على تسلسل الأقسام والمنطق responsive مع تطبيق هوية مختلفة.

**high-fidelity:** تقارب بصري وسلوكي مرتفع، ويشترط تأكيد المستخدم أنه يملك حق استخدام المرجع بهذه الدرجة.

**audit-only:** تحليل وإصدار spec دون تعديل المشروع.

### Component Spec

```ts
interface ComponentSpec {
  id: string;
  pageId: string;
  name: string;
  boundaries: ComponentBoundary;
  evidenceIds: string[];
  responsiveContract: ResponsiveContract;
  interactionContract: InteractionContract;
  brandMapping: BrandMapping;
  acceptanceCriteria: AcceptanceCriterion[];
  targetFiles: string[];
  dependencies: string[];
  status: ComponentStatus;
}
```

### Review Result

```ts
interface ReviewResult {
  reviewer: ReviewerKind;
  componentId: string;
  status: "pass" | "fail" | "blocked";
  score?: number;
  vetoes: ReviewVeto[];
  findings: ReviewFinding[];
  evidenceIds: string[];
}
```

### Approval Decision

```ts
interface ApprovalDecision {
  componentId: string;
  decision: "approved" | "changes-requested" | "rejected";
  note?: string;
  approvedEvidenceHash?: string;
  createdAt: string;
}
```

## 7. الـState Machine

```text
CREATED
  ↓
PREFLIGHT
  ↓
PROJECT_PROFILED
  ↓
REFERENCE_AUTHORIZED
  ↓
REFERENCE_CAPTURED
  ↓
PAGE_DECOMPOSED
  ↓
COMPONENT_SPECIFIED
  ↓
IMPLEMENTING
  ↓
AUTOMATED_REVIEW
  ├── NEEDS_REVISION → IMPLEMENTING
  ├── BLOCKED
  └── USER_REVIEW
          ├── CHANGES_REQUESTED → IMPLEMENTING
          ├── REJECTED → COMPONENT_SPECIFIED
          └── APPROVED → LOCKED
                                ↓
                         NEXT_COMPONENT
                                ↓
                       PAGE_INTEGRATION
                                ↓
                       FINAL_VERIFICATION
                                ↓
                            COMPLETE
```

كل transition يمر عبر validator. لا يسمح بتعديل `status` مباشرة من Agent أو Tool.

## 8. الـAgents

### A. Orchestration Agents

**1. Workflow Orchestrator**

يبني task graph، يحدد الترتيب، يختار الـagents، ويتابع الـstate. لا يكتب production code.

**2. Context Curator**

ينشئ Context Packet لكل Agent، ويمنع تمرير history ضخم أو أدلة غير مرتبطة بالمهمة.

**3. Recovery Agent**

يتعامل مع browser crashes، failed installs، stale dev servers، وpartial state، ثم يعيد التشغيل من آخر checkpoint صالح.

### B. Discovery Agents

**4. Project Cartographer**

يفهم framework، routes، styling، tokens، components، tests، package manager، commands، وقيود المشروع.

**5. Reference Scout**

يكتشف الصفحات، الأقسام، navigation paths، الحالات المهمة، والروابط التي يجب فحصها.

**6. DOM and CSS Forensics Agent**

يجمع DOM structure، computed styles، box models، fonts، color usage، spacing، assets، ARIA structure، والـCSS variables المتاحة للمتصفح.

**7. Responsive Analyst**

يقارن viewports ويستنتج قواعد التحول، وليس مجرد قائمة قياسات.

**8. Interaction Archaeologist**

يسجل click, hover, focus, keyboard, scroll, open, close, escape, outside click, touch، وحالات transition.

**9. Motion Analyst**

يقيس duration، easing، sequencing، trigger، reduced-motion behavior، وهل الحركة layout-based أو transform-based.

### C. Design and Planning Agents

**10. Design DNA Extractor**

يستخرج typography scale، spacing rhythm، grid، radius، shadows، color roles، imagery direction، density، hierarchy، وmotion personality.

**11. Brand Interpreter**

يربط Design DNA بهوية المشروع دون نسخ الأصول أو المحتوى.

**12. Component Architect**

يحدد boundaries، state ownership، composition، props، reuse، file locations، وintegration points.

**13. Test Designer**

يكتب behavior contracts، test cases، visual states، accessibility cases، وregression coverage قبل التنفيذ.

### D. Implementation Agents

**14. Component Builder**

ينفذ component واحدة فقط وفق spec مع minimal diff واحترام بنية المشروع.

**15. Responsive Builder**

يعمل على layout transformations عندما تكون معقدة أو منفصلة عن implementation الأساسية.

**16. Interaction Builder**

ينفذ interaction state machines، keyboard support، motion، focus management، والـback behavior.

**17. Integration Builder**

يربط الـcomponent بالصفحة، routes، data، وexisting design system.

### E. Review Agents

**18. Visual Fidelity Reviewer**

يقارن geometry، hierarchy، proportions، spacing، typography، visual weight، وstates.

**19. Responsive Reviewer**

يراجع التحولات بين viewports ويبحث عن overflow، layout collapse، وdesktop-only assumptions.

**20. Interaction Reviewer**

يعيد تشغيل السلوك المسجل ويقارن النتيجة.

**21. Accessibility Reviewer**

يراجع semantics، keyboard، focus، labels، contrast، reduced motion، وtouch targets.

**22. Code Architecture Reviewer**

يرفض duplication، giant components، hardcoded patches، side effects غير الضرورية، وكسر conventions المشروع.

**23. Performance Reviewer**

يراجع asset weight، unnecessary client rendering، layout shifts، long tasks، وnetwork regressions.

**24. Brand Fidelity Reviewer**

يتأكد أن النتيجة تنتمي لهوية المشروع وليست نسخة بصرية من المرجع.

**25. Taste Director**

يراجع التكوين كـArt Director: balance، hierarchy، rhythm، restraint، typography presence، image treatment، وجود AI UI slop.

**26. Adversarial Reviewer**

يحاول إثبات أن العمل غير جاهز، ويبحث عن الحالات غير المفحوصة والتخمينات والاختصارات.

**27. Regression Guardian**

يعيد تشغيل components المعتمدة بعد كل تغيير لاحق ويمنع كسرها.

## 9. الـSkills

1. `using-reference-engine`
2. `installing-reference-engine`
3. `project-discovery`
4. `reference-authorization`
5. `reference-security`
6. `reference-reconnaissance`
7. `responsive-forensics`
8. `interaction-forensics`
9. `motion-forensics`
10. `design-dna-extraction`
11. `brand-adaptation`
12. `component-decomposition`
13. `component-specification`
14. `reference-driven-development`
15. `visual-verification`
16. `behavior-verification`
17. `accessibility-verification`
18. `taste-review`
19. `adversarial-review`
20. `user-approval`
21. `regression-locking`
22. `page-integration`
23. `completion-verification`
24. `systematic-recovery`

### Master Skill: using-reference-engine

هذه Skill تعمل أولًا عند وجود رابط أو screenshot أو تطبيق مرجعي. تمنع التنفيذ المباشر، وتختار الـworkflow المناسب، وتتحقق من وجود النظام والـstate.

### قواعد Skill format

كل Skill تحتوي على:

1. Trigger conditions.
2. Inputs المطلوبة.
3. Required tools.
4. Forbidden actions.
5. Ordered checklist.
6. Output schema.
7. Hard gates.
8. Failure and recovery rules.
9. Next allowed skills.
10. Examples and anti-patterns.

## 10. MCP Tool Surface

### Browser Tools

```text
browser.launch
browser.open_reference
browser.open_target
browser.create_context
browser.set_viewport
browser.snapshot
browser.screenshot
browser.inspect_element
browser.computed_styles
browser.box_model
browser.list_interactives
browser.perform_action
browser.record_trace
browser.stop_trace
browser.collect_console
browser.collect_network
browser.collect_assets
browser.close
```

### Reference Tools

```text
reference.create_map
reference.capture_state
reference.detect_sections
reference.extract_tokens
reference.extract_breakpoints
reference.record_interaction
reference.save_evidence
```

### Project Tools

```text
project.inspect
project.read_conventions
project.detect_commands
project.start_dev_server
project.stop_dev_server
project.run_test
project.run_build
project.read_diff
project.write_patch
project.restore_checkpoint
```

### Visual Tools

```text
visual.compare
visual.compare_element
visual.measure_geometry
visual.create_overlay
visual.create_heatmap
visual.score
visual.mask_dynamic_region
visual.generate_contact_sheet
```

### Workflow Tools

```text
session.create
session.resume
session.status
state.transition
state.checkpoint
task.dispatch
task.complete
task.fail
review.submit
approval.request
approval.record
```

كل Tool ترجع structured data صغيرة مع paths للأدلة الثقيلة. لا يتم إرجاع screenshots أو DOM dumps كبيرة داخل model context دون حاجة.

## 11. Evidence Store

```text
.reference-engine/
├── config.json
├── session.json
├── project-profile.json
├── brand-profile.json
├── task-graph.json
├── state/
├── specs/
├── evidence/
│   ├── pages/
│   ├── components/
│   ├── dom/
│   ├── styles/
│   ├── interactions/
│   ├── traces/
│   └── network/
├── screenshots/
│   ├── reference/
│   ├── target/
│   └── diffs/
├── reviews/
├── approvals/
├── locks/
├── reports/
└── logs/
```

كل artifact لها metadata تشمل source، viewport، timestamp، hash، session version، وما إذا كانت reference أو target.

## 12. Browser Capture Protocol

### Viewport Matrix الافتراضية

1. Desktop Large: 1440 × 900
2. Desktop Standard: 1280 × 800
3. Tablet Landscape: 1024 × 768
4. Tablet Portrait: 768 × 1024
5. Mobile Standard: 390 × 844
6. Mobile Small: 360 × 800

يمكن تعديلها من config.

### الحالات التي يتم التقاطها لكل Component

1. Default.
2. Hover.
3. Focus-visible.
4. Active أو pressed.
5. Open.
6. Scrolled أو sticky.
7. Loading عند وجودها.
8. Empty أو error عند وجودها.
9. Reduced motion.
10. RTL عند دعم المشروع له.

### Dynamic Content Handling

1. تثبيت الوقت والـtimezone قدر الإمكان.
2. إخفاء ads، timestamps، rotating banners، وpersonalized content من المقارنة عند عدم ارتباطها بالتصميم.
3. انتظار fonts والصور والـanimations قبل capture.
4. حفظ mask definitions داخل evidence بدل تغيير المرجع.
5. تشغيل capture مرتين للتأكد من stability.

## 13. Design DNA Model

يخرج النظام ملفًا منظمًا يحتوي على:

```ts
interface DesignDNA {
  typography: TypographySystem;
  spacing: SpacingSystem;
  grids: GridSystem[];
  colorRoles: ColorRole[];
  radii: RadiusScale;
  shadows: ShadowSystem;
  borders: BorderSystem;
  imagery: ImageryDirection;
  iconography: IconDirection;
  density: DensityProfile;
  hierarchy: HierarchyRules;
  motion: MotionSystem;
  responsive: ResponsiveStrategy;
  compositionPatterns: CompositionPattern[];
}
```

لا يتم نقل values حرفيًا إلى المشروع. Brand Interpreter ينتج Mapping Plan يوضح:

1. ما الذي يبقى كما هو لأنه layout logic.
2. ما الذي يتغير بسبب الهوية.
3. ما الذي يجب إعادة تصميمه لأن المرجع يعتمد على أصل محمي.
4. ما الذي لا يناسب المشروع أو المحتوى.

## 14. Component Build Loop

### الخطوة 1: Select

الـOrchestrator يختار component واحدة بناءً على dependencies والـpage order.

### الخطوة 2: Inspect

يتم جمع Evidence Pack مخصص لها فقط.

### الخطوة 3: Specify

Component Architect وTest Designer ينتجان spec وacceptance criteria.

### الخطوة 4: Build

Builder يكتب failing tests أو contract tests أولًا، ثم minimal implementation.

### الخطوة 5: Local Verification

تشغيل typecheck، unit tests، component tests، interaction tests، visual captures، وbuild check المناسبين للمشروع.

### الخطوة 6: Specialist Reviews

كل Reviewer يصدر pass أو fail مع evidence وفinding severity.

### الخطوة 7: Revision Loop

يتم دمج findings حسب السبب، ثم يعاد التنفيذ دون إعادة كتابة component بالكامل.

### الخطوة 8: User Review

Dashboard تعرض المرجع والتنفيذ والتقارير.

### الخطوة 9: Lock

بعد الموافقة يتم حفظ baseline، approval hash، tests، وcomponent lock.

### الخطوة 10: Continue

لا يبدأ الجزء التالي إلا بعد نجاح lock.

## 15. Review Scoring and Vetoes

### Weighted Score

1. Visual geometry and hierarchy: 25
2. Responsive behavior: 20
3. Interaction fidelity: 15
4. Typography and visual treatment: 10
5. Brand adaptation: 10
6. Accessibility: 8
7. Code architecture: 7
8. Performance: 5

الحد الافتراضي للعرض على المستخدم: 90 من 100.

### Veto Conditions

الـscore لا يلغي الـveto. يتم رفض العمل تلقائيًا عند وجود أي مما يلي:

1. Missing required state.
2. Broken keyboard navigation.
3. Failed test أو build.
4. Layout overflow في viewport مطلوبة.
5. استخدام أصل غير مصرح به.
6. Hardcoded screenshot reconstruction أو absolute positioning غير مبرر.
7. تغييرات خارج component scope دون اعتماد.
8. regression في component معتمدة.
9. اختلاف واضح في mobile composition.
10. Reviewer استخدم تخمينًا دون evidence.
11. console error جديد.
12. accessibility blocker.

## 16. Local Review Dashboard

### الشاشة الرئيسية

1. Session status.
2. Page map.
3. Component queue.
4. Current reviewer results.
5. Blockers.
6. Changed files.
7. Test results.

### Component Review Screen

1. Reference screenshot.
2. Target screenshot.
3. Side-by-side view.
4. Overlay slider.
5. Diff heatmap.
6. Viewport switcher.
7. Interaction replay.
8. Reviewer findings.
9. Code diff summary.
10. Approve.
11. Request changes.
12. Reject direction.
13. Reinspect reference.

### Approval behavior

الموافقة تحفظ في file، وليست message داخل chat فقط. Request changes تنشئ structured feedback تربط كل ملاحظة بالviewport أو element أو timestamp.

## 17. CLI and User Commands

### Installation

```bash
bunx @reference-engine/cli install
```

### Project Setup

```bash
reference-engine init
reference-engine doctor
```

### Start a Session

```bash
reference-engine start https://example.com --page / --mode structure
```

### Session Operations

```bash
reference-engine status
reference-engine resume
reference-engine dashboard
reference-engine inspect
reference-engine review navbar
reference-engine approve navbar
reference-engine reject navbar --reason "mobile drawer spacing"
reference-engine export
```

### Maintenance

```bash
reference-engine update
reference-engine rollback
reference-engine uninstall
```

### Host Commands

كل Adapter يولد slash commands مكافئة مثل:

```text
/reference:start
/reference:status
/reference:review
/reference:approve
/reference:resume
```

## 18. Installation System

### Host Detection

الـinstaller يبحث عن:

1. Codex configuration.
2. Claude Code configuration.
3. Cursor configuration.
4. Gemini CLI configuration.
5. AGENTS.md compatible environment.

إذا وجد أكثر من Host، يعرضها ويثبت adapters المطلوبة أو يستخدم `--host all`.

### Installation Steps

1. Verify Bun and Git.
2. Detect OS and architecture.
3. Install CLI and Core Runtime.
4. Register local MCP server.
5. Install Chromium browser initially.
6. Install skills and commands.
7. Install host-specific instructions.
8. Create shared cache directory.
9. Run browser smoke test.
10. Run MCP handshake test.
11. Run host adapter validation.
12. Print health report.

### Safety

1. لا يكتب فوق ملفات host موجودة دون merge أو backup.
2. كل تعديل config له rollback manifest.
3. secrets لا تحفظ داخل project files.
4. التثبيت project-scoped افتراضيًا، مع user-scope اختياري.
5. لا يتم تفعيل auto-approval للأدوات الحساسة تلقائيًا.

## 19. Host Adapters

### Codex Adapter

ينتج Plugin يضم skills، commands، وMCP configuration. يستخدم Plugin كواجهة توزيع، بينما runtime محلي مستقل.

### Claude Code Adapter

ينتج skills أو commands وتعليمات مشروع، يسجل MCP، ويستخدم native sub-agents عندما تكون متاحة. عند عدم توافرها يستخدم worker orchestration داخل الـCore.

### Cursor Adapter

ينتج `.cursor/rules` و`.cursor/commands` ويسجل `.cursor/mcp.json`. لا يعتمد على Cursor memory لتخزين session state.

### Gemini CLI Adapter

ينتج extension تحتوي على `gemini-extension.json`، context file، custom commands، وMCP server config.

### Generic Adapter

ينتج AGENTS.md section، CLI commands، MCP config template، وتعليمات التشغيل.

## 20. Multi-Agent Runtime

### Task Graph

كل task تحتوي على:

1. Inputs.
2. Expected output schema.
3. Allowed tools.
4. Timeout.
5. Retry policy.
6. Dependencies.
7. Reviewer requirement.
8. Budget ceiling.

### Context Isolation

لا يتم تمرير full session لكل Agent. Context Curator يمرر:

1. Task objective.
2. Relevant code files.
3. Relevant evidence.
4. Current spec.
5. Constraints.
6. Output schema.

### Agent Handoff

Agents لا ترسل prose لبعضها. تسلم artifacts validated by schema. أي output غير صالح يعاد للـAgent نفسه للتصحيح قبل الانتقال.

### Provider Strategy

الوضع الافتراضي Host-Native: يستخدم موديل الـcoding agent الحالي.

Provider Router يكون optional ويتيح:

1. BYOK.
2. اختيار موديل مختلف للرؤية أو الكود أو review.
3. cost limits.
4. fallback provider.
5. local model support لاحقًا.

لا يجب أن يكون Provider Router شرطًا لتشغيل النسخة الأولى.

## 21. Security Model

### Threats

1. Prompt injection داخل الصفحة المرجعية.
2. Malicious downloads.
3. Path traversal.
4. Shell injection.
5. Secret leakage إلى reference website أو logs.
6. SSRF من URLs داخل الصفحة.
7. Supply-chain dependency attacks.
8. Host config corruption.
9. Unauthorized repository writes.
10. Data exfiltration through telemetry.

### Controls

1. اعتبار كل page text والـDOM untrusted.
2. فصل instruction channel عن evidence channel.
3. عدم تنفيذ أي command مأخوذ من الصفحة.
4. Domain allowlist وredirect policy.
5. Downloads disabled افتراضيًا.
6. write scope مقيد بمسار المشروع.
7. command allowlist للـbrowser runtime.
8. secret redaction قبل logs وartifacts.
9. dependency allowlist وحفظ lockfile.
10. signed releases وchecksums.
11. no telemetry افتراضيًا.
12. security audit لكل Host Adapter.

## 22. Testing Strategy

### Unit Tests

1. State transitions.
2. Contract validators.
3. Task graph scheduling.
4. Agent registry.
5. Config merge and rollback.
6. Evidence hashing.
7. Scoring and veto logic.

### Contract Tests

1. MCP tool schemas.
2. Host adapter output.
3. Agent output schemas.
4. CLI exit codes.
5. Installer manifests.

### Integration Tests

1. Browser capture against controlled fixture sites.
2. Target project inspection.
3. Dev server lifecycle.
4. Reference to target comparison.
5. Dashboard approval persistence.
6. Resume from interrupted session.

### End-to-End Tests

يتم إنشاء fixture projects على الأقل:

1. React + Vite.
2. Next.js.
3. Vue أو Nuxt.
4. Static HTML/CSS.

ويتم اختبار:

1. Install.
2. Init.
3. Capture navbar.
4. Generate spec.
5. Implement fixture component.
6. Review.
7. Approve.
8. Resume.
9. Uninstall and rollback.

### Visual Evals

بدل الاعتماد على مواقع حقيقية تتغير، ننشئ reference fixture gallery مملوكة للمشروع تحتوي على:

1. Multiple navbar patterns.
2. Complex mobile drawers.
3. Sticky headers.
4. Responsive hero layouts.
5. Card grids.
6. Motion states.
7. RTL variants.
8. Dynamic content cases.

### Security Tests

1. Prompt injection pages.
2. Malicious links.
3. Path traversal tool calls.
4. Secret strings in DOM.
5. Dependency tampering.
6. Config collision.
7. MCP tool argument injection.

## 23. Observability and Reports

كل session توفر:

1. Structured event log.
2. Task timeline.
3. Tool-call counts.
4. Agent retries.
5. Test durations.
6. Visual scores over iterations.
7. Cost estimate عند استخدام provider router.
8. Artifact disk usage.
9. Failure reason taxonomy.

لا يتم تسجيل source code أو screenshots خارج الجهاز إلا عند تفعيل cloud sync صراحة.

## 24. Distribution and Marketplace

### Distribution Channels

1. NPM package للـCLI.
2. GitHub Releases مع checksums.
3. Codex Plugin package.
4. Claude-compatible package أو marketplace format.
5. Cursor installer preset.
6. Gemini CLI Extension.
7. Generic Skills package.

### Versioning

1. Core Runtime semantic versioning.
2. Adapter compatibility matrix.
3. Manifest version مستقلة.
4. Automatic migration للـstate files.
5. Rollback إلى آخر إصدار صالح.

### Release Rings

1. Internal.
2. Alpha testers.
3. Public beta.
4. Stable.

كل ring لها update channel منفصلة.

## 25. Cloud Layer اللاحقة

الـCore يجب أن يعمل Local-First بالكامل. Cloud Layer تضاف لاحقًا دون تغيير workflow.

### Cloud Features

1. Remote browser workers.
2. Sandboxed repository execution.
3. Team project sessions.
4. Shared Design DNA library.
5. Central approval dashboard.
6. Run history.
7. Team policies.
8. Usage and billing.
9. Marketplace profiles.
10. Cloud provider router.

### ما لا يتم رفعه افتراضيًا

1. Source code.
2. screenshots.
3. credentials.
4. page content.
5. browser traces.

كل نوع بيانات له opt-in واضح وسياسة retention.

## 26. Implementation Program

هذه المنظومة كبيرة، لذلك تنفذ في ثمانية Plans مستقلة. كل Plan ينتج software قابلة للاختبار والاستخدام.

### Plan 1: Contracts, State Machine, and CLI Skeleton

**Deliverables:** monorepo، contracts، state machine، session store، CLI init/status/resume، config، unit tests.

**Exit Criteria:** يمكن إنشاء session، حفظها، إغلاق CLI، ثم استكمالها دون browser أو Agents.

### Plan 2: Browser Evidence Lab

**Deliverables:** Playwright lifecycle، viewport matrix، screenshots، DOM snapshots، computed styles، traces، network evidence، MCP browser tools.

**Exit Criteria:** رابط fixture ينتج Evidence Pack ثابتًا في desktop وmobile، ويمكن إعادة تشغيل capture بنفس النتائج ضمن tolerance.

### Plan 3: Reference Analysis and Design DNA

**Deliverables:** section detection، interaction recording، responsive inference، design tokens، Design DNA schema، brand mapping draft.

**Exit Criteria:** fixture page تتحول إلى page map وcomponent evidence وDesign DNA قابلة للمراجعة.

### Plan 4: Agent Runtime and Skills

**Deliverables:** agent registry، task graph، context packets، output validation، retries، master skill، discovery skills، review skills.

**Exit Criteria:** تشغيل multi-step analysis مع workers وهمية وحقيقية، مع منع تخطي hard gates.

### Plan 5: Component Build and Review Loop

**Deliverables:** component spec generator، test designer، builder interface، reviewers، scoring، vetoes، regression lock.

**Exit Criteria:** Navbar fixture تمر بدورة inspect, specify, implement, review, revise, lock بنجاح.

### Plan 6: Review Dashboard and Approval

**Deliverables:** local server، React dashboard، side-by-side، overlay، diff، review findings، approval persistence، request changes.

**Exit Criteria:** المستخدم يستطيع اعتماد component، ويمنع الـstate machine الانتقال قبل القرار.

### Plan 7: Installer and Host Adapters

**Deliverables:** installer، doctor، rollback، Codex adapter، Claude adapter، Cursor adapter، Gemini adapter، generic adapter.

**Exit Criteria:** clean-machine tests تثبت وتزيل النظام دون إفساد config، وكل Host يرى commands وMCP tools المطلوبة.

### Plan 8: Security, Evals, Release, and Marketplace

**Deliverables:** threat controls، security tests، fixture gallery، CI matrix، signed releases، docs، compatibility matrix، beta channel.

**Exit Criteria:** passing security suite، repeatable releases، installation docs، وpublic beta package.

## 27. ترتيب التنفيذ

```text
Plan 1
  ↓
Plan 2
  ↓
Plan 3
  ↓
Plan 4
  ↓
Plan 5
  ↓
Plan 6
  ↓
Plan 7
  ↓
Plan 8
```

يمكن بدء بعض أجزاء Plan 7 بعد استقرار contracts في Plan 1، لكن لا يتم إعلان adapter جاهزًا قبل اكتمال Build Loop.

## 28. أول Vertical Slice

أول نسخة حقيقية لا تكون مجرد CLI demo. يجب أن تنفذ Navbar end-to-end:

1. تثبيت النظام على Codex أو Claude Code.
2. إعطاؤه reference URL وtarget repo.
3. فحص المشروع.
4. التقاط desktop وmobile navbar.
5. اكتشاف sticky وdrawer states.
6. إنتاج component spec.
7. كتابة tests.
8. تنفيذ navbar بهوية المشروع.
9. تشغيل visual وinteraction reviews.
10. عرض dashboard.
11. اعتماد المستخدم.
12. حفظ regression lock.
13. إغلاق session واستكمالها لاحقًا.

إذا لم تعمل هذه الرحلة كاملة، فلا قيمة لإضافة مزيد من الـagents أو الصفحات.

## 29. Definition of Done للنظام الكامل

يعتبر النظام جاهزًا للإطلاق المستقر عندما:

1. يتم تثبيته وإزالته بأمان على الأنظمة المدعومة.
2. يستطيع تحليل desktop وmobile reference دون تدخل يدوي في الحالات المعتادة.
3. يستطيع إكمال صفحة حقيقية component-by-component.
4. كل component تمر بمراجعات آلية وموافقة محفوظة.
5. يمكن استكمال الجلسة بعد restart أو تغيير Host.
6. لا ينجح أي build مع failed tests أو veto مفتوح.
7. لا ينسخ assets أو content غير مصرح به تلقائيًا.
8. reference prompt injection suite تمر بالكامل.
9. visual results قابلة للتكرار في بيئة ثابتة.
10. adapters لا تحتوي fork خاص من منطق الـCore.
11. docs تشرح installation، concepts، modes، permissions، troubleshooting، وuninstall.
12. كل release قابلة للتحقق والrollback.

## 30. قرارات تنفيذية معتمدة

1. Bun هو runtime الأساسي.
2. TypeScript strict في كل packages.
3. Local-First قبل Cloud.
4. MCP هو tool protocol المشترك.
5. SQLite هو state store المحلي الأول.
6. Playwright هو browser runtime الأول.
7. Chromium يثبت افتراضيًا، والمتصفحات الأخرى اختيارية في البداية.
8. Host-native model هو الوضع الافتراضي.
9. Provider Router optional وليس dependency أساسية.
10. Dashboard محلية، ولا تعتمد على SaaS.
11. Component approval إلزامية افتراضيًا، ويمكن تفعيل page-level approval فقط من config للمستخدمين المتقدمين.
12. High-fidelity mode يحتاج explicit authorization.
13. لا يتم استخدام scores وحدها لاتخاذ قرار النجاح.
14. كل Plan تنفذ في branch أو worktree مستقلة مع commits صغيرة قابلة للمراجعة.

## 31. أول Backlog بعد إنشاء الريبو

1. Initialize Bun monorepo and shared TypeScript config.
2. Add contracts package with session and component schemas.
3. Add state-machine package with transition tests.
4. Add SQLite evidence and session store.
5. Add CLI `init`, `doctor`, `status`, `resume`.
6. Add Playwright browser lifecycle package.
7. Add deterministic viewport capture.
8. Add DOM, style, and asset evidence capture.
9. Add MCP server with browser tools.
10. Add fixture reference navbar site.
11. Add fixture target React app.
12. Add responsive and interaction evidence schemas.
13. Add design DNA extractor baseline.
14. Add task graph and agent registry.
15. Add first four skills: using, project discovery, reference recon, component specification.
16. Add component spec generator for navbar.
17. Add interaction test generator.
18. Add visual comparison and scoring.
19. Add reviewer result and veto engine.
20. Add local dashboard shell.
21. Add approval persistence.
22. Add regression lock.
23. Add Codex adapter.
24. Add Claude Code adapter.
25. Add installer rollback manifest.
26. Complete first end-to-end navbar run.

## 32. النتيجة المقصودة

بعد اكتمال النظام، تجربة المستخدم يجب أن تكون بهذا القدر من البساطة:

```text
/reference:start https://reference-site.com

Target: current repository
Mode: structure
Brand: use existing design system
Start with: homepage
```

ثم النظام يتولى الفحص، التخطيط، البناء، المراجعة، والعرض. المستخدم يتدخل عند القرارات التي تحتاج ذوقًا أو صلاحية أو اعتمادًا، وليس لإدارة الأدوات والـagents يدويًا.
