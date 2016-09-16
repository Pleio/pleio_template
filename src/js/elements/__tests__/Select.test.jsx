import React from "react"
import Select from "../Select"
import renderer from "react-test-renderer"

const options = {
    1: "First option",
    2: "Second option"
}

const component = renderer.create(
    <Select options={options} />
)

let tree = component.toJSON()

it("Renders correctly", () => {
    expect(tree).toMatchSnapshot()
})

it("Toggles on click", () => {
    tree.children[1].children[0].props.onClick()

    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
})

it("Changes value on clicking an item", () => {
    tree = component.toJSON()
    expect(tree).toMatchSnapshot()
})