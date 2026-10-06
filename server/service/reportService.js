import {getReportModel,getCategoryReportModel } from "../model/reportModel.js";

export const getReportService = async (user_id, month) => {

    if (!month) {
        const error = new Error("month is required");
        error.status = 400;
        throw error;
    }

    const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!monthPattern.test(month)) {
        const error = new Error(
            "month must be in YYYY-MM format"
        );

        error.status = 400;
        throw error;
    }

    const rows = await getReportModel(
        user_id,
        month
    );

    let income = 0;
    let expense = 0;

    rows.forEach((row) => {

        if (row.type === "income") {
            income = Number(row.total);
        }

        if (row.type === "expense") {
            expense = Number(row.total);
        }

    });

    const balance = income - expense;

    return {
        month,
        income,
        expense,
        balance
    };
};
export const getCategoryReportService = async (user_id, month) => {

    if (!month) {
        const error = new Error("month is required");
        error.status = 400;
        throw error;
    }

    const monthPattern = /^\d{4}-(0[1-9]|1[0-2])$/;

    if (!monthPattern.test(month)) {
        const error = new Error(
            "month must be in YYYY-MM format"
        );

        error.status = 400;
        throw error;
    }

    const rows = await getCategoryReportModel(
        user_id,
        month
    );

    const categories = rows.map((row) => ({
        category_name: row.category_name,
        type: row.type,
        total: Number(row.total)
    }));

    return {
        month,
        categories
    };
};