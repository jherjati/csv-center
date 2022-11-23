import { useEffect, useErrorBoundary, useRef, useState } from "preact/hooks";
import PageError from "../components/core/PageError";
import { setSnackContent } from "../utils";
import maplibregl from "maplibre-gl";
import LoadingCover from "../components/map/LoadingCover";

function Map() {
  const mapRef = useRef();
  const mapContainer = useRef();
  const [mapLoad, setMapLoad] = useState(false);

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
      if (mapRef.current) {
        mapRef.current.remove();
        setMapLoad(false);
      }
    };
  }, []);

  if (error) {
    return <PageError resetError={resetError} />;
  } else {
    return (
      <>
        <link
          href='https://unpkg.com/maplibre-gl@2.4.0/dist/maplibre-gl.css'
          rel='stylesheet'
        />

        <main className='relative w-full h-full' ref={mapContainer}>
          {!mapLoad && <LoadingCover />}
        </main>
      </>
    );
  }
}

export default Map;
