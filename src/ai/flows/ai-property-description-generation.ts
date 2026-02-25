'use server';
/**
 * @fileOverview An AI assistant flow for generating engaging property descriptions.
 *
 * - generatePropertyDescription - A function that handles the property description generation process.
 * - PropertyDescriptionGenerationInput - The input type for the generatePropertyDescription function.
 * - PropertyDescriptionGenerationOutput - The return type for the generatePropertyDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema
const PropertyDescriptionGenerationInputSchema = z.object({
  propertyType: z.string().describe('The type of property, e.g., Luxury Family Home, Downtown Apartment.'),
  location: z.string().describe('The location of the property, e.g., Suburban, Waterfront, Downtown.'),
  bedrooms: z.number().int().min(0).describe('The number of bedrooms.'),
  bathrooms: z.number().int().min(0).describe('The number of bathrooms.'),
  squareFootage: z.number().int().min(0).optional().describe('The total square footage of the property.'),
  price: z.string().describe('The price or rental cost of the property, e.g., "$1,200,000" or "$3,500/month".'),
  amenities: z.array(z.string()).optional().describe('A list of key amenities and features, e.g., "modern kitchen", "parking space", "24/7 support".'),
  descriptionHighlights: z.string().optional().describe('Any specific highlights or unique selling points to include in the description.'),
});
export type PropertyDescriptionGenerationInput = z.infer<typeof PropertyDescriptionGenerationInputSchema>;

// Output Schema
const PropertyDescriptionGenerationOutputSchema = z.object({
  description: z.string().describe('A detailed and engaging property description.'),
});
export type PropertyDescriptionGenerationOutput = z.infer<typeof PropertyDescriptionGenerationOutputSchema>;

// Wrapper function
export async function generatePropertyDescription(input: PropertyDescriptionGenerationInput): Promise<PropertyDescriptionGenerationOutput> {
  return aiPropertyDescriptionGenerationFlow(input);
}

// Prompt definition
const propertyDescriptionPrompt = ai.definePrompt({
  name: 'propertyDescriptionPrompt',
  input: {schema: PropertyDescriptionGenerationInputSchema},
  output: {schema: PropertyDescriptionGenerationOutputSchema},
  prompt: `You are an AI assistant for Temmy American Realty, a professional real estate company. Your task is to generate engaging and detailed property descriptions based on the provided key features. The descriptions should be professional, attractive, and highlight the best aspects of the property for potential buyers or renters.\n\nProperty Type: {{{propertyType}}}\nLocation: {{{location}}}\nBedrooms: {{{bedrooms}}}\nBathrooms: {{{bathrooms}}}\n{{#if squareFootage}}Square Footage: {{{squareFootage}}} sq ft{{/if}}\nPrice: {{{price}}}\n{{#if amenities.length}}\nAmenities:\n{{#each amenities}}- {{{this}}}\n{{/each}}\n{{/if}}\n{{#if descriptionHighlights}}\nKey Highlights: {{{descriptionHighlights}}}\n{{/if}}\n\nGenerate a compelling property description of approximately 200-300 words. Start with an attention-grabbing sentence and include details about the living spaces, modern features, neighborhood, and any unique selling points. Ensure the tone is professional and inviting.`,
});

// Flow definition
const aiPropertyDescriptionGenerationFlow = ai.defineFlow(
  {
    name: 'aiPropertyDescriptionGenerationFlow',
    inputSchema: PropertyDescriptionGenerationInputSchema,
    outputSchema: PropertyDescriptionGenerationOutputSchema,
  },
  async (input) => {
    const {output} = await propertyDescriptionPrompt(input);
    return output!;
  }
);
