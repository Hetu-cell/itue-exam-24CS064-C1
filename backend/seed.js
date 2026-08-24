const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Member = require('./models/Member');
const Trainer = require('./models/Trainer');
const ClassBooking = require('./models/ClassBooking');

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/fitzone');
    console.log('[Seed]: Connected to MongoDB');

    // Clear existing collections
    await Member.deleteMany({});
    await Trainer.deleteMany({});
    await ClassBooking.deleteMany({});
    console.log('[Seed]: Cleared existing data');

    // Seed Members
    const members = await Member.insertMany([
      {
        name: 'Rahul Sharma',
        email: 'rahul@fitzone.com',
        phone: '+91 98765 43210',
        password: 'password123',
        membershipType: 'platinum',
        role: 'Admin',
      },
      {
        name: 'Priya Patel',
        email: 'priya@fitzone.com',
        phone: '+91 87654 32109',
        password: 'password123',
        membershipType: 'premium',
        role: 'Member',
      },
      {
        name: 'Aman Verma',
        email: 'aman@fitzone.com',
        phone: '+91 76543 21098',
        password: 'password123',
        membershipType: 'basic',
        role: 'Member',
      },
    ]);
    console.log(`[Seed]: Inserted ${members.length} Members`);

    // Seed Trainers
    const trainers = await Trainer.insertMany([
      { name: 'Vikram Singh', specialization: 'CrossFit & Strength Training', available: true },
      { name: 'Ananya Roy', specialization: 'Yoga & Pilates', available: true },
      { name: 'Marcus Vance', specialization: 'HIIT & Bodybuilding', available: false },
      { name: 'Sophia Chen', specialization: 'Cardio & Endurance', available: true },
    ]);
    console.log(`[Seed]: Inserted ${trainers.length} Trainers`);

    // Seed a sample booking
    await ClassBooking.create({
      memberId: members[1]._id,
      trainerId: trainers[0]._id,
      className: 'Morning CrossFit Blast',
      date: '2026-08-25',
      timeSlot: '07:00 AM - 08:00 AM',
      status: 'booked',
    });
    console.log('[Seed]: Inserted sample ClassBooking');

    console.log('--- SEED COMPLETED SUCCESSFULLY ---');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error.message);
    process.exit(1);
  }
};

seedData();
