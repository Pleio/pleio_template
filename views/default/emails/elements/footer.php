<?php
$site = elgg_get_site_entity();
?>
<!-- Footer -->
<table width="100%" border="0" cellspacing="0" cellpadding="0" style="padding:16px 0 3px 0;">
    <tr>
        <td class="footer" style="padding:26px 50px" bgcolor="#01689b">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td class="footer-title" style="color:#ffffff; font-family:Arial,sans-serif; font-size:24px; line-height:28px; text-align:left; font-weight:bold; padding-bottom:17px">
                        <?php echo elgg_echo("pleio_template:email:visit", [ $site->name ]); ?>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table width="100%" border="0" cellspacing="0" cellpadding="0">
                            <tr>
                                <td align="left">
                                    <table border="0" cellspacing="0" cellpadding="0">
                                        <tr>
                                            <td style="border-radius: 5px;" bgcolor="#009fe3">
                                                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                                    <tr>
                                                        <td class="text-button2" style="color:#ffffff; font-family:Arial,sans-serif; font-size:16px; line-height:20px; text-align:center; padding:11px 18px">
                                                            <a href="<?php echo $site->url; ?>" target="_blank" class="link-white" style="color:#ffffff; text-decoration:none"><span class="link-white" style="color:#ffffff; text-decoration:none">
                                                                <?php echo elgg_echo("pleio_template:email:goto", [ $site->name ]); ?>
                                                            </span></a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>
<!-- END Footer -->
