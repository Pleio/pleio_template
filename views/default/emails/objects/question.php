<?php
$site = elgg_get_site_entity();
$entity = elgg_extract("entity", $vars);
$owner = $entity->getOwnerEntity();
?>
<!-- Article -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td class="article2" style="padding:16px 0 0 0;">
            <!-- Full width image -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="pl-52" style="padding-left:47px; padding-top: 26px; font-size:0pt; line-height:0pt; text-align:left; background: #ffffff;"><img src="<?php echo $site->url; ?>mod/pleio_template/src/images/ico-forum.jpg" border="0" width="53" height="53" alt="" /></td>
                </tr>
            </table>
            <!-- END Full width image -->

            <!-- Content -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="article-body3" style="padding:16px 66px 29px 49px; background: #ffffff;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td class="h1" style="color:#01689b; font-family:Arial,sans-serif; font-size:24px; line-height:28px; text-align:left; padding-bottom:12px; font-weight:bold"><?php echo $entity->title; ?></td>
                            </tr>
                            <tr>
                                <td class="h2" style="color:#999999; font-family:Arial,sans-serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:4px">Forum, <?php echo $owner->name; ?>, <?php echo pleio_template_format_date($entity->time_created); ?></td>
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
            <!-- END Content -->
        </td>
    </tr>
</table>
<!-- END Article -->