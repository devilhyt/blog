﻿var { promisePool: mysql } = require('../../lib/mysql');

/**
 * 從DB取得指定的文章
 * @param {number} id 文章ID
 * @param {number} title 文章標題
 * @param {number} category 文章分類
 * @returns {object} 文章資料
 */
async function getArticlesDb(id, title = "", category = "", page = 0, articlePerPage = 0) {
    if (id) {
        const query = 
        `SELECT 
            articles.id, 
            title, 
            category, 
            user_id, 
            users.name, 
            users.account, 
            content, 
            articles.createdAt, 
            articles.updatedAt 
        FROM articles INNER JOIN users ON articles.user_id = users.id 
        WHERE articles.id=?`;

        const [rows, fields] = await mysql.execute(query, [id]);

        return rows;
    } else {
        let query = 
        `SELECT 
            articles.id, 
            title, 
            category, 
            user_id, 
            users.name, 
            users.account, 
            content, 
            articles.createdAt, 
            articles.updatedAt 
        FROM articles INNER JOIN users ON articles.user_id = users.id 
        WHERE articles.title LIKE ? AND category LIKE ? 
        ORDER BY articles.createdAt DESC`;

        if (page > 0 && articlePerPage > 0) {
            query += ` LIMIT ${articlePerPage} OFFSET ${articlePerPage * (page - 1)}`;
        }

        const [rows, fields] = await mysql.execute(query, [`%${title}%`, `%${category}%`]);

        // // debug
        // const sql = mysql.format('SELECT articles.id, title, category, user_id, users.name, users.account, content, articles.createdAt, articles.updatedAt FROM `articles` INNER JOIN `users` ON articles.user_id = users.id WHERE articles.title LIKE ? AND category LIKE ?', [`%${title}%`, `%${category}%`]);
        // console.log(sql)
        return rows;
    }
}

/**
 * 新增文章至DB
 * @param {string} title 文章標題
 * @param {string} category 文章分類
 * @param {number} userId 文章作者ID
 * @param {string} content 文章內容
 * @returns {boolean} 是否新增成功
 */
async function addArticleDb(title, category, userId, content) {
    const query = 
    `INSERT INTO articles (title, category, user_id, content, createdAt, updatedAt) 
    VALUES (?, ?, ?, ?, now(), now())`;

    const [rows, fields] = await mysql.execute(query, [title, category, userId, content]);
    if (rows.affectedRows === 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * 從DB修改指定文章
 * @param {number} id 文章ID
 * @param {string} title 文章標題
 * @param {string} category 文章分類
 * @param {string} content 文章內容
 * @returns {boolean} 是否修改成功
 */
async function editArticleDb(id, title, category, content) {
    const query = 
    `UPDATE articles SET title = ?, category = ?, content = ?, updatedAt = now() 
    WHERE id = ?`;

    const [rows, fields] = await mysql.execute(query, [title, category, content, id]);
    if (rows.affectedRows === 0) {
        return false;
    } else {
        return true;
    }
}

/**
 * 從DB刪除指定文章
 * @param {number} id 文章ID
 * @returns {boolean} 是否刪除成功
 */
async function deleteArticleDb(id) {
    const query = 
    `DELETE FROM articles 
    WHERE id = ?`;
    
    const [rows, fields] = await mysql.execute(query, [id]);
    if (rows.affectedRows === 0) {
        return false;
    } else {
        return true;
    }
}

module.exports = { getArticlesDb, addArticleDb, editArticleDb, deleteArticleDb };