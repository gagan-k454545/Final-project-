export const indianWeatherData = {
  mangaluru: {
    location: {
      name: "Mangaluru, Karnataka",
      lat: 12.9141,
      lon: 74.856,
    },
    temperature: "27°C",
    feelsLike: "29°C",
    condition: "Partly Cloudy",
    precipitation: "5mm",
    humidity: "78%",
    wind: "11km/h W",
    pressure: "1010 hPa",
    forecast: [
      { day: "Today", temp: "27°C", condition: "Partly Cloudy", precipitation: "10%", humidity: "78%" },
      { day: "Tomorrow", temp: "26°C", condition: "Light Rain", precipitation: "30%", humidity: "80%" },
      { day: "Saturday", temp: "26°C", condition: "Isolated Showers", precipitation: "40%", humidity: "82%" },
      { day: "Sunday", temp: "25°C", condition: "Cloudy", precipitation: "35%", humidity: "79%" },
      { day: "Monday", temp: "26°C", condition: "Partly Cloudy", precipitation: "15%", humidity: "75%" },
    ],
    alerts: [
      {
        title: "Rain Advisory",
        description:
          "Light to moderate showers expected between December 6–8 due to coastal moisture buildup.",
        severity: "Moderate",
        issuedTime: new Date(),
      }
    ],
  },

  bangalore: {
    location: {
      name: "Bangalore, Karnataka",
      lat: 12.9716,
      lon: 77.5946,
    },
    temperature: "22°C",
    feelsLike: "23°C",
    condition: "Cool & Cloudy",
    precipitation: "2mm",
    humidity: "68%",
    wind: "9km/h NE",
    pressure: "1014 hPa",
    forecast: [
      { day: "Today", temp: "22°C", condition: "Cloudy", precipitation: "20%", humidity: "68%" },
      { day: "Tomorrow", temp: "23°C", condition: "Partly Cloudy", precipitation: "10%", humidity: "65%" },
      { day: "Saturday", temp: "24°C", condition: "Sunny", precipitation: "5%", humidity: "60%" },
      { day: "Sunday", temp: "23°C", condition: "Cloudy", precipitation: "15%", humidity: "64%" },
      { day: "Monday", temp: "22°C", condition: "Light Rain", precipitation: "25%", humidity: "70%" },
    ],
    alerts: [],
  },

  mumbai: {
    location: {
      name: "Mumbai, Maharashtra",
      lat: 19.076,
      lon: 72.8777,
    },
    temperature: "30°C",
    feelsLike: "33°C",
    condition: "Humid & Partly Cloudy",
    precipitation: "3mm",
    humidity: "72%",
    wind: "14km/h NW",
    pressure: "1011 hPa",
    forecast: [
      { day: "Today", temp: "30°C", condition: "Partly Cloudy", precipitation: "20%", humidity: "72%" },
      { day: "Tomorrow", temp: "29°C", condition: "Cloudy", precipitation: "25%", humidity: "74%" },
      { day: "Saturday", temp: "29°C", condition: "Sunny", precipitation: "10%", humidity: "70%" },
      { day: "Sunday", temp: "28°C", condition: "Light Showers", precipitation: "30%", humidity: "73%" },
      { day: "Monday", temp: "30°C", condition: "Partly Cloudy", precipitation: "15%", humidity: "69%" },
    ],
    alerts: [
      {
        title: "High Humidity Advisory",
        description: "Increased humidity expected along the coast; heat discomfort possible in the afternoon.",
        severity: "Low",
        issuedTime: new Date(),
      }
    ],
  },
};
