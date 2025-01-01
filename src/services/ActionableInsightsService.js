import axios from "axios";

export async function generateActionableInsights(pmrEntries) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `
              You are an AI tasked with analyzing PMR data scientifically and accurately. Parse the provided entries and return ONLY TWO JSON ARRAYS, NO OTHER TEXT:
              1. Top 5 pain points as a JSON array with the percentage of users from the PMR data that expressed this pain point (e.g., [{"name": "Pain Point", "percentage": 67}]).
              2. Detailed product/feature strategies to address user pain points, formatted as follows:
                [
                  {
                    "name": "Product/Feature Idea",
                    "description": "Brief description of the product/feature idea.",
                    "problem": "The problem/pain point from PMR it addresses.",
                    "marketTrends": "Relevant market trends to consider.",
                    "prototype": "What a prototype of this product would look like.",
                    "techStack": "Suggested tech stack for the product.",
                    "validation": "How to test/validate this product.",
                    "competitors": "Potential competitors for this product.",
                    "pricing": "Suggested price and pricing model.",
                    "goToMarket": "Go-to-market strategy."
                  },
                  ...
                ]
            `,
          },
          {
            role: "user",
            content: `Here are the PMR entries: ${JSON.stringify(pmrEntries)}`,
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

    // Extract the content of the LLM response
    let responseContent = response.data.choices[0].message.content;
    console.log("Raw LLM Response:", responseContent);

    // Extract JSON arrays using a regular expression
    const jsonArrays = responseContent.match(/\[.*?\]/gs);

    if (!jsonArrays || jsonArrays.length < 2) {
      throw new Error("Failed to extract JSON arrays from LLM response.");
    }

    // Parse each JSON array
    const painPoints = JSON.parse(jsonArrays[0]);
    const suggestions = JSON.parse(jsonArrays[1]);

    // Ensure both arrays are valid
    if (!Array.isArray(painPoints) || !Array.isArray(suggestions)) {
      throw new Error("Invalid structure in LLM response.");
    }

    return { painPoints, suggestions };
  } catch (error) {
    console.error("Error generating insights:", error);
    throw new Error("Failed to generate actionable insights.");
  }
}
