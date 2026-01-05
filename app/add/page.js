'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API_URL = 'https://695b96941d8041d5eeb770ce.mockapi.io/api/v1/users';

export default function AddUser() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [nameWarning, setNameWarning] = useState('');
  const [emailWarning, setEmailWarning] = useState('');
  const router = useRouter();

  // Real-time name check
  useEffect(() => {
    if (name.trim().length === 0) {
      setNameWarning('');
      return;
    }

    const checkName = async () => {
      try {
        const response = await fetch(API_URL);
        const users = await response.json();
        const nameExists = users.some(user => 
          user.name.toLowerCase() === name.toLowerCase()
        );
        
        if (nameExists) {
          setNameWarning('⚠️ This name already exists. Please choose another name.');
        } else {
          setNameWarning('');
        }
      } catch (error) {
        console.error('Error checking name:', error);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(checkName, 500);
    return () => clearTimeout(timeoutId);
  }, [name]);

  // Real-time email check
  useEffect(() => {
    if (email.trim().length === 0) {
      setEmailWarning('');
      return;
    }

    const checkEmail = async () => {
      try {
        const response = await fetch(API_URL);
        const users = await response.json();
        const emailExists = users.some(user => 
          user.email.toLowerCase() === email.toLowerCase()
        );
        
        if (emailExists) {
          setEmailWarning('⚠️ This email already exists. Please use another email.');
        } else {
          setEmailWarning('');
        }
      } catch (error) {
        console.error('Error checking email:', error);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Prevent submission if warnings exist
    if (nameWarning || emailWarning) {
      setError('❌ Please fix the errors before submitting.');
      return;
    }

    try {
      // Add the new user
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name, 
          email, 
          role,
          avatar: 'https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/1.jpg'
        }),
      });

      router.push('/?message=' + encodeURIComponent('✅ User added successfully!'));
    } catch (error) {
      setError('❌ Failed to add user. Please try again.');
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
          color: '#ffffff',
          textDecoration: 'none',
          marginBottom: '20px',
          display: 'inline-block',
          fontSize: '14px'
        }}
      >
        ← Back
      </Link>
      
      <form onSubmit={handleSubmit} style={{
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
        }}>Add New User</h1>

        {/* Error Message */}
        {error && (
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
        )}

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
              border: nameWarning ? '1px solid #ff9800' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
              color: '#000'
            }}
          />
          {nameWarning && (
            <div style={{
              marginTop: '8px',
              color: '#ff6f00',
              fontSize: '13px',
              background: '#fff3e0',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ffb74d'
            }}>
              {nameWarning}
            </div>
          )}
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
              border: emailWarning ? '1px solid #ff9800' : '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
              color: '#000'
            }}
          />
          {emailWarning && (
            <div style={{
              marginTop: '8px',
              color: '#ff6f00',
              fontSize: '13px',
              background: '#fff3e0',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ffb74d'
            }}>
              {emailWarning}
            </div>
          )}
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
            Add User
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
    </main>
  );
}
