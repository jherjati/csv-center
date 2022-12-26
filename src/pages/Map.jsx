import { useEffect, useRef, useState } from "preact/hooks";
import maplibregl from "maplibre-gl";
import LoadingCover from "../components/map/LoadingCover";
import LayerLegend from "../components/map/LayerLegend";
import LayerModal from "../components/map/LayerModal";
import CircleLayer from "../components/map/CircleLayer";
import Popup from "../components/map/Popup";
import { layerConfigs } from "../contexts";
import HeatmapLayer from "../components/map/HeatmapLayer";
import ClusterLayer from "../components/map/ClusterLayer";

function Map({ dbTables }) {
  const mapRef = useRef();
  const mapContainer = useRef();
  const [mapLoad, setMapLoad] = useState(false);
  const [focusLayer, setFocusLayer] = useState();

  useEffect(() => {
    if (mapContainer.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
        center: [-122.4194, 37.7749],
        zoom: 10,
      });
      const map = mapRef.current;

      map.addControl(new maplibregl.NavigationControl());
      map.addControl(
        new maplibregl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
        })
      );

      map.on("load", () => {
        setMapLoad(true);
      });
    }
    return () => {
      setMapLoad(false);
      mapRef.current && mapRef.current.remove();
    };
  }, [dbTables]);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) setFocusLayer(null);
  }, [open]);

  return (
    <>
      <link
        href='https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css'
        rel='stylesheet'
      />
      <LayerModal
        key={focusLayer}
        open={open}
        setOpen={setOpen}
        dbTables={dbTables}
        isEditing={Boolean(focusLayer)}
        layerConfig={layerConfigs.value.find(
          (conf) => conf.layerName === focusLayer
        )}
        setLayerConfigs={(newConf) => {
          layerConfigs.value = newConf;
        }}
      />
      <main className='relative w-full h-full' ref={mapContainer}>
        {mapLoad ? (
          <>
            <LayerLegend setOpen={setOpen} setFocusLayer={setFocusLayer} />
            {layerConfigs.value.map((conf) =>
              conf.type === "heatmap" ? (
                <HeatmapLayer
                  key={conf.layerName}
                  map={mapRef.current}
                  {...conf}
                />
              ) : conf.type === "cluster" ? (
                <ClusterLayer
                  key={conf.layerName}
                  map={mapRef.current}
                  {...conf}
                />
              ) : (
                <CircleLayer
                  key={conf.layerName}
                  map={mapRef.current}
                  {...conf}
                />
              )
            )}
            <Popup map={mapRef.current} configs={layerConfigs.value} />
          </>
        ) : (
          <LoadingCover />
        )}
      </main>
    </>
  );
}

export default Map;
