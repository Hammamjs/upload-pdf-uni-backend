import mongoose from 'mongoose';

const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
  } catch (err) {
    console.log(err);
  }
};

export default connect;
