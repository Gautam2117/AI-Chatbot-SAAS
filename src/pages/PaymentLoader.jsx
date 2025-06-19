import React from 'react';
import Lottie from 'react-lottie-player';
import loaderAnimation from '../assets/payment-loader.json';

const PaymentLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-200 to-pink-300 p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full flex flex-col items-center space-y-6">
        {/* Lottie loader or a custom animated spinner */}
        <Lottie
          loop
          animationData={loaderAnimation}
          play
          style={{ width: 150, height: 150 }}
        />
        <h2 className="text-2xl font-extrabold text-indigo-700 drop-shadow-md">
          ⏳ Verifying your payment...
        </h2>
        <p className="text-sm text-gray-600 text-center">
          Please wait while we securely verify your transaction. This may take a few moments.
        </p>
      </div>
    </div>
  );
};

export default PaymentLoader;
