<div>
    <label><?php echo elgg_echo("pleio_template:theme"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[theme]",
        "value" => $vars["plugin"]->theme,
        "options_values" => [
            "leraar" => elgg_echo("pleio_template:minimalistic"),
            "rijkshuisstijl" => elgg_echo("pleio_template:rijkshuisstijl")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:startpage"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[startpage]",
        "value" => $vars["plugin"]->startpage,
        "options_values" => [
            "activity" => elgg_echo("pleio_template:activity"),
            "cms" => elgg_echo("pleio_template:cms")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:startpage:cms"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[startpage_cms]",
        "value" => $vars["plugin"]->startpage_cms,
        "options_values" => pleio_template_get_cms_pages()
    ]); ?>
</div>

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
    <label><?php echo elgg_echo("pleio_template:show_leader_buttons"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[show_leader_buttons]",
        "value" => $vars["plugin"]->show_leader_buttons,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:subtitle"); ?></label>
    <?php echo elgg_view("input/text", [
        "name" => "params[subtitle]",
        "value" => $vars["plugin"]->subtitle,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:leader_image"); ?></label>
    <?php echo elgg_view("input/text", [
        "name" => "params[leader_image]",
        "value" => $vars["plugin"]->leader_image,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:show_initiative"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[show_initiative]",
        "value" => $vars["plugin"]->show_initiative,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>

<div>
    <label><?php echo elgg_echo("pleio_template:advanced_permissions"); ?></label>
    <?php echo elgg_view("input/dropdown", [
        "name" => "params[advanced_permissions]",
        "value" => $vars["plugin"]->advanced_permissions,
        "options_values" => [
            "no" => elgg_echo("option:no"),
            "yes" => elgg_echo("option:yes")
        ]
    ]); ?>
</div>
