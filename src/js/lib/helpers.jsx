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
    const translate = {
        "In de klas": "klas",
        "Wetten en regels": "wetten",
        "Arbeidsvoorwaarden": "arbeidsvoorwaarden",
        "Blijven leren": "leren",
        "Actualiteit": "actualiteit",
        "Vernieuwing": "vernieuwing",
        "Overig": "overig"
    };

    let cssTag
    inputTags.forEach((tag) => {
        if (translate[tag]) {
            cssTag = translate[tag]
        }
    })

    if (cssTag) {
        return "___" + cssTag
    } else {
        return "___" + "overig"
    }

}

export function displayTags(tags) {
    return tags.join(", ")
}

export function getUrl(entity) {
    switch (entity.subtype) {
        case "news":
            return `/news/${entity.guid}`
        case "blog":
            return `/blog/${entity.guid}`
        case "question":
            return `/question/${entity.guid}`
        default:
            return `#`
    }
}

export function isMobile() {
    let userAgent = (window.navigator.userAgent||window.navigator.vendor||window.opera),
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgent);

    return isMobile ? true : false;
}