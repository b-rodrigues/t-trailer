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
const R_COLOR = '#276DC3';
const PY_COLOR = '#FFD43B';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(1.8);

  // ─── Phase 1: Title ────────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Pipelines Compose"
      fontSize={36}
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
      text="Modular and reusable by design"
      fontSize={16}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={-185}
    />,
  );
  yield* subtitle().opacity(1, 0.5, easeInOutCubic);
  yield* waitFor(0.8);

  // ─── Phase 2: Two separate pipelines ────────────
  const p1Label = createRef<Txt>();
  view.add(
    <Txt
      ref={p1Label}
      text="p_etl"
      fontSize={22}
      fontWeight={700}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      x={-220}
      y={-130}
    />,
  );
  yield* p1Label().opacity(1, 0.4);

  const p2Label = createRef<Txt>();
  view.add(
    <Txt
      ref={p2Label}
      text="p_stats"
      fontSize={22}
      fontWeight={700}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      x={220}
      y={-130}
    />,
  );
  yield* p2Label().opacity(1, 0.4);

  // Pipeline 1 nodes: extract → clean → load
  const p1Nodes = [
    {name: 'extract', color: PY_COLOR},
    {name: 'clean',   color: '#6366f1'},
    {name: 'load',    color: '#6366f1'},
  ];
  const p1BaseX = -220;

  const p1BoxRefs = p1Nodes.map(() => createRef<Rect>());
  const p1LabelRefs = p1Nodes.map(() => createRef<Txt>());

  for (let i = 0; i < p1Nodes.length; i++) {
    const n = p1Nodes[i];
    const xPos = p1BaseX + (i - 1) * 130;
    view.add(
      <Rect
        ref={p1BoxRefs[i]}
        width={100}
        height={40}
        fill={n.color}
        radius={6}
        opacity={0}
        x={xPos}
        y={-70}
        shadowColor={n.color}
        shadowBlur={10}
        shadowOffsetY={0}
        shadowOffsetX={0}
      >
        <Txt
          ref={p1LabelRefs[i]}
          text={n.name}
          fontSize={14}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* all(
      p1BoxRefs[i]().opacity(1, 0.35),
      p1BoxRefs[i]().y(-70, 0.35, easeOutBack),
    );
  }

  // arrows between p1 nodes
  const p1Arrows = [0, 1].map(i => createRef<Line>());
  for (let i = 0; i < 2; i++) {
    const x1 = p1BaseX + (i - 1) * 130 + 50;
    const x2 = p1BaseX + i * 130 - 50;
    view.add(
      <Line
        ref={p1Arrows[i]}
        points={[{x: x1, y: -70}, {x: x2, y: -70}]}
        stroke={SLATE}
        lineWidth={2}
        endArrow={true}
        opacity={0}
      />,
    );
    yield* p1Arrows[i]().opacity(0.5, 0.2);
  }

  // Pipeline 2 nodes: compute → summarize
  const p2Nodes = [
    {name: 'compute', color: R_COLOR},
    {name: 'summary', color: '#6366f1'},
  ];
  const p2BaseX = 220;

  const p2BoxRefs = p2Nodes.map(() => createRef<Rect>());
  const p2LabelRefs = p2Nodes.map(() => createRef<Txt>());

  for (let i = 0; i < p2Nodes.length; i++) {
    const n = p2Nodes[i];
    const xPos = p2BaseX + (i - 1) * 130;
    view.add(
      <Rect
        ref={p2BoxRefs[i]}
        width={100}
        height={40}
        fill={n.color}
        radius={6}
        opacity={0}
        x={xPos}
        y={-70}
        shadowColor={n.color}
        shadowBlur={10}
        shadowOffsetY={0}
        shadowOffsetX={0}
      >
        <Txt
          ref={p2LabelRefs[i]}
          text={n.name}
          fontSize={14}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* all(
      p2BoxRefs[i]().opacity(1, 0.35),
      p2BoxRefs[i]().y(-70, 0.35, easeOutBack),
    );
  }

  const p2Arrow = createRef<Line>();
  view.add(
    <Line
      ref={p2Arrow}
      points={[{x: 140, y: -70}, {x: 170, y: -70}]}
      stroke={SLATE}
      lineWidth={2}
      endArrow={true}
      opacity={0}
    />,
  );
  yield* p2Arrow().opacity(0.5, 0.2);

  yield* waitFor(0.8);

  // ─── Phase 3: Meta-pipeline ─────────────────────
  const metaLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={metaLabel}
      text='meta = pipeline_of { etl = p_etl, stats = p_stats }'
      fontSize={18}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-140}
    />,
  );

  yield* all(
    p1Label().opacity(0, 0.3),
    p2Label().opacity(0, 0.3),
    ...p1BoxRefs.map(r => r().opacity(0, 0.3)),
    ...p1LabelRefs.map(r => r().opacity(0, 0.3)),
    ...p1Arrows.map(r => r().opacity(0, 0.3)),
    ...p2BoxRefs.map(r => r().opacity(0, 0.3)),
    ...p2LabelRefs.map(r => r().opacity(0, 0.3)),
    p2Arrow().opacity(0, 0.3),
    metaLabel().opacity(1, 0.4),
  );

  // Combined DAG
  const metaNodes = [
    {name: 'etl.extract', color: PY_COLOR,    x: -200, y: -70},
    {name: 'etl.clean',   color: '#6366f1',   x: -60,  y: -70},
    {name: 'etl.load',    color: '#4a4a8a',   x: 80,   y: -70},
    {name: 'stats.compute', color: R_COLOR,   x: 80,   y: 40},
    {name: 'stats.summary', color: '#6366f1', x: 220,  y: 40},
  ];

  const metaBoxRefs = metaNodes.map(() => createRef<Rect>());
  const metaLabelRefs = metaNodes.map(() => createRef<Txt>());

  for (let i = 0; i < metaNodes.length; i++) {
    const n = metaNodes[i];
    view.add(
      <Rect
        ref={metaBoxRefs[i]}
        width={110}
        height={36}
        fill={n.color}
        radius={6}
        opacity={0}
        y={20}
        shadowColor={n.color}
        shadowBlur={8}
        shadowOffsetY={0}
        shadowOffsetX={0}
      >
        <Txt
          ref={metaLabelRefs[i]}
          text={n.name}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    metaBoxRefs[i]().x(n.x);
    yield* all(
      metaBoxRefs[i]().opacity(1, 0.35),
      metaBoxRefs[i]().y(n.y, 0.35, easeOutBack),
    );
  }

  // Meta edges
  const metaEdges = [
    {from: 0, to: 1},
    {from: 1, to: 2},
    {from: 2, to: 3},
    {from: 3, to: 4},
  ];

  const metaArrowRefs = metaEdges.map(() => createRef<Line>());

  for (let e = 0; e < metaEdges.length; e++) {
    const f = metaNodes[metaEdges[e].from];
    const t = metaNodes[metaEdges[e].to];
    let fx = f.x + 55;
    let fy = f.y;
    let tx = t.x - 55;
    let ty = t.y;

    if (metaEdges[e].from === 2 && metaEdges[e].to === 3) {
      fx = f.x;
      fy = f.y + 18;
      tx = t.x;
      ty = t.y - 18;
    }

    const midX = (fx + tx) / 2;
    const midY = (fy + ty) / 2;

    view.add(
      <Line
        ref={metaArrowRefs[e]}
        points={[{x: fx, y: fy}, {x: midX, y: midY}, {x: tx, y: ty}]}
        stroke={SLATE}
        lineWidth={2}
        endArrow={true}
        opacity={0}
      />,
    );
    yield* metaArrowRefs[e]().opacity(0.5, 0.25);
  }

  // Sub-pipeline labels
  const subLabel1 = createRef<Txt>();
  view.add(
    <Txt
      ref={subLabel1}
      text="etl ▸"
      fontSize={14}
      fill={SLATE}
      fontFamily="monospace"
      opacity={0}
      x={-295}
      y={-70}
    />,
  );

  const subLabel2 = createRef<Txt>();
  view.add(
    <Txt
      ref={subLabel2}
      text="stats ▸"
      fontSize={14}
      fill={SLATE}
      fontFamily="monospace"
      opacity={0}
      x={-20}
      y={40}
    />,
  );

  yield* all(
    subLabel1().opacity(1, 0.3),
    subLabel2().opacity(1, 0.3),
  );

  yield* waitFor(1.2);

  // ─── Phase 4: Closing tagline ──────────────────
  yield* all(
    metaLabel().opacity(0, 0.3),
    ...metaBoxRefs.map(r => r().opacity(0, 0.3)),
    ...metaLabelRefs.map(r => r().opacity(0, 0.3)),
    ...metaArrowRefs.map(r => r().opacity(0, 0.3)),
    subLabel1().opacity(0, 0.3),
    subLabel2().opacity(0, 0.3),
  );

  const tagline = createRef<Txt>();
  view.add(
    <Txt
      ref={tagline}
      text="Compose. Merge. Reuse."
      fontSize={30}
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
      text="Modular pipelines that compose naturally"
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

  yield* waitFor(1.5);
});
