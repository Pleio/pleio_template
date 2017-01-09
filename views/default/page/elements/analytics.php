<?php
$google_analytics = elgg_get_plugin_setting("google_analytics", "pleio_template");
$piwik = elgg_get_plugin_setting("piwik", "pleio_template");
$sentry = elgg_get_plugin_setting("sentry", "pleio_template");
?>

<?php if ($google_analytics): ?>
    <!-- Google Analytics -->
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', '<?php echo $google_analytics; ?>', 'auto');
    ga('send', 'pageview');
    </script>
    <!-- End Google Analytics -->
<?php endif; ?>

<?php if ($piwik): ?>
    <!-- Piwik -->
    <script type="text/javascript">
      var _paq = _paq || [];
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      (function() {
        var u="//stats.pleio.nl/";
        _paq.push(['setTrackerUrl', u+'piwik.php']);
        _paq.push(['setSiteId', '<?php echo $piwik; ?>']);
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
      })();
    </script>
    <noscript><p><img src="//stats.pleio.nl/piwik.php?idsite=<?php echo $piwik; ?>" style="border:0;" alt="" /></p></noscript>
    <!-- End Piwik Code -->
<?php endif; ?>

<?php if ($sentry): ?>
    <!-- Sentry -->
    <script src="https://cdn.ravenjs.com/3.9.1/raven.min.js"></script>
    <script type="text/javascript">
    Raven.config("<?php echo $sentry; ?>").install()
    </script>
    <!-- End Sentry Code -->
<?php endif; ?>