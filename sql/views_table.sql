CREATE TABLE IF NOT EXISTS elgg_entity_views (
    `guid` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
    `type` enum('object','user','group','site') NOT NULL,
    `subtype` INT(11) DEFAULT NULL,
    `container_guid` BIGINT(20) unsigned NOT NULL,
    `site_guid` BIGINT(20) unsigned NOT NULL,
    `views` INT(11),
    PRIMARY KEY (`guid`),
    KEY `type_subtype` (`type`, `subtype`),
    KEY `container_guid` (`container_guid`),
    KEY `site_guid` (`site_guid`),
    KEY `views` (`views`)
);

CREATE TABLE IF NOT EXISTS elgg_entity_views_log (
    `id` BIGINT(20) unsigned NOT NULL AUTO_INCREMENT,
    `entity_guid` BIGINT(20) unsigned NOT NULL,
    `type` enum('object','user','group','site') NOT NULL,
    `subtype` INT(11) DEFAULT NULL,
    `container_guid` BIGINT(20) unsigned NOT NULL,
    `site_guid` BIGINT(20) unsigned NOT NULL,
    `performed_by_guid` BIGINT(20) unsigned NOT NULL,
    `time_created` INT(11) NOT NULL,
    PRIMARY KEY (`id`),
    KEY `type_subtype` (`type`, `subtype`),
    KEY `performed_by_guid` (`performed_by_guid`),
    KEY `time_created` (`time_created`),
    KEY `site_guid` (`site_guid`)
);