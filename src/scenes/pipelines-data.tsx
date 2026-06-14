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
  easeInOutQuad,
} from '@motion-canvas/core';

const INDIGO = '#6366f1';
const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const R_COLOR = '#276DC3';
const PY_COLOR = '#FFD43B';
const JL_COLOR = '#389826';
const Q_COLOR = '#6B5B9E';

export default makeScene2D(function* (view) {
  view.fill(DARK);

  // ─── Phase 1: Title ────────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Pipelines are Data"
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
      text="Inspect, query, and transform them like any other value"
      fontSize={16}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={-185}
    />,
  );
  yield* subtitle().opacity(1, 0.5, easeInOutCubic);
  yield* waitFor(0.6);

  // ─── Phase 2: Code block ───────────────────────
  const codeLines = [
    {text: 'p = pipeline {',               color: '#c792ea'},
    {text: '  raw  = node(command = read_csv("data.csv"), runtime = T)', color: '#e2e8f0'},
    {text: '  tidy = raw |> filter($age > 18) |> mutate($z = $x + $y)', color: '#e2e8f0'},
    {text: '  mod  = rn(script = "model.R", serializer = ^pmml)',       color: R_COLOR},
    {text: '  plot = qn(script = "plot.qmd")',                          color: Q_COLOR},
    {text: '}',                               color: '#c792ea'},
  ];

  const codeRefs = codeLines.map(() => createRef<Txt>());
  view.add(
    <Layout layout direction="column" alignItems="start" gap={6} y={-60} x={-160}>
      {codeLines.map((line, i) => (
        <Txt
          ref={codeRefs[i]}
          text={line.text}
          fontSize={15}
          fill={line.color}
          fontFamily="monospace"
          opacity={0}
          y={10}
        />
      ))}
    </Layout>,
  );

  for (const ref of codeRefs) {
    yield* all(
      ref().opacity(1, 0.25),
      ref().y(0, 0.25, easeInOutCubic),
    );
  }
  yield* waitFor(1.2);

  // ─── Phase 3: pipeline_to_frame → table ─────────
  const invokeLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={invokeLabel}
      text="pipeline_to_frame(p)"
      fontSize={16}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-200}
    />,
  );

  yield* all(
    ...codeRefs.map(r => r().opacity(0, 0.3)),
    invokeLabel().opacity(1, 0.4),
  );

  // Build table
  const colW = 110;
  const rowH = 32;
  const headers = ['name', 'runtime', 'serializer', 'deps'];
  const rows = [
    ['raw',  'T',   'default',  '—'],
    ['tidy', 'T',   'default',  'raw'],
    ['mod',  'R',   'pmml',     'tidy'],
    ['plot', 'Quarto', 'default', 'raw'],
  ];

  const tableX = -colW * 1.5;
  const headerY = -100;

  const headerRefs = headers.map(() => createRef<Rect>());
  const headerLabelRefs = headers.map(() => createRef<Txt>());
  const cellRefs = rows.map(() =>
    headers.map(() => createRef<Rect>()),
  );
  const cellLabelRefs = rows.map(() =>
    headers.map(() => createRef<Txt>()),
  );
  const rowBgRefs = rows.map(() => createRef<Rect>());

  for (let j = 0; j < headers.length; j++) {
    view.add(
      <Rect
        ref={headerRefs[j]}
        width={colW - 2}
        height={rowH}
        fill={INDIGO}
        opacity={0}
        radius={4}
        x={tableX + j * colW}
        y={headerY}
      >
        <Txt
          ref={headerLabelRefs[j]}
          text={headers[j]}
          fontSize={14}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* all(
      headerRefs[j]().opacity(0.9, 0.2),
      headerRefs[j]().scale(1, 0.2, easeOutBack),
    );
  }

  for (let i = 0; i < rows.length; i++) {
    yield* waitFor(0.1);
    // Row background
    const bgColor = i % 2 === 0 ? '#1a1a2e' : '#16162a';
    view.add(
      <Rect
        ref={rowBgRefs[i]}
        width={colW * headers.length}
        height={rowH}
        fill={bgColor}
        opacity={0}
        radius={4}
        x={tableX + (colW * (headers.length - 1)) / 2}
        y={headerY + (i + 1) * rowH}
      />,
    );
    yield* rowBgRefs[i]().opacity(0.5, 0.15);

    for (let j = 0; j < headers.length; j++) {
      const cellRef = cellRefs[i][j];
      const labelRef = cellLabelRefs[i][j];
      view.add(
        <Rect
          ref={cellRef}
          width={colW - 2}
          height={rowH - 2}
          fill="transparent"
          opacity={0}
          x={tableX + j * colW}
          y={headerY + (i + 1) * rowH}
        >
          <Txt
            ref={labelRef}
            text={rows[i][j]}
            fontSize={13}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* all(
        cellRef().opacity(1, 0.15),
      );
    }
  }
  yield* waitFor(0.8);

  // ─── Phase 4: filter_node ──────────────────────
  const filterLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={filterLabel}
      text='filter_node(p, $runtime == "R")'
      fontSize={15}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-200}
    />,
  );

  yield* all(
    invokeLabel().opacity(0, 0.3),
    filterLabel().opacity(1, 0.4),
  );

  // Gray out non-R rows
  yield* all(
    // row 0 (raw — T): dim
    all(...cellRefs[0].map(c => c().opacity(0.2, 0.4))),
    // row 1 (tidy — T): dim
    all(...cellRefs[1].map(c => c().opacity(0.2, 0.4))),
    // row 2 (mod — R): highlight
    rowBgRefs[2]().fill('#1a3a2e', 0.4),
    ...cellRefs[2].map(c => c().opacity(1, 0.4)),
    // row 3 (plot — Quarto): dim
    all(...cellRefs[3].map(c => c().opacity(0.2, 0.4))),
  );

  yield* waitFor(0.6);

  // ─── Phase 5: Mermaid DAG ──────────────────────
  yield* all(
    filterLabel().opacity(0, 0.3),
    ...headerRefs.map(r => r().opacity(0, 0.3)),
    ...cellRefs.flat().map(r => r().opacity(0, 0.3)),
    ...rowBgRefs.map(r => r().opacity(0, 0.3)),
  );

  const dagLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={dagLabel}
      text="pipeline_to_mermaid(p)"
      fontSize={16}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-200}
    />,
  );
  yield* dagLabel().opacity(1, 0.4);

  // Draw DAG nodes
  const dagNodes = [
    {name: 'raw',  color: '#6366f1', x: -200, y: -40},
    {name: 'tidy', color: '#6366f1', x: 0,    y: -40},
    {name: 'mod',  color: R_COLOR,   x: 0,    y: 70},
    {name: 'plot', color: Q_COLOR,   x: 200,  y: -40},
  ];

  const nodeBoxRefs = dagNodes.map(() => createRef<Rect>());
  const nodeLabelRefs = dagNodes.map(() => createRef<Txt>());

  for (let i = 0; i < dagNodes.length; i++) {
    const n = dagNodes[i];
    view.add(
      <Rect
        ref={nodeBoxRefs[i]}
        width={90}
        height={40}
        fill={n.color}
        radius={6}
        opacity={0}
        y={20}
        shadowColor={n.color}
        shadowBlur={12}
        shadowOffsetY={0}
        shadowOffsetX={0}
      >
        <Txt
          ref={nodeLabelRefs[i]}
          text={n.name}
          fontSize={18}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    nodeBoxRefs[i]().x(n.x);
    nodeLabelRefs[i]().x(n.x);
    yield* all(
      nodeBoxRefs[i]().opacity(1, 0.4),
      nodeBoxRefs[i]().y(0, 0.4, easeOutBack),
    );
  }

  // Draw arrows between nodes (raw → tidy, raw → plot, tidy → mod)
  const edges = [
    {from: 0, to: 1},
    {from: 0, to: 3},
    {from: 1, to: 2},
  ];

  const arrowRefs = edges.map(() => createRef<Line>());

  for (let e = 0; e < edges.length; e++) {
    const f = dagNodes[edges[e].from];
    const t = dagNodes[edges[e].to];
    const fx = f.x + 45;
    const fy = 0;
    const tx = t.x - 45;
    const ty = 0;

    view.add(
      <Line
        ref={arrowRefs[e]}
        points={[
          {x: fx, y: fy},
          {x: (fx + tx) / 2, y: (fy + ty) / 2},
          {x: tx, y: ty},
        ]}
        stroke={SLATE}
        lineWidth={2}
        endArrow={true}
        opacity={0}
      />,
    );
    yield* arrowRefs[e]().opacity(0.6, 0.3);
  }

  yield* waitFor(1.2);

  // ─── Phase 6: Closing tagline ──────────────────
  yield* all(
    dagLabel().opacity(0, 0.3),
    ...nodeBoxRefs.map(r => r().opacity(0, 0.3)),
    ...nodeLabelRefs.map(r => r().opacity(0, 0.3)),
    ...arrowRefs.map(r => r().opacity(0, 0.3)),
  );

  const tagline = createRef<Txt>();
  view.add(
    <Txt
      ref={tagline}
      text="Pipelines are first-class values"
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
      text="Inspect them. Filter them. Visualize them."
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
