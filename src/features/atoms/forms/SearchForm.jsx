import React, {useState, useEffect, Fragment} from "react"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCircleXmark, faCirclePlus, faArrowRotateLeft, faMagnifyingGlass, faCircleCheck} from '@fortawesome/free-solid-svg-icons'

import {useTranslation} from "react-i18next"

const ItemForm = ({scope, location, selectedItems, handleAddItem, selectItem, defaults, searchItems, responseSearchItems, mainField, setFormModal, setNoDocFound}) => {
  const [itemEnValue, setItemEnValue] = useState("")
  const [itemFrValue, setItemFrValue] = useState("")
  const [itemDescEn, setItemDescEn] = useState("")
  const [itemDescFr, setItemDescFr] = useState("")
  const [itemSlug, setItemSlug] = useState("")
  const [items, setItems] = useState([])
  const [itemsLoading, setItemsLoading] = useState(false)
  const [pending, setPending] = useState("")
  const { t, i18n } = useTranslation() 

  const [displayItem, setDisplayItem] = useState(true)

  useEffect(() => {
    if (defaults && defaults[0]) {
      defaults.map((item) => {
        if (!selectedItems.includes(item)) {
          selectItem([...selectedItems, item])
        }
      })
    }
  }, [defaults])

  const getContent = (value, lang) => {
    if (mainField === "content") {
        if (value) {
            return value.filter(obj => obj.lang === lang)[0] ? value.filter(obj => obj.lang === lang)[0].content : value.filter(obj => obj.lang === "en")[0] ? value.filter(obj => obj.lang === "en")[0].content : value.filter(obj => obj.lang === "fr")[0].content
          } else {
            return "Error"
          }
    } else {
        return value
    }
  }

  const handleItemChange = (e) => {
    e.preventDefault()
    if (mainField==="content") {
        if (i18n.language === "en") {
            setItemEnValue(e.target.value)
            setItemSlug(itemEnValue.replaceAll(" ", "-").toLowerCase())
        
          } else {
            setItemFrValue(e.target.value)
            setItemSlug(itemFrValue.replaceAll(" ", "-").toLowerCase())
           
          }
    } else {
        setItemFrValue(e.target.value)
        setItemSlug(itemFrValue.replaceAll(" ", "-").toLowerCase())
        setItemEnValue(e.target.value)

    }
    if (e.target.value.length >= 3) {
      searchItemValue(e)
    } else if (e.target.value.length === 0) {
      setItems([])
    }
  }
  
  const isItemExisting = () =>  {
    let retrievedItem = undefined
    items.map((item) => {
     if (itemEnValue === getContent(item.title, "en")) {
        retrievedItem = itemEnValue
      } else if (itemFrValue === getContent(item.title, "fr")) {
        retrievedItem = item
      }    
    })
    if (retrievedItem) {
      return retrievedItem
    } else return false
  }
 
  
  const handleCreateItem = (e) => {
    e.preventDefault()
    if (!setFormModal) {
        const newItem = { slug: itemSlug, title: [{ lang: "en", content: itemEnValue }, { lang: "fr", content: itemFrValue }], description: [{ lang: "fr", content: itemDescFr }, {lang: "en", content: itemDescEn}], scope: scope}
    selectItem([...selectedItems, newItem])
    setItemEnValue("")
    setItemFrValue("")
    setDisplayItem(false)
    setItemDescFr("")
    setItems([])

    setItemDescEn("")
    } else {
        setFormModal(true)
    }
  }
  


  const handleDeleteItem = (e, item) => {
    e.preventDefault()
    const filtered = selectedItems.filter((r) => {
      return r.slug !== item.slug
    })
    selectItem(filtered)
    if (filtered.length === 0) setDisplayItem(true)
    setItems([])
  }
  

  const searchItemValue = (e) => {
    if (e) e.preventDefault()
    if (e.target.value.length >= 3) {
      setItemsLoading(true)
      searchItems(e.target.value)
    } 
  }

  useEffect(() => {
    if (responseSearchItems && responseSearchItems.success && responseSearchItems.data[0] && itemsLoading) {
      setItemsLoading(false)
      setItems(responseSearchItems.data)
      if (setNoDocFound) setNoDocFound(false)


    } else if (responseSearchItems && itemsLoading) {
      setItemsLoading(false)
      setItems([])
      if (setNoDocFound) setNoDocFound(true)
    }
  }, [responseSearchItems])

  useEffect(() => {
    items.map((item) => {
        if (getContent(item.title, i18n.language) === itemEnValue || getContent(item.title, i18n.language) === itemEnValue) {
          setPending("existing")
        }
      })
      if (pending !== "existing") {
        setPending(i18n.language === "en" ? itemEnValue : itemFrValue)
      } else {
        setPending("")
      }
  }, [items])

  console.log(items)
  const [itemFull, setItemFull] = useState(false)

  let inputClasses = (!isItemExisting() && (itemEnValue.length >= 3 || itemFrValue.length >= 3 )) ? "control has-icons-left min-90" : "control has-icons-left min-100"

  let divClasses = mainField === "content" ? "field mt-1" : "field mt-4"

  return <>
 
    <div className={divClasses}>

    <div className="is-flex is-justify-content-start is-fullwidth">
    {!handleAddItem && selectedItems ? selectedItems.map((item) => {
        return <Fragment key={item.slug}>
          <span className="tag is-info mt-1 is-medium mr-1">{getContent(item.title, i18n.language)}        <i className="has-text-light ml-3 pointer" onClick={(e) => {
                handleDeleteItem(e, item)
              }}><FontAwesomeIcon icon={faCircleXmark} /></i>  </span>
        </Fragment>
      }) : null}
      {!handleAddItem  ? <>
        {!displayItem ? <i className="has-text-info subtitle is-5 ml-2 mt-2  pointer" onClick={(e) => {
               setDisplayItem(true)
              }}><FontAwesomeIcon icon={faCirclePlus} /></i>  : selectedItems && selectedItems[0] ? <i className="has-text-info subtitle is-5 ml-2 mt-2 pointer" onClick={(e) => {
                setDisplayItem(false)
               }}><FontAwesomeIcon icon={faArrowRotateLeft} /></i> : null}
      </> : null}
    
    
 
              

        </div>
        
    
         {(displayItem || handleAddItem) ? <div className="is-flex is-fullwidth mt-2">
            <div className={inputClasses}>
          <input type="text" placeholder={location === "templates" ? "Default types" : location === "templates-parents" ? "Default items" : location && location.includes("parent") ? "Items": ""} className="input" value={i18n.language === "en" ? itemEnValue : itemFrValue} onChange={handleItemChange}/>

          <span class="icon is-small is-left pointer">
           <i className="has-text-grey  pointer" ><FontAwesomeIcon icon={faMagnifyingGlass} /></i>
    </span>
 
    </div>      
    {!setNoDocFound && !isItemExisting() && (itemEnValue.length >= 3 || itemFrValue.length >= 3 ) ?   <i className=" ml-3 mt-1 pt-1 has-text-info title is-5 pointer" onClick={(e) => {
              handleCreateItem(e)
              }}><FontAwesomeIcon icon={faCirclePlus} /></i> : null}
              
        </div>  : null}
       
       <div className="is-flex is-justify-content-start">
       {items.map((t, i) => {
                  if ((!scope || t.scope === scope) && i < 5 ) {
                    return <Fragment key={t.slug}>
                    <span className="tag is-info mt-2 is-small mr-1 opacity-50" onClick={(e) => {

                        if (!handleAddItem) {
                            selectItem([...selectedItems, t])
                        } else {
                            handleAddItem(t)
                        }
                        setItems([])
                        setItemFrValue("")
                        setItemEnValue("")    
                        setDisplayItem(false)

                        }}
                        onMouseEnter={() => setItemFull(t)}
                        onMouseLeave={() => setItemFull(false)}
                        >{mainField === "content" ? getContent(t.title, i18n.language) : itemFull !== t && t[mainField] && t[mainField].length > 10 ? t[mainField].slice(0,10) + "..." : t[mainField]}        <i className="has-text-light ml-3 pointer"><FontAwesomeIcon icon={faCircleCheck} /></i>  </span>
                  </Fragment>
                  }
                })}  
       </div>
          </div>

      
     
     
  </>
}

export default ItemForm