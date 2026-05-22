# 中研前端重构计划

## 1. 背景与目标

本计划依据 `后端服务发布API文档.md` 与 `重构计划v0.1.md` 制定。后端能力将收敛到 `/v2` 下的 `Mission -> Task -> Command/Event -> Asset` 主线，并通过 Telemetry、Realtime、Agent、Config Center 等模块提供实时任务、遥测、资产和审批能力。前端也应同步从“历史管理后台 + 大屏拼接页面”调整为“以 Mars3D 三维地图为中心的任务控制界面”。

本次前端重构目标：

- 删除原先几乎所有后台管理、表单管理、历史遗留页面和重复业务逻辑。
- 只保留 Mars3D/Cesium 相关地图底座、图层展示、无人机展示、轨迹/锥体/贴图等核心面板能力。
- 重新设计整体界面和触控逻辑，优先把用户操作路径、地图交互和面板关系定清楚。
- 后续再逐步补齐 API、Pinia 状态、SSE 实时流、资产贴图、任务控制和 Agent 辅助逻辑。
- 保持文件数量克制，结构清晰，便于 review；避免把一个功能拆成大量小文件导致阅读困难。
- 优先使用 Vue 3、Vite、Pinia、Element Plus、Mars3D、SSE、Web Worker 等当前技术，不引入过时或沉重方案。

## 2. 重构边界

### 2.1 保留内容

保留并清理以下能力：

- `src/views/bigScreen` 中与 Mars3D 地图底座、大屏主界面和地图展示直接相关的代码。
- `src/components/MarsWork` 与 `src/components/map` 中仍被地图底座、图层、无人机展示使用的组件。
- `src/utils/map` 及 Mars3D、Cesium、坐标转换、图层管理相关工具。
- `src/api` 中后续可迁移为 `/v2` 新接口的请求封装模式。
- Pinia、Vue Router、Element Plus、Vite、Mars3D 插件配置。

### 2.2 删除内容

计划删除或废弃以下内容：

- 传统后台管理页面、系统管理页面、监控页面、工具页面、字典/角色/菜单等与新任务平台无关的功能。
- 老接口直接散落在 Vue 页面里的业务调用。
- 页面级 `setInterval` 轮询逻辑，后续用 SSE 推送和 Pinia 状态归并替代。
- 与 Mars3D 主流程无关的图表、富文本、上传、表格工具组件，除非明确被新界面复用。
- 现有流程控制面板及其旧业务代码，例如 `processControlView.vue` 中采集、处理、传输、演示流程的页面内实现；后续任务控制按 `/v2` TaskCommand 重新建设。
- 大量一次性演示数据和硬编码区域分支，迁移到统一场景配置或后端 Mission/Asset 数据。

### 2.3 暂缓内容

以下内容不在第一轮重构里深做，只预留入口：

- Agent 完整对话和 RAG 交互。
- 复杂配置中心编辑器。
- 图层发布审批全流程。
- 报告生成器。
- 大规模权限管理界面。

### 2.4 第一轮交付边界

第一轮不是完整业务闭环，而是把旧后台应用切换成新的 Mars3D 任务平台骨架，并为后续真实业务接入留下干净位置。第一轮覆盖原计划 PR 1-3 的核心能力，但实际交付拆成 4 个更清晰的 PR。

第一轮必须完成：

- 主屏 UI 壳与关键交互状态：顶部任务栏、左侧 Mission 态势、右侧 Command/Asset/Telemetry 面板切换、底部事件条，以及 `activePanel`、`selectedMapObject`、`interactionMode` 等基础状态。
- 空、加载中、运行中、失败、待审批等 mock 状态表达，确保第一版可以完整走查界面行为。
- 旧入口、明显旧后台页面、明显无关组件和旧接口封装清理；旧接口基本不保留兼容，统一替换为新的 `/v2` API 层。
- 新增 `src/api/platform.js`，集中封装 `/v2` Mission、Task、TaskCommand、Asset、Telemetry、Realtime、Approval 等接口。
- 建立 mock ViewModel 与宽松 adapter：页面只消费标准 ViewModel，adapter 内允许后端字段短期变化，但字段兼容逻辑不得散落到 Vue 组件。
- 建立 Pinia 主状态骨架，收敛 Mission、Task、Asset、Telemetry、Command 和 UI 状态。
- 保留最小登录和现有 token 流程，只把登录后的默认落点切到 Mars3D 主屏，不重建权限体系。
- 保留 Mars3D 初始化、地图底座和可用图层能力，删除 `processControlView.vue` 等页面内旧采集、处理、传输流程控制逻辑。
- 视觉资源跟随新设计清理：可以删除旧大屏装饰背景、边框图、无用动态图和过时视觉素材，但地图、模型、底图、字体等业务重资产必须先确认引用关系。
- `AgentPanel` 第一轮只保留未来入口，默认放在更多菜单里，不进入右侧主面板切换位，不接真实 Agent 服务。

