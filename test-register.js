const http = require('http');

const testRegister = (data) => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (err) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(postData);
    req.end();
  });
};

// Test cases
async function runTests() {
  console.log('🧪 Testing Registration Endpoint...\n');
  
  // Test 1: Valid registration
  console.log('1. Testing valid registration...');
  try {
    const result = await testRegister({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.data, null, 2)}\n`);
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test 2: Missing name
  console.log('2. Testing missing name...');
  try {
    const result = await testRegister({
      email: 'test2@example.com',
      password: 'password123'
    });
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.data, null, 2)}\n`);
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test 3: Invalid email
  console.log('3. Testing invalid email...');
  try {
    const result = await testRegister({
      name: 'Test User',
      email: 'invalidemail',
      password: 'password123'
    });
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.data, null, 2)}\n`);
  } catch (error) {
    console.error('   Error:', error.message);
  }
  
  // Test 4: Short password
  console.log('4. Testing short password...');
  try {
    const result = await testRegister({
      name: 'Test User',
      email: 'test4@example.com',
      password: '123'
    });
    console.log(`   Status: ${result.status}`);
    console.log(`   Response: ${JSON.stringify(result.data, null, 2)}\n`);
  } catch (error) {
    console.error('   Error:', error.message);
  }
}

console.log('📡 Make sure your server is running on port 5000...');
console.log('Run: npm run dev (in another terminal)\n');

setTimeout(runTests, 2000);
