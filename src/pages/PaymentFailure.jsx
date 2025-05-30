import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentFailure = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-200 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded shadow-lg max-w-md w-full space-y-4 text-center">
        <h1 className="text-3xl font-bold text-red-700">❌ Payment Failed!</h1>
        <p className="text-lg text-gray-800">
          Unfortunately, your payment could not be processed.
        </p>
        <p className="text-sm text-gray-500">
          Please check your payment details and try again. If the issue persists, contact support at <strong>botify.assist@gmail.com</strong>.
        </p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          🔙 Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentFailure;
