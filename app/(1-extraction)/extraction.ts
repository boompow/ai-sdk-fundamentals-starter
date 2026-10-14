import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();
import fs from "fs";
import path from 'path';
import { groq } from '@ai-sdk/groq'
import { generateText } from 'ai';

// import essay
const essay = fs.readFileSync("app/(1-extraction)/essay.txt", "utf-8");

// extractions
const namePrompt = `what is the key takeaway of this essay in 50 words?.
                    Essay: ${essay}
                  `

const companyPrompt = `Extract all company names, both explicit mentions and implicit references (e.g. "the startup" referencing previously mentioned company.)
                       Format as JSON array: ["company1", "company2"]
                       Essay: ${essay}
                      `
const conceptPrompt = `Identify the main business concepts and technical terms in this essay.
                       Format as JSON:
                       {
                          "business": ["concept1", "concept2"],
                          "technical": ["term1", "term2"]
                        }
                       Essay: ${essay}
                      `
const quotePrompt = `Extract all quotes (text in quotation marks) from this essay. For each quote, identify who said it if mentioned.
                       Format as JSON array: [{"quote": "text here", "speaker": "name or null"}]
                       Essay: ${essay}
                      `


async function main() {
  const result = await generateText(
    {
      model: groq("openai/gpt-oss-120b"),
      prompt: conceptPrompt
    }
  )

  // const filePath = path.join(`app/(1-extraction)`, 'result.txt');

  // fs.writeFile(filePath, result.text, 'utf-8', (err) => {
  //   if (err) {
  //     console.error("failed to write", err)
  //   }
  // })

  // The AI's response is in result.text
  console.log('\n--- AI Response ---');
  console.log(result.text); // This will be something like: "John Smith, Jane Doe, ..."
  console.log('-------------------');
}

main().catch((error) => {
  console.error('❌ Extraction failed:', error.message);
  process.exit(1);
});
