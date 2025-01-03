let { promisePool: mysql } = require('./lib/mysql');
let { register } = require('./app/view-model/users');
let { addArticle } = require('./app/view-model/articles');
let { addComment } = require('./app/view-model/comments');
const articles = require('./dataset/articles.json');
const messages = require('./dataset/messages.json');

const authorAmount = 10; // 作者數量
const userAmount = 90; // 一般使用者數量
const commentAmount = 100; // 留言數量
const articleAmount = articles.length; // 文章數量

/**
 * 產生使用者假資料
 * @param {number} authorAmount 作者數量
 * @param {number} userAmount 一般使用者數量
 */
async function generateUsers(authorAmount, userAmount) {
    await mysql.execute(`
        CREATE TABLE \`users\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`is_admin\` int NOT NULL COMMENT '0 : normal, 1 : admin',
            \`name\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`account\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL UNIQUE,
            \`password\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
    await register(`root`, `root`, `root`, 1);
    for (let i = 0; i < authorAmount; ++i) {
        await register(`author${i}`, `author${i}`, `author${i}`, 1);
    }
    await register(`author`, `author`, `author`, 1);
    for (let i = 0; i < userAmount; ++i) {
        await register(`user${i}`, `user${i}`, `user${i}`, 0);
    }
}

/**
 * 產生文章假資料
 * @param {number} authorAmount 作者數量
 */
async function generateArticles(authorAmount, articles) {
    const categories = ['生活', '科技', '美食', '理財'];
    await mysql.execute(`
        CREATE TABLE \`articles\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`user_id\` int NOT NULL,
            \`category\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`title\` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`content\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`),
            KEY \`user_id\` (\`user_id\`),
            CONSTRAINT \`article_user_cascade\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Shuffle articles list
    for (let i = articles.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [articles[i], articles[j]] = [articles[j], articles[i]];
    }

    for (let i = 0; i < articles.length; ++i) {
        let title = articles[i].title;
        let category = articles[i].category;
        let userId = Math.floor(Math.random() * authorAmount + 2);
        let content = articles[i].content;
        await addArticle(title, category, userId, content);
    }
}

/**
 * 產生留言假資料
 */
async function generateMessages(messages) {
    await mysql.execute(`
        CREATE TABLE \`messages\` (
            \`id\` int NOT NULL AUTO_INCREMENT,
            \`user_id\` int NOT NULL,
            \`article_id\` int NOT NULL,
            \`content\` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
            \`createdAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            \`updatedAt\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (\`id\`),
            KEY \`user_id\` (\`user_id\`),
            KEY \`article_id\` (\`article_id\`),
            CONSTRAINT \`message_user_cascade\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE,
            CONSTRAINT \`message_article_cascade\` FOREIGN KEY (\`article_id\`) REFERENCES \`articles\` (\`id\`) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    for (let i = 0; i < commentAmount; ++i) {
        let userId = Math.floor(Math.random() * userAmount + 2);
        let articleId = Math.floor(Math.random() * articleAmount + 1);
        let content = messages[i];
        await addComment(userId, articleId, content);
    }
}

/**
 * 刪除所有資料表
 */
async function dropAllTable() {
    await mysql.execute(`
        DROP TABLE IF EXISTS \`messages\`;
    `);
    await mysql.execute(`
        DROP TABLE IF EXISTS \`articles\`;
    `);
    await mysql.execute(`
        DROP TABLE IF EXISTS \`users\`;
    `);
}

/**
 * 主程式
 */
async function main() {
    await dropAllTable();
    await generateUsers(authorAmount, userAmount);
    await generateArticles(authorAmount, articles);
    await generateMessages(messages);
    process.exit();
}

main();