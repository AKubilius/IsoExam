interface Answer {
    policyDefined: string;
    controlImplemented: string;
    controlAutomated: string;
    controlReported: string;
  }
  
  export const calculateMetrics = (answers: Answer[]) => {
    const scoringMap: { [key: string]: number } = {
      "No Policy": 0,
      "Informal Policy": 0.25,
      "Partial Written Policy": 0.5,
      "Written Policy": 0.75,
      "Approved Written Policy": 1,
  
      "Not Implemented": 0,
      "Parts of Policy Implemented": 0.25,
      "Implemented on Some Systems": 0.5,
      "Implemented on Most Systems": 0.75,
      "Implemented on All Systems": 1,
  
      "Not Automated": 0,
      "Parts of Policy Automated": 0.25,
      "Automated on Some Systems": 0.5,
      "Automated on Most Systems": 0.75,
      "Automated on All Systems": 1,
  
      "Not Reported": 0,
      "Parts of Policy Reported": 0.25,
      "Reported on Some Systems": 0.5,
      "Reported on Most Systems": 0.75,
      "Reported on All Systems": 1,
    };
  
    let totalScore = 0;
    const totalQuestions = answers.length;
  
    answers.forEach((answer) => {
      const policyScore = scoringMap[answer.policyDefined] || 0;
      const controlScore = scoringMap[answer.controlImplemented] || 0;
      const automatedScore = scoringMap[answer.controlAutomated] || 0;
      const reportedScore = scoringMap[answer.controlReported] || 0;
  
      totalScore += policyScore + controlScore + automatedScore + reportedScore;
    });
  
    const maxScore = totalQuestions * 4;
    const riskAddressed = (totalScore / maxScore) * 100;
    const riskAccepted = 100 - riskAddressed;
  
    // Return individual field averages and risk percentages
    const fieldAverages = {
      policyDefined: answers.reduce(
        (sum, a) => sum + (scoringMap[a.policyDefined] || 0),
        0
      ) / totalQuestions,
      controlImplemented: answers.reduce(
        (sum, a) => sum + (scoringMap[a.controlImplemented] || 0),
        0
      ) / totalQuestions,
      controlAutomated: answers.reduce(
        (sum, a) => sum + (scoringMap[a.controlAutomated] || 0),
        0
      ) / totalQuestions,
      controlReported: answers.reduce(
        (sum, a) => sum + (scoringMap[a.controlReported] || 0),
        0
      ) / totalQuestions,
    };
  
    return {
      riskPercentages: {
        riskAddressed: Math.round(riskAddressed),
        riskAccepted: Math.round(riskAccepted),
      },
      fieldAverages,
    };
  };
  