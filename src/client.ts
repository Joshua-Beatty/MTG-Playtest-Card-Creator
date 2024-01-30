import axios from "axios";
import rateLimit from 'axios-rate-limit';

const client = rateLimit(axios.create({
    baseURL: 'https://api.scryfall.com',
    timeout: 3000,
  }), { maxRequests: 1, perMilliseconds: 100})

export default client;