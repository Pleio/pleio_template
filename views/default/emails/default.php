<?php
$site = elgg_get_site_entity();

$subject = elgg_extract("subject", $vars);
$overview = elgg_extract("overview", $vars);
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <!--[if gte mso 9]>
    <xml>
        <o:OfficeDocumentSettings>
        <o:AllowPNG/>
        <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
    </xml>
    <![endif]-->
    <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="format-detection" content="date=no" />
    <meta name="format-detection" content="address=no" />
    <meta name="format-detection" content="telephone=no" />
    <title><?php echo $subject; ?></title>

    <style type="text/css" media="screen">
        /* Linked Styles */
        body { padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#ffffff; -webkit-text-size-adjust:none }
        a { color:#009ee3; text-decoration:underline }
        .header a { color:#ffffff; text-decoration:none }
        .footer-title a { color:#ffffff; text-decoration:none }
        .intro a { color:#ffffff; text-decoration:none }
        .text-button2 a { color:#ffffff; text-decoration:none }
        .text-button a { color:#009fe3; text-decoration:none }
        .pre-header a { color:#999999; text-decoration:none }

        .h3 a { color: #01689b; text-decoration: none; }

        p { padding:0 !important; margin:0 !important }
        img { -ms-interpolation-mode: bicubic; /* Allow smoother rendering of resized image in Internet Explorer */ }

        .fluid-img img { display: block; height: 161px; }

        /* Mobile styles */
        @media only screen and (max-device-width: 480px), only screen and (max-width: 480px) {
            .mobile-shell { width: 100% !important; min-width: 100% !important; }
            .center { margin: 0 auto !important; }

            .td { width: 100% !important; min-width: 100% !important; }

            .mobile-br-5 { height: 5px !important; }
            .mobile-br-10 { height: 10px !important; }
            .mobile-br-15 { height: 15px !important; }

            .m-td,
            .hide-for-mobile { display: none !important; width: 0 !important; height: 0 !important; font-size: 0 !important; line-height: 0 !important; min-height: 0 !important; }

            .mobile-block { display: block !important; }
            .img-m-center { text-align: center !important; }

            .fluid-img img { width: 100% !important; max-width: 100% !important; height: auto !important; }

            .column,
            .column-top,
            .column-bottom,
            .column-dir { float: left !important; width: 100% !important; display: block !important; }

            .content-spacing { width: 15px !important; }
            .pre-header { padding: 9px 15px !important; }
            .header { padding: 15px !important; }
            .intro { padding: 27px 15px !important; }

            .article-body,
            .article-body3,
            .article-body4,
            .article-body2 { padding: 20px 15px !important; }

            .pl-52 { padding-left: 15px !important; }

            .section { padding: 24px 15px !important; }
            .footer { padding: 26px 15px !important; }

            .pt-22,
            .article2 { padding-top: 15px !important; }
        }
    </style>
</head>
<body class="body" style="padding:0 !important; margin:0 !important; display:block !important; min-width:100% !important; width:100% !important; background:#f5f5f5; -webkit-text-size-adjust:none">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f5f5f5">
        <tr>
            <td align="center" valign="top">
                <table width="600" border="0" cellspacing="0" cellpadding="0" class="mobile-shell">
                    <tr>
                        <td class="td" style="width:600px; min-width:600px; font-size:0pt; line-height:0pt; padding:0; margin:0; font-weight:normal; Margin:0">
                            <!-- Pre header -->
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td class="pre-header" style="color:#999999; font-family:Arial,sans-serif; font-size:11px; line-height:15px; text-align:right; padding:9px 0px 6px 50px">
                                        <a href="#" target="_blank" class="link-gray"><span class="link-gray"></span></a>
                                    </td>
                                </tr>
                                <!-- Header -->
                                <tr>
                                    <td class="header" style="color:#ffffff; font-family:Arial,sans-serif; font-size:26px; line-height:30px; text-align:left; padding:15px 50px; font-weight:bold" bgcolor="#01689b">
                                        <a href="<?php echo $site->url; ?>" target="_blank" class="link-white" style="color:#ffffff; text-decoration:none"><span class="link-white" style="color:#ffffff; text-decoration:none"><?php echo $site->name; ?></span></a>
                                    </td>
                                </tr>
                                <!-- END Header -->
                                <?php if ($overview): ?>
                                    <?php echo elgg_view("emails/elements/intro"); ?>
                                <?php endif; ?>
                            </table>
                            <!-- END Pre header -->

                            <?php if ($overview): ?>
                                <?php echo elgg_view("emails/overview", $vars); ?>
                            <?php else: ?>
                                <?php echo elgg_view("emails/notification", $vars); ?>
                            <?php endif; ?>

                            <?php if ($overview): ?>
                                <?php echo elgg_view("emails/elements/footer"); ?>
                            <?php endif; ?>
                        </td>
                    </tr>

                    <tr>
                        <td valign="top" id="templateFooter">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="min-width:100%;">
                                <tbody>
                                <tr>
                                    <td valign="top" style="padding:20px">
                                        <table align="left" width="100%" border="0" cellpadding="0" cellspacing="0" style="min-width:100%;">
                                            <tbody>
                                            <tr>
                                                <td valign="top"
                                                    style="padding-right: 9px; padding-left: 9px; padding-top: 0; padding-bottom: 0; text-align:center;">

                                                    <a href="https://www.pleio.nl">
                                                        <img align="center" alt="Pleio logo"
                                                             src="<?php echo $site->url; ?>mod/pleio_template/src/images/pleio-email.png"
                                                             width="84"
                                                             style="max-width:168px; padding-bottom: 0; display: inline !important; vertical-align: bottom;"
                                                             class="img-m-center">
                                                    </a>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
