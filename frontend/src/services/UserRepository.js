import {fetch} from "../utility/fetchUsers.js"

/**
 * Basic layout for a class handling interactions with a User Repository.
 * Currently used by fetch to acces fakeUser.json in jsonServers.
 */

export class UserRepository {
  
    async createUser(userData) {
        const response = await fetch('http://localhost:3000/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        });
        return response.json();
      }
    
    async getUserByEmail(email) {
        const response = await fetch(`http://localhost:3000/users?email=${email}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched user data:', data);
          return data;
        } else {
          console.log('Failed to fetch user: ', response.statusText);
          return null;
        }
    }
}