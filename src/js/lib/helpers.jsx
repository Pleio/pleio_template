export function stringToTags(tagString) {
    if (Array.isArray(tagString)) {
        return tagString
    }

    if (tagString == null) {
        return
    }

    return tagString.split(",").map((tag) => tag.trim())
}

export function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}