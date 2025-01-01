import axios from "axios";

export async function generateUserClusters(pmrEntries) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are an expert in data clustering. Use K-means clustering to group the given users into meaningful "user archetype" clusters.
              A user archetype outlines the behavioral expectations and general characteristics of the target customers.
              
              Provide:
              1. Cluster name describing the group.
              2. A unique color for the cluster.
              3. The list of users in each cluster.
              4. A "persona" for each cluster with the following attributes:
                - Demographics
                - Background
                - Goals
                - Challenges
                - Behaviors
                - Motivations
                - Psychographics
              Return ONLY JSON in the following format:
              {
                "clusters": [
                  {
                    "name": "Cluster 1: Mental Health Advocates",
                    "color": "blue",
                    "users": [
                      { "id": "user1", "name": "John Doe" },
                      { "id": "user2", "name": "Jane Smith" }
                    ],
                    "persona": {
                      "Demographics": "age, sex, location",
                      "Background": "personal history, career stage",
                      "Goals": "user goals",
                      "Challenges": "user challenges",
                      "Behaviors": "behavior patterns",
                      "Motivations": "motivational factors",
                      "Psychographics": "personality and lifestyle"
                    }
                  },
                  ...
                ]
              }
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

    const rawContent = response.data.choices[0].message.content;
    console.log("Raw response from LLM:", rawContent);

    // Clean the response to remove backticks or code block formatting
    const cleanedContent = rawContent.replace(/```json|```/g, "").trim();

    // Parse the cleaned JSON
    return JSON.parse(cleanedContent);
  } catch (error) {
    console.error("Error generating clusters:", error);
    throw new Error("Failed to generate user clusters.");
  }
}