第一轮明确不做：

- 不深接 SSE 实时流，只保留 API 和状态设计入口。
- 不完成 TaskCommand、审批、资产发布、图层发布等真实业务全流程。
- 不做 Agent 完整对话、RAG 或工具执行。
- 不重建完整 Mars3D 图层管理体系，`layerManager.js` 可以保留为后续设计目标。
- 不大规模重建登录、角色、菜单、权限管理体系。
- 不追求 Mission/Task/Asset 的真实全链路联调，第一轮以 mock ViewModel 和界面状态走查为准。

旧依赖处理规则：

- 如果旧后台模块被新主屏间接依赖，优先抽出最小公共依赖，例如工具函数、样式变量、请求拦截、字典映射，再删除旧模块主体。
- 不允许为了删除而破坏 Mars3D 主屏启动。
- 不允许让旧后台页面、旧菜单体系或旧接口调用继续绑定新主屏。

第一轮视觉目标：

- 主气质是专业可信的工业级任务指挥舱，像飞控、测绘、应急调度工具。
- 允许在顶部任务栏、面板角标、状态脉冲、地图对象选中态上加入少量科技视觉冲击。
- 避免满屏发光边框、过度赛博渐变、装饰压过地图和不可读的小字堆叠。

第一轮验收方式：

- `pnpm build:prod` 必须通过。
- 本地服务必须能启动，登录后能进入 Mars3D 主屏。
- 浏览器走查顶部栏、左右面板、底部事件条、面板切换和 mock 状态切换。
- 检查地图不被关键面板遮挡，控制台无明显运行错误。
- 至少覆盖 1920x1080、1366px 宽度和触控/窄屏三类界面状态。

## 3. 目标前端结构

文件结构以“少而清楚”为原则。第一阶段建议控制在以下范围内：

```text
src/
  api/
    platform.js          # /v2 任务、资产、遥测、审批、实时入口的统一请求封装
  store/
    modules/
      platform.js        # Mission/Task/Asset/Telemetry/Realtime 的主状态
  views/
    bigScreen/
      index.vue          # Mars3D 主地图与全局布局
      components/
        PanelShell.vue   # 大面板统一外壳，承载标题、状态、折叠、拖拽与插槽
        CommandPanel.vue # 任务控制、审批、运行按钮
        MissionPanel.vue # Mission 和 Task 摘要
        AssetPanel.vue   # 资产、图层、贴图列表
        TelemetryPanel.vue # 无人机遥测、航线、在线状态
  utils/
    map/
      layerManager.js    # 图层增删改查、层级、清理
      telemetry.js       # 遥测点、轨迹、航向、模型朝向转换
      sseClient.js       # SSE 连接、重连、关闭
  workers/
    geo.worker.js        # 大量坐标、轨迹、贴图边界计算
```

说明：

- 不强制一次性迁移为 TypeScript，但 `platform.js` 中要用 JSDoc 写清接口结构，便于后续平滑改造。
- 不按每个接口拆一个文件，先用一个 `platform.js` 聚合新后端主链路，减少跳转成本。
- 面板组件最多按“控制、任务、资产、遥测”四类拆分，避免细碎组件泛滥。
- Mars3D 实例、图层实例、SSE 连接这类非序列化对象不要直接塞满 Pinia，Pinia 只保存业务状态和轻量引用 key。

## 4. 界面设计优先方案

### Step 1：设计主屏布局

目标：先把主界面信息架构稳定下来，再动业务逻辑。

怎么做：

1. `src/views/bigScreen/index.vue` 作为唯一主入口，首屏即 Mars3D 地图，不再进入传统后台首页。
2. 地图全屏铺底，所有业务面板浮在地图之上，面板默认收起，避免遮挡地图观察。
3. 顶部保留一条薄工具栏：任务选择、场景选择、连接状态、全屏、图层开关。
4. 左侧是 Mission/Task 摘要面板，展示当前任务、状态、进度、关键事件。
5. 右侧是 Command/Asset/Telemetry 三个互斥抽屉，通过图标按钮切换，不同时展开多个大面板。
6. 底部是时间线和告警条，默认只显示最近关键事件，详情点击展开。

