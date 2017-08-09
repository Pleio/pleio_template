<?php
if (webpack_dev_server_is_available()) {
    $path = "http://localhost:9001/";
} else {
    $path = elgg_get_site_url();
}

$path .= "mod/pleio_template/build/vendor.js";

echo file_get_contents($path);