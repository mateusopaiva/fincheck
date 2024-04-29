import axios from 'axios';

// const { data } = await axios.get('http://localhost:3000/auth/signin');

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
