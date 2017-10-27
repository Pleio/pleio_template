import React from "react"
import classnames from "classnames"
import Validator from "validatorjs"
import PropTypes from "prop-types"
import autobind from "autobind-decorator"
import moment from "moment"

moment.locale("nl")
moment.weekdays(true)

class DateTimeField extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            value: this.toMoment(this.props.value),
            isOpenDate: false,
            isOpenTime: false
        }
    }

    toMoment(value) {
        const start = moment(value)
        const remainder = start.minute() % 30
        return moment(start).add(remainder, "minutes")
    }

    @autobind
    openDate(e) {
        this.setState({ isOpenDate: true })
    }

    @autobind
    closeDate(e) {
        this.setState({ isOpenDate: false })
    }

    @autobind
    openTime(e) {
        this.setState({ isOpenTime: true })
    }

    @autobind
    closeTime(e) {
        this.setState({ isOpenTime: false })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({
                value: this.toMoment(nextProps.value)
            })
        }
    }

    componentWillMount() {
        if (this.context.attachToForm) {
            this.context.attachToForm(this)
        }
    }

    componentWillUnmount() {
        if (this.context.detachFromForm) {
            this.context.detachFromForm(this)
        }
    }

    @autobind
    resetTime(e) {
        this.setState({ value: this.toMoment() })
    }

    @autobind
    previousMonth(e) {
        e.preventDefault()
        this.setState({ value: moment(this.state.value).subtract(1, "month") })
    }

    @autobind
    nextMonth(e) {
        e.preventDefault()
        this.setState({ value: moment(this.state.value).add(1, "month") })
    }

    isValid() {
        return true
    }

    getValue() {
        return this.state.value.toISOString()
    }

    clearValue() {
        this.setState({ value: "" })
    }

    render() {
        const days = moment.weekdaysMin(true).map((i) => (
            <span key={i}>{i}</span>
        ))

        const begin = moment(this.state.value).clone().startOf("month")
        const prefix = begin.clone().weekday(0)

        const end = moment(this.state.value).clone().endOf("month")
        const postfix = end.clone().weekday(6)

        const numbers = []
        for (const i = prefix; i.isBefore(postfix); i.add(1, "day")) {
            const current = i.clone().hours(this.state.value.hours()).minutes(this.state.value.minutes())

            numbers.push((
                <button
                    key={current.toISOString()}
                    type="button"
                    className={classnames({
                        "___other-month": current.isBefore(begin, "day") || current.isAfter(end, "day"),
                        "___is-selected": current.isSame(this.state.value, "day"),
                    })}
                    onClick={(e) => { this.setState({ value: current, isOpenDate: false }) }}
                >
                    {current.format("D")}
                </button>
            ))
        }

        const startOfDay = this.state.value.clone().startOf("day")
        const endOfDay = this.state.value.clone().endOf("day")

        const times = []
        for (const i = startOfDay; i.isBefore(endOfDay); i.add(0.5, "hour")) {
            const current = i.clone()
            times.push((
                <button
                    key={current.toISOString()}
                    type="button"
                    onClick={(e) => { this.setState({ value: current, isOpenTime: false }) }}
                >{current.format("HH:mm")}</button>
            ))
        }

        return (
            <div className="row">
                <div className="col-xs-6">
                    <div className="form__date" onBlur={this.closeDate}>
                        <input placeholder="Datum" type="text" value={this.state.value.format("ddd D MMM YYYY")} readOnly onClick={this.openDate} />
                        <div ref="calendar" className={classnames({"calendar": true, "___is-open": this.state.isOpenDate})}>
                            <div className="calendar__months">
                                <button type="button" onMouseDown={this.previousMonth} />
                                <span onDoubleClick={this.resetTime}>{this.state.value.format("MMMM YYYY")}</span>
                                <button type="button" onMouseDown={this.nextMonth} />
                            </div>
                            <div className="calendar__days">{days}</div>
                            <div className="calendar__numbers">{numbers}</div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6">
                    <div className="form__time" onBlur={this.closeTime}>
                        <input placeholder="Tijd" type="text" value={this.state.value.format("HH:mm")} readOnly onClick={this.openTime} />
                        <div ref="time" className={classnames({"option-list": true, "___is-open": this.state.isOpenTime})}>
                            {times}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

DateTimeField.contextTypes = {
    attachToForm: PropTypes.func,
    detachFromForm: PropTypes.func
}

export default DateTimeField