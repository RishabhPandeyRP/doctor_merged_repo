import React from 'react';
import styles from '@/styles/Pagination.module.css';

interface PaginationProps {
    current_page: number;
    total_pages: number;
    onPageChange: (pageNumber: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ current_page, total_pages, onPageChange }) => {

    const get_numbers_of_pages = () => {
        
        const maxPageNumber = 5;
        const pagenumbers = [];

        if (total_pages <= maxPageNumber) {

            let i = 1;
            while (i <= total_pages) {
                pagenumbers.push(i);
                i++;
            }

        } else {

            pagenumbers.push(1);

            if (current_page >= total_pages - 2) {
                pagenumbers.push("...");
                for (let i = total_pages - 3; i < total_pages; i++) {
                    pagenumbers.push(i);
                }
            }

            else if (current_page <= 3) {
                pagenumbers.push(2, 3, 4);
                pagenumbers.push("...");
            }

            
            else {
                pagenumbers.push("...");
                pagenumbers.push(current_page - 1, current_page, current_page + 1);
                pagenumbers.push("...");
            }


            pagenumbers.push(total_pages);
        }

        return pagenumbers;
    };

    return (
        <div className={styles.pageDiv}>
            <button
                className={styles.pageBtn}
                onClick={() => onPageChange(current_page - 1)}
                disabled={current_page == 1}
            >
                Previous
            </button>

            {get_numbers_of_pages().map((number, index) => (
                number === "..." ?
                    <span key={`ellipsis-${index}`} className={styles.pageDots}>...</span> :
                    <button
                        key={`page-${number}`}
                        onClick={() => typeof number === 'number' && onPageChange(number)}
                        className={`${current_page === number ? styles.activePage : ''} ${styles.pageBtn}`}
                        

                    >
                        {number}
                    </button>
            ))}

            <button
                onClick={() => onPageChange(current_page + 1)}
                disabled={current_page === total_pages}
                className={styles.pageBtn}
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;