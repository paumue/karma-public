/**
 * @module Causes
 */

const express = require('express');
const router = express.Router();
const causeRepository = require("../models/causeRepository");

/**
 * Gets all causes.<br/>
 * URL example: GET http://localhost:8000/causes
 * @returns
 *  status: 200, description: Array of all cause objects<br/>
 *  status: 500, description: Most probably a database error occured
 *  @name Get all causes
 *  @function
 */
router.get('/', (req, res) => {
    causeRepository.findAll()
        .then(result => res.status(200).json(result.rows))
        .catch(err => res.status(500).send(err));
});

/**
 * Gets a cause specified by id.<br/>
 * URL example: GET http://localhost:8000/causes/3
 * @param {integer} req.params.id - ID of the cause required
 * @returns
 *  status: 200, description: cause object with given id <br/>
 *  status: 400, description: if ID param is not specified or in wrong format/NaN <br/>
 *  status: 404, description: no cause was found in DB with ID <br/>
 *  status: 500, description: Most probably a database error occured
 *  @name Get by ID
 *  @function
 */
router.get('/:id', (req, res) => {
    const id = req.params.id;
    if (!id) return res.status(400).send("No id was specified");
    if (isNaN(id)) return res.status(400).send("ID specified is in wrong format");
    causeRepository.findById(id)
        .then(result => {
            if (result.rows.length === 0) return res.status(404).send("No cause with given id");
            res.status(200).json(result.rows);
        })
        .catch(err => res.status(500).send(err));
});


module.exports = router;
