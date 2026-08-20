import ViewContainer from "@/components/viewContainer";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface LocationItem {
    name: string;
    lat: number;
    lng: number;
    address: string;
}

const GOOGLE_MAPS_API_KEY =
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
    "AIzaSyAHdjQvHe1Jc4trFAN33hNN0ojY5jnibyE";

const PRESET_LOCATIONS: LocationItem[] = [
    {
        name: "Bitexco Financial Tower (HCMC)",
        lat: 10.7769,
        lng: 106.7009,
        address: "2 Hai Trieu, Ben Nghe, District 1, Ho Chi Minh City, Vietnam",
    },
    {
        name: "Hoan Kiem Lake (Hanoi)",
        lat: 21.0285,
        lng: 105.8542,
        address: "Hang Trong, Hoan Kiem, Hanoi, Vietnam",
    },
    {
        name: "Dragon Bridge (Da Nang)",
        lat: 16.061,
        lng: 108.2272,
        address: "Nguyen Van Linh, Phuoc Ninh, Hai Chau, Da Nang, Vietnam",
    },
    {
        name: "Landmark 81 (HCMC)",
        lat: 10.795,
        lng: 106.7218,
        address: "720A Dien Bien Phu, Ward 22, Binh Thanh, Ho Chi Minh City",
    },
    {
        name: "Tokyo Tower (Japan)",
        lat: 35.6586,
        lng: 139.7454,
        address: "4 Chome-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan",
    },
];

