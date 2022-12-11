import { useEffect, useErrorBoundary, useRef, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import { setSnackContent } from "../utils";
import maplibregl from "maplibre-gl";
import LoadingCover from "../components/map/LoadingCover";
import LayerLegend from "../components/map/LayerLegend";
import LayerModal from "../components/map/LayerModal";
import { useTables } from "../hooks";
import EmptyDb from "../components/core/EmptyDb";
import CircleLayer from "../components/map/CircleLayer";
import Popup from "../components/map/Popup";
import SampleLoader from "../components/core/SampleLoader";
import { layerConfigs } from "../contexts";
import HeatmapLayer from "../components/map/HeatmapLayer";
import ClusterLayer from "../components/map/ClusterLayer";

function Map() {
  const { dbTables } = useTables();
  const mapRef = useRef();
  const mapContainer = useRef();
  const [mapLoad, setMapLoad] = useState(false);
  const [focusLayer, setFocusLayer] = useState();

  const [error, resetError] = useErrorBoundary((error) => {
    console.error(error);
    setSnackContent([
      "error",
      "Unexpected Thing Happened",
      "Don't worry, refresh button is your friend",
    ]);
  });

  useEffect(() => {
    if (mapContainer.current) {
      mapRef.current = new maplibregl.Map({
        container: mapContainer.current,
        style:
          "https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL",
        center: [107.5, -6.8],
        zoom: 8.5,
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

  if (error) {
    return <PageError resetError={resetError} />;
  } else {
    return !dbTables || !dbTables.length ? (
      <main className='py-6'>
        <div className='mx-auto max-w-7xl px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Map</h1>
        </div>
        <div className='mx-auto max-w-7xl px-8'>
          <EmptyDb />
          <SampleLoader />
        </div>
      </main>
    ) : (
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
}

export default Map;
