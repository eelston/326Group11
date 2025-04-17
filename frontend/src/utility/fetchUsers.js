/**
 * Simulates a network request to the specified URL and returns a Promise
 * that resolves to a mock response object.
 */

let cachedUsers = null;

export function fetch(url, options = {}) {
    return new Promise((resolve, reject) => {

      const delay = 50;
  
      setTimeout(() => {

        if (url.includes("error")) {
            reject(new Error("Network error"));
            return;
        }

        const USERS_ENDPOINT = 'http://localhost:3000/users';

        
        const loadUsers = async () => {
            if (cachedUsers){
                return Promise.resolve(cachedUsers);
            }
            else{
                const res = await window.fetch("/frontend/src/lib/jsonServers/fakeUsers.json"); //functioning as fake server
                const users = await res.json();
                cachedUsers = users;
                return users;
            }
        }

        //handle create new user
        if (options.method === 'POST' && url === USERS_ENDPOINT) {
            loadUsers()
            .then((fakeUsers) => {
                const newUser = JSON.parse(options.body);
                newUser.id = fakeUsers.length + 1;
                fakeUsers.push(newUser);
                resolve({
                    ok: true,
                    status: 201,
                    statusText: "Created",
                    json: async () => newUser,
                  });
                }).catch(reject);
        }

        //handle get existing user
        else if (url.startsWith(USERS_ENDPOINT + "?email=")) {
            const queryEmail = url.split("=")[1];
            loadUsers()
            .then((fakeUsers) => {
                const user = fakeUsers.find((u) => u.email === queryEmail);
                if (user) {
                    resolve({
                      ok: true,
                      status: 200,
                      statusText: "OK",
                      json: async () => user,
                    });
                  } else {
                    resolve({
                      ok: false,
                      status: 404,
                      statusText: "Not Found",
                      json: async () => ({ message: "User not found" }),
                    });
                  }
            }).catch(reject);
        }

        // Unrecognized endpoint
        else {
            resolve({
                ok: false,
                status: 400,
                statusText: "Bad Request",
                json: async () => ({ message: "Invalid request URL or method" }),
            });
        }
      }, delay);
    });
  }
  