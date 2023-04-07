export class NodeService {
    constructor () {
        this.contextPath = import.meta.env.BASE_URL;
    }

    getFiles () {
        return fetch(this.contextPath + 'demo/data/files.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    getLazyFiles () {
        return fetch(this.contextPath + 'demo/data/files-lazy.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    getFilesystem () {
        return fetch(this.contextPath + 'demo/data/filesystem.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    getLazyFilesystem () {
        return fetch(this.contextPath + 'demo/data/filesystem-lazy.json', { headers: { 'Cache-Control': 'no-cache' } })
            .then(res => res.json())
            .then(d => d.data);
    }

    getTreeTableNodes () {
        return fetch(this.contextPath + 'demo/data/treetablenodes.json')
            .then(res => res.json())
            .then(d => d.root);
    }

    getTreeNodes () {
        return fetch(this.contextPath + 'demo/data/treenodes.json')
            .then(res => res.json())
            .then(d => d.root);
    }
}
