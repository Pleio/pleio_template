<?php
$site = elgg_get_site_entity();
?>
<!-- Intro text -->
<tr>
    <td class="intro" style="color:#ffffff; font-family:Arial,sans-serif; font-size:18px; line-height:22px; text-align:left; padding:27px 50px" bgcolor="#3486af">
        <?php echo elgg_echo("pleio_template:email:overview", [ $site->name ]); ?>
    </td>
</tr>
<!-- END Intro text -->
