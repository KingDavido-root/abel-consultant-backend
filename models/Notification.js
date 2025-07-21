const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['order', 'appointment', 'system', 'promotion', 'payment'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'low'
  },
  read: {
    type: Boolean,
    default: false
  },
  actionUrl: {
    type: String
  },
  relatedModel: {
    type: String,
    enum: ['Order', 'ServiceAppointment', 'PaymentMethod']
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'relatedModel'
  },
  expiresAt: {
    type: Date
  }
}, { timestamps: true });

// Index for efficient queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this({
    user: data.user,
    title: data.title,
    message: data.message,
    type: data.type,
    priority: data.priority || 'low',
    actionUrl: data.actionUrl,
    relatedModel: data.relatedModel,
    relatedId: data.relatedId,
    expiresAt: data.expiresAt
  });

  await notification.save();
  return notification;
};

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  this.read = true;
  await this.save();
  return this;
};

// Method to mark multiple notifications as read
notificationSchema.statics.markMultipleAsRead = async function(userId, notificationIds) {
  await this.updateMany(
    {
      user: userId,
      _id: { $in: notificationIds }
    },
    {
      $set: { read: true }
    }
  );
};

// Method to clear expired notifications
notificationSchema.statics.clearExpired = async function() {
  const result = await this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
  return result.deletedCount;
};

// Method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return await this.countDocuments({
    user: userId,
    read: false
  });
};

module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
