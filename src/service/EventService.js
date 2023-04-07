export class EventService {
    constructor () {
        this.contextPath = import.meta.env.BASE_URL;
    }

    getEvents () {
        return fetch(this.contextPath + 'demo/data/scheduleevents.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }
}
