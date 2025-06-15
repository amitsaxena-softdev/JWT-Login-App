const express = require('express');
const app = express();
const cors = require('cors');
const userRouter = require('./Routers/userRouter');

require('dotenv').config();

app.use(cors());
app.use(express.json());


app.use('/user', userRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the JWT Login App Server!');
}
);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
}
);