验收标准：

- 在 1920x1080 和常见笔记本分辨率下，地图始终是视觉主体。
- 任何面板展开后都不能遮住关键控制按钮。
- 面板之间没有重复入口，同一类操作只出现一次。

### Step 2：设计触控与鼠标逻辑

目标：先统一地图手势、面板手势、任务操作手势，避免后续功能叠加后交互打架。

怎么做：

1. 地图区域：
   - 单击：选中地图对象，如无人机、资产贴图、任务区域。
   - 双击：飞到对象视角。
   - 右键或长按：打开对象操作菜单。
   - 滚轮/双指：地图缩放。
   - 拖拽：地图平移或旋转，面板不得截获地图拖拽。
2. 面板区域：
   - 点击图标展开，点击同一图标收起。
   - 面板内部滚动只影响面板，不影响地图缩放。
   - 高风险按钮统一二次确认，不直接执行。
3. 移动或触控屏：
   - 底部工具栏常驻。
   - 左右面板改为底部抽屉。
   - 长按地图对象打开操作菜单。

落实方式：

- 在 `index.vue` 中建立 `activePanel`、`selectedMapObject`、`interactionMode` 三个基础状态。
- 所有子面板只通过事件改变这三个状态，不直接操作彼此 DOM。
- Mars3D 的 click、dblclick、contextmenu 事件统一在地图入口注册，并转成业务事件写入 Pinia。

验收标准：

- 触控屏和鼠标操作规则一致。
- 面板滚动不会误触地图。
- 高风险命令不会因为误触直接提交。

### Step 3：设计视觉规范

目标：让重构后的前端干净、克制、可长期维护。

怎么做：

1. 保留深色大屏风格，但降低装饰性边框和重复发光效果。
2. 面板统一 8px 以内圆角、统一间距、统一标题栏高度。
3. 状态色固定：
   - `RUNNING` 使用蓝色。
   - `COMPLETED` 使用绿色。
   - `WAITING_APPROVAL` 使用橙色。
   - `FAILED/TIMEOUT` 使用红色。
   - `CANCELLED` 使用灰色。
4. 按钮只表达动作，状态用 Tag 或进度条表达。
5. 图层、资产、任务列表使用紧凑行，不做大卡片堆叠。

落实方式：

- 在 `bigScreen` 目录内保留一个局部 SCSS 变量区，先不新增全局设计系统。
- 所有面板复用相同 header、body、footer 结构。
- 对运行态数据使用 Element Plus 的 Tag、Progress、Table、Drawer，不自造复杂控件。

验收标准：

- 代码审查时能快速定位布局、交互、业务状态三类代码。
- 主屏没有过度装饰，信息密度适合任务调度。

### Step 3.1：设计科技感大面板系统

目标：建立一个富有科技感但不浮夸的大面板系统，让地图、任务、资产、遥测和审批信息可以在同一套视觉语言里稳定扩展。设计方向采用“工业级任务指挥舱”：冷静、精密、低装饰、高可读，像飞控/测绘/应急调度工具，而不是营销大屏。

设计判断：

1. 使用者是任务调度、遥感处理和现场保障人员，首要目标是快速判断任务是否安全、数据是否可用、下一步是否需要人工审批。
2. 界面气质应接近高可信控制台：深色半透明材料、稳定网格、清晰状态色、密集但不拥挤的数据排布。
3. 视觉记忆点不是大面积发光，而是“地图上方悬浮的分层玻璃仪表舱”：面板角标、细线栅格、状态脉冲、轨迹数据和审批风险在同一套秩序中表达。
4. 所有设计都必须服务 Mars3D 主地图，面板不能把地图变成背景板，也不能让操作入口压过地图交互。

设计原则：

1. 地图是主角，面板是仪表舱：面板提供态势解释和操作入口，不把地图压成背景装饰。
2. 大面板强调信息分层：先看状态，再看趋势，再看明细，最后才进入操作。
3. 科技感来自精确、秩序、数据密度和微动效，不依赖大面积渐变、光斑和过度发光。
4. 每个面板只解决一类问题，避免把任务控制、资产列表、遥测详情和审批操作塞进同一个巨型面板。
5. 触控优先：按钮、分段控制、开关、图层图标必须有稳定尺寸，不能因为文字变化挤压布局。

