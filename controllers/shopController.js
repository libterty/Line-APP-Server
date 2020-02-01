const Shop = require('../database/models/shop');

const shopController = {
  getShops: async (req, res) => {
    const shops = await Shop.find();
    return res.status(200).json({ status: 'success', shops });
  },

  postShops: async (req, res) => {
    const { shopName, shopAddress, shopTel, representative } = req.body;
    if (!shopName || !shopAddress || !shopTel || !representative) {
      return res.status(400).json({
        status: 'error',
        message: "required fields didn't exist"
      });
    }
    const isExist = await Shop.findOne({ shopName });

    if (isExist) {
      return res.status(400).json({
        status: 'error',
        message: 'Shop already exist'
      });
    } else {
      await new Shop({ shopName, shopAddress, shopTel, representative }).save();
      return res
        .status(200)
        .json({ status: 'success', message: 'Create Shop Success' });
    }
  },

  putShop: async (req, res) => {
    const { shopName, shopAddress, shopTel, representative } = req.body;

    const isExist = await Shop.findOne({ shopName });
    if (isExist) {
      return res.status(400).json({
        status: 'error',
        message: 'Shop already exist'
      });
    } else {
      try {
        await Shop.findById(req.params.shopId).then(shop => {
          shop
            .updateOne({
              shopName: shopName ? shopName : shop.shopName,
              shopAddress: shopAddress ? shopAddress : shop.shopAddress,
              shopTel: shopTel ? shopTel : shop.shopTel,
              representative: representative
                ? representative
                : shop.representative
            })
            .then(shop => {
              return res.status(200).json({
                status: 'success',
                message: 'Update Shop Info Success'
              });
            })
            .catch(err => {
              throw new Error(err);
            });
        });
      } catch (error) {
        return res.status(400).json({
          status: 'error',
          message: error.message
        });
      }
    }
  },

  deleteShop: async (req, res) => {
    try {
      await Shop.findById(req.params.shopId).then(shop => {
        shop.remove(() => {
          return res.status(200).json({
            status: 'success',
            message: 'Delete Shop Info Success'
          });
        });
      });
    } catch (error) {
      return res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = shopController;
