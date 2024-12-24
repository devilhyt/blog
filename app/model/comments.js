var { promisePool: mysql } = require('../../lib/mysql');

/**
 * 從DB取得指定文章的留言資訊
 * @param {number} id 文章ID
 * @returns {string} name 留言者名稱
 * @returns {string} content 留言內容
 */
async function getComments(id) {
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
 * 新增留言
 * @param {number} userId 留言者ID
 * @param {number} articleId 文章ID
 * @param {string} content 留言內容
 * @returns {boolean} 是否新增成功
 */
async function addComment(userId, articleId, content) {
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

module.exports = { getComments, addComment };