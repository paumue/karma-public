const express = require("express");
const router = express.Router();
const stripeVerification = require("../../verification/stripe");


router.post('/create', (req, res) => {
    try {
        stripeVerification.uploadFile(req.user.id);
        res.status(200).send({message: "Document uploaded for verification."});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

router.post('/check', (req, res) => {
    try {
        stripeVerification.updateAccount(req.user.id);
        res.status(200).send({message: "Identity verified."});
    } catch (e) {
        res.status(400).send({message: e.message});
    }
});

module.exports = router;