设计 token：

```scss
// bigScreen 局部变量，先服务大面板系统，不扩散成全局设计系统。
$zy-bg-deck: rgba(5, 14, 24, 0.74);
$zy-bg-deck-strong: rgba(7, 18, 31, 0.9);
$zy-bg-row-hover: rgba(55, 179, 255, 0.1);
$zy-line-soft: rgba(142, 206, 255, 0.22);
$zy-line-strong: rgba(118, 204, 255, 0.56);
$zy-text-main: #e8f6ff;
$zy-text-sub: rgba(214, 235, 249, 0.72);
$zy-text-muted: rgba(185, 210, 226, 0.52);
$zy-accent-cyan: #37b3ff;
$zy-accent-green: #38d98b;
$zy-accent-amber: #ffb84d;
$zy-accent-red: #ff5f6d;
$zy-accent-gray: #8ea0ad;
$zy-panel-radius: 8px;
$zy-panel-width: 360px;
$zy-panel-width-wide: 420px;
$zy-panel-gap: 12px;
$zy-toolbar-height: 48px;
$zy-row-height: 40px;
$zy-icon-button: 32px;
$zy-motion-fast: 140ms;
$zy-motion-normal: 180ms;
```

面板体系：

1. `PanelShell`：唯一大面板外壳。
   - 结构固定为 `header / summary / content / footer`，不得在内部再套一层装饰卡片。
   - `header` 左侧显示标题、状态点、数据源标识；右侧只放图标按钮，如折叠、刷新、定位、更多。
   - `summary` 放最重要的 2-4 个指标，使用紧凑数字块，不做大号营销式 KPI 卡。
   - `content` 放列表、表格、时间线、分组行，支持内部滚动且不影响地图缩放。
   - `footer` 只放明确动作或风险提示，普通状态说明不要占用 footer。
2. `MissionPanel`：任务态势面板。
   - 展示 Mission 名称、状态、进度、当前阶段、最近关键事件。
   - 用小型时间线表达 `TaskEvent`，失败和待审批事件置顶。
   - 点击 Task 行只切换当前任务，不直接触发任何高风险动作。
3. `CommandPanel`：命令与审批面板。
   - 只承载 TaskCommand 创建、取消、重试、审批通过、审批拒绝。
   - 高风险命令必须出现风险等级、影响对象、原因输入和二次确认。
   - 旧 `processControlView.vue` 的采集、处理、传输流程不迁移到这里，只按新 `/v2` API 重建。
4. `AssetPanel`：资产与图层面板。
   - 分组展示原始图像、处理结果、预览图、发布图层和报告。
   - 每一行资产提供可见性、飞到图层、详情、发布申请等动作。
   - `geoStatus=FAILED` 的资产显示为不可贴图状态，不向 Mars3D 写入图层。
5. `TelemetryPanel`：无人机遥测面板。
   - 展示在线状态、经纬度、高度、速度、航向、最后上报时间。
   - 提供航线显示、扫描锥体显示、跟随视角三个开关。
   - 高频遥测只更新必要字段，历史轨迹进入 Worker 处理。
6. `AgentPanel`：辅助分析面板。
   - 初版只做摘要、失败原因、建议动作和工具轨迹。
   - 默认折叠，避免干扰主任务操作。

视觉语言：

1. 背景：使用半透明深色面板叠加轻微玻璃质感，保留地图可见度；禁止使用大面积纯黑遮罩。
2. 材质：面板允许使用 `backdrop-filter: blur(10px)` 和轻微噪点贴层，但噪点透明度必须低，不能影响文字阅读。
3. 边框：使用 1px 冷色细线和角标线表达边界，避免厚边框和复杂装饰图。
4. 角标：面板四角用 8-12px 线段表现“仪器边界”，只在 `PanelShell` 实现一次，不允许子面板重复画装饰角。
5. 数据：关键数字使用等宽数字字体或 `font-variant-numeric: tabular-nums`，保证刷新时不跳动。
6. 图标：按钮优先使用 Element Plus 图标或已有图标体系，图层、定位、可见性、审批、重试等动作保持符号一致。
7. 状态：所有状态颜色沿用 Step 3 的固定语义，不为单个面板单独发明状态色。
8. 动效：只使用 120-200ms 的面板展开、状态闪烁和事件进入动效；高频数据刷新不做逐项动画。

