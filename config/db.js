import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect(
      process.env.NODE_ENV === 'development'
        ? process.env.DB_URI_DEV
        : process.env.DB_URI_PROD
    );
  } catch (err) {
    console.log(err);
  }
};

export default connect;
