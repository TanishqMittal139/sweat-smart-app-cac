import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MapPin, Loader2, Apple, ShoppingBag, Utensils, Leaf } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Define libraries as a constant to prevent reloading
const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter = {
  lat: 37.7749,
  lng: -122.4194,
};

type PlaceType = "grocery_or_supermarket" | "health" | "restaurant" | "store";

interface FilterOption {
  id: string;
  label: string;
  icon: any;
  types: PlaceType[];
  keywords: string[];
}

const filterOptions: FilterOption[] = [
  {
    id: "grocery",
    label: "Healthy Grocery Stores",
    icon: ShoppingBag,
    types: ["grocery_or_supermarket", "store"],
    keywords: [], // Show all grocery stores, let users decide what's healthy
  },
  {
    id: "farmers",
    label: "Farmers Markets",
    icon: Apple,
    types: ["store"],
    keywords: ["farmers market", "farm market", "fresh produce", "farmers"],
  },
  {
    id: "restaurants",
    label: "Healthy Restaurants",
    icon: Utensils,
    types: ["restaurant"],
    keywords: [], // Show all restaurants, let users filter
  },
  {
    id: "organic",
    label: "Organic/Health Stores",
    icon: Leaf,
    types: ["health", "store"],
    keywords: ["organic", "health food", "natural", "vitamin", "supplement", "wellness"],
  },
];

