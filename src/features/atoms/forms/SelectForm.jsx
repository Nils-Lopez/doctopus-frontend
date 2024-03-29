import React from "react"

import Select from "react-select"

const SelectForm = ({options, selected, select, applicationSettings, mode, multiple}) => {
    
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
        isMulti={multiple ? true : false}
        styles={{control: (provided, state) => ({
            ...provided,
            ...stylesOptions,
            border: !state.isFocused ? "1px solid lightgrey" : "1px solid " + primary,
            boxShadow: !state.isFocused ? "none" :  "0px 0px 3px " + primary,
            borderRadius: mode && mode === "filters" ? "37px" : "7px",
            backgroundColor: "rgba(255, 255, 255, 0.35) !important",
            paddingTop: "1px",
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
            zIndex: "auto",
            
            position: "relative",
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