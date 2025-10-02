// Enhanced Garudyaan - Live Public Transport Tracking
// Advanced JavaScript functionality with themes, languages, and animations


let selectedCity = null;
let currentRoutes = [];
let selectedRoute = null;
let trackingInterval = null;
let currentLanguage = 'en';
let currentTheme = 'light';
let favorites = JSON.parse(localStorage.getItem('garudyaan_favorites') || '[]');
let notifications = [];


document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadPopularRoutes();
    loadUserPreferences();
    initializeAnimations();
    initializeClock();
    updateDynamicStats();
});


function initializeApp() {
    console.log('Enhanced Garudyaan - Live Public Transport Tracking initialized');
    

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
    

    initializeIntersectionObserver();
    

    updateFavoritesCount();
}

function updateDynamicStats() {
    if (typeof CONFIG === 'undefined' || !CONFIG.cities) {
        return;
    }

    const cityCount = Object.keys(CONFIG.cities).length;
    let routeCount = 0;
    for (const cityKey in CONFIG.cities) {
        const city = CONFIG.cities[cityKey];
        if (city.routes) {
            const cityRouteCount = city.routes.length;
            routeCount += cityRouteCount;

            // Update individual city card route count on index.html
            const cityCardRouteCountEl = document.getElementById(`route-count-${cityKey}`);
            if (cityCardRouteCountEl) {
                cityCardRouteCountEl.innerHTML = `<i class="fas fa-route"></i> ${cityRouteCount}`;
            }
        }
    }

    const heroCityCountEl = document.getElementById('dynamic-city-count');
    if (heroCityCountEl) heroCityCountEl.textContent = cityCount;

    const heroRouteCountEl = document.getElementById('dynamic-route-count');
    if (heroRouteCountEl) heroRouteCountEl.textContent = `${routeCount}+`;

    const aboutCityCountEl = document.getElementById('about-city-count');
    if (aboutCityCountEl) aboutCityCountEl.textContent = `${cityCount}+ Cities`;

    const aboutRouteCountEl = document.getElementById('about-route-count');
    if (aboutRouteCountEl) aboutRouteCountEl.textContent = `${routeCount}+ Routes`;
}


function loadUserPreferences() {
    const savedLanguage = localStorage.getItem('garudyaan_language') || 'en';
    const savedTheme = localStorage.getItem('garudyaan_theme') || 'light';
    
    changeLanguage(savedLanguage, false);
    changeTheme(savedTheme, false);
}


function setupEventListeners() {

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {

            filterButtons.forEach(b => b.classList.remove('active'));

            this.classList.add('active');
            
            const filterType = this.getAttribute('data-type');
            if (filterType) {
                filterRoutes(filterType);
            } else {
                const region = this.getAttribute('data-region');
                if (region) {
                    filterCitiesByRegion(region);
                }
            }
        });
    });
    

    const searchInput = document.getElementById('routeSearch');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            searchRoutes(searchTerm);
        });
    }
    

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.language-selector')) {
            closeLanguageMenu();
        }
        if (!e.target.closest('.theme-selector')) {
            closeThemeMenu();
        }
        if (!e.target.closest('.user-info-btn')) {
            closeUserMenu();
        }
    });
    

    const contactForm = document.querySelector('.contact-form form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = (document.getElementById('loginEmail') || {}).value || '';
            const password = (document.getElementById('loginPassword') || {}).value || '';
            if (!email || !password) {
                showNotification('Please enter email and password', 'warning');
                return;
            }
            showLoading();
            setTimeout(() => {
                hideLoading();
                showNotification('Logged in successfully (demo)', 'success');
            }, 1000);
        });
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = (document.getElementById('regName') || {}).value || '';
            const email = (document.getElementById('regEmail') || {}).value || '';
            const password = (document.getElementById('regPassword') || {}).value || '';
            if (!name || !email || !password) {
                showNotification('Please fill all required fields', 'warning');
                return;
            }
            showLoading();
            setTimeout(() => {
                hideLoading();
                showNotification('Account created (demo)', 'success');
            }, 1200);
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


function initializeIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    

    const elementsToAnimate = document.querySelectorAll('.city-card, .route-card, .feature, .contact-item');
    elementsToAnimate.forEach(el => observer.observe(el));
}


function initializeAnimations() {

    const cityCards = document.querySelectorAll('.city-card');
    cityCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    

    const transportIcons = document.querySelectorAll('.transport-icon');
    transportIcons.forEach((icon, index) => {
        icon.style.animationDelay = `${index * 0.2}s`;
    });
}


function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    menu.classList.toggle('active');
    closeThemeMenu(); // Close other menus
}

function closeLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    menu.classList.remove('active');
}

function changeLanguage(lang, save = true) {
    if (!CONFIG.languages[lang]) return;
    
    currentLanguage = lang;
    const language = CONFIG.languages[lang];
    

    const currentLangSpan = document.querySelector('.current-lang');
    if (currentLangSpan) {
        currentLangSpan.textContent = `${language.flag} ${language.name}`;
    }
    

    document.documentElement.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;
    

    const translatableElements = document.querySelectorAll('[data-translate]');
    translatableElements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
            element.textContent = TRANSLATIONS[lang][key];
        }
    });
    // Update placeholders where applicable
    const routeSearch = document.getElementById('routeSearch');
    if (routeSearch && TRANSLATIONS[lang] && TRANSLATIONS[lang].searchPlaceholder) {
        routeSearch.setAttribute('placeholder', TRANSLATIONS[lang].searchPlaceholder);
    }
    

    if (save) {
        localStorage.setItem('garudyaan_language', lang);
    }
    
    closeLanguageMenu();
    showNotification(`Language changed to ${language.name}`, 'success');
}


function toggleThemeMenu() {
    const menu = document.getElementById('themeMenu');
    menu.classList.toggle('active');
    closeLanguageMenu(); // Close other menus
}

function closeThemeMenu() {
    const menu = document.getElementById('themeMenu');
    menu.classList.remove('active');
}

function changeTheme(theme, save = true) {
    if (!CONFIG.themes[theme]) return;
    
    currentTheme = theme;
    const themeConfig = CONFIG.themes[theme];
    

    const currentThemeSpan = document.querySelector('.current-theme');
    if (currentThemeSpan) {
        currentThemeSpan.textContent = themeConfig.icon;
    }
    

    document.documentElement.setAttribute('data-theme', theme);
    

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
        metaThemeColor.content = themeConfig.colors.primary;
    }
    

    const root = document.documentElement;
    Object.entries(themeConfig.colors).forEach(([key, value]) => {
        root.style.setProperty(`--theme-${key}`, value);
    });
    

    if (save) {
        localStorage.setItem('garudyaan_theme', theme);
    }
    
    closeThemeMenu();
    showNotification(`Theme changed to ${themeConfig.name}`, 'success');
}


function toggleFavorites() {
    const modal = document.getElementById('favoritesModal');
    modal.classList.toggle('active');
    
    if (modal.classList.contains('active')) {
        displayFavorites();
    }
}

function addToFavorites(route) {
    if (!favorites.find(fav => fav.id === route.id)) {
        favorites.push(route);
        localStorage.setItem('garudyaan_favorites', JSON.stringify(favorites));
        updateFavoritesCount();
        showNotification(`Route ${route.number} added to favorites`, 'success');
    }
}

function removeFromFavorites(routeId) {
    favorites = favorites.filter(fav => fav.id !== routeId);
    localStorage.setItem('garudyaan_favorites', JSON.stringify(favorites));
    updateFavoritesCount();
    displayFavorites();
    showNotification('Route removed from favorites', 'info');
}

function updateFavoritesCount() {
    const countElement = document.querySelector('.favorites-count');
    if (countElement) {
        countElement.textContent = favorites.length;
    }
}

