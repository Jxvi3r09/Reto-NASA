
// Crear mapa centrado en Sudamérica
var map = L.map('map').setView([-15.600, -60.000], 4);

// Capa base: Esri World Imagery (satelital)
var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri',
    maxZoom: 19
}).addTo(map);

// Capa de etiquetas (nombres de ciudades, carreteras, etc.)
var labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Labels © Esri',
    maxZoom: 19,
    pane: 'overlayPane'
}).addTo(map);

// Caja para coordenadas
var coordsBox = document.getElementById("coords");

// Variable para guardar el último marcador
var marker = null;

// Escuchar clics en el mapa
map.on('click', function(e) {
    var lat = e.latlng.lat.toFixed(5);
    var lng = e.latlng.lng.toFixed(5);

    coordsBox.innerHTML = `Lat: ${lat}, Lng: ${lng}`;

    if (marker) {
    map.removeLayer(marker);
    }

    marker = L.marker([lat, lng]).addTo(map)
    .bindPopup(`Coordenadas:<br>Lat: ${lat}<br>Lng: ${lng}`)
    .openPopup();
});


