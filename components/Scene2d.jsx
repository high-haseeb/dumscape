"use client";
import React, { useEffect, useRef, useState } from "react";
import Matter from "matter-js";

const Scene = () => {
  const canvasRef = useRef();
  const drawArrow = (ctx, x, y, size, dir) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    if (dir === "right") {
      ctx.lineTo(x, y + size);
      ctx.lineTo(x + 2 * size, y);
      ctx.lineTo(x, y - size);
    } else if (dir === "up") {
      ctx.lineTo(x + size, y);
      ctx.lineTo(x, y - 2 * size);
      ctx.lineTo(x - size, y);
    }
    ctx.fill();
  };
  const drawAxes = (ctx, width, height, padding) => {
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(padding, 100);
    ctx.moveTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    drawArrow(ctx, width - padding, height - padding, 10, "right");
    drawArrow(ctx, padding, padding, 10, "up");

    ctx.font = "28px sans";
    ctx.textAlign = "center";
    ctx.fillText("time", width - padding, height - padding + 30);
    ctx.fillText("position", padding, padding - 30);
  };
  function mapRange(value, inputMin, inputMax, outputMin, outputMax) {
    const inputRange = inputMax - inputMin;
    const outputRange = outputMax - outputMin;
    const positionInRange = (value - inputMin) / inputRange;
    return outputMin + positionInRange * outputRange;
  }
  const setupGraph = (ctx, padding, width, height, points) => {
    drawAxes(ctx, width, height, padding);
    ctx.moveTo(padding, height - padding);
    ctx.beginPath();
    let markingsY = 10;
    const step = Math.ceil(
      (Math.max(...points) - Math.min(...points)) / markingsY,
    );
    for (let i = 0; i < markingsY; ++i) {
      const y = mapRange(i, 0, markingsY, height - padding, padding);
      ctx.moveTo(padding, y);
      ctx.fillText(`${i * step}`, padding - 40, y);
      ctx.lineTo(padding - 10, y);
      ctx.stroke();
    }
  };
  const pointsRef = useRef([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const draw = (timestamp) => {
    const points = pointsRef.current;
    const ctx = canvasRef.current.getContext("2d");
    const canvasWidth = canvasRef.current.clientWidth;
    const canvasHeight = canvasRef.current.clientHeight;
    canvasRef.current.width = canvasWidth;
    canvasRef.current.height = canvasHeight;
    ctx.clearRect(0, 0, canvasHeight, canvasWidth);
    const padding = 100;
    setupGraph(ctx, padding, canvasWidth, canvasHeight, points);
    ctx.moveTo(padding, canvasHeight - padding);
    if (points.length > 10) {
      for (let i = 1; i < 10; i++) {
        const startX = mapRange(i - 1, 0, 9, padding, canvasWidth - padding);
        const startY = mapRange(
          points[i - 1],
          Math.min(...points),
          Math.max(...points),
          canvasHeight - padding,
          padding,
        );
        const endX = mapRange(i, 0, 9, padding, canvasWidth - padding);
        const endY = mapRange(
          points[i],
          Math.min(...points),
          Math.max(...points),
          canvasHeight - padding,
          padding,
        );
        const control1X = startX + (endX - startX) / 3;
        const control1Y = startY;
        const control2X = endX - (endX - startX) / 3;
        const control2Y = endY;

        ctx.bezierCurveTo(
          control1X,
          control1Y,
          control2X,
          control2Y,
          endX,
          endY,
        );
      }
    }
    ctx.stroke();
  };
  useEffect(() => {
    let animationFrameId;
    if (canvasRef.current) {
      const desiredFPS = 60;
      const frameInterval = 1000 / desiredFPS;
      let lastFrameTime = 0;
      const drawFrame = (timestamp) => {
        const elapsedTime = timestamp - lastFrameTime;
        if (elapsedTime > frameInterval) {
          draw(timestamp);
          lastFrameTime = timestamp;
          animationFrameId = requestAnimationFrame(drawFrame);
        } else {
          animationFrameId = requestAnimationFrame(drawFrame);
        }
      };
      drawFrame();
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [canvasRef]);
  const callback = (pos) => {
    pointsRef.current.push(pos)
    pointsRef.current.shift();
  }
  return (
    <div className="w-full h-full pb-10 flex gap-2">
      <canvas
        ref={canvasRef}
        className="bg-gray-400 w-1/2 h-full rounded-3xl"
      ></canvas>
      <Model callback={callback} className="w-1/2 h-full rounded-3xl"/>
    </div>
  );
};

export default Scene;

import { Engine, Render, Bodies, World } from "matter-js";
import { Model } from "./rapier";

function Comp({ setPos: posRef, props }) {
  const scene = useRef();
  const engine = useRef(Engine.create());

  useEffect(() => {
    const cw = scene.current.clientWidth;
    const ch = scene.current.clientHeight;
    const render = Render.create({
      element: scene.current,
      engine: engine.current,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "transparent",
      },
    });

    World.add(engine.current.world, [
      Bodies.rectangle(0,ch, cw, 20, { isStatic: true }),
    ]);

    const ball = Bodies.circle(100, 100, 10 + Math.random() * 30, {
      mass: 10,
      restitution: 1,
      friction: 0.005,
      render: {
        fillStyle: "#0000ff",
      },
    });
    World.add(engine.current.world, [ball]);
    const updateBallPos = () => {
      posRef.push(ball.velocity.y.toFixed(1));
      posRef.shift()
      requestAnimationFrame(updateBallPos);
    }
    updateBallPos();

    Matter.Runner.run(engine.current);
    Render.run(render);

    return () => {
      Render.stop(render);
      World.clear(engine.current.world);
      Engine.clear(engine.current);
      render.canvas.remove();
      render.canvas = null;
      render.context = null;
      render.textures = {};
    };
  }, []);

  return <div ref={scene} className="w-1/2 h-full bg-gray-500 rounded-3xl" />;
}
