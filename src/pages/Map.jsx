import { useEffect, useErrorBoundary, useRef, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import { setSnackContent } from "../utils";
import maplibregl from "maplibre-gl";
import LoadingCover from "../components/map/LoadingCover";
import LayerLegend from "../components/map/LayerLegend";
import LayerModal from "../components/map/LayerModal";
import { useTables } from "../hooks";
import EmptyDb from "../components/core/EmptyDb";

function Map() {
  const { dbTables } = useTables();
  const mapRef = useRef();
  const mapContainer = useRef();
  const [mapLoad, setMapLoad] = useState(false);
  const [layerConfigs, setLayerConfigs] = useState([]);
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
      try {
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
      } catch (error) {
        console.log(error);
      }
    }
    return () => {
      if (mapRef.current) {
        setMapLoad(false);
        mapRef.current.remove();
      }
    };
  }, []);

  // useEffect(() => {
  //   if (mapLoad) {
  //     const map = mapRef.current;
  //     map.addSource("test", {
  //       type: "geojson",
  //       data: {
  //         type: "FeatureCollection",
  //         features: [
  //           {
  //             type: "Feature",
  //             properties: {},
  //             geometry: {
  //               coordinates: [107.60612158060724, -6.923485957200327],
  //               type: "Point",
  //             },
  //           },
  //           {
  //             type: "Feature",
  //             properties: {},
  //             geometry: {
  //               coordinates: [107.61581074052111, -6.8880480251471],
  //               type: "Point",
  //             },
  //           },
  //           {
  //             type: "Feature",
  //             properties: {},
  //             geometry: {
  //               coordinates: [107.57042467566686, -6.920954764440992],
  //               type: "Point",
  //             },
  //           },
  //           {
  //             type: "Feature",
  //             properties: {},
  //             geometry: {
  //               coordinates: [107.6479379549694, -6.910323606684699],
  //               type: "Point",
  //             },
  //           },
  //           {
  //             type: "Feature",
  //             properties: {},
  //             geometry: {
  //               coordinates: [107.61632069630656, -6.950821972774079],
  //               type: "Point",
  //             },
  //           },
  //         ],
  //       },
  //     });
  //     map.addLayer({
  //       id: "test",
  //       source: "test",
  //       type: "circle",
  //       paint: {
  //         "circle-radius": 3,
  //         "circle-color": "#B42222",
  //       },
  //     });
  //   }
  //   return () => {
  //     if (mapLoad) {
  //       const map = mapRef.current;
  //       map.removeLayer("test");
  //       map.removeSource("test");
  //     }
  //   };
  // }, [mapLoad]);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) setFocusLayer();
  }, [open]);

  if (error) {
    return <PageError resetError={resetError} />;
  } else {
    return !dbTables || !dbTables.length ? (
      <main className='py-6'>
        <div className='mx-auto max-w-7xl px-8'>
          <h1 className='text-2xl font-semibold text-gray-900'>Compare</h1>
        </div>
        <div className='mx-auto max-w-7xl px-8'>
          <EmptyDb />
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
          layerConfig={layerConfigs.find(
            (conf) => conf.layerName === focusLayer
          )}
          setLayerConfigs={setLayerConfigs}
        />
        <main className='relative w-full h-full' ref={mapContainer}>
          {mapLoad ? (
            <LayerLegend
              setOpen={setOpen}
              configs={layerConfigs}
              setFocusLayer={setFocusLayer}
              setLayerConfigs={setLayerConfigs}
            />
          ) : (
            <LoadingCover />
          )}
        </main>
      </>
    );
  }
}

export default Map;
