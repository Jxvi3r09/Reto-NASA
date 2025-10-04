// ===== CONFIGURACIÓN =====
const API_KEY = "1b5905ec0a5b335bafb472947ee7bab2"; // <-- Tu API key de OpenWeatherMap

// ===== MAPA BASE =====
var map = L.map('map').setView([-15.600, -60.000], 4);

var satelite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles © Esri',
  maxZoom: 19
}).addTo(map);

var labels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Labels © Esri',
  maxZoom: 19
}).addTo(map);

var coordsBox = document.getElementById("coords");
var marker = null;

// ===== CAPAS DE CAMBIO CLIMÁTICO =====
var capaIncendios = L.tileLayer.wms("https://firms.modaps.eosdis.nasa.gov/wms/", {
  layers: "fires_viirs_24",
  format: 'image/png',
  transparent: true,
  attribution: "🔥 NASA FIRMS"
});

var capaDeforestacion = L.tileLayer.wms("https://gfw2.wri.org/arcgis/services/forest_change/MapServer/WMSServer", {
  layers: "tree_cover_loss",
  format: "image/png",
  transparent: true,
  attribution: "🌲 Global Forest Watch"
});

var capaCO2 = L.tileLayer.wms("https://services.sentinel-hub.com/ogc/wms/1b59d8-WMS?showLogo=false", {
  layers: "CO_total_column",
  format: "image/png",
  transparent: true,
  attribution: "💨 Copernicus CAMS"
});

var capas = {
  "🛰️ Satélite": satelite,
  "🔥 Incendios (NASA)": capaIncendios,
  "🌳 Deforestación": capaDeforestacion,
  "💨 CO₂ y Contaminación (CAMS)": capaCO2
};
L.control.layers(null, capas).addTo(map);

// ===== EVENTO DE CLIC =====
map.on('click', async function(e) {
  var lat = e.latlng.lat.toFixed(5);
  var lng = e.latlng.lng.toFixed(5);

  coordsBox.innerHTML = `📍 Lat: ${lat}, Lng: ${lng} <br> Buscando clima... ⛅`;

  if (marker) map.removeLayer(marker);

  try {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&lang=es&appid=${API_KEY}`);
    const data = await res.json();

    if (data.cod === 200) {
      const temp = data.main.temp;
      const desc = data.weather[0].description;
      const city = data.name || "Ubicación sin nombre";

      // Calidad del aire
      const airRes = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lng}&appid=${API_KEY}`);
      const airData = await airRes.json();
      const co = airData.list[0].components.co;
      const pm25 = airData.list[0].components.pm2_5;
      const pm10 = airData.list[0].components.pm10;

      marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`
          <b>${city}</b><br>
          🌡️ <b>Temperatura:</b> ${temp}°C<br>
          ☁️ <b>Estado:</b> ${desc}<br>
          💨 <b>CO:</b> ${co} µg/m³<br>
          🌫️ <b>PM2.5:</b> ${pm25}<br>
          🌫️ <b>PM10:</b> ${pm10}<br>
          📍 Lat: ${lat}, Lng: ${lng}
        `)
        .openPopup();

      coordsBox.innerHTML = `
        📍 <b>${city}</b><br>
        🌡️ ${temp}°C - ${desc}<br>
        💨 CO: ${co} | PM2.5: ${pm25} | PM10: ${pm10}<br>
        Lat: ${lat}, Lng: ${lng}
      `;
    } else {
      coordsBox.innerHTML = "❌ No se pudo obtener el clima.";
    }
  } catch (err) {
    coordsBox.innerHTML = "⚠️ Error al conectar con la API del clima.";
  }
});

// ===== LEYENDA =====
var legend = L.control({ position: 'bottomright' });
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'info legend');
  div.innerHTML = `
    <h4>🌍 Cambio Climático</h4>
    <p>🔥 Incendios - NASA FIRMS</p>
    <p>🌳 Deforestación - Global Forest Watch</p>
    <p>💨 CO₂ - Copernicus CAMS</p>
    <p>☁️ Clima - OpenWeatherMap</p>
  `;
  return div;
};
legend.addTo(map);

