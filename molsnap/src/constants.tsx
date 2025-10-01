const API_BASE_URL = 'http://localhost:3001/api';
const DECIMER_API_URL = 'http://localhost:8001';

const API_ENDPOINTS = {
  DECIMER_API_URL: DECIMER_API_URL,
  CHEMICAL_IMAGE_UPLOAD_PARSE: `${DECIMER_API_URL}/upload-and-get-chemical-images`
};

const PAGES = {
  HOME: '/',
}

export { API_BASE_URL, API_ENDPOINTS, PAGES };
