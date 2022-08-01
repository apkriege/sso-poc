const knex = require('../knex');

class User {
  static table = 'users';
  
  static async findOne(login) {
    return await knex.table(this.table).whereRaw('LOWER("email") = ?', login).orWhereRaw('LOWER("username") = ?', login).first();
  }

  static mapUser(user) {
    return {
      first: user.first, 
      last: user.last, 
      email: user.email, 
      username: user.username,
      token: user.authToken
    }
  }

}

module.exports = User;