const FoodFinder = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [places, setPlaces] = useState<google.maps.places.PlaceResult[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [activeFilters, setActiveFilters] = useState<string[]>(["grocery", "farmers", "restaurants", "organic"]);
  const [loading, setLoading] = useState(false);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(userLocation);
          toast({
            title: "Location found",
            description: "Showing healthy food options near you",
          });
        },
        () => {
          toast({
            title: "Location access denied",
            description: "Using default location. Enable location for better results.",
            variant: "destructive",
          });
        }
      );
    }
  }, []);

  // Search for places when filters or map changes
  useEffect(() => {
    if (map && isLoaded && activeFilters.length > 0) {
      searchNearbyPlaces();
    }
  }, [map, isLoaded, activeFilters, center]);

  const searchNearbyPlaces = () => {
    if (!map) return;

    setLoading(true);
    const service = new google.maps.places.PlacesService(map);
    const allPlaces: google.maps.places.PlaceResult[] = [];

    const selectedFilters = filterOptions.filter((f) => activeFilters.includes(f.id));
    
    // Calculate total number of searches needed (with pagination - up to 3 pages per search)
    const maxPagesPerSearch = 3; // Google Places API allows up to 3 pages (60 results max)
    const totalSearches = selectedFilters.reduce((sum, filter) => sum + filter.types.length, 0);
    let completedSearches = 0;

    if (totalSearches === 0) {
      setPlaces([]);
      setLoading(false);
      return;
    }

    // Enhanced search with pagination to get more diverse results
    const performSearch = (
      request: google.maps.places.PlaceSearchRequest,
      filter: FilterOption,
      pageNum: number = 1
    ) => {
      service.nearbySearch(request, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // Filter results by keywords - use OR logic (any keyword match)
          const filtered = results.filter((place) => {
            const name = place.name?.toLowerCase() || "";
            const types = place.types?.join(" ").toLowerCase() || "";
            const vicinity = place.vicinity?.toLowerCase() || "";
            
            // If no keywords, include all results of this type
            if (filter.keywords.length === 0) return true;
            
            // Check if any keyword matches
            return filter.keywords.some((keyword) => {
              const lowerKeyword = keyword.toLowerCase();
              return name.includes(lowerKeyword) || 
                     types.includes(lowerKeyword) || 
                     vicinity.includes(lowerKeyword);
            });
          });
          
          allPlaces.push(...filtered);

          // Check if we should get more results from next page
          if (pagination && pagination.hasNextPage && pageNum < maxPagesPerSearch) {
            // Add a small delay to avoid rate limiting
            setTimeout(() => {
              pagination.nextPage();
            }, 300); // 300ms delay between pagination requests
            return; // Don't increment completedSearches yet
          }
        }
        
        completedSearches++;
        
        // When all searches complete, update places
        if (completedSearches === totalSearches) {
          // Remove duplicates by place_id and sort by rating
          const uniquePlaces = Array.from(
            new Map(allPlaces.map((place) => [place.place_id, place])).values()
          ).sort((a, b) => (b.rating || 0) - (a.rating || 0));
          
          setPlaces(uniquePlaces);
          setLoading(false);
          
          if (uniquePlaces.length === 0) {
            toast({
              title: "No places found",
              description: "Try adjusting your filters or searching a different area.",
            });
          } else {
            toast({
              title: "Search complete",
              description: `Found ${uniquePlaces.length} healthy food locations within 5 miles`,
            });
          }
        }
      });
    };

    // Stagger the search requests slightly to prevent API rate limiting
    selectedFilters.forEach((filter, filterIndex) => {
      filter.types.forEach((type, typeIndex) => {
        const delay = (filterIndex * filter.types.length + typeIndex) * 100; // 100ms stagger
        
        setTimeout(() => {
          const request = {
            location: center,
            radius: 8047, // 5 miles in meters
            type: type,
          };

          performSearch(request, filter);
        }, delay);
      });
    });
  };

  const toggleFilter = (filterId: string) => {
    setActiveFilters((prev) =>
      prev.includes(filterId) ? prev.filter((id) => id !== filterId) : [...prev, filterId]
    );
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Food Finder
          </h1>
          <p className="text-muted-foreground">
            Discover healthy food stores, farmers markets, and restaurants near you
          </p>
        </div>

        {!GOOGLE_MAPS_API_KEY && (
          <Card className="p-6 mb-6 border-warning bg-warning/10">
            <h3 className="font-semibold text-warning mb-2">Google Maps API Key Required</h3>
            <p className="text-sm text-muted-foreground">
              To use this feature, you need to add your Google Maps API key. Get one from the{" "}
              <a
                href="https://console.cloud.google.com/google/maps-apis"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Google Cloud Console
              </a>{" "}
              and add it to your environment variables.
            </p>
          </Card>
        )}

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <Card className="p-6 h-fit lg:col-span-1">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Filters
            </h2>
            <div className="space-y-4">
              {filterOptions.map((filter) => {
                const Icon = filter.icon;
                return (
                  <div key={filter.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={filter.id}
                      checked={activeFilters.includes(filter.id)}
                      onCheckedChange={() => toggleFilter(filter.id)}
                    />
                    <label
                      htmlFor={filter.id}
                      className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      {filter.label}
                    </label>
                  </div>
                );
              })}
            </div>

            <Button onClick={searchNearbyPlaces} className="w-full mt-6" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <MapPin className="w-4 h-4 mr-2" />
                  Refresh Results
                </>
              )}
            </Button>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>{places.length}</strong> healthy food locations found nearby
              </p>
            </div>
          </Card>

          {/* Map */}
          <div className="lg:col-span-3">
            <Card className="overflow-hidden">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{
                  styles: [
                    {
                      featureType: "poi",
                      elementType: "labels",
                      stylers: [{ visibility: "off" }],
                    },
                  ],
                }}
              >
                {/* User location marker */}
                <Marker
                  position={center}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#4F46E5",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 2,
                  }}
                />

                {/* Place markers */}
                {places.map((place) => (
                  place.geometry?.location && (
                    <Marker
                      key={place.place_id}
                      position={{
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      }}
                      onClick={() => setSelectedPlace(place)}
                      icon={{
                        url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
                      }}
                    />
                  )
                ))}

                {/* Info window */}
                {selectedPlace && selectedPlace.geometry?.location && (
                  <InfoWindow
                    position={{
                      lat: selectedPlace.geometry.location.lat(),
                      lng: selectedPlace.geometry.location.lng(),
                    }}
                    onCloseClick={() => setSelectedPlace(null)}
                  >
                    <div className="p-2">
                      <h3 className="font-semibold text-lg mb-1">{selectedPlace.name}</h3>
                      {selectedPlace.vicinity && (
                        <p className="text-sm text-gray-600 mb-2">{selectedPlace.vicinity}</p>
                      )}
                      {selectedPlace.rating && (
                        <p className="text-sm">
                          ⭐ {selectedPlace.rating} ({selectedPlace.user_ratings_total} reviews)
                        </p>
                      )}
                      {selectedPlace.opening_hours && (
                        <p className="text-sm mt-1">
                          {selectedPlace.opening_hours.open_now ? "🟢 Open now" : "🔴 Closed"}
                        </p>
                      )}
                    </div>
                  </InfoWindow>
                )}
              </GoogleMap>
            </Card>

            {/* Results list */}
            <div className="mt-6 space-y-3">
              <h2 className="text-xl font-semibold mb-4">
                All Locations ({places.length} found)
              </h2>
              {places.map((place) => (
                <Card
                  key={place.place_id}
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedPlace(place);
                    if (place.geometry?.location) {
                      setCenter({
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                      });
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{place.name}</h3>
                      {place.vicinity && (
                        <p className="text-sm text-muted-foreground mt-1">{place.vicinity}</p>
                      )}
                    </div>
                    {place.rating && (
                      <div className="text-sm font-medium">⭐ {place.rating}</div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FoodFinder;
