import InMemoryPostModel from "./InMemoryPostModel.js";

class _ModelPostFactory { // Will be Updated in Next Milestone to include SQLite.
    getModel() {
        return InMemoryPostModel;
    }
}

const ModelPostFactory = new _ModelPostFactory();
export default ModelPostFactory;