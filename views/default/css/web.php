<?php
if (webpack_dev_server_is_available()) {
    $path = "http://localhost:9001/";
} else {
    $path = elgg_get_site_url();
}

$path .= "mod/pleio_template/build/web.css";

$contents = file_get_contents($path);

$primary = elgg_get_plugin_setting("color_primary", "pleio_template");
if ($primary) {
    $contents = str_replace("#01689b", $primary, $contents);

    // --light
    $contents = str_replace("#3887ad", Pleio\Color::tint($primary, 0.6), $contents);
}

$secondary = elgg_get_plugin_setting("color_secondary", "pleio_template");
if ($secondary) {
    $contents = str_replace("#009ee3", $secondary, $contents);

    // --light
    $contents = str_replace("#99d8f4", Pleio\Color::tint($secondary, 0.6), $contents);

    // --lighter
    $contents = str_replace("#bfe7f8", Pleio\Color::tint($secondary, 0.75), $contents);

    // --lightest
    $contents = str_replace("#e6f5fc", Pleio\Color::tint($secondary, 0.9), $contents);

    // --bright
    $contents = str_replace("#f2fafe", Pleio\Color::tint($secondary, 0.95), $contents);
}

$tertiary = elgg_get_plugin_setting("color_tertiary", "pleio_template");
if ($tertiary) {
    $contents = str_replace("#00c6ff", $tertiary, $contents);
}

$quaternary = elgg_get_plugin_setting("color_quaternary", "pleio_template");
if ($quaternary) {
    $contents = str_replace("#154273", $quaternary, $contents);
}

echo $contents;