import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Rect, Layout, Line } from '@motion-canvas/2d';
import {
  createRef,
  all,
  waitFor,
  easeInOutCubic,
} from '@motion-canvas/core';

const INDIGO = '#6366f1';
const SLATE = '#94a3b8';
const DARK = '#0f0f1a';
const SUCCESS_GREEN = '#22c55e';
const WARN_AMBER = '#f59e0b';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(3.8);

  // ─── Title and Subtitle ─────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="Reproducible by Design"
      fontSize={32}
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
      text="Nix-powered package closures and sandboxed builds"
      fontSize={14}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={-190}
    />,
  );
  yield* subtitle().opacity(1, 0.5, easeInOutCubic);
  yield* waitFor(0.8);

  // ─── Visual Diagram: The Nix Sandbox ────────────
  const sandboxBox = createRef<Rect>();
  const sandboxLabel = createRef<Txt>();
  view.add(
    <Rect
      ref={sandboxBox}
      width={270}
      height={180}
      stroke="#334155"
      lineWidth={2}
      fill="#111122"
      radius={8}
      opacity={0}
      x={160}
      y={-30}
    >
      <Txt
        ref={sandboxLabel}
        text="Nix Build Sandbox"
        fontSize={14}
        fontWeight={700}
        fill={INDIGO}
        fontFamily="monospace"
        y={-75}
      />
    </Rect>,
  );

  const insideSandbox = [
    { text: '✓ Minimal isolated filesystem', color: '#e2e8f0' },
    { text: '✓ Pinned compiler toolchain', color: '#e2e8f0' },
    { text: '✓ Network access disabled', color: WARN_AMBER },
    { text: '✓ No host pollution / drift', color: SUCCESS_GREEN },
  ];

  const insideRefs = insideSandbox.map(() => createRef<Txt>());
  for (let i = 0; i < insideSandbox.length; i++) {
    sandboxBox().add(
      <Txt
        ref={insideRefs[i]}
        text={insideSandbox[i].text}
        fontSize={13}
        fill={insideSandbox[i].color}
        fontFamily="sans-serif"
        opacity={0}
        x={-120}
        offsetX={-1}
        y={-45 + i * 28}
      />,
    );
  }

  // Left column description list
  const features = [
    { title: 'Projects are Nix Flakes', desc: 'Self-contained environment in flake.lock' },
    { title: 'LLM-Friendly Reference', desc: 'Built-in reference helps AI generate pipelines' },
    { title: 'Bit-for-Bit Determinism', desc: 'Identical outputs, regardless of host machine' },
  ];

  const featRefs = features.map(() => createRef<Txt>());
  const featDescRefs = features.map(() => createRef<Txt>());

  for (let i = 0; i < features.length; i++) {
    view.add(
      <Txt
        ref={featRefs[i]}
        text={features[i].title}
        fontSize={16}
        fill="#e2e8f0"
        fontFamily="monospace"
        opacity={0}
        x={-240}
        offsetX={-1}
        y={-110 + i * 55}
      />,
    );
    view.add(
      <Txt
        ref={featDescRefs[i]}
        text={features[i].desc}
        fontSize={13}
        fill={SLATE}
        fontFamily="sans-serif"
        opacity={0}
        x={-240}
        offsetX={-1}
        y={-88 + i * 55}
      />,
    );
  }

  // Animate left side and sandbox in parallel
  yield* all(
    sandboxBox().opacity(1, 0.4),
    ...insideRefs.map(r => r().opacity(1, 0.4)),
    ...featRefs.map(r => r().opacity(1, 0.4)),
    ...featDescRefs.map(r => r().opacity(1, 0.4)),
  );

  yield* waitFor(2.5);

  // ─── Fade out to Tagline ────────────────────────
  yield* all(
    title().opacity(0, 0.4),
    subtitle().opacity(0, 0.4),
    sandboxBox().opacity(0, 0.4),
    ...insideRefs.map(r => r().opacity(0, 0.4)),
    ...featRefs.map(r => r().opacity(0, 0.4)),
    ...featDescRefs.map(r => r().opacity(0, 0.4)),
  );

  const tagline = createRef<Txt>();
  view.add(
    <Txt
      ref={tagline}
      text="Everything is a value. Environment is a function."
      fontSize={20}
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
      text="Reproducibility by Design."
      fontSize={16}
      fill={INDIGO}
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

  yield* waitFor(2.5);

  yield* all(
    tagline().opacity(0, 0.4),
    taglineSub().opacity(0, 0.4),
  );
  yield* waitFor(0.5);
});
