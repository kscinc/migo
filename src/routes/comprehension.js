// comprehensionRoutes.js — Comprehension evaluation endpoints
// POST /api/comprehension/evaluate  — stateless OpenAI evaluation (JWT required)
// POST /api/comprehension/result    — persist final result to Supabase (JWT required)

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const verifyJWT = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { comprehensionEvaluateSchema, comprehensionResultSchema } = require('../config/schemas');
const aiService = require('../services/ai');
const lessonConfig = require('../config/lessons');

// ─── POST /evaluate ───────────────────────────────────────────────────────────
// Stateless: frontend sends full conversationHistory on every call.
// Turn is inferred from history length.

router.post('/evaluate', verifyJWT, validate(comprehensionEvaluateSchema), async (req, res) => {
  try {
    const { lessonId, userAnswer, conversationHistory, userProfile, spendingInsights, interactionMode, bankInfo } = req.body;

    if (!lessonId) {
      return res.status(400).json({ error: 'lessonId is required' });
    }

    const lesson = lessonConfig[lessonId];
    if (!lesson) {
      // Allow check_in and clarify even without a lesson config
      if (interactionMode !== 'check_in' && interactionMode !== 'clarify' && interactionMode !== 'action') {
        return res.status(400).json({ error: `No lesson config found for: ${lessonId}` });
      }
    }

    const history = Array.isArray(conversationHistory) ? conversationHistory : [];

    // ── CHECK-IN MODE ──────────────────────────────────────────────────────────
    if (interactionMode === 'check_in') {
      const isPaycheckLesson = lessonId === 'Stop Living Paycheck to Paycheck';
      const checkInSystem = isPaycheckLesson
        ? `You are Migo, a warm Gen Z financial coach. The user just watched Rachel Cruze's "Stop Living Paycheck to Paycheck" — a comprehensive step-by-step roadmap that can feel overwhelming.

Context: This user has already completed Level 1 (budgeting with the 50/30/20 rule, tracking needs vs wants, and moving money to savings). They are now starting Level 2.

Your response MUST:
1. Warmly validate how they're feeling in 1 sentence.
2. Celebrate that they've ALREADY done the first steps Rachel describes — budgeting and tracking. That's real progress worth acknowledging.
3. Frame Level 2 as the natural next step: emergency fund → HYSA → income growth → side hustles. This level sets them up to eventually pay off debt and invest.
4. If they feel overwhelmed: explicitly reassure them they do NOT need to do every step at once. They can take it one step at a time and Migo will guide them through each one.
5. Be enthusiastic, specific, and encouraging — like a coach who genuinely believes in them.

Respond ONLY in valid JSON:
{ "coachResponse": "2-3 warm, specific sentences", "nextMode": "action" | "comprehension" }`
        : `You are Migo, a warm Gen Z financial coach. The user just finished the lesson "${lessonId}".
They told you how they're feeling about the content. Your job:
1. Respond warmly and validate their feeling (1 sentence).
2. Decide their next step: if they seem confident/excited → nextMode: "action" or "comprehension". If confused/overwhelmed/unsure → nextMode: "clarify".
3. Bridge them to the next step naturally (1 sentence).

Respond ONLY in valid JSON: { "coachResponse": "...", "nextMode": "action" | "comprehension" | "clarify" }`;
      const response = await aiService.callGPT(checkInSystem, `User said: "${userAnswer}"`, 0.6);
      const result = JSON.parse(response.choices[0].message.content);
      return res.json(result);
    }

    // ── CLARIFY MODE ──────────────────────────────────────────────────────────
    if (interactionMode === 'clarify') {
      const profile = userProfile || {};
      const clarifySystem = `You are Migo, a friendly Gen Z financial tutor explaining "${lessonId}".
The user is confused and asking a clarifying question. Answer it clearly, using simple language and a real-life example from their situation. Be encouraging — confusion is totally normal.
After your answer, ask "What else can I help clarify?"
Keep it under 4 sentences total.
Return JSON: { "question": "your answer + follow-up prompt", "evaluation": null, "passed": false, "score": 0, "gaps": [] }`;
      const transcript = history.map(m => `${m.role === 'assistant' ? 'Coach' : 'User'}: ${m.content}`).join('\n');
      const response = await aiService.callGPT(clarifySystem, `Conversation so far:\n${transcript}\n\nUser's question: ${userAnswer}`, 0.6);
      const result = JSON.parse(response.choices[0].message.content);
      return res.json(result);
    }

    // ── ACTION MODE ──────────────────────────────────────────────────────────
    if (interactionMode === 'action') {
      const mustDos = lesson ? lesson.mustDos.slice(0, 3).join('; ') : 'apply what you learned';
      const bigBanks = ['chase', 'bank of america', 'wells fargo', 'citibank', 'us bank', 'td bank', 'capital one', 'pnc', 'truist'];
      const userBankLower = (bankInfo || '').toLowerCase();
      const isHYSALesson = lessonId.toLowerCase().includes('high-yield') || lessonId.toLowerCase().includes('hysa');
      let bankContext = '';
      if (isHYSALesson && userBankLower) {
        const isBigBank = bigBanks.some(b => userBankLower.includes(b));
        if (isBigBank) {
          bankContext = `The user banks with "${bankInfo}", which typically does NOT offer competitive HYSA rates. Gently explain this and recommend they open a HYSA at Fidelity, Marcus by Goldman Sachs, or Ally Bank. Mention that a Fidelity account is especially useful since it also supports investing in later levels (Roth IRA, index funds) — so it's worth setting up now.`;
        } else {
          bankContext = `The user banks with "${bankInfo}". Suggest they check if their bank offers a high-yield savings account first. If not, recommend Fidelity, Marcus, or Ally as solid alternatives.`;
        }
      }
      const actionSystem = `You are Migo, a Gen Z financial coach. The user just finished lesson "${lessonId}" and understands it. Now bridge them to action.
Write 2-3 sentences: briefly affirm their learning, then give ONE specific next step they can take TODAY (5–30 mins, free or low-cost).
${bankContext}
Core actions to draw from: ${mustDos}
Be encouraging and specific, not generic.
Return JSON: { "action": "your 2-3 sentence action bridge", "question": "your 2-3 sentence action bridge", "evaluation": null, "passed": false, "score": 0, "gaps": [] }`;
      const response = await aiService.callGPT(actionSystem, `Lesson: ${lessonId}. User: ${JSON.stringify(userProfile || {})}`, 0.7);
      const result = JSON.parse(response.choices[0].message.content);
      return res.json(result);
    }

    // ── COMPREHENSION MODE — strict 2-question max ────────────────────────────
    const isTurn1 = history.length === 0;
    const isFinalTurn = history.length >= 2; // 1 Q + 1 A = 2 items → conclude after first answer; allow 1 follow-up if first answer is partial

    const mustDosFormatted = lesson.mustDos
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const mustNeverDosFormatted = lesson.mustNeverDos
      .map((d, i) => `${i + 1}. ${d}`)
      .join('\n');
    const keyTopicsFormatted = lesson.keyTopics.join(', ');

    // Build a readable user profile section if diagnostic answers were provided
    const profile = userProfile || {};
    const formatList = (val) => Array.isArray(val) ? val.join(', ') : (val || 'not specified');
    const situationLabels = {
      fulltime_student: 'full-time student', parttime_student: 'part-time student',
      associates_program: 'associates degree program', trade_school: 'trade school / vocational',
      contract_work: 'contract / freelance work', gig_work: 'gig work (e.g. Uber, DoorDash)',
      fulltime_w2: 'full-time W-2 employee'
    };
    const learningLabels = {
      videos: 'videos & visuals', reading: 'reading articles',
      interactive: 'interactive examples', audio: 'podcasts & audio', doing: 'learning by doing'
    };
    const formatSituation = (val) => {
      const vals = Array.isArray(val) ? val : [val];
      return vals.map(v => situationLabels[v] || v).join(', ');
    };
    const formatLearning = (val) => {
      const vals = Array.isArray(val) ? val : [val];
      return vals.map(v => learningLabels[v] || v).join(', ');
    };

    const insightsSection = Array.isArray(spendingInsights) && spendingInsights.length > 0 ? `
SPENDING BEHAVIOR (from user's biweekly needs/wants reviews — use these to make questions concrete):
${spendingInsights.map(i => `• ${i.period_start}–${i.period_end}: ${i.needs_pct}% needs / ${i.wants_pct}% wants. ${i.insight_summary}`).join('\n')}
Hold them accountable to these patterns. Reference them in scenario-based questions.
` : '';

    const userProfileSection = Object.keys(profile).length > 0 ? `
USER PROFILE — personalize every question and piece of feedback to this specific person:
- Learning style: ${formatLearning(profile.learning_style)}
- Primary financial goal: ${profile.primary_goal || 'not specified'}
- Current life situation: ${formatSituation(profile.current_situation)}
- Financial confidence: ${profile.financial_confidence || 'not specified'}
- Risk tolerance: ${profile.risk_tolerance || 'not specified'}
- Future goals: ${formatList(profile.future_goals)}

Personalization rules (critical):
- Tailor every scenario and example to their actual life situation. A gig worker has variable income — use that. A student has a tight budget — use that. A W-2 employee has predictable paychecks — use that.
- Match your language complexity to their confidence level. If they're stressed/overwhelmed, be encouraging and simple. If they're confident, challenge them with harder scenarios.
- Frame questions around their stated goals (e.g. if goal is emergency fund, ask how this lesson helps them build one).
- Use their learning style cues: if they prefer videos/visuals, paint a vivid scenario. If they like doing, make it action-oriented ("what would you do right now?").
- Reference their future goals when relevant to ground abstract concepts in their real life.
` : '';

    const systemPrompt = `You are Migo's financial coach doing a QUICK comprehension check for lesson "${lessonId}".
HARD LIMIT: Maximum 2 questions total. This is not a test — it is a quick check before the user goes and applies their knowledge.
${userProfileSection}${insightsSection}
Key principles to verify (pick the most important one):
MUST DOs: ${mustDosFormatted}
MUST NEVER DOs: ${mustNeverDosFormatted}

${isFinalTurn ? 'FINAL TURN: You MUST conclude NOW. Set question to null. Give a warm 1-sentence verdict.' : ''}

Rules (strictly follow):
- Ask ONE short scenario-based question per turn ("If you got $500 this Friday, what would you do first?")
- No vocab definitions, no multi-part questions, no "explain everything about X"
- Pass threshold: 60. Be generous — partial understanding is fine, action will reinforce the rest
- Turn 1 (history empty): Generate the one question only. evaluation: null, passed: false, score: 0.
- Turn 2 (history has 1 Q + 1 A): Evaluate warmly, then CONCLUDE (question: null). Do NOT ask another question unless the answer was completely off-base.
- When concluding: one encouraging sentence. Mark passed: true if they showed any real understanding.

Respond ONLY in valid JSON:
{
  "question": "string or null",
  "evaluation": "warm 1-sentence feedback, or null on turn 1",
  "passed": true or false,
  "score": 0-100,
  "gaps": [{"type": "must_do or must_never_do", "topic": "string"}]
}`;

    // Build a readable transcript for the userPrompt
    let transcript = '';
    if (history.length > 0) {
      transcript = history
        .map(msg => `${msg.role === 'assistant' ? 'Question' : 'Answer'}: ${msg.content}`)
        .join('\n\n');
      transcript += '\n\n';
    }

    let userPrompt;
    if (isTurn1) {
      userPrompt = `This is the first turn. Generate the opening question for the lesson "${lessonId}". Do not evaluate anything.`;
    } else {
      userPrompt = `${transcript}Current Answer: ${userAnswer || '(no answer provided)'}

Evaluate this answer and ${isFinalTurn ? 'provide the final conclusion.' : 'ask the next question or conclude if the user has demonstrated sufficient understanding.'}`;
    }

    const response = await aiService.callGPT(systemPrompt, userPrompt, 0.5);
    const result = JSON.parse(response.choices[0].message.content);

    res.json(result);

  } catch (error) {
    console.error('Comprehension evaluate error:', error);
    res.status(500).json({ error: 'Evaluation failed', details: error.message });
  }
});

// ─── POST /result ─────────────────────────────────────────────────────────────
// Persists the final comprehension outcome. userId comes from JWT, never from body.

router.post('/result', verifyJWT, validate(comprehensionResultSchema), async (req, res) => {
  try {
    const {
      lessonId,
      passed,
      score,
      phaseReached,
      conversationHistory,
      gaps
    } = req.body;

    if (!lessonId || passed === undefined || score === undefined) {
      return res.status(400).json({ error: 'lessonId, passed, and score are required' });
    }

    const { error } = await supabase.from('comprehension_results').insert({
      user_id: req.userId,
      lesson_id: lessonId,
      passed,
      score,
      phase_reached: phaseReached || 'complete',
      conversation_history: conversationHistory || [],
      gaps: gaps || []
    });

    if (error) throw error;

    res.json({ success: true });

  } catch (error) {
    console.error('Comprehension result error:', error);
    res.status(500).json({ error: 'Failed to save result', details: error.message });
  }
});

module.exports = router;
