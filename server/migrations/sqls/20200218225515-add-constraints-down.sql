-- Last modification date: 2020-02-20 17:21:03.854

-- foreign keys
ALTER TABLE authentication
    DROP CONSTRAINT authentication_user;

ALTER TABLE complaint
    DROP CONSTRAINT complaint_user;

ALTER TABLE event
    DROP CONSTRAINT event_address;

ALTER TABLE event
    DROP CONSTRAINT event_user;

ALTER TABLE event
    DROP CONSTRAINT event_picture;

ALTER TABLE event_cause
    DROP CONSTRAINT eventcause_cause;

ALTER TABLE event_cause
    DROP CONSTRAINT eventcause_event;

ALTER TABLE favourite
    DROP CONSTRAINT favourite_event;

ALTER TABLE favourite
    DROP CONSTRAINT favourite_individual;

ALTER TABLE individual
    DROP CONSTRAINT individual_address;

ALTER TABLE individual
    DROP CONSTRAINT individual_picture;

ALTER TABLE individual
    DROP CONSTRAINT individual_user;

ALTER TABLE notification
    DROP CONSTRAINT notification_user_receiver;

ALTER TABLE notification
    DROP CONSTRAINT notification_user_sender;

ALTER TABLE organisation
    DROP CONSTRAINT organisation_address;

ALTER TABLE organisation
    DROP CONSTRAINT organisation_picture;

ALTER TABLE organisation
    DROP CONSTRAINT organisation_user;

ALTER TABLE profile
    DROP CONSTRAINT profile_individual;

ALTER TABLE report_user
    DROP CONSTRAINT report_user_reported;

ALTER TABLE report_user
    DROP CONSTRAINT report_user_reporting;

ALTER TABLE reset
    DROP CONSTRAINT reset_user;

ALTER TABLE selected_cause
    DROP CONSTRAINT selectedcause_cause;

ALTER TABLE selected_cause
    DROP CONSTRAINT selectedcause_user;

ALTER TABLE sign_up
    DROP CONSTRAINT signup_event;

ALTER TABLE sign_up
    DROP CONSTRAINT signup_individual;

ALTER TABLE "user"
    DROP CONSTRAINT user_registration;

ALTER TABLE setting
    DROP CONSTRAINT user_settings;
