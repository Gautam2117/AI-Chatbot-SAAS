import React from 'react';

const PaymentLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center space-y-4">
        <div className="loader ease-linear rounded-full border-8 border-t-8 border-indigo-500 h-32 w-32"></div>
        <p className="text-lg font-medium text-indigo-600">Verifying your payment...</p>
      </div>
    </div>
  );
};

export default PaymentLoader;
