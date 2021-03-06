<?php
namespace Pleio;

class Color {
    static function tint($color, $weight = 0.5) {
        $t = $color;
        if(is_string($color)) $t = Color::hex2rgb($color);
        $u = Color::mix($t, array(255, 255, 255), (1 - $weight));
        if(is_string($color)) return Color::rgb2hex($u);
        return $u;
    }

    static function mix($color_1 = array(0, 0, 0), $color_2 = array(0, 0, 0), $weight = 0.5) {
        $f = function($x) use ($weight) { return $weight * $x; };
        $g = function($x) use ($weight) { return (1 - $weight) * $x; };
        $h = function($x, $y) { return round($x + $y); };
        return array_map($h, array_map($f, $color_1), array_map($g, $color_2));
    }

    static function hex2rgb($hex = "#000000") {
        $f = function($x) { return hexdec($x); };
        return array_map($f, str_split(str_replace("#", "", $hex), 2));
    }

    static function rgb2hex($rgb = array(0, 0, 0)) {
        $f = function($x) { return str_pad(dechex($x), 2, "0", STR_PAD_LEFT); };
        return "#" . implode("", array_map($f, $rgb));
    }
}