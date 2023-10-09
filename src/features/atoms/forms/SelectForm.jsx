import React from "react"

import Select from "react-select"

const SelectForm = ({options, selected, select, applicationSettings, mode}) => {
    
    const primary = applicationSettings && applicationSettings.global && applicationSettings.global.primary ? applicationSettings.global.primary : "blue"
    
    const stylesOptions = mode === "filters" ? {
        scale: "0.82",
            marginTop: "-4px",
            minWidth: "150px",
    } : {}

    return <>
    {options ? <Select
        value={selected}
        onChange={select}
        options={options}
        className="has-text-left"
        styles={{control: (provided, state) => ({
            ...provided,
            ...stylesOptions,
            border: !state.isFocused ? "1px solid lightgrey" : "1px solid " + primary,
            boxShadow: !state.isFocused ? "none" :  "0px 0px 3px " + primary,
            borderRadius: mode && mode === "filters" ? "37px" : "7px",
            
            "&:hover": {
                border: "1px solid " + primary,
                
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