import Anthropic from '@anthropic-ai/sdk';

class AIService {
  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    this.model = 'claude-sonnet-4-20250514';
  }

  async analyzeSPF(spfResult, domain) {
    try {
      console.log('🤖 Starting SPF AI analysis for domain:', domain);
      console.log('🔑 API Key present:', !!process.env.ANTHROPIC_API_KEY);

      const prompt = `You are an email deliverability expert analyzing SPF (Sender Policy Framework) records.

Domain: ${domain}
SPF Test Result:
${JSON.stringify(spfResult, null, 2)}

Provide a comprehensive analysis in JSON format with:
1. "explanation": A clear, non-technical explanation of what this SPF record means
2. "impact": The impact on email deliverability (high/medium/low)
3. "recommendations": An array of specific, actionable recommendations to improve the configuration
4. "priority": Overall priority level (critical/high/medium/low)
5. "securityScore": A score from 0-100 indicating the security strength

Return ONLY valid JSON, no markdown formatting.`;

      console.log('📤 Sending request to Claude API...');
      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      console.log('📥 Received response from Claude API');
      const content = message.content[0].text;
      console.log('📝 Raw response:', content.substring(0, 200) + '...');

      const insights = JSON.parse(content);
      console.log('✅ Successfully parsed AI insights');

      return {
        success: true,
        insights,
      };
    } catch (error) {
      console.error('❌ AI analysis error:', error.message);
      console.error('Stack:', error.stack);
      return {
        success: false,
        insights: null,
        error: error.message,
      };
    }
  }

  async analyzeDKIM(dkimResult, domain, selector) {
    try {
      const prompt = `You are an email deliverability expert analyzing DKIM (DomainKeys Identified Mail) records.

Domain: ${domain}
Selector: ${selector}
DKIM Test Result:
${JSON.stringify(dkimResult, null, 2)}

Provide a comprehensive analysis in JSON format with:
1. "explanation": A clear, non-technical explanation of what this DKIM record means
2. "impact": The impact on email deliverability (high/medium/low)
3. "recommendations": An array of specific, actionable recommendations
4. "priority": Overall priority level (critical/high/medium/low)
5. "securityScore": A score from 0-100 indicating the security strength
6. "keyStrength": Analysis of the public key strength

Return ONLY valid JSON, no markdown formatting.`;

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0].text;
      const insights = JSON.parse(content);

      return {
        success: true,
        insights,
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        success: false,
        insights: null,
        error: error.message,
      };
    }
  }

  async analyzeDMARC(dmarcResult, domain) {
    try {
      const prompt = `You are an email deliverability expert analyzing DMARC (Domain-based Message Authentication) records.

Domain: ${domain}
DMARC Test Result:
${JSON.stringify(dmarcResult, null, 2)}

Provide a comprehensive analysis in JSON format with:
1. "explanation": A clear, non-technical explanation of what this DMARC policy means
2. "impact": The impact on email deliverability and brand protection (high/medium/low)
3. "recommendations": An array of specific, actionable recommendations to improve the policy
4. "priority": Overall priority level (critical/high/medium/low)
5. "securityScore": A score from 0-100 indicating the security strength
6. "policyAnalysis": Detailed analysis of the current policy setting

Return ONLY valid JSON, no markdown formatting.`;

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0].text;
      const insights = JSON.parse(content);

      return {
        success: true,
        insights,
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        success: false,
        insights: null,
        error: error.message,
      };
    }
  }

  async analyzeOverallDeliverability(spfResult, dkimResult, dmarcResult, domain) {
    try {
      const prompt = `You are an email deliverability expert analyzing the complete email authentication setup for a domain.

Domain: ${domain}

SPF Result: ${JSON.stringify(spfResult, null, 2)}
DKIM Result: ${JSON.stringify(dkimResult, null, 2)}
DMARC Result: ${JSON.stringify(dmarcResult, null, 2)}

Provide a comprehensive overall analysis in JSON format with:
1. "overallScore": A score from 0-100 for the complete email authentication setup
2. "summary": A brief summary of the overall security posture
3. "criticalIssues": Array of critical issues that need immediate attention
4. "strengths": Array of what's configured well
5. "nextSteps": Prioritized array of next steps to improve deliverability
6. "riskLevel": Overall risk level (critical/high/medium/low)

Return ONLY valid JSON, no markdown formatting.`;

      const message = await this.client.messages.create({
        model: this.model,
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      });

      const content = message.content[0].text;
      const insights = JSON.parse(content);

      return {
        success: true,
        insights,
      };
    } catch (error) {
      console.error('AI analysis error:', error);
      return {
        success: false,
        insights: null,
        error: error.message,
      };
    }
  }
}

export const aiService = new AIService();
