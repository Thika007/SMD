const express = require('express');
const router = express.Router();
const { poolPromise } = require('../db');

router.get('/stock', async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      WITH Stock AS (
        SELECT ItemDesc, SUM(Quantity) AS stockQty
        FROM dbo.SellItem
        GROUP BY ItemDesc
      ),
      Issue AS (
        SELECT tran_desc, SUM(tran_qty) AS issueQty
        FROM dbo.bill_tran
        GROUP BY tran_desc
      )
      SELECT 
        s.ItemDesc AS itemName,
        s.stockQty,
        ISNULL(i.issueQty, 0) AS issueQty
      FROM Stock s
      LEFT JOIN Issue i
        ON s.ItemDesc = i.tran_desc
      ORDER BY s.ItemDesc
    `);

    // Add balanceQty and prevent negative values
    const data = result.recordset.map((item, idx) => {
      const balanceQty = Math.max(item.stockQty - item.issueQty, 0);
      return {
        no: idx + 1,
        itemName: item.itemName,
        stockQty: item.stockQty,
        issueQty: item.issueQty,
        balanceQty
      };
    });

    // Sort by balanceQty ascending (lowest first)
    data.sort((a, b) => a.balanceQty - b.balanceQty);

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
