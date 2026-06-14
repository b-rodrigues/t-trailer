import {makeScene2D} from '@motion-canvas/2d';
import {Txt, Rect, Layout, Line, Circle} from '@motion-canvas/2d';
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
const SUCCESS_GREEN = '#22c55e';

export default makeScene2D(function* (view) {
  view.fill(DARK);

  // ─── Phase 1: Title ────────────────────────────
  const title = createRef<Txt>();
  view.add(
    <Txt
      ref={title}
      text="But T is also a data language"
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
      text="Full data manipulation and statistical modeling — built in"
      fontSize={15}
      fill={SLATE}
      fontFamily="sans-serif"
      opacity={0}
      y={-190}
    />,
  );
  yield* subtitle().opacity(1, 0.5, easeInOutCubic);
  yield* waitFor(0.8);

  // ─── Phase 2: DataFrame grid ───────────────────
  const dfLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={dfLabel}
      text="df"
      fontSize={16}
      fontWeight={700}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      x={-220}
      y={-140}
    />,
  );
  yield* dfLabel().opacity(1, 0.3);

  // Build small DataFrame grid (4x4)
  const cols = ['name', 'age', 'segment', 'value'];
  const data = [
    ['Alice', '25', 'A', '10.5'],
    ['Bob',   '17', 'B', '8.2'],
    ['Carol', '32', 'A', '15.1'],
    ['Dave',  '19', 'B', '12.3'],
  ];

  const colW = 75;
  const rowH = 26;
  const gridX = -colW * 1.5;

  const hdrRefs = cols.map(() => createRef<Rect>());
  const hdrTxtRefs = cols.map(() => createRef<Txt>());

  for (let j = 0; j < cols.length; j++) {
    view.add(
      <Rect
        ref={hdrRefs[j]}
        width={colW - 3}
        height={rowH}
        fill={INDIGO}
        opacity={0}
        radius={3}
        x={gridX + j * colW}
        y={-105}
      >
        <Txt
          ref={hdrTxtRefs[j]}
          text={cols[j]}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* hdrRefs[j]().opacity(0.9, 0.15);
  }

  const cellBgRefs = data.map((_, i) => createRef<Rect>());
  const cellRefs = data.map(() => cols.map(() => createRef<Rect>()));
  const cellTxtRefs = data.map(() => cols.map(() => createRef<Txt>()));

  for (let i = 0; i < data.length; i++) {
    const bgColor = i % 2 === 0 ? '#1a1a2e' : '#16162a';
    view.add(
      <Rect
        ref={cellBgRefs[i]}
        width={colW * cols.length}
        height={rowH}
        fill={bgColor}
        opacity={0}
        radius={3}
        x={gridX + (colW * (cols.length - 1)) / 2}
        y={-105 + (i + 1) * rowH}
      />,
    );
    yield* cellBgRefs[i]().opacity(0.4, 0.1);

    for (let j = 0; j < cols.length; j++) {
      view.add(
        <Rect
          ref={cellRefs[i][j]}
          width={colW - 3}
          height={rowH - 2}
          fill="transparent"
          opacity={0}
          x={gridX + j * colW}
          y={-105 + (i + 1) * rowH}
        >
          <Txt
            ref={cellTxtRefs[i][j]}
            text={data[i][j]}
            fontSize={11}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* cellRefs[i][j]().opacity(1, 0.08);
    }
  }

  yield* waitFor(0.8);

  // ─── Phase 3: colcraft chain ───────────────────
  const verbs = [
    {code: '|> filter($age > 18)',           effect: [1, 3]}, // keep rows 0, 2, 3 (index 0,2,3)
    {code: '|> group_by($segment)',          effect: 'group'},
    {code: '|> summarize($avg = mean($value, na_rm = true))', effect: 'summarize'},
  ];

  for (let v = 0; v < verbs.length; v++) {
    yield* waitFor(0.5);

    const verbLabel = createRef<Txt>();
    view.add(
      <Txt
        ref={verbLabel}
        text={verbs[v].code}
        fontSize={13}
        fill={PY_COLOR}
        fontFamily="monospace"
        opacity={0}
        y={-140}
        x={-160}
      />,
    );
    yield* verbLabel().opacity(1, 0.3);

    if (v === 0) {
      // filter: dim rows where age <= 18 (Bob=17, index 1; Dave=19, index 3)
      // Actually filter($age > 18) keeps Alice(25), Carol(32), Dave(19)
      // Dim Bob (row 1)
      yield* all(
        ...cellRefs[1].map(c => c().opacity(0.15, 0.4)),
        cellBgRefs[1]().opacity(0.1, 0.4),
      );
    } else if (v === 1) {
      // group_by: highlight segment column
      yield* hdrRefs[2]().fill('#f59e0b', 0.4);
    } else if (v === 2) {
      // summarize: transform to grouped output
      yield* all(
        ...cellRefs[0].map(c => c().opacity(0, 0.3)),
        ...cellRefs[1].map(c => c().opacity(0, 0.3)),
        ...cellRefs[3].map(c => c().opacity(0, 0.3)),
        cellBgRefs[0]().opacity(0, 0.3),
        cellBgRefs[1]().opacity(0, 0.3),
        cellBgRefs[3]().opacity(0, 0.3),
      );

      // Row 0 became "A" → mean = (10.5 + 15.1)/2 = 12.8
      // Row 2 became "B" → mean = (8.2 + 12.3)/2 = 10.25
      // Replace labels
      yield* all(
        cellTxtRefs[0][0]().text('A', 0.3),
        cellTxtRefs[0][3]().text('12.80', 0.3),
        cellTxtRefs[2][0]().text('B', 0.3),
        cellTxtRefs[2][3]().text('10.25', 0.3),
      );

      // Remove age and value column headers, rename
      yield* all(
        hdrTxtRefs[1]().opacity(0, 0.3),
        hdrTxtRefs[2]().fill('#f59e0b', 0.3),
        hdrTxtRefs[3]()?.text('avg', 0.3),
      );
    }

    yield* waitFor(0.8);

    yield* all(
      verbLabel().opacity(0, 0.2),
    );
  }

  // Reset for next phase
  yield* all(
    ...cellRefs.flat().map(c => c().opacity(0, 0.3)),
    ...cellBgRefs.map(r => r().opacity(0, 0.3)),
    ...hdrRefs.map(r => r().opacity(0, 0.3)),
    dfLabel().opacity(0, 0.3),
  );
  yield* waitFor(0.3);

  // ─── Phase 4: pivot_longer ─────────────────────
  const pivotLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={pivotLabel}
      text="pivot_longer(df, cols = [q1, q2, q3], names_to = 'quarter', values_to = 'score')"
      fontSize={13}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-200}
    />,
  );
  yield* pivotLabel().opacity(1, 0.4);

  // Wide table
  const wideCols = ['id', 'q1', 'q2', 'q3'];
  const wideData = [
    ['A', '85', '92', '88'],
    ['B', '78', '81', '85'],
  ];

  const wHdrRefs = wideCols.map(() => createRef<Rect>());
  const wHdrTxt = wideCols.map(() => createRef<Txt>());

  for (let j = 0; j < wideCols.length; j++) {
    view.add(
      <Rect
        ref={wHdrRefs[j]}
        width={colW - 3}
        height={rowH}
        fill={INDIGO}
        opacity={0}
        radius={3}
        x={gridX + j * colW}
        y={-100}
      >
        <Txt
          ref={wHdrTxt[j]}
          text={wideCols[j]}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* wHdrRefs[j]().opacity(0.9, 0.15);
  }

  const wCellRefs = wideData.map(() => wideCols.map(() => createRef<Rect>()));
  const wCellTxt = wideData.map(() => wideCols.map(() => createRef<Txt>()));

  for (let i = 0; i < wideData.length; i++) {
    for (let j = 0; j < wideCols.length; j++) {
      view.add(
        <Rect
          ref={wCellRefs[i][j]}
          width={colW - 3}
          height={rowH - 2}
          fill="transparent"
          opacity={0}
          x={gridX + j * colW}
          y={-100 + (i + 1) * rowH}
        >
          <Txt
            ref={wCellTxt[i][j]}
            text={wideData[i][j]}
            fontSize={11}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* wCellRefs[i][j]().opacity(1, 0.1);
    }
  }

  yield* waitFor(0.8);

  // Arrow
  const arrow = createRef<Txt>();
  view.add(
    <Txt
      ref={arrow}
      text="→"
      fontSize={40}
      fill={SLATE}
      fontFamily="monospace"
      opacity={0}
      x={100}
      y={-60}
    />,
  );
  yield* arrow().opacity(1, 0.3);

  // Long table
  const longCols = ['id', 'quarter', 'score'];
  const longData = [
    ['A', 'q1', '85'],
    ['A', 'q2', '92'],
    ['A', 'q3', '88'],
    ['B', 'q1', '78'],
    ['B', 'q2', '81'],
    ['B', 'q3', '85'],
  ];

  const longGridX = 180;
  const lHdrRefs = longCols.map(() => createRef<Rect>());
  const lHdrTxt = longCols.map(() => createRef<Txt>());

  for (let j = 0; j < longCols.length; j++) {
    view.add(
      <Rect
        ref={lHdrRefs[j]}
        width={colW - 3}
        height={rowH}
        fill={'#f59e0b'}
        opacity={0}
        radius={3}
        x={longGridX + j * colW}
        y={-100}
      >
        <Txt
          ref={lHdrTxt[j]}
          text={longCols[j]}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* lHdrRefs[j]().opacity(0.9, 0.15);
  }

  const lCellRefs = longData.map(() => longCols.map(() => createRef<Rect>()));
  const lCellTxt = longData.map(() => longCols.map(() => createRef<Txt>()));

  for (let i = 0; i < longData.length; i++) {
    for (let j = 0; j < longCols.length; j++) {
      view.add(
        <Rect
          ref={lCellRefs[i][j]}
          width={colW - 3}
          height={rowH - 2}
          fill="transparent"
          opacity={0}
          x={longGridX + j * colW}
          y={-100 + (i + 1) * rowH}
        >
          <Txt
            ref={lCellTxt[i][j]}
            text={longData[i][j]}
            fontSize={11}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* lCellRefs[i][j]().opacity(1, 0.06);
    }
  }

  yield* waitFor(1);

  // Clean up
  yield* all(
    pivotLabel().opacity(0, 0.2),
    ...wHdrRefs.map(r => r().opacity(0, 0.2)),
    ...wCellRefs.flat().map(r => r().opacity(0, 0.2)),
    ...lHdrRefs.map(r => r().opacity(0, 0.2)),
    ...lCellRefs.flat().map(r => r().opacity(0, 0.2)),
    arrow().opacity(0, 0.2),
  );
  yield* waitFor(0.3);

  // ─── Phase 5: left_join ────────────────────────
  const joinLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={joinLabel}
      text="left_join(x, y, by = $id)"
      fontSize={16}
      fontWeight={700}
      fill={INDIGO}
      fontFamily="monospace"
      opacity={0}
      y={-200}
    />,
  );
  yield* joinLabel().opacity(1, 0.4);

  // Table x
  const xCols = ['id', 'name'];
  const xData = [['1', 'Alice'], ['2', 'Bob'], ['3', 'Carol']];
  const jColW = 80;

  const xHdrRefs = xCols.map(() => createRef<Rect>());
  const xHdrTxt = xCols.map(() => createRef<Txt>());
  const xCellRefs = xData.map(() => xCols.map(() => createRef<Rect>()));
  const xCellTxt = xData.map(() => xCols.map(() => createRef<Txt>()));

  for (let j = 0; j < xCols.length; j++) {
    view.add(
      <Rect
        ref={xHdrRefs[j]}
        width={jColW - 3}
        height={rowH}
        fill={'#3b82f6'}
        opacity={0}
        radius={3}
        x={-200 + j * jColW}
        y={-120}
      >
        <Txt
          ref={xHdrTxt[j]}
          text={xCols[j]}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* xHdrRefs[j]().opacity(0.9, 0.15);
  }

  for (let i = 0; i < xData.length; i++) {
    for (let j = 0; j < xCols.length; j++) {
      view.add(
        <Rect
          ref={xCellRefs[i][j]}
          width={jColW - 3}
          height={rowH - 2}
          fill="transparent"
          opacity={0}
          x={-200 + j * jColW}
          y={-120 + (i + 1) * rowH}
        >
          <Txt
            ref={xCellTxt[i][j]}
            text={xData[i][j]}
            fontSize={11}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* xCellRefs[i][j]().opacity(1, 0.1);
    }
  }

  // Table y
  const yCols = ['id', 'score'];
  const yData = [['1', '95'], ['2', '87'], ['4', '92']];

  const yHdrRefs = yCols.map(() => createRef<Rect>());
  const yHdrTxt = yCols.map(() => createRef<Txt>());
  const yCellRefs = yData.map(() => yCols.map(() => createRef<Rect>()));
  const yCellTxt = yData.map(() => yCols.map(() => createRef<Txt>()));

  for (let j = 0; j < yCols.length; j++) {
    view.add(
      <Rect
        ref={yHdrRefs[j]}
        width={jColW - 3}
        height={rowH}
        fill={'#8b5cf6'}
        opacity={0}
        radius={3}
        x={-50 + j * jColW}
        y={-120}
      >
        <Txt
          ref={yHdrTxt[j]}
          text={yCols[j]}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* yHdrRefs[j]().opacity(0.9, 0.15);
  }

  for (let i = 0; i < yData.length; i++) {
    for (let j = 0; j < yCols.length; j++) {
      view.add(
        <Rect
          ref={yCellRefs[i][j]}
          width={jColW - 3}
          height={rowH - 2}
          fill="transparent"
          opacity={0}
          x={-50 + j * jColW}
          y={-120 + (i + 1) * rowH}
        >
          <Txt
            ref={yCellTxt[i][j]}
            text={yData[i][j]}
            fontSize={11}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* yCellRefs[i][j]().opacity(1, 0.1);
    }
  }

  yield* waitFor(0.6);

  // Merge arrow + result
  const joinArrow2 = createRef<Txt>();
  view.add(
    <Txt
      ref={joinArrow2}
      text="→"
      fontSize={30}
      fill={SLATE}
      fontFamily="monospace"
      opacity={0}
      x={120}
      y={-90}
    />,
  );
  yield* joinArrow2().opacity(1, 0.3);

  // Result table
  const rCols = ['id', 'name', 'score'];
  const rData = [['1', 'Alice', '95'], ['2', 'Bob', '87'], ['3', 'Carol', 'NA']];

  const rHdrRefs = rCols.map(() => createRef<Rect>());
  const rHdrTxt = rCols.map(() => createRef<Txt>());
  const rCellRefs = rData.map(() => rCols.map(() => createRef<Rect>()));
  const rCellTxt = rData.map(() => rCols.map(() => createRef<Txt>()));

  const rGridX = 220;

  for (let j = 0; j < rCols.length; j++) {
    view.add(
      <Rect
        ref={rHdrRefs[j]}
        width={jColW - 3}
        height={rowH}
        fill={INDIGO}
        opacity={0}
        radius={3}
        x={rGridX + j * jColW}
        y={-120}
      >
        <Txt
          ref={rHdrTxt[j]}
          text={rCols[j]}
          fontSize={12}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* rHdrRefs[j]().opacity(0.9, 0.15);
  }

  for (let i = 0; i < rData.length; i++) {
    for (let j = 0; j < rCols.length; j++) {
      const isNA = rData[i][j] === 'NA';
      view.add(
        <Rect
          ref={rCellRefs[i][j]}
          width={jColW - 3}
          height={rowH - 2}
          fill="transparent"
          opacity={0}
          x={rGridX + j * jColW}
          y={-120 + (i + 1) * rowH}
        >
          <Txt
            ref={rCellTxt[i][j]}
            text={rData[i][j]}
            fontSize={11}
            fill={isNA ? '#ef4444' : '#e2e8f0'}
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* rCellRefs[i][j]().opacity(1, 0.08);
    }
  }

  yield* waitFor(1);

  // Clean up
  yield* all(
    joinLabel().opacity(0, 0.2),
    ...xHdrRefs.map(r => r().opacity(0, 0.2)),
    ...xCellRefs.flat().map(r => r().opacity(0, 0.2)),
    ...yHdrRefs.map(r => r().opacity(0, 0.2)),
    ...yCellRefs.flat().map(r => r().opacity(0, 0.2)),
    ...rHdrRefs.map(r => r().opacity(0, 0.2)),
    ...rCellRefs.flat().map(r => r().opacity(0, 0.2)),
    joinArrow2().opacity(0, 0.2),
  );
  yield* waitFor(0.3);

  // ─── Phase 6: lm + predict ─────────────────────
  const modelLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={modelLabel}
      text='model = lm(data, mpg ~ wt + hp)'
      fontSize={15}
      fill={R_COLOR}
      fontFamily="monospace"
      opacity={0}
      y={-200}
    />,
  );
  yield* modelLabel().opacity(1, 0.4);

  // Scatter plot axis
  const plotX = -40;
  const plotY = 30;
  const plotW = 280;
  const plotH = 220;

  const xAxis = createRef<Line>();
  const yAxis = createRef<Line>();

  view.add(
    <Line
      ref={xAxis}
      points={[{x: plotX - plotW / 2, y: plotY + plotH / 2}, {x: plotX + plotW / 2, y: plotY + plotH / 2}]}
      stroke={SLATE}
      lineWidth={2}
      opacity={0}
    />,
  );
  view.add(
    <Line
      ref={yAxis}
      points={[{x: plotX - plotW / 2, y: plotY - plotH / 2}, {x: plotX - plotW / 2, y: plotY + plotH / 2}]}
      stroke={SLATE}
      lineWidth={2}
      opacity={0}
    />,
  );

  // Axis labels
  const xLabel = createRef<Txt>();
  const yLabel = createRef<Txt>();
  view.add(
    <Txt ref={xLabel} text="wt" fontSize={13} fill={SLATE} fontFamily="monospace" opacity={0} x={plotX + plotW / 2 + 10} y={plotY + plotH / 2 + 5} />,
  );
  view.add(
    <Txt ref={yLabel} text="mpg" fontSize={13} fill={SLATE} fontFamily="monospace" opacity={0} x={plotX - plotW / 2 - 25} y={plotY - 10} />,
  );

  yield* all(
    xAxis().opacity(0.6, 0.3),
    yAxis().opacity(0.6, 0.3),
    xLabel().opacity(0.8, 0.3),
    yLabel().opacity(0.8, 0.3),
  );

  // Data points (simulating mtcars)
  const points = [
    {x: -80, y: 70},  {x: -20, y: 40},  {x: 40, y: 10},
    {x: -60, y: 60},  {x: 0, y: 45},    {x: 60, y: 20},
    {x: -40, y: 80},  {x: 20, y: 55},   {x: 80, y: 35},
    {x: -100, y: 90}, {x: -90, y: 75},  {x: 50, y: 30},
  ];

  const pointRefs = points.map(() => createRef<Circle>());

  for (let i = 0; i < points.length; i++) {
    view.add(
      <Circle
        ref={pointRefs[i]}
        width={6}
        height={6}
        fill={INDIGO}
        opacity={0}
        x={plotX + points[i].x}
        y={plotY + points[i].y}
      />,
    );
    yield* pointRefs[i]().opacity(0.8, 0.08);
  }

  yield* waitFor(0.5);

  // Regression line
  const regLine = createRef<Line>();
  view.add(
    <Line
      ref={regLine}
      points={[
        {x: plotX - 110, y: plotY + 95},
        {x: plotX + 95, y: plotY + 10},
      ]}
      stroke={R_COLOR}
      lineWidth={3}
      opacity={0}
    />,
  );
  yield* regLine().opacity(0.9, 0.6);

  // Coef display
  const coefLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={coefLabel}
      text='coef(model)  →  $mpg = 37.2 − 3.9·wt − 0.03·hp'
      fontSize={12}
      fill="#e2e8f0"
      fontFamily="monospace"
      opacity={0}
      x={210}
      y={-100}
    />,
  );
  yield* coefLabel().opacity(1, 0.4);

  yield* waitFor(0.6);

  // predict
  const predictLabel = createRef<Txt>();
  view.add(
    <Txt
      ref={predictLabel}
      text='predict(new_data, model)'
      fontSize={15}
      fontWeight={700}
      fill={PY_COLOR}
      fontFamily="monospace"
      opacity={0}
      y={140}
      x={-140}
    />,
  );
  yield* predictLabel().opacity(1, 0.4);

  // New data table (small)
  const newCols = ['wt', 'hp'];
  const newData = [['2.5', '110'], ['3.0', '150'], ['3.5', '200']];
  const newColW = 60;

  const newHdr = newCols.map(() => createRef<Rect>());
  const newHdrTxt = newCols.map(() => createRef<Txt>());
  const newCell = newData.map(() => newCols.map(() => createRef<Rect>()));
  const newCellTxt = newData.map(() => newCols.map(() => createRef<Txt>()));
  const newGridX = -180;

  for (let j = 0; j < newCols.length; j++) {
    view.add(
      <Rect
        ref={newHdr[j]}
        width={newColW - 2}
        height={20}
        fill={'#f59e0b'}
        opacity={0}
        radius={2}
        x={newGridX + j * newColW}
        y={185}
      >
        <Txt
          ref={newHdrTxt[j]}
          text={newCols[j]}
          fontSize={10}
          fontWeight={700}
          fill="#ffffff"
          fontFamily="monospace"
        />
      </Rect>,
    );
    yield* newHdr[j]().opacity(0.9, 0.12);
  }

  for (let i = 0; i < newData.length; i++) {
    for (let j = 0; j < newCols.length; j++) {
      view.add(
        <Rect
          ref={newCell[i][j]}
          width={newColW - 2}
          height={18}
          fill="transparent"
          opacity={0}
          x={newGridX + j * newColW}
          y={185 + (i + 1) * 20}
        >
          <Txt
            ref={newCellTxt[i][j]}
            text={newData[i][j]}
            fontSize={10}
            fill="#e2e8f0"
            fontFamily="monospace"
          />
        </Rect>,
      );
      yield* newCell[i][j]().opacity(1, 0.08);
    }
  }

  yield* waitFor(0.5);

  // Arrow + prediction results
  const predArrow = createRef<Txt>();
  view.add(
    <Txt
      ref={predArrow}
      text="→"
      fontSize={28}
      fill={SLATE}
      fontFamily="monospace"
      opacity={0}
      x={-20}
      y={210}
    />,
  );

  const predResult = createRef<Txt>();
  view.add(
    <Txt
      ref={predResult}
      text='[22.4, 19.8, 16.1]'
      fontSize={14}
      fontWeight={700}
      fill={SUCCESS_GREEN}
      fontFamily="monospace"
      opacity={0}
      x={90}
      y={210}
    />,
  );

  yield* all(
    predArrow().opacity(1, 0.3),
    predResult().opacity(1, 0.4),
  );

  // Prediction dots on regression line
  const predPoints = [
    {x: plotX - 52, y: plotY + 57},  // wt=2.5
    {x: plotX - 22, y: plotY + 48},  // wt=3.0
    {x: plotX + 18, y: plotY + 35},  // wt=3.5
  ];

  const predDotRefs = predPoints.map(() => createRef<Circle>());

  for (let i = 0; i < predPoints.length; i++) {
    view.add(
      <Circle
        ref={predDotRefs[i]}
        width={10}
        height={10}
        fill={SUCCESS_GREEN}
        opacity={0}
        stroke={DARK}
        lineWidth={2}
        x={predPoints[i].x}
        y={predPoints[i].y}
      />,
    );
    yield* all(
      predDotRefs[i]().opacity(1, 0.4),
      predDotRefs[i]().scale(1, 0.3, easeOutBack),
    );
  }

  yield* waitFor(1.2);

  // ─── Phase 7: Closing tagline ──────────────────
  yield* all(
    modelLabel().opacity(0, 0.3),
    coefLabel().opacity(0, 0.3),
    predictLabel().opacity(0, 0.3),
    predArrow().opacity(0, 0.3),
    predResult().opacity(0, 0.3),
    ...pointRefs.map(r => r().opacity(0, 0.3)),
    ...predDotRefs.map(r => r().opacity(0, 0.3)),
    regLine().opacity(0, 0.3),
    xAxis().opacity(0, 0.3),
    yAxis().opacity(0, 0.3),
    xLabel().opacity(0, 0.3),
    yLabel().opacity(0, 0.3),
    ...newHdr.map(r => r().opacity(0, 0.3)),
    ...newCell.flat().map(r => r().opacity(0, 0.3)),
  );

  const tagline = createRef<Txt>();
  view.add(
    <Txt
      ref={tagline}
      text="Orchestrate in any language. Analyze in T."
      fontSize={28}
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
      text="Full-stack data science — from ETL to modeling"
      fontSize={15}
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
