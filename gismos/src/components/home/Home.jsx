import { useEffect, useState } from 'react';
import config from '../../config';
import './home.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

let sortingMethods = [
    { value: "featured", name: "Featured", func: null },
    { value: "price-asc", name: "Price (Low to High)", func: (a, b) => a.price - b.price },
    { value: "price-desc", name: "Price (High to Low)", func: (a, b) => b.price - a.price },
    { value: "name-asc", name: "Name (A-Z)", func: (a, b) => a.title.localeCompare(b.title) },
    { value: "name-desc", name: "Name (Z-A)", func: (a, b) => b.title.localeCompare(a.title) }
];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function Home({userDetails, changeProductView, addToCart, productsList, userCart}) {
    let productsListCopy = [...productsList];

    let productCategories = [];
    let productBrands = [];
    let lowerPriceLimit = 0;
    let upperPriceLimit = 200;
    if (productsListCopy[0] != "ERROR") {
        for (const product of productsListCopy) {
            let category = product.category;
            let brand = product.title ? product.title.split(" ")[0] : " ";
    
            if (!productCategories.includes(category)) {
                productCategories.push(category)
            } 
            if (!productBrands.includes(brand)) {
                productBrands.push(brand)
            }
            if (product.price > upperPriceLimit) {
                upperPriceLimit = product.price + 15000;
            }
        }
    }
    productBrands.sort((a, b) => {return a.localeCompare(b)})

    const navigate = useNavigate();
    let [categoryFilters, setCategoryFilters] = useState([]);
    let [brandFilters, setBrandFilters] = useState([]);
    let [outOfStockFilter, setOutOfStockFilter] = useState(false);
    let [lowerPriceLimitFilter, setLowerPriceLimitFilter] = useState(lowerPriceLimit);
    let [upperPriceLimitFilter, setUpperPriceLimitFilter] = useState(upperPriceLimit);
    let [sortingModeIndex, setSortingModeIndex] = useState(0);

    if (sortingMethods[sortingModeIndex].value != "featured") productsListCopy.sort(sortingMethods[sortingModeIndex].func);
    else shuffleArray(productsListCopy);
    
    let numberOfFilteredProducts = 0;
    let sortedAndFilteredProducts = productsListCopy[0] != "ERROR" ? productsListCopy.map((product) => {
        if (categoryFilters.length > 0 && !categoryFilters.includes(product.category)) {
            return;
        }

        let brand = product.title ? product.title.split(" ")[0] : "";
        if (brandFilters.length > 0 && !brandFilters.includes(brand)) {
            return;
        }

        if (outOfStockFilter && product.outOfStock) {
            return;
        }

        if (lowerPriceLimitFilter > 0 && product.price < lowerPriceLimitFilter) {
            return;
        }
        if (upperPriceLimitFilter > 0 && product.price > upperPriceLimitFilter) {
            return;
        }

        numberOfFilteredProducts++;

        return <div className='product-card animate-scale-in' key={product._id} onClick={(e) => {
            if (e.target.classList.contains("add-to-cart-button")) return;
            changeProductView(product);
            navigate(config.productPage);
        }}>
            <div className='upper-container'>
                {product.outOfStock && <div className="stock-badge">Out of Stock</div>}
                <div className='product-img-container'>
                    <img className='product-img' src={product.photo} alt={product.title} />
                </div>
            </div>
            <div className='product-details'>
                <h3 className='product-title'>{product.title}</h3>
                <p className='product-price'>₹{product.price.toLocaleString()}</p>
            </div>
            <div className='lower-container'>
                <button className={`add-to-cart-button${product.outOfStock ? " disabled" : ""}`} onClick={() => {
                    if (product.outOfStock) {
                        return;
                    }
                    if (!userDetails._id) {
                        document.getElementById("cart-view").classList.remove("visible") 
                        toast.warning("Please log in to add to cart");
                        navigate(config.loginPage);
                        return;
                    }
                    if (userCart.includes(product._id)) {
                        toast.error("Product already added to cart");
                        return;
                    }
                    const token = localStorage.getItem(config.localTokenKey)
                    
                    const cart = [...userCart, product._id];

                    axios.put(config.getBackendUrl("/update-cart"), {cart: cart}, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    })
                    .then((res) => {
                        if (res.data.valid) {
                            toast.success("Added To Cart");
                            addToCart(product._id);
                        }
                    })
                    .catch((err) => {
                        toast.error(err.response ? err.response.data.message : "Some error occurred");
                    })
                }}>{product.outOfStock ? "OUT OF STOCK" : "Add To Cart"}</button>
            </div>
        </div>
    }) : []

    return <div className='home-main'>
        {/* Crypto Content Container */}
        <div className='home-content-container'>
            {/* Left Sidebar - Filters */}
            <div className="filters-sidebar">
                <div className="filters-sidebar-header">
                    <h2>🎰 FILTERS</h2>
                    <button onClick={() => {
                        setCategoryFilters([]);
                        setBrandFilters([]);
                        for (const check of document.getElementsByClassName("filter-checkbox")) {
                            check.checked = false;
                        }

                        setTimeout(() => {
                            document.getElementById("low-price-num").value = "";
                            document.getElementById("up-price-num").value = "";
                        }, 10);
                        setLowerPriceLimitFilter(lowerPriceLimit);
                        setUpperPriceLimitFilter(upperPriceLimit);
                        
                        setOutOfStockFilter(false);
                        document.getElementById("out1").checked = false;
                    }} type='button' className="clear-filters-button">Clear All</button>
                </div>
                
                <div className="filters-sidebar-content">
                    <div className='filter-section' id="category">
                        <h4>Category</h4>
                        {productCategories.map((category, index) => {
                            return <div key={index} className='filter-item'>
                                <input id={`ca${index}`} type="checkbox" onChange={(e) => {
                                    if (e.target.checked) {
                                        setCategoryFilters([...categoryFilters, category])
                                    }
                                    else {
                                        let list = categoryFilters.filter((cat) => {
                                            return cat != category
                                        })
                                        setCategoryFilters(list)
                                    }
                                }} className='filter-checkbox category' />
                                <label htmlFor={`ca${index}`}>{category}</label>
                            </div>
                        })}
                        <button onClick={() => {
                            setCategoryFilters([]);
                            for (const check of document.getElementsByClassName("filter-checkbox category")) {
                                check.checked = false;
                            }
                        }} type='button' className="clear-filters-button secondary">Clear</button>
                    </div>
                    
                    <div className="filter-section" id="price">
                        <h4>Price Range</h4>
                        <div className="filter-price-outer">
                            <input type="number" id="low-price-num" placeholder='Min Price' className='price-num' min={0} max={upperPriceLimit} step={500}/>
                            <input type="number" id="up-price-num" placeholder='Max Price' className='price-num' min={0} max={upperPriceLimit} step={500}/>
                            <div className="price-buttons">
                                <button type='button' className='go-filters-button' onClick={() => {
                                    setLowerPriceLimitFilter(document.getElementById("low-price-num").value);
                                    setUpperPriceLimitFilter(document.getElementById("up-price-num").value);
                                }}>Apply</button>
                                <button type='button' className='clear-filters-button secondary' onClick={() => {
                                    setTimeout(() => {
                                        document.getElementById("low-price-num").value = "";
                                        document.getElementById("up-price-num").value = "";
                                    }, 10);
                                    setLowerPriceLimitFilter(lowerPriceLimit);
                                    setUpperPriceLimitFilter(upperPriceLimit);
                                }}>Clear</button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="filter-section" id="out-of-stock">
                        <h4>Stock</h4>
                        <div className="filter-item">
                            <input type="checkbox" id="out1" value={false} onChange={(e) => {
                                if (e.target.checked) {
                                    setOutOfStockFilter(true);
                                }
                                else {
                                    setOutOfStockFilter(false);
                                }
                            }} className='filter-checkbox' />
                            <label htmlFor="out1">Hide Out of Stock</label>
                        </div>
                        <button type='button' className='clear-filters-button secondary' onClick={() => {
                            document.getElementById("out1").checked = false;
                            setOutOfStockFilter(false);
                        }}>Clear</button>
                    </div>
                    
                    <div className='filter-section' id="brand">
                        <h4>Brand</h4>
                        {productBrands.map((brand, index) => {
                            return <div key={index} className='filter-item'>
                                <input id={`br${index}`} type="checkbox" onChange={(e) => {
                                    if (e.target.checked) {
                                        setBrandFilters([...brandFilters, brand])
                                    }
                                    else {
                                        let list = brandFilters.filter((br) => {
                                            return br != brand
                                        })
                                        setBrandFilters(list)
                                    }
                                }} className='filter-checkbox brand' />
                                <label htmlFor={`br${index}`}>{brand}</label>
                            </div>
                        })}
                        <button onClick={() => {
                            setBrandFilters([]);
                            for (const check of document.getElementsByClassName("filter-checkbox brand")) {
                                check.checked = false;
                            }
                        }} type='button' className="clear-filters-button secondary">Clear</button>
                    </div>
                </div>
            </div>

            {/* Right Content - Products */}
            <div className="products-section">
                <div className="products-header">
                    <div className='sorting-container'>
                        <span className='sort-caption'>Sort By: </span>
                        <select className='sorting-select-menu' onChange={(e) => {
                            let chosenSortingMethod = e.target.value;
                            setSortingModeIndex(chosenSortingMethod);
                        }}>
                            {
                                sortingMethods.map((method, index) => {
                                    return <option key={index} value={index} className="sorting-option">{method.name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="products-count">
                        <span>{numberOfFilteredProducts} Products</span>
                    </div>
                </div>
                
                {
                    productsListCopy[0] == "ERROR" ? 
                    <div className="empty-state">
                        <h3>Oops! Something went wrong</h3>
                        <p>We couldn't load the products. Please try refreshing the page.</p>
                        <button onClick={() => window.location.reload()}>Refresh Page</button>
                    </div> :
                    <div className="home-content"> 
                    {
                        numberOfFilteredProducts < 1 && (brandFilters.length > 0 || categoryFilters.length > 0)
                        ? <div className="empty-state">
                            <h3>No products found</h3>
                            <p>Try adjusting your filters to see more products.</p>
                            <button onClick={() => {
                                setCategoryFilters([]);
                                setBrandFilters([]);
                                setOutOfStockFilter(false);
                                setLowerPriceLimitFilter(lowerPriceLimit);
                                setUpperPriceLimitFilter(upperPriceLimit);
                            }}>Clear Filters</button>
                          </div>
                        : sortedAndFilteredProducts
                    }
                    </div>
                }
            </div>
        </div>
    </div>
}

export default Home;