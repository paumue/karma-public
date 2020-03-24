/**
 * @module Notification
 */
const log = require("../../util/log");
const express = require("express");
const router = express.Router();
const notificationService = require("../../modules/notification");
const validation = require("../../modules/validation");
const authAgent = require("../../modules/authentication/auth-agent");
const httpUtil = require("../../util/httpUtil");

/**
 * Endpoint called whenever a user sends a new notification.<br/>
 * URL example: POST http://localhost:8000/notification/
 <p><b>Route: </b>/notification (POST)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {Notification} req.body - Information regarding the notification containing the same properties as this example,
 * including user IDs:
 <pre>
 {
    "type": "Cancellation",
    "message": "This event is cancelled thanks",
    "senderId": 1,
    "receiverIds": [1,2,3,4,5]
 }
 </pre>
 * @returns {Object}
 *  status: 200, description: The notification object created with its id.<br/>
 *  status: 400, description: The notification object was not in the right format.
 *  status: 500, description: DB error
 *   <pre>
 {
    "message": "Notification created successfully.",
    "data": {
        notifications:
            {
                "id": 91,
                "type": "Cancellation",
                "message": "This event is cancelled thanks",
                "timestampSent": "2020-03-19T21:56:14.862Z",
                "senderId": 1,
                "receiverId": 1
            },
            {
                "id": 89,
                "type": "Cancellation",
                "message": "This event is cancelled thanks",
                "timestampSent": "2020-03-19T21:56:14.862Z",
                "receiverId": 2
            }
    }
 }
 </pre>
 *  @name Create new notifications
 *  @function
 */
router.post("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        log.info("Creating new notification");
        const notification = req.body;
        notification.senderId = req.body.userId;
        const validationResult = validation.validateNotification(notification);
        if (validationResult.errors.length !== 0) {
            res.status(400).send({
                message: "Notification is not in right format",
                errors: validationResult.errors,
            });
            return;
        }
        const notificationResult = await notificationService.createNotifications(notification);
        return httpUtil.sendResult(notificationResult, res);
    } catch (e) {
        log.error("Notification creation failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

/**
 * Endpoint called whenever a user wants to see all current notifications for a UserId.<br/>
 * URL example: GET http://localhost:8000/notification?userId=6
 * // TODO: change not to use query params
 <p><b>Route: </b>/notification (GET)</p>
 <p><b>Permissions: </b>require user permissions</p>
 * @param {Number} req.query.userId - ID of user
 * @returns {Object}
 *  status: 200, description: An array of notification objects containing the userIds.<br/>
 *  status: 400, description: The userId is not an integer.
 *  status: 500, description: DB error
 *<pre>
   {
    "message": "Notifications fetched successfully.",
    "data": {
        "notifications": {
            "notification": {
            "id": 1,
            "type": "Cancel",
            "message": "This is a message.",
            "timestampSent": "2019-02-02 00:00:00"
            "senderId": 1,
            "receiverId": 2
            }
        }
    }
 }
 </pre>
 *  @name Get notifications
 *  @function
 */
router.get("/", authAgent.requireAuthentication, async (req, res) => {
    try {
        const id = req.query.userId;
        log.info("Getting notifications for user id '%d'", id);
        if (Number.isInteger(id)) {
            return res.status(400).send({message: "ID is not a number."});
        }

        const notificationResult = await notificationService.getNotification(id);
        return httpUtil.sendResult(notificationResult, res);
    } catch (e) {
        log.error("Fetching Notifications failed: " + e);
        return httpUtil.sendGenericError(e, res);
    }
});

module.exports = router;
