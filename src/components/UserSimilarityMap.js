import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { saveAs } from "file-saver";
import UserPersonas from "./UserPersonas";

const UserSimilarityMap = ({ clusters }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!clusters) return;

    const width = 800;
    const height = 600;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const zoom = d3.zoom().on("zoom", (event) => {
      g.attr("transform", event.transform);
    });

    svg
      .attr("viewBox", [0, 0, width, height])
      .style("font", "12px sans-serif")
      .call(zoom);

    const g = svg.append("g");

    // Prepare nodes and assign cluster positions
    const nodes = clusters.flatMap((cluster, i) =>
      cluster.users.map((user) => ({
        ...user,
        clusterName: cluster.name,
        color: cluster.color,
        clusterX: width / 2 + 200 * Math.cos((i * 2 * Math.PI) / clusters.length),
        clusterY: height / 2 + 200 * Math.sin((i * 2 * Math.PI) / clusters.length),
      }))
    );

    // Simulation with clustering force
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "x",
        d3.forceX((d) => d.clusterX).strength(0.1)
      )
      .force(
        "y",
        d3.forceY((d) => d.clusterY).strength(0.1)
      )
      .force("charge", d3.forceManyBody().strength(-30))
      .force("collision", d3.forceCollide().radius(20))
      .on("tick", ticked);

    // Draw nodes
    const node = g
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 10)
      .attr("fill", (d) => d.color)
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .call(
        d3
          .drag()
          .on("start", (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("drag", (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on("end", (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Draw node labels
    const nodeLabels = g
      .selectAll("text")
      .data(nodes)
      .join("text")
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("dy", -15)
      .text((d) => d.name);

    // Add legend
    const legend = svg.append("g").attr("transform", "translate(20,20)");

    clusters.forEach((cluster, i) => {
      legend
        .append("circle")
        .attr("cx", 0)
        .attr("cy", i * 20)
        .attr("r", 5)
        .attr("fill", cluster.color);

      legend
        .append("text")
        .attr("x", 10)
        .attr("y", i * 20 + 5)
        .text(cluster.name);
    });

    function ticked() {
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      nodeLabels.attr("x", (d) => d.x).attr("y", (d) => d.y);
    }

    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [clusters]);

  const downloadMap = () => {
    const svgElement = svgRef.current;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const image = new Image();
    image.onload = () => {
      canvas.width = 800;
      canvas.height = 400;
      context.drawImage(image, 0, 0, 800, 600);
      URL.revokeObjectURL(url);

      canvas.toBlob((blob) => {
        saveAs(blob, "user_similarity_map.png");
      });
    };
    image.src = url;
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">User Clusters</h2>
      <svg ref={svgRef} width="800" height="600" className="mb-6"></svg>
      <button
        onClick={downloadMap}
        className="mb-6 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-500 transition"
      >
        Download Map as PNG
      </button>

      {/* Render User Personas */}
      {clusters && (
        <UserPersonas
          personas={clusters.map((cluster) => ({
            name: cluster.name,
            persona: cluster.persona,
          }))}
        />
      )}
    </div>
  );
};

export default UserSimilarityMap;
