import { useEffect } from "preact/hooks";
import { DBWorker } from "../../constants";

function ClusterLayer({ map, layerName, tableName, longColumn, latColumn }) {
  useEffect(() => {
    map.addSource(layerName, {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [],
      },
      cluster: true,
    });
    map.addLayer({
      id: layerName + "_circle",
      source: layerName,
      type: "circle",
      filter: ["has", "point_count"],
      paint: {
        "circle-color": [
          "step",
          ["get", "point_count"],
          "#51bbd6",
          100,
          "#f1f075",
          750,
          "#f28cb1",
        ],
        "circle-radius": ["step", ["get", "point_count"], 20, 100, 30, 750, 40],
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

  return <></>;
}

export default ClusterLayer;
