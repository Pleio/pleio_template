<?php
/**
 * Elgg profile icon cache/bypass
 *
 *
 * @package ElggProfile
 */

// Get DB settings
require_once(dirname(dirname(dirname(__FILE__))). '/engine/settings.php');

global $CONFIG;

// won't be able to serve anything if no joindate or guid
if (!isset($_GET['guid'])) {
    header("HTTP/1.1 404 Not Found");
    exit;
}

$last_cache = (int)$_GET['lastcache'];
$guid = (int)$_GET['guid'];

// If is the same ETag, content didn't changed.
$etag = $last_cache . $guid;
if (isset($_SERVER['HTTP_IF_NONE_MATCH']) && trim($_SERVER['HTTP_IF_NONE_MATCH']) == "\"$etag\"") {
    header("HTTP/1.1 304 Not Modified");
    exit;
}

$mysql_dblink = @mysqli_connect($CONFIG->dbhost, $CONFIG->dbuser, $CONFIG->dbpass, $CONFIG->dbname);
if ($mysql_dblink) {
    $result = mysqli_query($mysql_dblink, "select name, value from {$CONFIG->dbprefix}datalists where name='dataroot'");
    if ($result) {
        $row = mysqli_fetch_object($result);
        while ($row) {
            if ($row->name == 'dataroot') {
                $data_root = $row->value;
            }
            $row = mysqli_fetch_object($result);
        }
    }

    // this depends on ElggDiskFilestore::makeFileMatrix()
    $result = mysqli_query($mysql_dblink, "select time_created from {$CONFIG->dbprefix}entities where guid={$guid}");
    if ($result) {
        $row = mysqli_fetch_object($result);
        if ($row) {
            $time_created = $row->time_created;
        }
    }

    @mysqli_close($mysql_dblink);

    if (!$time_created) {
        header("HTTP/1.1 404 Not Found");
        exit;
    }

    $path = date('Y/m/d/', $time_created) . $guid;

    if (!$data_root) {
        $data_root = $CONFIG->dataroot;
    }

    $filename = "$data_root$path/featured/{$guid}.jpg";
    $filesize = @filesize($filename);
    if ($filesize) {
        header("Content-type: image/jpeg");
        header('Expires: ' . gmdate('D, d M Y H:i:s \G\M\T', strtotime("+6 months")), true);
        header("Pragma: public");
        header("Cache-Control: public");
        header("Content-Length: $filesize");
        header("ETag: \"$etag\"");
        readfile($filename);
        exit;
    }
}

// something went wrong so load engine and try to forward to default icon
require_once(dirname(dirname(dirname(__FILE__))) . "/engine/start.php");
elgg_log("Profile icon direct failed.", "WARNING");
