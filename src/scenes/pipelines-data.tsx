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
  view.scale(3.8);

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
  const codeRefs = [
    createRef<Txt>(),
    createRef<Txt>(),
    createRef<Txt>(),
    createRef<Txt>(),
    createRef<Layout>(),
    createRef<Txt>(),
    createRef<Txt>(),
  ];

  const codeRawName = createRef<Txt>();
  const codeRawDep = createRef<Txt>();
  const codeTidyName = createRef<Txt>();
  const codeTidyDep = createRef<Txt>();
  const quartoComment = createRef<Txt>();
  const replLabel = createRef<Txt>();

  view.add(
    <Layout layout direction="column" alignItems="start" gap={6} y={-60} x={0}>
      {/* Line 0 */}
      <Txt ref={codeRefs[0]} fontSize={18} fill="#c792ea" fontFamily="monospace" opacity={0} y={10}>p = pipeline {"{"}</Txt>
      {/* Line 1 */}
      <Txt ref={codeRefs[1]} fontSize={18} fill="#e2e8f0" fontFamily="monospace" opacity={0} y={10}>{"  "}<Txt ref={codeRawName} fill="#e2e8f0" fontSize={18} fontWeight={400}>  raw </Txt>{"  = node(command = read_csv(\"data.csv\"), runtime = T)"}</Txt>
      {/* Line 2 */}
      <Txt ref={codeRefs[2]} fontSize={18} fill="#e2e8f0" fontFamily="monospace" opacity={0} y={10}>{"  "}<Txt ref={codeTidyName} fill="#e2e8f0" fontSize={18} fontWeight={400}>  tidy</Txt>{" = "}<Txt ref={codeRawDep} fill="#e2e8f0" fontSize={18} fontWeight={400}>raw</Txt>{" |> filter($age > 18) |> mutate($z = $x + $y)"}</Txt>
      {/* Line 3 */}
      <Txt ref={codeRefs[3]} fontSize={18} fill={R_COLOR} fontFamily="monospace" opacity={0} y={10}>{"  "}{"  mod  = rn(command = <{ lm(z ~ age, data = "}<Txt ref={codeTidyDep} fill={R_COLOR} fontSize={18} fontWeight={400}>tidy</Txt>{") }>, serializer = ^pmml)"}</Txt>
      {/* Line 4 */}
      <Layout ref={codeRefs[4]} layout direction="row" gap={12} opacity={0} y={10}>
        <Txt text="  plot = qn(script = &quot;report.qmd&quot;)" fontSize={18} fill={Q_COLOR} fontFamily="monospace" />
        <Txt ref={quartoComment} text="-- model is referenced in report.qmd" fontSize={18} fill="#60a5fa" fontFamily="monospace" opacity={0} y={10} />
      </Layout>
      {/* Line 5 */}
      <Txt ref={codeRefs[5]} fontSize={18} fill="#c792ea" fontFamily="monospace" opacity={0} y={10}>{"}"}</Txt>
      {/* Line 6 */}
      <Txt ref={codeRefs[6]} fontSize={18} fill="#c792ea" fontFamily="monospace" opacity={0} y={10}>build_pipeline(p)</Txt>
    </Layout>
  );

  view.add(
    <Txt
      ref={replLabel}
      text="In the T REPL call t_make() to actually build the pipeline"
      fontSize={22}
      fill="#e2e8f0"
      fontFamily="sans-serif"
      opacity={0}
      y={120}
    />
  );

  for (let i = 0; i < 6; i++) {
    yield* all(
      codeRefs[i]().opacity(1, 0.25),
      codeRefs[i]().y(0, 0.25, easeInOutCubic),
    );
  }
  yield* waitFor(0.8);

  // Pulse raw name and dep in green
  codeRawName().fontWeight(800);
  codeRawDep().fontWeight(800);
  yield* all(
    codeRawName().fontSize(24, 0.25, easeOutBack),
    codeRawName().fill('#22c55e', 0.25),
    codeRawDep().fontSize(24, 0.25, easeOutBack),
    codeRawDep().fill('#22c55e', 0.25),
  );
  yield* all(
    codeRawName().fontSize(18, 0.25, easeInOutCubic),
    codeRawDep().fontSize(18, 0.25, easeInOutCubic),
  );
  yield* waitFor(0.8);

  // Pulse tidy name and dep in red
  codeTidyName().fontWeight(800);
  codeTidyDep().fontWeight(800);
  yield* all(
    codeTidyName().fontSize(24, 0.25, easeOutBack),
    codeTidyName().fill('#ef4444', 0.25),
    codeTidyDep().fontSize(24, 0.25, easeOutBack),
    codeTidyDep().fill('#ef4444', 0.25),
  );
  yield* all(
    codeTidyName().fontSize(18, 0.25, easeInOutCubic),
    codeTidyDep().fontSize(18, 0.25, easeInOutCubic),
  );
  yield* waitFor(0.8);

  // Animate comment appearing after tidy highlight, and pulse it
  yield* all(
    quartoComment().opacity(1, 0.4, easeInOutCubic),
    quartoComment().y(0, 0.4, easeInOutCubic),
  );
  yield* quartoComment().fontSize(24, 0.25, easeOutBack);
  yield* quartoComment().fontSize(18, 0.25, easeInOutCubic);
  yield* waitFor(0.8);

  // Now show build_pipeline(p) line
  yield* all(
    codeRefs[6]().opacity(1, 0.25),
    codeRefs[6]().y(0, 0.25, easeInOutCubic),
  );
  yield* waitFor(0.5);

  // Animate build_pipeline REPL label below, without pulsing
  yield* all(
    replLabel().opacity(1, 0.5, easeInOutCubic),
    replLabel().y(100, 0.5, easeInOutCubic),
  );
  yield* waitFor(2.0);

  // ─── Outro ──────────────────────────────────────
  yield* all(
    title().opacity(0, 0.3),
    subtitle().opacity(0, 0.3),
    ...codeRefs.map(r => r().opacity(0, 0.3)),
    quartoComment().opacity(0, 0.3),
    replLabel().opacity(0, 0.3),
  );
  yield* waitFor(0.5);
});
