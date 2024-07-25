import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChatState } from '../../contextApi/ChatProvider';
import './loggedUserProfile.css';

export const LoggedUserProfile = () => {
    const { user, setUser } = ChatState();
    const [editMode, setEditMode] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', pic: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const config = {
                    withCredentials: true,
                };
                const { data } = await axios.get('http://localhost:5000/api/user/profile', config);
                setUser(data);
                setFormData({ name: data.name, email: data.email, pic: data.pic });
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
    };

    const handlePasswordClick = () => {
        setPasswordMode(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData({ ...passwordData, [name]: value });
    };

    const handleSaveClick = async () => {
        try {
            const config = {
                withCredentials: true,
            };
            const { data } = await axios.put('http://localhost:5000/api/user/profile', formData, config);
            localStorage.setItem('userInfo', JSON.stringify(data));
            setUser(data);
            setEditMode(false);
        } catch (error) {
            console.error("Error updating user data", error);
        }
    };

    const handlePasswordSaveClick = async () => {
        try {
            const config = {
                withCredentials: true,
            };
            const { data } = await axios.put('http://localhost:5000/api/user/profile/password', passwordData, config);
            alert(data.message);
            setPasswordMode(false);
            setPasswordData({ currentPassword: '', newPassword: '' });
        } catch (error) {
            console.error("Error updating password", error);
            alert("Error updating password: " + error.response.data.message);
        }
    };

    return (
        <div className="user-profile-container">
            <div className="user-profile-header">
                <h2>User Profile</h2>
            </div>
            <div className="user-profile-picture">
                <img src={user.pic} alt="User Pic" />
            </div>
            <div className="user-profile-detail">
                <strong>Name:</strong>
                {editMode ? (
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                ) : (
                    <span>{user.name}</span>
                )}
            </div>
            <div className="user-profile-detail">
                <strong>Email:</strong>
                {editMode ? (
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                ) : (
                    <span>{user.email}</span>
                )}
            </div>
            {editMode && (
                <div className="user-profile-save">
                    <button onClick={handleSaveClick}>Save</button>
                </div>
            )}
            <div className="user-profile-actions">
                <button onClick={handleEditClick}>Edit Details</button>
                <button onClick={handlePasswordClick}>Change Password</button>
            </div>
            {passwordMode && (
                <div className="user-profile-password">
                    <div className="user-profile-detail">
                        <strong>Current Password:</strong>
                        <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} />
                    </div>
                    <div className="user-profile-detail">
                        <strong>New Password:</strong>
                        <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                    </div>
                    <div className="user-profile-save">
                        <button onClick={handlePasswordSaveClick}>Save Password</button>
                    </div>
                </div>
            )}
        </div>
    );
};