import React, { useState, useCallback, useRef } from "react";
import produce from "immer";

const numRows = 30;
const numCols = 35;

const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

const GolGrid = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 90);
  }, []);

  return (
    <div className="buttonz">
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "STOP" : "START"}
      </button>
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        RANDOM
      </button>
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        CLEAR
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][k] = grid[i][k] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                display: "flex",
                width: 20,
                height: 24,
                backgroundColor: grid[i][k] ? "gray" : undefined,
                border: "2px gray",
              }}
            />
          ))
        )}
      </div>
      <div className="rulez">
        <header>John Horton Conway</header>
        <h4>December 26, 1937 - April 11, 2020</h4>
        <h3>
          John Conway was an English mathematician active in the theory of
          finite groups, knot theory, number theory, combinatorial game theory
          and coding theory. He also made contributions to many branches of
          recreational mathematics, most notably the invention of the cellular
          automaton called the Game of Life.
        </h3>
        <h1>The rules are simple</h1>
        <h2>
          Any live cell with fewer than two live neighbors dies, as if by
          underpopulation.
        </h2>
        <h2>
          Any live cell with two or three live neighbors lives on to the next
          generation.
        </h2>
        <h2>
          Any live cell with more than three live neighbors dies, as if by
          overpopulation.
        </h2>
        <h2>
          Any dead cell with exactly three live neighbors becomes a live cell,
          as if by reproduction.
        </h2>
        <h4>(click RANDOM + START to see it in action)</h4>
      </div>
    </div>
  );
};

export default GolGrid;
