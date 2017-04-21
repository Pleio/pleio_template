import React from "react"
import { Link } from "react-router-dom"
import ContentHeader from "../core/components/ContentHeader"
import Document from "../core/components/Document"
import AddButton from "../core/containers/AddButton"
import GroupsList from "./containers/GroupsList"
import Card from "./components/Card"

export default class List extends React.Component {
    render() {
        return (
            <div className="page-container">
                <Document title="Groepen" />
                <ContentHeader>
                    <div className="row">
                        <div className="col-sm-6">
                            <h3 className="main__title">
                                Groepen
                            </h3>
                        </div>
                        <div className="col-sm-6 end-sm">
                            <Link to="/groups/add">
                                <AddButton title="Nieuwe groep" type="group" subtype="" />
                            </Link>
                        </div>
                    </div>
                </ContentHeader>
                <section className="section ___grey ___grow">
                    <div className="container">
                        <div className="row">
                            <div className="col-sm-4 col-lg-3">
                            </div>
                        </div>
                        <GroupsList type="group" containerClassName="" rowClassName="row" childClass={Card} offset={0} limit={20} />
                    </div>
                </section>
            </div>
        )
    }
}