'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://695b96941d8041d5eeb770ce.mockapi.io/api/v1/users';

export default function EditUser({ params }) {
  const { id } = use(params);
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        
        if (!res.ok) {
          throw new Error(`Failed to fetch user: ${res.status}`);
        }
        
        const data = await res.json();
        setName(data.name || '');
        setEmail(data.email || '');
        setRole(data.role || '');
      } catch (err) {
        console.error('Error fetching user:', err);
        setError('Failed to load user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          role
        }),
      });

      router.push('/?message=' + encodeURIComponent('✅ User updated successfully!'));
    } catch (error) {
      alert('❌ Failed to update user. Please try again.');
    }
  };

  return (
    <main style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <Link 
        href="/" 
        style={{
          color: '#333',
          textDecoration: 'none',
          marginBottom: '20px',
          display: 'inline-block',
          fontSize: '14px',
          color: '#ffffff'
        }}
      >
        ← Back
      </Link>
      
      {loading ? (
        <div style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '30px'
        }}>
          <h1 style={{
            marginTop: 0,
            marginBottom: '25px',
            fontSize: '24px'
          }}>Edit User</h1>

          {/* Name label skeleton */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              height: '14px', 
              width: '15%', 
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '4px',
              marginBottom: '8px'
            }} />
            <div style={{ 
              height: '40px', 
              width: '100%', 
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '5px'
            }} />
          </div>

          {/* Email label skeleton */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ 
              height: '14px', 
              width: '15%', 
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '4px',
              marginBottom: '8px'
            }} />
            <div style={{ 
              height: '40px', 
              width: '100%', 
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '5px'
            }} />
          </div>

          {/* Role label skeleton */}
          <div style={{ marginBottom: '25px' }}>
            <div style={{ 
              height: '14px', 
              width: '15%', 
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '4px',
              marginBottom: '8px'
            }} />
            <div style={{ 
              height: '40px', 
              width: '100%', 
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '5px'
            }} />
          </div>

          {/* Button skeletons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ 
              flex: 1,
              height: '44px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '5px'
            }} />
            <div style={{ 
              flex: 1,
              height: '44px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              borderRadius: '5px'
            }} />
          </div>
        </div>
      ) : error ? (
        <div style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '30px'
        }}>
          <div style={{
            background: '#ffebee',
            color: '#c62828',
            padding: '12px 15px',
            borderRadius: '5px',
            marginBottom: '20px',
            fontSize: '14px',
            border: '1px solid #ef9a9a'
          }}>
            {error}
          </div>
          <Link 
            href="/"
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              background: '#333',
              color: 'white',
              borderRadius: '5px',
              textDecoration: 'none',
              fontSize: '14px'
            }}
          >
            Go Back to Users
          </Link>
        </div>
      ) : (
        <form onSubmit={handleUpdate} style={{
          background: '#fff',
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '30px'
        }}>
          <h1 style={{
            marginTop: 0,
            marginBottom: '25px',
            fontSize: '24px',
            color: '#000'
          }}>Edit User</h1>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              color: '#000'
            }}>Name</label>
            <input 
              value={name}
              onChange={e => setName(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: '#000'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
              color: '#000'
            }}>Email</label>
            <input 
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: '#000'
              }}
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{
              display: 'block',
              marginBottom: '6px',
              fontSize: '14px',
                color: '#000'
            }}>Role</label>
            <input 
              value={role}
              onChange={e => setRole(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                boxSizing: 'border-box',
                color: '#000'
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              type="submit"
              style={{
                flex: 1,
                background: '#333',
                color: 'white',
                padding: '12px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Update
            </button>
            <Link 
              href="/"
              style={{
                flex: 1,
                background: '#f0f0f0',
                color: '#333',
                padding: '12px',
                borderRadius: '5px',
                fontSize: '14px',
                textAlign: 'center',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Cancel
            </Link>
          </div>
        </form>
      )}
    </main>
  );
}
