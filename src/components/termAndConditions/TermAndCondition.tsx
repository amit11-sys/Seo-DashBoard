import React from "react";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full bg-orange-500 py-6 shadow-md mb-6">
        <h1 className="text-4xl font-extrabold text-white text-center">
          Terms & Conditions
        </h1>
      </header>

      {/* Content */}
      <div className="max-w-5xl w-full bg-white shadow-lg rounded-xl p-8 overflow-y-auto">
        {/* Introduction */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            Welcome to TrackScop. By accessing or using our website or services, you agree to comply with and be bound by these terms and conditions. Please read them carefully.
          </p>
        </section>

        {/* Use of Services */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">2. Use of Our Services</h2>
          <p className="text-gray-700 leading-relaxed">
            You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use the services in any way that could damage, disable, or overburden the website.
          </p>
        </section>

        {/* Intellectual Property */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">3. Intellectual Property</h2>
          <p className="text-gray-700 leading-relaxed">
            All content, trademarks, logos, and intellectual property on this website are the property of TrackScop or its licensors. You may not use, reproduce, or distribute any content without prior written permission.
          </p>
        </section>

        {/* Privacy Policy */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">4. Privacy Policy</h2>
          <p className="text-gray-700 leading-relaxed">
            Your privacy is important to us. Please review our Privacy Policy, which explains how we collect, use, and protect your personal information.
          </p>
        </section>

        {/* Limitation of Liability */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">5. Limitation of Liability</h2>
          <p className="text-gray-700 leading-relaxed">
            We shall not be liable for any direct, indirect, incidental, special, or consequential damages arising from your use of our services or inability to use them.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">6. Changes to Terms</h2>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to modify these Terms and Conditions at any time. Your continued use of the services constitutes acceptance of the updated terms.
          </p>
        </section>

        {/* Governing Law */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">7. Governing Law</h2>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
          </p>
        </section>

        {/* Contact */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">8. Contact Us</h2>
          <p className="text-gray-700 leading-relaxed">
            If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:contact@trackscop.com" className="text-blue-600 underline">contact@trackscop.com</a>.
          </p>
        </section>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-12 text-center">
          © {new Date().getFullYear()} TrackScop. All rights reserved.
        </p>
      </div>
    </div>
  );
}
