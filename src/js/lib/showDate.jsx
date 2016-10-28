function pad(num, size) {
    let s = num+""
    while (s.length < size) s = "0" + s
    return s
}

function fullMonth(m) {
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

export function showShortDate(isoDate) {
    const date = new Date(isoDate)
    const d = date.getDate()
    const m = date.getMonth() + 1
    const mFull = fullMonth(m)

    return `${d} ${mFull}`
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