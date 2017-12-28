<?php
/**
 * ODT Editor Save-as form
 *
 * @package odt_editor
 */

$old_file_guid = elgg_extract('file_guid', $vars, null);

$title = "";

if ($old_file_guid != 0) {
	$old_file = new ElggFile($old_file_guid);
	$tags = $old_file ? $old_file->tags : array();
	$access_id = $old_file ? $old_file->access_id : ACCESS_DEFAULT;
	$write_access_id = $old_file ? $old_file->write_access_id : ACCESS_PRIVATE;
} else {
	$access_id = ACCESS_DEFAULT;
	$write_access_id = ACCESS_PRIVATE;
}

$form_body .= '<div>';
$form_body .= '<label>' . elgg_echo('title') . '</label><br />';
$form_body .= elgg_view('input/text', array('name' => 'title', 'value' => $title));
$form_body .= '</div>';

$form_body .= '<div>';
$form_body .= '<label>' . elgg_echo('tags') . '</label>';
$form_body .= elgg_view('input/tags', array('name' => 'tags', 'value' => $tags));
$form_body .= '</div>';

$form_body .= '<div>';
$form_body .= '<label>' . elgg_echo('access:read') . '</label><br />';
$form_body .= elgg_view('input/access', array('name' => 'access_id', 'value' => $access_id));
$form_body .= '</div>';

$form_body .= '<div>';
$form_body .= '<label>' . elgg_echo('access:write') . '</label><br />';
$form_body .= elgg_view('input/write_access', array('name' => 'write_access_id', 'value' => $write_access_id));
$form_body .= '</div>';

if(file_tools_use_folder_structure()) {
	$parent_guid = 0;
	if($file = elgg_extract("entity", $vars)){
		if($folders = $file->getEntitiesFromRelationship(FILE_TOOLS_RELATIONSHIP, true, 1)){
			$parent_guid = $folders[0]->getGUID();
		}
	}

	$form_body .= '<div>';
	$form_body .= '<label>' . elgg_echo('file_tools:forms:edit:parent') . '</label><br />';
	$form_body .= elgg_view("input/folder_select", array("name" => "folder_guid", "value" => $parent_guid));
	$form_body .= '</div>';
}

$categories = elgg_view('input/categories', $vars);
if ($categories) {
	$form_body .= $categories;
}

$form_body .= '<div class="elgg-foot">';
$form_body .= elgg_view('input/submit', array('value' => elgg_echo('odt_editor:saveas'), "class" => "elgg-button-submit mtm"));
$form_body .= '</div>';

$body = elgg_view('input/form', array('id'     => 'odt_editor_form_saveas',
                                      'name'   => 'odt_editor_form_saveas',
                                      'action' => 'javascript:elgg.odt_editor.doSaveAs($(\'#odt_editor_form_saveas\'))',
                                      'body'   => $form_body));

echo elgg_view_module('popup', elgg_echo('odt_editor:title:saveas'), $body);
