<?php
/**
 * ODT file upload_as_new_file action
 *
 * @package odt_editor
 */

elgg_load_library('odt_editor:locking');

// Get variables
$old_file_guid = (int) get_input('old_file_guid', 0);
$old_lock_guid = get_input('old_lock_guid');

$user_guid = elgg_get_logged_in_user_guid();

$title = htmlspecialchars(get_input('title', '', false), ENT_QUOTES, 'UTF-8');
$description = ""; // TODO: get_input("description");
$tags = explode(",", get_input("tags"));

$access_id = (int) get_input("access_id", ACCESS_DEFAULT);
$write_access_id = (int) get_input("write_access_id", ACCESS_PRIVATE);

$container_guid = (int) get_input('container_guid');

// fallback to user if somebody deleted the group container behind our back
// TODO: ask the user for another group container instead
$container = get_entity($container_guid);
if (!$container) {
    $container_guid = elgg_get_logged_in_user_guid();
}

// create new file object
$file = new ElggFile();
$file->title = $title;
$file->access_id = $access_id;
$file->write_access_id = $write_access_id;
$file->description = $description;
$file->container_guid = $container_guid;
$file->tags = $tags;
$file->setMimeType("application/vnd.oasis.opendocument.text");
$file->simpletype = "document";

// same naming pattern as in file/actions/file/upload.php
$filestorename = "file/" . elgg_strtolower(time().$_FILES['upload']['name']);
$file->setFilename($filestorename);

// Open the file to guarantee the directory exists
$file->open("write");
$file->close();
// now put file into destination
move_uploaded_file($_FILES['upload']['tmp_name'], $file->getFilenameOnFilestore());

// create lock
$lock_guid = odt_editor_locking_create_lock($file, $user_guid);

$file->save();

$folder = get_input('folder_guid');
$folder = get_entity($folder);

if ($folder && $folder->canWriteToContainer() && $folder instanceof ElggObject) {
    add_entity_relationship($folder->guid, "folder_of", $file->guid);
}

// log success
system_message(elgg_echo("file:saved"));
add_to_river('river/object/file/create', 'create', $user_guid, $file->guid);

// reply to client
$reply = array(
    "file_guid" => $file->guid,
    "document_url" => elgg_get_site_url() . "file/download/{$file->uid}",
    "file_name" => $file->getFilename(),
    "lock_guid" => $lock_guid
);
print(json_encode($reply));

// remove lock from old file
if ($old_file_guid != 0) {
    $old_file = new ElggFile($old_file_guid);

    if ($old_file && odt_editor_locking_lock_guid($old_file) == $old_lock_guid && odt_editor_locking_lock_owner_guid($old_file) == $user_guid) {
        odt_editor_locking_remove_lock($old_file);
    }
}
