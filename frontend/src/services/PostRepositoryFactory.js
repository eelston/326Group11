import { PostRepositoryService } from "./PostRepositoryService.js";
import { PostRepositoryRemoteFakeService } from "./PostRepositoryRemoteFakeService.js";

/** Taken From CS 326
 * Factory class to create instances of task repository services.
 * 
 * This class provides a static method to get an appropriate instance
 * of a task repository service based on the specified repository type.
 * It cannot be instantiated.
 */
export class PostRepositoryFactory {
  constructor() {
    throw new Error('Cannot instantiate a TaskRepositoryFactory object');
  }

  /**
   * Returns an instance of a task repository service based on the given
   * repository type.
   *
   * @param {string} [repoType='local'] - The type of repository service to
   * create. Can be 'local' or 'remote'.
   * @returns {TaskRepositoryService|TaskRepositoryServerRemote} An instance
   * of the appropriate task repository service.
   * @throws Will throw an error if the repository type is not recognized.
   */
  static get(repoType = 'local') {
    if (repoType === 'local') {
      return new PostRepositoryService();
    }
    else if (repoType === 'remote') {
      return new PostRepositoryRemoteFakeService();
    }
    else {
      throw new Error('Invalid repository type');
    }
  }
}
