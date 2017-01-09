<div>
    <label><?php echo elgg_echo("pleio_template:google_analytics"); ?></label>
    <?php echo elgg_view("input/text", [
        "name" => "params[google_analytics]",
        "value" => $vars["plugin"]->google_analytics
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:piwik"); ?></label>
    <?php echo elgg_view("input/text", [
        "name" => "params[piwik]",
        "value" => $vars["plugin"]->piwik
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:sentry"); ?></label>
    <?php echo elgg_view("input/text", [
        "name" => "params[sentry]",
        "value" => $vars["plugin"]->sentry
    ]); ?>
</div>