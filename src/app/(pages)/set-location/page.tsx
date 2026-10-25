"use client";

import { useEffect, useRef, useState } from "react";

import {
  MapPin,
  ArrowRight,
  X,
  Navigation,
  Map,
  CheckCircle2,
  Search,
  Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { createClient } from "../../../../lib/supabase-client";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

type LocationItem = {
  id: string;
  name: string;
  division_id?: string;
  district_id?: string;
};

type SelectedLocation = {
  lat: number;
  lng: number;
};

export default function SetLocationPage() {
  const router = useRouter();
  const supabase = createClient();

  // =====================================================
  // FORM
  // =====================================================

  const [division, setDivision] = useState("");
  const [district, setDistrict] = useState("");
  const [upazila, setUpazila] = useState("");
  const [area, setArea] = useState("");
  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [mapLocationSet, setMapLocationSet] = useState(false);

  // =====================================================
  // LOCATION DATA
  // =====================================================

  const [divisions, setDivisions] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [upazilas, setUpazilas] = useState<LocationItem[]>([]);

  const [loadingLocationData, setLoadingLocationData] = useState(true);

  // =====================================================
  // SAVE
  // =====================================================

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GOOGLE MAP
  // =====================================================

  const [showGoogleMap, setShowGoogleMap] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [googleError, setGoogleError] = useState("");

  const autocompleteContainerRef = useRef<HTMLDivElement | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const markerRef = useRef<google.maps.marker.AdvancedMarkerElement | null>(
    null,
  );

  const autocompleteRef =
    useRef<google.maps.places.PlaceAutocompleteElement | null>(null);

  // =====================================================
  // LOAD LOCATION JSON
  // =====================================================

  useEffect(() => {
    const loadLocationData = async () => {
      try {
        setLoadingLocationData(true);

        const [divisionResponse, districtResponse, upazilaResponse] =
          await Promise.all([
            fetch("/Data/divisions.json"),
            fetch("/Data/districts.json"),
            fetch("/Data/upazilas.json"),
          ]);

        if (
          !divisionResponse.ok ||
          !districtResponse.ok ||
          !upazilaResponse.ok
        ) {
          throw new Error("Location data load failed");
        }

        const [divisionData, districtData, upazilaData] = await Promise.all([
          divisionResponse.json(),
          districtResponse.json(),
          upazilaResponse.json(),
        ]);

        setDivisions(divisionData);
        setDistricts(districtData);
        setUpazilas(upazilaData);
      } catch (err) {
        console.error(err);

        setError("লোকেশন ডাটা লোড করা যায়নি।");
      } finally {
        setLoadingLocationData(false);
      }
    };

    loadLocationData();
  }, []);

  // =====================================================
  // FILTER DISTRICTS
  // =====================================================

  const filteredDistricts = districts.filter(
    (item) => item.division_id === division,
  );

  // =====================================================
  // FILTER UPAZILAS
  // =====================================================

  const filteredUpazilas = upazilas.filter(
    (item) => item.district_id === district,
  );

  // =====================================================
  // SELECTED NAMES
  // =====================================================

  const selectedDivisionName =
    divisions.find((item) => item.id === division)?.name || "";

  const selectedDistrictName =
    districts.find((item) => item.id === district)?.name || "";

  const selectedUpazilaName =
    upazilas.find((item) => item.id === upazila)?.name || "";

  // =====================================================
  // RESET GOOGLE LOCATION
  // =====================================================

  const resetGoogleLocation = () => {
    setLatitude(null);
    setLongitude(null);
    setMapLocationSet(false);
    setGoogleError("");
  };

  // =====================================================
  // DIVISION CHANGE
  // =====================================================

  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDivision(e.target.value);
    setDistrict("");
    setUpazila("");
    resetGoogleLocation();
  };

  // =====================================================
  // DISTRICT CHANGE
  // =====================================================

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistrict(e.target.value);
    setUpazila("");
    resetGoogleLocation();
  };

  // =====================================================
  // UPAZILA CHANGE
  // =====================================================

  const handleUpazilaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpazila(e.target.value);
    resetGoogleLocation();
  };

  // =====================================================
  // GOOGLE SEARCH TEXT
  // =====================================================

  const buildGoogleSearchText = () => {
    return [
      address.trim(),
      area.trim(),
      selectedUpazilaName,
      selectedDistrictName,
      selectedDivisionName,
      "Bangladesh",
    ]
      .filter(Boolean)
      .join(", ");
  };

  // =====================================================
  // CHECK SELECTED GOOGLE PLACE
  // =====================================================

  const isPlaceInsideSelectedArea = (place: google.maps.places.Place) => {
    const components = place.addressComponents || [];

    const normalizedUpazila = selectedUpazilaName.toLowerCase().trim();

    const normalizedDistrict = selectedDistrictName.toLowerCase().trim();

    const normalizedDivision = selectedDivisionName.toLowerCase().trim();

    const componentNames = components.map(
      (component) => component.longText?.toString().toLowerCase().trim() || "",
    );

    const formattedAddress = place.formattedAddress?.toLowerCase().trim() || "";

    const fullGoogleText = [...componentNames, formattedAddress].join(" ");

    // -------------------------------------------------
    // District check
    // -------------------------------------------------

    const districtMatches =
      !normalizedDistrict || fullGoogleText.includes(normalizedDistrict);

    // -------------------------------------------------
    // Division check
    // -------------------------------------------------

    const divisionMatches =
      !normalizedDivision || fullGoogleText.includes(normalizedDivision);

    // -------------------------------------------------
    // Upazila check
    // -------------------------------------------------

    const upazilaMatches =
      !normalizedUpazila || fullGoogleText.includes(normalizedUpazila);

    return {
      districtMatches,
      divisionMatches,
      upazilaMatches,
    };
  };

  // =====================================================
  // MARKER
  // =====================================================

  const showMarker = (
    location: SelectedLocation,
    title = "Selected location",
  ) => {
    if (!mapRef.current) return;

    if (markerRef.current) {
      markerRef.current.map = null;
    }

    markerRef.current = new google.maps.marker.AdvancedMarkerElement({
      map: mapRef.current,
      position: location,
      title,
    });

    mapRef.current.setCenter(location);
    mapRef.current.setZoom(17);
  };

  // =====================================================
  // SELECT LOCATION
  // =====================================================

  const selectGoogleLocation = (
    location: SelectedLocation,
    formattedAddress?: string,
  ) => {
    setLatitude(location.lat);
    setLongitude(location.lng);
    setMapLocationSet(true);

    // Important:
    // User typed address remains unchanged.
    // Google address is NOT copied into our address field.

    showMarker(location, formattedAddress || "Selected location");
  };

  // =====================================================
  // INITIALIZE GOOGLE MAP
  // =====================================================

  const initializeGoogleMap = async () => {
    if (!GOOGLE_MAPS_API_KEY) {
      throw new Error("Google Maps API key পাওয়া যায়নি।");
    }

    setOptions({
      key: GOOGLE_MAPS_API_KEY,
      v: "weekly",
    });

    const [{ Map }, { AdvancedMarkerElement }, { PlaceAutocompleteElement }] =
      await Promise.all([
        importLibrary("maps"),
        importLibrary("marker"),
        importLibrary("places"),
      ]);

    if (!mapContainerRef.current) {
      throw new Error("Map container পাওয়া যায়নি।");
    }

    // -------------------------------------------------
    // CREATE MAP
    // -------------------------------------------------

    mapRef.current = new Map(mapContainerRef.current, {
      center: {
        lat: 23.8103,
        lng: 90.4125,
      },
      zoom: 7,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      mapId: "DEMO_MAP_ID",
    });

    // -------------------------------------------------
    // CREATE PLACE AUTOCOMPLETE
    // -------------------------------------------------

    if (!autocompleteContainerRef.current) {
      throw new Error("Autocomplete container পাওয়া যায়নি।");
    }

    autocompleteContainerRef.current.innerHTML = "";

    const autocomplete = new PlaceAutocompleteElement();

    // Only Bangladesh
    autocomplete.includedRegionCodes = ["bd"];

    autocomplete.placeholder = "Address / road / area লিখুন...";

    autocomplete.requestedLanguage = "en";
    autocomplete.requestedRegion = "bd";

    autocompleteContainerRef.current.appendChild(autocomplete);

    autocompleteRef.current = autocomplete;

    // -------------------------------------------------
    // INITIAL SEARCH VALUE
    // -------------------------------------------------

    autocomplete.value = buildGoogleSearchText();

    // -------------------------------------------------
    // GOOGLE PLACE SELECT
    // -------------------------------------------------

    autocomplete.addEventListener("gmp-select", async (event: Event) => {
      try {
        setLoadingGoogle(true);
        setGoogleError("");

        const customEvent = event as CustomEvent;

        const prediction = customEvent.detail?.placePrediction;

        if (!prediction) {
          return;
        }

        const place = prediction.toPlace();

        await place.fetchFields({
          fields: [
            "displayName",
            "formattedAddress",
            "location",
            "addressComponents",
          ],
        });

        if (!place.location) {
          throw new Error("এই location-এর coordinates পাওয়া যায়নি।");
        }

        // -------------------------------------------------
        // CHECK SELECTED LOCATION
        // -------------------------------------------------

        const areaCheck = isPlaceInsideSelectedArea(place);

        if (!areaCheck.districtMatches || !areaCheck.divisionMatches) {
          setGoogleError(
            `এই location আপনার নির্বাচিত ${selectedDistrictName}, ${selectedDivisionName}-এর মধ্যে নয়। অন্য suggestion নির্বাচন করুন।`,
          );

          return;
        }

        // -------------------------------------------------
        // UPAZILA CHECK
        // -------------------------------------------------

        if (!areaCheck.upazilaMatches) {
          setGoogleError(
            `এই location "${selectedUpazilaName}"-এর মধ্যে Google address অনুযায়ী পাওয়া যায়নি। ${selectedUpazilaName}-এর অন্য suggestion নির্বাচন করুন।`,
          );

          return;
        }

        // -------------------------------------------------
        // SAVE COORDINATES
        // -------------------------------------------------

        selectGoogleLocation(
          {
            lat: place.location.lat(),
            lng: place.location.lng(),
          },
          place.formattedAddress || place.displayName || undefined,
        );

        setGoogleError("");
      } catch (err) {
        console.error("Google place selection error:", err);

        setGoogleError(
          "এই location নেওয়া যায়নি। অন্য Google suggestion নির্বাচন করুন।",
        );
      } finally {
        setLoadingGoogle(false);
      }
    });
  };

  // =====================================================
  // OPEN GOOGLE MAP
  // =====================================================

  const handleSetGoogleMap = async () => {
    setError("");
    setGoogleError("");

    if (!division) {
      setError("আগে Division নির্বাচন করুন।");
      return;
    }

    if (!district) {
      setError("আগে District নির্বাচন করুন।");
      return;
    }

    if (!upazila) {
      setError("আগে Upazila নির্বাচন করুন।");
      return;
    }

    if (!address.trim()) {
      setError("আগে Full Address লিখুন।");
      return;
    }

    if (!GOOGLE_MAPS_API_KEY) {
      setError("Google Maps API key পাওয়া যায়নি। .env.local চেক করুন।");
      return;
    }

    setShowGoogleMap(true);
    setLoadingGoogle(true);

    // Wait until modal DOM is rendered
    setTimeout(async () => {
      try {
        await initializeGoogleMap();
      } catch (err) {
        console.error("Google Maps error:", err);

        setGoogleError(
          err instanceof Error ? err.message : "Google Maps চালু করা যায়নি।",
        );
      } finally {
        setLoadingGoogle(false);
      }
    }, 100);
  };

  // =====================================================
  // CLOSE GOOGLE MAP
  // =====================================================

  const closeGoogleMap = () => {
    setShowGoogleMap(false);
    setGoogleError("");

    if (autocompleteContainerRef.current) {
      autocompleteContainerRef.current.innerHTML = "";
    }

    autocompleteRef.current = null;

    if (markerRef.current) {
      markerRef.current.map = null;
    }

    markerRef.current = null;
    mapRef.current = null;
  };

  // =====================================================
  // SAVE LOCATION
  // =====================================================

  const handleSaveLocation = async () => {
    setError("");

    if (!division) {
      setError("Division নির্বাচন করুন।");
      return;
    }

    if (!district) {
      setError("District নির্বাচন করুন।");
      return;
    }

    if (!upazila) {
      setError("Upazila নির্বাচন করুন।");
      return;
    }

    if (!address.trim()) {
      setError("Full Address লিখুন।");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.access_token) {
        setError("আপনার session পাওয়া যায়নি। আবার login করুন।");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/customers/location`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${session.access_token}`,
        },

        body: JSON.stringify({
          division,
          district,
          upazila,
          area,
          address,

          // Google coordinates
          latitude,
          longitude,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Location save করা যায়নি।");
      }

      router.push("/customer");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error ? err.message : "Location save করা যায়নি।",
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // MAYBE LATER
  // =====================================================

  const handleMaybeLater = () => {
    router.push("/customer");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loadingLocationData) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-600">
          <Loader2 className="w-5 h-5 animate-spin" />

          <span>লোকেশন ডাটা লোড হচ্ছে...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-[900px] mx-auto px-4 py-8">
        {/* HEADER */}

        <div className="bg-[#12233F] rounded-2xl px-6 py-6 mb-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <h1 className="text-xl font-bold">আপনার Location সেট করুন</h1>

              <p className="text-sm text-white/70 mt-1">
                সঠিক location দিলে কাছাকাছি seller এবং delivery charge নির্ধারণ
                করা সহজ হবে।
              </p>
            </div>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* FORM */}

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* DIVISION */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Division
              </label>

              <select
                value={division}
                onChange={handleDivisionChange}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20"
              >
                <option value="">Select Division</option>

                {divisions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DISTRICT */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                District
              </label>

              <select
                value={district}
                onChange={handleDistrictChange}
                disabled={!division}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none disabled:bg-slate-100 focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20"
              >
                <option value="">Select District</option>

                {filteredDistricts.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* UPAZILA */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Upazila
              </label>

              <select
                value={upazila}
                onChange={handleUpazilaChange}
                disabled={!district}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none disabled:bg-slate-100 focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20"
              >
                <option value="">Select Upazila</option>

                {filteredUpazilas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* AREA */}

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Area{" "}
                <span className="font-normal text-slate-400">(Optional)</span>
              </label>

              <input
                type="text"
                value={area}
                onChange={(e) => {
                  setArea(e.target.value);
                  resetGoogleLocation();
                }}
                placeholder="যেমন: Mollapara"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20"
              />
            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Address
              </label>

              <textarea
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  resetGoogleLocation();
                }}
                rows={4}
                placeholder="যেমন: Dhaka Road, Mollapara"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none resize-none focus:border-[#D6A419] focus:ring-2 focus:ring-[#D6A419]/20"
              />

              <p className="text-xs text-slate-500 mt-2">
                রাস্তা, এলাকা, বাড়ি/হোল্ডিং বা landmark যতটা সম্ভব লিখুন।
              </p>
            </div>
          </div>

          {/* GOOGLE MAP SECTION */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 shrink-0 rounded-xl bg-[#12233F] text-white flex items-center justify-center">
                <Map className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-800">
                  Google Maps Location
                </h3>

                <p className="text-sm text-slate-500 mt-1">
                  আপনার address অনুযায়ী Google Places matching location দেখাবে।
                  আপনি নিজে একটি location নির্বাচন করবেন।
                </p>

                <div className="mt-3 text-xs text-slate-500">
                  Search Area:
                  <span className="font-semibold text-slate-700 ml-1">
                    {selectedUpazilaName}, {selectedDistrictName},{" "}
                    {selectedDivisionName}
                  </span>
                </div>

                {mapLocationSet && latitude !== null && longitude !== null && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle2 className="w-4 h-4" />

                    <span>Google location selected</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleSetGoogleMap}
                disabled={!address.trim() || !division || !district || !upazila}
                className="shrink-0 rounded-xl bg-[#12233F] px-4 py-3 text-sm font-semibold text-white hover:bg-[#1c3458] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Set on Google Maps
              </button>
            </div>

            {/* COORDINATES */}

            {latitude !== null && longitude !== null && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-400">Latitude</p>

                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {latitude.toFixed(7)}
                  </p>
                </div>

                <div className="rounded-xl bg-white border border-slate-200 px-4 py-3">
                  <p className="text-xs text-slate-400">Longitude</p>

                  <p className="text-sm font-medium text-slate-700 mt-1">
                    {longitude.toFixed(7)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* BUTTONS */}

          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 mt-7 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={handleMaybeLater}
              className="px-5 py-3 rounded-xl border border-slate-300 text-slate-600 font-medium hover:bg-slate-50"
            >
              Maybe Later
            </button>

            <button
              type="button"
              onClick={handleSaveLocation}
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#D6A419] text-white font-semibold hover:bg-[#bd9014] disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save Location
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =================================================
          GOOGLE MAP MODAL
      ================================================= */}

      {showGoogleMap && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            {/* MODAL HEADER */}

            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-lg text-slate-800">
                  Google Maps Location
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Search context:
                  <span className="font-semibold text-slate-700 ml-1">
                    {selectedUpazilaName}, {selectedDistrictName},{" "}
                    {selectedDivisionName}
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={closeGoogleMap}
                className="w-10 h-10 rounded-xl hover:bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* SEARCH */}

            <div className="p-4 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-4 h-4 text-slate-500" />

                <span className="text-sm font-semibold text-slate-700">
                  Address Search
                </span>
              </div>

              <div
                ref={autocompleteContainerRef}
                className="google-autocomplete-container"
              />

              <p className="text-xs text-slate-500 mt-2">
                Google search:
                <span className="font-medium text-slate-700 ml-1">
                  {buildGoogleSearchText()}
                </span>
              </p>

              {googleError && (
                <div className="mt-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {googleError}
                </div>
              )}
            </div>

            {/* MAP */}

            <div className="relative flex-1">
              <div ref={mapContainerRef} className="absolute inset-0" />

              {loadingGoogle && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-slate-700 z-10">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Google Maps location search হচ্ছে...
                </div>
              )}

              {/* SELECTED LOCATION */}

              {latitude !== null && longitude !== null && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[420px] bg-white rounded-2xl shadow-xl p-4 z-10">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>

                    <div>
                      <p className="font-semibold text-slate-800">
                        Location selected
                      </p>

                      <p className="text-xs text-slate-500 mt-1">
                        Lat: {latitude.toFixed(7)}
                      </p>

                      <p className="text-xs text-slate-500">
                        Lng: {longitude.toFixed(7)}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={closeGoogleMap}
                    className="w-full mt-4 rounded-xl bg-[#12233F] text-white py-3 font-semibold hover:bg-[#1c3458]"
                  >
                    Use This Location
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* GOOGLE AUTOCOMPLETE STYLE */}

      <style jsx global>{`
        .google-autocomplete-container {
          width: 100%;
        }

        .google-autocomplete-container gmp-place-autocomplete {
          width: 100%;
          display: block;
        }
      `}</style>
    </div>
  );
}
