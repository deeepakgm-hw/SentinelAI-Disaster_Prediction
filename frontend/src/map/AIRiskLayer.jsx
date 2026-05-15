import {
  Circle,
  Popup,
} from "react-leaflet";

const AIRiskLayer = ({
  events,
}) => {

  const getRiskColor =
    (magnitude) => {

      if (magnitude >= 7)
        return "#ff3b30";

      if (magnitude >= 5)
        return "#ffcc00";

      return "#34c759";
    };

  const getRadius =
    (magnitude) => {

      return (
        magnitude * 25000
      );
    };

  return (

    <>
      {events.map(
        (
          event,
          index
        ) => (

          <Circle
            key={index}
            center={[
              event.lat,
              event.lon,
            ]}
            radius={
              getRadius(
                event.magnitude
              )
            }
            pathOptions={{
              color:
                getRiskColor(
                  event.magnitude
                ),
              fillColor:
                getRiskColor(
                  event.magnitude
                ),
              fillOpacity: 0.35,
            }}
          >

            <Popup>

              <div
                className="
                text-black
                "
              >

                <h2
                  className="
                  font-bold
                  text-lg
                  "
                >
                  AI Risk Zone
                </h2>

                <p>
                  Magnitude:
                  {" "}
                  {event.magnitude}
                </p>

                <p>
                  Location:
                  {" "}
                  {event.place}
                </p>

              </div>

            </Popup>

          </Circle>
        )
      )}
    </>
  );
};

export default AIRiskLayer;
