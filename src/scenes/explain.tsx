import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Rect, Layout } from '@motion-canvas/2d';
import {
  createRef,
  all,
  waitFor,
  easeInOutCubic,
} from '@motion-canvas/core';

const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const ERR_RED = '#ef4444';
const SUCCESS_GREEN = '#22c55e';
const WARN_AMBER = '#f59e0b';
const INDIGO = '#6366f1';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(3.8);

  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Deep Introspection"
      fontSize={36}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-220}
    />,
  );
  yield* title().opacity(1, 0.6, easeInOutCubic);

  const explainLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={explainLabel}
      text="explain() — Deep introspection"
      fontSize={24}
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
      fontSize={18}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-140}
      x={-200}
      offsetX={-1}
    />,
  );
  yield* explainErrLabel().opacity(1, 0.3);

  // Structured dict visualization
  const dictLines = [
    'kind:          "value"',
    'type:          "Error"',
    'error_code:    "ValueError"',
    'error_message: "Must be positive"',
    'context:       { ... }',
  ];

  const dictRefs = dictLines.map(() => createRef<Txt>());
  for (let i = 0; i < dictLines.length; i++) {
    view.add(
      <Txt
        ref={dictRefs[i]}
        text={dictLines[i]}
        fontSize={16}
        fill="#e2e8f0"
        fontFamily="monospace"
        opacity={0}
        x={-80}
        y={-130 + i * 28}
        offsetX={-1}
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
      fontSize={18}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-140}
      x={-200}
      offsetX={-1}
    />,
  );
  yield* explainDfLabel().opacity(1, 0.3);

  const dfDictLines = [
    'kind:     "value"',
    'type:     "DataFrame"',
    'nrow:     32',
    'ncol:     11',
    'schema:   { mpg: Float, wt: Float, cyl: Int, ... }',
    'na_stats: { mpg: 0, wt: 0, ... }',
  ];

  const dfDictRefs = dfDictLines.map(() => createRef<Txt>());
  for (let i = 0; i < dfDictLines.length; i++) {
    view.add(
      <Txt
        ref={dfDictRefs[i]}
        text={dfDictLines[i]}
        fontSize={16}
        fill="#e2e8f0"
        fontFamily="monospace"
        opacity={0}
        x={-80}
        y={-130 + i * 28}
        offsetX={-1}
      />,
    );
    yield* dfDictRefs[i]().opacity(1, 0.15);
  }

  yield* waitFor(0.8);

  // ─── Closing tagline ──────────────────
  yield* all(
    explainLabel().opacity(0, 0.3),
    explainDfLabel().opacity(0, 0.3),
    ...dfDictRefs.map(r => r().opacity(0, 0.3)),
    title().opacity(0, 0.3),
  );

  const tagline = createRef<Txt>();
  view.add(
    <Txt
      ref={tagline}
      text="Everything is a value that can be inspected"
      fontSize={32}
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
      fontSize={20}
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
