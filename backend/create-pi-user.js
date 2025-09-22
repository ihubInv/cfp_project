const mongoose = require('mongoose');
const User = require('./models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/researchproject')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check if PI user already exists
    const existingPI = await User.findOne({ email: 'pi@test.com' });
    if (existingPI) {
      console.log('PI user already exists:', existingPI.email);
      process.exit(0);
    }
    
    // Create PI user
    const piUser = new User({
      username: 'pi_test',
      email: 'pi@test.com',
      password: 'password123',
      firstName: 'PI',
      lastName: 'Test',
      institution: 'IIT Mandi',
      role: 'PI',
      isActive: true
    });
    
    await piUser.save();
    console.log('PI user created successfully:', {
      email: piUser.email,
      role: piUser.role,
      username: piUser.username
    });
    
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
