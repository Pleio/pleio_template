<?php
header("Content-type: text/html; charset=utf-8");
$lang = get_current_language();

$store = elgg_extract("store", $vars);
$metas = elgg_extract("metas", $vars);

if (webpack_dev_server_is_available()) {
    $path = "http://localhost:9001/";
} else {
    $path = "/";
}

$path .= "mod/pleio_template/build/";

$theme = elgg_get_plugin_setting("theme", "pleio_template", "leraar");

$custom_css = elgg_is_active_plugin("custom_css");
$custom_js = elgg_is_active_plugin("custom_js");

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php echo $vars["title"] ? $vars["title"] : elgg_get_config("sitename"); ?></title>
    <link rel="icon" href="<?php echo pleio_template_assets("images/favicon.png"); ?>">
    <link rel="shortcut icon" href="<?php echo pleio_template_assets("images/favicon.ico"); ?>">
    <link rel="apple-touch-icon-precomposed" href="<?php echo pleio_template_assets("images/apple-touch-icon-precomposed.png"); ?>">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width,height=device-height,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="version" content="1.0.0">
    <meta name="relative-path" content="">
    <?php foreach ($metas as $name => $content): ?><meta name="<?php echo $name; ?>" content="<?php echo $content; ?>">
    <?php endforeach; ?>

    <link href="<?php echo $path; ?>web.css?v=<?php echo $CONFIG->lastcache; ?>" rel="stylesheet" type="text/css">

    <?php if ($custom_css): ?>
        <link href="/css/custom.css?v=<?php echo $CONFIG->lastcache; ?>" rel="stylesheet" type="text/css">
    <?php endif; ?>
</head>
<body class="___<?php echo $theme; ?>">
    <?php echo elgg_view("page/elements/noscript"); ?>
    <div id="react-root" class="page-container"><?php echo elgg_extract('body', $vars, ''); ?></div>
    <?php if ($store): ?>
        <script>
            window.__STORE__ = <?php echo json_encode($store); ?>;
        </script>
    <?php endif; ?>
    <script src="<?php echo $path; ?>vendor.js?v=<?php echo $CONFIG->lastcache; ?>"></script>
    <script src="<?php echo $path; ?>web.js?v=<?php echo $CONFIG->lastcache; ?>"></script>

    <?php if ($custom_js): ?>
        <script src="/js/custom.js?v=<?php echo $CONFIG->lastcache; ?>"></script>
    <?php endif; ?>

    <?php echo elgg_view("page/elements/analytics"); ?>
</body>
</html>