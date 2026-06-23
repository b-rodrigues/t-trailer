import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Rect, Layout, Circle, Line, Img } from '@motion-canvas/2d';
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
import logoImg from '../../logo.png';

const INDIGO = '#6366f1';
const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const R_COLOR = '#276DC3';
const PY_COLOR = '#FFD43B';
const JL_COLOR = '#389826';
const SH_COLOR = '#4EAA25';
const Q_COLOR = '#6B5B9E';

function* fadeIn(
  node: any,
  duration = 0.8,
  easing = easeInOutCubic,
) {
  yield* all(
    node.opacity(1, duration, easing),
    node.y(0, duration, easing),
  );
}

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(3.8);

  // ─── Phase 1: Logo & Tagline ────────────────────────────
  const logo = createRef<Img>();
  const tagline = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.add(
    <Layout layout direction="column" alignItems="center" gap={12} width="100%" y={-40}>
      <Img
        ref={logo}
        src={logoImg}
        width={150}
        height={150}
        opacity={0}
        scale={0.4}
      />
      <Txt
        ref={tagline}
        text="The Orchestration Engine"
        fontSize={38}
        fontWeight={700}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
        y={30}
      />
      <Txt
        ref={subtitle}
        text="for Polyglot Data Science"
        fontSize={26}
        fontWeight={300}
        fill={SLATE}
        fontFamily="sans-serif"
        opacity={0}
        y={30}
      />
    </Layout>,
  );

  yield* all(
    logo().opacity(1, 1.2, easeInOutCubic),
    logo().scale(1, 1.2, easeOutBack),
  );

  yield* waitFor(0.4);

  yield* all(
    tagline().opacity(1, 0.8, easeInOutCubic),
    tagline().y(0, 0.8, easeInOutCubic),
  );

  yield* all(
    subtitle().opacity(1, 0.8, easeInOutCubic),
    subtitle().y(0, 0.8, easeInOutCubic),
  );

  yield* waitFor(1.2);

  // ─── Phase 2: Pipeline Visualization ─────────────────────
  // Move title to top
  yield* all(
    logo().y(-240, 0.6, easeInOutCubic),
    logo().width(60, 0.6, easeInOutCubic),
    logo().height(60, 0.6, easeInOutCubic),
    tagline().opacity(0, 0.4, easeInOutCubic),
    subtitle().opacity(0, 0.4, easeInOutCubic),
  );

  const pipelineLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={pipelineLabel}
      text="Polyglot Pipeline"
      fontSize={34}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-140}
    />,
  );
  yield* pipelineLabel().opacity(1, 0.5);

  const langNodes = [
    { name: 'R', color: R_COLOR },
    { name: 'Python', color: PY_COLOR },
    { name: 'Julia', color: JL_COLOR },
    { name: 'Shell', color: SH_COLOR },
    { name: 'Quarto', color: Q_COLOR },
  ];

  const boxRefs = langNodes.map(() => createRef<Rect>());
  const labelRefs = langNodes.map(() => createRef<Txt>());
  const arrowRefs = langNodes.slice(0, -1).map(() => createRef<Txt>());

  // Create pipeline row
  const pipelineRow = (
    <Layout layout direction="row" alignItems="center" gap={16} y={-20}>
      {langNodes.map((lang, i) => [
        <Rect
          ref={boxRefs[i]}
          width={120}
          height={60}
          fill={lang.color}
          radius={8}
          opacity={0}
          y={40}
          shadowColor={lang.color}
          shadowBlur={15}
          shadowOffsetY={0}
          shadowOffsetX={0}
          layout
          justifyContent="center"
          alignItems="center"
        >
          <Txt
            ref={labelRefs[i]}
            text={lang.name}
            fill="#ffffff"
            fontSize={28}
            fontWeight={800}
            fontFamily="monospace"
          />
        </Rect>,
        ...(i < langNodes.length - 1
          ? [
            <Txt
              ref={arrowRefs[i]}
              text="→"
              fontSize={34}
              fill={SLATE}
              fontFamily="monospace"
              opacity={0}
            />,
          ]
          : []),
      ])}
    </Layout>
  );

  view.add(pipelineRow);

  // Animate nodes one by one
  for (let i = 0; i < langNodes.length; i++) {
    yield* all(
      boxRefs[i]().opacity(1, 0.5),
      boxRefs[i]().y(0, 0.5, easeOutBack),
    );
    if (i < langNodes.length - 1) {
      yield* all(
        arrowRefs[i]().opacity(1, 0.3),
      );
    }
  }

  // Fade in catchy summary sentence below the pipeline
  const catchySummary = createRef<Txt>();
  view.add(
    <Txt
      ref={catchySummary}
      text="T provides the seamless glue between nodes, making pipeline manipulation effortless."
      fontSize={22}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={70}
    />,
  );
  yield* catchySummary().opacity(1, 0.6, easeInOutCubic);
  yield* waitFor(2.0);

  // Fade out pipeline, summary, and logo to end the intro scene
  yield* all(
    pipelineLabel().opacity(0, 0.4),
    ...boxRefs.map(r => r().opacity(0, 0.4)),
    ...arrowRefs.map(r => r().opacity(0, 0.4)),
    catchySummary().opacity(0, 0.4),
    logo().opacity(0, 0.4),
  );

  yield* waitFor(0.5);
});
