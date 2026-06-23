import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Rect, Layout, Line } from '@motion-canvas/2d';
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
  view.scale(3.8);

  // ─── Phase 1: Title & Build Output ─────────────
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
      x={-160}
      y={10}
    >
      {buildLines.map((line, idx) => {
        if (idx === 9) {
          return (
            <Txt
              ref={buildLineRefs[idx]}
              key={`build-line-${idx}`}
              fontSize={14}
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
            fontSize={14}
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
      x={330}
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
      fontSize={22}
      fill="#e2e8f0"
      fontFamily="sans-serif"
      opacity={0}
      y={150}
    />
  );

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

  // ─── Phase 2: collect_errors ───────────────────
  yield* all(
    subtitle().opacity(0, 0.3),
    leftCol().opacity(0, 0.3),
    rightCol().opacity(0, 0.3),
    summaryLabel().opacity(0, 0.3),
  );

  const collectLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={collectLabel}
      text="error_msg(p)"
      fontSize={20}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-190}
    />,
  );
  yield* collectLabel().opacity(1, 0.4);

  // Error table values (reshaped vertically)
  const errHeaders = ['node', 'status', 'code', 'message'];
  const errValues = ['model', 'Error', 'RuntimeError', 'fiter is not an exported object of dplyr'];

  const ehRefs = errHeaders.map(() => createRef<Rect>());
  const ehTxt = errHeaders.map(() => createRef<Txt>());

  const ecRefs = errHeaders.map(() => createRef<Rect>());
  const ecTxt = errHeaders.map(() => createRef<Txt>());

  for (let j = 0; j < errHeaders.length; j++) {
    // Key (Header) box
    view.add(
      <Rect
        ref={ehRefs[j]}
        width={100}
        height={32}
        fill={ERR_RED}
        opacity={0}
        radius={[4, 0, 0, 4]}
        x={-180}
        y={-120 + j * 38}
      >
        <Txt
          ref={ehTxt[j]}
          text={errHeaders[j]}
          fontSize={15}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );

    // Value (Cell) box
    view.add(
      <Rect
        ref={ecRefs[j]}
        width={460}
        height={32}
        fill="#1e1e30"
        opacity={0}
        radius={[0, 4, 4, 0]}
        x={100}
        y={-120 + j * 38}
      >
        <Txt
          ref={ecTxt[j]}
          text={errValues[j]}
          fontSize={14}
          fill="#e2e8f0"
          fontFamily="monospace"
        />
      </Rect>,
    );

    yield* all(
      ehRefs[j]().opacity(0.9, 0.15),
      ecRefs[j]().opacity(1, 0.15),
    );
  }

  yield* waitFor(3.0);

  // ─── Phase 6: Warnings ─────────────────────────
  yield* all(
    collectLabel().opacity(0, 0.2),
    ...ehRefs.map(r => r().opacity(0, 0.2)),
    ...ecRefs.map(r => r().opacity(0, 0.2)),
  );
  yield* waitFor(0.3);

  const warnLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={warnLabel}
      text="Warnings are data too"
      fontSize={26}
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
      fontSize={18}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-100}
      x={-240}
      offsetX={-1}
    />,
  );
  yield* warnCall().opacity(1, 0.4);

  // suppress_warnings(node)
  const suppressCall = createRef<Txt>();
  view.add(
    <Txt
      ref={suppressCall}
      text='suppress_warnings(node)    — hide diagnostics when expected'
      fontSize={18}
      fill={WARN_AMBER}
      fontFamily="monospace"
      opacity={0}
      y={-40}
      x={-240}
      offsetX={-1}
    />,
  );
  yield* suppressCall().opacity(1, 0.4);

  yield* waitFor(1.5);

  // ─── Ending the Scene ──────────────────────────
  yield* all(
    warnLabel().opacity(0, 0.3),
    warnCall().opacity(0, 0.3),
    suppressCall().opacity(0, 0.3),
    title().opacity(0, 0.3),
  );
  yield* waitFor(0.5);
});
