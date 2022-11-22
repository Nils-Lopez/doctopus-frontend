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
    <div>
      <div className="is-flex is-justify-content-center">
       <form className="field" onSubmit={handleSearchSubmit}>
          <SearchBar />
        </form>
      </div>    
    <svg className="background-landing-ctn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="#a29bfe" fillOpacity="1" d="M0,256L48,240C96,224,192,192,288,197.3C384,203,480,245,576,240C672,235,768,181,864,176C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path></svg>
      <div className="landing-content">
        <div className="container recents-container">
        <h1 className="title is-4">Recents</h1>
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
        <div className="container mt-6">
          <h1 className="title is-4">Favorites</h1>
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
        <div className="container box mt-6">
        <h1 className="title is-5">Contredanse Documentation Center</h1>
        <p className="mb-3">
          Donec gravida maximus nulla id vulputate. Fusce a dictum tortor, tincidunt molestie massa. Vivamus ac tristique mi, id interdum odio. Nullam vestibulum a libero nec blandit. Ut et aliquet diam, et tempus odio. Fusce ultrices, tortor elementum tincidunt pellentesque, urna tortor porta nisi, ac hendrerit lorem velit quis justo. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.      </p>
        <Link to="/contredanse">Read more ...</Link>
      </div>
      <div className="box">
        <h1 className="title is-5">About dOctopus</h1>
        <p className="mb-3">
          Your favorite octopus was born in the early 2022, even if it's a new born he's proud to say that he's definitely the best documents manager of the ocean. dOctopus is the result of several months of thinking about new ways to manage documents, ways that needed to be easier for both users and organisations. Ways that had to optimize each part of the process, and finally dOctopus needed to be accessible for every organisations that is struggling with managing their huge amount of documents, books, movies etc... 
        </p>
        <Link to="/tutorial">Read more ...</Link>
      </div>
    </div>
    </div>   

    
  </>
}

export default HomePage