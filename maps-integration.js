// Google Maps Integration for Garudyaan

let map;
let vehicleMarkers = [];
let markers = [];
let polylines = [];
let mapInitialized = false;

function initMap() {
    console.log("Google Maps API loaded, initializing map.");
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error("Map element not found.");
        return;
    }

    // Default center to a central point in India
    const defaultCenter = { lat: 20.5937, lng: 78.9629 };

    map = new google.maps.Map(mapElement, {
        center: defaultCenter,
        zoom: 5,
        mapId: 'GARUDYAAN_MAP_ID', // Example Map ID for styling
        disableDefaultUI: true,
        zoomControl: true,
        scaleControl: true,
    });

    mapInitialized = true;
    console.log("Map initialized successfully.");

    // If routes are already selected, display them
    if (window.currentRoutes && window.currentRoutes.length > 0) {
        displayRoutesOnMap(window.currentRoutes);
    }
}

function handleMapsError() {
    console.error("Google Maps script failed to load. Falling back to placeholder map.");
    mapInitialized = false;
    const mapElement = document.getElementById('map');
    if (mapElement) {
        mapElement.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map-marked-alt"></i>
                <p>Could not load map. Please check your API key and internet connection.</p>
            </div>
        `;
    }
    // Ensure fallback is triggered if routes are present
    if (window.currentRoutes) {
        updateFallbackMap(window.currentRoutes);
    }
}

function clearMap() {
    vehicleMarkers.forEach(marker => marker.setMap(null));
    vehicleMarkers = [];
    markers.forEach(marker => marker.setMap(null));
    markers = [];
    polylines.forEach(line => line.setMap(null));
    polylines = [];
}

function displayRoutesOnMap(routes) {
    if (!mapInitialized) return;


    vehicleMarkers.forEach(marker => marker.setMap(null));
    vehicleMarkers = [];

    const bounds = new google.maps.LatLngBounds();


    routes.forEach(route => {
        const vehicleMarker = new google.maps.Marker({
            position: route.currentLocation,
            map: map,
            title: `Route ${route.number}: ${route.name}`,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: route.color || '#FF6B35',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: 'white'
            },
            label: {
                text: route.number,
                color: 'white',
                fontSize: '10px',
                fontWeight: 'bold'
            }
        });

        vehicleMarkers.push(vehicleMarker);
        bounds.extend(route.currentLocation);
    });

    if (routes.length > 0) {
        map.fitBounds(bounds);
    }
}

function displaySingleRoutePath(route) {
    if (!mapInitialized) return;

    // Clear previous route path and stop markers
    polylines.forEach(line => line.setMap(null));
    polylines = [];
    markers.forEach(marker => marker.setMap(null));
    markers = [];

    const bounds = new google.maps.LatLngBounds();


    const vehicleMarker = vehicleMarkers.find(m => m.title.startsWith(`Route ${route.number}`));
    if (vehicleMarker) {
        bounds.extend(vehicleMarker.getPosition());
    }

    if (route.stops && route.stops.length > 1 && route.stops[0].location) {
        const pathCoordinates = route.stops.map(stop => stop.location);
        
        const routePath = new google.maps.Polyline({
            path: pathCoordinates,
            geodesic: true,
            strokeColor: route.color || '#FF6B35',
            strokeOpacity: 0.8,
            strokeWeight: 5,
        });
        routePath.setMap(map);
        polylines.push(routePath);


        route.stops.forEach(stop => {
            const stopMarker = new google.maps.Marker({
                position: stop.location,
                map: map,
                title: stop.name,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    fillColor: '#FFFFFF',
                    fillOpacity: 1,
                    strokeColor: route.color || '#FF6B35',
                    strokeWeight: 2,
                },
            });
            markers.push(stopMarker);
            bounds.extend(stop.location);
        });
    }

    map.fitBounds(bounds);
}

function updateRouteLocationOnMap(route) {
    if (!mapInitialized) return;

    const marker = vehicleMarkers.find(m => m.title.startsWith(`Route ${route.number}`));
    if (marker) {
        const newPosition = new google.maps.LatLng(route.currentLocation.lat, route.currentLocation.lng);
        marker.setPosition(newPosition);

        // Add info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="route-info-window">
                    <h3>Route ${route.number}</h3>
                    <p>${route.name}</p>
                    <p><strong>Status:</strong> ${route.status}</p>
                    <p><strong>Next Arrival:</strong> ${route.nextArrival}</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });
    }
}

function centerMapOnRoute(route) {
    if (mapInitialized && route.currentLocation) {
        map.panTo(route.currentLocation);
        map.setZoom(14);
    }
}

// Expose functions to the global scope to be accessible from other scripts
window.initMap = initMap;
window.handleMapsError = handleMapsError;
window.displayRoutesOnMap = displayRoutesOnMap;
window.displaySingleRoutePath = displaySingleRoutePath;
window.updateRouteLocation = updateRouteLocationOnMap;
window.centerMapOnRoute = centerMapOnRoute;