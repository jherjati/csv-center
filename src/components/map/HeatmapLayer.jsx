import { useEffect } from "preact/hooks";
import { DBWorker } from "../../constants";

function HeatmapLayer({
  map,
  layerName,
  tableName,
  longColumn,
  latColumn,
  heatmapIntensity,
  heatmapOpacity,
  heatmapRadius,
  heatmapWeight,
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
      type: "heatmap",
      paint: {
        "heatmap-intensity": parseFloat(heatmapIntensity),
        "heatmap-opacity": parseFloat(heatmapOpacity),
        "heatmap-radius": parseFloat(heatmapRadius),
        "heatmap-weight": parseFloat(heatmapWeight),
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
    map.setPaintProperty(
      layerName,
      "heatmap-intensity",
      parseFloat(heatmapIntensity)
    );
    map.setPaintProperty(
      layerName,
      "heatmap-opacity",
      parseFloat(heatmapOpacity)
    );
    map.setPaintProperty(
      layerName,
      "heatmap-radius",
      parseFloat(heatmapRadius)
    );
    map.setPaintProperty(
      layerName,
      "heatmap-weight",
      parseFloat(heatmapWeight)
    );
  }, [heatmapIntensity, heatmapOpacity, heatmapRadius, heatmapWeight]);

  return <></>;
}

export default HeatmapLayer;
