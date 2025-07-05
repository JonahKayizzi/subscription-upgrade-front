import React from 'react';
import { useGetSubscribersQuery } from '../api/apiSlice';
import { useSelector } from 'react-redux';

export default function SubscribersList() {
  const token = useSelector(state => state.auth.token);
  const { data, error, isLoading } = useGetSubscribersQuery(undefined, { skip: !token });

  if (!token) return <div>Please log in to view subscribers.</div>;
  if (isLoading) return <div>Loading subscribers...</div>;
  if (error) return <div>Error loading subscribers.</div>;

  return (
    <ul>
      {data.map(sub => (
        <li key={sub.sub_id}>{sub.sub_name}</li>
      ))}
    </ul>
  );
} 