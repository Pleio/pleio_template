<?php
header("Content-type: text/html; charset=utf-8");
$lang = get_current_language();
$store = elgg_extract("store", $vars);
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
    <link href="/mod/pleio_template/build/web.css?v=<?php echo $CONFIG->lastcache; ?>" rel="stylesheet" type="text/css">
</head>
<body class="___leraar">
    <div id="react-root" class="page-layout"><?php echo elgg_extract('body', $vars, ''); ?></div>
    <?php if ($store): ?>
        <script>
            window.__STORE__ = <?php echo json_encode($store); ?>;
        </script>
    <?php endif; ?>
    <script src="/mod/pleio_template/build/web.js?v=<?php echo $CONFIG->lastcache; ?>"></script>
</body>
</html>