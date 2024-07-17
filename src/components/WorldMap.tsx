"use client";

import { useCallback, useEffect } from "react";
import { Country, getCountry } from "countries-and-timezones";
import * as d3 from "d3";
import getCountryISO2 from "country-iso-3-to-2";
import "./WorldMap.css";
import { Feature, GeoJsonProperties, Geometry } from "geojson";
import { Loader } from "./Loader";

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
    const oldSvg = d3.select("#map > svg");
    if (!oldSvg.empty()) {
      oldSvg
        .selectAll<SVGPathElement, Feature>("path")
        .on("click", handleOnClick);
      return;
    }

    const width = 960;
    const height = 500;
    const svg = d3
      .select("#map")
      .append("svg")
      .attr("class", "w-full")
      //.attr("viewBox", "0 0 24 24")
      .attr("width", width)
      .attr("height", height);

    const projection = d3
      .geoMercator()
      .scale(130)
      .translate([width / 2, height / 1.5]);
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
