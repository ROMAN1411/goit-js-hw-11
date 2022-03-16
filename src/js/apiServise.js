import axios from "axios";

const BASE_URL = `https://pixabay.com/api`;
const API_KEY = `15176253-cbebc64527e02f90676f49797`;

export default class ImagesApiService {
    constructor() {
        this.query = '';
        this.page = 1;
    }

    async fetchImg(page) {
        const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`);
        return await response.data;
    } catch(error) {
        return error;
    }
    incrementPage() {
        this.page += 1;
    }

    resetPage() {
        this.page = 1;
    }
    get searchQuery() {
        return this.query;
    }

    set searchQuery(newQuery) {
        this.query = newQuery;
    }
}







