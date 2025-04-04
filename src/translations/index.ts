interface Translations {
  [key: string]: string | { [key: string]: string | Translations };
}

interface TranslationsData {
  en: Translations;
  id: Translations;
}

const translations: TranslationsData = {
  en: {
    ui: {
      search: 'Search city...',
      searchButton: 'Search',
      forecast: '5-Day Forecast',
      high: 'High',
      low: 'Low',
      feelsLike: 'Feels like',
      humidity: 'Humidity',
      wind: 'Wind',
      precipitation: 'Precipitation',
      loading: 'Loading...',
      error: 'Error loading weather data',
      noData: 'No weather data available'
    },
    weather: {
      Clear: 'Clear',
      Clouds: 'Cloudy',
      Rain: 'Rain',
      Drizzle: 'Drizzle',
      Thunderstorm: 'Thunderstorm',
      Snow: 'Snow',
      Mist: 'Mist',
      Smoke: 'Smoke',
      Haze: 'Haze',
      Dust: 'Dust',
      Fog: 'Fog',
      Sand: 'Sand',
      Ash: 'Ash',
      Squall: 'Squall',
      Tornado: 'Tornado'
    }
  },
  id: {
    ui: {
      search: 'Cari kota...',
      searchButton: 'Cari',
      forecast: 'Prakiraan 5 Hari',
      high: 'Tertinggi',
      low: 'Terendah',
      feelsLike: 'Terasa seperti',
      humidity: 'Kelembaban',
      wind: 'Angin',
      precipitation: 'Curah hujan',
      loading: 'Memuat...',
      error: 'Error memuat data cuaca',
      noData: 'Data cuaca tidak tersedia'
    },
    weather: {
      Clear: 'Cerah',
      Clouds: 'Berawan',
      Rain: 'Hujan',
      Drizzle: 'Gerimis',
      Thunderstorm: 'Badai Petir',
      Snow: 'Salju',
      Mist: 'Kabut Tipis',
      Smoke: 'Asap',
      Haze: 'Kabut',
      Dust: 'Debu',
      Fog: 'Kabut Tebal',
      Sand: 'Pasir',
      Ash: 'Abu Vulkanik',
      Squall: 'Badai',
      Tornado: 'Tornado'
    }
  }
};

export type TranslationKey = keyof typeof translations.en;
export default translations; 