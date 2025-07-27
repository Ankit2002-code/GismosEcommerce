import config from "../../config";
import './orders.css'
import { useEffect } from 'react';

function Orders({currentUser, productsList}) {
    useEffect(() => {
        if (currentUser._id == null) {
            document.location.href = config.prefix;
            return;
        }
    }, [currentUser._id]);

    if (currentUser._id == null) {
        return null;
    }

    const userOrders = currentUser.orders || [];
    const userOrdersObjs = productsList.filter((product) => {
        return userOrders.includes(product._id)
    });

    const getOrderStatus = () => {
        const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
        return statuses[Math.floor(Math.random() * statuses.length)];
    };

    const getEstimatedDelivery = () => {
        const days = Math.floor(Math.random() * 7) + 3;
        return `${days}-${days + 2} days`;
    };

    const getOrderDate = () => {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    return <div className="orders-main">
        <div className="orders-header">
            <h1>My Orders</h1>
            <p>Track your orders and view order history</p>
        </div>
        
        <div className="orders-list-div">
            {userOrdersObjs.length === 0 ? (
                <div className="orders-empty">
                    <h3>No Orders Yet</h3>
                    <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
                    <button onClick={() => document.location.href = config.prefix}>
                        Start Shopping
                    </button>
                </div>
            ) : (
                userOrdersObjs.map((product, index) => {
                    const status = getOrderStatus();
                    const deliveryDate = getEstimatedDelivery();
                    const orderDate = getOrderDate();
                    
                    return (
                        <div className="order-item" key={product._id}>
                            <div className="order-photo-container">
                                <img src={product.photo} alt={product.title} className="order-photo" />
                            </div>
                            
                            <div className="order-details">
                                <h3 className="order-title">{product.title}</h3>
                                <p className="order-description">{product.description}</p>
                                
                                <div className="order-meta">
                                    <div className="order-meta-item">
                                        Ordered on {orderDate}
                                    </div>
                                    <div className="order-meta-item">
                                        Estimated delivery: {deliveryDate}
                                    </div>
                                </div>
                                
                                <h2 className="order-price">{product.price.toLocaleString()}</h2>
                                
                                <div className={`order-status ${status}`}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </div>
                            </div>
                            
                            <div className="order-actions">
                                <button className="order-action-button">
                                    Track Order
                                </button>
                                <button className="order-action-button secondary">
                                    View Details
                                </button>
                                <button className="order-action-button secondary">
                                    Download Invoice
                                </button>
                                {status === 'delivered' && (
                                    <button className="order-action-button">
                                        Write Review
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    </div>
}

export default Orders