import {makeScene2D} from '@motion-canvas/2d';
import {Txt, Rect, Layout, Line} from '@motion-canvas/2d';
import {
  createRef,
  all,
  chain,
  sequence,
  waitFor,
  delay,
  easeInOutCubic,
  easeOutBack,
} from '@motion-canvas/core';

const INDIGO = '#6366f1';
const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const ERR_RED = '#ef4444';
const SUCCESS_GREEN = '#22c55e';
const WARN_AMBER = '#f59e0b';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(1.8);

  // ─── Phase 1: Pipeline fails ───────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Errors are Values"
      fontSize={36}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-220}
    />,
  );
  yield* title().opacity(1, 0.6, easeInOutCubic);

  // Small DAG: data → model → report
  const dagNodes = [
    {name: 'data',   color: INDIGO,  x: -160, y: -80},
    {name: 'model',  color: '#276DC3', x: 0,  y: -80},
    {name: 'report', color: '#6B5B9E', x: 160, y: -80},
  ];

  const dBoxRefs = dagNodes.map(() => createRef<Rect>());
  const dLabelRefs = dagNodes.map(() => createRef<Txt>());

  for (let i = 0; i < dagNodes.length; i++) {
    const n = dagNodes[i];
    view.add(
      <Rect
        ref={dBoxRefs[i]}
        width={90}
        height={40}
        fill={n.color}
        radius={6}
        opacity={0}
        y={20}
        shadowColor={n.color}
        shadowBlur={10}
        shadowOffsetY={0}
        shadowOffsetX={0}
      >
        <Txt
          ref={dLabelRefs[i]}
          text={n.name}
          fontSize={14}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    dBoxRefs[i]().x(n.x);
    yield* all(
      dBoxRefs[i]().opacity(1, 0.4),
      dBoxRefs[i]().y(n.y, 0.4, easeOutBack),
    );
  }

  // Arrows
  const dArrows = [
    createRef<Line>(), createRef<Line>(),
  ];
  view.add(
    <Line ref={dArrows[0]}
      points={[{x: -115, y: -80}, {x: -45, y: -80}]}
      stroke={SLATE} lineWidth={2} endArrow={true} opacity={0}
    />,
  );
  view.add(
    <Line ref={dArrows[1]}
      points={[{x: 45, y: -80}, {x: 115, y: -80}]}
      stroke={SLATE} lineWidth={2} endArrow={true} opacity={0}
    />,
  );
  yield* all(
    dArrows[0]().opacity(0.5, 0.2),
    dArrows[1]().opacity(0.5, 0.2),
  );

  yield* waitFor(0.5);

  // A node fails
  yield* all(
    dBoxRefs[1]().fill(ERR_RED, 0.5),
    dBoxRefs[1]().shadowColor(ERR_RED, 0.5),
  );

  const failLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={failLabel}
      text="⚠  build_pipeline(p) → 'model' failed"
      fontSize={16}
      fontWeight={700}
      fill={ERR_RED}
      fontFamily="monospace"
      opacity={0}
      y={-180}
    />,
  );
  yield* failLabel().opacity(1, 0.4);

  // "Errors captured, not crashes"
  const capturedLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={capturedLabel}
      text="Errors captured. Not crashes."
      fontSize={20}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-20}
    />,
  );
  yield* all(
    capturedLabel().opacity(1, 0.5, easeInOutCubic),
    capturedLabel().y(-20, 0.5, easeInOutCubic),
  );

  yield* waitFor(0.8);

  // ─── Phase 2: collect_errors ───────────────────
  yield* all(
    failLabel().opacity(0, 0.3),
    ...dBoxRefs.map(r => r().opacity(0, 0.3)),
    ...dLabelRefs.map(r => r().opacity(0, 0.3)),
    ...dArrows.map(r => r().opacity(0, 0.3)),
    capturedLabel().opacity(0, 0.3),
  );

  const collectLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={collectLabel}
      text="collect_errors(p)"
      fontSize={16}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-190}
    />,
  );
  yield* collectLabel().opacity(1, 0.4);

  // Error table
  const errHeaders = ['node', 'status', 'code', 'message'];
  const errRows = [
    ['model', 'Error', 'RuntimeError', 'R script failed (exit code 1)'],
  ];
  const ecW = 120;
  const eRowH = 26;
  const egX = -ecW * 1.5;

  const ehRefs = errHeaders.map(() => createRef<Rect>());
  const ehTxt = errHeaders.map(() => createRef<Txt>());

  for (let j = 0; j < errHeaders.length; j++) {
    view.add(
      <Rect
        ref={ehRefs[j]}
        width={ecW - 3}
        height={eRowH}
        fill={ERR_RED}
        opacity={0}
        radius={3}
        x={egX + j * ecW}
        y={-120}
      >
        <Txt
          ref={ehTxt[j]}
          text={errHeaders[j]}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* ehRefs[j]().opacity(0.9, 0.15);
  }

  const ecRefs = errRows.map(() => errHeaders.map(() => createRef<Rect>()));
  const ecTxt = errRows.map(() => errHeaders.map(() => createRef<Txt>()));

  for (let i = 0; i < errRows.length; i++) {
    for (let j = 0; j < errHeaders.length; j++) {
      view.add(
        <Rect
          ref={ecRefs[i][j]}
          width={ecW - 3}
          height={eRowH - 2}
          opacity={0}
          x={egX + j * ecW}
          y={-120 + (i + 1) * eRowH}
        >
          <Txt
            ref={ecTxt[i][j]}
            text={errRows[i][j]}
            fontSize={11}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* ecRefs[i][j]().opacity(1, 0.1);
    }
  }

  yield* waitFor(0.6);

  // error_summary()
  const sumLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={sumLabel}
      text="error_summary(errors)"
      fontSize={14}
      fill={SUCCESS_GREEN}
      fontFamily="monospace"
      opacity={0}
      x={-100}
      y={-50}
    />,
  );
  yield* sumLabel().opacity(1, 0.3);

  yield* waitFor(0.4);

  // Summary inline: "1 error, 0 warnings"
  const summaryLine = createRef<Txt>();
  view.add(
    <Txt
      ref={summaryLine}
      text="1 error  •  model  •  RuntimeError"
      fontSize={14}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      x={-100}
      y={-20}
    />,
  );
  yield* summaryLine().opacity(1, 0.4);

  yield* waitFor(0.8);

  // ─── Phase 3: Inspect the error ────────────────
  yield* all(
    collectLabel().opacity(0, 0.2),
    sumLabel().opacity(0, 0.2),
    summaryLine().opacity(0, 0.2),
    ...ehRefs.map(r => r().opacity(0, 0.2)),
    ...ecRefs.flat().map(r => r().opacity(0, 0.2)),
  );

  const inspectLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={inspectLabel}
      text="Inspect the error"
      fontSize={20}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-190}
    />,
  );
  yield* inspectLabel().opacity(1, 0.4);

  // error_code / error_msg / error_context
  const inspCalls = [
    {code: 'error_code(err)    →  "RuntimeError"',  delay: 0},
    {code: 'error_msg(err)     →  "R script failed (exit code 1)"', delay: 0.5},
    {code: 'error_context(err) →  { fn: "predict", node_status: "errored" }', delay: 0.5},
  ];

  const inspRefs = inspCalls.map(() => createRef<Txt>());

  for (let i = 0; i < inspCalls.length; i++) {
    view.add(
      <Txt
        ref={inspRefs[i]}
        text={inspCalls[i].code}
        fontSize={13}
        fill="#e2e8f0"
        fontFamily="monospace"
        opacity={0}
        x={-200}
        y={-120 + i * 40}
      />,
    );
    yield* all(
      inspRefs[i]().opacity(1, 0.3),
    );
    yield* waitFor(inspCalls[i].delay);
  }

  yield* waitFor(0.8);

  // ─── Phase 4: Construct errors ─────────────────
  yield* all(
    inspectLabel().opacity(0, 0.2),
    ...inspRefs.map(r => r().opacity(0, 0.2)),
  );

  const constructLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={constructLabel}
      text="Construct errors yourself"
      fontSize={20}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-190}
    />,
  );
  yield* constructLabel().opacity(1, 0.4);

  const errCalls = [
    {code: 'err = error("ValueError", "Must be positive")', delay: 0},
    {code: 'is_error(err)  →  true', delay: 0.6},
  ];

  const errCallRefs = errCalls.map(() => createRef<Txt>());

  for (let i = 0; i < errCalls.length; i++) {
    view.add(
      <Txt
        ref={errCallRefs[i]}
        text={errCalls[i].code}
        fontSize={14}
        fill="#e2e8f0"
        fontFamily="monospace"
        opacity={0}
        x={-200}
        y={-110 + i * 50}
      />,
    );
    yield* all(
      errCallRefs[i]().opacity(1, 0.3),
    );
    yield* waitFor(errCalls[i].delay);
  }

  yield* waitFor(0.8);

  // ─── Phase 5: explain() ────────────────────────
  yield* all(
    constructLabel().opacity(0, 0.2),
    ...errCallRefs.map(r => r().opacity(0, 0.2)),
  );

  const explainLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={explainLabel}
      text="explain() — Deep introspection"
      fontSize={20}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-190}
    />,
  );
  yield* explainLabel().opacity(1, 0.4);

  // explain(err) shows a structured dict
  const explainErrLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={explainErrLabel}
      text="explain(err)"
      fontSize={14}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-140}
      x={-200}
    />,
  );
  yield* explainErrLabel().opacity(1, 0.3);

  // Structured dict visualization
  const dictLines = [
    '{',
    '  kind:         "value",',
    '  type:         "Error",',
    '  error_code:   "ValueError",',
    '  error_message: "Must be positive",',
    '  context:      { ... }',
    '}',
  ];

  const dictRefs = dictLines.map(() => createRef<Txt>());
  for (let i = 0; i < dictLines.length; i++) {
    view.add(
      <Txt
        ref={dictRefs[i]}
        text={dictLines[i]}
        fontSize={12}
        fill={i === 0 || i === dictLines.length - 1 ? '#c792ea' : '#e2e8f0'}
        fontFamily="monospace"
        opacity={0}
        x={-100}
        y={-120 + i * 22}
      />,
    );
    yield* dictRefs[i]().opacity(1, 0.15);
  }

  yield* waitFor(0.6);

  // explain(df) — show it works on any value
  yield* all(
    ...dictRefs.map(r => r().opacity(0, 0.2)),
    explainErrLabel().opacity(0, 0.2),
  );

  const explainDfLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={explainDfLabel}
      text="explain(df)"
      fontSize={14}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-140}
      x={-200}
    />,
  );
  yield* explainDfLabel().opacity(1, 0.3);

  const dfDictLines = [
    '{',
    '  kind:    "value",',
    '  type:    "DataFrame",',
    '  nrow:    32,',
    '  ncol:    11,',
    '  schema:  { mpg: Float, wt: Float, cyl: Int, ... },',
    '  na_stats: { mpg: 0, wt: 0, ... }',
    '}',
  ];

  const dfDictRefs = dfDictLines.map(() => createRef<Txt>());
  for (let i = 0; i < dfDictLines.length; i++) {
    view.add(
      <Txt
        ref={dfDictRefs[i]}
        text={dfDictLines[i]}
        fontSize={12}
        fill={i === 0 || i === dfDictLines.length - 1 ? '#c792ea' : '#e2e8f0'}
        fontFamily="monospace"
        opacity={0}
        x={-100}
        y={-120 + i * 22}
      />,
    );
    yield* dfDictRefs[i]().opacity(1, 0.15);
  }

  yield* waitFor(0.8);

  // ─── Phase 6: Warnings ─────────────────────────
  yield* all(
    explainLabel().opacity(0, 0.2),
    explainDfLabel().opacity(0, 0.2),
    ...dfDictRefs.map(r => r().opacity(0, 0.2)),
  );

  const warnLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={warnLabel}
      text="Warnings are data too"
      fontSize={20}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-190}
    />,
  );
  yield* warnLabel().opacity(1, 0.4);

  // warning_msg(node)
  const warnCall = createRef<Txt>();
  view.add(
    <Txt
      ref={warnCall}
      text='warning_msg(node)  →  "2 NA values dropped in column `age`"'
      fontSize={13}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-110}
      x={-80}
    />,
  );
  yield* warnCall().opacity(1, 0.4);

  // suppress_warnings(node)
  const suppressCall = createRef<Txt>();
  view.add(
    <Txt
      ref={suppressCall}
      text='suppress_warnings(node)    — hide diagnostics when expected'
      fontSize={13}
      fill={WARN_AMBER}
      fontFamily="monospace"
      opacity={0}
      y={-60}
      x={-80}
    />,
  );
  yield* suppressCall().opacity(1, 0.4);

  yield* waitFor(0.8);

  // ─── Phase 7: Closing tagline ──────────────────
  yield* all(
    warnLabel().opacity(0, 0.3),
    warnCall().opacity(0, 0.3),
    suppressCall().opacity(0, 0.3),
    title().opacity(0, 0.3),
  );

  const tagline = createRef<Txt>();
  view.add(
    <Txt
      ref={tagline}
      text="Errors are values. Inspect everything."
      fontSize={28}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-20}
    />,
  );

  const taglineSub = createRef<Txt>();
  view.add(
    <Txt
      ref={taglineSub}
      text="Construct. Inspect. Explain. No silent failures."
      fontSize={16}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={20}
    />,
  );

  yield* all(
    tagline().opacity(1, 0.6, easeInOutCubic),
    tagline().y(0, 0.6, easeInOutCubic),
  );
  yield* all(
    taglineSub().opacity(1, 0.5, easeInOutCubic),
    taglineSub().y(30, 0.5, easeInOutCubic),
  );

  yield* waitFor(2);
});
