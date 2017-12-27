<?php
function pleio_template_permissions_check($hook_name, $entity_type, $return_value, $parameters) {
    $user = $parameters['user'];
    $entity = $parameters['entity'];

    if (!$user | !$entity) {
        return $return_value;
    }

    if ($subtype && !in_array($subtype, ["file", "folder", "wiki"])) {
        return $return_value;
    }

    // by default Elgg allows only owners (and admins) to write to entities, we would like to extend this with users in list $entity->write_access_id

    if ($return_value === true) {
        return true;
    }

    $write_permission = $entity->write_access_id;
    if (!$write_permission) {
        $write_permission = ACCESS_PRIVATE;
    }

    switch ($write_permission) {
        case ACCESS_PRIVATE:
            return $return_value;
            break;
        default:
            $list = get_access_array($user->guid);
            if (in_array($write_permission, $list)) {
                // user in the access collection
                return true;
            }
            break;
    }
}
