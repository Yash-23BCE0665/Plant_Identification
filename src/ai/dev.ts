import { config } from 'dotenv';
config();

import '@/ai/flows/identify-plant-species.ts';
import '@/ai/flows/suggest-alternative-plant-species.ts';
import '@/ai/flows/display-identification-confidence.ts';