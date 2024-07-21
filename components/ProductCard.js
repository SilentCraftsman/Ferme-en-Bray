import React from "react";
import PropTypes from "prop-types";
import "../styles/ProductCard.css";

const ProductCard = ({ image, title, description, price }) => {
  return (
    <div className="product-card">
      <img src={image} alt={title} className="product-image" />
      <h3 className="product-title">{title}</h3>
      <p className="product-description">{description}</p>
      <div className="product-price">
        <span>Prix: </span>
        {price}
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
};

export default ProductCard;
