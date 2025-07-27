import { useNavigate } from 'react-router-dom';
import './product-page.css';
import config from '../../config';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ProductPage({userDetails, currentProduct, addToCart, userCart}) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [isImageZoomed, setIsImageZoomed] = useState(false);
    
    let viewedProduct = currentProduct;
    
    useEffect(() => {
        if(!currentProduct._id) {
            document.location.href = config.prefix;
            return;
        }
    }, [])

    const handleImageClick = () => {
        setIsImageZoomed(!isImageZoomed);
    };

    const handleAddToCart = () => {
        if (viewedProduct.outOfStock) {
            return;
        }
        if (!userDetails._id) {
            document.getElementById("cart-view").classList.remove("visible") 
            toast.warning("Please log in to add to cart");
            navigate(config.loginPage);
            return;
        }
        if (userCart.includes(viewedProduct._id)) {
            toast.error("Product already added to cart");
            return;
        }
        
        setIsLoading(true);
        const token = localStorage.getItem(config.localTokenKey)
        const cart = [...userCart, viewedProduct._id];

        axios.put(config.getBackendUrl("/update-cart"), {cart: cart}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            if (res.data.valid) {
                toast.success("Added To Cart");
                addToCart(viewedProduct._id);
            }
        })
        .catch((err) => {
            toast.error(err.response ? err.response.data.message : "Some error occurred");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return <div className={`product-view ${isLoading ? 'loading' : ''}`}>
        <button className="back-home-button" onClick={() => {
            document.location.href = config.prefix
        }}>
            Back to Home
        </button>
        
        <div className="product-image-div">
            <div className={`product-image-container ${isImageZoomed ? 'zoomed' : ''}`} 
                 onClick={handleImageClick}
                 onMouseMove={(e) => {
                    if (!isImageZoomed) {
                        const img = document.getElementsByClassName("product-image")[0];
                        const rect = document.getElementsByClassName("product-image-div")[0].getBoundingClientRect();

                        let [mouseX, mouseY] = [e.clientX - rect.left, e.clientY - rect.top - 200];

                        img.style.setProperty("--client-x", `${mouseX}px`);
                        img.style.setProperty("--client-y", `${mouseY}px`);
                    }
                }}>
                <img className="product-image" src={viewedProduct.photo} alt={viewedProduct.title} />
            </div>
        </div>
        
        <div className="product-details-div">
            <div className="product-details-container">
                <h1>{viewedProduct.title}</h1>
                <h3>{viewedProduct.description}</h3>
                
                <div className="price-section">
                    <h2>₹{viewedProduct.price.toLocaleString()}</h2>
                    <span className="price-badge">Best Price</span>
                </div>
                
                <div className={`stock-status ${viewedProduct.outOfStock ? 'out-of-stock' : 'in-stock'}`}>
                    {viewedProduct.outOfStock ? 'Out of Stock' : 'In Stock'}
                </div>
                
                <div className="buttons">
                    <button 
                        className={`add-to-cart-button${viewedProduct.outOfStock ? " disabled" : ""}`} 
                        onClick={handleAddToCart}
                        disabled={isLoading || viewedProduct.outOfStock}
                    >
                        {isLoading ? 'Adding...' : (viewedProduct.outOfStock ? "OUT OF STOCK" : "Add To Cart")}
                    </button>
                </div>
                
                <div className="product-features">
                    <h4>Product Features</h4>
                    <ul className="feature-list">
                        <li>High-quality materials and construction</li>
                        <li>Fast and secure delivery</li>
                        <li>30-day return policy</li>
                        <li>24/7 customer support</li>
                        <li>Warranty included</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
}

export default ProductPage