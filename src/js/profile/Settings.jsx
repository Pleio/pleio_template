import React from "react"
import Select from "../core/components/Select"
import Switch from "../core/components/Switch"

export default class Settings extends React.Component {

    onChange(e) {}

    render() {
        return (
            <section className="section ___grey ___grow">
                <div className="container">
                    <div className="card-profile">
                        <h3 className="card-profile__title">Stel hier je interesses in</h3>
                        <div className="row">
                            <div className="col-sm-8 col-lg-6">
                                <div className="form__label">Interesses</div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <Switch name="interest-1" value={false} label="value 1" onChange={this.onChange} />
                                    </div>
                                    <div className="col-sm-6">
                                        <Switch name="interest-1" value={false} label="value 1" onChange={this.onChange} />
                                    </div>
                                    <div className="col-sm-6">
                                        <Switch name="interest-1" value={false} label="value 1" onChange={this.onChange} />
                                    </div>
                                    <div className="col-sm-6">
                                        <Switch name="interest-1" value={false} label="value 1" onChange={this.onChange} />
                                    </div>
                                    <div className="col-sm-6">
                                        <Switch name="interest-1" value={false} label="value 1" onChange={this.onChange} />
                                    </div>
                                    <div className="col-sm-6">
                                        <Switch name="interest-1" value={false} label="value 1" onChange={this.onChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-lg-4">
                                <Select />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }
}