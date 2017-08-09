<?php
$result = elgg_get_plugin_setting("custom_css", "custom_css");

if (!empty($result)) {
    echo $result;
}