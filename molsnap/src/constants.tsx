const { VITE_MOLSNAP_API_URL, VITE_DECIMER_API_URL } = import.meta.env;

// const MOLSNAP_API_URL = 'http://localhost:8000';
// const DECIMER_API_URL = 'http://localhost:8001';

const API_ENDPOINTS = {
  DECIMER_API_URL: VITE_DECIMER_API_URL,
  MOLSNAP_API_URL: VITE_MOLSNAP_API_URL,
  CHEMICAL_IMAGE_UPLOAD_PARSE: `${VITE_DECIMER_API_URL}/upload-and-get-chemical-images`,
  PREDICTION_ONLY: `${VITE_MOLSNAP_API_URL}/prediction-only`,
  PREDICTION: `${VITE_MOLSNAP_API_URL}/prediction`,
};

const PAGES = {
  HOME: '/',
}

export { API_ENDPOINTS, PAGES };
