import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Rect, Layout } from '@motion-canvas/2d';
import {
  createRef,
  all,
  waitFor,
  easeInOutCubic,
  easeOutBack,
} from '@motion-canvas/core';

const INDIGO = '#6366f1';
const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const R_COLOR = '#276DC3';
const TERMINAL_BG = '#131324';
const TERMINAL_BORDER = '#2c2c44';
const PINK_COLOR = '#c792ea';
const TEAL_COLOR = '#00f2fe';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(3.8);

  // ─── Phase 1: Title ────────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Query & Inspect"
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
      text="Query pipeline state and historical build logs inside the REPL"
      fontSize={15}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={-185}
    />,
  );
  yield* subtitle().opacity(1, 0.5, easeInOutCubic);
  yield* waitFor(0.8);

  // ─── Phase 2: Terminal content ───────────────────
  const termContent = createRef<Layout>();

  // Command refs
  const lines = [
    { cmd: 'inspect_pipeline(p)', out: '# node  runtime  serializer  dependencies\n# raw   T        default     []\n# tidy  T        default     [raw]' },
    { cmd: 'read_node(p.tidy)', out: '# [DataFrame: 10,000 rows × 5 columns]' },
    { cmd: 'list_logs(p)', out: '# 1: build_2026-06-23_1200.log\n# 2: build_2026-06-22_1500.log' },
    { cmd: 'read_past_node(p.tidy, "build_2026-06-22")', out: '# [DataFrame: 9,850 rows × 5 columns] (Time travel! ⏰)' },
  ];

  const lineRefs = lines.map(() => ({
    promptRef: createRef<Txt>(),
    cmdRef: createRef<Txt>(),
    outRef: createRef<Txt>(),
  }));

  view.add(
    <Layout
      ref={termContent}
      layout
      direction="column"
      alignItems="start"
      gap={12}
      x={-180}
      y={20}
    >
      {lines.map((item, idx) => (
        <Layout layout direction="column" alignItems="start" gap={2} key={`line-${idx}`}>
          {/* Command Input Row */}
          <Layout layout direction="row" gap={6}>
            <Txt
              ref={lineRefs[idx].promptRef}
              text="T>"
              fontSize={16}
              fill={PINK_COLOR}
              fontFamily="monospace"
              opacity={0}
            />
            <Txt
              ref={lineRefs[idx].cmdRef}
              text={item.cmd}
              fontSize={16}
              fill="#e2e8f0"
              fontFamily="monospace"
              fontWeight={700}
              opacity={0}
            />
          </Layout>

          {/* Output Row */}
          <Txt
            ref={lineRefs[idx].outRef}
            text={item.out}
            fontSize={15}
            fill={idx === 3 ? TEAL_COLOR : SLATE}
            fontFamily="monospace"
            opacity={0}
            marginLeft={25}
          />
        </Layout>
      ))}
    </Layout>
  );

  yield* waitFor(0.5);

  // Animate lines sequentially
  for (let idx = 0; idx < lines.length; idx++) {
    // 1. Show prompt
    yield* lineRefs[idx].promptRef().opacity(1, 0.15);
    // 2. Type command
    yield* lineRefs[idx].cmdRef().opacity(1, 0.25);
    yield* waitFor(0.3);
    // 3. Show output
    yield* lineRefs[idx].outRef().opacity(1, 0.3);
    yield* waitFor(0.8);
  }

  yield* waitFor(2.0);

  // ─── Phase 3: Outro ─────────────────────────────
  yield* all(
    title().opacity(0, 0.3),
    subtitle().opacity(0, 0.3),
    termContent().opacity(0, 0.3),
  );
  yield* waitFor(0.5);
});
