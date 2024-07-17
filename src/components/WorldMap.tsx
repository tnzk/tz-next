"use client";

import { useCallback, useEffect } from "react";
import { Country, getCountry } from "countries-and-timezones";
import * as d3 from "d3";
import getCountryISO2 from "country-iso-3-to-2";
import "./WorldMap.css";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Loader } from "./Loader";

const SVG_WIDTH = 960;
const SVG_HEIGHT = 600;
const HOUR_WIDTH = SVG_WIDTH / 24;
const MIN_WIDTH = HOUR_WIDTH / 60;

function addOffsetBand(
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  offset: string,
  color: string
) {
  const [hour, min] = offset.split(":").map((s) => parseInt(s));
  const bandX = (hour + 12) * HOUR_WIDTH - HOUR_WIDTH / 2 + min * MIN_WIDTH;
  svg
    .insert("rect", ":last-child")
    .attr("class", `offset_band fill-${color}-500/50`)
    .attr("x", bandX)
    .attr("y", 0)
    .attr("width", HOUR_WIDTH)
    .attr("height", SVG_HEIGHT);
  svg
    .insert("rect", ":last-child")
    .attr("class", `offset_band fill-${color}-500`)
    .attr("x", bandX + HOUR_WIDTH / 2)
    .attr("y", 0)
    .attr("width", 0.5)
    .attr("height", SVG_HEIGHT);
}

type Props = {
  offsets: string[];
  onClick: (country: Country) => void;
};
export default function WorldMap({
  offsets = [],
  onClick = (_: Country) => {},
}: Props) {
  const handleOnClick = useCallback(
    function (_: any, d: Feature) {
      const c2 = getCountryISO2(d.id);
      const country = getCountry(c2);
      if (country) {
        onClick?.(country);
      }
    },
    [onClick]
  );

  useEffect(() => {
    if (!offsets) return;
    const svg = d3.select("#map > svg");
    const offsetBands = svg.selectAll("rect.offset_band");
    offsetBands.remove();

    if (offsets[0]) addOffsetBand(svg, offsets[0], "yellow");
    if (offsets[1]) addOffsetBand(svg, offsets[1], "yellow");

    console.log(offsets);
  }, [offsets]);

  useEffect(() => {
    const existingSvg = d3.select("#map > svg");
    if (!existingSvg.empty()) {
      existingSvg
        .selectAll<SVGPathElement, Feature>("path")
        .on("click", handleOnClick);
      return;
    }

    const svg = d3
      .select("#map")
      .append("svg")
      .attr("class", "w-full")
      .attr(
        "viewBox",
        [0, 0, SVG_WIDTH, SVG_HEIGHT].map((n) => n.toString()).join(" ")
      );
    console.log(
      "sdasa",
      [0, 0, SVG_WIDTH, SVG_HEIGHT].map((n) => n.toString()).join(" ")
    );

    const projection = d3
      .geoMercator()
      .scale(150)
      .translate([SVG_WIDTH / 2, SVG_HEIGHT / 1.5]);
    const path = d3.geoPath().projection(projection);
    d3.json("/world.geojson")
      .then(function (data: unknown) {
        d3.select("#loader").remove();
        svg
          .selectAll("path")
          .data((data as GeoJSON.FeatureCollection).features)
          .enter()
          .append("path")
          .attr("d", path)
          .attr(
            "class",
            "country stroke stroke-gray-500 fill-gray-100 hover:fill-lime-200"
          )
          .on("click", handleOnClick);
      })
      .catch(function (error) {
        console.error("Error loading the map data: ", error);
      });
  }, [handleOnClick]);

  return (
    <div className="w-full">
      <div
        id="loader"
        className="flex justify-center items-center text-center h-72"
      >
        <Loader />
      </div>
      <div
        className="bg-blue-500 flex items-center justify-center mx-auto"
        id="map"
      ></div>
    </div>
  );
}
