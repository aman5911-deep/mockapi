'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';

const API_URL = 'https://695ba32b1d8041d5eeb7b9fe.mockapi.io/api/v1/users';

interface User {
  id: string;
  createdAt: string;
  name: string;
  avatar: string;
  email: string;
  role: string;
  child?: {
    firstname: string;
    lastname: string;
  };
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Notification state
  const [notification, setNotification] = useState<string>('');
  
  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Child info modal state
  const [showChildModal, setShowChildModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState<{firstname: string; lastname: string} | null>(null);

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
      showNotification('❌ Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = (id: string) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await fetch(`${API_URL}/${userToDelete}`, {
          method: 'DELETE',
        });
        await fetchUsers();
        showNotification('✅ User deleted successfully!');
      } catch (error) {
        showNotification('❌ Failed to delete user');
      }
      closeDeleteModal();
    }
  };

  // Get unique roles for filter dropdown
  const uniqueRoles = useMemo(() => {
    const roles = users.map(user => user.role).filter(Boolean);
    return ['all', ...Array.from(new Set(roles))];
  }, [users]);

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter: check if name or email contains search term
      const matchesSearch = 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Role filter: check if user's role matches selected role
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
    
    // Check for success message in URL
    const params = new URLSearchParams(window.location.search);
    const message = params.get('message');
    if (message) {
      showNotification(decodeURIComponent(message));
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  return (
    <main style={{ 
      maxWidth: '900px', 
      margin: '0 auto', 
      padding: '40px 20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ 
              margin: '0 0 15px 0', 
              fontSize: '20px', 
              color: '#333' 
            }}>
              Confirm Delete
            </h2>
            <p style={{ 
              margin: '0 0 25px 0', 
              color: '#666', 
              fontSize: '14px',
              lineHeight: '1.5'
            }}>
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={closeDeleteModal}
                style={{
                  padding: '10px 20px',
                  background: '#f0f0f0',
                  color: '#333',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                style={{
                  padding: '10px 20px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Child Info Modal */}
      {showChildModal && selectedChild && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '10px',
            padding: '30px',
            maxWidth: '400px',
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
          }}>
            <h2 style={{ 
              margin: '0 0 20px 0', 
              fontSize: '20px', 
              color: '#333' 
            }}>
              Child Information
            </h2>
            <div style={{
              marginBottom: '15px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#666',
                marginBottom: '5px',
                fontWeight: '500'
              }}>First Name</label>
              <div style={{
                padding: '10px 15px',
                background: '#f5f5f5',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#333'
              }}>
                {selectedChild.firstname}
              </div>
            </div>
            <div style={{
              marginBottom: '25px'
            }}>
              <label style={{
                display: 'block',
                fontSize: '12px',
                color: '#666',
                marginBottom: '5px',
                fontWeight: '500'
              }}>Last Name</label>
              <div style={{
                padding: '10px 15px',
                background: '#f5f5f5',
                borderRadius: '5px',
                fontSize: '14px',
                color: '#333'
              }}>
                {selectedChild.lastname}
              </div>
            </div>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end' 
            }}>
              <button
                onClick={() => {
                  setShowChildModal(false);
                  setSelectedChild(null);
                }}
                style={{
                  padding: '10px 20px',
                  background: '#333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#333',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 1000,
          animation: 'slideIn 0.3s ease-out',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          {notification}
        </div>
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '2px solid #333',
        paddingBottom: '20px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Users</h1>
        <Link 
          href="/add" 
          style={{ 
            background: 'green',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            textDecoration: 'none',
            fontSize: '14px'
          }}
        >
          + Add User
        </Link>
      </div>

      {/* Search and Filter Section */}
      <div style={{ 
        marginBottom: '25px',
        display: 'flex',
        gap: '15px',
        flexWrap: 'wrap'
      }}>
        {/* Search Input */}
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input
            type="text"
            placeholder="🔍 Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
              color: '#ffffff'
            }}
          />
          {searchTerm && filteredUsers.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '5px',
              background: '#e8f5e9',
              border: '1px solid #4caf50',
              borderRadius: '5px',
              padding: '10px 15px',
              fontSize: '13px',
              color: '#2e7d32',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              ✅ {filteredUsers.length} user{filteredUsers.length !== 1 ? 's' : ''} found
            </div>
          )}
          {searchTerm && filteredUsers.length === 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: '5px',
              background: '#ffebee',
              border: '1px solid #f44336',
              borderRadius: '5px',
              padding: '10px 15px',
              fontSize: '13px',
              color: '#c62828',
              zIndex: 10,
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              ❌ No users found
            </div>
          )}
        </div>

        {/* Role Filter Dropdown */}
        <div style={{ flex: '0 1 200px' }}>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '5px',
              fontSize: '14px',
              boxSizing: 'border-box',
              color: '#000',
              cursor: 'pointer',
              background: 'white'
            }}
          >
            {uniqueRoles.map(role => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
              </option>
            ))}
          </select>
        </div>

        {/* Results Count */}
        <div style={{
          flex: '0 1 auto',
          display: 'flex',
          alignItems: 'center',
          padding: '10px 15px',
          background: '#f5f5f5',
          borderRadius: '5px',
          fontSize: '14px',
          color: '#666'
        }}>
          {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Users List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <div 
              key={item}
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '20px',
                background: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px'
              }}
            >
              <div style={{ flex: 1 }}>
                {/* Name skeleton */}
                <div style={{ 
                  height: '18px', 
                  width: '40%', 
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }} />
                {/* Email skeleton */}
                <div style={{ 
                  height: '14px', 
                  width: '60%', 
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '4px',
                  marginBottom: '8px'
                }} />
                {/* Role skeleton */}
                <div style={{ 
                  height: '20px', 
                  width: '25%', 
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '4px'
                }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                {/* Edit button skeleton */}
                <div style={{ 
                  width: '65px',
                  height: '36px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '5px'
                }} />
                {/* Delete button skeleton */}
                <div style={{ 
                  width: '75px',
                  height: '36px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  borderRadius: '5px'
                }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {currentUsers.map((user, index) => (
          <div 
            key={`${user.id}-${index}`} 
            style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              background: '#fff',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px'
            }}
          >
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#000' }}>{user.name}</h3>
              <p style={{ margin: '0 0 4px 0', color: '#666', fontSize: '14px' }}>{user.email}</p>
              <span style={{ 
                display: 'inline-block',
                background: '#f0f0f0',
                padding: '4px 10px',
                borderRadius: '4px',
                fontSize: '12px',
                color: '#555'
              }}>{user.role}</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>              {user.child && (
                <button
                  onClick={() => {
                    setSelectedChild(user.child!);
                    setShowChildModal(true);
                  }}
                  style={{ 
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Child
                </button>
              )}
              <Link 
                href={`/edit/${user.id}`}
                style={{ 
                  padding: '8px 16px',
                  background: '#0070f3',
                  color: 'white',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                Edit
              </Link>
              <button 
                onClick={() => openDeleteModal(user.id)}
                style={{ 
                  padding: '8px 16px',
                  background: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
          marginTop: '30px',
          paddingTop: '20px',
          borderTop: '1px solid #ddd'
        }}>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              background: currentPage === 1 ? '#e0e0e0' : '#333',
              color: currentPage === 1 ? '#999' : 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '8px 12px',
                  background: currentPage === page ? '#333' : 'white',
                  color: currentPage === page ? 'white' : '#333',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: currentPage === page ? 'bold' : 'normal'
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            style={{
              padding: '8px 16px',
              background: currentPage === totalPages ? '#e0e0e0' : '#333',
              color: currentPage === totalPages ? '#999' : 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#999',
          fontSize: '16px'
        }}>
          {users.length === 0 
            ? 'No users found. Add one to get started.'
            : 'No users match your search criteria.'}
        </div>
      )}
    </main>
  );
}
