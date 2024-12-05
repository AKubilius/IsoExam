interface Answer {
    policyDefined: string;
    controlImplemented: string;
    controlAutomated: string;
    controlReported: string;
  }
  
  export const calculateMetrics = (answers: Answer[]) => {
    const scoringMap: { [key: string]: number } = {
     "Nėra politikos": 0,
"Neformali politika": 0.25,
"Iš dalies parašyta politika": 0.5,
"Parašyta politika": 0.75,
"Patvirtinta parašyta politika": 1,

"Neįgyvendinta": 0,
"Dalis politikos įgyvendinta": 0.25,
"Įgyvendinta kai kuriose sistemose": 0.5,
"Įgyvendinta daugumoje sistemų": 0.75,
"Įgyvendinta visose sistemose": 1,

"Neautomatizuota": 0,
"Dalis politikos automatizuota": 0.25,
"Automatizuota kai kuriose sistemose": 0.5,
"Automatizuota daugumoje sistemų": 0.75,
"Automatizuota visose sistemose": 1,

"Nepranešta": 0,
"Dalis politikos pranešta": 0.25,
"Pranešta kai kuriose sistemose": 0.5,
"Pranešta daugumoje sistemų": 0.75,
"Pranešta visose sistemose": 1,

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
  