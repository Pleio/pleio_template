<?php
$site = elgg_get_site_entity();
$logotime = $site->logotime ? $site->logotime : time();
?>
<p>
    <img src="/mod/pleio_template/logo.php?lastcache=<?php echo $logotime; ?>" class="logo">
</p>

<p>
    <input type="file" name="logo">
</p>

<?php if ($site->logotime): ?>
    <p>
        <input type="checkbox" id="remove_logo" name="remove_logo" value="1">
        <label for="remove_logo"><?php echo elgg_echo("pleio_template:remove_logo"); ?></label>
    </p>
<?php endif; ?>