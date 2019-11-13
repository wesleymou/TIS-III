import User from "../models/User";
import CrudAsync from "../models/CrudAsync";

import DataBase from "../services/Database";

class UserService implements CrudAsync<User> {
  createAsync(user: User): Promise<void> {
    return new Promise((resolve, reject) => {
      const sql = `insert into user (login, password) values (?, ?);`;
      DataBase.query(sql, [user.login, user.password], (err, results) => {
        if (!err && results.affectedRows) {
          resolve();
        } else {
          reject(err);
        }
      });
    });
  }

  getByIdAsync(id: number): Promise<User> {
    return new Promise((resolve, reject) => {
      const sql = `select * from user where id = ?`;
      DataBase.query(sql, id, (err, results) => {
        if (!err) {
          const [first] = results;
          resolve(first);
        } else {
          reject(err);
        }
      });
    });
  }

  getByUserName(login: string): Promise<User> {
    return new Promise((resolve, reject) => {
      const sql = `select * from user where login = ?`;
      DataBase.query(sql, login, (err, results) => {
        if (!err) {
          const [first] = results;
          resolve(first);
        } else {
          reject(err);
        }
      });
    });
  }

  getPageAsync(page: number): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  getAllAsync(): Promise<User[]> {
    throw new Error("Method not implemented.");
  }
  
  updateAsync(update: User): Promise<void> {
    const sql = `
        update user as u
        set u.login = ?, u.password = ?
        where u.id = ?
    `;
    return new Promise((resolve, reject) => {
      DataBase.query(
        sql,
        [update.login, update.password, update.id],
        (err, results) => {
          if (!err) {
            resolve(results);
          } else {
            reject(err);
          }
        }
      );
    });
  }

  removeAsync(id: number): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

export default UserService;
