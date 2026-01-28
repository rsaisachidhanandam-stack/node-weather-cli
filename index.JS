const axios = require("axios");

const city = process.argv[2]?.trim();

if (!city) {
  console.log("Please provide a city name, e.g. node index.js London");
  process.exit(1);
}

async function getWeather(city) {
  try {
    // 1) Geocoding: get latitude & longitude for the city
    const geoResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city,
          count: 1,
          language: "en",
          format: "json",
        },
      }
    );

    const results = geoResponse.data.results;

    if (!results || results.length === 0) {
      console.log("Could not find that city. Please try another name.");
      return;
    }

    const { latitude, longitude, name } = results[0];

    // 2) Weather: get current weather for those coordinates
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: latitude,
          longitude: longitude,
          current_weather: true,
        },
      }
    );

    const current = weatherResponse.data.current_weather;
    const temperature = current.temperature;
    const description = `Weather code: ${current.weathercode}`;

    console.log(
      `Weather in ${name} (lat: ${latitude}, lon: ${longitude}): ${temperature}°C, ${description}`
    );
  } catch (error) {
    console.error(
      "Could not fetch weather. Please check the city name or your internet connection."
    );
    console.error("Details:", error.message);
  }
}

getWeather(city);
