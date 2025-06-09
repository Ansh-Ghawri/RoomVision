import React, { useEffect, useState } from 'react';
import { useProfile } from '../hooks/useProfile';

const styleOptions = [
  'Modern', 'Scandinavian', 'Minimalist', 'Traditional', 'Industrial', 'Bohemian'
];
const colorOptions = [
  '#f8f8f8', '#070707', '#e0c097', '#b5c9c3', '#d1a7a0', '#a3b18a', '#f7b267', '#f4845f'
];

const UserProfile = () => {
  const { profile, loading, error, fetchProfile, saveProfile } = useProfile();
  const [form, setForm] = useState({ style: '', color: '', budget: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color) => {
    setForm((prev) => ({ ...prev, color }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-lg mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">Your Style Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Preferred Style</label>
          <select
            name="style"
            value={form.style}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Select a style</option>
            {styleOptions.map((style) => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Favorite Color</label>
          <div className="flex gap-2 mb-2">
            {colorOptions.map((color) => (
              <button
                key={color}
                type="button"
                className={`w-8 h-8 rounded-full border-2 ${form.color === color ? 'border-purple-500' : 'border-gray-200'}`}
                style={{ background: color }}
                onClick={() => handleColorSelect(color)}
                aria-label={color}
              />
            ))}
          </div>
        </div>
        <div>
          <label className="block text-gray-700 font-medium mb-2">Budget (USD)</label>
          <input
            type="number"
            name="budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            min="0"
            placeholder="e.g. 2000"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 transition-colors"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
        {saved && <div className="text-green-600 text-center font-medium">Preferences saved!</div>}
        {error && <div className="text-red-600 text-center font-medium">{error}</div>}
      </form>
    </div>
  );
};

export default UserProfile; 