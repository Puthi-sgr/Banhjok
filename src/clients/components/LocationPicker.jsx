import React, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { MapPin, Loader2 } from "lucide-react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 13.7563, // Bangkok coordinates as default
  lng: 100.5018,
};

const LocationPicker = ({
  onLocationSelect,
  initialLocation = null,
  disabled = false,
}) => {
  const [selectedLocation, setSelectedLocation] = useState(
    initialLocation || defaultCenter
  );
  const [isLoading, setIsLoading] = useState(false);
  const mapRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const onMapClick = useCallback(
    (event) => {
      if (disabled) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const newLocation = { lat, lng };

      setSelectedLocation(newLocation);
      onLocationSelect(newLocation);
    },
    [onLocationSelect, disabled]
  );

  const handleConfirmLocation = async () => {
    if (!selectedLocation) return;

    setIsLoading(true);
    try {
      // Get address from coordinates using Geocoding API
      const geocoder = new window.google.maps.Geocoder();
      const result = await geocoder.geocode({
        location: selectedLocation,
      });

      if (result.results[0]) {
        const address = result.results[0].formatted_address;
        onLocationSelect({
          ...selectedLocation,
          address,
          lat_lng: `${selectedLocation.lat},${selectedLocation.lng}`,
        });
      } else {
        onLocationSelect({
          ...selectedLocation,
          lat_lng: `${selectedLocation.lat},${selectedLocation.lng}`,
        });
      }
    } catch (error) {
      console.error("Error getting address:", error);
      onLocationSelect({
        ...selectedLocation,
        lat_lng: `${selectedLocation.lat},${selectedLocation.lng}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">
          Error loading Google Maps. Please check your API key.
        </p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          <span className="text-gray-600">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={selectedLocation}
          zoom={15}
          onLoad={onMapLoad}
          onClick={onMapClick}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {selectedLocation && (
            <Marker
              position={selectedLocation}
              icon={{
                url:
                  "data:image/svg+xml;charset=UTF-8," +
                  encodeURIComponent(`
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="#f97316"/>
                  </svg>
                `),
                scaledSize: new window.google.maps.Size(24, 24),
                anchor: new window.google.maps.Point(12, 24),
              }}
            />
          )}
        </GoogleMap>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-2">
          <MapPin className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium text-gray-700">
            Selected Location
          </span>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>Latitude: {selectedLocation.lat.toFixed(6)}</p>
          <p>Longitude: {selectedLocation.lng.toFixed(6)}</p>
        </div>
        {!disabled && (
          <button
            onClick={handleConfirmLocation}
            disabled={isLoading}
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="w-4 h-4 mr-2" />
            )}
            {isLoading ? "Getting Address..." : "Confirm Location"}
          </button>
        )}
      </div>

      {!disabled && (
        <p className="text-xs text-gray-500 text-center">
          Click on the map to select your location
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
