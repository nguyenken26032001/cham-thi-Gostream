export class CustomerService {
    constructor () {
        this.contextPath = import.meta.env.BASE_URL;
    }

    getCustomersSmall () {
        return fetch(this.contextPath + 'demo/data/customers-small.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }
    getCustomersMedium () {
        return fetch(this.contextPath + 'demo/data/customers-medium.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    getCustomersLarge () {
        return fetch(this.contextPath + 'demo/data/customers-large.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }
}
