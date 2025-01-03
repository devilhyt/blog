﻿var { promisePool: mysql } = require('../../lib/mysql');

/**
 * 從DB取得指定文章的留言資訊
 * @param {number} id 文章ID
 * @returns {array} 留言資訊
 */
async function getCommentsDb(id) {
    const query =
    `SELECT 
        id,
        user_id,
        article_id,
        content,
        createdAt,
        updatedAt
    FROM messages 
    WHERE article_id = ?`;

    const [rows, fields] = await mysql.execute(query, [id]);
    return rows;
}

/**
 * 從DB取得指定留言ID
 * @param {number} id 留言ID
 * @returns {object} 留言資訊
 */
async function getCommentByIdDb(id) {
    const query =
    `SELECT 
        id,
        user_id,
        article_id,
        content,
        createdAt,
        updatedAt
    FROM messages 
    WHERE id = ?`;

    const [rows, fields] = await mysql.execute(query, [id]);
    return rows[0];
}

/**
 * 新增留言
 * @param {number} userId 留言者ID
 * @param {number} articleId 文章ID
 * @param {string} content 留言內容
 * @returns {boolean} 是否新增成功
 */
async function addCommentDb(userId, articleId, content) {
    const query = 'INSERT INTO messages (user_id, article_id, content) VALUES (?, ?, ?)';

    try {
        const [rows, fields] = await mysql.execute(query, [userId, articleId, content]);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * 刪除留言
 * @param {number} id 留言ID
 * @param {number} userId 留言者ID
 * @returns {boolean} 是否刪除成功
 */
async function deleteCommentDb(id) {
    const query = 'DELETE FROM messages WHERE id = ?';

    try {
        const [rows, fields] = await mysql.execute(query, [id]);
        return true;
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

module.exports = { getCommentsDb, getCommentByIdDb, addCommentDb, deleteCommentDb};