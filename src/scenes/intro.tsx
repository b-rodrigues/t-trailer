import {makeScene2D} from '@motion-canvas/2d';
import {Txt, Rect, Layout, Circle, Line} from '@motion-canvas/2d';
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
const SH_COLOR = '#4EAA25';

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

  // ─── Phase 1: Logo & Tagline ────────────────────────────
  const logo = createRef<Txt>();
  const tagline = createRef<Txt>();
  const subtitle = createRef<Txt>();

  view.add(
    <Layout layout direction="column" alignItems="center" gap={12} width="100%" y={-40}>
      <Txt
        ref={logo}
        text="T"
        fontSize={150}
        fontWeight={900}
        fontFamily="monospace"
        fill={INDIGO}
        opacity={0}
        scale={0.4}
        shadowColor={INDIGO}
        shadowBlur={40}
        shadowOffsetY={0}
        shadowOffsetX={0}
      />
      <Txt
        ref={tagline}
        text="The Orchestration Engine"
        fontSize={32}
        fontWeight={700}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
        y={30}
      />
      <Txt
        ref={subtitle}
        text="for Polyglot Data Science"
        fontSize={22}
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
    logo().shadowBlur(60, 1.2, easeInOutCubic),
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
    logo().y(-280, 0.6, easeInOutCubic),
    logo().fontSize(60, 0.6, easeInOutCubic),
    logo().shadowBlur(0, 0.6, easeInOutCubic),
    tagline().opacity(0, 0.4, easeInOutCubic),
    subtitle().opacity(0, 0.4, easeInOutCubic),
  );

  const pipelineLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={pipelineLabel}
      text="Polyglot Pipeline"
      fontSize={28}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      y={-140}
    />,
  );
  yield* pipelineLabel().opacity(1, 0.5);

  const langNodes = [
    {name: 'R', color: R_COLOR},
    {name: 'Python', color: PY_COLOR},
    {name: 'Julia', color: JL_COLOR},
    {name: 'Shell', color: SH_COLOR},
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
        >
          <Txt
            ref={labelRefs[i]}
            text={lang.name}
            fill="#ffffff"
            fontSize={24}
            fontWeight={800}
            fontFamily="monospace"
          />
        </Rect>,
        ...(i < langNodes.length - 1
          ? [
              <Txt
                ref={arrowRefs[i]}
                text="→"
                fontSize={28}
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
  yield* waitFor(0.8);

  // ─── Phase 3: Feature highlights ─────────────────────────
  // Fade out pipeline
  yield* all(
    pipelineLabel().opacity(0, 0.4),
    ...boxRefs.map(r => r().opacity(0, 0.4)),
    ...arrowRefs.map(r => r().opacity(0, 0.4)),
  );

  const features = [
    {icon: '▸', text: 'Reproducibility-First', desc: 'Built into the language'},
    {icon: '▸', text: 'Nix-Powered', desc: 'Hermetic by design'},
    {icon: '▸', text: 'Errors as Values', desc: 'No silent failures'},
    {icon: '▸', text: 'AI-Native', desc: 'LLM-friendly by construction'},
    {icon: '▸', text: 'Mandatory Pipelines', desc: 'Always a DAG'},
  ];

  const featureRefs = features.map(() => ({
    icon: createRef<Txt>(),
    text: createRef<Txt>(),
    desc: createRef<Txt>(),
  }));

  const featureLayout = (
    <Layout layout direction="column" alignItems="start" gap={16} y={40} x={-60}>
      {features.map((f, i) => (
        <Layout layout direction="row" alignItems="center" gap={12} opacity={0} y={20}>
          <Txt ref={featureRefs[i].icon} text={f.icon} fontSize={20} fill={INDIGO} fontFamily="monospace" />
          <Layout layout direction="column" gap={2}>
            <Txt ref={featureRefs[i].text} text={f.text} fontSize={22} fontWeight={600} fill="#e2e8f0" fontFamily="sans-serif" />
            <Txt ref={featureRefs[i].desc} text={f.desc} fontSize={14} fill={SLATE} fontFamily="sans-serif" />
          </Layout>
        </Layout>
      ))}
    </Layout>
  );

  view.add(featureLayout);

  const featHeader = createRef<Txt>();
  view.add(
    <Txt
      ref={featHeader}
      text="Why T?"
      fontSize={28}
      fontWeight={700}
      fill="#e2e8f0"
      fontFamily="sans-serif"
      opacity={0}
      y={-140}
      x={-60}
    />,
  );
  yield* featHeader().opacity(1, 0.5);

  for (let i = 0; i < features.length; i++) {
    yield* waitFor(0.15);
    yield* all(
      featureRefs[i].icon().opacity(1, 0.4),
      featureRefs[i].text().opacity(1, 0.4),
      featureRefs[i].desc().opacity(1, 0.4),
      featureRefs[i].icon().y(0, 0.4, easeInOutCubic),
      featureRefs[i].text().y(0, 0.4, easeInOutCubic),
      featureRefs[i].desc().y(0, 0.4, easeInOutCubic),
    );
  }

  yield* waitFor(1.2);

  // ─── Phase 4: Website ────────────────────────────────────
  yield* all(
    featHeader().opacity(0, 0.4),
    ...featureRefs.flatMap(r => [
      r.icon().opacity(0, 0.4),
      r.text().opacity(0, 0.4),
      r.desc().opacity(0, 0.4),
    ]),
  );

  const website = createRef<Txt>();
  const github = createRef<Txt>();

  view.add(
    <Layout layout direction="column" alignItems="center" gap={8}>
      <Txt
        ref={website}
        text="tstats-project.org"
        fontSize={36}
        fontWeight={700}
        fill={INDIGO}
        fontFamily="monospace"
        opacity={0}
        y={-20}
      />
      <Txt
        ref={github}
        text="github.com/b-rodrigues/tlang"
        fontSize={18}
        fill={SLATE}
        fontFamily="monospace"
        opacity={0}
        y={-20}
      />
    </Layout>,
  );

  yield* all(
    website().opacity(1, 0.8, easeInOutCubic),
    website().y(0, 0.8, easeInOutCubic),
    delay(0.4, all(
      github().opacity(1, 0.8, easeInOutCubic),
      github().y(0, 0.8, easeInOutCubic),
    )),
  );

  yield* waitFor(2);
});
