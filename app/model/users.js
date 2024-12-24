var { promisePool: mysql } = require('../../lib/mysql');

/**
 * 從DB取得指定帳號資訊
 * @param {string} account 帳號
 * @returns {object} 帳號資訊
 */
async function getAccountDb(account) {
    const query =
    `SELECT 
        id, 
        is_admin, 
        name, 
        account, 
        password, 
        createdAt, 
        updatedAt 
    FROM users WHERE account = ?`;
    const [rows, fields] = await mysql.execute(query, [account]);
    return rows;
}

/**
 * 從DB取得指定帳號資訊
 * @param {string} id 帳號ID
 * @returns {object} 帳號資訊
 */
async function getAccountByIdDb(id) {
    const query =
    `SELECT 
        id, 
        is_admin, 
        name, 
        account, 
        password, 
        createdAt, 
        updatedAt 
    FROM users WHERE id = ?`;
    
    const [rows, fields] = await mysql.execute(query, [id]);
    return rows;
}

/**
 * 註冊帳號
 * @param {string} name 使用者名稱
 * @param {string} account 帳號
 * @param {string} hashedPassword 雜湊密碼
 */
async function registerAccount(name, account, hashedPassword, isAdmin) {
    const query = 'INSERT INTO `users` (is_admin, name, account, password) VALUES (?, ?, ?, ?)';

    try {
        const [rows, fields] = await mysql.execute(query, [isAdmin, name, account, hashedPassword]);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 更新帳號資訊
 * @param {number} id 帳號ID
 * @param {string} name 使用者名稱
 * @param {string} hashedPassword 雜湊密碼
 */
async function updateAccountDb(id, name, hashedPassword) {
    const updateNameQuery = 'UPDATE `users` SET name = ? WHERE id = ?';
    const updatePasswordQuery = 'UPDATE `users` SET password = ? WHERE id = ?';
    
    if(name){
        try {
            const [rows, fields] = await mysql.execute(updateNameQuery, [name, id]);
        } catch (err) {
            return false;
        }
    }
    if(hashedPassword){
        try {
            const [rows, fields] = await mysql.execute(updatePasswordQuery, [hashedPassword, id]);
        } catch (err) {
            return false;
        }
    }
    return true;
}

module.exports = { getAccountDb, registerAccount, updateAccountDb, getAccountByIdDb };