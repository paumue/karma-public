/**
 * @module Avatars
 */

const express = require("express");
const router = express.Router();
const path = require('path');
const authAgent = require("../../modules/authentication/auth-agent");

const imgFetch = require("../picture/fetch-image");
const imgUpload = require("../picture/upload-image");
const imgDelete = require("../picture/delete-image");

/**
 * Handling for fetching, uploading and deleting pictures, e.g. event and profile photos (avatars)
 * */

/**
 * Endpoint called to upload & update profile pictures for an individual.
 * URL example: POST http://localhost:8000/avatars/upload/individual/5
 * The image will be resized to 500x500 automatically, and the URL added to the `picture` table.
 * Valid file types: jpg, jpeg, png
 * @param {userId} user ID for the individual
 * @param {Event} req multipart form-data with 'avatar' field as image file, e.g.:
 <pre><code>
    req.headers:
     - Host: localhost:8000
     - Content-Type: multipart/form-data; [NOTE: large files may also have a boundary]
     - Accept-Encoding: gzip, deflate, br
     - etc.

    req.body:
     - avatar: {...[IMAGE DATA], etc.}
 </pre></code>
 * @returns:
 * status: 200, description: The file was uploaded & database updated.
 * status: 400, description: Request was malformed, e.g. lacking correct field.
 * status: 500, description: Database or S3 Connection error
 *  @name Upload Profile Photo for Individual
 *  @function
 */
router.post("/upload/individual", authAgent.requireAuthentication, (req, res) => {
    imgUpload.updateAvatar(req, res, 'individual');
});

/**
 * Endpoint called to upload & update profile pictures for an organisation
 * URL example: POST http://localhost:8000/avatars/upload/organisation/5
 * The image will be resized to 500x500 automatically, and the URL added to the `picture` table.
 * Valid file types: jpg, jpeg, png
 * @param {userId} user ID for the organisation
 * @param {Event} req multipart form-data with 'avatar' field as image file, e.g.:
 <pre><code>
 req.headers:
 - Host: localhost:8000
 - Content-Type: multipart/form-data; [NOTE: large files may also have a boundary]
 - Accept-Encoding: gzip, deflate, br
 - etc.

 req.body:
 - avatar: {...[IMAGE DATA], etc.}
 </pre></code>
 * @returns:
 * status: 200, description: The file was uploaded & database updated.
 * status: 400, description: Request was malformed, e.g. lacking correct field.
 * status: 500, description: Database or S3 Connection error
 *  @name Upload Profile Photo for Organisation
 *  @function
 */
router.post("/upload/organisation", authAgent.requireAuthentication, (req, res) => {
    imgUpload.updateAvatar(req, res, 'organisation');
});

// == Profile Photo Deletion == //

router.get("/delete/individual", authAgent.requireAuthentication, (req, res) => {
    imgUpload.deleteAvatar(req, res, 'individual');
});

router.get("/delete/organisation", authAgent.requireAuthentication, (req, res) => {
    imgUpload.deleteAvatar(req, res, 'organisation');
});

// == Profile Photo Fetching == //

router.get("/default/individual", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../picture/avatars/individual/_default.png"));
});

router.get("/default/organisation", (req, res) => {
    res.sendFile(path.resolve(__dirname + "/../picture/avatars/organisation/_default.png"));
});

// Fetching profile avatar endpoints
router.get("/individual/:userId", imgFetch.getIndividualAvatar);
router.get("/organisation/:userId", imgFetch.getCompanyAvatar);

// TODO - add picture endpoint by picture ID

module.exports = router;
