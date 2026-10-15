import dotenvFlow from 'dotenv-flow';
dotenvFlow.config();

import { generateText } from 'ai'
import fs from 'fs'
import { groq } from '@ai-sdk/groq'


const essay = fs.readFileSync('app/(1-extraction)/essay.txt', 'utf-8')

const fewShotPrompt = `Extract all human person names from text, including their roles if mentioned.

                        Example 1:
                        Text: "CEO Sarah Chen met with investor Mark Johnson at the conference."
                        Output:
                        - Sarah Chen (CEO)
                        - Mark Johnson (investor)

                        Example 2:
                        Text: "The founders, Alex and Jamie, hired consultant Dr. Lisa Wang."
                        Output:
                        - Alex (founder)
                        - Jamie (founder)
                        - Dr. Lisa Wang (consultant)

                        Now extract from this text:
                        ${essay}

                        Output:`;
const structuredPrompt = `Extract all human persona names and relationships from this essay.
                        Format as JSON with this structure:
                        {
                            "people":[
                                {
                                    "name":"Full Name",
                                    "role":"their role/title if mentioned",
                                    "relationships":["list of people they're connected to"]
                                }
                            
                            ]
                        }

                        Essay: ${essay}
                        
                        `


async function consistencyTest(prompt: string, iteration: number): Promise<void> {
    for (let i = 0; i < iteration; i++) {
        const result = await generateText({
            model: groq("openai/gpt-oss-120b"),
            prompt: prompt,
        })

        console.log("-------------------------------------------------")
        console.log(`                 AI Response ${i + 1}              `)
        console.log("-------------------------------------------------")
        console.log(result.text)
        console.log("-------------------------------------------------")

    }

}


async function main() {
    const result = await generateText({
        model: groq("openai/gpt-oss-120b"),
        prompt: structuredPrompt,
    })

    console.log("-------------------------------------------------")
    console.log("                 AI Response                     ")
    console.log("-------------------------------------------------")
    console.log(result.text)
    console.log("-------------------------------------------------")
}

consistencyTest(structuredPrompt, 3).catch((error) => {
    console.error(error)
    process.exit(1)
})

