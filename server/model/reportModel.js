import db from "../config/db.js";
export const getReportModel = async (user_id, month) => {

    const sql = `
        SELECT
            categories.type,
            SUM(transactions.amount) AS total
        FROM transactions
        JOIN categories
            ON transactions.category_id = categories.id
        WHERE transactions.user_id = ?
        AND DATE_FORMAT(
            transactions.transaction_date,
            '%Y-%m'
        ) = ?
        GROUP BY categories.type
    `;

    const [rows] = await db.query(sql, [
        user_id,
        month
    ]);

    return rows;
};