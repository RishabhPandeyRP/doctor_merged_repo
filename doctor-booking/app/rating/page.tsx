'use client';
import { useState } from 'react';
import styles from '@/styles/Rating.module.css';

export default function Rating() {
  const [rating, setRating] = useState<number>(0);
  const [submitted, setSubmitted] = useState(false);

  const handleRating = (value:number) => {
    setRating(value);
  };

  const handleSubmit = (e:React.FormEvent) => {
    e.preventDefault();
    if (rating > 0) {
      setSubmitted(true);
      
      console.log({ rating });
    }
  };


  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Doctor Rating</h1>
        
        {!submitted ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            
            <div className={styles.ratingContainer}>
              <p className={styles.label}>Rate your experience (1-5):</p>
              <div className={styles.stars}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleRating(value)}
                    className={`${styles.star} ${rating >= value ? styles.active : ''}`}
                    aria-label={`Rate ${value} out of 5`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.button}
              disabled={rating === 0}
            >
              Submit Rating
            </button>
          </form>
        ) : (
          <div className={styles.thankYou}>
            <h2>Thank You!</h2>
            <p>You rated {rating} out of 5 stars.</p>
          </div>
        )}
      </div>
    </main>
  );
}