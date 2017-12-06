function pad(num, size) {
    let s = num+""
    while (s.length < size) s = "0" + s
    return s
}

function getMonth(m) {
    const trans = {
        1: "jan",
        2: "feb",
        3: "mrt",
        4: "apr",
        5: "mei",
        6: "jun",
        7: "jul",
        8: "aug",
        9: "sep",
        10: "okt",
        11: "nov",
        12: "dec"
    }

    return trans[m]
}

function getFullMonth(m) {
    const trans = {
        1: "januari",
        2: "februari",
        3: "maart",
        4: "april",
        5: "mei",
        6: "juni",
        7: "juli",
        8: "augustus",
        9: "september",
        10: "oktober",
        11: "november",
        12: "december"
    }

    return trans[m]
}

export function showShortDate(isoDate) {
    const date = new Date(isoDate)
    const d = date.getDate()
    const m = date.getMonth() + 1
    const mFull = getMonth(m)

    return `${d} ${mFull}`
}

export function showFullDate(isoDate) {
    const date = new Date(isoDate)
    const d = date.getDate()
    const m = date.getMonth() + 1
    const mFull = getFullMonth(m)
    const y = date.getFullYear()

    const h = pad(date.getHours(), 2)
    const i = pad(date.getMinutes(), 2)
    return `${d} ${mFull} ${y}, ${h}:${i}`
}

export function timeSince(isoDate) {
    const seconds = Math.floor((new Date() - new Date(isoDate)) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval > 1) {
        return interval + " jaren geleden"
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
        return interval + " maanden geleden"
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
        return interval + " dagen geleden"
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
        return interval + " uren geleden"
    }
    interval = Math.floor(seconds / 60)
    if (interval > 9) {
        return interval + " minuten geleden"
    }

    return "zojuist"
}

export default function showDate(isoDate) {
    const date = new Date(isoDate)
    const d = date.getDate()
    const m = date.getMonth() + 1
    const y = date.getFullYear()
    const h = pad(date.getHours(), 2)
    const i = pad(date.getMinutes(), 2)
    return `${d}-${m}-${y} ${h}:${i}`
}