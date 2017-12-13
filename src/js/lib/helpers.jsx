import { Set } from "immutable"

export function getQueryVariable(variable, search) {
    if (!search) {
        var query = window.location.search.substring(1);
    } else {
        var query = search.substring(1);
    }

    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
}

export function logErrors(errors) {
    if (typeof Raven !== "undefined") {
        Raven.captureException(errors)
    }
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

export function getValueFromTags(inputTags, possibleOptions) {
    if (!inputTags) {
        return
    }

    const options = new Set(possibleOptions)

    let value = null
    inputTags.forEach((tag) => {
        if (options.contains(tag)) {
            value = tag
        }
    })

    return value
}

export function getValuesFromTags(inputTags, possibleOptions) {
    if (!inputTags) {
        return []
    }

    const options = new Set(possibleOptions)

    let value = []
    inputTags.forEach((tag) => {
        if (options.contains(tag)) {
            value.push(tag)
        }
    })

    return value
}

export function parseURL(url) {
    var parser = document.createElement("a");
    parser.href = url;
    return parser;
}

export function displayTags(tags) {
    return tags.join(", ")
}

export function isMobile() {
    let userAgent = (window.navigator.userAgent||window.navigator.vendor||window.opera),
        isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(userAgent);

    return isMobile ? true : false;
}

export function getAttribute(name, object, defaultValue) {
    if (typeof object[name] !== "undefined") {
        return object[name]
    }

    return defaultValue
}

export function arrayToObject(array) {
    let returnValue = {}

    array.forEach((item) => {
        returnValue[item] = item
    })

    return returnValue
}

export function getVideoFromUrl(input) {
    const url = parseURL(input)
    switch (url.hostname) {
        case "youtube.com":
        case "www.youtube.com":
            return { "type": "youtube", "id": getQueryVariable("v", url.search) }
        case "vimeo.com":
        case "www.vimeo.com":
            return { "type": "vimeo", "id": getQueryVariable("v", url.search) }
    }
}

export function getVideoThumbnail(input) {
    const url = parseURL(input)

    switch (url.hostname) {
        case "youtube.com":
        case "www.youtube.com":
            let v = getQueryVariable("v", url.search)
            return `https://img.youtube.com/vi/${v}/hqdefault.jpg`
    }

    return ""
}

export function loadScript(src, cb) {
    const script = document.createElement("script")
    script.setAttribute("src", src)
    script.async = true
    script.onload = cb
    document.body.appendChild(script)
}

export function humanFileSize(size) {
    const i = Math.floor(Math.log(size) / Math.log(1024))
    return (size / Math.pow(1024, i)).toFixed(1) * 1 + ['B', 'kB', 'MB', 'GB', 'TB'][i]
}