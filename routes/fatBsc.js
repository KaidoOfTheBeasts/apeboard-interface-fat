const express = require('express');
const router = express.Router();
const getInfo = require('../models/getInfo');
const farms = require('../config/constants/farms');

router.get('/:address', async function(req, res, next) {
  try {
    let address = req.params.address;
    if (address.length !== 42) {
      return res.status(500).send({
        message: "Internal server error",
        statusCode: 500,
      });
    }

    res.status(200).send({
      "farms": await getInfo.fetchFarms(farms, address.toLowerCase()),
      "boardroom": [],
      "vault": []
    });
  } catch (e) {
    res.status(500).send({
      message: "Internal server error",
      statusCode: 500,
    });
  }
});

module.exports = router;
