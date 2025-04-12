import Service from "./Service.js";
import { fetch } from "../utility/fetchLocations.js"; // fake fetch for milestone 5 (no backend implementation)

export class LocationRepositoryRemoteFakeService extends Service {
  constructor() {
    super();
  }

  // reference function pulled from CS 326 example -- not sure yet if this service will be needed
  // async storeTask(taskData) {
  //   const response = await fetch("http://localhost:3000/task", { // http://localhost:3000/lib/data/MockLocations.json ?
  //     method: "POST",
  //     body: JSON.stringify(taskData),
  //   });
  //   const data = await response.json();
  //   return data;
  // }

  // async clearTasks() {
  //   const response = await fetch("http://localhost:3000/tasks", {
  //     method: "DELETE",
  //   });
  //   const data = await response.json();
  //   return data;
  // }

  // addSubscriptions() {
  //   this.subscribe(Events.StoreTask, (data) => {
  //     this.storeTask(data);
  //   });

  //   this.subscribe(Events.UnStoreTasks, () => {
  //     this.clearTasks();
  //   });
  // }
}
