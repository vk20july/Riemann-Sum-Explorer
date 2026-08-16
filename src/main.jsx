import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const FUNCTION_LIBRARY = {
  quadratic: {
    name: "Quadratic",
    formula: "f(x) = x²",
    evaluate: x => x * x,
    exactArea: (start, end) => (end ** 3 - start ** 3) / 3,
    start: 0,
    end: 5,
    rectangles: 12
  },
  sine: {
    name: "Sine wave",
    formula: "f(x) = sin(x)",
    evaluate: Math.sin,
    exactArea: (start, end) => -Math.cos(end) + Math.cos(start),
    start: 0,
    end: Math.PI * 2,
    rectangles: 12
  },
  straightLine: {
    name: "Linear",
    formula: "f(x) = 2x + 1",
    evaluate: x => 2 * x + 1,
    exactArea: (start, end) => (end * end + end) - (start * start + start),
    start: 0,
    end: 5,
    rectangles: 12
  }
};

const SAMPLING_OPTIONS = [
  ["left", "Left"],
  ["midpoint", "Midpoint"],
  ["right", "Right"]
];

function calculateRiemann(functionToUse, start, end, count, sampling) {
  const width = (end - start) / count;
  let total = 0;

  for (let index = 0; index < count; index++) {
    const samplePoint =
      sampling === "left"
        ? start + index * width
        : sampling === "right"
          ? start + (index + 1) * width
          : start + (index + 0.5) * width;

    total += functionToUse(samplePoint) * width;
  }

  return total;
}

function buildRectangles(functionToUse, start, end, count, sampling) {
  const width = (end - start) / count;

  return Array.from({ length: count }, (_, index) => {
    const leftEdge = start + index * width;
    const rightEdge = leftEdge + width;

    const samplePoint =
      sampling === "left"
        ? leftEdge
        : sampling === "right"
          ? rightEdge
          : leftEdge + width / 2;

    return {
      leftEdge,
      rightEdge,
      samplePoint,
      height: functionToUse(samplePoint)
    };
  });
}

function formatValue(value) {
  if (!Number.isFinite(value)) return "—";
  return Math.abs(value) >= 100 ? value.toFixed(1) : value.toFixed(3);
}

function FunctionPlot({ functionToUse, start, end, count, sampling }) {
  const chartWidth = 920;
  const chartHeight = 500;
  const margin = { left: 62, right: 24, top: 34, bottom: 50 };

  const pointsX = Array.from(
    { length: 280 },
    (_, index) => start + (end - start) * index / 279
  );

  const pointsY = pointsX.map(functionToUse);

  let minimumY = Math.min(0, ...pointsY);
  let maximumY = Math.max(0, ...pointsY);

  if (Math.abs(maximumY - minimumY) < 1e-9) {
    maximumY += 1;
    minimumY -= 1;
  }

  const mapX = value =>
    margin.left +
    (value - start) / (end - start || 1) *
      (chartWidth - margin.left - margin.right);

  const mapY = value =>
    chartHeight -
    margin.bottom -
    (value - minimumY) / (maximumY - minimumY) *
      (chartHeight - margin.top - margin.bottom);

  const baseline = mapY(0);

  const curvePath = pointsX
    .map(
      (value, index) =>
        `${index ? "L" : "M"} ${mapX(value).toFixed(2)} ${mapY(functionToUse(value)).toFixed(2)}`
    )
    .join(" ");

  return (
    <div className="plot-frame">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} aria-label="Riemann sum graph">
        <defs>
          <linearGradient id="lineGradient" x1="0" x2="1">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient id="areaGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity=".28" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity=".16" />
          </linearGradient>
        </defs>

        <g className="plot-grid">
          {[.2, .4, .6, .8].map((position, index) => (
            <line
              key={index}
              x1={margin.left}
              x2={chartWidth - margin.right}
              y1={margin.top + position * (chartHeight - margin.top - margin.bottom)}
              y2={margin.top + position * (chartHeight - margin.top - margin.bottom)}
            />
          ))}
        </g>

        {buildRectangles(functionToUse, start, end, count, sampling).map(
          (rectangle, index) => {
            const left = mapX(rectangle.leftEdge);
            const right = mapX(rectangle.rightEdge);
            const topY = mapY(rectangle.height);
            const top = Math.min(topY, baseline);

            return (
              <rect
                key={index}
                x={left}
                y={top}
                width={Math.max(.5, right - left - .8)}
                height={Math.abs(baseline - topY)}
                rx="2"
                className="area-rectangle"
              />
            );
          }
        )}

        <line
          className="coordinate-axis"
          x1={margin.left}
          x2={chartWidth - margin.right}
          y1={baseline}
          y2={baseline}
        />

        <path d={curvePath} className="function-line" />

        <text
          x={chartWidth - margin.right - 8}
          y={baseline - 10}
          textAnchor="end"
          className="coordinate-label"
        >
          x
        </text>

        <text
          x={margin.left + 8}
          y={margin.top + 12}
          className="coordinate-label"
        >
          f(x)
        </text>
      </svg>

      <div className="plot-caption">
        <span><i className="legend-dot line-dot" /> Function</span>
        <span><i className="legend-dot area-dot" /> Rectangles</span>
        <span>n = <b>{count}</b></span>
      </div>
    </div>
  );
}

