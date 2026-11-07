import React, { useState } from 'react';
import { User as UserIcon, MapPin, Plus, Trash2, CheckCircle2, Shield, Edit3, X, Save } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ShippingAddress } from '../../types';

interface ProfilePageProps {
  onNavigate: (route: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user, updateProfile, addShippingAddress, deleteShippingAddress, setDefaultAddress } = useAuth();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');

  // Add address modal
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    isDefault: false,
  });

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-900">Please sign in</h2>
        <p className="text-xs text-slate-500 mt-2">Sign in to manage your customer profile and saved addresses.</p>
        <button
          onClick={() => onNavigate('home')}
          className="mt-6 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: profileName.trim(),
      phone: profilePhone.trim(),
    });
    setIsEditingProfile(false);
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    await addShippingAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: user.name,
      email: user.email,
      phone: user.phone || '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      isDefault: false,
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner Profile Summary */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md text-white text-2xl font-black flex items-center justify-center border border-white/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <span className="px-2 py-0.5 rounded bg-white/20 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-1">{user.email}</p>
              <p className="text-xs text-blue-200 mt-0.5">Member since {new Date(user.joinedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Customer Stats Cards */}
          <div className="flex items-center gap-4 bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/20">
            <div className="px-3 border-r border-white/20 text-center">
              <span className="text-[11px] text-blue-200 uppercase tracking-wider block">Orders</span>
              <span className="text-lg font-bold tabular-nums">{user.totalOrders || 0}</span>
            </div>
            <div className="px-3 text-center">
              <span className="text-[11px] text-blue-200 uppercase tracking-wider block">Total Spent</span>
              <span className="text-lg font-bold tabular-nums">${(user.totalSpent || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Sections: Profile Details & Address Book */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Account Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserIcon className="w-4 h-4 text-blue-600" /> Account Details
              </h2>
              {!isEditingProfile && (
                <button
                  type="button"
                  onClick={() => {
                    setProfileName(user.name);
                    setProfilePhone(user.phone || '');
                    setIsEditingProfile(true);
                  }}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={e => setProfilePhone(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block">Name:</span>
                  <span className="font-semibold text-slate-900">{user.name}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Email Address:</span>
                  <span className="font-semibold text-slate-900">{user.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Phone:</span>
                  <span className="font-semibold text-slate-900">{user.phone || 'Not provided'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Role:</span>
                  <span className="font-semibold text-blue-600 capitalize">{user.role}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation Shortcuts
            </h3>
            <button
              onClick={() => onNavigate('tracking')}
              className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors flex justify-between items-center"
            >
              <span>View Past Orders & Tracking</span>
              <span className="text-blue-600">&rarr;</span>
            </button>
            <button
              onClick={() => onNavigate('wishlist')}
              className="w-full text-left p-3 rounded-xl border border-slate-100 hover:bg-slate-50 text-xs font-semibold text-slate-800 transition-colors flex justify-between items-center"
            >
              <span>View Saved Wishlist Items</span>
              <span className="text-blue-600">&rarr;</span>
            </button>
          </div>
        </div>

        {/* Right Column: Address Book Management (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-violet-600" /> Address Book
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Manage delivery addresses for quick 1-click checkout</p>
              </div>

              <button
                type="button"
                onClick={() => setIsAddingAddress(true)}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Add Address
              </button>
            </div>

            {/* Address List */}
            {user.savedAddresses.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-xl p-6">
                No saved addresses found. Add one above to speed up checkout.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.savedAddresses.map((addr, idx) => (
                  <div
                    key={addr.id || idx}
                    className={`p-4 rounded-xl border flex flex-col justify-between ${
                      addr.isDefault
                        ? 'border-blue-500 bg-blue-50/30 shadow-xs'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-900">{addr.fullName}</span>
                        {addr.isDefault ? (
                          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 text-[10px] font-bold">
                            Default
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setDefaultAddress(addr.id || idx)}
                            className="text-[10px] font-semibold text-slate-400 hover:text-blue-600"
                          >
                            Set Default
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-slate-600">{addr.street}</p>
                      <p className="text-xs text-slate-600">{addr.city}, {addr.state} {addr.postalCode}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{addr.phone}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                      <button
                        type="button"
                        onClick={() => deleteShippingAddress(addr.id || idx)}
                        className="text-xs text-slate-400 hover:text-rose-600 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {isAddingAddress && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">Add New Shipping Address</h3>
              <button onClick={() => setIsAddingAddress(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.fullName}
                  onChange={e => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    value={newAddr.phone}
                    onChange={e => setNewAddr({ ...newAddr, phone: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={newAddr.email}
                    onChange={e => setNewAddr({ ...newAddr, email: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={newAddr.street}
                  onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full text-xs p-2 rounded-lg border border-slate-200"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddr.city}
                    onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddr.state}
                    onChange={e => setNewAddr({ ...newAddr, state: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={newAddr.postalCode}
                    onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                    className="w-full text-xs p-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>
              <div className="pt-2">
                <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newAddr.isDefault}
                    onChange={e => setNewAddr({ ...newAddr, isDefault: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 accent-blue-600"
                  />
                  <span>Make this my default shipping address</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2 border border-slate-200 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
