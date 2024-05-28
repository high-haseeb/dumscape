"use client";
import useStateStore from "@/store/state";
import { useConfigStore, Config } from '@/store/configStore';
import React, { useEffect, useRef } from "react";

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
  const { position, velocity } = useStateStore((state) => ({
    position: state.position,
    velocity: state.velocity,
  }));
  const config = useConfigStore();
  useEffect(() => {
    update(canvasRef.current, position, velocity, config);
  }, [position, velocity]);

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

  ctx.beginPath();
  ctx.moveTo(PAD, ch - PAD);
  ctx.lineTo(PAD, PAD);
  ctx.stroke();

  for (let index = y_min; index <= y_max; index++) {
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

  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.textAlign = "center";

  // Draw x-axis labels
  for (let i = 0; i <= 10; i++) {
    const x = ((cw - 2 * PAD) / 10) * i + PAD;
    const label = `${i}`;
    ctx.fillText(label, x, ch - PAD + 20);
  }

  // Draw y-axis labels
  ctx.textAlign = "right";
  for (let i = y_min; i <= y_max; i++) {
    const y = ch - ((ch - 2 * PAD) / (y_max - y_min)) * (i - y_min) - PAD;
    const label = `${i}`;
    ctx.fillText(label, PAD - 10, y + 3);
  }

  // Axis labels
  ctx.textAlign = "center";
  ctx.fillText("time", cw / 2, ch - PAD + 40);

  ctx.save();
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = "center";
  ctx.fillText("displacement", -ch / 2, PAD - 40);
  ctx.restore();

  // Legend
  const legendItems = [
    { label: "Position X", color: "red" },
    { label: "Position Y", color: "green" },
    { label: "Position Z", color: "blue" },
    { label: "Velocity X", color: "pink" },
    { label: "Velocity Y", color: "orange" },
    { label: "Velocity Z", color: "lime" },
  ];

  ctx.textAlign = "left";
  legendItems.forEach((item, index) => {
    ctx.fillStyle = item.color;
    ctx.fillRect(cw - PAD + 10, PAD + index * 20, 10, 10);
    ctx.fillStyle = "#000";
    ctx.fillText(item.label, cw - PAD + 30, PAD + index * 20 + 10);
  });

  return null;
};

const update = (
  canvas: HTMLCanvasElement | null,
  positions: { x: number[]; y: number[]; z: number[] },
  velocities: { x: number[]; y: number[]; z: number[] },
  config: Config,
) => {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const cw = canvas.clientWidth;
  const ch = canvas.clientHeight;
  canvas.width = cw;
  canvas.height = ch;

  initGraph(ctx, cw, ch, 10, 0);

  const colors = {
    x: 'red',
    y: 'green',
    z: 'blue',
    vx: 'pink',
    vy: 'orange',
    vz: 'lime',
  };

  const drawLine = (axis: 'x' | 'y' | 'z', color: string, data: number[]) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    for (let index = 0; index < data.length - 1; index++) {
      const cur_pos = data[index];
      const next_pos = data[index + 1];

      if (config.interp === "bezier") {
        const ctrlX1 = PAD * index + PAD / 2;
        const ctrlY1 = ch - cur_pos * (ch / 2) - PAD;
        const ctrlX2 = PAD * (index + 1) - PAD / 2;
        const ctrlY2 = ch - next_pos * (ch / 2) - PAD;
        const endX = PAD * (index + 1);
        const endY = ch - next_pos * (ch / 2) - PAD;
        ctx.bezierCurveTo(ctrlX1, ctrlY1, ctrlX2, ctrlY2, endX, endY);
      } else {
        ctx.lineTo(
          index * ((cw - 2 * PAD) / data.length) + PAD,
          ch - cur_pos * (ch / 4) - (ch / 2)
        );
      }
    }
    ctx.stroke();
  };

  // Draw position lines
  drawLine('x', colors.x, positions.x);
  drawLine('y', colors.y, positions.y);
  drawLine('z', colors.z, positions.z);

  // Draw velocity lines
  drawLine('x', colors.vx, velocities.x);
  drawLine('y', colors.vy, velocities.y);
  drawLine('z', colors.vz, velocities.z);
};

export default Graph;
