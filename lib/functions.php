<?php

function pleio_template_add_folder_to_zip(ZipArchive &$zip_archive, ElggObject $folder, $folder_path = ""){

    if(!empty($zip_archive) && !empty($folder) && elgg_instanceof($folder, "object", "folder")){
        $folder_title = elgg_get_friendly_title($folder->title);

        $zip_archive->addEmptyDir($folder_path . $folder_title);
        $folder_path .= $folder_title . DIRECTORY_SEPARATOR;

        $file_options = array(
            "type" => "object",
            "subtype" => "file",
            "limit" => false,
            "relationship" => "folder_of",
            "relationship_guid" => $folder->getGUID()
        );

        // add files from this folder to the zip
        if($files = elgg_get_entities_from_relationship($file_options)){
            foreach($files as $file){
                // check if the file exists
                if($zip_archive->statName($folder_path . $file->originalfilename) === false){
                    // doesn't exist, so add
                    $zip_archive->addFile($file->getFilenameOnFilestore(), $folder_path . pleio_template_sanitize_file_name($file->originalfilename));
                } else {
                    // file name exists, so create a new one
                    $ext_pos = strrpos($file->originalfilename, ".");
                    $file_name = substr($file->originalfilename, 0, $ext_pos) . "_" . $file->getGUID() . substr($file->originalfilename, $ext_pos);

                    $zip_archive->addFile($file->getFilenameOnFilestore(), $folder_path . pleio_template_sanitize_file_name($file_name));
                }
            }
        }

        // check if there are subfolders
        $folder_options = array(
            "type" => "object",
            "subtype" => "folder",
            "limit" => false,
            "metadata_name_value_pairs" => array("parent_guid" => $folder->getGUID())
        );

        if($sub_folders = elgg_get_entities_from_metadata($folder_options)){
            foreach($sub_folders as $sub_folder){
                pleio_template_add_folder_to_zip($zip_archive, $sub_folder, $folder_path);
            }
        }
    }
}

function pleio_template_sanitize_file_name($filename) {
    $filename = mb_ereg_replace("([^\w\s\d\-_~,;:\[\]\(\).])", '', $filename);
    $filename = mb_ereg_replace("([\.]{2,})", '', $filename);
    return $filename;
}