function displayFavorites() {
    const favoritesList = document.getElementById('favoritesList');
    if (!favoritesList) return;
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="no-favorites">No favorite routes yet</p>';
        return;
    }
    
    favoritesList.innerHTML = favorites.map(route => `
        <div class="favorite-item">
            <div class="favorite-info">
                <h4>Route ${route.number}</h4>
                <p>${route.name}</p>
                <span class="favorite-city">${CONFIG.cities[selectedCity]?.name || 'Unknown City'}</span>
            </div>
            <div class="favorite-actions">
                <button onclick="selectRoute('${route.id}')" class="btn btn-sm btn-primary">Track</button>
                <button onclick="removeFromFavorites('${route.id}')" class="btn btn-sm btn-danger">Remove</button>
            </div>
        </div>
    `).join('');
}


function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const offsetTop = section.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}


function selectCity(cityKey) {
    if (!CONFIG.cities[cityKey]) return;
    
    selectedCity = cityKey;
    const city = CONFIG.cities[cityKey];
    

    showLoading();
    

    setTimeout(() => {
        
        updateSelectedCityUI(city);
        
        
        loadCityRoutes(city);
        
        
        scrollToSection('track');
        
        
        hideLoading();
        
        
        showNotification(`Selected ${city.name}, ${city.state}`, 'success');
    }, 1000);
}


function updateSelectedCityUI(city) {
    const selectedRouteDiv = document.getElementById('selectedRoute');
    if (selectedRouteDiv) {
        selectedRouteDiv.innerHTML = `
            <h3>Selected City: ${city.name}</h3>
            <p>${city.state} - ${city.routes.length} routes available</p>
            <div class="city-stats">
                <span class="stat">
                    <i class="fas fa-users"></i>
                    ${city.population}
                </span>
                <span class="stat">
                    <i class="fas fa-bus"></i>
                    ${city.routes.filter(r => r.type === 'bus').length} Buses
                </span>
                <span class="stat">
                    <i class="fas fa-train"></i>
                    ${city.routes.filter(r => r.type === 'train').length} Trains
                </span>
                <span class="stat">
                    <i class="fas fa-motorcycle"></i>
                    ${city.routes.filter(r => r.type === 'auto').length} Autos
                </span>
            </div>
        `;
    }
}


function loadCityRoutes(city) {
    currentRoutes = city.routes;
    displayRoutes(city.routes);
    updateMap(city.routes);

    // Automatically select and display the path for the first route
    if (city.routes.length > 0) {
        selectRoute(city.routes[0].id, false); // `false` to prevent showing a notification
    }
}


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
                <button onclick="event.stopPropagation(); addToFavorites(${JSON.stringify(route).replace(/"/g, '&quot;')})" 
                        class="favorite-btn" title="Add to Favorites">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
            <div class="route-details">
                <div class="route-name">${route.name}</div>
                <div class="route-info">
                    <span><i class="fas fa-clock"></i> Next: ${route.nextArrival}</span>
                    <span><i class="fas fa-sync"></i> Every: ${route.frequency}</span>
                    <span><i class="fas fa-rupee-sign"></i> ${route.fare}</span>
                </div>
            </div>
        </div>
    `).join('');
}


function selectRoute(routeId, showNotif = true) {
    const route = currentRoutes.find(r => r.id === routeId);
    if (!route) return;
    
    selectedRoute = route;
    updateSelectedRouteUI(route);
    
    // Display only the selected route's path and stops
    if (typeof google !== 'undefined' && google.maps && window.displaySingleRoutePath) {
        window.displaySingleRoutePath(route);
    }

    if (showNotif) {
        startRouteTracking(route);
    }
    
    // Center map on selected route
    

    const routeItems = document.querySelectorAll('.route-item');
    routeItems.forEach(item => item.classList.remove('selected'));
    
    const selectedItem = Array.from(routeItems).find(item => item.getAttribute('onclick').includes(`'${routeId}'`));
    if (selectedItem) {
        selectedItem.classList.add('selected');
    } else if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }
}


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
                <span class="fare">Fare: ${route.fare}</span>
            </div>
            <div class="route-stops">
                <h4>Stops:</h4>
                <ul>
                    ${route.stops.map(stop => `<li>${stop.name || stop}</li>`).join('')}
                </ul>
            </div>
            <div class="route-actions">
                <button onclick="addToFavorites(${JSON.stringify(route).replace(/"/g, '&quot;')})" 
                        class="btn btn-sm btn-primary">
                    <i class="fas fa-heart"></i> Add to Favorites
                </button>
                <button onclick="shareRoute('${route.id}')" class="btn btn-sm btn-secondary">
                    <i class="fas fa-share"></i> Share
                </button>
            </div>
        `;
    }
}


