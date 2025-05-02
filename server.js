const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/35ldb', { // NAME OF DB
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
  
    // SCHEMA
    const userSchema = new mongoose.Schema({
      uid: {
        type: Number,
        validate: {
          validator: num => /^\d{9}$/.test(num),
          message: props => `Invalid uid ${props.value}`
        },
        required: true,
        unique: true
      },
      role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
      },
      email: {
        type: String,
        required: true
      }
    });
  
    const User = mongoose.model('User', userSchema);

    // insertion of samples
    const sample = [
      { uid: 123456789, role: 'admin', email: '123@g.ucla.edu' },
      { uid: 987654321, role: 'user', email: '987@g.ucla.edu' },
      { uid: 110000000, role: 'user', email: '110@g.ucla.edu' }
    ];
  
    try {
      await User.insertMany(sample);
      console.log('Insertion successful');
    } catch (err) {
      console.error('Insert error:', err.message);
    } finally {
      mongoose.disconnect();
    }
  });
  