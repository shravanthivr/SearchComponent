import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimesCircle} from '@fortawesome/free-solid-svg-icons';
import { fetchDrugsByName } from '../api/fetchUtils';
import { Link } from 'react-router-dom';
import "./search.css";


const Search = () => {
    const [search, setSearch] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [suggestion, setSuggestion] = useState([]);
    const [error, setError] = useState(null);
    const [debounceTimeout, setDebounceTimeout] = useState(null);

  
    const fetchSpellingSuggestions = async (name) => {
        const response = await fetch(`https://rxnav.nlm.nih.gov/REST/spellingsuggestions.json?name=${name}`);
        if (!response.ok) {
          setError('Failed to fetch spelling suggestions');
        }
        const data = await response.json();
        return data.suggestionGroup.suggestionList.suggestion || [];
      };

    const handleSearch = async (e) => {
        e.preventDefault();
        searchDrugs(search);
    };

    const searchDrugs = async (name) => {
      try {
         setError(null);
         setSuggestion([]);
         let suggestions;
         if (name.trim().length < 5) {
            suggestions = await fetchSpellingSuggestions(name);
            if(suggestions.length === 0) {
                setError("Failed to fetch");
            }
            setSuggestion(suggestions);
        }else {
            const drugNames = await fetchDrugsByName(name);
            if (drugNames.length === 0) {
              const suggestions = await fetchSpellingSuggestions(name);
              setSuggestion(suggestions);
            } else {
                setSearchResult(drugNames);
            }
          }
        } catch (err) {
        setError(err.message);
      }
    };

    const handleInputChange = (e) => {
        const searchValue = e.target.value;
        setSearch(searchValue);
        if (debounceTimeout) {
          clearTimeout(debounceTimeout);
        }
        setDebounceTimeout(setTimeout(() => searchDrugs(searchValue), 300));
      };

      const handleReset = () => {
        setSearch('');
        setSearchResult([]);
        setSuggestion([]);
        setError(null);
      };
    

return (
    <div className='search-box'>
        <h2>Search for drugs</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSearch}>
            <input
                type="text"
                value={search}
                onChange={handleInputChange}
                placeholder='Search'
            />
            <button type="submit" className="search-button">
                <FontAwesomeIcon icon={faSearch} />
            </button>
            <button type="button" onClick={handleReset} className="reset-button">
                <FontAwesomeIcon icon={faTimesCircle} />
        </button>
        </form>
        <ul className="search-results">
        {searchResult && searchResult.map((result, index) => (
          <li key={index}>
           <Link
              to={{
                pathname: `/drugs/${result.name}/${result.rxcui}/${result.synonym}`
              }}
            >
              {result.name}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="suggestions">
        {suggestion.map((suggestion, index) => (
          <li key={index}>{suggestion}</li>
        ))}
      </ul>
    </div>
    
);

/*
I tried passing the props, for some reason it wasn't being passed so adding the rxcui and synonym also to the URL so that I can pass the data
{searchResult && searchResult.map((result, index) => (
          <li key={index}>
           <Link
              to={{
                pathname: `/drugs/${encodeURIComponent(result.name)}`,
                state: {
                  name: result.name,
                  rxcui: result.rxcui,
                  synonym: result.synonym
                }
              }}
            >
              {result.name}
            </Link>
          </li>
  */

};

export default Search;

