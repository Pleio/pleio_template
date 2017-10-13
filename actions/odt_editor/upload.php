<?php
/**
 * ODT file uploader/edit action
 *
 * @package odt_editor
 */

elgg_load_library('odt_editor:locking');

// Get variables
$file_guid = (int) get_input('file_guid');
$lock_guid = get_input('lock_guid');
$user_guid = elgg_get_logged_in_user_guid();
$folder_guid = get_input('folder_guid');

# TODO: just copied and reduced code to get started, not developed yet!
# TODO: what about other properties like title, tags, etc?
# also edit? and what about syncing with similar metadata in the ODT file itself?

// load original file object
$file = new ElggFile($file_guid);
if (!$file) {
    register_error(elgg_echo('file:cannotload'));
    forward(REFERER);
}

// user must be able to edit file
if (!$file->canEdit()) {
    register_error(elgg_echo('file:noaccess'));
    forward(REFERER);
}

if (odt_editor_locking_lock_guid($file) != $lock_guid) {
    $lock_owner_guid = odt_editor_locking_lock_owner_guid($file);
    if ($lock_owner_guid != $user_guid) {
        $locking_user = get_entity($lock_owner_guid);
        $locking_user_name = $locking_user ? $locking_user->name : elgg_echo("odt_editor:unknown_user");
        register_error(elgg_echo('odt_editor:file:cannotwrite_lock_lost_to', array($locking_user_name)));
    } else {
        register_error(elgg_echo('odt_editor:file:cannotwrite_lock_lost_to_self'));
    }
    forward(REFERER);
}

// previous file, delete it
$filename = $file->getFilenameOnFilestore();
if (file_exists($filename)) {
    unlink($filename);
}

$file->setMimeType("application/vnd.oasis.opendocument.text");
$file->simpletype = "document";

// Open the file to guarantee the directory exists
$file->open("write");
$file->close();
move_uploaded_file($_FILES['upload']['tmp_name'], $file->getFilenameOnFilestore());

$file->save();

system_message(elgg_echo("file:saved"));
