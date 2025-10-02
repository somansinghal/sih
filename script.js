// Garudyaan - Live Public Transport Tracking
// JavaScript functionality for the website

let selectedCity = null;
let currentRoutes = [];
let selectedRoute = null;
let trackingInterval = null;


const cityData = {
    indore: {
        name: 'Indore',
        state: 'Madhya Pradesh',
        routes: [
            {
                id: 'IND001',
                number: '101',
                type: 'bus',
                name: 'Rajwada to Airport',
                from: 'Rajwada Palace',
                to: 'Devi Ahilya Bai Holkar Airport',
                status: 'on-time',
                nextArrival: '5 min',
                frequency: '15 min',
                stops: ['Rajwada', 'Sarafa Bazaar', 'Palasia', 'Airport Road', 'Airport'],
                currentLocation: { lat: 22.7196, lng: 75.8577 },
                color: '#FF6B35'
            },
            {
                id: 'IND002',
                number: '102',
                type: 'bus',
                name: 'Railway Station to Bypass',
                from: 'Indore Junction',
                to: 'Ring Road Bypass',
                status: 'delayed',
                nextArrival: '12 min',
                frequency: '20 min',
                stops: ['Railway Station', 'Central Museum', 'Lal Bagh Palace', 'Bypass'],
                currentLocation: { lat: 22.7179, lng: 75.8683 },
                color: '#F7931E'
            },
            {
                id: 'IND003',
                number: '201',
                type: 'train',
                name: 'Local Train Route',
                from: 'Indore Junction',
                to: 'Dewas',
                status: 'on-time',
                nextArrival: '8 min',
                frequency: '30 min',
                stops: ['Indore Junction', 'Lakshmibai Nagar', 'Dewas'],
                currentLocation: { lat: 22.7179, lng: 75.8683 },
                color: '#118AB2'
            }
        ]
    },
    bhopal: {
        name: 'Bhopal',
        state: 'Madhya Pradesh',
        routes: [
            {
                id: 'BHO001',
                number: '301',
                type: 'bus',
                name: 'New Market to Airport',
                from: 'New Market',
                to: 'Raja Bhoj Airport',
                status: 'on-time',
                nextArrival: '7 min',
                frequency: '18 min',
                stops: ['New Market', 'MP Nagar', 'Airport Road', 'Airport'],
                currentLocation: { lat: 23.2599, lng: 77.4126 },
                color: '#FF6B35'
            },
            {
                id: 'BHO002',
                number: '302',
                type: 'bus',
                name: 'Railway Station to Lake',
                from: 'Bhopal Junction',
                to: 'Upper Lake',
                status: 'on-time',
                nextArrival: '4 min',
                frequency: '12 min',
                stops: ['Railway Station', 'Habibganj', 'Shamla Hills', 'Upper Lake'],
                currentLocation: { lat: 23.2599, lng: 77.4126 },
                color: '#F7931E'
            }
        ]
    },
    nagpur: {
        name: 'Nagpur',
        state: 'Maharashtra',
        routes: [
            {
                id: 'NAG001',
                number: '401',
                type: 'bus',
                name: 'Railway Station to Airport',
                from: 'Nagpur Junction',
                to: 'Dr. Babasaheb Ambedkar Airport',
                status: 'delayed',
                nextArrival: '15 min',
                frequency: '25 min',
                stops: ['Railway Station', 'Sitabuldi', 'Airport Road', 'Airport'],
                currentLocation: { lat: 21.1458, lng: 79.0882 },
                color: '#FF6B35'
            }
        ]
    },
    coimbatore: {
        name: 'Coimbatore',
        state: 'Tamil Nadu',
        routes: [
            {
                id: 'COI001',
                number: '501',
                type: 'bus',
                name: 'Railway Station to Airport',
                from: 'Coimbatore Junction',
                to: 'Coimbatore Airport',
                status: 'on-time',
                nextArrival: '6 min',
                frequency: '20 min',
                stops: ['Railway Station', 'Gandhipuram', 'Airport Road', 'Airport'],
                currentLocation: { lat: 11.0168, lng: 76.9558 },
                color: '#FF6B35'
            }
        ]
    },
    kochi: {
        name: 'Kochi',
        state: 'Kerala',
        routes: [
            {
                id: 'KOC001',
                number: '601',
                type: 'bus',
                name: 'Fort Kochi to Airport',
                from: 'Fort Kochi',
                to: 'Cochin Airport',
                status: 'on-time',
                nextArrival: '9 min',
                frequency: '22 min',
                stops: ['Fort Kochi', 'Marine Drive', 'Airport Road', 'Airport'],
                currentLocation: { lat: 9.9312, lng: 76.2673 },
                color: '#FF6B35'
            }
        ]
    },
    mysore: {
        name: 'Mysore',
        state: 'Karnataka',
        routes: [
            {
                id: 'MYS001',
                number: '701',
                type: 'bus',
                name: 'Palace to Railway Station',
                from: 'Mysore Palace',
                to: 'Mysore Junction',
                status: 'on-time',
                nextArrival: '3 min',
                frequency: '10 min',
                stops: ['Palace', 'Devaraja Market', 'Railway Station'],
                currentLocation: { lat: 12.2958, lng: 76.6394 },
                color: '#FF6B35'
            }
        ]
    }
};


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadPopularRoutes();
});