布局规则：

1. 桌面端使用“三带布局”：顶部任务栏、左右大面板、底部事件条。
2. 左侧固定 Mission 态势，右侧在 Command、Asset、Telemetry、Agent 之间切换。
3. 面板宽度使用 CSS 变量控制，例如 `--zy-panel-width: 360px`，大屏可扩展到 `420px`。
4. 顶部任务栏高度固定为 48px，按钮使用 32px 图标按钮，避免中文标签过长导致工具栏跳动。
5. 面板内部使用 header、summary、content、footer 四段结构，所有面板复用 `PanelShell.vue`。
6. 不允许卡片套卡片；重复数据用列表、表格、分组行表达。
7. 移动端和触控屏把左右大面板折叠为底部抽屉，地图仍占首屏主体，底部抽屉默认只露出状态摘要和切换图标。

组件交互规范：

1. 图标按钮必须有 `aria-label` 或等价可访问名称，并提供 hover/focus 状态。
2. 右侧面板切换使用图标分段控制，激活态只改变边框、背景和状态线，不改变按钮尺寸。
3. 列表行 hover 只使用低透明蓝色底，不使用放大、位移或高度变化。
4. 加载态使用面板内骨架线或轻量 `el-skeleton`，不得用全屏 loading 遮挡地图。
5. 错误态在 `PanelShell` 内显示错误摘要、重试按钮和最近一次成功数据时间，不能直接清空面板。
6. 空状态提供下一步动作，例如选择 Mission、刷新资产、打开图层，而不是只显示“暂无数据”。
7. 高风险命令使用二段式确认：先展示风险摘要，再要求确认原因或确认文本，最后才提交 `TaskCommand`。

典型界面状态：

1. 无数据：地图保持可交互，左侧 `MissionPanel` 显示选择任务入口，右侧默认收起。
2. 加载中：保留已有地图和上一批业务数据，面板局部显示骨架，不做全屏遮罩。
3. 运行中：顶部任务栏显示连接状态和 Mission 状态，遥测数字低频刷新，地图轨迹按节流策略更新。
4. 失败：失败事件在 `MissionPanel` 时间线置顶，`CommandPanel` 显示可重试或需要审批的动作。
5. 待审批：右侧自动切换到 `CommandPanel`，但不弹全屏模态；审批操作在面板 footer 完成二次确认。

落地方式：

1. 新增 `PanelShell.vue` 作为唯一面板外壳，提供标题、状态点、折叠按钮、loading、error 和 footer 插槽。
2. 在 `index.vue` 中维护 `activePanel` 和面板打开状态，子面板不直接互相控制。
3. 在 `bigScreen` 局部样式中定义面板变量：背景、边框、阴影、间距、标题高度、按钮尺寸。
4. 第一版先实现 `PanelShell`、顶部任务栏、左右面板容器、右侧图标分段控制和底部事件条，使用 mock 数据验证状态表达。
5. 第二版再补 `MissionPanel`、`CommandPanel`、`AssetPanel`、`TelemetryPanel` 的静态内容结构。
6. 关键接口、SSE 订阅、Mars3D 图层写入都在对应函数上加注释，说明数据来源和副作用。
7. 第一轮不接入真实 `/v2` 数据；交互、面板层级和响应式确认后再进入 API/Pinia/SSE。

验收标准：

- 主屏在无数据、加载中、运行中、失败、待审批五种状态下都有清晰表达。
- 面板展开、收起、切换时地图视野不抖动，地图对象不被无意清理。
- 任何高风险操作都能在 `CommandPanel` 中看到来源、目标、风险等级和确认入口。
- 视觉风格有科技感，但不依赖花哨装饰，不影响长期维护。
- 1920x1080 下地图仍是视觉主体，左右面板与底部事件条不遮挡关键地图控制。
- 1366px 宽度下左右面板不会互相挤压；右侧面板可收起，顶部工具栏不换行。
- 触控屏下主要操作按钮尺寸不小于 32px，面板内部滚动不误触地图缩放。

## 5. 结构和代码清理步骤

### Step 4：建立重构保护分支和删除清单

目标：大规模删除前先形成可回滚的边界。

怎么做：

1. 从 `dev/v2026.04.25` 拉出重构分支，例如 `refactor/frontend-mars3d-shell`。
2. 用 `rg` 搜索 Mars3D、Cesium、map、bigScreen、graphicLayer、FixedRoute 等关键词，确认保留文件。
3. 建立删除清单，先删除路由入口，再删除未引用组件，最后删除 API 和 store 中的废弃模块。
4. 每轮删除后运行构建，保持 PR 可 review。

