import InMemoryPostModel from "./InMemoryPostModel.js";
import SQLitePostModel from "./SQLitePostModel.js";

class _ModelPostFactory { 
    async getModel(model = "sqlite") {
        if (model === "sqlite") {
            return SQLitePostModel;
        } else if (model === "sqlite-fresh") {
            await SQLitePostModel.init(true);
            return SQLitePostModel;
        } else {
            return InMemoryPostModel;
        }
    }
}

const ModelPostFactory = new _ModelPostFactory();
export default ModelPostFactory;