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
const GREEN = '#22c55e';
const PINK_COLOR = '#c792ea';
const INDIGO = '#6366f1';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(1.8);

  // ─── Phase 1: Title ────────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Interactive Debugging"
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
      text="Pre-configured subshells for language-aware debugging"
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

  // Left Column: Interactive REPL simulation
  const debugLines = [
    { type: 'input', prompt: 'T>', text: 'debug_node(p.model)', color: '#e2e8f0' },
    { type: 'log', text: 'Launching R interactive subshell...', color: SLATE },
    { type: 'log', text: "Loading environment for node 'model'...", color: SLATE },
    { type: 'dep', text: "raw", status: "OK (10,000 rows loaded)" },
    { type: 'dep', text: "tidy", status: "OK (9,850 rows loaded)" },
    { type: 'log', text: '', color: SLATE },
    { type: 'log', text: 'R version 4.4.1 -- "Race for Your Life"', color: SLATE },
    { type: 'input', prompt: '>', text: 'lm(z ~ age, data = tidy)', color: '#e2e8f0' },
  ];

  const lineRefs = debugLines.map(() => createRef<any>());

  // Right Column: Explanations
  const expRefs = [
    createRef<Txt>(),
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
      width={480}
    >
      {debugLines.map((line, idx) => {
        if (line.type === 'input') {
          return (
            <Layout ref={lineRefs[idx]} layout direction="row" gap={6} key={`line-${idx}`}>
              <Txt
                text={line.prompt}
                fontSize={12}
                fill={line.prompt === 'T>' ? PINK_COLOR : INDIGO}
                fontFamily="monospace"
                opacity={0}
              />
              <Txt
                text={line.text}
                fontSize={12}
                fill={line.color}
                fontFamily="monospace"
                fontWeight={700}
                opacity={0}
              />
            </Layout>
          );
        }
        if (line.type === 'dep') {
          return (
            <Txt
              ref={lineRefs[idx]}
              key={`line-${idx}`}
              fontSize={12}
              fill={SLATE}
              fontFamily="monospace"
              opacity={0}
            >
              {`  Loading dependency '${line.text}'... `}
              <Txt fill={GREEN} fontWeight={700}>{line.status}</Txt>
            </Txt>
          );
        }
        return (
          <Txt
            ref={lineRefs[idx]}
            key={`line-${idx}`}
            text={line.text}
            fontSize={12}
            fill={line.color}
            fontFamily="monospace"
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
      gap={25}
      x={210}
      y={10}
      width={240}
    >
      <Txt
        ref={expRefs[0]}
        fontSize={14}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
      >
        Launches an <Txt fill={PINK_COLOR} fontWeight={700}>R</Txt>, <Txt fill={PINK_COLOR} fontWeight={700}>Python</Txt>, or <Txt fill={PINK_COLOR} fontWeight={700}>Julia</Txt> subshell.
      </Txt>

      <Txt
        ref={expRefs[1]}
        fontSize={14}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
      >
        Companion <Txt fill={INDIGO} fontWeight={700}>tlang</Txt> packages load upstream dependency artifacts automatically.
      </Txt>

      <Txt
        ref={expRefs[2]}
        fontSize={14}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
      >
        Enables interactive, pre-configured workspace debugging.
      </Txt>
    </Layout>
  );

  // Center bottom: Summary label
  view.add(
    <Txt
      ref={summaryLabel}
      text="Interactive, language-aware debugging directly from the pipeline"
      fontSize={18}
      fill="#e2e8f0"
      fontFamily="sans-serif"
      opacity={0}
      y={150}
    />
  );

  // ─── Phase 3: Animations ───────────────────────
  // 1. Enter the T> debug_node(p.model) command
  yield* all(
    (lineRefs[0]() as any).children()[0].opacity(1, 0.15),
    (lineRefs[0]() as any).children()[1].opacity(1, 0.25),
  );
  yield* waitFor(0.5);

  // 2. Launch R shell and load environment
  yield* lineRefs[1]().opacity(1, 0.25);
  yield* lineRefs[2]().opacity(1, 0.25);
  yield* expRefs[0]().opacity(1, 0.4, easeInOutCubic);
  yield* waitFor(0.6);

  // 3. Load dependency artifacts
  yield* lineRefs[3]().opacity(1, 0.25);
  yield* waitFor(0.3);
  yield* lineRefs[4]().opacity(1, 0.25);
  yield* expRefs[1]().opacity(1, 0.4, easeInOutCubic);
  yield* waitFor(0.6);

  // 4. R Shell opens, user types interactive query
  yield* lineRefs[5]().opacity(1, 0.25);
  yield* lineRefs[6]().opacity(1, 0.25);
  yield* waitFor(0.4);
  yield* all(
    (lineRefs[7]() as any).children()[0].opacity(1, 0.15),
    (lineRefs[7]() as any).children()[1].opacity(1, 0.25),
    expRefs[2]().opacity(1, 0.4, easeInOutCubic),
  );
  yield* waitFor(0.6);

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
