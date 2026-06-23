import { makeScene2D } from '@motion-canvas/2d';
import { Txt, Rect, Layout, Circle, Img } from '@motion-canvas/2d';
import {
  createRef,
  all,
  waitFor,
  delay,
  easeInOutCubic,
  easeOutBack,
} from '@motion-canvas/core';
import logoImg from '../../logo.png';

const INDIGO = '#6366f1';
const SLATE = '#94a3b8';
const DARK = '#0f0f1a';

export default makeScene2D(function* (view) {
  view.fill(DARK);
  view.scale(3.8);

  const logo = createRef<Img>();
  const ctaText = createRef<Txt>();
  const website = createRef<Txt>();
  const github = createRef<Txt>();

  view.add(
    <Layout layout direction="column" alignItems="center" gap={16} width="100%" y={-40}>
      <Img
        ref={logo}
        src={logoImg}
        width={120}
        height={120}
        opacity={0}
        scale={0.4}
      />
      <Txt
        ref={ctaText}
        text="Build Reproducible Polyglot Pipelines Today."
        fontSize={18}
        fontWeight={500}
        fill="#e2e8f0"
        fontFamily="sans-serif"
        opacity={0}
        y={20}
      />
      <Txt
        ref={website}
        text="tstats-project.org"
        fontSize={32}
        fontWeight={700}
        fill={INDIGO}
        fontFamily="monospace"
        opacity={0}
        y={20}
      />
      <Txt
        ref={github}
        text="github.com/b-rodrigues/tlang"
        fontSize={16}
        fill={SLATE}
        fontFamily="monospace"
        opacity={0}
        y={20}
      />
    </Layout>,
  );

  // Logo animation
  yield* all(
    logo().opacity(1, 1.0, easeInOutCubic),
    logo().scale(1, 1.0, easeOutBack),
  );

  yield* waitFor(0.3);

  // CTA Text animation
  yield* all(
    ctaText().opacity(1, 0.8, easeInOutCubic),
    ctaText().y(0, 0.8, easeInOutCubic),
  );

  yield* waitFor(0.2);

  // Website and GitHub animation
  yield* all(
    website().opacity(1, 0.8, easeInOutCubic),
    website().y(0, 0.8, easeInOutCubic),
    delay(0.3, all(
      github().opacity(1, 0.8, easeInOutCubic),
      github().y(0, 0.8, easeInOutCubic),
    )),
  );

  yield* waitFor(3.5);

  // Outro fade out
  yield* all(
    logo().opacity(0, 0.6),
    ctaText().opacity(0, 0.6),
    website().opacity(0, 0.6),
    github().opacity(0, 0.6),
  );
  yield* waitFor(0.5);
});
