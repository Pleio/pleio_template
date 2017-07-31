<?php
$site = elgg_get_site_entity();
$entity = elgg_extract("entity", $vars);
$friendly_title = elgg_get_friendly_title($entity->title);
$url = "{$site->url}news/view/{$entity->guid}/{$friendly_title}";
?>
<!-- Article -->
<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
        <td class="article" style="padding:16px 0 3px 0">
            <!-- Full width image -->
            <?php if ($entity->featuredIcontime): ?>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="fluid-img" style="font-size:0pt; line-height:0pt; text-align:left"><img src="<?php echo $site->url; ?>mod/pleio_template/featuredimage.php?guid=<?php echo $entity->guid; ?>&email=true" border="0" width="600" height="161" alt="<?php echo $entity->title; ?>" /></td>
                    </tr>
                </table>
            <?php else: ?>
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td class="banner" style="padding:17px 10px; font-size:0pt; line-height:0pt; text-align:center" bgcolor="#ffb612">
                            <img src="" border="0" width="48" height="67" alt="" />
                        </td>
                    </tr>
                </table>
            <?php endif; ?>
            <!-- END Full width image -->

            <!-- Content -->
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td style="border-left: 4px solid #00c6ff;">
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td class="article-body" style="padding:26px 66px 29px 46px; background:#ffffff">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td class="h2" style="color:#999999; font-family:Arial,sans-serif; font-size:14px; line-height:18px; text-align:left; padding-bottom:4px">Nieuws, <?php echo pleio_template_format_date($entity->time_created); ?></td>
                                        </tr>
                                        <tr>
                                            <td class="h1" style="color:#01689b; font-family:Arial,sans-serif; font-size:24px; line-height:28px; text-align:left; padding-bottom:12px; font-weight:bold"><?php echo $entity->title; ?></td>
                                        </tr>
                                        <tr>
                                            <td class="text" style="color:#000001; font-family:Arial,sans-serif; font-size:16px; line-height:20px; text-align:left">
                                                <?php echo elgg_get_excerpt($entity->description); ?>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td class="text-button" style="color:#009fe3; font-family:Arial,sans-serif; font-size:16px; line-height:20px; text-align:left; padding-top:24px">
                                                <a href="<?php echo $url; ?>" target="_blank" class="link-blue" style="color:#009fe3; text-decoration:none"><span class="link-blue" style="color:#009fe3; text-decoration:none">&gt; <?php echo elgg_echo("pleio_template:read_more"); ?></span></a>
                                            </td>
                                        </tr>
                                    </table>
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