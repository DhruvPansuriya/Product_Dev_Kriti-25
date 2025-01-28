import express from "express";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getResponse } from "./promptHandler.js";
import { geminiModel } from "./config/genaimodel.js";
import { BASE_PROMPT, getSystemPrompt } from "./prompts.js";
import { basePrompt as nodeBasePrompt } from "./src/defaults/node.js";
import { basePrompt as reactBasePrompt } from "./src/defaults/react.js";
import cors from "cors";
import convertToEditable from './abc.js';
dotenv.config();

const code = `
<div className="container">
  <p>Hello World</p>
</div>
`;

const transformedCode = convertToEditable(code);

console.log(transformedCode);

const app = express();
const port = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

app.post("/api/v1/template", async (req, res) => {
  const prompt = req.body.prompt;
  console.log(prompt);

  const prompts = [
    { prompt },
    "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
  ];

  const combinedPrompt = prompts.join("\n");

  try {
    const result = await geminiModel.generateContent(combinedPrompt);
    const answer = result.response.text().trim(); // Ensure trimmed output for comparison

    if (answer === "react") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "You can't access this" });
  } catch (error) {
    console.error("Error generating response:", error.message);
    res.status(500).json({ error: "Failed to generate response" });
  }

  

  })

  app.post("/api/v1/chat/", async (req, res) => {
    const messages = req.body.messages;
  
    const prompts = [
      { messages },
      getSystemPrompt, 
    ];
    
    const combinedPrompt = prompts.join("\n");
  
    try {
      const result = await geminiModel.generateContent(combinedPrompt);
      console.log(result.response.text());
      res.json({ response: result.response.text() });
    } catch (error) {
      console.error("Error generating content:", error.message); 
      res.status(500).json({ error: "Failed to generate content" });
    }
  });
  
  

  // let history = [];

  // try {
  //   res.setHeader("Content-Type", "text/event-stream");
  //   res.setHeader("Cache-Control", "no-cache");
  //   res.setHeader("Connection", "keep-alive");

  //   console.log("Starting to generate response...");

  //   const answer = await getResponse(combinedPrompt, res, history);
  //   console.log(answer);

  //   res.end();
  // } catch (error) {
  //   console.error("Error generating response:", error.message);
  //   // Ensure that no other response is sent once streaming has started
  //   if (!res.headersSent) {
  //     res.status(500).json({ error: "Failed to generate response" });
  //   }
  // }
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
