    const cityInput = document.getElementById("cityInput");
    const searchBtn = document.getElementById("searchBtn");
    const resultsDiv = document.getElementById("results");
    const loadingDiv = document.getElementById("loading");
    const errorDiv = document.getElementById("error");

    let lastSearch = "";

    searchBtn.addEventListener("click", () => {
      const city = cityInput.value.trim();

      if (!city) {
        showError("Please enter a city name.");
        return;
      }

      lastSearch = city;
      fetchWeather(city);
    });

    async function fetchWeather(city) {
      clearUI();
      loadingDiv.textContent = "Loading weather data...";

      try {
        const geoUrl =
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
          throw new Error("Failed to fetch location data.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
          throw new Error("City not found.");
        }

        const location = geoData.results[0];
        const latitude = location.latitude;
        const longitude = location.longitude;


        const weatherUrl =
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
          throw new Error("Failed to fetch weather data.");
        }

        const weatherData = await weatherResponse.json();

        displayWeather(location, weatherData.current_weather);

      } catch (error) {
        showError(error.message);
      } finally {
        loadingDiv.textContent = "";
      }
    }

    function displayWeather(location, weather) {
      resultsDiv.innerHTML = `
        <div class="weather-card">
          <h2>${location.name}, ${location.country}</h2>
          <p><strong>Temperature:</strong> ${weather.temperature}°C</p>
          <p><strong>Wind Speed:</strong> ${weather.windspeed} km/h</p>
          <p><strong>Weather Code:</strong> ${weather.weathercode}</p>
          <p><strong>Time:</strong> ${weather.time}</p>
        </div>
      `;
    }

    function showError(message) {
      errorDiv.innerHTML = `
        <div>${message}</div>
        <button class="retry-btn" onclick="retrySearch()">Retry</button>
      `;
    }

    function retrySearch() {
      if (lastSearch) {
        fetchWeather(lastSearch);
      }
    }

    function clearUI() {
      resultsDiv.innerHTML = "";
      errorDiv.innerHTML = "";
    }

    cityInput.addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        searchBtn.click();
      }
    });