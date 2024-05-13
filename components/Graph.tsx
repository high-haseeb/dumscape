"use client";
import useStateStore, { useConfigStore, Config } from "@/store/state";
import React, { useEffect, useRef, useState } from "react";

interface GraphProps {
  rangeMax?: number;
  rangeMin?: number;
}
const PAD = 100;
const GRID_COLOR = "#00000025";

const Graph: React.FC<GraphProps> = ({
  rangeMax = 10,
  rangeMin = 0,
  ...props
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const position = useStateStore((state) => state.position);
  const config = useConfigStore()
  useEffect(() => {
    update(canvasRef.current, position, config);
  }, [position]);

  return <canvas ref={canvasRef} {...props}></canvas>;
};

const initGraph = (
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  y_max: number,
  y_min: number,
) => {
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = "#ddd";
  ctx.fillRect(0, 0, cw, ch);

  ctx.lineWidth = 3;
  ctx.lineCap = "square";
  ctx.beginPath();
  ctx.moveTo(PAD, ch - PAD);
  ctx.lineTo(cw - PAD, ch - PAD);
  ctx.stroke();

  for (let index = y_min; index < y_max; index++) {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
    ctx.setLineDash([10, 30]);
    const y_offset = ((ch - 2 * PAD) / (y_max - y_min)) * index + PAD;
    ctx.moveTo(PAD, y_offset);
    ctx.lineTo(cw - PAD, y_offset);
    ctx.stroke();

    ctx.beginPath();
    ctx.setLineDash([10, 0]);
    const x_offset = ((cw - 2 * PAD) / (y_max - y_min)) * index + PAD * 1.5;
    ctx.moveTo(x_offset, ch - PAD);
    ctx.lineTo(x_offset, PAD);
    ctx.stroke();
  }
  // ctx.font = "28px Montserrat";
  return null;
};

const update = (canvas: HTMLCanvasElement, positions: number[], config: Config) => {
  const ctx = canvas.getContext("2d");
  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  canvas.width = cw;
  canvas.height = ch;

  initGraph(ctx, cw, ch, 10, 0);

  ctx.strokeStyle = "black";
  ctx.beginPath();
  // ctx.moveTo(PAD, ch - PAD);
  for (let index = 0; index < positions.length - 2; index++) {
    const cur_pos = positions[index];
    if(config.interp === 'bezier'){
      const next_pos = positions[index + 1];
      const ctrlX1 = PAD * index + PAD / 2;
      const ctrlY1 = ch + cur_pos * (ch / 2) - PAD;
      const ctrlX2 = PAD * (index + 1) - PAD / 2;
      const ctrlY2 = ch + next_pos * (ch / 2) - PAD;
      const endX = PAD * (index + 1);
      const endY = ch + next_pos * (ch / 2) - PAD;
      ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
    }else {
      ctx.lineTo(PAD * index + PAD, ch + (cur_pos * (ch / (2))) - PAD );
    }

  }
  ctx.stroke();
};

export default Graph;
