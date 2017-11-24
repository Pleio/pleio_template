<?php
$user = elgg_extract("entity", $vars);

$categorized_fields = profile_manager_get_categorized_fields($user, true);
$fields = $categorized_fields["fields"];

foreach ($fields as $category_key => $category) {
    foreach ($fields[$category_key] as $field) {
        $shortname = $field->metadata_name;
        $valtype = $field->metadata_type;

        $metadata = elgg_get_metadata(array(
            'guid' => $user->guid,
            'metadata_name' => $shortname,
            'limit' => false
        ));
        if ($metadata) {
            if (is_array($metadata)) {
                $value = '';
                foreach ($metadata as $md) {
                    if (!empty($value)) {
                        $value .= ', ';
                    }
                    $value .= $md->value;
                    $access_id = $md->access_id;
                }
            } else {
                $value = $metadata->value;
                $access_id = $metadata->access_id;
            }
        } else {
            $value = '';
            $access_id = ACCESS_DEFAULT;
        }

        // sticky form values take precedence over saved ones
        if (isset($sticky_values[$shortname])) {
            $value = $sticky_values[$shortname];
        }
        if (isset($sticky_values['accesslevel'][$shortname])) {
            $access_id = $sticky_values['accesslevel'][$shortname];
        }

    ?>
    <div>
        <label><?php echo elgg_echo("profile:{$shortname}") ?></label>
        <?php
            $params = array(
                'name' => $shortname,
                'value' => $value,
                'options' => $field->getOptions()
            );
            echo elgg_view("input/{$valtype}", $params);
            $params = array(
                'name' => "accesslevel[$shortname]",
                'value' => $access_id,
            );
            echo elgg_view('input/access', $params);
        ?>
    </div>
    <?php
    }
}