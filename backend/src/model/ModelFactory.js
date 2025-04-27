import InMemoryUserModel from "./InMemoryUserModel.js";
import SQLiteUserModel from "./SQLiteUserModel.js";

class _ModelFactory {
    async getModel(model = "sqlite") {
      if (model === "sqlite") {
        return SQLiteUserModel;
      } else if (model === "sqlite-fresh") {
        await SQLiteUserModel.init(true);
        return SQLiteUserModel;
      } else {
        return InMemoryUserModel;
      }
    }
  }
  
  const ModelFactory = new _ModelFactory();
  export default ModelFactory;