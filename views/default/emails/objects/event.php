<?php
$entity = elgg_extract("entity", $vars);
?>
<!-- Blue section -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td class="pt-22" style="padding-top:16px">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="section" style="padding:24px 50px" bgcolor="#bfe7f8">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td class="h3" style="color:#01689b; font-family:Arial,sans-serif; font-size:22px; line-height:26px; text-align:left"><?php echo pleio_template_format_date($entity->start_day, "event"); ?></td>
                            </tr>
                            <tr>
                                <td class="h4" style="color:#01689b; font-family:Arial,sans-serif; font-size:24px; line-height:28px; text-align:left; font-weight:bold"><?php echo $entity->title; ?></td>
                            </tr>
                            <tr>
                                <td class="text-button" style="color:#009fe3; font-family:Arial,sans-serif; font-size:16px; line-height:20px; text-align:left; padding-top:24px">
                                    <a href="<?php echo $entity->getURL(); ?>" target="_blank" class="link-blue" style="color:#009fe3; text-decoration:none"><span class="link-blue" style="color:#009fe3; text-decoration:none">&gt; <?php echo elgg_echo("pleio_template:read_more"); ?></span></a>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<!-- END Blue section -->