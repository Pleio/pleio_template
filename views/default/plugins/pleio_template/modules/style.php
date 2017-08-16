<div>
    <label><?php echo elgg_echo("pleio_template:font"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[font]",
        "options" => ["Rijksoverheid Sans", "Roboto", "Merriweather", "Arial", "Open Sans"],
        "value" => $vars["plugin"]->font
    ]); ?>
</div>

<div id="pleio-template-admin-colors"></div>
