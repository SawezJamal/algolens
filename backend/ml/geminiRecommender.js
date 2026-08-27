const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

async function generateRecommendation({
    code,
    findings,
    mlAnalysis,
}) {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error(
            "GEMINI_API_KEY is not configured."
        );
    }

    const prompt = `
You are an expert DSA code optimization assistant
inside a software project called AlgoLens.

Analyze the user's C++ solution using the provided
static analysis and machine-learning result.

Your job is to give a concise, technically accurate
optimization recommendation.

Do not invent problems that are not supported by
the analysis.

Do not recommend changing loop ordering, DP state
transitions, recurrence relations, or algorithm semantics
unless the proposed change is provably equivalent.

For dynamic programming problems, preserve the existing
DP semantics and state transitions.

Do not claim an asymptotic improvement when a change only
improves constants or practical performance.

If the current algorithm is already asymptotically appropriate,
say so instead of inventing an optimization.

When the static analyzer reports a generic pattern such as
"Nested Loop", use the actual code and problem context to
determine the true complexity rather than automatically
assuming O(n²).

Code:
${code}

Static analysis findings:
${JSON.stringify(findings, null, 2)}

Machine learning analysis:
${JSON.stringify(mlAnalysis, null, 2)}

Return your response with exactly these sections:

**Recommendation:**
Explain what should be improved.

**Why:**
Explain why the current approach may be inefficient.

**Expected Improvement:**
Explain the expected time and space complexity improvement.

Formatting rules:
- Use simple Markdown only.
- Use **bold** for section headings.
- Use backticks for code and complexity values.
- Write complexity as "O(n²)", "O(n)", "O(n log n)", etc.
- Do NOT use LaTeX.
- Do NOT use $...$ notation.
- Do NOT escape Markdown characters.
- Do NOT use unnecessary symbols.
- Do NOT use bullet points unless they improve readability.
- Keep the response concise and suitable for a coding platform UI.
`;

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        contents: prompt,
        config: {
            temperature: 0.2,
            maxOutputTokens: 400,
        },
    });

    return response.text;
}

module.exports = {
    generateRecommendation,
};