function initializeApp() {
    console.log('Garudyaan - Live Public Transport Tracking initialized');
    

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
    

    initializeMobileMenu();
    

    window.addEventListener('scroll', handleNavbarScroll);
}


function setupEventListeners() {

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            const filterType = this.getAttribute('data-type');
            filterRoutes(filterType);
        });
    });
    

    const searchInput = document.getElementById('routeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchRoutes(searchTerm);
        });
    }
}


function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
}


function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}


function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 70; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}


function selectCity(cityKey) {
    selectedCity = cityKey;
    const city = cityData[cityKey];
    
    if (city) {
        // Update UI to show selected city
        updateSelectedCityUI(city);
        
        // Load routes for selected city
        loadCityRoutes(city);
        
        // Scroll to tracking section
        scrollToSection('track');
        
        // Show success message
        showNotification(`Selected ${city.name}, ${city.state}`, 'success');
    }
}


function updateSelectedCityUI(city) {
    const selectedRouteDiv = document.getElementById('selectedRoute');
    if (selectedRouteDiv) {
        selectedRouteDiv.innerHTML = `
            <h3>Selected City: ${city.name}</h3>
            <p>${city.state} - ${city.routes.length} routes available</p>
            <div class="city-stats">
                <span class="stat">
                    <i class="fas fa-bus"></i>
                    ${city.routes.filter(r => r.type === 'bus').length} Buses
                </span>
                <span class="stat">
                    <i class="fas fa-train"></i>
                    ${city.routes.filter(r => r.type === 'train').length} Trains
                </span>
            </div>
        `;
    }
}

// Load city routes
function loadCityRoutes(city) {
    currentRoutes = city.routes;
    displayRoutes(city.routes);
    updateMap(city.routes);
}

