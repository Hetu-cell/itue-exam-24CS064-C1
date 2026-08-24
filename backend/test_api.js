const http = require('http');

async function testApi() {
  console.log('--- TESTING FITZONE API ENDPOINTS ---');

  // 1. Test Login
  const loginData = JSON.stringify({ email: 'rahul@fitzone.com', password: 'password123' });
  const loginRes = await fetchApi('/api/v1/auth/login', 'POST', loginData);
  console.log('1. POST /auth/login Status:', loginRes.status, '| Success:', loginRes.body.success);
  const token = loginRes.body.token;

  // 2. Test Trainers (Public)
  const trainerRes = await fetchApi('/api/v1/trainers', 'GET');
  console.log('2. GET /trainers Status:', trainerRes.status, '| Count:', trainerRes.body.count);

  // 3. Test Booking Creation (Protected, 201)
  const trainerId = trainerRes.body.trainers[0]._id;
  const bookingData = JSON.stringify({
    trainerId,
    className: 'Evening CrossFit Power',
    date: '2026-08-26',
    timeSlot: '05:00 PM - 06:00 PM',
    status: 'booked'
  });
  const createBookingRes = await fetchApi('/api/v1/bookings', 'POST', bookingData, token);
  console.log('3. POST /bookings Status:', createBookingRes.status, '| Booking ID:', createBookingRes.body.booking?._id);

  // 4. Test Get My Bookings (Populated, Protected)
  const myBookingsRes = await fetchApi('/api/v1/bookings/my', 'GET', null, token);
  console.log('4. GET /bookings/my Status:', myBookingsRes.status, '| Count:', myBookingsRes.body.count);
  console.log('   Populated Member Email:', myBookingsRes.body.bookings[0]?.memberId?.email);
  console.log('   Populated Trainer Name:', myBookingsRes.body.bookings[0]?.trainerId?.name);

  // 5. Test Validation Error (Invalid Status enum -> 400 clean error JSON)
  const invalidData = JSON.stringify({
    trainerId,
    className: 'Invalid Workout',
    date: '2026-08-26',
    timeSlot: '05:00 PM',
    status: 'invalid_status_enum_test'
  });
  const valErrorRes = await fetchApi('/api/v1/bookings', 'POST', invalidData, token);
  console.log('5. Validation Failure POST /bookings Status:', valErrorRes.status);
  console.log('   Structured Error JSON:', JSON.stringify(valErrorRes.body));
}

function fetchApi(path, method, body = null, token = null) {
  return new Promise((resolve) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    if (body) req.write(body);
    req.end();
  });
}

testApi();
