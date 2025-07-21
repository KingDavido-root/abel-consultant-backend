const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  moveToCart,
  checkWishlistItem
} = require('../controllers/wishlistController');

router.use(protect);

router.route('/')
  .get(getWishlist)
  .post(addToWishlist)
  .delete(clearWishlist);

router.route('/:productId')
  .delete(removeFromWishlist);

router.get('/check/:productId', checkWishlistItem);
router.post('/:productId/move-to-cart', moveToCart);

module.exports = router;
