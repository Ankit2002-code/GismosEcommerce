import { useNavigate } from "react-router-dom";
import config from "../../config";
import './profile.css';
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Profile({userDetails}) {   
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    
    useEffect(() => {
        if (userDetails._id == null) {
            navigate(config.loginPage);
        }
    }, [userDetails._id, navigate]);
    
    const handleLogout = () => {
        setIsLoading(true);
        setTimeout(() => {
            sessionStorage.clear();
            localStorage.clear();
            toast.success("Logged Out Successfully");
            document.location.href = config.prefix;
        }, 500);
    };

    const getInitials = (name) => {
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    const getMemberSince = () => {
        const date = new Date();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
    };
    
    return <div className="profile-main">
        <div className="profile-header">
            <h1>My Profile</h1>
            <p>Manage your account settings and view your information</p>
        </div>
        
        <div className={`profile-card ${isLoading ? 'loading' : ''}`}>
            <div className="profile-avatar">
                {getInitials(userDetails.name)}
            </div>
            
            <div className="profile-info">
                <div className="info-group">
                    <div className="info-label">Full Name</div>
                    <div className="info-value">{userDetails.name}</div>
                </div>
                
                <div className="info-group">
                    <div className="info-label">Email Address</div>
                    <div className="info-value">{userDetails.email}</div>
                </div>
                
                <div className="info-group">
                    <div className="info-label">Member Since</div>
                    <div className="info-value">{getMemberSince()}</div>
                </div>
            </div>
            
            <div className="profile-stats">
                <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Orders</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Wishlist</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">0</div>
                    <div className="stat-label">Reviews</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">Satisfaction</div>
                </div>
            </div>
            
            <div className="profile-actions">
                <button className="profile-button secondary">
                    Edit Profile
                </button>
                <button className="profile-button secondary">
                    Change Password
                </button>
                <button className="profile-button secondary">
                    Notification Settings
                </button>
                <button className="logout-button" onClick={handleLogout} disabled={isLoading}>
                    {isLoading ? 'Logging Out...' : 'Logout'}
                </button>
            </div>
        </div>
    </div>
}

export default Profile;