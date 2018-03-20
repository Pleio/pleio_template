<?php
function pleio_template_get_cms_pages() {
    $site = elgg_get_site_entity();

    $options = [
        "type" => "object",
        "subtype" => "page",
        "container_guid" => $site->guid,
        "limit" => 50
    ];

    $return = [0 => "---"];

    $entities = elgg_get_entities($options);

    if ($entities) {
        foreach ($entities as $entity) {
            $return[$entity->guid] = $entity->title;
        }
    }

    return $return;
}

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

function pleio_template_slugify($text) {
  // replace non letter or digits by -
  $text = preg_replace('~[^\pL\d]+~u', '-', $text);

  // transliterate
  $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

  // remove unwanted characters
  $text = preg_replace('~[^-\w]+~', '', $text);

  // trim
  $text = trim($text, '-');

  // remove duplicate -
  $text = preg_replace('~-+~', '-', $text);

  // lowercase
  $text = strtolower($text);

  if (empty($text)) {
    return 'n-a';
  }

  return $text;
}

function pleio_template_get_access_array($user_id = 0) {
	global $CONFIG;

	if ($user_id == 0) {
		$user_id = elgg_get_logged_in_user_guid();
	}

	$site_id = $CONFIG->site_guid;

	$user_id = (int) $user_id;
	$site_id = (int) $site_id;

    $access_array = array(ACCESS_PUBLIC);

    // The following can only return sensible data if the user is logged in.
    if ($user_id) {
        $access_array[] = ACCESS_LOGGED_IN;

        // Get ACL memberships
        $query = "SELECT am.access_collection_id"
            . " FROM {$CONFIG->dbprefix}access_collection_membership am"
            . " LEFT JOIN {$CONFIG->dbprefix}access_collections ag ON ag.id = am.access_collection_id"
            . " WHERE am.user_guid = $user_id AND (ag.site_guid = $site_id OR ag.site_guid = 0)";

        $collections = get_data($query);
        if ($collections) {
            foreach ($collections as $collection) {
                if (!empty($collection->access_collection_id)) {
                    $access_array[] = (int)$collection->access_collection_id;
                }
            }
        }

        // Get ACLs owned.
        $query = "SELECT ag.id FROM {$CONFIG->dbprefix}access_collections ag ";
        $query .= "WHERE ag.owner_guid = $user_id AND (ag.site_guid = $site_id OR ag.site_guid = 0)";

        $collections = get_data($query);
        if ($collections) {
            foreach ($collections as $collection) {
                if (!empty($collection->id)) {
                    $access_array[] = (int)$collection->id;
                }
            }
        }
	}

	$options = array(
		'user_id' => $user_id,
		'site_id' => $site_id
	);

	return elgg_trigger_plugin_hook('access:collections:read', 'user', $options, $access_array);
}