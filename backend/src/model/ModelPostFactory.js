import InMemoryPostModel from "./InMemoryPostModel";

class _ModelPostFactory { // Will be Updated in Next Milestone to include SQLite.
    getModel() {
        return InMemoryPostModel;
    }
}

const ModelPostFactory = new _ModelPostFactory();
export default ModelPostFactory;