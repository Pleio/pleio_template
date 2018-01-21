import React from "react"
import classnames from "classnames"
import autobind from "autobind-decorator"
import Select from "../../core/components/NewSelect"
import showDate from "../../lib/showDate"

export default class InviteItem extends React.Component {
    @autobind
    onChange(value) {
        const { user } = this.props

        switch (value) {
            case "accept":
                this.props.onAccept(user)
                break
            case "reject":
                this.props.onReject(user)
                break
        }
    }

    render() {
        const { user } = this.props

        return (
            <div className="row">
                <div className="col-sm-8">
                    <div className="list-members__member">
                        <div className="list-members__picture" style={{backgroundImage: user.icon ? `url(${user.icon})` : "url(/mod/pleio_template/src/images/user.png)"}} />
                        <div className="list-members__name">
                            <b>{user.name}</b><br />
                        </div>
                    </div>
                </div>
                <div className="col-sm-4">
                    <Select className="___no-line" options={{requested: "Aangevraagd", accept: "Accepteren", reject: "Afwijzen"}} onChange={this.onChange} value="requested" />
                </div>
            </div>
        )
    }
}