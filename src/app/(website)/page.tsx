import Footer from "@/components/Common/Footer";
import HomeHeader from "@/components/Common/HomeHeader";
import React from "react";
export default function Home() {
 
  return (
    <>
    <HomeHeader />
  <div className="track-banner px-5 py-20 text-center text-white md:py-50 md:px-10 mt-24">
    <h1 className="text-5xl font-bold pb-10">Track Your SEO Performance in Real Time</h1>
    <p className="text-md font-400">Take full control of your SEO campaigns with TrackScop, the all-in-one keyword
      tracking and analytics dashboard designed for marketers, businesses, and agencies. Gain instant visibility into
      your website’s keyword rankings, traffic sources, and engagement metrics — all in one unified platform. Whether
      you’re optimizing a single site or managing multiple clients, TrackScop gives you real-time data and insights to
      make smarter, faster SEO decisions.
      <b>Start tracking your growth and see your rankings rise — all from a single dashboard.</b>
    </p>
  </div>
  <section className="px-5 py-10 text-center text-black md:py-20 md:px-10">
    <h2 className="text-3xl font-bold pb-8">
      Features – Everything You Need to Stay Ahead
    </h2>
    <p className="text-md font-400">TrackScop brings together the essential tools you need to monitor, analyze, and improve
      your SEO performance.</p>
    <div className="flex flex-col gap-5 justify-between items-start pt-10 md:flex-row md:gap-5">
      <div className="text-center md:w-1/5 p-10 shadow-2xl rounded-md">
        <img src="/images/Live Keyword Tracking.png" alt="" className="w-16 m-auto" />
        <h3 className="py-3 text-xl font-bold">Live Keyword Tracking</h3>
        <p>Keep a close eye on your keyword positions across different locations, devices, and search intents.</p>
      </div>
      <div className="text-center md:w-1/5 p-10 shadow-2xl rounded-md">
        <img src="/images/Google Search Console Integration.png" alt="" className="w-16 m-auto" />
        <h3 className="py-3 text-xl font-bold">Google Search Console Integration</h3>
        <p>View total clicks, impressions, CTR, and average ranking positions directly from your GSC data.</p>
      </div>
      <div className="text-center md:w-1/5 p-10 shadow-2xl rounded-md">
        <img src="/images/Google Analytics Insights.png" alt="" className="w-16 m-auto" />
        <h3 className="py-3 text-xl font-bold">Google Analytics Insights</h3>
        <p>Understand how users interact with your website — from where they come from to how long they engage.</p>
      </div>
      <div className="text-center md:w-1/5 p-10 shadow-2xl rounded-md">
        <img src="/images/Performance Reporting.png" alt="" className="w-16 m-auto" />
        <h3 className="py-3 text-xl font-bold">Performance Reporting</h3>
        <p>Generate detailed SEO reports in seconds to showcase progress to clients or stakeholders.</p>
      </div>
      <div className="text-center md:w-1/5 p-10 shadow-2xl rounded-md">
        <img src="/images/Campaign Management.png" alt="" className="w-16 m-auto" />
        <h3 className="py-3 text-xl font-bold">Campaign Management</h3>
        <p>Manage multiple websites or clients effortlessly with organized, data-rich dashboards.</p>
      </div>
    </div>
    <div className="pt-10">
      <p>Every feature is built to help you spend less time tracking and more time growing.</p>
    </div>
  </section>
  <section className="bg-[#273f4f] px-5 py-10 text-white text-center md:py-20 md:px-10">
    <h2 className="text-3xl font-bold pb-8">
      How It Works – Simple, Smart, and Scalable
    </h2>
    <p className="md:px-50 ">Getting started with TrackScop is quick and seamless. Connect your Google Search Console and
      Analytics accounts
      securely to pull in your live SEO data. Add your target keywords and select your preferred tracking locations.
      From there, TrackScop automatically updates your keyword rankings, visualizes your traffic data, and compiles
      performance trends over time.
    </p><br></br>
    <p className="md:px-50">You can easily export detailed reports or use the insights to refine your SEO strategies and
      achieve measurable
      results. With TrackScop, your optimization process becomes transparent, data-driven, and effortless.
    </p>
  </section>
  <section className="px-5 py-10 md:py-20 md:px-10">
    <div className="flex flex-col-reverse gap-5 justify-between items-center pt-10 md:flex-row md:gap-5">
      <div className="md:w-1/2">
        <h2 className="text-3xl font-bold pb-8">Why Choose TrackScop – Insights That Drive Growth</h2>
        <ul>
          <li className="pb-2"><b>Real-Time SEO Monitoring:</b> Instant visibility into keyword movements.</li>
          <li className="pb-2"><b>Data-Driven Decisions:</b> Unified data from GSC + GA in one platform.</li>
          <li className="pb-2"><b>Agency-Friendly Interface:</b> Manage multiple clients effortlessly.</li>
          <li className="pb-2"><b>Customizable Dashboards: </b>Focus on the metrics that matter most to you.</li>
          <li className="pb-2"><b>Reliable & Secure:</b> Built with performance and data privacy in mind.</li>
        </ul>
      </div>
      <div className="md:w-1/2">
        <img src="/images/Why Choose TrackScop.jpg" alt="" />
      </div>
    </div>
  </section>
  <section className="bg-[#d65d2d] px-5 py-10 text-white text-center md:py-20 md:px-10">
    <h2 className="text-3xl font-bold pb-8">
      Pricing / Get Started – Track Smarter, Grow Faster
    </h2>
    <p className="md:px-50 ">Whether you’re a solo marketer, small business, or full-scale SEO agency, TrackScop has a plan
      that fits your goals. Our flexible pricing gives you the power to scale your tracking needs as your business
      grows.
    </p><br></br>
    <p className="md:px-50">No setup costs, no hidden charges — just accurate, real-time SEO insights that help you make
      better decisions every day.
      <b>Join hundreds of marketers who trust TrackScop to track smarter, optimize faster, and grow stronger.</b>
    </p>
  </section>
 <Footer mainContainerId="main-scroll-container" />
    </>
  );
}
