<template>
  <div class="col-md-8 offset-md-2">
    <h2>Weather App</h2>
    <div class="search-bar">
      <input
        type="text"
        v-model="city"
        placeholder="Enter city name"
        class="search-input"
      />
      <button @click="searchByCity" class="search-button">Search</button>
    </div>

    <!-- The <main> tag in HTML is used to specify the main content of a document -->
    <main>
      <!-- If there are no data returned, then skip rendering the information -->
      <div v-if="weatherData">
        <br>
        <!-- Display the weather data attribute returned from API -->
        <h3>{{ weatherData.name }}, {{ weatherData.sys.country }}</h3>
        <div>
          <!-- The image source of the weather icon comes from the computed property `iconUrl` -->
          <img :src="iconUrl" alt="Weather Icon" />
          <p>{{ temperature }} °C</p>
        </div>
        <span>{{ weatherData.weather[0].description }}</span>
      </div>
  
      <!-- If there is an error fetching data, display it -->
      <div v-if="error">{{ error }}</div>
    </main>
  </div>
</template>
  
<script>
import axios from "axios";

const apikey = "1b86a4dae6d5f5e484af41a09e53839c";

export default {
  name: "App",
  data() {
    return {
      city: "",
      weatherData: null,
      hourlyForecast: [],
      dailyForecast: [],
      error: null,
    };
  },
  computed: {
    // Convert temperature from Kelvin to Celsius
    temperature() {
      return this.weatherData
      ? Math.floor(this.weatherData.main.temp - 273.15)
      : null;
    },
    // Get the current weather icon using the API
    iconUrl() {
      return this.weatherData
      ? `http://openweathermap.org/img/w/${this.weatherData.weather[0].icon}.png`
      : null;
    },
  },
  mounted() {
    this.fetchCurrentLocationWeather();
  },
  methods: {
    async fetchCurrentLocationWeather() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { latitude, longitude } = position.coords;
          const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apikey}`;
          await this.fetchWeatherData(url);
        });
      } else {
        this.error = "Geolocation is not supported by this browser.";
      }
    },
    async fetchWeatherData(url) {
      try {
        const response = await axios.get(url);
        this.weatherData = response.data;
        this.error = null;
      } catch (error) {
        console.error("Error fetching weather data:", error);
        this.error = "Failed to fetch weather data. Please try again.";
      }
    },
    async searchByCity() {
      if (this.city.trim() === "") {
        this.error = "Please enter a city name.";
        return;
      }
      const url = `http://api.openweathermap.org/data/2.5/weather?q=${this.city}&appid=${apikey}`;
      await this.fetchWeatherData(url);
    },
  },
};
</script>