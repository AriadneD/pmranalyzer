import React, { useState } from "react";

const QuestionBubble = ({ content }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative inline-block">
      {/* Circle with Question Icon */}
      <div
        className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white cursor-pointer hover:bg-sky-700 transition"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <i className="fas fa-question-circle text-sky"></i>
      </div>

      {/* Tooltip Popover */}
      {isHovered && (
        <div className="absolute right-12 bottom-0 w-96 bg-white shadow-lg rounded-lg p-4 text-left z-10">
          <div className="text-gray-800">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">What You Can Upload:</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Interview Transcripts:</span> Otter.ai, Zoom, Teams
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Meeting Notes:</span> From Focus Groups
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Survey Results:</span> Google Forms, Typeform, SurveyMonkey
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Support Tickets:</span> Zendesk, Freshdesk
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Feedback from CRMs:</span> Salesforce, HubSpot, Zoho
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">User Reviews:</span> Trustpilot, G2, Yelp, Amazon, App Store, Google Play
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Chat Logs:</span> Intercom, Drift, LiveChat
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Public Market Research Data:</span> IBISWorld, Statista Summaries
                </p>
              </li>
              <li className="flex items-start">
                <span className="text-watermelon font-bold text-lg mr-2">•</span>
                <p className="text-gray-700">
                  <span className="font-semibold text-sky-600">Social Listening Data:</span> Hootsuite, Brandwatch, Sprout Social, Reddit, Discord
                </p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionBubble;