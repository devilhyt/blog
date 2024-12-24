var { promisePool: mysql } = require('../../lib/mysql');

/**
 * 從DB取得所有使用者資訊
 * @returns {object} 使用者資訊
 */
async function getUsersDb(isAdmin='', name='') {
    const query =
    `SELECT 
        id, 
        is_admin, 
        name, 
        account 
    FROM users 
    WHERE is_admin LIKE ? AND name LIKE ?`;
    
    const [rows, fields] = await mysql.execute(query, [`%${isAdmin}%`, `%${name}%`]);
    return rows;
}

async function getSingleUserDb(id) {
    const query = 
    `SELECT 
        id, 
        is_admin, 
        name, 
        account
    FROM users
    WHERE id = ?`;

    const [rows, fields] = await mysql.execute(query, [id]);
    return rows[0];
}

/**
 * 從DB刪除指定使用者
 * @param {string} id 使用者ID
 * @returns {boolean} 是否刪除成功
 */
async function deleteUserDb(id) {
    const query = 'DELETE FROM `users` WHERE id = ?';
    const [rows, fields] = await mysql.execute(query, [id]);
    if (rows.affectedRows === 0) {
        return false;
    } else {
        return true;
    }
}

async function editUserDb(id, identity, member) {
    const query = 'UPDATE `users` SET is_admin = ?, name = ? WHERE id = ?';
    const [rows, fields] = await mysql.execute(query, [identity, member, id]);
    if (rows.affectedRows === 0) {
        return false;
    } else {
        return true;
    }
}

module.exports = { getUsersDb, getSingleUserDb, deleteUserDb, editUserDb };