class FetchSError extends Error {
    constructor(message, status, statusText){
        super(message);
        this.status = status;
        this.statusText = statusText;
        this.name = this.constructor.name;
    }
}
const fetchS1 = async (url, init)=>{
    const res = await fetch(url, init).catch((err)=>{
        throw new FetchSError(err.message, 0, "Network Error");
    });
    if (!res.ok) {
        throw new FetchSError(`Received status code ${res.status} instead of 200-299 range`, res.status, res.statusText);
    }
    try {
        switch(init?.bodyMethod){
            case "arrayBuffer":
                return await res.arrayBuffer();
                break;
            case "blob":
                return await res.blob();
                break;
            case "formData":
                return await res.formData();
                break;
            case "json":
                return await res.json();
                break;
            case "text":
                return await res.text();
                break;
            case "uint8Array":
            default:
                return new Uint8Array(await res.arrayBuffer());
        }
    } catch (err) {
        throw new FetchSError(err.message, res.status, res.statusText);
    }
};
export { fetchS1 as fetchS };

