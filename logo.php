<?php
require_once(dirname(dirname(dirname(__FILE__))) . "/engine/start.php");

$site = elgg_get_site_entity();

// If is the same ETag, content didn't changed.
$etag = $site->logotime . $site->guid;
if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) == "\"$etag\"") {
    header("HTTP/1.1 304 Not Modified");
    exit;
}

$success = false;

$filehandler = new ElggFile();
$filehandler->owner_guid = $site->guid;
$filehandler->setFilename("pleio_template/" . $site->guid . "_logo.jpg");

$success = false;
if ($filehandler->open("read")) {
    if ($contents = $filehandler->read($filehandler->size())) {
        $success = true;
    }
}

if (!$success) {
    header("Location: /mod/pleio_template/src/images/logo.png");
    exit();
}

header("Content-type: image/jpeg");
header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', strtotime("+10 days")), true);
header("Pragma: public");
header("Cache-Control: public");
header("Content-Length: " . strlen($contents));
header("ETag: \"$etag\"");
echo $contents;
