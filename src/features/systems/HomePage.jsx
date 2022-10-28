import React, {useState} from "react"

import {Link} from "react-router-dom"

import SearchBar from "../atoms/SearchBar"

const HomePage = ({}) => {
  
  const [searchValue, setSearchValue] = useState("")
  
  const handleSearchSubmit = (e) => {
    e.preventDefault()
    
  }
  
  const handleSearchChange = (e) => {
    e.preventDefault()
    setSearchValue(e.target.value)
  }
  
  return <>
    <div className="box">
      <div className="is-flex is-justify-content-center">
       <form className="field" onSubmit={handleSearchSubmit}>
          <SearchBar />
       </form>
     </div>    
    </div>   
    <div className="box">
      <h1 className="is-title is-3">Recents</h1>
      <div className="columns">
        <div className="column">
          <div className="card">
            Latest POST tsbbb
          </div>
        </div>
        <div className="column">
          <div className="card">
            numéro 2 
          </div>
        </div>
        <div className="column">
          <div className="card">
            number 3
          </div>
        </div>
      </div>
    </div>
    <div className="box">
      <h1 className="is-title is-3">Favorites</h1>
      <div className="columns">
        <div className="column">
          <div className="card">
            Latest POST tsbbb
          </div>
        </div>
        <div className="column">
          <div className="card">
            numéro 2 
          </div>
        </div>
        <div className="column">
          <div className="card">
            number 3
          </div>
        </div>
      </div>
      <div className="is-flex is-justify-content-center">
        <h3 className="is-title is-3">It seems like you're not logged in ...</h3>
        <h3 className="is-title is-4">Please sign in to acces your favorites documents ...</h3>
      </div>
    </div>
    <div className="box">
      <h1 className="is-title is-2">How to use dOctopus properly ?</h1>
      <p className="">
        dOctopus is a great and powerful tool to access easily any documents from your favorite Organisation, which could be even better if you know how to use it. 
        We're using latest technologies to give you the fastest result to whatever you're looking for. But to make it easier we've created a strong search engine allowing you to be always more specific and find your document in no more than one click. 
        
      </p>
      <Link to="/tutorial" passHref>Learn how to use it</Link>
    </div>
    <div className="box">
      <h1 className="is-title is-2">More about dOctopus</h1>
      <p className="">
        Your favorite octopus was born in the early 2022, even if it's a new born he's proud to say that he's definitely the best documents manager of the ocean. dOctopus is the result of several months of thinking about new ways to manage documents, ways that needed to be easier for both users and organisations. Ways that had to optimize each part of the process, and finally dOctopus needed to be accessible for every organisations that is struggling with managing their huge amount of documents, books, movies etc... 
      </p>
      <Link to="/tutorial" passHref>Read more ...</Link>
    </div>
  </>
}

export default HomePage