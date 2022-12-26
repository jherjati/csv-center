import { useEffect } from "preact/hooks";
import { DBWorker } from "../../contexts";

function CircleLayer({
  map,
  layerName,
  tableName,
  longColumn,
  latColumn,
  circleBlur,
  circleColor,
  circleOpacity,
  circleRadius,
}) {
  useEffect(() => {
    map.addSource(layerName, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
    });
    map.addLayer({
      id: layerName,
      source: layerName,
      type: "circle",
      paint: {
        "circle-blur": parseFloat(circleBlur),
        "circle-color": circleColor,
        "circle-opacity": parseFloat(circleOpacity),
        "circle-radius": parseFloat(circleRadius),
      },
    });
    return () => {
      if (!map || !map.getStyle()) {
        return;
      }
      map.removeLayer(layerName);
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
    map.setPaintProperty(layerName, "circle-blur", parseFloat(circleBlur));
    map.setPaintProperty(layerName, "circle-color", circleColor);
    map.setPaintProperty(
      layerName,
      "circle-opacity",
      parseFloat(circleOpacity)
    );
    map.setPaintProperty(layerName, "circle-radius", parseFloat(circleRadius));
  }, [circleBlur, circleColor, circleOpacity, circleRadius]);

  return <></>;
}

export default CircleLayer;
