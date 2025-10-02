# Google Maps Integration Setup

## Getting Your Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project or Select Existing**
   - Click on the project dropdown at the top
   - Create a new project or select an existing one

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Search for and enable:
     - Maps JavaScript API
     - Places API (optional, for enhanced features)
     - Geocoding API (optional, for address lookup)

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

5. **Secure Your API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost/*`, `yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key"
   - Choose the APIs you enabled

## Update the Website

1. **Replace API Key in index.html**
   ```html
   <script async defer src="https://maps.googleapis.com/maps/api/js?key=YOUR_ACTUAL_API_KEY&callback=initMap"></script>
   ```

2. **Test the Integration**
   - Open index.html in your browser
   - Select a city and route
   - You should see Google Maps with route markers

## Features Included

- **Interactive Map**: Full Google Maps integration
- **Route Markers**: Custom markers for each transport route
- **Info Windows**: Click markers to see route details
- **Route Paths**: Visual representation of route paths
- **Real-time Updates**: Markers update with simulated location changes
- **Map Controls**: Custom legend and refresh button
- **Responsive Design**: Works on all device sizes

## Fallback Behavior

If Google Maps API key is not provided or fails to load:
- The website will show a placeholder map
- All other functionality remains intact
- Users can still track routes and use all features

## Cost Considerations

- Google Maps JavaScript API has a free tier
- First 28,000 map loads per month are free
- After that, it's $7 per 1,000 additional loads
- For development and small projects, the free tier is usually sufficient

## Alternative Options

If you prefer not to use Google Maps:
1. **OpenStreetMap**: Free alternative with Leaflet.js
2. **Mapbox**: Another mapping service with free tier
3. **Custom Map**: Create your own simple map visualization

The current implementation gracefully handles both scenarios.
