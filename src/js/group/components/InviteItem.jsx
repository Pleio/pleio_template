import React from "react"
import classnames from "classnames"
import autobind from "autobind-decorator"
import Select from "../../core/components/NewSelect"
import showDate from "../../lib/showDate"

export default class InviteItem extends React.Component {
    @autobind
    onChange(value) {
        switch (value) {
            case "resend":
                this.props.onResend(this.props.user)
                break
            case "remove":
                this.props.onDeselect(this.props.user)
                break
        }
    }

    render() {
        const { user } = this.props

        let added
        if (this.props.added) {
            return (
                <div className="row">
                    <div className="col-sm-8">
                        <div className="list-members__member">
                            <div className="list-members__picture" style={{backgroundImage: user.icon ? `url(${user.icon})` : "url(/mod/pleio_template/src/images/user.png)"}} />
                            <div className="list-members__name"><b>{user.name}</b></div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <Select className="___no-line" options={{lid: "Lid", remove: "Verwijderen"}} onChange={this.onChange} value="lid" />
                    </div>
                </div>
            )
        } else if (this.props.invited) {
            return (
                <div className="row">
                    <div className="col-sm-8">
                        <div className="list-members__member">
                            <div className="list-members__picture" style={{backgroundImage: user.icon ? `url(${user.icon})` : "url(/mod/pleio_template/src/images/user.png)"}} />
                            <div className="list-members__name">
                                <b>{user.name}</b><br />
                                {showDate(this.props.timeCreated)}
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <Select className="___no-line" options={{invited: "Uitgenodigd", resend: "Herinneren", remove: "Intrekken"}} onChange={this.onChange} value="invited" />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="row">
                    <div className="col-sm-12">
                        <div className="list-members__member">
                            <div className="list-members__picture" style={{backgroundImage: user.icon ? `url(${user.icon})` : "url(/mod/pleio_template/src/images/user.png)"}} />
                            <div className="list-members__name"><b>{user.name}</b></div>
                            <div className="button ___square ___grey list-members__add">
                                <div className="list-members__add-icons">
                                    <span className="___check" />
                                    <span className="___plus" onClick={() => this.props.onSelect(user)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}