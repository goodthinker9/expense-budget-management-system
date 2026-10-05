import db from "../config/db.js";
export const createTransactionModel=async(data,user_id)=>{
    const {amount,category_id,description,transaction_date}=data
    const sql=`INSERT INTO transactions (user_id,amount,category_id,description,transaction_date) VALUES (?,?,?,?,?)`
    const [result] = await db.execute(sql, [user_id,amount,category_id,description,transaction_date])
    return result.insertId

}
export const getTransactionModel=async(user_id)=>{
    const sql=`SELECT t.id, t.amount, t.description, t.transaction_date, c.name AS category_name, c.type AS category_type
                    FROM transactions t
                    JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = ?`
    const [result]=await db.query(sql,[user_id])
    return result
}
export const getTransactionModelById=async(user_id,transaction_id)=>{
    const sql=`SELECT t.id, t.amount, t.description, t.transaction_date, c.name AS category_name, c.type AS category_type
                    FROM transactions t
                    JOIN categories c ON t.category_id = c.id
                    WHERE t.user_id = ? AND t.id = ?`
    const [result]=await db.query(sql,[user_id,transaction_id])
    return result[0]
}
export const updateTransactionModel=async(user_id,transaction_id,data)=>{
    const {amount,category_id,description,transaction_date}=data
    const sql=`UPDATE transactions SET amount=?, category_id=?, description=?, transaction_date=? WHERE user_id=? AND id=?`
    const [result]=await db.query(sql,[amount,category_id,description,transaction_date,user_id,transaction_id])
    return result.affectedRows > 0
}
export const deleteTransactionModel=async(user_id,transaction_id)=>{
    const sql=`DELETE FROM transactions WHERE user_id=? AND id=?`
    const [result]=await db.query(sql,[user_id,transaction_id])
    return result.affectedRows > 0
}
export const getTransactionByTypeModel=async(user_id,type,start_date,end_date)=>{
    let sql = `
        SELECT
            transactions.id,
            transactions.amount,
            transactions.description,
            transactions.transaction_date,
            categories.name AS category_name,
            categories.type AS category_type
        FROM transactions
        JOIN categories
            ON transactions.category_id = categories.id
        WHERE transactions.user_id = ?
    `;

    const values = [user_id];

    if (type) {
        sql += ` AND categories.type = ?`;
        values.push(type);
    }

    if (start_date && end_date) {
        sql += ` AND transactions.transaction_date >= ?`;
        values.push(start_date);

        sql += ` AND transactions.transaction_date <= ?`;
        values.push(end_date);
    }

    sql += ` ORDER BY transactions.transaction_date DESC`;

    const [rows] = await db.query(sql, values);

    return rows;
};
