<?php
$startDate = strip_tags(get_input("startDate"));
$endDate = strip_tags(get_input("endDate"));
$location = strip_tags(get_input("location"));
$text = strip_tags(get_input("text"));
$details = strip_tags(get_input("details"));
$url = filter_var(get_input("url"), FILTER_VALIDATE_URL);

$slug = pleio_template_slugify($text);

header("Content-type: text/calendar; charset=utf-8");
header("Content-Disposition: attachment; filename={$slug}.ics");

echo "BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:{$startDate}
DTEND:{$endDate}
SUMMARY:{$text}
URL:{$url}
DESCRIPTION:{$details}
LOCATION:{$location}
END:VEVENT
END:VCALENDAR
";