function updateMap(routes) {
    
    window.currentRoutes = routes;
    
    
    if (typeof google !== 'undefined' && google.maps && window.displayRoutesOnMap) {
        window.displayRoutesOnMap(routes);
    } else {
        
        updateFallbackMap(routes);
    }
}


function updateFallbackMap(routes) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    
    const routeVisualization = document.getElementById('routeVisualization');
    if (routeVisualization) {
        if (routes.length === 0) {
            routeVisualization.innerHTML = `
                <div class="no-routes-message">
                    <i class="fas fa-map-marked-alt"></i>
                    <p>No routes found</p>
                </div>
            `;
        } else {
            routeVisualization.innerHTML = `
                <div class="routes-grid">
                    ${routes.map(route => `
                        <div class="route-card-map" onclick="selectRoute('${route.id}')">
                            <div class="route-marker-large" style="background-color: ${route.color}">
                                <span class="route-number">${route.number}</span>
                            </div>
                            <div class="route-info">
                                <h4>${route.name}</h4>
                                <p>${route.from} → ${route.to}</p>
                                <div class="route-status-info">
                                    <span class="status ${route.status}">${route.status}</span>
                                    <span class="next-arrival">${route.nextArrival}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } else {
        
        mapElement.innerHTML = `
            <div class="map-placeholder">
                <i class="fas fa-map"></i>
                <p>Interactive Map showing ${routes.length} route(s)</p>
                <div class="route-markers">
                    ${routes.map(route => `
                        <div class="route-marker" style="background-color: ${route.color}">
                            ${route.number}
                        </div>
                    `).join('')}
                </div>
                <div class="map-legend">
                    <div class="legend-item">
                        <div class="legend-color" style="background: #FF6B35;"></div>
                        <span>Bus Routes</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #118AB2;"></div>
                        <span>Train Routes</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: #06D6A0;"></div>
                        <span>Auto Routes</span>
                    </div>
                </div>
            </div>
        `;
    }
}


function startRouteTracking(route) {
    
    if (trackingInterval) {
        clearInterval(trackingInterval);
    }
    
    
    trackingInterval = setInterval(() => {
        updateRouteLocation(route);
    }, 5000); 
    
    showNotification(`Started tracking Route ${route.number}`, 'info');
}


