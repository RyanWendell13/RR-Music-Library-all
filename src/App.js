import './App.css';
import { useEffect, Suspense, useState, useRef} from 'react'
import { BrowserRouter as Router, Route} from 'react-router-dom'
import Gallery from './components/Gallery'
import SearchBar from './components/SearchBar'
import AlbumView from './components/AlbumView'
import ArtistView from './components/ArtistView'
import { DataContext } from './contexts/DataContext'
import { SearchContext } from './contexts/SearchContext'
import Spinner from './components/Spinner'

function App() {
  let searchInput = useRef('')
  let [data, setData] = useState([])
  let [message, setMessage] = useState('Search for Music!')

  const API_URL = `https://itunes.apple.com/search?term=`

  function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }

  useEffect(() => {
    if (searchInput) {
      document.title=`${searchInput} Music`
      const fetchData = async () => {
        const response = await fetch(API_URL + searchInput)
        const resData = await response.json()
        if(resData.results.length > 0) {
          setData(resData.results)
        } else {
          setMessage('Not Found')
        }
      }
      fetchData()
  }
  }, [searchInput, API_URL])

  const handleSearch = (e, term) => {
    // e.preventDefault()
    // term = toTitleCase(term)
    // setsearchInpu(term)
    // return (<Redirect to="/" />)
    e.preventDefault()
    fetch(`https://itunes.apple.com/search?term=${term}`)
    .then(response => response.json())
    .then(resData => {
      if (resData.results.length > 0) {
        return setData(resData.results)
      } else {
        return setMessage('Not Found.')
      }
    })
    .catch(err => setMessage('An Error has Occurred!'))
  }

  const renderGallery = () => {
    
    if(data) {
      return (
        <Suspense fallback={<Spinner />}>
          <Gallery />
        </Suspense>
      )
    }
  }

  return (
    <div className="App">
      
      <Router>
        <Route exact path="/">
          <SearchContext.Provider value={{term: searchInput, handleSearch: handleSearch}}>
            <SearchBar />
          </SearchContext.Provider>
          {message}
          
          <DataContext.Provider value={data}>
            {renderGallery()}
          </DataContext.Provider>
          
        </Route>
        <Route path="/album/:id">
          <AlbumView term={searchInput} />
        </Route>
        <Route path="/artist/:id">
          <ArtistView term={searchInput} />
        </Route>
      </Router>
    </div>
  );
}

export default App;
