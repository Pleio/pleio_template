function pad(num, size) {
    let s = num+""
    while (s.length < size) s = "0" + s
    return s
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