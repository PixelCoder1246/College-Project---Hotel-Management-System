import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { getProfile, updateProfile, getBookingHistory } from '../services/user.service';
import type { Booking } from '../types/user.types';
import '../styles/profile.css';

export default function ProfilePage() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(authUser);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    bio: '',
    profilePic: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          getProfile(),
          getBookingHistory()
        ]);
        
        if (profileRes.status === 'success') {
          setUser(profileRes.data.user);
          setFormData({
            name: profileRes.data.user.name || '',
            phone: profileRes.data.user.phone || '',
            address: profileRes.data.user.address || '',
            bio: profileRes.data.user.bio || '',
            profilePic: profileRes.data.user.profilePic || '',
          });
        }
        
        if (bookingsRes.status === 'success') {
          setBookings(bookingsRes.data.bookings);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing && user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || '',
        profilePic: user.profilePic || '',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    // Omit optional fields if they are empty
    const payload: Partial<typeof formData> = { name: formData.name };
    if (formData.phone) payload.phone = formData.phone;
    if (formData.address) payload.address = formData.address;
    if (formData.bio) payload.bio = formData.bio;
    if (formData.profilePic) payload.profilePic = formData.profilePic;

    try {
      const res = await updateProfile(payload);
      if (res.status === 'success') {
        setUser(res.data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(res.message || 'Failed to update profile');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-container">
        <section className="profile-header">
          <div className="profile-header__info">
            <div className="profile-avatar overflow-hidden">
              {user.profilePic ? (
                <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="profile-title">
              <h1 className="profile-title__name">{user.name}</h1>
              <p className="profile-title__email">{user.email}</p>
            </div>
          </div>
          <button
            className={`btn ${isEditing ? 'btn--secondary' : 'btn--primary'}`}
            onClick={handleEditToggle}
            disabled={isUpdating}
          >
            {isEditing ? 'Cancel Editing' : 'Edit Profile'}
          </button>
        </section>

        <div className="profile-grid">
          <section className="profile-card">
            <h2 className="profile-card__title">
              <span>👤</span> {isEditing ? 'Edit Profile Information' : 'Account Details'}
            </h2>

            {isEditing ? (
              <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address" className="form-label">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    className="form-input"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="profilePic" className="form-label">Profile Image URL</label>
                  <input
                    type="url"
                    id="profilePic"
                    name="profilePic"
                    className="form-input"
                    value={formData.profilePic}
                    onChange={handleInputChange}
                    placeholder="https://example.com/photo.jpg"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="bio" className="form-label">Biography</label>
                  <textarea
                    id="bio"
                    name="bio"
                    className="form-input"
                    rows={4}
                    value={formData.bio}
                    onChange={handleInputChange}
                    style={{ resize: 'none' }}
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn--primary" disabled={isUpdating}>
                    {isUpdating ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setIsEditing(false)}
                    disabled={isUpdating}
                  >
                    Discard
                  </button>
                </div>
              </form>
            ) : (
              <div className="profile-details">
                <div className="detail-item">
                  <span className="detail-label">Full Name</span>
                  <span className="detail-value">{user.name}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{user.phone || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Address</span>
                  <span className="detail-value">{user.address || 'Not provided'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Bio</span>
                  <span className="detail-value">{user.bio || 'No bio yet.'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Account Role</span>
                  <span className="detail-value text-accent">{user.role}</span>
                </div>
              </div>
            )}
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">
              <span>📅</span> Booking History
            </h2>
            <div className="booking-history">
              {bookings.length > 0 ? (
                <div className="booking-list">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="booking-item">
                      {/* Booking card design can be expanded here */}
                      <p>Booking ID: {booking.id.slice(0, 8)}...</p>
                      <p>Status: {booking.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-state__icon">📭</div>
                  <p className="empty-state__text">
                    Your booking history is currently empty. Start exploring rooms to make your first reservation!
                  </p>
                  <button className="btn btn--secondary btn--sm" style={{ marginTop: '12px' }}>
                    Browse Rooms
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
