<div>
    <label><?php echo elgg_echo("pleio_template:show_logo"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[show_logo]",
        "value" => $vars["plugin"]->show_logo,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:show_leader"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[show_leader]",
        "value" => $vars["plugin"]->show_leader,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:show_initiative_widget"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[show_initiative_widget]",
        "value" => $vars["plugin"]->show_initiative_widget,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>
