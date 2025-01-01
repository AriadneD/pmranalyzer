import axios from "axios";

export const generateSurveyQuestions = async (pmrEntries) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are an expert in user research. Based on the provided PMR data, generate 20 top follow-up questions to ask users for deeper interviewing.
            `,
          },
          {
            role: "user",
            content: `Here is the PMR data: ${JSON.stringify(pmrEntries)}`,
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

    const content = response.data.choices[0].message.content;

    // Parse the response into a question array
    const questions = content
      .split("\n")
      .filter((q) => q.trim() !== "")
      .map((q) => q.trim());

    return questions;
  } catch (error) {
    console.error("Error generating survey questions:", error);
    throw new Error("Failed to generate survey questions.");
  }
};
