import React, { useState, useCallback, useRef } from "react";
import produce from "immer";
// we need to change the state of our grid without mutating it so we used Immer
// to handle that task

// creating the size of the actual grid
const numRows = 30;
const numCols = 35;

//
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

// this is iterating through the values above to output an empty grid to 30x35. however we can
// change this to antything we want. We set the value to 0.
const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }
  return rows;
};

//  In this grid we are storing state because the values are constantly changing
const GolGrid = () => {
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  const [running, setRunning] = useState(false);

  const runningRef = useRef(running);
  runningRef.current = running;

  // this is a recustive function so when we call runSimulation its going to make
  // sure its running.  runningRef == running

  const runSimulation = useCallback(() => {
    if (!runningRef.current) {
      return;
    }
    // this is where the "rules" are implemented in the grid.
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neighbors += g[newI][newJ];
              }
            });
            // this evaluates the neighbors of each cell has.
            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSimulation, 90);
  }, []);
  // below are the button functions that
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
        // this is using the built in css grid. it is repeating the columns
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            //  this is where the grid design is set. It is set so that if a place of the grid is "Alive" then it shows
            //  up in gray. If the cell is "Dead" then it shows up undefined.

            <div
              key={`${i}-${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                display: "flex",
                width: 20,
                height: 24,
                backgroundColor: grid[i][j] ? "gray" : undefined,
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
