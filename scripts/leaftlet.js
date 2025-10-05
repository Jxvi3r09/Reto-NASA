// ==== CLICK PARA COLOCAR CHECKPOINT ====
map.on('click', function(e) {
  const { lat, lng } = e.latlng;

  // Actualizar coordenadas en el panel
  document.getElementById('coords').innerText = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;

  // Borrar marcador anterior si existe
  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  // Crear nuevo marcador en la ubicación clickeada
  currentMarker = L.marker([lat, lng]).addTo(map);
});





//botones
// Seleccionamos los botones
const alertButtons = document.querySelectorAll('.alert-button');

// Umbral: cuando la ventana haga scroll más de 200px (ajustable)
const showThreshold = document.getElementById('globe-section').offsetTop - 100;

// Detectamos scroll
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  alertButtons.forEach(btn => {
    if(scrollY >= showThreshold) {
      btn.classList.add('show');   // aparece
    } else {
      btn.classList.remove('show'); // desaparece
    }
  });
});
