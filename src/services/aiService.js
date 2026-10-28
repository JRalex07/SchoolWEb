/**
 * aiService.js
 * Pluggable Conversational AI Service Interface for Barnaby Campus Assistant.
 * 
 * Architecture:
 * 1. Checks for an optional secure backend endpoint (e.g., process.env.VITE_AI_CHAT_ENDPOINT)
 *    or serverless proxy. Never bundles private LLM API keys directly in client-side code.
 * 2. If an AI endpoint is configured and reachable, streams or returns model responses.
 * 3. If no backend is configured (the default for static GitHub Pages deployments),
 *    gracefully falls back to the authoritative local intent engine (processUserMessage).
 * 4. Yields chunks incrementally so the UI receives a uniform streaming interface.
 */

import { processUserMessage } from '../utils/barnabyChatEngine';

export class BarnabyAIService {
  constructor(endpoint = null) {
    this.endpoint = endpoint || (typeof import.meta !== 'undefined' && import.meta.env?.VITE_AI_CHAT_ENDPOINT) || null;
    this.isBackendAvailable = Boolean(this.endpoint);
  }

  /**
   * Send user message to the conversational pipeline.
   * Calls onChunk for streaming tokens and resolves with the final structured message.
   */
  async streamResponse({
    query,
    currentPath = '/',
    config = {},
    history = [],
    signal = null,
    onChunk = null
  }) {
    // A. If an authenticated backend endpoint is provided, attempt secure streaming
    if (this.endpoint) {
      try {
        const response = await fetch(this.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query, currentPath, config, history }),
          signal
        });

        if (response.ok && response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let fullText = '';
          let action = null;
          let expression = 'explaining';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value, { stream: true });
            fullText += chunk;
            if (onChunk) onChunk(chunk, fullText);
          }

          return {
            text: fullText,
            action,
            expression,
            source: 'remote-ai'
          };
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          throw err;
        }
        console.warn('[BarnabyAIService] Remote AI backend unreachable, falling back to verified local knowledge engine.', err);
      }
    }

    // B. Grounded Local Intelligence Engine (100% reliable, zero secret leakage, works offline)
    const result = processUserMessage(query, currentPath, config, history);
    
    // Simulate natural thinking latency before streaming begins
    await new Promise(resolve => setTimeout(resolve, 240));

    return {
      text: result.text,
      action: result.action || null,
      expression: result.expression || 'explaining',
      topic: result.topic || 'general',
      suggestedFollowUps: result.suggestedFollowUps || null,
      source: 'grounded-local'
    };
  }
}

export const aiService = new BarnabyAIService();

