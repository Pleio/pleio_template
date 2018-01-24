import React from "react"
import DropdownButton from "../../core/components/DropdownButton"
import autobind from "autobind-decorator"
import moment from "moment"

export default class AddToCalendarButton extends React.Component {
    @autobind
    getEvent() {
        const { entity } = this.props

        return {
            startDate: this.formatTime(entity.startDate),
            endDate: entity.endDate ? this.formatTime(entity.endDate) : "",
            title: entity.title,
            excerpt: entity.excerpt || "",
            location: entity.location || ""
        }
    }

    getIcal() {
        const event = this.getEvent()

        let calendarUrl = "/exporting/calendar/"
        calendarUrl += "?startDate=" + event.startDate
        calendarUrl += "&endDate=" + event.endDate
        calendarUrl += "&location=" + encodeURIComponent(event.location)
        calendarUrl += "&text=" + encodeURIComponent(event.title)
        calendarUrl += "&details=" + encodeURIComponent(event.excerpt)
        calendarUrl += "&url=" + encodeURIComponent(window.location.href)
        return calendarUrl
    }

    @autobind
    getGoogle() {
        const event = this.getEvent()

        let calendarUrl = "https://calendar.google.com/calendar/render"
        calendarUrl += "?action=TEMPLATE"
        calendarUrl += "&dates=" + event.startDate
        calendarUrl += "/" + event.endDate
        calendarUrl += "&location=" + encodeURIComponent(event.location)
        calendarUrl += "&text=" + encodeURIComponent(event.title)
        calendarUrl += "&details=" + encodeURIComponent(event.excerpt + "\n\n" + window.location.href)

        return calendarUrl
    }

    @autobind
    getOutlook() {
        const event = this.getEvent()

        let calendarUrl = "https://outlook.live.com/owa/?rru=addevent"
        calendarUrl += "&startdt=" + event.startDate
        calendarUrl += "&enddt=" + event.endDate
        calendarUrl += "&subject=" + encodeURIComponent(event.title)
        calendarUrl += "&location=" + encodeURIComponent(event.location)
        calendarUrl += "&body=" + encodeURIComponent(event.excerpt + "\n\n" + window.location.href)
        calendarUrl += "&allday=false"
        calendarUrl += "&uid=" + this.getRandomKey()
        calendarUrl += "&path=/calendar/view/Month"

        return calendarUrl
    }

    @autobind
    formatTime(date) {
        if (!date) {
            return null
        }

        let formattedDate = moment.utc(date).format("YYYYMMDDTHHmmssZ")
        return formattedDate.replace("+00:00", "Z")
    }

    getRandomKey() {
        let n = Math.floor(Math.random() * 999999999999).toString();
        return new Date().getTime().toString() + "_" + n;
    }

    render() {
        const { event } = this.getEvent()

        const options = [
            { href: this.getIcal(), name: 'iCal', target: 'blank' },
            { href: this.getGoogle(), name: 'Google', target: 'blank' },
            { href: this.getIcal(), name: 'Outlook', target: 'blank' },
            { href: this.getOutlook(), name: 'Outlook.com', target: 'blank' }
        ]

        return (
            <DropdownButton options={options} line colored name="Zet in agenda" />
        )
    }
}