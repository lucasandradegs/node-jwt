class User {
    constructor(data) {
        this.id = data.id;
        this.username = data.username;
        this.password = data.password;
        this.role = data.role;
        this.created_at = data.created_at;
    }

    toJSON() {
        const { password, ...user } = this;
        return user;
    }
}

module.exports = User; 