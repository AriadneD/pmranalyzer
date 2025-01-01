import React, { useState, useEffect } from "react";
import TranscriptUploader from "./TranscriptUploader";
import PMRTable from "./PMRTable";
import GenerateClustersButton from "./GenerateClustersButton"; 
import UserSimilarityMap from "./UserSimilarityMap";
import { generateUserClusters } from "../services/UserMapService";
import { getPMRFromTranscript } from "../services/GPT4MiniService";
import { savePMR, fetchPMR, deletePMR, updatePMR } from "../services/firestoreService";
import ActionableInsightsButton from "./ActionableInsightsButton";
import ActionableInsightsGraph from "./ActionableInsightsGraph";
import ActionableInsightsMarkdown from "./ActionableInsightsMarkdown";
import { generateActionableInsights } from "../services/ActionableInsightsService";
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import QuestionBubble from "./QuestionBubble";
import GenerateSurveyButton from "./GenerateSurveyButton";
import SurveyQuestionsDisplay from "./SurveyQuestionsDisplay";
import { generateSurveyQuestions } from "../services/surveyService";
import Popup from "./Popup";
import GenerateInfographicButton from "./GenerateInfographicButton"; // Import the button
import InfographicDisplay from "./InfographicDisplay"; // Import the infographic component
import { generateInfographicData } from "../services/InfographicService"; // Import the service