function updateRouteLocation(route) {
    // If route has no stops, do not simulate movement
    if (!route.stops || route.stops.length < 2) {
        return;
    }

    // Initialize tracking state if it doesn't exist
    if (!route.trackingState) {
        route.trackingState = {
            currentStopIndex: 0,
            progress: 0, // Progress (0 to 1) between current and next stop
        };
    }

    const state = route.trackingState;
    const startStop = route.stops[state.currentStopIndex];
    const endStop = route.stops[state.currentStopIndex + 1];

    // Move to the next segment if progress is complete
    if (state.progress >= 1) {
        state.progress = 0;
        state.currentStopIndex = (state.currentStopIndex + 1) % (route.stops.length - 1);
    }

    // Interpolate position between two stops
    const lat = startStop.location.lat + (endStop.location.lat - startStop.location.lat) * state.progress;
    const lng = startStop.location.lng + (endStop.location.lng - startStop.location.lng) * state.progress;
    route.currentLocation = { lat, lng };
    state.progress += 0.1; // Move 10% of the segment per update
    

    const currentTime = parseInt(route.nextArrival);
    if (currentTime > 1) {
        route.nextArrival = `${currentTime - 1} min`;
    } else {
        route.nextArrival = 'Arriving now';

        showNotification(`Route ${route.number} is arriving now!`, 'success');
    }

    if (typeof google !== 'undefined' && google.maps && window.updateRouteLocation) {
        window.updateRouteLocation(route);
    }
    

    if (selectedRoute && selectedRoute.id === route.id) {
        updateSelectedRouteUI(route);
    }
    

    displayRoutes(currentRoutes);
}


function filterRoutes(type) {
    if (!selectedCity) {
        showNotification('Please select a city first', 'warning');
        return;
    }
    
    const city = CONFIG.cities[selectedCity];
    let filteredRoutes = city.routes;
    
    if (type !== 'all') {
        filteredRoutes = city.routes.filter(route => route.type === type);
    }
    
    displayRoutes(filteredRoutes);
    updateMap(filteredRoutes);
}


function filterCitiesByRegion(region) {
    const cityCards = document.querySelectorAll('.city-card');
    
    cityCards.forEach(card => {
        const cardRegion = card.getAttribute('data-region');
        if (region === 'all' || cardRegion === region) {
            card.style.display = 'block';
            card.classList.add('fade-in');
        } else {
            card.style.display = 'none';
            card.classList.remove('fade-in');
        }
    });
}


function searchRoutes(searchTerm) {
    if (!selectedCity) {
        showNotification('Please select a city first', 'warning');
        return;
    }
    
    const city = CONFIG.cities[selectedCity];
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


function searchRoute() {
    const searchInput = document.getElementById('routeSearch');
    if (searchInput) {
        const searchTerm = searchInput.value.toLowerCase();
        searchRoutes(searchTerm);
    }
}


function loadPopularRoutes() {
    const routesGrid = document.getElementById('routesGrid');
    if (!routesGrid) return;
    

    const popularRoutes = [];
    Object.entries(CONFIG.cities).forEach(([cityKey, city]) => {
        city.routes.slice(0, 2).forEach(route => {
            popularRoutes.push({ ...route, city: city.name, cityKey });
        });
    });
    

    const shuffled = popularRoutes.sort(() => 0.5 - Math.random());
    const displayRoutes = shuffled.slice(0, 6);
    
    routesGrid.innerHTML = displayRoutes.map(route => `
        <div class="route-card" onclick="selectPopularRoute('${route.id}', '${route.cityKey}')">
            <div class="route-card-header">
                <span class="route-card-number">${route.number}</span>
                <span class="route-card-type ${route.type}">${route.type}</span>
            </div>
            <div class="route-card-route">${route.name}</div>
            <div class="route-card-details">
                <span>${route.from} → ${route.to}</span>
                <span>${route.city}</span>
                <span class="fare">${route.fare}</span>
            </div>
        </div>
    `).join('');
}


function selectPopularRoute(routeId, cityKey) {
    selectCity(cityKey);
    setTimeout(() => {
        selectRoute(routeId);
    }, 1000);
}


function shareRoute(routeId) {
    const route = currentRoutes.find(r => r.id === routeId);
    if (!route) return;
    
    const shareText = `Check out Route ${route.number} - ${route.name} on Garudyaan!`;
    const shareUrl = window.location.href;
    
    if (navigator.share) {
        navigator.share({
            title: 'Garudyaan Route',
            text: shareText,
            url: shareUrl
        });
    } else {

        navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
        showNotification('Route link copied to clipboard!', 'success');
    }
}


function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    

    showLoading();
    
    setTimeout(() => {
        hideLoading();
        showNotification('Thank you for your message! We\'ll get back to you soon.', 'success');
        e.target.reset();
    }, 2000);
}


function showLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('active');
    }
}

function hideLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('active');
    }
}


function showNotification(message, type = 'info', duration = 3000) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    

    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}


function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}


function toggleMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');
    
    if (navMenu && hamburger) {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    }
}

// User menu functionality
function toggleUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.toggle('active');
    closeLanguageMenu();
    closeThemeMenu();
}

function closeUserMenu() {
    const menu = document.getElementById('userMenu');
    menu.classList.remove('active');
}

function logout() {
    showNotification('Logged out successfully', 'info');
    closeUserMenu();
    // In a real app, you would clear user session here
}

// Topbar Clock
function initializeClock() {
    const clockEl = document.getElementById('navClock');
    if (!clockEl) return;
    const update = () => {
        const now = new Date();
        // Format as HH:MM:SS
        const hh = String(now.getHours()).padStart(2, '0');
        const mm = String(now.getMinutes()).padStart(2, '0');
        const ss = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${hh}:${mm}:${ss}`;
    };
    update();
    setInterval(update, 1000);
}


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


const enhancedStyles = `
    .favorite-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 15px;
        border-bottom: 1px solid var(--border-light);
        transition: all var(--transition-normal);
    }
    
    .favorite-item:hover {
        background: var(--bg-secondary);
    }
    
    .favorite-info h4 {
        margin: 0 0 5px 0;
        color: var(--primary-color);
    }
    
    .favorite-info p {
        margin: 0 0 5px 0;
        color: var(--text-secondary);
        font-size: 14px;
    }
    
    .favorite-city {
        font-size: 12px;
        color: var(--text-muted);
        background: var(--bg-tertiary);
        padding: 2px 8px;
        border-radius: 12px;
    }
    
    .favorite-actions {
        display: flex;
        gap: 8px;
    }
    
    .btn-sm {
        padding: 6px 12px;
        font-size: 12px;
    }
    
    .btn-danger {
        background: var(--danger-color);
        color: white;
    }
    
    .btn-danger:hover {
        background: #d63384;
    }
    
    .favorite-btn {
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: 4px;
        border-radius: 4px;
        transition: all var(--transition-fast);
    }
    
    .favorite-btn:hover {
        color: var(--danger-color);
        background: var(--bg-secondary);
    }
    
    .route-actions {
        display: flex;
        gap: 10px;
        margin-top: 15px;
    }
    
    .map-legend {
        display: flex;
        gap: 15px;
        margin-top: 20px;
        justify-content: center;
        flex-wrap: wrap;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        gap: 5px;
        font-size: 12px;
        color: var(--text-secondary);
    }
    
    .legend-color {
        width: 12px;
        height: 12px;
        border-radius: 2px;
    }
    
    .no-favorites {
        text-align: center;
        color: var(--text-muted);
        font-style: italic;
        padding: 40px;
    }
    
    .route-info {
        display: flex;
        gap: 15px;
        margin-top: 8px;
        font-size: 12px;
        color: var(--text-secondary);
        flex-wrap: wrap;
    }
    
    .route-info span {
        display: flex;
        align-items: center;
        gap: 4px;
    }
    
    .fare {
        color: var(--success-color);
        font-weight: 600;
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        box-shadow: 0 8px 25px var(--shadow-medium);
        padding: 20px;
        border-radius: 0 0 15px 15px;
    }
    
    .hamburger.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }
    
    .hamburger.active span:nth-child(2) {
        opacity: 0;
    }
    
    .hamburger.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
    
    @media (max-width: 768px) {
        .nav-controls {
            display: none;
        }
        
        .nav-menu {
            display: none;
        }
        
        .hamburger {
            display: flex;
        }
    }
`;


const enhancedStyleSheet = document.createElement('style');
enhancedStyleSheet.textContent = enhancedStyles;
document.head.appendChild(enhancedStyleSheet);