export default function MapPicker() {
    const [selectedLocation, setSelectedLocation] = useState<LocationItem>(
        PRESET_LOCATIONS[0]
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [confirmedLocation, setConfirmedLocation] =
        useState<LocationItem | null>(null);
    const [mapType, setMapType] = useState<"roadmap" | "satellite" | "hybrid" | "terrain">("roadmap");
    const [isGettingGPS, setIsGettingGPS] = useState(false);

    const iframeRef = useRef<any>(null);

    // Pan iframe map to programmatic coordinates without reloading iframe
    const panMapTo = (lat: number, lng: number) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                { type: "PAN_TO", lat, lng },
                "*"
            );
        }
    };

    const geocodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Listen for iframe Google Maps messages (dragged/panned center position)
    useEffect(() => {
        if (Platform.OS === "web" && typeof window !== "undefined") {
            const handleMessage = (event: MessageEvent) => {
                if (event.data && event.data.type === "GOOGLE_MAP_LOCATION_PICKED") {
                    const newLat = parseFloat(event.data.lat.toFixed(6));
                    const newLng = parseFloat(event.data.lng.toFixed(6));

                    // 1. Instantly update Lat/Lng coordinates for 60fps zero-latency UI response without flashing loading text
                    setSelectedLocation((prev) => {
                        if (prev.lat === newLat && prev.lng === newLng) return prev;
                        return {
                            ...prev,
                            lat: newLat,
                            lng: newLng,
                        };
                    });

                    // 2. Debounce Google Geocoding API fetch by 600ms (only fetch after panning stops)
                    if (geocodeTimerRef.current) {
                        clearTimeout(geocodeTimerRef.current);
                    }

                    geocodeTimerRef.current = setTimeout(() => {
                        fetch(
                            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${newLat},${newLng}&key=${GOOGLE_MAPS_API_KEY}`
                        )
                            .then((res) => res.json())
                            .then((data) => {
                                let formattedAddress = `Lat: ${newLat}, Lng: ${newLng}`;
                                let placeName = "Picked Location";
                                if (data.results && data.results.length > 0) {
                                    formattedAddress = data.results[0].formatted_address;
                                    placeName =
                                        data.results[0].address_components[0]?.long_name ||
                                        "Picked Location";
                                }
                                setSelectedLocation({
                                    name: placeName,
                                    lat: newLat,
                                    lng: newLng,
                                    address: formattedAddress,
                                });
                            })
                            .catch(() => {
                                setSelectedLocation((prev) => ({
                                    ...prev,
                                    address: `Lat: ${newLat}, Lng: ${newLng}`,
                                }));
                            });
                    }, 600);
                }
            };
            window.addEventListener("message", handleMessage);
            return () => {
                window.removeEventListener("message", handleMessage);
                if (geocodeTimerRef.current) clearTimeout(geocodeTimerRef.current);
            };
        }
    }, []);

    // Handle searching location via official Google Geocoding API
    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);

        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    searchQuery.trim()
                )}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.status === "OK" && data.results && data.results.length > 0) {
                const first = data.results[0];
                const newLoc: LocationItem = {
                    name: first.address_components[0]?.long_name || searchQuery,
                    lat: parseFloat(first.geometry.location.lat.toFixed(6)),
                    lng: parseFloat(first.geometry.location.lng.toFixed(6)),
                    address: first.formatted_address,
                };
                setSelectedLocation(newLoc);
                panMapTo(newLoc.lat, newLoc.lng);
            } else {
                Alert.alert(
                    "No results found",
                    `Google Maps could not locate "${searchQuery}". Status: ${data.status}`
                );
            }
        } catch (err) {
            console.error("Google Geocoding error:", err);
            Alert.alert("Search Error", "Failed to search location on Google Maps.");
        } finally {
            setIsSearching(false);
        }
    };

    // Select preset location
    const handleSelectPreset = (loc: LocationItem) => {
        setSelectedLocation(loc);
        panMapTo(loc.lat, loc.lng);
    };

    // Get device GPS location
    const handleGetGPS = () => {
        setIsGettingGPS(true);
        if (typeof navigator !== "undefined" && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = parseFloat(pos.coords.latitude.toFixed(6));
                    const lng = parseFloat(pos.coords.longitude.toFixed(6));

                    fetch(
                        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            let addr = `GPS: ${lat}, ${lng}`;
                            if (data.results && data.results.length > 0) {
                                addr = data.results[0].formatted_address;
                            }
                            const gpsLoc: LocationItem = {
                                name: "Your Current GPS Location",
                                lat,
                                lng,
                                address: addr,
                            };
                            setSelectedLocation(gpsLoc);
                            panMapTo(lat, lng);
                        })
                        .catch(() => {
                            const gpsLoc: LocationItem = {
                                name: "Your Current GPS Location",
                                lat,
                                lng,
                                address: `GPS: ${lat}, ${lng}`,
                            };
                            setSelectedLocation(gpsLoc);
                            panMapTo(lat, lng);
                        })
                        .finally(() => setIsGettingGPS(false));
                },
                () => {
                    setIsGettingGPS(false);
                    Alert.alert(
                        "GPS Permission Required",
                        "Unable to get location. Please enable Location/GPS permission in your browser."
                    );
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            setIsGettingGPS(false);
            Alert.alert("GPS Error", "Geolocation is not supported on this browser.");
        }
    };

    const handleConfirm = () => {
        setConfirmedLocation(selectedLocation);
    };

    // Handle map type change via postMessage to avoid reloading iframe
    const handleMapTypeChange = (type: "roadmap" | "satellite" | "hybrid" | "terrain") => {
        setMapType(type);
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage(
                { type: "SET_MAP_TYPE", mapType: type },
                "*"
            );
        }
    };

    // Static embedded Google Maps HTML string created ONCE to prevent iframe reloading
    const mapHtml = React.useMemo(
        () => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <style>
        html, body, #map { height: 100%; width: 100%; margin: 0; padding: 0; position: relative; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
        
        /* Fixed Center Marker Overlay */
        .center-pin-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -100%);
          z-index: 50;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: transform 0.15s ease-out;
        }

        .center-pin-svg {
          width: 38px;
          height: 48px;
          filter: drop-shadow(0 6px 8px rgba(0,0,0,0.35));
          transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .center-pin-shadow {
          width: 14px;
          height: 5px;
          background: rgba(15, 23, 42, 0.3);
          border-radius: 50%;
          margin-top: -3px;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        /* Lift pin animation when user is dragging/panning the map */
        .is-panning .center-pin-svg {
          transform: translateY(-12px) scale(1.1);
        }

        .is-panning .center-pin-shadow {
          transform: scale(0.5);
          opacity: 0.3;
        }

        .google-pill {
          position: absolute;
          bottom: 24px;
          left: 12px;
          z-index: 10;
          background: rgba(15, 23, 42, 0.9);
          color: white;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          gap: 6px;
        }
      </style>
      <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
    </head>
    <body>
      <div id="map"></div>

      <!-- Center Pin Marker Overlay -->
      <div class="center-pin-container" id="pinContainer">
        <svg class="center-pin-svg" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 32 12 32C12 32 24 21 24 12C24 5.37 18.63 0 12 0ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z" fill="#EA4335"/>
          <circle cx="12" cy="12" r="4" fill="#FFFFFF"/>
        </svg>
        <div class="center-pin-shadow"></div>
      </div>

      <div class="google-pill">
        <span>📍 Move map to pick location</span>
      </div>

      <script>
        var centerLoc = { lat: ${PRESET_LOCATIONS[0].lat}, lng: ${PRESET_LOCATIONS[0].lng} };
        var pinContainer = document.getElementById('pinContainer');
        
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 15,
          center: centerLoc,
          mapTypeId: 'roadmap',
          zoomControl: true,
          streetViewControl: true,
          mapTypeControl: false,
          fullscreenControl: true
        });

        // Lift pin up when user starts moving map
        map.addListener('dragstart', function() {
          pinContainer.classList.add('is-panning');
        });

        // Drop pin and capture new center coordinates when map stops moving
        map.addListener('idle', function() {
          pinContainer.classList.remove('is-panning');
          var currentCenter = map.getCenter();
          if (window.parent) {
            window.parent.postMessage({
              type: 'GOOGLE_MAP_LOCATION_PICKED',
              lat: currentCenter.lat(),
              lng: currentCenter.lng()
            }, '*');
          }
        });

        // Listen for programmatic commands from parent React App
        window.addEventListener('message', function(e) {
          if (!e.data) return;
          if (e.data.type === 'PAN_TO') {
            map.panTo({ lat: e.data.lat, lng: e.data.lng });
          }
          if (e.data.type === 'SET_MAP_TYPE') {
            map.setMapTypeId(e.data.mapType);
          }
        });
      </script>
    </body>
    </html>
  `,
        []
    );

    return (
        <ScrollView className="bg-slate-50 flex-1">
            {/* Header section */}
            <ViewContainer>
                <View className="flex-row justify-between items-center">
                    <View className="flex-row justify-start items-center gap-3">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white rounded-xl flex-row items-center justify-center border border-slate-200 shadow-sm"
                        >
                            <Ionicons name="arrow-back" size={22} color="#1e293b" />
                        </TouchableOpacity>
                        <View>
                            <Text className="text-xl font-bold text-slate-800">Google Map Picker</Text>
                            <Text className="text-xs text-slate-500">Powered by Google Maps Platform API</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleGetGPS}
                        disabled={isGettingGPS}
                        className="flex-row items-center gap-1.5 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200"
                    >
                        {isGettingGPS ? (
                            <ActivityIndicator size="small" color="#2563eb" />
                        ) : (
                            <>
                                <Ionicons name="navigate-circle" size={20} color="#2563eb" />
                                <Text className="text-xs font-semibold text-blue-600">My GPS</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>
            </ViewContainer>

            {/* Map Search & Quick Presets */}
            <ViewContainer>
                <Text className="text-sm font-semibold text-slate-700 mb-2">
                    Search Location with Google Geocoding
                </Text>

                {/* Search Bar */}
                <View className="flex-row items-center gap-2 mb-3">
                    <View className="flex-1 flex-row items-center bg-white px-3 py-2 rounded-xl border border-slate-300">
                        <Ionicons name="search" size={18} color="#4285F4" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Search Google Maps..."
                            placeholderTextColor="#94a3b8"
                            className="flex-1 ml-2 text-sm text-slate-800"
                            onSubmitEditing={handleSearch}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => setSearchQuery("")}>
                                <Ionicons name="close-circle" size={18} color="#94a3b8" />
                            </TouchableOpacity>
                        )}
                    </View>
                    <TouchableOpacity
                        onPress={handleSearch}
                        disabled={isSearching}
                        className="bg-blue-600 px-4 py-2.5 rounded-xl justify-center items-center shadow-sm"
                    >
                        {isSearching ? (
                            <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                            <Text className="text-white text-xs font-bold">Search</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Quick Presets */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row gap-2">
                    {PRESET_LOCATIONS.map((loc, idx) => {
                        const isSelected = selectedLocation.name === loc.name;
                        return (
                            <TouchableOpacity
                                key={idx}
                                onPress={() => handleSelectPreset(loc)}
                                className={`px-3 py-1.5 rounded-full border mr-2 flex-row items-center gap-1 ${
                                    isSelected
                                        ? "bg-blue-600 border-blue-600"
                                        : "bg-white border-slate-300"
                                }`}
                            >
                                <Ionicons
                                    name="pin"
                                    size={12}
                                    color={isSelected ? "#ffffff" : "#64748b"}
                                />
                                <Text
                                    className={`text-xs font-medium ${
                                        isSelected ? "text-white" : "text-slate-700"
                                    }`}
                                >
                                    {loc.name}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </ViewContainer>

            {/* Google Map View Container */}
            <ViewContainer>
                <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center gap-2">
                        <Text className="text-sm font-semibold text-slate-700">
                            Google Map Engine
                        </Text>
                    </View>

                    {/* Map type selector buttons */}
                    <View className="flex-row bg-slate-200 p-0.5 rounded-lg">
                        {(["roadmap", "satellite", "hybrid"] as const).map((type) => (
                            <TouchableOpacity
                                key={type}
                                onPress={() => handleMapTypeChange(type)}
                                className={`px-2 py-1 rounded-md ${
                                    mapType === type ? "bg-white shadow-xs" : ""
                                }`}
                            >
                                <Text
                                    className={`text-[10px] font-bold capitalize ${
                                        mapType === type ? "text-blue-600" : "text-slate-600"
                                    }`}
                                >
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Map Container */}
                <View className="w-full h-80 rounded-2xl overflow-hidden border border-slate-300 bg-slate-200 shadow-sm relative">
                    {Platform.OS === "web" ? (
                        <iframe
                            ref={iframeRef}
                            key="static-google-map-iframe"
                            srcDoc={mapHtml}
                            style={{
                                width: "100%",
                                height: "100%",
                                border: "none",
                            }}
                            title="Official Google Maps Engine"
                        />
                    ) : (
                        <View className="flex-1 justify-center items-center p-6 bg-slate-900">
                            <Ionicons name="map" size={48} color="#4285F4" />
                            <Text className="text-white font-bold text-center mt-2">
                                {selectedLocation.name}
                            </Text>
                            <Text className="text-slate-300 text-xs text-center mt-1">
                                {selectedLocation.address}
                            </Text>
                        </View>
                    )}

                    {/* Floating GPS Button on Map */}
                    <TouchableOpacity
                        onPress={handleGetGPS}
                        disabled={isGettingGPS}
                        className="absolute bottom-4 right-4 bg-white w-11 h-11 rounded-full items-center justify-center shadow-lg border border-slate-200 z-40 active:bg-slate-100"
                    >
                        {isGettingGPS ? (
                            <ActivityIndicator size="small" color="#2563eb" />
                        ) : (
                            <Ionicons name="locate" size={22} color="#2563eb" />
                        )}
                    </TouchableOpacity>
                </View>

                {/* Selected Location Summary Card */}
                <View className="bg-white p-4 rounded-xl border border-slate-200 mt-3 shadow-xs">
                    <View className="flex-row items-start gap-3">
                        <View className="w-10 h-10 bg-blue-50 rounded-full items-center justify-center border border-blue-100">
                            <Ionicons name="location-sharp" size={22} color="#4285F4" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                Selected Google Maps Location
                            </Text>
                            <Text className="text-base font-bold text-slate-900 mt-0.5">
                                {selectedLocation.name}
                            </Text>
                            <Text className="text-xs text-slate-600 mt-0.5">
                                {selectedLocation.address}
                            </Text>

                            {/* Coordinates Badges */}
                            <View className="flex-row flex-wrap gap-2 mt-2">
                                <View className="bg-slate-100 px-2.5 py-1 rounded-md flex-row items-center gap-1">
                                    <Text className="text-[10px] font-bold text-slate-500">LAT:</Text>
                                    <Text className="text-xs font-mono font-semibold text-slate-800">
                                        {selectedLocation.lat}
                                    </Text>
                                </View>
                                <View className="bg-slate-100 px-2.5 py-1 rounded-md flex-row items-center gap-1">
                                    <Text className="text-[10px] font-bold text-slate-500">LNG:</Text>
                                    <Text className="text-xs font-mono font-semibold text-slate-800">
                                        {selectedLocation.lng}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Action buttons */}
                    <View className="flex-row gap-2 mt-4">
                        <TouchableOpacity
                            onPress={handleGetGPS}
                            disabled={isGettingGPS}
                            className="bg-slate-100 border border-slate-300 px-4 py-3 rounded-xl flex-row items-center justify-center gap-1.5"
                        >
                            <Ionicons name="locate-sharp" size={18} color="#2563eb" />
                            <Text className="text-blue-600 font-bold text-xs">Get My GPS</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={handleConfirm}
                            className="flex-1 bg-blue-600 py-3 rounded-xl flex-row items-center justify-center gap-2 shadow-sm"
                            activeOpacity={0.8}
                        >
                            <Ionicons name="checkmark-circle" size={20} color="#ffffff" />
                            <Text className="text-white font-bold text-sm">
                                Confirm Location
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ViewContainer>

            {/* Confirmed Location Banner */}
            {confirmedLocation && (
                <ViewContainer>
                    <View className="bg-emerald-600 p-4 rounded-xl shadow-md">
                        <View className="flex-row items-center justify-between">
                            <View className="flex-row items-center gap-2">
                                <Ionicons name="checkmark-circle" size={24} color="#ffffff" />
                                <Text className="text-white font-bold text-base">
                                    Location Confirmed!
                                </Text>
                            </View>
                            <TouchableOpacity onPress={() => setConfirmedLocation(null)}>
                                <Ionicons name="close" size={20} color="#ffffff" />
                            </TouchableOpacity>
                        </View>
                        <View className="bg-emerald-700/60 p-3 rounded-lg mt-2">
                            <Text className="text-white font-semibold text-sm">
                                {confirmedLocation.name}
                            </Text>
                            <Text className="text-emerald-100 text-xs mt-0.5">
                                {confirmedLocation.address}
                            </Text>
                            <Text className="text-emerald-200 text-xs font-mono mt-1">
                                Coordinates: {confirmedLocation.lat}, {confirmedLocation.lng}
                            </Text>
                        </View>
                    </View>
                </ViewContainer>
            )}
        </ScrollView>
    );
}

