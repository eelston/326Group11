/************************************************************************************
 * Based on PostRepositoryService.js from CS326 frontend integration example tasks-v2
 ***********************************************************************************/
import { Events } from '../eventhub/Events.js';
import Service from './Service.js';

export class PostRepositoryService extends Service {
  constructor() {
    super();
    this.dbName = 'postsDB';
    this.storeName = 'posts';
    this.db = null;

    // Initialize the database
    this.initDB()
      .then(() => {
        // Load tasks on initialization
        this.loadAllPosts();
      })
      .catch(error => {
        console.error(error);
      });
  }

  async initDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onupgradeneeded = event => {
        const db = event.target.result;
        db.createObjectStore(this.storeName, {
          keyPath: 'postId',
          autoIncrement: true,
        });
      };

      request.onsuccess = event => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onerror = event => {
        reject('Error initializing IndexedDB');
      };
    });
  }

  async loadAllPosts() {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([this.storeName], 'readonly');
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onsuccess = event => {
        const posts = event.target.result;
        posts.forEach(post => this.publish('NewPost', post));
        this.publish(Events.LoadPostsSuccess, posts);
        resolve(posts);
      };

      request.onerror = () => {
        this.publish(Events.LoadPostsFailure);
        reject('Error retrieving posts.');
      };
    });
  }

  async storePost(postData) {
    return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.add(postData);

        request.onsuccess = (event) => {
            postData.postId = event.target.result; 
            this.publish(Events.StorePostSuccess, postData);
            resolve('Post stored successfully');
          };
        request.onerror = () => {
          this.publish(Events.StorePostFailure, postData);
          reject('Error storing post: ');
        };
        
    })
  }

  async clearPosts() {
    return new Promise((resolve, reject) => {
        const transaction = this.db.transaction([this.storeName], 'readwrite');
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();

        request.onsuccess = () => {
            this.publish(Events.UnStorePostsSuccess);
            resolve('All posts cleared.');
        }

        request.onerror = () => {
            this.publish(Events.UnStorePostsFailure);
            reject('Error clearing posts.');
        };
    });
  }
 
  addSubscriptions() {
    this.subscribe(Events.StorePosts, data => {
      this.storePost(data);
    });

    this.subscribe(Events.UnStorePost, () => {
      this.clearPosts();
    });
  }
}