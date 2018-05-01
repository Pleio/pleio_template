<?php
header("Content-type: text/html; charset=utf-8");
$lang = get_current_language();

$store = elgg_extract("store", $vars);
$metas = elgg_extract("metas", $vars, []);
$is_react = elgg_extract("is_react", $vars, false);

$settings = Pleio\Helpers::getSettings();

$theme = elgg_get_plugin_setting("theme", "pleio_template") ?: "leraar";
$font = elgg_get_plugin_setting("font", "pleio_template");

$icon = elgg_get_plugin_setting("icon", "pleio_template");

$custom_css = elgg_is_active_plugin("custom_css");
$custom_js = elgg_is_active_plugin("custom_js");

?>
<!DOCTYPE html>
<html lang="<?php echo $lang; ?>">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title><?php echo $vars["title"] ? $vars["title"] : elgg_get_config("sitename"); ?></title>
    <?php if ($icon && $icon == "rijkshuisstijl"): ?>
        <link rel="icon" href="<?php echo pleio_template_assets("images/favicon.png"); ?>">
        <link rel="shortcut icon" href="<?php echo pleio_template_assets("images/favicon.ico"); ?>">
        <link rel="apple-touch-icon-precomposed" href="<?php echo pleio_template_assets("images/apple-touch-icon-precomposed.png"); ?>">
    <?php endif; ?>
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width,height=device-height,user-scalable=no,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0">
    <meta name="version" content="1.0.0">
    <meta name="relative-path" content="">
    <?php foreach ($metas as $name => $content): ?><meta name="<?php echo $name; ?>" content="<?php echo $content; ?>">
    <?php endforeach; ?>

    <link href="<?php echo elgg_get_simplecache_url("css", "web"); ?>" rel="stylesheet" type="text/css">

    <?php if ($font): ?>
        <?php if ($font === "Roboto"): ?>
            <link href="https://fonts.googleapis.com/css?family=Roboto:400,700" rel="stylesheet">
        <?php elseif ($font === "Merriweather"): ?>
            <link href="https://fonts.googleapis.com/css?family=Merriweather:400,700" rel="stylesheet">
        <?php elseif ($font === "Open Sans"): ?>
            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700" rel="stylesheet">
        <?php endif; ?>
    <?php endif; ?>

    <?php if ($custom_css): ?>
        <link href="<?php echo elgg_get_simplecache_url("css", "custom"); ?>" rel="stylesheet" type="text/css">
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
    <?php if ($settings): ?>
        <script>
            window.__SETTINGS__ = <?php echo json_encode($settings); ?>;
        </script>
    <?php endif; ?>

    <script src="https://cdn.polyfill.io/v2/polyfill.min.js?features=default,Symbol.iterator,Array.prototype.includes,Array.prototype.fill,Array.prototype.find,String.prototype.repeat"></script>
    <?php if ($is_react): ?>
        <?php if (webpack_dev_server_is_available()): ?>
            <script src="http://localhost:9001/mod/pleio_template/build/vendor.js"></script>
            <script src="http://localhost:9001/mod/pleio_template/build/web.js"></script>
        <?php else: ?>
            <script src="/mod/pleio_template/build/vendor.js?v=<?php echo $CONFIG->lastcache; ?>"></script>
            <script src="/mod/pleio_template/build/web.js?v=<?php echo $CONFIG->lastcache; ?>"></script>
        <?php endif; ?>
    <?php endif; ?>

    <?php if ($custom_js): ?>
        <script src="<?php echo elgg_get_simplecache_url("js", "custom"); ?>"></script>
    <?php endif; ?>

    <?php echo elgg_view("page/elements/analytics"); ?>
</body>
</html>