function PMRDashboard({ user }) {
  const [pmrEntries, setPmrEntries] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup state
  const [popupContent, setPopupContent] = useState(null); // Popup content
  const [popupTitle, setPopupTitle] = useState(""); // Popup title
  const [surveyQuestions, setSurveyQuestions] = useState(null);
  const [infographic, setInfographic] = useState(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  useEffect(() => {
    // Fetch existing PMR entries on component mount
    loadPMREntries();
  }, []);

  const loadPMREntries = async () => {
    try {
      setLoading(true);
      const data = await fetchPMR(user.uid);
      setPmrEntries(data);
    } catch (err) {
      console.error("Error loading PMR entries:", err);
      setError("Failed to load PMR entries.");
    } finally {
      setLoading(false);
    }
  };

  const handleTranscriptUpload = async (transcriptText) => {
    try {
        setLoading(true);
        setError("");

        // 1. Call the LLM to get PMR structure
        let pmrDataString = await getPMRFromTranscript(transcriptText);

        // 2. Remove Markdown-style formatting (if present)
        pmrDataString = pmrDataString.replace(/```json|```/g, "").trim(); // Remove backticks and extra whitespace

        // 3. Parse the stringified JSON into a JavaScript object
        const pmrData = JSON.parse(pmrDataString);

        // 4. Save PMR to Firestore
        await savePMR(user.uid, pmrData);

        // 5. Display a success message with the name of the user in the PMR data
        const userName = pmrData.name || "Unknown"; // Fallback to 'Unknown' if name is not provided
        //alert(`Transcript has been uploaded as: ${userName}`);

        // 6. Refresh local data
        await loadPMREntries();
    } catch (err) {
        console.error("Error handling transcript upload:", err);
        setError("Failed to process the transcript. Please try again.");
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async (pmrId) => {
    try {
      setLoading(true);
      await deletePMR(user.uid, pmrId); // Delete the PMR entry
      await loadPMREntries(); // Refresh the local data
    } catch (err) {
      console.error("Error deleting PMR entry:", err);
      setError("Failed to delete the PMR entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (pmrId, updatedData) => {
    try {
      setLoading(true);
      await updatePMR(user.uid, pmrId, updatedData); // Update the PMR entry
      await loadPMREntries(); // Refresh the local data
    } catch (err) {
      console.error("Error updating PMR entry:", err);
      setError("Failed to update the PMR entry. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  

  const [clusters, setClusters] = useState(null);
  const [insights, setInsights] = useState(null);

  const handleGenerateClusters = async () => {
    if (clusters) {
      // Show existing clusters
      setPopupTitle("User Clusters");
      setPopupContent(
        <div>
          <UserSimilarityMap clusters={clusters} />
          <button
            onClick={regenerateClusters}
            className="mt-4 bg-watermelon text-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-watermelon transition"
          >
            Generate Again
          </button>
        </div>
      );
      setIsPopupOpen(true);
      return;
    }
  
    // Generate new clusters
    await regenerateClusters();
  };
  
  const regenerateClusters = async () => {
    try {
      setLoading(true);
      const clusterData = await generateUserClusters(pmrEntries);
      setClusters(clusterData.clusters);
      setPopupTitle("User Clusters");
      setPopupContent(
        <div>
          <UserSimilarityMap clusters={clusterData.clusters} />
          <button
            onClick={regenerateClusters}
            className="mt-4 bg-watermelon text-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-watermelon transition"
          >
            Generate Again
          </button>
        </div>
      );
      setIsPopupOpen(true);
    } catch (error) {
      setError("Failed to generate clusters.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGenerateInsights = async () => {
    if (insights) {
      // Show existing insights
      setPopupTitle("Actionable Insights");
      setPopupContent(
        <div>
          <ActionableInsightsGraph painPoints={insights.painPoints} />
          <ActionableInsightsMarkdown suggestions={insights.suggestions} />
          <button
            onClick={regenerateInsights}
            className="mt-4 bg-watermelon text-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-watermelon transition"
          >
            Generate Again
          </button>
        </div>
      );
      setIsPopupOpen(true);
      return;
    }
  
    // Generate new insights
    await regenerateInsights();
  };
  
  const regenerateInsights = async () => {
    try {
      setLoading(true);
      const result = await generateActionableInsights(pmrEntries);
      setInsights(result);
      setPopupTitle("Actionable Insights");
      setPopupContent(
        <div>
          <ActionableInsightsGraph painPoints={result.painPoints} />
          <ActionableInsightsMarkdown suggestions={result.suggestions} />
          <button
            onClick={regenerateInsights}
            className="mt-4 bg-watermelon text-white px-4 py-2 rounded font-semibold hover:bg-white hover:text-watermelon transition"
          >
            Generate Again
          </button>
        </div>
      );
      setIsPopupOpen(true);
    } catch (err) {
      setError("Failed to generate insights. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  

  const handleGenerateSurvey = async () => {
    if (surveyQuestions) {
      setPopupTitle("Survey Questions");
      setPopupContent(
        <SurveyQuestionsDisplay
          questions={surveyQuestions}
          onRegenerate={handleRegenerateSurvey}
          loading={loading} // Pass the loading state
        />
      );
      setIsPopupOpen(true);
      return;
    }
  
    try {
      setLoading(true);
      const questions = await generateSurveyQuestions(pmrEntries);
      setSurveyQuestions(questions);
      setPopupTitle("Survey Questions");
      setPopupContent(
        <SurveyQuestionsDisplay
          questions={questions}
          onRegenerate={handleRegenerateSurvey}
          loading={loading} // Pass the loading state
        />
      );
      setIsPopupOpen(true);
    } catch (err) {
      setError("Failed to generate survey questions.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleRegenerateSurvey = async () => {
    console.log("Button clicked: Setting loading to true");
    setLoading(true); // Updates state asynchronously
  
    try {
      const questions = await generateSurveyQuestions(pmrEntries); // Call to your API/service
      console.log("Questions generated:", questions);
  
      // Update questions and popup content
      setSurveyQuestions(questions);
      setPopupContent(
        <SurveyQuestionsDisplay
          questions={questions}
          onRegenerate={handleRegenerateSurvey}
          loading={false} // Pass loading to child
        />
      );
    } catch (error) {
      console.error("Error generating survey questions:", error);
    } finally {
      console.log("Setting loading to false");
      setLoading(false); // React will re-render after this
    }
  };


  const handleGenerateInfographic = async () => {
    if (infographic) {
      // If already generated, open the popup with existing infographic
      setPopupTitle("Market Trends and Opportunities");
      setPopupContent(
        <InfographicDisplay
          data={infographic}
          onRegenerate={handleRegenerateInfographic}
          loading={loading}
        />
      );
      setIsPopupOpen(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateInfographicData(pmrEntries); // Call the service
      setInfographic(data);
      setPopupTitle("Market Trends and Opportunities");
      setPopupContent(
        <InfographicDisplay
          data={data}
          onRegenerate={handleRegenerateInfographic}
          loading={loading}
        />
      );
      setIsPopupOpen(true); // Open the popup
    } catch (err) {
      console.error("Failed to generate infographic:", err);
      setError("Failed to generate infographic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateInfographic = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await generateInfographicData(pmrEntries); // Call the service
      setInfographic(data); // Update the infographic data
      setPopupContent(
        <InfographicDisplay
          data={data}
          onRegenerate={handleRegenerateInfographic}
          loading={loading}
        />
      );
    } catch (err) {
      console.error("Failed to regenerate infographic:", err);
      setError("Failed to regenerate infographic. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow-md rounded p-6 mt-4">
      {/* Jump to Section */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-2">Jump to Section</h3>
        <ul className="list-disc ml-6 text-blue-600">
          <li>
            <a href="#upload-pmr" className="hover:underline">
              1. Upload PMR Documents
            </a>
          </li>
          <li>
            <a href="#view-entries" className="hover:underline">
              2. View & Search Entries
            </a>
          </li>
          <li>
            <a href="#get-insights" className="hover:underline">
              3. Get Insights
            </a>
          </li>
        </ul>
      </div>
  
      {/* Section 1: Upload PMR Documents */}
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <h2 id="upload-pmr" className="text-2xl font-bold text-gray-800 mb-4">
          1. Upload Product Market Research (PMR) Documents
        </h2>
        <a href="#" className="bg-sky px-4 py-2 rounded text-white font-semibold hover:bg-lightsky transition">Back to Top</a>
      </div>
      
      <p className="text-lg text-gray-600 mb-6">
        If you are an early-stage founder, analyzing your PMR used to be time-consuming, manual, and confusing. 
        Not anymore! 
      </p>
      <p className="text-lg text-gray-600 mb-6">
        Imagine NotebookLM meets entrepreneurship.
        Simply upload the transcripts or meeting notes from when you talked to users-
        You'll be amazed at how quickly we help you:
      </p>

      <ul className="text-lg text-gray-600 mb-6">
        <li>
          1. Understand your users better 
        </li>
        <li> 
          2. Know what to build next
        </li>
        <li>
          3. Conduct follow up customer interviews
        </li>
        <li>
          4. Understand your market
        </li>
        <li>
          5. Put it all into visual, interactive formats you can easily save and share with your team!
        </li>
      </ul>
      
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <TranscriptUploader onUpload={handleTranscriptUpload} />
        <p className="text-lg text-gray-600 mb-6">
          We currently support the following file formats: DOCX, TXT, PDF. <QuestionBubble />
        </p>
      </div>

      
     
      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
  
      {/* Section 2: View & Search Entries */}
      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <h2 id="view-entries" className="text-2xl font-bold text-gray-800 mb-4">
          2. View & Search Entries
        </h2>
        <a href="#" className="bg-sky px-4 py-2 rounded text-white font-semibold hover:bg-lightsky transition">Back to Top</a>
      </div>
      
      <PMRTable pmrEntries={pmrEntries} onDelete={handleDelete} onEdit={handleEdit} />
      <br />
  
      {/* Section 3: Get Insights */}
      

      <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
        <h2 id="get-insights" className="text-2xl font-bold text-gray-800 mb-4">
          3. Get Insights
        </h2>
        <a href="#" className="bg-sky px-4 py-2 rounded text-white font-semibold hover:bg-lightsky transition">Back to Top</a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mt-4">
        {/* Card 1: Generate Clusters */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Understand your Users</h3>
          <p className="text-gray-600 mb-6">
          Discover potential markets with K-Means clustering that groups your users by shared characteristics. 
          Generate personas for each user type to uncover their motivations and understand what drives them to buy. 
          Use this insight to identify viable market opportunities.
          </p>
          <GenerateClustersButton onClick={handleGenerateClusters} loading={loading} />
        </div>

        {/* Card 2: Actionable Insights */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Get Inspired on what to Build Next</h3>
          <p className="text-gray-600 mb-6">
          Pinpoint the top 5 challenges your users face, helping you focus on solving the most impactful problems. 
          Get 5 actionable product ideas tailored to these pain points, giving you a clear roadmap to start building and delivering value.
          </p>
          <ActionableInsightsButton onClick={handleGenerateInsights} loading={loading} />
        </div>

        {/* Card 3: Generate Survey */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Generate Better Follow-Up Questions</h3>
          <p className="text-gray-600 mb-6">
          Generate 20 targeted survey questions to use in follow-up customer interviews to dig deeper into user needs and refine your product-market fit with precision.
          </p>
          <GenerateSurveyButton onClick={handleGenerateSurvey} loading={loading} />
        </div>

        {/* Card 4: Generate Infographic */}
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Understand your Market as a Visual, Shareable Story</h3>
          <p className="text-gray-600 mb-6">
          Get the total addressable market (TAM) and 5-year projections to size your opportunity. 
          Identify key market trends to prioritize your focus.
          Track key events and opportunities with a timeline. 
          Assess risks with a detailed risk matrix
          Compare the top 5 competitors to uncover gaps you can exploit. 
          </p>
          <GenerateInfographicButton onClick={handleGenerateInfographic} loading={loading} />
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {isPopupOpen && (
        <Popup title={popupTitle} onClose={() => setIsPopupOpen(false)}>
          {popupContent}
        </Popup>
      )}
    </div>
  );
  
}

export default PMRDashboard;
