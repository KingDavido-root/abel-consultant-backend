require('dotenv').config();
const mongoose = require('mongoose');
const Electronic = require('../models/Electronic');
const Car = require('../models/Car');
const SparePart = require('../models/SparePart');

const sampleElectronics = [
  {
    title: "Samsung 65\" QLED 4K TV",
    description: "Experience stunning colors and contrast with Quantum Dot technology",
    price: 1299.99,
    images: ["https://placehold.co/600x400?text=Samsung+TV"],
    stock: 10
  },
  {
    title: "MacBook Pro M2",
    description: "The most powerful MacBook Pro yet with the M2 chip",
    price: 1999.99,
    images: ["https://placehold.co/600x400?text=MacBook+Pro"],
    stock: 15
  },
  {
    title: "Sony PlayStation 5",
    description: "Next-gen gaming console with ray tracing and 4K support",
    price: 499.99,
    images: ["https://placehold.co/600x400?text=PS5"],
    stock: 8
  },
  {
    title: "iPhone 14 Pro Max",
    description: "Latest iPhone with Dynamic Island and 48MP camera",
    price: 1099.99,
    images: ["https://placehold.co/600x400?text=iPhone"],
    stock: 20
  },
  {
    title: "Dell XPS 15",
    description: "Premium laptop with 4K OLED display and RTX graphics",
    price: 1799.99,
    images: ["https://placehold.co/600x400?text=Dell+XPS"],
    stock: 12
  }
];

const sampleCars = [
  {
    title: "2023 Tesla Model Y",
    description: "All-electric SUV with long range and autopilot",
    price: 65990.00,
    images: ["https://placehold.co/600x400?text=Tesla+Model+Y"],
    stock: 3
  },
  {
    title: "2023 BMW M3 Competition",
    description: "High-performance luxury sedan with 503 HP",
    price: 76990.00,
    images: ["https://placehold.co/600x400?text=BMW+M3"],
    stock: 2
  },
  {
    title: "2023 Toyota Camry Hybrid",
    description: "Efficient hybrid sedan with Toyota Safety Sense",
    price: 32990.00,
    images: ["https://placehold.co/600x400?text=Toyota+Camry"],
    stock: 5
  },
  {
    title: "2023 Porsche 911 GT3",
    description: "Track-focused sports car with naturally aspirated engine",
    price: 169990.00,
    images: ["https://placehold.co/600x400?text=Porsche+911"],
    stock: 1
  },
  {
    title: "2023 Range Rover Sport",
    description: "Luxury SUV with off-road capability",
    price: 83990.00,
    images: ["https://placehold.co/600x400?text=Range+Rover"],
    stock: 4
  }
];

const sampleSpareParts = [
  {
    title: "Bosch Brake Pads Set",
    description: "High-performance brake pads for luxury vehicles",
    price: 89.99,
    images: ["https://placehold.co/600x400?text=Brake+Pads"],
    stock: 50
  },
  {
    title: "NGK Spark Plugs (Set of 4)",
    description: "Iridium spark plugs for improved performance",
    price: 49.99,
    images: ["https://placehold.co/600x400?text=Spark+Plugs"],
    stock: 100
  },
  {
    title: "MAHLE Oil Filter",
    description: "Premium oil filter with anti-drain back valve",
    price: 19.99,
    images: ["https://placehold.co/600x400?text=Oil+Filter"],
    stock: 150
  },
  {
    title: "Continental Timing Belt Kit",
    description: "Complete timing belt kit with water pump",
    price: 199.99,
    images: ["https://placehold.co/600x400?text=Timing+Belt"],
    stock: 30
  },
  {
    title: "Bilstein B6 Shocks (Set)",
    description: "Performance shock absorbers for improved handling",
    price: 499.99,
    images: ["https://placehold.co/600x400?text=Shocks"],
    stock: 20
  }
];

async function addSampleData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      Electronic.deleteMany({}),
      Car.deleteMany({}),
      SparePart.deleteMany({})
    ]);
    console.log('Cleared existing data');

    // Add new sample data
    const [electronics, cars, spareParts] = await Promise.all([
      Electronic.insertMany(sampleElectronics),
      Car.insertMany(sampleCars),
      SparePart.insertMany(sampleSpareParts)
    ]);

    console.log('\nSample data added successfully:');
    console.log('Electronics:', electronics.length, 'items');
    console.log('Cars:', cars.length, 'items');
    console.log('Spare Parts:', spareParts.length, 'items');

    // Print some sample data
    console.log('\nSample Electronics:');
    electronics.slice(0, 2).forEach(item => {
      console.log(`- ${item.title}: $${item.price} (${item.stock} in stock)`);
    });

    console.log('\nSample Cars:');
    cars.slice(0, 2).forEach(item => {
      console.log(`- ${item.title}: $${item.price} (${item.stock} in stock)`);
    });

    console.log('\nSample Spare Parts:');
    spareParts.slice(0, 2).forEach(item => {
      console.log(`- ${item.title}: $${item.price} (${item.stock} in stock)`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run the script
addSampleData();
