// ==== GLOBO 3D ====
const globe = Globe()(document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
  .showAtmosphere(true)
  .atmosphereColor('#1e88e5')
  .atmosphereAltitude(0.25);

const controls = globe.controls();
controls.autoRotate = true;
controls.autoRotateSpeed = 0.6;
controls.enableZoom = true;
controls.enablePan = false;

// ==== CONTINENTES Y CAPITALES ====
const continentes = [
  { lat: 10, lng: -55, nombre: "America del Sur" },
  { lat: 40, lng: -100, nombre: "America del Norte" },
  { lat: 50, lng: 15, nombre: "Europa" },
  { lat: 20, lng: 20, nombre: "Africa" },
  { lat: 35, lng: 100, nombre: "Asia" },
  { lat: -25, lng: 135, nombre: "Oceania" },
  { lat: -80, lng: 0, nombre: "Antartida" }
];

const capitales = [
  { lat: 4.7110, lng: -74.0721, nombre: "Bogota" },
  { lat: -0.1807, lng: -78.4678, nombre: "Quito" },
  { lat: -12.0464, lng: -77.0428, nombre: "Lima" },
  { lat: -33.4489, lng: -70.6693, nombre: "Santiago" },
  { lat: -34.6037, lng: -58.3816, nombre: "Buenos Aires" },
  { lat: -25.2637, lng: -57.5759, nombre: "Asuncion" },
  { lat: -15.8267, lng: -47.9218, nombre: "Brasilia" },
  { lat: -16.5000, lng: -68.1193, nombre: "La Paz" },
  { lat: -8.7832, lng: -55.4915, nombre: "Manaos" }
];

// Mostrar etiquetas en globo
globe.labelsData([...continentes, ...capitales])
  .labelLat(d => d.lat)
  .labelLng(d => d.lng)
  .labelText(d => d.nombre)
  .labelColor(d => capitales.includes(d) ? '#ffeb3b' : '#ffffff')
  .labelSize(d => capitales.includes(d) ? 1.2 : 1.5)
  .labelResolution(2)
  .labelAltitude(0.02);

// ==== LEAFLET ====
const mapDiv = document.getElementById('map');
const map = L.map(mapDiv).setView([-15.7835, -47.8661], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

mapDiv.style.display = 'none';
let currentMarker = null;
let mapVisible = false;

// Mostrar mapa si acercas el globo
setInterval(() => {
  const distance = controls.object.position.length();
  if(distance < 200 && !mapVisible){
    document.getElementById('globeViz').style.display = 'none';
    mapDiv.style.display = 'block';
    mapVisible = true;
  } else if(distance >= 200 && mapVisible){
    document.getElementById('globeViz').style.display = 'flex';
    mapDiv.style.display = 'none';
    mapVisible = false;
  }
}, 200);

// ==== DATOS DE ZONAS AFECTADAS (2020-2025, Sudamérica) ====
const lluviaData = [
  {lat:-3.1, lng:-60.0, severity:0.9},
  {lat:-10.5, lng:-48.3, severity:0.7},
  {lat:-1.5, lng:-48.5, severity:0.6},
  {lat:-15.8, lng:-47.9, severity:0.8}
];

const inundacionData = [
  {lat:-34.6, lng:-58.3, severity:0.9},
  {lat:-12.0, lng:-77.0, severity:0.8},
  {lat:-33.4, lng:-70.6, severity:0.7},
  {lat:-0.2, lng:-78.5, severity:0.6}
];

// Puntos activos
let lluviaPoints = [];
let inundacionPoints = [];

// ==== FUNCION PARA RENDERIZAR PUNTOS ====
function renderPoints(){
  // Puntos en globo
  globe.pointsData(lluviaPoints.concat(inundacionPoints))
    .pointLat(d=>d.lat)
    .pointLng(d=>d.lng)
    .pointColor(d=>d.color)
    .pointAltitude(0.02)
    .pointRadius(d=>d.size);

  // Limpiar Leaflet y agregar
  map.eachLayer(layer => {
    if(layer instanceof L.CircleMarker) map.removeLayer(layer);
  });

  lluviaPoints.forEach(p=>{
    L.circleMarker([p.lat,p.lng], {radius:8, color:'blue', fillOpacity:0.6}).addTo(map);
  });

  inundacionPoints.forEach(p=>{
    L.circleMarker([p.lat,p.lng], {radius:8, color:'purple', fillOpacity:0.6}).addTo(map);
  });
}

// ==== BOTONES ====
document.querySelector('.alert-button.map-alert:nth-child(1)').onclick = () => {
  lluviaPoints = lluviaData.map(p => ({lat:p.lat, lng:p.lng, color:'red', size:0.7*p.severity}));
  renderPoints();
};

document.querySelector('.alert-button.map-alert:nth-child(2)').onclick = () => {
  inundacionPoints = inundacionData.map(p => ({lat:p.lat, lng:p.lng, color:'purple', size:0.7*p.severity}));
  renderPoints();
};

// ==== CLICK EN MAPA ====
map.on('click', function(e){
  const {lat,lng} = e.latlng;
  document.getElementById('coords').innerText = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
  if(currentMarker) map.removeLayer(currentMarker);
  currentMarker = L.marker([lat,lng]).addTo(map);
});

// ==== BÚSQUEDA POR COORDENADAS ====
document.getElementById('searchCoordsBtn').onclick = () => {
  const lat = parseFloat(document.getElementById('latInput').value);
  const lng = parseFloat(document.getElementById('lngInput').value);
  if(!isNaN(lat) && !isNaN(lng)){
    map.setView([lat,lng], 10);
    if(currentMarker) map.removeLayer(currentMarker);
    currentMarker = L.marker([lat,lng]).addTo(map);
  }
};

// ==== BÚSQUEDA POR NOMBRE ====
document.getElementById('searchNameBtn').onclick = () => {
  const name = document.getElementById('textInput').value.trim();
  if(name==="") return alert("Ingrese un nombre");
  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`)
    .then(res=>res.json())
    .then(data=>{
      if(data && data[0]){
        const lat = parseFloat(data[0].lat);
        const lon = parseFloat(data[0].lon);
        map.setView([lat,lon],10);
        if(currentMarker) map.removeLayer(currentMarker);
        currentMarker = L.marker([lat,lon]).addTo(map);
      } else alert("Lugar no encontrado");
    });
};
