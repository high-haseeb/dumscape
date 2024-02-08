'use client'
import React, { useEffect } from "react";
import * as d3 from "d3";

function Graphs() {
  const data = [
    { x: 0, y: 30 },
    { x: 1, y: 40 },
    { x: 2, y: 20 },
    { x: 3, y: 50 },
    { x: 4, y: 10 },
  ];

  // Set up the SVG container
  const width = 400;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 30, left: 50 };

  useEffect(() => {
    const svg = d3
      .select("#line-graph-container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.x)])
      .range([margin.left, width - margin.right]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.y)])
      .range([height - margin.bottom, margin.top]);

    // Create the line function
    const line = d3
      .line()
      .x((d) => xScale(d.x))
      .y((d) => yScale(d.y));

    // Draw the line
    svg
      .append("path")
      .data([data])
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 2)
      .attr("d", line);

    // Add X and Y axis
    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale));

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale));
  });
  return <div>Hello World</div>;
}

export default Graphs;
