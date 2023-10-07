import React from "react"

import Select from "react-select"

const SelectForm = ({options, selected, select, applicationSettings}) => {
    
    const primary = applicationSettings && applicationSettings.global && applicationSettings.global.primary ? applicationSettings.global.primary : "blue"
    
    return <>
    {options ? <Select
        value={selected}
        onChange={select}
        options={options}
        isSearchable={false}
        className="has-text-left"
        styles={{control: (provided, state) => ({
            ...provided,
            border: !state.isFocused ? "1px solid lightgrey" : "1px solid " + primary,
            boxShadow: !state.isFocused ? "none" :  "0px 0px 3px " + primary,
            borderRadius: "7px",
            "&:hover": {
                border: "1px solid " + primary,
                boxShadow: "0px 0px 3px " + primary,
                cursor: "pointer"
            }
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: "transparent",
            paddingTop: "2px",
            paddingBottom: "2px",
            color: "",
            "&:hover": {
                cursor: "pointer",
                backgroundColor: primary,
                color: "white"
            }
        })
    }}
    /> : null}
</>
}

export default SelectForm