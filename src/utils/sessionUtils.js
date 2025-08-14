// Simple session utilities without external dependencies

export const checkSessionTimeout = (token) => {
  if (!token) return true;
  
  // For now, we'll use a simple approach
  // In a real app, you'd decode the JWT and check expiration
  // For this demo, we'll assume tokens are valid for 8 hours
  const tokenTimestamp = localStorage.getItem('tokenTimestamp');
  if (!tokenTimestamp) return true;
  
  const now = Date.now();
  const tokenAge = now - parseInt(tokenTimestamp);
  const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  
  return tokenAge > maxAge;
};

export const setTokenTimestamp = () => {
  localStorage.setItem('tokenTimestamp', Date.now().toString());
};

export const clearTokenTimestamp = () => {
  localStorage.removeItem('tokenTimestamp');
}; 