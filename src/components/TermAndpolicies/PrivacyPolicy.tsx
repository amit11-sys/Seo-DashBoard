

import React from "react";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-6">Last Updated: 25-09-2025</p>

      <p className="mb-4">
        <a href="https://trackscop.com" className="text-blue-600 underline">
          https://trackscop.com/
        </a>{" "}
        values your privacy. This Privacy Policy explains how we collect, use,
        and protect your information when you use our reporting platform for SEO,
        PPC, and social media.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Personal Information: Name, email address, billing details, and login credentials.</li>
          <li>Usage Data: Reports generated, login activity, and tool interactions.</li>
          <li>Third-Party Data: Data retrieved from integrated platforms (Google Analytics, Google Ads, Meta Ads, etc.).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>To provide reporting and analytics features.</li>
          <li>To improve and optimize our Service.</li>
          <li>To process payments and manage subscriptions.</li>
          <li>To communicate updates, technical notices, or promotional offers (with your consent).</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>We do not sell your personal data.</li>
          <li>We may share necessary data with third-party service providers (payment processors, hosting providers, analytics tools).</li>
          <li>When you connect third-party platforms, we access reporting data as authorized by you.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Data Security</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>We use industry-standard security measures to protect your information.</li>
          <li>However, no online platform is 100% secure, and we cannot guarantee absolute security.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Cookies & Tracking</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>We may use cookies to improve user experience and analyze performance.</li>
          <li>You can control cookie preferences through your browser settings.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. User Rights</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>You may request access, correction, or deletion of your personal data.</li>
          <li>You may opt out of marketing communications at any time.</li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">7. Data Retention</h2>
        <p>We retain data only as long as necessary to provide the Service or comply with legal obligations.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">8. International Users</h2>
        <p>If you are accessing the Service outside of [Insert Country], your data may be transferred and stored in jurisdictions with different data protection laws.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">9. Updates to this Policy</h2>
        <p>We may update this Privacy Policy from time to time. Updates will be posted on this page with a new “Last Updated” date.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
        <p>
          For questions about this Privacy Policy, contact us at:{" "}
          <a href="https://trackscop.com" className="text-blue-600 underline">
            https://trackscop.com/
          </a>
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
