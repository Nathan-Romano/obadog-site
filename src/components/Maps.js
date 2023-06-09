import { useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api"


const containerStyle = {
  width: '320px',
  height: '320px',
};


export default function Maps() {
    const center = useMemo(() => ({ lat: -26.333476766276736, lng: -48.84770787356671 }), []);
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY
    })
    if (isLoaded)
    return (
        <GoogleMap 
        zoom={14} 
        center={center} 
        mapContainerStyle={containerStyle}>
        <Marker position={center} options={{
          label: {
            text: "Obadog",
            className: "mapStyle"
          }
        }} />
        </GoogleMap>
      );
}
