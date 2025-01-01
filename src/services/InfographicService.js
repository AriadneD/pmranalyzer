import axios from "axios";

// ===============================================
// 1) Determine the relevant industry
// ===============================================
async function getRelevantIndustry(pmrEntries) {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `
              You are an AI tasked with identifying the most relevant industry based on PMR data. 
              Your output should be concise and contain only the name of the relevant industry. It should be highly specific
              (e.g., "Medical Devices", "Investment Banks", "Quantum Computing").
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

    const industry = response.data.choices[0].message.content.trim();
    console.log("Relevant Industry:", industry);
    return industry;
  } catch (error) {
    console.error("Error determining relevant industry:", error);
    throw new Error("Failed to determine the relevant industry.");
  }
}

// ===============================================
// 2) Brave Search
// ===============================================
async function searchBrave(query) {
  try {
    const response = await axios.get("http://localhost:5001/api/brave-search", {
      params: { query },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching Brave Search data:", error);
    throw new Error("Failed to fetch Brave Search data.");
  }
}

// ===============================================
// 3) Additional Sub-Agents (each returns partial JSON)
// ===============================================

// --- Agent A: Title & MarketTrends ---
async function fetchTitleAndMarketTrends(context) {
  const messages = [
    {
      role: "system",
      content: `
        You are a specialized agent that ONLY returns "title", "subtitle", 
        and "marketTrends" in valid JSON (no code fences). Market trends should be an accurate 5 year growth projection for the industry, with "size" being in millions of dollars. for example size: 20 = 20M
        
        - "title": Short descriptive title (e.g. "Top Healthcare Market Trends")
        - "subtitle": Specifies the industry or audience
        - "marketTrends": An array of objects: { "year": number, "size": number }
          (size in millions)
          
        Example (no triple backticks, no extra text):
        {
          "title": "Example Title",
          "subtitle": "Example Subtitle",
          "marketTrends": [{"year": 2020, "size": 20}, ...]
        }
      `,
    },
    {
      role: "user",
      content: `
        Here is the combined context for Title & MarketTrends:
        ${JSON.stringify(context)}
      `,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    return JSON.parse(content); // Expecting raw JSON string
  } catch (error) {
    console.error("Error in fetchTitleAndMarketTrends:", error);
    throw error;
  }
}

// --- Agent B: TrendCards ---
async function fetchTrendCards(context) {
  const messages = [
    {
      role: "system",
      content: `
        You are a specialized agent that ONLY returns "trendCards" in valid JSON (no code fences).
        Include 4-6 cards with fontawesome icons highlighting relevant trends with short descriptions (eg: "Rising demand for wearable health tech amongst gen z").
        Include supporting quantitative data (eg: % growth).

        - "trendCards": An array of objects: 
          { "icon": "icon-name", "title": "short title", "description": "short description" }
          
        Example:
        {
          "trendCards": [
            {
              "icon": "fa-chart-line",
              "title": "Rising Demand for Wearables",
              "description": "Wearable health tech has grown 20% in the last year"
            }
          ]
        }
      `,
    },
    {
      role: "user",
      content: `
        Here is the combined context for TrendCards:
        ${JSON.stringify(context)}
      `,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    console.log(content);
    return JSON.parse(content);
  } catch (error) {
    console.error("Error in fetchTrendCards:", error);
    throw error;
  }
}

// --- Agent C: Milestones ---
async function fetchMilestones(context) {
  const messages = [
    {
      role: "system",
      content: `
        You are a specialized agent that ONLY returns "milestones" in valid JSON (no code fences).
        Milestones should be a timeline of key events that are relevant to opportunities in the market and/or PMR.
        Be quantitative and chronological.
        
        - "milestones": An array of objects, each with 
          { "title": "Milestone Title", "description": "Short explanation" }
          
        Example:
        {
          "milestones": [
            { "title": "Launch Beta", "description": "Start pilot program in Q1" },
            ...
          ]
        }
      `,
    },
    {
      role: "user",
      content: `
        Here is the combined context for Milestones:
        ${JSON.stringify(context)}
      `,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error("Error in fetchMilestones:", error);
    throw error;
  }
}

// --- Agent D: Risks ---
async function fetchRisks(context) {
  const messages = [
    {
      role: "system",
      content: `
        You are a specialized agent that ONLY returns "risks" in valid JSON (no code fences).
        
        - "risks": An array of objects: 
          { "title": "Risk Title", "likelihood": "High/Medium/Low", "impact": "High/Medium/Low" }
          
        Example:
        {
          "risks": [
            { "title": "Regulatory Hurdles", "likelihood": "High", "impact": "High" },
            ...
          ]
        }
      `,
    },
    {
      role: "user",
      content: `
        Here is the combined context for Risks:
        ${JSON.stringify(context)}
      `,
    },
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const content = response.data.choices[0].message.content.trim();
    return JSON.parse(content);
  } catch (error) {
    console.error("Error in fetchRisks:", error);
    throw error;
  }
}

// --- Agent E: Competitive Landscape ---
async function fetchCompetitiveLandscape(context) {
    const messages = [
      {
        role: "system",
        content: `
          You are a specialized agent that ONLY returns "competitiveLandscape" in valid JSON (no code fences).
          In order to generate the competitive landscape, imagine that you are an entrepreneur who has read the PMR (provided below) you're trying to develop a product that addresses the pain points of the customers. 
          Your goal is, for this hypothetical product, to identify the 5 companies that could be competitors to your hypothetical product. For example, if your users are college students and their pain point is struggling to know what to cook, the hypothetical product might be a cooking mobile app, and competitors might be MyFitnessPal.
          You should also identify categories to compare the products, for example market share and price, or complexity and speed to implement. Be purposeful and intuitive in your choices.
          
          - "competitiveLandscape": An object containing:
            - "quadrants": An array of objects, each with:
              { "name": "Company Name", "x": number, "y": number, "color": "Color" }
            
          Example:
          {
            "competitiveLandscape": {
              "quadrants": [
                { "name": "Company A", "x": 1, "y": 5, "color": "red" },
                { "name": "Company B", "x": 3, "y": 3, "color": "blue" },
                { "name": "Company C", "x": 5, "y": 1, "color": "green" }
              ]
            }
          }
        `,
      },
      {
        role: "user",
        content: `
          Based on the context, identify the top 5 competitor companies and construct a 4-quadrant graph.
          ${JSON.stringify(context)}
        `,
      },
    ];
  
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      const content = response.data.choices[0].message.content.trim();
      return JSON.parse(content).competitiveLandscape;
    } catch (error) {
      console.error("Error in fetchCompetitiveLandscape:", error);
      throw error;
    }
}
  

// ===============================================
// Merge Function: Consolidate all parts
// ===============================================
function mergeInfographicData(titleAndTrends, trendCards, milestones, risks) {
  return {
    title: titleAndTrends.title || "",
    subtitle: titleAndTrends.subtitle || "",
    marketTrends: titleAndTrends.marketTrends || [],
    trendCards: trendCards.trendCards || [],
    milestones: milestones.milestones || [],
    risks: risks.risks || [],
  };
}

// ===============================================
// 4) Main Function: Generate Infographic Data
// ===============================================

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
export async function generateInfographicData(pmrEntries) {
  try {
    const industry = await getRelevantIndustry(pmrEntries);

    const year = new Date().getFullYear();
    const searchQuery1 = `Top ${industry} market trends and opportunities for ${year}`;
    const searchResults1 = await searchBrave(searchQuery1);

    await delay(2000);

    const searchQuery2 = `5 year market growth projections for ${industry}`;
    const searchResults2 = await searchBrave(searchQuery2);

    const context = {
      pmrEntries,
      searchResults: {
        currentTrends: searchResults1,
        growthProjections: searchResults2,
      },
    };

    const titleAndTrends = await fetchTitleAndMarketTrends(context);
    const trendCards = await fetchTrendCards(context);
    const milestones = await fetchMilestones(context);
    const risks = await fetchRisks(context);

    // Fetch Competitive Landscape
    const competitiveLandscape = await fetchCompetitiveLandscape(context);

    return {
      ...mergeInfographicData(titleAndTrends, trendCards, milestones, risks),
      competitiveLandscape,
    };
  } catch (error) {
    console.error("Error generating infographic data:", error);
    throw new Error("Failed to generate infographic data via multi-agent approach.");
  }
}

  