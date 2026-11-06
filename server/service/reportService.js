import { getReportModel, getCategoryReportModel } from '../model/reportModel.js';

const MONTH_RE = /^\d{4}-(0[1-9]|1[0-2])$/;

/** Returns the current month as 'YYYY-MM'. */
function currentMonth() {
  const now = new Date();
  const mm  = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${mm}`;
}

function resolveMonth(month) {
  if (!month) return currentMonth();
  if (!MONTH_RE.test(month)) {
    const err = new Error('month must be in YYYY-MM format');
    err.status = 400; throw err;
  }
  return month;
}

export const getReportService = async (user_id, rawMonth) => {
  const month = resolveMonth(rawMonth);

  const rows = await getReportModel(user_id, month);

  let income = 0;
  let expense = 0;
  rows.forEach((r) => {
    if (r.type === 'income')  income  = Number(r.total);
    if (r.type === 'expense') expense = Number(r.total);
  });

  return { month, income, expense, balance: income - expense };
};

export const getCategoryReportService = async (user_id, rawMonth) => {
  const month = resolveMonth(rawMonth);

  const rows = await getCategoryReportModel(user_id, month);

  const categories = rows.map((r) => ({
    category_name: r.category_name,
    type:  r.type,
    total: Number(r.total),
  }));

  return { month, categories };
};

export const getDashboardReportService = async (user_id, rawMonth) => {
  const month = resolveMonth(rawMonth);

  const [monthly, catReport] = await Promise.all([
    getReportService(user_id, month),
    getCategoryReportService(user_id, month),
  ]);

  return {
    month,
    income:     monthly.income,
    expense:    monthly.expense,
    balance:    monthly.balance,
    categories: catReport.categories,
  };
};
