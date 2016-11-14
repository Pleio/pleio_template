<?php
$site = elgg_get_site_entity();
elgg_set_page_owner_guid($site->guid);

$title = $site->title;

$isomorphic = elgg_get_plugin_setting("isomorphic", "pleio_template");
if ($isomorphic === "yes") {
    $cmd = "/usr/local/bin/node " . dirname(dirname(__FILE__)) . "/.babel/RunServer.js";

    $desc = array(
        0 => array("pipe", "r"),
        1 => array("pipe", "w"),
        2 => array("pipe", "r")
    );

    $p = proc_open($cmd, $desc, $pipes);

    $input = json_encode([
        "url" => $_SERVER["REQUEST_URI"],
        "site" => $site->url,
        "cookies" => [
            "Elgg" => $_COOKIE["Elgg"]
        ]
    ]);

    fwrite($pipes[0], $input);
    fclose($pipes[0]);

    $output = stream_get_contents($pipes[1]);
    $errors = stream_get_contents($pipes[2]);

    fclose($pipes[1]);
    fclose($pipes[2]);
    $flag = proc_close($p);

    if ($output) {
        $output = json_decode($output);
    }

    $content = "";
    if ($output->content) {
        $content = $output->content;
    }

    unset($output->store->apollo->queries);
    $store = $output->store;
} else {
    $content = "";
    $store = null;
}

echo elgg_view_page($title, $content, "default", [
    "store" => $store
]);
