class _InMemoryUserModel {

    constructor(){
        this.users = [];
    }

    async create (user) {
        this.users.push(user);
        return user;
    }

    async read (user = null) {
        if (user === null) {
            return this.users;
        }
        if (user.userId) {
            return this.users.find((u) => u.userId === user.userId);
        }
        return this.users.find((u) => u.email === user.email);
    }

    async update (user) {
        const index = this.users.findIndex((u) => u.userId === user.userId);
        this.users[index] = user;
        return user;
    }

    async delete (user = null) {
        if (user === null) {
            this.users = []
            return;
        }
        const index = this.users.findIndex((u) => u.userId === user.userId);
        this.users.splice(index, 1);
        return user;
    }

}

const InMemoryUserModel = new _InMemoryUserModel();

export default InMemoryUserModel;