// Display routes in the route list
function displayRoutes(routes) {
    const routeList = document.getElementById('routeList');
    if (!routeList) return;
    
    if (routes.length === 0) {
        routeList.innerHTML = '<div class="no-routes">No routes found</div>';
        return;
    }
    
    routeList.innerHTML = routes.map(route => `
        <div class="route-item" onclick="selectRoute('${route.id}')">
            <div class="route-header">
                <span class="route-number">${route.number}</span>
                <span class="route-status ${route.status}">${route.status}</span>
            </div>
            <div class="route-details">
                <div class="route-name">${route.name}</div>
                <div class="route-info">
                    <span><i class="fas fa-clock"></i> Next: ${route.nextArrival}</span>
                    <span><i class="fas fa-sync"></i> Every: ${route.frequency}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Select a route for tracking
function selectRoute(routeId) {
    const route = currentRoutes.find(r => r.id === routeId);
    if (!route) return;
    
    selectedRoute = route;
    updateSelectedRouteUI(route);
    updateMap([route]);
    startRouteTracking(route);
    
    // Highlight selected route
    const routeItems = document.querySelectorAll('.route-item');
    routeItems.forEach(item => item.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

// Update selected route UI
function updateSelectedRouteUI(route) {
    const selectedRouteDiv = document.getElementById('selectedRoute');
    if (selectedRouteDiv) {
        selectedRouteDiv.innerHTML = `
            <h3>Route ${route.number} - ${route.name}</h3>
            <p><strong>From:</strong> ${route.from}</p>
            <p><strong>To:</strong> ${route.to}</p>
            <div class="route-status-info">
                <span class="status-badge ${route.status}">${route.status}</span>
                <span class="next-arrival">Next arrival: ${route.nextArrival}</span>
            </div>
            <div class="route-stops">
                <h4>Stops:</h4>
                <ul>
                    ${route.stops.map(stop => `<li>${stop}</li>`).join('')}
                </ul>
            </div>
        `;
    }
}

// Update map (placeholder for now)
function updateMap(routes) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    // This would integrate with a real map service like Google Maps or OpenStreetMap
    mapElement.innerHTML = `
        <div class="map-placeholder">
            <i class="fas fa-map"></i>
            <p>Map showing ${routes.length} route(s)</p>
            <div class="route-markers">
                ${routes.map(route => `
                    <div class="route-marker" style="background-color: ${route.color}">
                        ${route.number}
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// Start route tracking
function startRouteTracking(route) {
    // Clear any existing tracking interval
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
    
    // Start new tracking interval (simulate real-time updates)
    trackingInterval = setInterval(() => {
        updateRouteLocation(route);
    }, 5000); // Update every 5 seconds
    
    showNotification(`Started tracking Route ${route.number}`, 'info');
}

// Update route location (simulated)
function updateRouteLocation(route) {
    // Simulate location updates
    const randomLat = route.currentLocation.lat + (Math.random() - 0.5) * 0.01;
    const randomLng = route.currentLocation.lng + (Math.random() - 0.5) * 0.01;
    
    route.currentLocation = { lat: randomLat, lng: randomLng };
    
    // Update arrival time
    const currentTime = parseInt(route.nextArrival);
    if (currentTime > 1) {
        route.nextArrival = `${currentTime - 1} min`;
    } else {
        route.nextArrival = 'Arriving now';
    }
    
    // Update UI if this is the selected route
    if (selectedRoute && selectedRoute.id === route.id) {
        updateSelectedRouteUI(route);
    }
    
    // Update route list
    displayRoutes(currentRoutes);
}

// Filter routes by type
function filterRoutes(type) {
    if (!selectedCity) {
        showNotification('Please select a city first', 'warning');
        return;
    }
    
    const city = cityData[selectedCity];
    let filteredRoutes = city.routes;
    
    if (type !== 'all') {
        filteredRoutes = city.routes.filter(route => route.type === type);
    }
    
    displayRoutes(filteredRoutes);
    updateMap(filteredRoutes);
}

// Search routes
function searchRoutes(searchTerm) {
    if (!selectedCity) {
        showNotification('Please select a city first', 'warning');
        return;
    }
    
    const city = cityData[selectedCity];
    let filteredRoutes = city.routes;
    
    if (searchTerm) {
        filteredRoutes = city.routes.filter(route => 
            route.number.toLowerCase().includes(searchTerm) ||
            route.name.toLowerCase().includes(searchTerm) ||
            route.from.toLowerCase().includes(searchTerm) ||
            route.to.toLowerCase().includes(searchTerm)
        );
    }
    
    displayRoutes(filteredRoutes);
    updateMap(filteredRoutes);
}

// Search route function (called from HTML)
function searchRoute() {
    const searchInput = document.getElementById('routeSearch');
    if (searchInput) {
        const searchTerm = searchInput.value.toLowerCase();
        searchRoutes(searchTerm);
    }
}

// Load popular routes
function loadPopularRoutes() {
    const routesGrid = document.getElementById('routesGrid');
    if (!routesGrid) return;
    
    // Get popular routes from all cities
    const popularRoutes = [];
    Object.values(cityData).forEach(city => {
        city.routes.slice(0, 2).forEach(route => {
            popularRoutes.push({ ...route, city: city.name });
        });
    });
    
    // Shuffle and take first 6
    const shuffled = popularRoutes.sort(() => 0.5 - Math.random());
    const displayRoutes = shuffled.slice(0, 6);
    
    routesGrid.innerHTML = displayRoutes.map(route => `
        <div class="route-card" onclick="selectPopularRoute('${route.id}', '${route.city.toLowerCase()}')">
            <div class="route-card-header">
                <span class="route-card-number">${route.number}</span>
                <span class="route-card-type ${route.type}">${route.type}</span>
            </div>
            <div class="route-card-route">${route.name}</div>
            <div class="route-card-details">
                <span>${route.from} → ${route.to}</span>
                <span>${route.city}</span>
            </div>
        </div>
    `).join('');
}

// Select popular route
function selectPopularRoute(routeId, cityKey) {
    selectCity(cityKey);
    setTimeout(() => {
        selectRoute(routeId);
    }, 500);
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

// Get notification icon
function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Utility functions
function formatTime(minutes) {
    if (minutes < 60) {
        return `${minutes} min`;
    } else {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }
}

function getDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Add CSS for notifications
const notificationStyles = `
    .notification {
        position: fixed;
        top: 90px;
        right: 20px;
        background: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 400px;
    }
    
    .notification-success {
        border-left: 4px solid #06D6A0;
    }
    
    .notification-error {
        border-left: 4px solid #EF476F;
    }
    
    .notification-warning {
        border-left: 4px solid #FFD23F;
    }
    
    .notification-info {
        border-left: 4px solid #118AB2;
    }
    
    .notification button {
        background: none;
        border: none;
        cursor: pointer;
        color: #666;
        margin-left: auto;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .route-item.selected {
        background: #f0f8ff;
        border-left: 4px solid #FF6B35;
    }
    
    .city-stats {
        display: flex;
        gap: 15px;
        margin-top: 10px;
    }
    
    .stat {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 14px;
        color: #666;
    }
    
    .route-status-info {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
    }
    
    .status-badge {
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        text-transform: uppercase;
    }
    
    .status-badge.on-time {
        background: #06D6A0;
        color: white;
    }
    
    .status-badge.delayed {
        background: #FFD23F;
        color: #333;
    }
    
    .status-badge.offline {
        background: #ccc;
        color: white;
    }
    
    .route-stops {
        margin-top: 15px;
    }
    
    .route-stops h4 {
        margin-bottom: 8px;
        font-size: 14px;
        color: #333;
    }
    
    .route-stops ul {
        list-style: none;
        padding: 0;
    }
    
    .route-stops li {
        padding: 4px 0;
        font-size: 13px;
        color: #666;
        border-bottom: 1px solid #eee;
    }
    
    .route-stops li:last-child {
        border-bottom: none;
    }
    
    .route-markers {
        display: flex;
        gap: 10px;
        margin-top: 15px;
        flex-wrap: wrap;
    }
    
    .route-marker {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 600;
        font-size: 14px;
    }
    
    .no-routes {
        text-align: center;
        padding: 40px;
        color: #666;
        font-style: italic;
    }
    
    .route-info {
        display: flex;
        gap: 15px;
        margin-top: 5px;
        font-size: 12px;
        color: #666;
    }
    
    .route-info span {
        display: flex;
        align-items: center;
        gap: 4px;
    }
`;

// Add styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);
