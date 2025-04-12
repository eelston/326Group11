/**
 * Database for posts used in post creation.
 */

export const IndexedDB = (() => {
    const DB_NAME = "StudyOnCampusDB";
    const STORE_NAME = "posts";
    const DB_VERSION = "1";
  
    async function openDB() {
        return new Promise((resolve, reject) => {
          const request = indexedDB.open(DB_NAME, DB_VERSION);
    
          request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
              db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
            }
          };
    
          request.onsuccess = () => resolve(request.result);
          request.onerror = () => reject(request.error);
        });
    }

    async function savePost(post) {
        const db = await openDB();
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        store.add(post);
        store.onsuccess = () => {
            console.log('Saved post:', post);
            resolve();
        }
        store.onerror = (e) => {
            console.error('Save failed:', e.target.error);
            reject(e.target.error);
        };
    }
  
    async function getAllPosts() {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
      return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    }
  
    async function deletePost(id) {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).delete(id);
      return tx.complete;
    }
  
    async function clearAllPosts() {
      const db = await openDB();
      const tx = db.transaction(STORE_NAME, "readwrite");
      tx.objectStore(STORE_NAME).clear();
      return tx.complete;
    }
  
    return {
      savePost,
      getAllPosts,
      deletePost,
      clearAllPosts,
    };
  })();
  