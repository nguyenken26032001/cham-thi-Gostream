export class CountryService {
    constructor () {
        this.contextPath = import.meta.env.BASE_URL;
    }

    getCountries () {
        return fetch(this.contextPath + 'demo/data/countries.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }
}
