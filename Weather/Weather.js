// Weather Functionality
// --- City Autocomplete ---
const locationInput = document.getElementById('locationInput');
const suggestionsBox = document.getElementById('suggestions');

let debounceTimeout;
locationInput.addEventListener('input', function () {
  clearTimeout(debounceTimeout);
  const query = this.value.trim();
  if (query.length < 2) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
    return;
  }
  debounceTimeout = setTimeout(() => fetchCitySuggestions(query), 300);
});

function fetchCitySuggestions(query) {
  const apiKey = '13ca0c89d8cd04873921fbc32a542965';
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${apiKey}`;
  fetch(url)
    .then(res => res.json())
    .then(data => showSuggestions(data))
    .catch(() => {
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';
    });
}

function showSuggestions(cities) {
  if (!cities.length) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
    return;
  }
  suggestionsBox.innerHTML = cities.map(city =>
    `<button type="button" class="list-group-item list-group-item-action">${city.name}${city.state ? ', ' + city.state : ''}, ${city.country}</button>`
  ).join('');
  suggestionsBox.style.display = 'block';
  Array.from(suggestionsBox.children).forEach((btn, idx) => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault(); // Prevent input blur before click
      locationInput.value = cities[idx].name + (cities[idx].state ? ', ' + cities[idx].state : '') + ', ' + cities[idx].country;
      suggestionsBox.innerHTML = '';
      suggestionsBox.style.display = 'none';
    });
  });
}

// Hide suggestions on outside click or input blur
document.addEventListener('click', (e) => {
  if (!suggestionsBox.contains(e.target) && e.target !== locationInput) {
    suggestionsBox.innerHTML = '';
    suggestionsBox.style.display = 'none';
  }
});
document.getElementById('searchButton').addEventListener('click', getWeather);

function getWeather() {
  let location = document.getElementById('locationInput').value;
  let apiKey = '13ca0c89d8cd04873921fbc32a542965';
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.cod === 200) {
        displayWeather(data);
      } else {
        document.getElementById('weatherDetails').textContent = 'City not found. Please try again.';
      }
    })
    .catch(error => {
      console.error('Error fetching the weather data:', error);
      document.getElementById('weatherDetails').textContent = 'Error fetching the weather data. Please try again.';
    });
}

function displayWeather(data) {
  const weatherDetails = `
    <p><strong>City:</strong> ${data.name}</p>
    <p><strong>Temperature:</strong> ${data.main.temp}°C</p>
    <p><strong>Weather:</strong> ${data.weather[0].description}</p>
    <p><strong>Humidity:</strong> ${data.main.humidity}%</p>
    <p><strong>Wind Speed:</strong> ${data.wind.speed} m/s</p>
  `;
  document.getElementById('weatherDetails').innerHTML = weatherDetails;
}

