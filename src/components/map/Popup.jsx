import { useEffect, useRef, useState } from "preact/hooks";
import maplibregl from "maplibre-gl";
import { DBWorker } from "../../constants";

const Popup = ({ configs, map }) => {
  const contentRef = useRef();
  const popupRef = useRef({ remove: () => {} });

  const [feature, setFeature] = useState({});
  const [item, setItem] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let onEnter = function () {
      map.getCanvas().style.cursor = "pointer";
    };
    let onLeave = function () {
      map.getCanvas().style.cursor = "";
    };

    try {
      configs.forEach(({ layerName, tableName }) => {
        map.on("click", layerName, function (e) {
          popupRef.current = new maplibregl.Popup({ closeButton: false })
            .setMaxWidth("300px")
            .setLngLat(e.lngLat)
            .setDOMContent(contentRef.current)
            .addTo(map);
          setFeature({ id: e.features[0].properties.id, tableName: tableName });
        });

        map.on("mouseenter", layerName, onEnter);
        map.on("mouseleave", layerName, onLeave);
      });
    } catch (error) {
      console.error(error);
    }

    return () => {
      configs.forEach(({ layerName }) => {
        map.off("mouseenter", layerName, onEnter);
        map.off("mouseleave", layerName, onLeave);
      });
      popupRef.current.remove();
    };
  }, [configs]);

  useEffect(() => {
    if (feature.tableName && feature.id) {
      setIsLoading(true);
      DBWorker.pleaseDo({
        action: "exec",
        sql: `SELECT * from '${feature.tableName}' WHERE rowid = ${feature.id}`,
      }).then(({ results }) => {
        if (results) {
          const newItem = {};
          results[0].columns.forEach((col, idx) => {
            newItem[col] = results[0].values[0][idx];
          });
          setItem(newItem);
          setIsLoading(false);
        }
      });
    }
  }, [feature.tableName, feature.id]);

  return (
    <div className='hidden'>
      <div ref={contentRef}>
        {isLoading ? (
          <div className='p-2' style={{ minWidth: 270 }}>
            Loading...
          </div>
        ) : (
          <div className='w-full items-center p-2' style={{ minWidth: 270 }}>
            {Object.keys(item).map((key) => (
              <div className='flex text-gray-900 flex-wrap'>
                <h5 className='capitalize font-medium mr-2'>
                  {key.split("_").join(" ")} :
                </h5>
                <p className='font-sm max-w-full break-words'>{item[key]}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Popup;
