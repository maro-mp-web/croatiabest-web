'use server';
/**
 * @fileOverview An AI assistant for generating and enhancing content for listings and blog articles.
 *
 * - aiContentAssistant - A function that handles the content generation/enhancement process.
 * - AIContentAssistantInput - The input type for the aiContentAssistant function.
 * - AIContentAssistantOutput - The return type for the aiContentAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const AIContentAssistantInputSchema = z.object({
  contentType: z.enum(['listing', 'article']).describe('The type of content to generate or enhance (e.g., "listing" or "article").'),
  category: z.string().optional().describe('The category of the content (e.g., "restorani", "plaže", "blog", "putovanja"). This provides additional context to the AI.'),
  existingContent: z.string().optional().describe('Existing content to be enhanced. If provided, the AI will improve this text.'),
  promptInstruction: z.string().describe('Specific instructions from the administrator for content generation or enhancement (e.g., "Write a catchy description for a restaurant", "Expand on this idea").'),
});
export type AIContentAssistantInput = z.infer<typeof AIContentAssistantInputSchema>;

// Output Schema
const AIContentAssistantOutputSchema = z.object({
  generatedContent: z.string().describe('The AI-generated or enhanced text content.'),
});
export type AIContentAssistantOutput = z.infer<typeof AIContentAssistantOutputSchema>;

// Wrapper function
export async function aiContentAssistant(input: AIContentAssistantInput): Promise<AIContentAssistantOutput> {
  return aiContentAssistantFlow(input);
}

// Define the prompt
const contentAssistantPrompt = ai.definePrompt({
  name: 'contentAssistantPrompt',
  input: {schema: AIContentAssistantInputSchema},
  output: {schema: AIContentAssistantOutputSchema},
  prompt: `You are an expert content writer for 'CroatiaBest', a listing and information portal about Croatia. Your goal is to create high-quality, engaging, and SEO-friendly content tailored to specific categories.

**Content Type**: {{{contentType}}}
{{#if category}}
**Category**: {{{category}}}
{{/if}}

{{#if existingContent}}
**Task**: Enhance the following content. Improve its readability, engagement, and optimize it for a Croatian travel and information portal. Ensure the tone is appropriate for 'CroatiaBest'.
**Original Content**:
{{{existingContent}}}
{{else}}
**Task**: Generate new content for the specified type and category. Ensure the tone is appropriate for 'CroatiaBest'.
{{/if}}

**User Instructions**:
{{{promptInstruction}}}

Please provide only the generated or enhanced content, without any conversational filler.`,
});

// Define the flow
const aiContentAssistantFlow = ai.defineFlow(
  {
    name: 'aiContentAssistantFlow',
    inputSchema: AIContentAssistantInputSchema,
    outputSchema: AIContentAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await contentAssistantPrompt(input);
    if (!output) {
      throw new Error('Failed to generate content.');
    }
    return output;
  }
);
