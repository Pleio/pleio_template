CREATE TABLE IF NOT EXISTS elgg_notifications (
    `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
    `user_guid` BIGINT(20) unsigned NOT NULL,
    `action` VARCHAR(60) DEFAULT NULL,
    `performer_guid` BIGINT(20) unsigned NOT NULL,
    `entity_guid` BIGINT(20) unsigned NOT NULL,
    `container_guid` BIGINT(20) unsigned NOT NULL,
    `unread`  ENUM('yes', 'no') DEFAULT 'yes',
    `site_guid` BIGINT(20) unsigned NOT NULL,
    `time_created` INT(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `user_guid` (`user_guid`, `site_guid`),
    KEY `unread` (`unread`)
);