import React, { useEffect } from "react";
import './Loader.scss'

const Loader = ({ loading }) => {
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  if (!loading) return null;
  
  return (
    <>
      {
        loading &&
        <div className="loading-container">
            <div className="loading-animation">
                <div className="loader"></div>
                <span className="loading-text">Loading...</span>
            </div>
        </div>
      }
    </>
  );
};

export default Loader;