<div>
    <label><?php echo elgg_echo("members:search"); ?></label>
    <?php echo elgg_view("input/text", [
        "name" => "q",
        "autofocus" => "autofocus",
        "value" => get_input("q", "")
    ]); ?>
</div>

<div>
    <?php echo elgg_view("input/submit", [
        "value" => elgg_echo("search")
    ]); ?>
</div>