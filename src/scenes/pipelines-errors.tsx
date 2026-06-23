import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Layout } from '@motion-canvas/2d';
import {
  createRef,
  all,
  waitFor,
  easeInOutCubic,
} from '@motion-canvas/core';

const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const ERR_RED = '#ef4444';
const WARN_AMBER = '#f59e0b';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(1.8);

  // ─── Phase 1: Title ────────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Errors are First-Class Values"
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
      text="Pipelines with errored nodes don't crash!"
      fontSize={15}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={-185}
    />,
  );
  yield* subtitle().opacity(1, 0.5, easeInOutCubic);
  yield* waitFor(0.8);

  // ─── Phase 2: Content layout ───────────────────
  const leftCol = createRef<Layout>();
  const rightCol = createRef<Layout>();
  const summaryLabel = createRef<Txt>();

  // Left column: Terminal build logs
  const buildLines = [
    { text: "Starting pipeline build...", color: "#94a3b8", weight: 400 },
    { text: "  + model building", color: "#94a3b8", weight: 400 },
    { text: "  + report building", color: "#94a3b8", weight: 400 },
    { text: "", color: "#94a3b8", weight: 400 },
    { text: "✖ Pipeline build captured node errors [0 succeeded, 2 captured errors, 0 had warnings]", color: ERR_RED, weight: 700 },
    { text: "  ! Captured error in node: model", color: ERR_RED, weight: 600 },
    { text: "  ! Captured error in node: report", color: ERR_RED, weight: 600 },
    { text: "", color: "#94a3b8", weight: 400 },
    { text: "💡 Recommendation: Start diagnosing at independent root failure(s):", color: WARN_AMBER, weight: 600 },
    { text: "  → model (Run 'error_msg(p.model)' and share traceback with LLM/Copilot)", color: "#94a3b8", weight: 400 },
  ];

  const buildLineRefs = buildLines.map(() => createRef<Txt>());

  // Right column: Explanations
  const expRefs = [
    createRef<Txt>(),
    createRef<Txt>(),
  ];

  view.add(
    <Layout
      ref={leftCol}
      layout
      direction="column"
      alignItems="start"
      gap={6}
      x={-180}
      y={10}
    >
      {buildLines.map((line, idx) => {
        if (idx === 9) {
          return (
            <Txt
              ref={buildLineRefs[idx]}
              key={`build-line-${idx}`}
              fontSize={12}
              fill={line.color}
              fontFamily="monospace"
              fontWeight={line.weight}
              opacity={0}
            >
              {"  → model (Run '"}
              <Txt fill={WARN_AMBER} fontWeight={700}>error_msg(p.model)</Txt>
              {"' and share traceback with LLM/Copilot)"}
            </Txt>
          );
        }
        return (
          <Txt
            ref={buildLineRefs[idx]}
            key={`build-line-${idx}`}
            text={line.text}
            fontSize={12}
            fill={line.color}
            fontFamily="monospace"
            fontWeight={line.weight}
            opacity={0}
          />
        );
      })}
    </Layout>
  );

  view.add(
    <Layout
      ref={rightCol}
      layout
      direction="column"
      alignItems="start"
      gap={35}
      x={210}
      y={10}
      width={240}
    >
      <Txt
        ref={expRefs[0]}
        fontSize={15}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
      >
        <Txt fill={ERR_RED} fontWeight={700}>model</Txt> has an error, which gets captured,
      </Txt>

      <Txt
        ref={expRefs[1]}
        fontSize={15}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
      >
        and <Txt fill={ERR_RED} fontWeight={700}>report</Txt> depends on <Txt fill={ERR_RED} fontWeight={700}>model</Txt> so it errors as well.
      </Txt>
    </Layout>
  );

  // Center bottom: Summary label
  view.add(
    <Txt
      ref={summaryLabel}
      text="errors get captured in any language and can get inspected from T's REPL"
      fontSize={18}
      fill="#e2e8f0"
      fontFamily="sans-serif"
      opacity={0}
      y={150}
    />
  );

  // ─── Phase 3: Animations ───────────────────────
  // 1. Initial build start and progress
  for (let i = 0; i <= 2; i++) {
    yield* buildLineRefs[i]().opacity(1, 0.25);
    yield* waitFor(0.3);
  }
  yield* waitFor(0.6);

  // 2. Error captured in model
  yield* all(
    buildLineRefs[4]().opacity(1, 0.25),
    buildLineRefs[5]().opacity(1, 0.25),
    expRefs[0]().opacity(1, 0.4, easeInOutCubic),
  );
  yield* waitFor(0.8);

  // 3. Error captured in report due to dependency
  yield* all(
    buildLineRefs[6]().opacity(1, 0.25),
    expRefs[1]().opacity(1, 0.4, easeInOutCubic),
  );
  yield* waitFor(0.8);

  // 4. Show recommendation lines
  yield* buildLineRefs[8]().opacity(1, 0.25);
  yield* waitFor(0.3);
  yield* buildLineRefs[9]().opacity(1, 0.25);
  yield* waitFor(0.5);

  // 5. Show summary label below
  yield* all(
    summaryLabel().opacity(1, 0.5, easeInOutCubic),
    summaryLabel().y(140, 0.5, easeInOutCubic),
  );

  yield* waitFor(3.0);

  // ─── Phase 4: Outro ─────────────────────────────
  yield* all(
    title().opacity(0, 0.3),
    subtitle().opacity(0, 0.3),
    leftCol().opacity(0, 0.3),
    rightCol().opacity(0, 0.3),
    summaryLabel().opacity(0, 0.3),
  );
  yield* waitFor(0.5);
});
