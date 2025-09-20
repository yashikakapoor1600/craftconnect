// client/src/components/OrderCard.jsx
import React from 'react';

const OrderCard = ({ order }) => {
    const getStatusColor = (status) => {
        switch (status) {
            case 'Pending Confirmation':
            case 'Confirmed':
                return '#ffc107'; // Yellow
            case 'On The Way':
            case 'Arrived':
            case 'Work In Progress':
                return '#007bff'; // Blue
            case 'Work Complete':
            case 'Payment Done':
                return '#28a745'; // Green
            case 'Cancelled':
                return '#dc3545'; // Red
            default:
                return '#6c757d'; // Grey
        }
    };

    const cardStyle = {
        borderLeft: `5px solid ${getStatusColor(order.status)}`,
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '15px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        textAlign: 'left'
    };

    return (
        <div style={cardStyle}>
            <h4>Booking with: {order.artisan.name}</h4>
            <p><strong>Service:</strong> {order.artisan.artisanInfo.serviceCategory}</p>
            <p><strong>Booked On:</strong> {new Date(order.bookingDate).toLocaleDateString()}</p>
            <p>
                <strong>Live Status: </strong>
                <span style={{ fontWeight: 'bold', color: getStatusColor(order.status) }}>
                    {order.status}
                </span>
            </p>
        </div>
    );
};

export default OrderCard;