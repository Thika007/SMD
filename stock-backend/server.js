const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

const itemsRouter = require('./routes/items');

app.use(cors());
app.use('/api/items', itemsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
