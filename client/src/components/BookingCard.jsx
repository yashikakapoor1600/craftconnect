// client/src/components/BookingCard.jsx
import React from 'react';

// Yeh component artisan ke dashboard par ek booking ko dikhayega
const BookingCard = ({ booking, onStatusUpdate }) => {
    
    // Status ke hisaab se kaunsa agla action dikhana hai
    const getNextAction = (status) => {
        switch (status) {
            case 'Pending Confirmation':
                return { action: 'Confirm Booking', nextStatus: 'Confirmed' };
            case 'Confirmed':
                return { action: 'Start Journey (On The Way)', nextStatus: 'On The Way' };
            case 'On The Way':
                return { action: 'Arrived at Location', nextStatus: 'Arrived' };
            case 'Arrived':
                return { action: 'Start Work', nextStatus: 'Work In Progress' };
            case 'Work In Progress':
                return { action: 'Mark as Work Complete', nextStatus: 'Work Complete' };
            default:
                return null; // Work complete ke baad koi action nahi
        }
    };

    const nextAction = getNextAction(booking.status);

    return (
        <div style={{ border: '1px solid #007bff', borderRadius: '8px', padding: '15px', marginBottom: '15px', backgroundColor: '#fff', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h4>Booking from: {booking.customer.name}</h4>
            <p><strong>Customer Email:</strong> {booking.customer.email}</p>
            <p><strong>Booked On:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
            <p>
                <strong>Current Status: </strong>
                <span style={{ fontWeight: 'bold', color: '#dc3545' }}>
                    {booking.status}
                </span>
            </p>

            {/* Agla action button sirf tabhi dikhega jab koi agla action ho */}
            {nextAction && (
                <button 
                    onClick={() => onStatusUpdate(booking._id, nextAction.nextStatus)}
                    style={{ marginTop: '10px', padding: '8px 15px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px' }}
                >
                    {nextAction.action}
                </button>
            )}
        </div>
    );
};

export default BookingCard;