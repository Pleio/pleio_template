<?php
$result = get_data("show tables where 'elgg_notifications'");
if (count($result) === 0) {
    run_sql_script(dirname(__FILE__) . '/sql/notifications_table.sql');
}

$result = get_data("show tables where 'elgg_entity_views'");
if (count($result) === 0) {
    run_sql_script(dirname(__FILE__) . '/sql/views_table.sql');
}