// ===== LÍNEA DEL TIEMPO (2000–2025) =====
const yearRange = document.getElementById("yearRange");
const yearLabel = document.getElementById("yearLabel");

yearRange.addEventListener("input", () => {
  const year = parseInt(yearRange.value);
  yearLabel.textContent = year;

  // Simulación de temperatura global media (sube ~0.02°C/año desde 2000)
  const baseTemp = 14.5; // temperatura global promedio año 2000
  const tempGlobal = (baseTemp + (year - 2000) * 0.02).toFixed(2);

  coordsBox.innerHTML = `
    🌍 Año: <b>${year}</b><br>
    🌡️ Temperatura global promedio: ${tempGlobal}°C<br>
    🔺 Aumento desde 2000: +${(tempGlobal - baseTemp).toFixed(2)}°C
  `;

  // Cambio visual en el mapa (coloración leve del fondo según calor)
  const heat = Math.min((year - 2000) / 25, 1);
  map.getContainer().style.filter = `brightness(${1.1 - heat * 0.3}) saturate(${1 + heat * 0.5})`;
});





// metodo de busqueda

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

// Variable para guardar el último marcador
var marker = null;

// Caja para coordenadas
var coordsBox = document.getElementById("coords");

// Escuchar clics en el mapa para colocar un marcador
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

// Plugin de búsqueda (Buscar lugar por nombre)
var searchControl = new L.Control.Search({
    layer: labels,  // La capa que contiene los nombres de las ciudades
    initial: false, // Para que no esté activada al principio
    zoom: 10,       // Nivel de zoom al hacer la búsqueda
    marker: false   // No mostrar marcador por defecto
});

// Añadir el control de búsqueda al div con id 'search'
searchControl.addTo(document.getElementById('search'));

// Función para validar las coordenadas ingresadas (solo números y puntos)
function validateCoordinatesInput(event) {
    const input = event.target;
    let value = input.value;

    // Validar que solo se ingresen números o puntos decimales
    value = value.replace(/[^0-9.-]/g, '');
    input.value = value;
}

// Función para validar la entrada de solo letras para nombre
function validateTextInput(event) {
    const input = event.target;
    const value = input.value;

    // Elimina cualquier carácter que no sea letra
    input.value = value.replace(/[^a-zA-Z ]/g, '');  // Solo letras y espacio
}

// Función para buscar por coordenadas
function searchByCoordinates() {
    const lat = parseFloat(document.getElementById('latInput').value);
    const lng = parseFloat(document.getElementById('lngInput').value);

    if (isNaN(lat) || isNaN(lng)) {
        alert("Por favor ingrese coordenadas válidas.");
        return;
    }

    // Mover el mapa a las coordenadas
    map.setView([lat, lng], 10);

    // Si ya existe un marcador, eliminarlo
    if (marker) {
        map.removeLayer(marker);
    }

    // Colocar un marcador en las coordenadas
    marker = L.marker([lat, lng]).addTo(map)
        .bindPopup(`Coordenadas:<br>Lat: ${lat}<br>Lng: ${lng}`)
        .openPopup();
}

// Función para buscar por nombre (usando Nominatim API)
function searchByName() {
    const name = document.getElementById('textInput').value;
    if (name.trim() === "") {
        alert("Por favor ingrese un nombre de lugar.");
        return;
    }

    // Llamar a la API de Nominatim para geocodificación
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${name}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Lugar no encontrado.");
                return;
            }

            // Obtener las coordenadas del primer resultado
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);

            // Mover el mapa a las coordenadas
            map.setView([lat, lng], 10);

            // Si ya existe un marcador, eliminarlo
            if (marker) {
                map.removeLayer(marker);
            }

            // Colocar un marcador en las coordenadas
            marker = L.marker([lat, lng]).addTo(map)
                .bindPopup(`Lugar: ${data[0].display_name}<br>Lat: ${lat}<br>Lng: ${lng}`)
                .openPopup();
        })
        .catch(error => {
            console.error('Error fetching geocoding data:', error);
            alert("Hubo un error al buscar el lugar.");
        });
}