function App() {
  const [functionId, setFunctionId] = useState("quadratic");
  const activeFunction = FUNCTION_LIBRARY[functionId];

  const [startPoint, setStartPoint] = useState(activeFunction.start);
  const [endPoint, setEndPoint] = useState(activeFunction.end);
  const [rectangleCount, setRectangleCount] = useState(activeFunction.rectangles);
  const [samplingRule, setSamplingRule] = useState("midpoint");
  const [darkTheme, setDarkTheme] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationDelay, setAnimationDelay] = useState(650);

  const exactValue = useMemo(
    () => activeFunction.exactArea(startPoint, endPoint),
    [activeFunction, startPoint, endPoint]
  );

  const estimatedValue = useMemo(
    () =>
      calculateRiemann(
        activeFunction.evaluate,
        startPoint,
        endPoint,
        rectangleCount,
        samplingRule
      ),
    [activeFunction, startPoint, endPoint, rectangleCount, samplingRule]
  );

  const absoluteError = Math.abs(estimatedValue - exactValue);
  const rectangleWidth = (endPoint - startPoint) / rectangleCount;

  useEffect(() => {
    setStartPoint(activeFunction.start);
    setEndPoint(activeFunction.end);
    setRectangleCount(activeFunction.rectangles);
    setSamplingRule("midpoint");
    setIsPlaying(false);
  }, [functionId]);

  useEffect(() => {
    if (!isPlaying) return;

    const sequence = [2, 4, 8, 16, 32, 64, 100];

    const animationTimer = setInterval(() => {
      setRectangleCount(current => {
        const nextCount = sequence.find(value => value > current);

        if (!nextCount) {
          setIsPlaying(false);
          return current;
        }

        return nextCount;
      });
    }, animationDelay);

    return () => clearInterval(animationTimer);
  }, [isPlaying, animationDelay]);

  const convergenceData = [2, 4, 8, 16, 32, 64, 100].map(count => {
    const estimate = calculateRiemann(
      activeFunction.evaluate,
      startPoint,
      endPoint,
      count,
      samplingRule
    );

    return {
      count,
      estimate,
      error: Math.abs(estimate - exactValue)
    };
  });

  return (
    <div className={darkTheme ? "site-app night-mode" : "site-app"}>
      <header className="top-nav">
        <div className="identity">
          <div className="identity-symbol">∫</div>
          <div>
            <strong>CalcLab</strong>
            <small>Interactive mathematics</small>
          </div>
        </div>

        <button className="mode-switch" onClick={() => setDarkTheme(value => !value)}>
          {darkTheme ? "☀ Light" : "☾ Dark"}
        </button>
      </header>

      <main className="content-area">
        <section className="intro">
          <div>
            <div className="tag">CALCULUS • VISUAL EXPLORER</div>
            <h1>
              See the integral<br />
              <span>before you calculate it.</span>
            </h1>
            <p>
              Explore how rectangles become an exact area as their width shrinks.
              Change the function, sampling rule, and resolution — the picture and
              numbers respond instantly.
            </p>
          </div>

          <div className="formula-box">
            <div className="formula-title">THE IDEA</div>
            <div className="formula-text">∫ f(x) dx ≈ Σ f(xᵢ) Δx</div>
            <div className="formula-description">
              More rectangles → smaller Δx → better approximation
            </div>
          </div>
        </section>

        <section className="work-area">
          <div className="chart-card card">
            <div className="card-heading">
              <div>
                <span className="section-label">LIVE CANVAS</span>
                <h2>{activeFunction.formula}</h2>
              </div>
              <span className="live-badge"><span /> LIVE</span>
            </div>

            <FunctionPlot
              functionToUse={activeFunction.evaluate}
              start={startPoint}
              end={endPoint}
              count={rectangleCount}
              sampling={samplingRule}
            />

            <div className="learning-note">
              <div className="learning-icon">✦</div>
              <div>
                <b>The visual test</b>
                <p>
                  Drag the rectangle count upward. Watch the staircase tighten
                  around the curve — that is convergence in action.
                </p>
              </div>
            </div>
          </div>

          <aside className="settings-card card">
            <div className="card-heading">
              <div>
                <span className="section-label">CONTROL DECK</span>
                <h2>Experiment</h2>
              </div>
            </div>

            <label className="option-label">Choose a function</label>

            <div className="function-list">
              {Object.entries(FUNCTION_LIBRARY).map(([id, item]) => (
                <button
                  key={id}
                  className={
                    functionId === id
                      ? "function-option active"
                      : "function-option"
                  }
                  onClick={() => setFunctionId(id)}
                >
                  <span>{item.name}</span>
                  <strong>{item.formula}</strong>
                </button>
              ))}
            </div>

            <div className="setting-group">
              <div className="setting-heading">
                <span>Rectangles</span>
                <b>{rectangleCount}</b>
              </div>

              <input
                className="count-slider"
                type="range"
                min="2"
                max="100"
                value={rectangleCount}
                onChange={event => setRectangleCount(Number(event.target.value))}
              />

              <div className="slider-scale">
                <span>2</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div className="setting-group">
              <div className="setting-heading">
                <span>Sampling rule</span>
              </div>

              <div className="sampling-buttons">
                {SAMPLING_OPTIONS.map(([id, label]) => (
                  <button
                    key={id}
                    className={
                      samplingRule === id
                        ? "sampling-button active"
                        : "sampling-button"
                    }
                    onClick={() => setSamplingRule(id)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="range-inputs">
              <div>
                <label>Start (a)</label>
                <input
                  type="number"
                  value={startPoint}
                  onChange={event => setStartPoint(Number(event.target.value))}
                />
              </div>

              <div className="range-arrow">→</div>

              <div>
                <label>End (b)</label>
                <input
                  type="number"
                  value={endPoint}
                  onChange={event => setEndPoint(Number(event.target.value))}
                />
              </div>
            </div>

            <button
              className="animate-button"
              onClick={() => {
                setRectangleCount(2);
                setIsPlaying(true);
                setShowResults(true);
              }}
            >
              <span>▶</span> Play convergence
            </button>

            <div className="playback-row">
              <span>Animation speed</span>

              <select
                value={animationDelay}
                onChange={event => setAnimationDelay(Number(event.target.value))}
              >
                <option value="900">Slow</option>
                <option value="650">Normal</option>
                <option value="350">Fast</option>
              </select>
            </div>

            <div className="metric-grid">
              {[
                ["Δx", rectangleWidth],
                ["Approx.", estimatedValue],
                ["Exact", exactValue],
                ["Error", absoluteError]
              ].map(([label, value]) => (
                <div key={label}>
                  <small>{label}</small>
                  <strong>{formatValue(value)}</strong>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="explanation-card card">
          <div className="explanation-number">01</div>

          <div>
            <span className="section-label">THE AHA MOMENT</span>
            <h2>Why does a sum become an integral?</h2>
            <p>
              Each rectangle estimates a tiny piece of area. Increasing <b>n</b>
              makes every rectangle thinner, so the total estimate hugs the curve
              more closely. The integral is the limiting value of this process.
            </p>
          </div>

          <div className="explanation-equation">
            <span>n ↑</span>
            <span>Δx ↓</span>
            <strong>Σ → ∫</strong>
          </div>
        </section>

        {showResults && (
          <section className="results-card card">
            <div className="card-heading">
              <div>
                <span className="section-label">CONVERGENCE LAB</span>
                <h2>Numbers tell the same story</h2>
              </div>

              <button
                className="dismiss-button"
                onClick={() => {
                  setShowResults(false);
                  setIsPlaying(false);
                }}
              >
                Hide
              </button>
            </div>

            <div className="results-grid">
              <div className="error-bars">
                {convergenceData.map(row => {
                  const largestError = Math.max(
                    ...convergenceData.map(item => item.error),
                    1e-9
                  );

                  const barHeight = Math.max(
                    5,
                    100 - row.error / largestError * 90
                  );

                  return (
                    <div className="error-group" key={row.count}>
                      <div
                        className="error-bar"
                        style={{ height: `${barHeight}%` }}
                        title={`n=${row.count}, error=${formatValue(row.error)}`}
                      />
                      <small>{row.count}</small>
                    </div>
                  );
                })}
              </div>

              <div className="results-table-wrap">
                <table className="results-table">
                  <thead>
                    <tr>
                      <th>n</th>
                      <th>Approximation</th>
                      <th>Error</th>
                    </tr>
                  </thead>

                  <tbody>
                    {convergenceData.map(row => (
                      <tr key={row.count}>
                        <td>{row.count}</td>
                        <td>{formatValue(row.estimate)}</td>
                        <td>{formatValue(row.error)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      <footer className="page-footer">
        Built as an interactive learning experience • Riemann sums → definite integrals
      </footer>
    </div>
  );
}

createRoot(document.getElementById("app-root")).render(<App />);
