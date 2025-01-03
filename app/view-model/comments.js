﻿var { getCommentsDb, getCommentByIdDb, addCommentDb, deleteCommentDb } = require('../model/comments');

/**
 * 取得留言
 * @param {number} id 文章ID
 * @returns {string} name 留言者名稱
 * @returns {string} content 留言內容
 */
async function getComments(id) {
    const comments = await getCommentsDb(id);
    return comments;
}

/**
 * 從DB取得指定留言ID
 * @param {number} id 留言ID
 * @returns {object} 留言資訊
 */
async function getCommentById(id) {
    const comment = await getCommentByIdDb(id);
    return comment;
}

/**
 * 新增留言
 * @param {number} userId 留言者ID
 * @param {number} articleId 文章ID
 * @param {string} content 留言內容
 * @returns {boolean} 是否新增成功
 */
async function addComment(userId, articleId, content) {
    if (await addCommentDb(userId, articleId, content)) {
        return true;
    } else {
        return false;
    }
}

/**
 * 刪除留言
 * @param {number} id 留言ID
 * @param {number} userId 留言者ID
 * @returns {boolean} 是否刪除成功
 */
async function deleteComment(id) {
    if (await deleteCommentDb(id)) {
        return true;
    } else {
        return false;
    }
}
module.exports = { getComments, getCommentById, addComment, deleteComment };