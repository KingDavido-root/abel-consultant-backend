const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getUserPaymentMethods,
  addPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod
} = require('../controllers/paymentMethodController');

router.use(protect);

router.route('/')
  .get(getUserPaymentMethods)
  .post(addPaymentMethod);

router.route('/:id')
  .put(updatePaymentMethod)
  .delete(deletePaymentMethod);

router.put('/:id/default', setDefaultPaymentMethod);

module.exports = router;
