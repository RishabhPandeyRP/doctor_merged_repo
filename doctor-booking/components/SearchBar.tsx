import React from "react"
import styles from "@/styles/Searchbar.module.css"

interface Searchparams{
    termSearched : string
    onSearch : (value : string)=> void
    paginatedDoc : ()=>void
    isFiltering:boolean
}

const SearchBar = ({termSearched , paginatedDoc , onSearch , isFiltering} : Searchparams)=>{

    const searchChangeHandler = (e : React.ChangeEvent<HTMLInputElement>)=>{
        onSearch(e.target.value)
    }

    return(
        <div className={styles.searchDiv}>
            <div className={styles.searchContent}> 
                <input type="text"
                 name=""
                  id=""
                  placeholder="Search by doctor name , disease , specialization"
                  defaultValue={termSearched}
                  onChange={searchChangeHandler}
                  className={styles.searchInput} /> 
                <button className={styles.searchBtn} onClick={paginatedDoc} disabled={isFiltering}> 
                    {isFiltering ? "searching..." : "search"}
                </button>
            </div>
        </div>
    )
}

export default SearchBar