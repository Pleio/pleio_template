export function stringToTags(tagString) {
    if (Array.isArray(tagString)) {
        return tagString
    }

    if (tagString == null) {
        return
    }

    return tagString.split(",").map((tag) => tag.trim())
}