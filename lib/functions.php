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

// remain API compatible with odt_tools
if (!function_exists('file_tools_use_folder_structure')) {
    function file_tools_use_folder_structure() {
        return true;
    }
}

if (!function_exists('file_tools_build_select_options')) {
    function file_tools_build_select_options($folders, $depth = 0) {
        $result = array();
        
        if(!empty($folders)){
            foreach($folders as $index => $level){
                if($folder = elgg_extract("folder", $level)){
                    $result[$folder->getGUID()] = str_repeat("-", $depth) . $folder->title;
                }
                
                if($childen = elgg_extract("children", $level)){
                    $result += file_tools_build_select_options($childen, $depth + 1);
                }
            }
        }
        
        return $result;
    }
}

if (!function_exists('file_tools_get_folders')) {
    function file_tools_get_folders($container_guid = 0) {  
        if(empty($container_guid)) {
            $container_guid = elgg_get_page_owner_guid();
        }
        
        if(empty($container_guid)) {
            return false;
        }

        $db_prefix = elgg_get_config('dbprefix');
        $options = array(
            "type" => "object",
            "subtype" => "folder",
            "container_guid" => $container_guid,
            "limit" => false,
            "joins" => "JOIN {$db_prefix}objects_entity oe ON e.guid = oe.guid",
            "order_by" => "oe.title ASC"
        );

        $folders = elgg_get_entities($options);

        if (!$folders) {
            return false;
        }

        $children = array();
        foreach($folders as $folder) {
            $parent_guid = (int) $folder->parent_guid;
            
            if(empty($parent_guid)) {
                $parent_guid = 0;
            }
            
            if(!array_key_exists($parent_guid, $children)) {
                $children[$parent_guid] = array();
            }
            
            $children[$parent_guid][] = $folder;
        }
        
        $get_folder = function($parent_guid) use (&$get_folder, $children) {
            $result = array();

            $i = 0;
            if (array_key_exists($parent_guid, $children)) {
                foreach ($children[$parent_guid] as $child) {
                    $result[$i] = array(
                        'folder' => $child,
                        'children' => $get_folder($child->guid)
                    );
                    $i++;
                }
            }

            return $result;
        };

        return $get_folder(0);
    }
}