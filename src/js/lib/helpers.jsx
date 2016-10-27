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

export function getClassFromTags(inputTags) {
    const classes = new Set(["klas", "wetten", "arbeidsvoorwaarden", "leren", "actualiteit", "vernieuwing", "overig"])
    const intersect = inputTags.filter(x => classes.has(x))

    if (intersect.length > 0) {
        return "___" + intersect[0]
    } else {
        return "___" + "overig"
    }

}