验收标准：

- 每个 PR 的删除范围清楚。
- 删除功能不影响 Mars3D 主屏启动。
- 不因为格式化导致大量无关 diff。

### Step 5：重建路由与应用入口

目标：让应用只服务新的地图任务平台。

怎么做：

1. `src/router` 只保留登录、主屏、错误页三个必要入口。
2. 如果后端 JWT 已可用，保留最小登录；如果还在 mock 阶段，使用开发态默认 token。
3. `src/layout` 旧后台布局不再作为主结构，主屏直接承载在 `bigScreen/index.vue`。
4. 移除与菜单、面包屑、多标签页、系统管理强绑定的入口。

验收标准：

- 打开应用后直接进入 Mars3D 主屏或登录后进入主屏。
- 路由表短小，可一屏 review。

### Step 6：收敛组件和静态资源

目标：只保留地图任务平台需要的组件。

怎么做：

1. 保留地图、图层、无人机、任务面板相关组件。
2. 删除未被主屏引用的通用后台组件。
3. 大图、模型、字体等重资产不移动，先只断开未使用引用。
4. 对历史编码异常文件只删除引用，不做无关重写。

验收标准：

- `src/components` 不再像后台模板组件库。
- 静态资产没有大规模移动造成路径风险。

## 6. 状态管理设计

### Step 7：建立 Pinia 主状态

目标：把分散在页面内的任务、资产、无人机、图层状态收敛到一个清楚的状态中心。

怎么做：

在 `src/store/modules/platform.js` 中管理：

- `auth`：token、用户、权限。
- `mission`：当前 Mission、Mission 列表。
- `tasks`：Task 字典、当前 Task、Task 事件。
- `commands`：待审批命令、命令执行结果。
- `assets`：Asset 字典、图层资产、贴图状态。
- `telemetry`：无人机最新点、轨迹点、在线状态。
- `ui`：当前展开面板、选中地图对象、交互模式。

关键规则：

- API 返回数据先进入 Pinia，再由地图层订阅渲染。
- Mars3D `Graphic`、`GraphicLayer`、`Map` 实例只保存在地图工具模块或组件局部，不进入可序列化业务状态。
- 高频遥测只保留最近点和有限轨迹窗口，历史轨迹按需查询。
- 所有状态变更用 action，不在组件里直接拼复杂业务状态。

验收标准：

- 组件中不再出现大量跨模块 `ref/reactive` 拼业务状态。
- 刷新任务事件、资产事件、遥测事件都有统一入口。

## 7. API 与实时流设计

### Step 8：统一 API 封装

目标：对齐后端 `/v2` 新接口，避免页面直接拼 URL。

怎么做：

在 `src/api/platform.js` 中封装以下接口：

```js
/**
 * 创建任务批次。
 * 对应 POST /v2/missions；只创建 Mission，不直接启动设备或模型。
 */
export function createMission(data) {}

/**
 * 创建 Task。
 * 对应 POST /v2/missions/{missionId}/tasks；采集、处理、传输、坐标计算、图层发布都走 Task。
 */
export function createTask(missionId, data) {}

/**
 * 创建任务命令。
 * 对应 POST /v2/tasks/{taskId}/commands；高风险命令可能进入审批状态。
 */
export function createTaskCommand(taskId, data) {}

/**
 * 查询任务资产。
 * 对应 GET /v2/tasks/{taskId}/assets；地图贴图与资产面板都以该结果为准。
 */
export function listTaskAssets(taskId) {}

/**
 * 查询无人机最新遥测。
 * 对应 GET /v2/uavs/{uavId}/telemetry/latest；用于 SSE 断开后的兜底刷新。
 */
export function getLatestTelemetry(uavId) {}
```

接口注释要求：

- 每个关键接口必须写明后端路径。
- 必须说明该接口是否会触发高风险动作。
- 必须说明返回数据进入哪个 Pinia action。
- SSE 接口必须注明不走统一 `ApiResult` 包装。

验收标准：

- Vue 文件里不出现裸路径 `/v2/...`。
- 高风险接口在注释和调用点都能一眼识别。

### Step 9：接入 SSE 实时流

目标：替换页面级轮询，让任务、资产、遥测按事件驱动更新。

