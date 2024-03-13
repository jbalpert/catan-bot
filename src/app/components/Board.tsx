"use client";
import React, { useEffect, useRef } from "react";
import {
  BASE_CATAN_NUMBERS,
  BASE_CATAN_TILES,
  BASE_BOARD_LAYOUT,
  CATAN_TILE_TYPES,
  CATAN_TILE_COLORS,
} from "../utility/constants";
type Props = {};
const Board = (props: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const width = canvas.width;
        const height = canvas.height;
        const HEXAGON_ANGLE = (2 * Math.PI) / 6;
        const HEXAGON_RADIUS = 50;

        const drawHexagon = (x: number, y: number) => {
          console.log("Starting Coords", x, y);
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            const angle = HEXAGON_ANGLE * i;
            const nextX = x + HEXAGON_RADIUS * Math.sin(angle);
            const nextY = y + HEXAGON_RADIUS * Math.cos(angle);
            ctx.lineTo(nextX, nextY);
          }
          ctx.closePath();
        };

        const drawTile = (x: number, y: number, tileType: CATAN_TILE_TYPES, pip: number) => {
          drawHexagon(x, y);
          ctx.fillStyle = CATAN_TILE_COLORS[tileType];
          ctx.fill();
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.stroke();
          if (tileType !== CATAN_TILE_TYPES.DESERT) {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Arial";
            const text = pip.toString();
            const squareSize = HEXAGON_RADIUS / 1.5;
            ctx.fillStyle = "white";
            ctx.fillRect(x - squareSize / 2, y - squareSize / 2, squareSize, squareSize);
            ctx.fillStyle = "black";
            ctx.fillText(text, x, y);
          }
        };

        const drawBoard = (startX: number, startY: number) => {
          let x = startX;
          let y = startY;
          let baseBoardIndex = 0;
          let numCols = BASE_BOARD_LAYOUT[baseBoardIndex];
          for (let i = 0; i < BASE_CATAN_TILES.length; i++) {
            const pip = BASE_CATAN_NUMBERS[i];
            drawTile(x, y, BASE_CATAN_TILES[i], pip);
            if (i === 2 || i === 6 || i === 11 || i === 15 || i === 18) {
              const newNumCols = BASE_BOARD_LAYOUT[++baseBoardIndex];
              if (numCols < newNumCols) {
                x = startX - HEXAGON_RADIUS * Math.sin(HEXAGON_ANGLE);
              } else {
                x = startX + HEXAGON_RADIUS * Math.sin(HEXAGON_ANGLE);
              }

              startX = x;
              numCols = newNumCols;

              y += HEXAGON_RADIUS * 1.5;
            } else {
              x += HEXAGON_RADIUS * 2 * Math.sin(HEXAGON_ANGLE);
            }
          }
        };

        drawBoard(400, 400); // Draw the board starting at (100, 100)
      }
    }
  }, []);
  return <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />;
};

export default Board;
