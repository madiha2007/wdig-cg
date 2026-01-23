import { aptitudeQuestions } from "../data/aptitudeQuestions";

export const evaluateResponses = (userAnswers) => {
  const userProfile = {
    traits: {},
    aptitude: {},
    personality: {},
    sections: {},
    meta: {
      totalQuestions: 0,
      attempted: 0,
      correctAptitude: 0
    }
  };

  const addTraits = (traitObj, target) => {
    Object.entries(traitObj).forEach(([trait, value]) => {
      target[trait] = (target[trait] || 0) + value;
      userProfile.traits[trait] =
        (userProfile.traits[trait] || 0) + value;
    });
  };

  aptitudeQuestions.forEach((q) => {
    userProfile.meta.totalQuestions++;

    const answer = userAnswers[q.id];
    if (answer === undefined) return;

    userProfile.meta.attempted++;

    // Initialize section tracking
    if (!userProfile.sections[q.section]) {
      userProfile.sections[q.section] = {
        score: 0,
        attempted: 0
      };
    }

    userProfile.sections[q.section].attempted++;

    /* ---------------- APTITUDE QUESTIONS ---------------- */
    if (typeof q.correctOption === "number") {
      if (answer === q.correctOption) {
        userProfile.meta.correctAptitude++;

        addTraits(q.traits, userProfile.aptitude);

        const totalMarks = Object.values(q.traits).reduce(
          (a, b) => a + b,
          0
        );

        userProfile.sections[q.section].score += totalMarks;
      }
    }

    /* -------------- PERSONALITY QUESTIONS --------------- */
    else if (Array.isArray(q.options)) {
      const selectedOption = q.options.find(
        (opt) => opt.label === answer
      );

      if (!selectedOption) return;

      addTraits(selectedOption.traits, userProfile.personality);
    }
  });

  return userProfile;
};