怎么做：

1. 在 `utils/map/sseClient.js` 中封装 EventSource 创建、重连、关闭。
2. 支持以下后端接口：
   - `/v2/realtime/missions/{missionId}/events`
   - `/v2/realtime/tasks/{taskId}/events`
   - `/v2/realtime/uavs/{uavId}/telemetry`
   - `/v2/realtime/agent/sessions/{sessionId}/events`
3. SSE 事件进入 Pinia action 后，再触发地图图层更新。
4. 断线后退回低频兜底查询，例如 `getLatestTelemetry` 和 `listTaskEvents`。

验收标准：

- 页面中不再散落 `setInterval`。
- 关闭 Mission 或切换任务时，SSE 能正确关闭，避免重复连接。

## 8. Mars3D 地图能力设计

### Step 10：重建图层管理

目标：把图层的添加、隐藏、清理、层级和数据来源统一管理。

怎么做：

1. 在 `layerManager.js` 中维护图层 key：
   - `base-disaster`：灾害底图。
   - `capture-preview`：采集预览图。
   - `process-result`：处理结果图。
   - `uav-model`：无人机模型。
   - `uav-route`：无人机航线。
   - `scan-frustum`：扫描锥体。
   - `mission-region`：任务区域。
2. 为每个图层提供 `add/update/remove/clear/setVisible` 方法。
3. 切换 Mission 时清理所有临时图层。
4. 贴图使用 Asset 的 `previewUrl/layerUrl/geometry`，不直接依赖文件名硬编码。

验收标准：

- 所有地图图形都能按 Mission 一键清理。
- 处理结果层级稳定覆盖采集图层。
- 图层开关状态与资产面板一致。

### Step 11：迁移遥测和无人机展示

目标：用新 Telemetry API 和 SSE 驱动无人机模型、轨迹、锥体。

怎么做：

1. 遥测字段统一映射：
   - `longitude` -> 经度。
   - `latitude` -> 纬度。
   - `altitudeMeters` -> 高度。
   - `headingDegrees` -> 航向。
   - `reportedAt` -> 上报时间。
2. 模型朝向补偿逻辑集中在 `telemetry.js`，不要散落在页面里。
3. 轨迹点超过窗口长度后裁剪，避免长时间运行卡顿。
4. 轨迹计算、抽稀、平滑进入 Web Worker。

验收标准：

- 高频遥测不会导致主线程明显卡顿。
- 无人机模型、航线、扫描锥体与遥测状态同步。

## 9. 后续功能实现步骤

### Step 12：实现 Mission/Task 主流程

目标：先跑通新任务平台主链路。

怎么做：

1. 创建 Mission。
2. 创建 CAPTURE、PROCESS、TRANSFER、CALCULATE_GEO_BOUNDARY、PUBLISH_LAYER 等 Task。
3. 通过 TaskCommand 启动、停止、取消、重试。
4. 从 TaskEvent 更新状态时间线。
5. 从 TaskAsset 更新资产面板和地图贴图。

验收标准：

- 用户可以围绕一个 Mission 查看完整任务状态。
- 所有高风险动作都走命令和审批提示。

### Step 13：实现审批和风险提示

目标：前端不直接执行危险动作。

怎么做：

1. 命令创建前根据 `riskLevel` 展示二次确认。
2. `WAITING_APPROVAL` 状态进入待审批面板。
3. 调用 `/v2/approvals/{commandId}/approve` 或 `/reject`。
4. 审批结果写回 TaskCommand 状态。

验收标准：

- 启动采集、启动处理、启动传输、删除资产、发布图层都有明显风险提示。
- 审批状态在任务时间线中可追踪。

### Step 14：实现资产与贴图流程

目标：资产面板成为地图贴图的唯一业务来源。

怎么做：

1. 从 `/v2/assets` 或 `/v2/tasks/{taskId}/assets` 获取资产。
2. 根据 `assetType`、`assetRole`、`geoStatus` 决定是否可贴图。
3. `geoStatus=FAILED` 时只展示资产，不加入地图。
4. `layerUrl` 优先以 WMS/WMTS 图层显示，`previewUrl + geometry` 作为预览贴图方式。
5. 资产删除、图层发布等动作走审批。

验收标准：

- 地图上看到的图层都能在资产面板中追溯。
- 不可贴图资产不会悄悄失败，必须在面板中显示原因。

### Step 15：实现 Agent 辅助入口

