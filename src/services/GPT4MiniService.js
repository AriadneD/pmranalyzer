// src/services/GPT4MiniService.js

import axios from 'axios';

// Function to send the transcript to the LLM (GPT-4 API)
export async function getPMRFromTranscript(transcriptText) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
              You are tasked with extracting structured interview data into a PMR format. For each interview transcript, extract: You are tasked with extracting structured interview data into a PMR format
              Pay close attention to the words being said during the interview, as they might mention key details

              - Name of the person being interviewed (if it's not specified, put the name of the document)
              - Date of Interview (if it's not specified, put the date the uploaded file was created)
              - Profession
              - Company
              - Email
              - Current Workflow
              - Challenges & Needs
              - What Was Helpful
              - Other Insights

              Return the result as JSON in this format:
              
              {
                "name": "...",
                "dateOfInterview": "...",
                "profession": "...",
                "company": "...",
                "email": "...",
                "currentWorkflow": "...",
                "challengesAndNeeds": "...",
                "whatWasHelpful": "...",
                "otherInsights": "..."
              }
            `,
          },
          {
            role: "user",
            content: `Here is the interview transcript: ${transcriptText}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content; // Extract JSON result from OpenAI response
  } catch (error) {
    console.error("Error generating PMR:", error);
    throw new Error("Failed to generate PMR data");
  }
}
