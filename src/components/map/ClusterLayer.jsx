import { useEffect } from "preact/hooks";
import { DBWorker } from "../../contexts";

const rest2Paint = (rest) => {
  const colors = Object.keys(rest)
    .filter((key) => key.includes(".color"))
    .sort()
    .map((key) => rest[key]);
  const radiuses = Object.keys(rest)
    .filter((key) => key.includes(".radius"))
    .sort()
    .map((key) => parseInt(rest[key]));
  const ends = Object.keys(rest)
    .filter((key) => key.includes(".end"))
    .sort()
    .map((key) => parseInt(rest[key]));
  let circleColor = ["step", ["get", "point_count"]];
  let circleRadius = ["step", ["get", "point_count"]];
  if (colors.length === 1) {
    circleColor = colors[0];
    circleRadius = radiuses[0];
  } else {
    for (let index = 0; index < colors.length; index++) {
      circleColor.push(colors[index]);
      circleRadius.push(radiuses[index]);
      if (ends[index]) {
        circleColor.push(ends[index]);
        circleRadius.push(ends[index]);
      }
    }
  }

  return { circleColor, circleRadius };
};

function ClusterLayer({
  map,
  layerName,
  tableName,
  longColumn,
  latColumn,
  ...rest
}) {
  useEffect(() => {
    map.addSource(layerName, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
      cluster: true,
    });

    const { circleColor, circleRadius } = rest2Paint(rest);
    map.addLayer({
      id: layerName + "_circle",
      source: layerName,
      type: "circle",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": circleColor,
        "circle-radius": circleRadius,
      },
    });
    map.addLayer({
      id: layerName + "_count",
      source: layerName,
      type: "symbol",
      filter: ["has", "point_count"],
      layout: {
        "text-field": ["get", "point_count_abbreviated"],
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12,
      },
    });
    map.on("click", layerName + "_circle", (e) => {
      const features = map.queryRenderedFeatures(e.point, {
        layers: [layerName + "_circle"],
      });
      const clusterId = features[0].properties.cluster_id;
      map
        .getSource(layerName)
        .getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;

          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
          });
        });
    });
    map.on("mouseenter", layerName + "_circle", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", layerName + "_circle", () => {
      map.getCanvas().style.cursor = "";
    });

    return () => {
      if (!map || !map.getStyle()) {
        return;
      }
      map.removeLayer(layerName + "_circle");
      map.removeLayer(layerName + "_count");
      map.removeSource(layerName);
    };
  }, []);

  useEffect(() => {
    DBWorker.value.pleaseDo({
      action: "exec",
      sql: `SELECT ${longColumn}, ${latColumn}, rowid FROM '${tableName}';`,
    }).then(({ results }) => {
      map.getSource(layerName).setData({
        type: "FeatureCollection",
        features: results[0].values.map((coord) => ({
          type: "Feature",
          properties: { id: coord[2] },
          geometry: {
            coordinates: [coord[0], coord[1]],
            type: "Point",
          },
        })),
      });
    });

    return () => {};
  }, [longColumn, latColumn, tableName]);

  useEffect(() => {
    const { circleColor, circleRadius } = rest2Paint(rest);
    map.setPaintProperty(layerName + "_circle", "circle-color", circleColor);
    map.setPaintProperty(layerName + "_circle", "circle-radius", circleRadius);
  }, [rest]);

  return <></>;
}

export default ClusterLayer;
