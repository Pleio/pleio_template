<?php
$group_guid = (int) get_input("group_guid");

if (empty($group_guid)) {
	register_error(elgg_echo("InvalidParameterException:MissingParameter"));
	forward(REFERER);
}

$group = get_entity($group_guid);
if (empty($group) || !elgg_instanceof($group, "group")) {
	register_error(elgg_echo("InvalidParameterException:GUIDNotFound", array($group_guid)));
	forward(REFERER);
}

if (!$group->canEdit() || (elgg_get_plugin_setting("member_export", "pleio_template") != "yes")) {
	register_error(elgg_echo("groups:cantedit"));
	forward(REFERER);
}

$subpermissions = unserialize($group->subpermissions);

// create temp file
$fh = tmpfile();

$headers = array(
	"guid",
	"name",
	"username",
	"email",
	"member since",
	"last login",
	"last action",
);

$acl_members = array();
foreach($subpermissions as $subpermission) {
	$acl = get_access_collection($subpermission);
	$acl_members[$subpermission] = get_members_of_access_collection($subpermission, true);
	$headers[] = $acl->name;
}

fwrite($fh, "\"" . implode("\";\"", $headers) . "\"" . PHP_EOL);

$options = array(
	"type" => "user",
	"limit" => false,
	"relationship" => "member",
	"relationship_guid" => $group->getGUID(),
	"inverse_relationship" => true
);

$members = new ElggBatch("elgg_get_entities_from_relationship", $options);
foreach ($members as $member) {
	$info = array(
		$member->guid,
		$member->name,
		$member->username,
		$member->email
	);

	$member_since = group_tools_get_membership_information($member, $group);
	$info[] = date("Y-m-d G:i:s", $member_since);
	$info[] = date("Y-m-d G:i:s", $member->last_login);
	$info[] = date("Y-m-d G:i:s", $member->last_action);

	foreach ($subpermissions as $subpermission) {
		if (in_array($member->guid, $acl_members[$subpermission])) {
			$info[] = elgg_echo("option:yes");
		} else {
			$info[] = elgg_echo("option:no");
		}
	}

	fwrite($fh, "\"" . implode("\";\"", $info) . "\"" . PHP_EOL);
}

// read the csv in to a var before output
$contents = "";
rewind($fh);
while (!feof($fh)) {
	$contents .= fread($fh, 2048);
}

// cleanup the temp file
fclose($fh);

// output the csv
header("Content-Type: text/csv");
header("Content-Disposition: attachment; filename=\"" . elgg_get_friendly_title($group->name) . ".csv\"");
header("Content-Length: " . strlen($contents));

echo $contents;
exit();
