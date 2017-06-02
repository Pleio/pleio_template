<?php 

    $result = elgg_get_plugin_setting("custom_js", "custom_js");
    if(!empty($result) && !get_input("disable_custom_js", false)){
        echo $result;
    }