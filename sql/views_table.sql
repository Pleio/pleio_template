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