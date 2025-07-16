const http = require('http');

// Test function to make HTTP requests
const testEndpoint = (path, method = 'GET', data = null) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
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

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
};

// Run tests
async function runTests() {
  console.log('🧪 Testing API Endpoints...\n');
  
  try {
    // Test health endpoint
    console.log('1. Testing health endpoint...');
    const health = await testEndpoint('/api/health');
    console.log(`   Status: ${health.status}`);
    console.log(`   Response: ${JSON.stringify(health.data)}\n`);
    
    // Test electronics endpoint
    console.log('2. Testing electronics endpoint...');
    const electronics = await testEndpoint('/api/products/electronics');
    console.log(`   Status: ${electronics.status}`);
    console.log(`   Response: ${JSON.stringify(electronics.data)}\n`);
    
    // Test cars endpoint
    console.log('3. Testing cars endpoint...');
    const cars = await testEndpoint('/api/products/cars');
    console.log(`   Status: ${cars.status}`);
    console.log(`   Response: ${JSON.stringify(cars.data)}\n`);
    
    // Test spare parts endpoint
    console.log('4. Testing spare parts endpoint...');
    const spareParts = await testEndpoint('/api/products/spare-parts');
    console.log(`   Status: ${spareParts.status}`);
    console.log(`   Response: ${JSON.stringify(spareParts.data)}\n`);
    
    // Test 404 endpoint
    console.log('5. Testing 404 endpoint...');
    const notFound = await testEndpoint('/api/nonexistent');
    console.log(`   Status: ${notFound.status}`);
    console.log(`   Response: ${JSON.stringify(notFound.data)}\n`);
    
    console.log('✅ All tests completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Check if server is running first
console.log('📡 Make sure your server is running on port 5000...');
console.log('Run: npm start (in another terminal)\n');

// Wait a bit then run tests
setTimeout(runTests, 2000);
