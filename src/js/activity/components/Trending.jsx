import React from "react"
import Accordeon from "../../core/components/Accordeon"

export default class Trending extends React.Component {
    render() {
        return (
            <div className="col-sm-6 col-lg-12">
                <Accordeon title="Trending" className="card-list-trending">
                    <a href="#" className="card-list-trending__item">
                        <div className="card-list-trending__category">
                            Lerarencongres 2016
                        </div>
                        <div className="card-list-trending__likes">
                            287
                        </div>
                    </a>
                </Accordeon>
            </div>
        )
    }
}