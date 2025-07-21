const mongoose = require('mongoose');

const serviceAppointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  service: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  notes: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  vehicle: {
    make: String,
    model: String,
    year: Number,
    vin: String
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address'
  },
  paymentMethod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentMethod'
  },
  serviceType: {
    type: String,
    enum: ['Maintenance', 'Repair', 'Inspection', 'Detailing', 'Installation'],
    required: true
  }
}, { timestamps: true });

// Add index for efficient date-based queries
serviceAppointmentSchema.index({ date: 1, status: 1 });

// Method to check if the appointment time slot is available
serviceAppointmentSchema.statics.isTimeSlotAvailable = async function(date, time, duration) {
  const startTime = new Date(`${date.toDateString()} ${time}`);
  const endTime = new Date(startTime.getTime() + duration * 60000);

  const conflictingAppointments = await this.find({
    date: date,
    status: { $ne: 'Cancelled' },
    $or: [
      {
        $and: [
          { time: { $lte: time } },
          {
            $expr: {
              $gt: {
                $add: [
                  { $multiply: ['$duration', 60000] },
                  { $dateFromString: { dateString: { $concat: [{ $dateToString: { date: '$date', format: '%Y-%m-%d' } }, ' ', '$time'] } } }
                ]
              }
            }
          }
        ]
      },
      {
        time: {
          $gte: time,
          $lt: endTime.toTimeString().split(' ')[0]
        }
      }
    ]
  });

  return conflictingAppointments.length === 0;
};

// Method to get available time slots for a given date
serviceAppointmentSchema.statics.getAvailableTimeSlots = async function(date, duration) {
  const businessHours = {
    start: '09:00',
    end: '17:00'
  };

  const timeSlots = [];
  let currentTime = new Date(`${date.toDateString()} ${businessHours.start}`);
  const endTime = new Date(`${date.toDateString()} ${businessHours.end}`);

  while (currentTime < endTime) {
    const timeString = currentTime.toTimeString().split(' ')[0].substring(0, 5);
    if (await this.isTimeSlotAvailable(date, timeString, duration)) {
      timeSlots.push(timeString);
    }
    currentTime = new Date(currentTime.getTime() + 30 * 60000); // 30-minute intervals
  }

  return timeSlots;
};

module.exports = mongoose.models.ServiceAppointment || mongoose.model('ServiceAppointment', serviceAppointmentSchema);
