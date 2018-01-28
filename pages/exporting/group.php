<?php
$group_guid = (int) get_input("group_guid");

$group = get_entity($group_guid);
if (!$group || !$group instanceof ElggGroup) {
	exit();
}

if (!$group->canEdit()) {
	exit();
}

if (elgg_get_plugin_setting("member_export", "pleio_template") !== "yes") {
	exit();
}

$is_admin = elgg_is_admin_logged_in();

$subpermissions = unserialize($group->subpermissions);
$slug = pleio_template_slugify($group->name);

header("Content-Type: text/csv");
header("Content-Disposition: attachment; filename=\"{$slug}.csv\"");
$fp = fopen("php://output", "w");

$headers = array(
	"guid",
	"name",
	"username",
	"email (only for admin)",
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

fputcsv($fp, $headers, ";");

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
		$is_admin ? $member->email : ""
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

	fputcsv($fp, $info, ";");
}

fclose($fp);
