const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  getNotificationPreferences,
  updateNotificationPreferences
} = require('../controllers/notificationController');

router.use(protect);

router.route('/')
  .get(getUserNotifications);

router.route('/:id')
  .delete(deleteNotification);

router.put('/:id/read', markAsRead);
router.put('/mark-all-read', markAllAsRead);
router.delete('/clear-read', clearReadNotifications);

router.route('/preferences')
  .get(getNotificationPreferences)
  .put(updateNotificationPreferences);

module.exports = router;
