import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Rect, Layout, Line } from '@motion-canvas/2d';
import {
  createRef,
  all,
  waitFor,
  easeInOutCubic,
} from '@motion-canvas/core';

const INDIGO = '#6366f1';
const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const SUCCESS_GREEN = '#22c55e';
const WARN_AMBER = '#f59e0b';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(3.8);

  // ─── Title and Subtitle ─────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Dynamic & Conditional Branching"
      fontSize={30}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-220}
    />,
  );
  yield* title().opacity(1, 0.6, easeInOutCubic);

  const subtitle = createRef<Txt>();
  view.add(
    <Txt
      ref={subtitle}
      text="Scale and adapt your pipelines automatically"
      fontSize={14}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={-190}
    />,
  );
  yield* subtitle().opacity(1, 0.5, easeInOutCubic);
  yield* waitFor(0.8);

  // ─── Phase 1: Dynamic Branching ─────────────────
  const branchHeader = createRef<Txt>();
  view.add(
    <Txt
      ref={branchHeader}
      text="Pattern-Based Branching"
      fontSize={18}
      fontWeight={700}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      x={-200}
      offsetX={-1}
      y={-140}
    />,
  );
  yield* branchHeader().opacity(1, 0.4);

  // Left column: code & descriptions of patterns
  const patternList = [
    { name: 'map_pattern(x)', desc: 'one branch per element / row' },
    { name: 'cross_pattern(a, b)', desc: 'Cartesian product of sub-patterns' },
    { name: 'slice_pattern(x, [0,2,4])', desc: 'branch on specific indices' },
    { name: 'head / tail / sample', desc: 'select subsets programmatically' },
  ];

  const patRefs = patternList.map(() => createRef<Txt>());
  const patDescRefs = patternList.map(() => createRef<Txt>());

  for (let i = 0; i < patternList.length; i++) {
    view.add(
      <Txt
        ref={patRefs[i]}
        text={patternList[i].name}
        fontSize={15}
        fill="#e2e8f0"
        fontFamily="monospace"
        opacity={0}
        x={-200}
        offsetX={-1}
        y={-90 + i * 45}
      />,
    );
    view.add(
      <Txt
        ref={patDescRefs[i]}
        text={patternList[i].desc}
        fontSize={12}
        fill={SLATE}
        fontFamily="sans-serif"
        opacity={0}
        x={-200}
        offsetX={-1}
        y={-72 + i * 45}
      />,
    );
    yield* all(
      patRefs[i]().opacity(1, 0.2),
      patDescRefs[i]().opacity(1, 0.2),
    );
    yield* waitFor(0.15);
  }

  // Right column: Branching visual diagram
  // A parent box splitting into three branch boxes
  const parentBox = createRef<Rect>();
  const parentTxt = createRef<Txt>();
  view.add(
    <Rect
      ref={parentBox}
      width={120}
      height={30}
      fill="#1e1e30"
      radius={4}
      opacity={0}
      x={150}
      y={-100}
    >
      <Txt
        ref={parentTxt}
        text="x = [10, 20, 30]"
        fontSize={10}
        fill="#e2e8f0"
        fontFamily="monospace"
      />
    </Rect>,
  );

  const branches = [
    { label: 'y_branch_1', val: '20' },
    { label: 'y_branch_2', val: '40' },
    { label: 'y_branch_3', val: '60' },
  ];

  const branchBoxes = branches.map(() => createRef<Rect>());
  const branchTxts = branches.map(() => createRef<Txt>());
  const connLines = branches.map(() => createRef<Line>());

  yield* all(
    parentBox().opacity(1, 0.4),
  );

  for (let i = 0; i < branches.length; i++) {
    const targetX = 70 + i * 80;
    const targetY = -10;

    view.add(
      <Rect
        ref={branchBoxes[i]}
        width={70}
        height={40}
        fill="#2a2a40"
        radius={4}
        opacity={0}
        x={targetX}
        y={targetY}
      >
        <Txt
          ref={branchTxts[i]}
          text={`${branches[i].label}\n(val = ${branches[i].val})`}
          fontSize={8}
          fill="#e2e8f0"
          fontFamily="monospace"
        />
      </Rect>,
    );

    view.add(
      <Line
        ref={connLines[i]}
        points={[
          [150, -85],
          [targetX, -30],
        ]}
        stroke="#475569"
        lineWidth={1.5}
        opacity={0}
        end={0}
      />,
    );

    yield* all(
      branchBoxes[i]().opacity(1, 0.3),
      connLines[i]().opacity(1, 0.3),
      connLines[i]().end(1, 0.3),
    );
    yield* waitFor(0.15);
  }

  yield* waitFor(2.0);

  // ─── Transition to Phase 2: Static Conditionals ───
  yield* all(
    branchHeader().opacity(0, 0.3),
    ...patRefs.map(r => r().opacity(0, 0.3)),
    ...patDescRefs.map(r => r().opacity(0, 0.3)),
    parentBox().opacity(0, 0.3),
    ...branchBoxes.map(r => r().opacity(0, 0.3)),
    ...connLines.map(r => r().opacity(0, 0.3)),
  );

  const condHeader = createRef<Txt>();
  view.add(
    <Txt
      ref={condHeader}
      text="Static Conditionals"
      fontSize={18}
      fontWeight={700}
      fill={WARN_AMBER}
      fontFamily="monospace"
      opacity={0}
      x={-200}
      offsetX={-1}
      y={-140}
    />,
  );
  yield* condHeader().opacity(1, 0.4);

  // node_when
  const whenTitle = createRef<Txt>();
  const whenCode = createRef<Txt>();
  const whenDesc = createRef<Txt>();
  view.add(
    <Txt
      ref={whenTitle}
      text="node_when(condition, value)"
      fontSize={16}
      fontWeight={700}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      x={-200}
      offsetX={-1}
      y={-90}
    />,
  );
  view.add(
    <Txt
      ref={whenCode}
      text='model = node_when(env("CI") == "1", pyn(script = "train.py"))'
      fontSize={12}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      x={-200}
      offsetX={-1}
      y={-60}
    />,
  );
  view.add(
    <Txt
      ref={whenDesc}
      text="Evaluated at pipeline construction time. Excludes the node if the condition is false."
      fontSize={11}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      x={-200}
      offsetX={-1}
      y={-38}
    />,
  );

  yield* all(
    whenTitle().opacity(1, 0.3),
    whenCode().opacity(1, 0.3),
    whenDesc().opacity(1, 0.3),
  );
  yield* waitFor(1.5);

  // node_fork
  const forkTitle = createRef<Txt>();
  const forkCode = [
    'model = node_fork(',
    '  env("MODEL_TYPE") == "lm", rn(script = "lm.R"),',
    '  env("MODEL_TYPE") == "nn", pyn(script = "nn.py"),',
    '  .default = rn(script = "baseline.R")',
    ')',
  ];
  const forkCodeRefs = forkCode.map(() => createRef<Txt>());
  const forkDesc = createRef<Txt>();

  view.add(
    <Txt
      ref={forkTitle}
      text="node_fork(...)"
      fontSize={16}
      fontWeight={700}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      x={-200}
      offsetX={-1}
      y={15}
    />,
  );

  for (let i = 0; i < forkCode.length; i++) {
    view.add(
      <Txt
        ref={forkCodeRefs[i]}
        text={forkCode[i]}
        fontSize={12}
        fill="#e2e8f0"
        fontFamily="monospace"
        opacity={0}
        x={-200}
        offsetX={-1}
        y={45 + i * 18}
      />,
    );
  }

  view.add(
    <Txt
      ref={forkDesc}
      text="Multi-way branch conditional. Selects the first matching runtime/command."
      fontSize={11}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      x={-200}
      offsetX={-1}
      y={155}
    />,
  );

  yield* all(
    forkTitle().opacity(1, 0.3),
    ...forkCodeRefs.map(r => r().opacity(1, 0.3)),
    forkDesc().opacity(1, 0.3),
  );

  yield* waitFor(3.0);

  // ─── Fade out entire scene ──────────────────────
  yield* all(
    title().opacity(0, 0.4),
    subtitle().opacity(0, 0.4),
    condHeader().opacity(0, 0.4),
    whenTitle().opacity(0, 0.4),
    whenCode().opacity(0, 0.4),
    whenDesc().opacity(0, 0.4),
    forkTitle().opacity(0, 0.4),
    ...forkCodeRefs.map(r => r().opacity(0, 0.4)),
    forkDesc().opacity(0, 0.4),
  );
  yield* waitFor(0.5);
});
