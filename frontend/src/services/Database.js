const DB_NAME = 'StudyOnCampusDB';
const STORE_NAME = 'posts';

let db = null;

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = function (e) {
            db = e.target.result;
            resolve(db);
        };

        request.onerror = function (e) {
            reject(e.target.error);
        };
    });
}

function savePost(post) {
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        const request = store.add(post);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

export { openDB, savePost };