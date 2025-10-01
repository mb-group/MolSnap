const MOLSNAP_API_URL = 'http://localhost:8000';
const DECIMER_API_URL = 'http://localhost:8001';

const API_ENDPOINTS = {
  DECIMER_API_URL: DECIMER_API_URL,
  MOLSNAP_API_URL: MOLSNAP_API_URL,
  CHEMICAL_IMAGE_UPLOAD_PARSE: `${DECIMER_API_URL}/upload-and-get-chemical-images`,
  PREDICTION_ONLY: `${MOLSNAP_API_URL}/prediction-only`
};

const PAGES = {
  HOME: '/',
}

export { MOLSNAP_API_URL, API_ENDPOINTS, PAGES };
