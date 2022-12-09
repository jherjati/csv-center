import { useEffect } from "preact/hooks";
import { DBWorker } from "../../constants";

function CircleLayer({
  map,
  layerName,
  tableName,
  longColumn,
  latColumn,
  circleColor,
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
        "circle-radius": parseFloat(circleRadius),
        "circle-color": circleColor,
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
    DBWorker.pleaseDo({
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
    map.setPaintProperty(layerName, "circle-radius", parseFloat(circleRadius));
    map.setPaintProperty(layerName, "circle-color", circleColor);
  }, [circleColor, circleRadius]);

  return <></>;
}

export default CircleLayer;
