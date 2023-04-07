export class PhotoService {
    constructor () {
        this.contextPath = import.meta.env.BASE_URL;
    }

    getImages () {
        return fetch(this.contextPath + 'demo/data/photos.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }
}