目标：先做轻量入口，不让 Agent 面板喧宾夺主。

怎么做：

1. 地图右侧增加 Agent 抽屉入口。
2. 初版只支持 Mission/Task 上下文问答、事件总结、失败原因摘要。
3. Agent 工具调用结果展示为只读轨迹。
4. 高风险工具只生成待确认命令，不直接执行。

验收标准：

- Agent 不影响主任务操作路径。
- 工具调用可审计、可折叠、可定位到任务或资产。

## 10. 性能策略

必须落实的高性能策略：

- 用 Pinia 归并业务状态，减少跨组件重复请求和重复计算。
- 高频遥测使用节流更新地图，UI 文本低频刷新，地图对象按需更新。
- 大量坐标转换、轨迹抽稀、边界计算放入 Web Worker。
- 列表只渲染当前 Mission/Task 相关数据，大历史数据分页或虚拟滚动。
- 图片默认使用 `previewUrl`，原图和大图层按需加载。
- Mars3D 图形对象复用，避免每次事件都 remove/add。
- 切换 Mission 时统一释放 SSE、定时器、图层、Graphic 引用。

## 11. Review 与交付节奏

第一轮建议拆成 4 个 PR：

1. PR 1：UI 壳与交互状态。
   - 新增 Mars3D 主屏外层布局。
   - 完成顶部任务栏、左侧 Mission 态势、右侧 Command/Asset/Telemetry 面板切换、底部事件条。
   - 建立 `activePanel`、`selectedMapObject`、`interactionMode` 等基础状态。
   - 使用 mock 数据完成空、加载中、运行中、失败、待审批状态切换。
2. PR 2：新视觉与资源清理。
   - 落地“工业级任务指挥舱”视觉方向。
   - 清理旧大屏装饰背景、边框图、无用动态图和过时视觉素材。
   - 保留地图、模型、底图、字体等业务重资产，并在删除前确认引用关系。
   - 完成 1920x1080、1366px 宽度和触控/窄屏布局 polish。
3. PR 3：旧入口、旧页面、旧接口删除。
   - 删除明确旧后台入口、明显无关页面和旧接口封装。
   - 保留登录、错误页、Mars3D 初始化、地图底座和必要基础设施。
   - 对被新主屏间接依赖的旧模块，抽出最小公共依赖后删除旧模块主体。
   - 删除 `processControlView.vue` 等页面内旧采集、处理、传输流程控制逻辑。
4. PR 4：新 `/v2` API、Pinia 和 mock ViewModel。
   - 新增 `src/api/platform.js`，集中封装 Mission、Task、TaskCommand、Asset、Telemetry、Realtime、Approval。
   - 建立宽松 adapter，将后端字段转换为页面标准 ViewModel。
   - 新增 Pinia 主状态骨架，收敛 Mission、Task、Asset、Telemetry、Command 和 UI 状态。
   - mock 数据必须按 ViewModel 组织，不复用旧接口字段。

后续 PR 再接入真实 Mission/Task/Asset 查询、SSE、Telemetry、TaskCommand、审批、Agent 和完整性能清理，避免第一轮越界。

每个 PR 必须包含：

- 变更目的。
- 删除范围。
- 保留的 Mars3D 能力。
- 是否影响路由、权限、全局设置。
- 手工验证截图或构建结果。

## 12. 验收标准

最终重构完成后应满足：

- 应用主入口只围绕 Mars3D 任务平台展开。
- 前端没有大面积历史后台功能残留。
- 所有关键后端接口都有集中封装和注释。
- 任务、命令、事件、资产、遥测状态统一进入 Pinia。
- 地图图层、无人机、轨迹、扫描锥体和贴图可以统一清理。
- 无高频轮询散落在页面中。
- 高风险动作有明确确认和审批状态展示。
- 文件结构克制，review 时能快速看懂界面、状态、API、地图四条主线。

## 13. 风险与控制

- 大规模删除风险：先删路由入口，再删未引用组件，最后删 API/store，避免误删 Mars3D 依赖。
- 后端接口未完全稳定：前端 API 层用适配函数隔离字段变化，页面只依赖标准 ViewModel。
- SSE 网络不稳定：必须提供断线重连和低频兜底查询。
- Mars3D 内存泄漏：所有图层、Graphic、定时器、EventSource 都要在 Mission 切换和组件卸载时清理。
- 触控误操作：高风险动作必须二次确认，并通过 TaskCommand/审批链路执行。
