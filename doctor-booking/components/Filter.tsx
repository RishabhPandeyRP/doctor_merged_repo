import React from "react"
import styles from "@/styles/Filter.module.css"
import { FilterState } from "@/data/doctors.types"

interface FilterParams{
    onFilterChange : (typeFilter: keyof FilterState , value : string) => void
    onFilterReset: ()=>void
    filters : FilterState
    printFilters : ()=> void
    isFiltering:boolean
}

type ExperienceValues = "15%2B years" | "10-15 years" | "5-10 years" | "3-5 years" | "1-3 years" | "0-1 years";
type DisplayTextMap = {
    [key in ExperienceValues]?: string;
};
const exp15 : DisplayTextMap  = {
    "15%2B years":"15+ years"
}



const Filter = ({onFilterChange , onFilterReset , filters , printFilters , isFiltering} : FilterParams)=>{

    const getDisplayedValues = (value:string):string=>{
        if (value ) {
            return exp15[value as ExperienceValues] || value;
        }
        return value;
    }

    return(
        <div className={styles.filterDiv}> 
            <div className={styles.filterHeaders}>
                <h2>Filter By:</h2>
                <button className={styles.rstBtn} onClick={onFilterReset}>Reset</button>
            </div>

            <div>
                <button onClick={printFilters} className={styles.applyFilter} disabled={isFiltering}>
                    {isFiltering ? "Applying..." : "Apply filters"}
                </button>
            </div>

            
            <div className={styles.filterCategory}> 
                <h3>Rating</h3>
                {
                    [5,4,3,2,1].map((stars) =>(
                        <div className={styles.filterValues} key={`${stars}`}>
                            <input type="radio"
                            name="rating"
                            id={`rating-${stars}`}
                            checked={filters.rating.includes(stars.toString())}
                            onChange={()=>onFilterChange('rating' , stars.toString())}
                             />
                            <label htmlFor={`rating-${stars}`}>
                                {stars}{stars === 1 ? 'star' : 'stars'}
                            </label>
                        </div>
                    ))
                }
            </div>

            
            <div className={styles.filterCategory}>
                <h3>Experience</h3>
                {
                    ["15%2B years" , "10-15 years" , "5-10 years" , "3-5 years" , "1-3 years" , "0-1 years"].map((exp , index) =>(
                        <div className={styles.filterValues} key={index}>
                            <input type="radio"
                            name="exp"
                            id={`exp-${exp}`}
                            checked={filters.experience.includes(exp)}
                            onChange={()=>onFilterChange('experience' , exp)} 
                            />
                            <label htmlFor={`exp-${exp}`}>
                                {getDisplayedValues(exp)}
                            </label>
                        </div>
                    ))
                }
            </div>

            
            <div className={styles.filterCategory}>
                <h3>Gender</h3>
                {
                    ["male" , "female"].map((gender , index) =>(
                        <div className={styles.filterValues} key={index}>
                            <input type="radio"
                            name="gender"
                            id={`gender-${gender}`}
                            checked={filters.gender.includes(gender)}
                            onChange={()=>onFilterChange('gender' , gender)} 
                            />
                            <label htmlFor={`gender-${gender}`}>
                                {gender}
                            </label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Filter