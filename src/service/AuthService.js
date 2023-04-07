// const axios = require('axios');
export class CompetitionService {
    // constructor() {
    //     this.contextPath = import.meta.env.BASE_URL;
    // }

    getCompetition() {
        return fetch(`http://localhost:3000/api/competition`)
            .then(res => res.json())
            .then(d => d.data);
    }
}
