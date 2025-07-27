import axios from 'axios';
import config from '../../config';
import './confirm.css';
import { toast } from 'react-toastify';
import { useState } from 'react';

function Confirm({userDetails, productsList, userCart, removeFromCart}) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState('');
    
    let totalPrice = 0;
    const tax = 6.8;
    let cartItems = productsList.filter((product) => {
        return (userCart.includes(product._id))
    });

    const subtotal = cartItems.reduce((sum, product) => sum + product.price, 0);
    const taxAmount = Math.ceil(subtotal * tax / 100);
    const grandTotal = subtotal + taxAmount;

    const handleConfirmOrder = () => {
        if (userCart.length < 1) {
            toast.error("Add some items to your cart first");
            return;
        }
        
        if (!selectedPayment) {
            toast.warning("Please select a payment method");
            return;
        }
        
        setIsLoading(true);
        const token = localStorage.getItem(config.localTokenKey);
        const cart = userCart;
        const orders = userDetails.orders || [];

        axios.put(config.getBackendUrl("/confirm-order"), {cart: cart, orders: orders}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((res) => {
            if (res.data.valid) {
                toast.success("Order Placed Successfully!");
                setTimeout(() => {
                    document.location.href = config.prefix;
                }, 1500);
            }
        })
        .catch((err) => {
            toast.error(err.response ? err.response.data.message : "Some error occurred");
        })
        .finally(() => {
            setIsLoading(false);
        });
    };

    return <div className={`confirm-main ${isLoading ? 'loading' : ''}`}>
        <div className="confirm-header">
            <h1>Checkout</h1>
            <p>Review your order and complete your purchase</p>
        </div>
        
        <div className="checkout-container">
            <div className="cart-items-div">
                <div className="cart-items-header">
                    <h2>Order Items ({cartItems.length})</h2>
                </div>
                
                {userCart.length > 0 ? (
                    cartItems.map((product) => (
                        <div className='cart-item' key={product._id}>
                            <img className='cart-img' src={product.photo} alt={product.title}/>
                            <h4 className='cart-title'>{product.title}</h4>
                            <span className='cart-price'>₹{product.price.toLocaleString()}</span>
                            <button className='remove-cart-item critical' onClick={() => {
                                removeFromCart(product._id);
                            }}>Remove</button>
                        </div>
                    ))
                ) : (
                    <div className='empty-cart'>
                        <h3>Your cart is empty</h3>
                        <p>Add some items to your cart to continue with checkout</p>
                        <button onClick={() => document.location.href = config.prefix}>
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
            
            <div className='payment-summary'>
                <div className="payment-summary-header">
                    <h2>Order Summary</h2>
                </div>
                
                <div className="summary-row">
                    <span className="summary-label">Subtotal</span>
                    <span className="summary-value">₹{subtotal.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                    <span className="summary-label">Tax ({tax}%)</span>
                    <span className="summary-value">₹{taxAmount.toLocaleString()}</span>
                </div>
                
                <div className="summary-row">
                    <span className="summary-label">Shipping</span>
                    <span className="summary-value">Free</span>
                </div>
                
                <div className="summary-row grand-total">
                    <span className="summary-label">Total</span>
                    <span className="summary-value">₹{grandTotal.toLocaleString()}</span>
                </div>
                
                <div className='payment-div'>
                    <h3>Payment Method</h3>
                    
                    <label className='pay-option'>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="netbanking"
                            checked={selectedPayment === 'netbanking'}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <span className="pay-option-label">Net Banking</span>
                        <span className="pay-option-icon">🏦</span>
                    </label>
                    
                    <label className='pay-option'>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="creditcard"
                            checked={selectedPayment === 'creditcard'}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <span className="pay-option-label">Credit Card</span>
                        <span className="pay-option-icon">💳</span>
                    </label>
                    
                    <label className='pay-option'>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="debitcard"
                            checked={selectedPayment === 'debitcard'}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <span className="pay-option-label">Debit Card</span>
                        <span className="pay-option-icon">💳</span>
                    </label>
                    
                    <label className='pay-option'>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="upi"
                            checked={selectedPayment === 'upi'}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <span className="pay-option-label">UPI / PayPal</span>
                        <span className="pay-option-icon">📱</span>
                    </label>
                    
                    <label className='pay-option'>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="wallet"
                            checked={selectedPayment === 'wallet'}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <span className="pay-option-label">Digital Wallets</span>
                        <span className="pay-option-icon">👛</span>
                    </label>
                    
                    <label className='pay-option'>
                        <input 
                            type="radio" 
                            name="payment" 
                            value="cod"
                            checked={selectedPayment === 'cod'}
                            onChange={(e) => setSelectedPayment(e.target.value)}
                        />
                        <span className="pay-option-label">Cash on Delivery</span>
                        <span className="pay-option-icon">💵</span>
                    </label>
                </div>
                
                <button 
                    className='confirm-order-button' 
                    onClick={handleConfirmOrder}
                    disabled={isLoading || userCart.length === 0}
                >
                    {isLoading ? 'Processing...' : 'Place Order'}
                </button>
            </div>
        </div>
    </div>
}

export default Confirm