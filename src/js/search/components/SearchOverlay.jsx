import React from "react"
import { connect } from "react-redux"
import AutocompleteList from "../containers/AutocompleteList"

const subtypes = [{title:"Blog", subtype:"blog"}, {title:"Forum", subtype:"question"}, {title:"Nieuws", subtype:"news"}]

class SearchOverlay extends React.Component {
    render() {
        let autocompleteLists

        if (this.props.search) {
            autocompleteLists = subtypes.map((subtype, i) => (
                <AutocompleteList key={i} q={this.props.search} type="object" title={subtype.title} subtype={subtype.subtype} />
            ))
        }

        return (
            <div id="searchResults" tabIndex="0" className="navigation-search-results ___small-header">
                <div className="container">
                    <div className="row">
                        {autocompleteLists}
                    </div>
                </div>
            </div>
        )
    }
}

const stateToProps = (state) => {
    return {
        search: state.search
    }
}

export default connect(stateToProps)(SearchOverlay)