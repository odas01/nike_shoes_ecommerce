import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';

import router from './app/routes/index.js';

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '70mb' }));
app.use(express.urlencoded({ limit: '70mb', extended: true }));

app.use('/api', router);

const PORT = process.env.PORT || 3000;
console.log(process.env.MONGODB_URL);
mongoose
   .connect(process.env.MONGODB_URL)
   .then(() => {
      console.log('Connect to MongoDB successfully!!!');
      app.listen(PORT, () =>
         console.log(`Server is listening on port ${PORT}`)
      );
   })
   .catch((err) => {
      console.log({ err });
      process.exit(1);
   });
