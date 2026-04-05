import React, { useState } from "react";
import { Brain, CheckCircle2, XCircle, ChevronRight, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const allQuestions = [
  {
    id: 1,
    type: "Logical Reasoning",
    difficulty: "Medium",
    passage: "All lawyers who passed the bar exam are licensed to practice law. Some licensed practitioners never appear in court. Therefore, some lawyers who passed the bar exam never appear in court.",
    question: "The argument above is structured most similarly to which of the following?",
    options: [
      "All doctors who graduated medical school are licensed physicians. Some licensed physicians specialize in surgery. Therefore, some doctors who graduated medical school specialize in surgery.",
      "All athletes who complete training are eligible to compete. Some competitors never win medals. Therefore, training guarantees medal wins.",
      "All students who pass exams receive diplomas. Diplomas allow graduates to work. Therefore, passing exams guarantees employment.",
      "No lawyer practices without a license. All licensed lawyers passed the bar. Therefore, no one practices law without passing the bar.",
    ],
    correct: 0,
    explanation: "Option A mirrors the original structure: All A are B. Some B are C. Therefore, some A are C. This is valid deductive reasoning.",
  },
  {
    id: 2,
    type: "Analytical Reasoning",
    difficulty: "Hard",
    passage: "Seven witnesses — Adams, Brown, Chen, Davis, Evans, Ford, and Green — are scheduled to testify over three days: Monday, Tuesday, and Wednesday. At least two witnesses must testify each day. Adams cannot testify on Monday. Brown and Chen must testify on the same day. Davis must testify before Evans.",
    question: "If Brown and Chen testify on Wednesday, which of the following MUST be true?",
    options: [
      "Adams testifies on Tuesday.",
      "Davis testifies on Monday.",
      "Ford testifies on Tuesday.",
      "Green testifies on Monday.",
    ],
    correct: 1,
    explanation: "Since Davis must testify before Evans, and Brown/Chen take Wednesday, Davis must be on Monday or Tuesday with Evans on a later day. Given the constraints, Davis on Monday is the only arrangement that satisfies all rules.",
  },
  {
    id: 3,
    type: "Logical Reasoning",
    difficulty: "Easy",
    passage: "The city council argues that building a new stadium will boost the local economy. However, studies show that stadiums in similar cities did not significantly increase economic activity. The council also claims the stadium will reduce unemployment, but the projected jobs are mostly temporary construction positions.",
    question: "Which of the following most weakens the city council's argument?",
    options: [
      "The stadium will be built using local contractors.",
      "The permanent jobs created after construction will number fewer than 50.",
      "Other cities with stadiums have seen increased tourism.",
      "The stadium will host national sporting events.",
    ],
    correct: 1,
    explanation: "If the permanent jobs number fewer than 50, this directly undermines the claim that the stadium will meaningfully reduce unemployment, which is a key part of the council's argument.",
  },
  {
    id: 4,
    type: "Reading Comprehension",
    difficulty: "Medium",
    passage: "The Fourth Amendment protects citizens against 'unreasonable searches and seizures.' Courts have interpreted this to mean police generally need a warrant supported by probable cause. However, the Supreme Court has carved out exceptions: searches incident to arrest, vehicle searches with probable cause, and consent searches require no warrant. The 'plain view' doctrine allows officers to seize evidence visible without a search.",
    question: "According to the passage, which situation would most likely NOT require a warrant?",
    options: [
      "Searching a person's home after receiving a tip from an anonymous source.",
      "Seizing drugs an officer can clearly see on a car's back seat during a traffic stop.",
      "Entering a closed storage unit based on suspicion of criminal activity.",
      "Accessing a suspect's private digital files stored on a cloud server.",
    ],
    correct: 1,
    explanation: "The plain view doctrine allows officers to seize evidence they can clearly see without conducting a search. Drugs visible on a car's back seat during a lawful traffic stop fall under this exception.",
  },
  {
    id: 5,
    type: "Logical Reasoning",
    difficulty: "Hard",
    passage: "Politician: Our city's crime rate dropped 15% after we hired 200 more police officers. Therefore, increasing police presence is the most effective way to reduce crime.",
    question: "The politician's reasoning is flawed because:",
    options: [
      "A 15% drop in crime is not statistically significant.",
      "The argument assumes causation from correlation without ruling out other factors.",
      "Police officers are too expensive to hire in large numbers.",
      "Crime statistics are always unreliable.",
    ],
    correct: 1,
    explanation: "The politician commits the post hoc fallacy — assuming that because B followed A, A caused B. Other factors (economic improvements, community programs, seasonal changes) could explain the crime drop.",
  },
  {
    id: 6,
    type: "Logical Reasoning",
    difficulty: "Easy",
    passage: "Every student who studies more than two hours per day passes their exams. Jordan studies three hours per day.",
    question: "Which conclusion is most strongly supported?",
    options: [
      "Jordan will graduate with honors.",
      "Jordan passes their exams.",
      "Jordan is the best student in the class.",
      "Students who study less than two hours fail.",
    ],
    correct: 1,
    explanation: "If every student who studies more than two hours passes, and Jordan studies three hours, then Jordan passes. This is a straightforward application of the given rule.",
  },
  {
    id: 7,
    type: "Reading Comprehension",
    difficulty: "Medium",
    passage: "The First Amendment protects freedom of speech, but this protection is not absolute. The Supreme Court has ruled that certain categories of speech receive no protection: incitement to imminent lawless action, true threats, obscenity, and defamation. Public schools can also restrict student speech that substantially disrupts the educational environment, per Tinker v. Des Moines.",
    question: "According to the passage, which type of speech is NOT protected by the First Amendment?",
    options: [
      "Criticism of government officials.",
      "Peaceful protest on public sidewalks.",
      "Statements that are false and damage someone's reputation.",
      "Controversial political opinions.",
    ],
    correct: 2,
    explanation: "Defamation — false statements that damage someone's reputation — is explicitly listed as a category of unprotected speech. The other options describe protected speech.",
  },
  {
    id: 8,
    type: "Analytical Reasoning",
    difficulty: "Hard",
    passage: "Five students — Kayla, Leo, Maya, Noah, and Olivia — each specialize in exactly one of three areas: criminal law, civil law, or constitutional law. At least one student specializes in each area. Kayla and Leo do not share a specialization. Maya and Noah share a specialization. Olivia specializes in constitutional law.",
    question: "If Kayla specializes in criminal law, which must be true?",
    options: [
      "Leo specializes in constitutional law.",
      "Maya specializes in criminal law.",
      "Noah specializes in civil law.",
      "Leo specializes in civil law or constitutional law.",
    ],
    correct: 3,
    explanation: "Since Kayla and Leo cannot share a specialization, and Kayla is in criminal law, Leo must be in civil or constitutional law. This is the only option that must be true regardless of other assignments.",
  },
  {
    id: 9,
    type: "Logical Reasoning",
    difficulty: "Medium",
    passage: "A defense attorney argues: 'My client cannot be guilty of robbery because robbery requires the use of force, and witnesses confirm my client never touched the victim.'",
    question: "Which of the following, if true, most seriously weakens the attorney's argument?",
    options: [
      "The client has no prior criminal record.",
      "The jurisdiction defines robbery to include threatening words even without physical contact.",
      "The victim did not resist during the incident.",
      "The stolen property was recovered.",
    ],
    correct: 1,
    explanation: "If the jurisdiction defines robbery to include threatening words, then physical contact is not required. This directly undercuts the attorney's core claim that lack of physical contact proves innocence.",
  },
  {
    id: 10,
    type: "Reading Comprehension",
    difficulty: "Easy",
    passage: "Juvenile courts treat minors differently from adult courts. The focus is rehabilitation rather than punishment. Records are often sealed to protect young people's futures. However, for serious crimes, prosecutors can petition to try juveniles as adults, particularly when the minor is close to 18 or the crime involved violence.",
    question: "What is the primary goal of the juvenile court system according to the passage?",
    options: [
      "To punish minors as severely as adults.",
      "To rehabilitate young offenders.",
      "To seal all criminal records permanently.",
      "To prevent all juvenile trials.",
    ],
    correct: 1,
    explanation: "The passage explicitly states that juvenile courts focus on rehabilitation rather than punishment, which is the primary distinguishing feature of the juvenile justice system.",
  },
  {
    id: 11,
    type: "Logical Reasoning",
    difficulty: "Medium",
    passage: "Some judges are strict constructionists. All strict constructionists believe the Constitution should be interpreted literally. Some people who believe the Constitution should be interpreted literally oppose judicial activism.",
    question: "Which of the following must be true based on the statements above?",
    options: [
      "All judges oppose judicial activism.",
      "Some judges believe the Constitution should be interpreted literally.",
      "No judges support judicial activism.",
      "All strict constructionists are judges.",
    ],
    correct: 1,
    explanation: "Since some judges are strict constructionists, and all strict constructionists believe in literal interpretation, it follows that some judges believe in literal interpretation.",
  },
  {
    id: 12,
    type: "Analytical Reasoning",
    difficulty: "Medium",
    passage: "A law firm schedules client meetings on Monday through Friday. Each day has exactly one meeting. Clients are Adams, Brooks, Carter, Diaz, and Ellis. Brooks must meet before Carter. Diaz cannot meet on Wednesday. Adams meets on Friday.",
    question: "Which of the following is a possible order of meetings from Monday to Friday?",
    options: [
      "Ellis, Brooks, Diaz, Carter, Adams",
      "Diaz, Carter, Brooks, Ellis, Adams",
      "Brooks, Diaz, Carter, Ellis, Adams",
      "Carter, Brooks, Ellis, Diaz, Adams",
    ],
    correct: 2,
    explanation: "Option C has Brooks before Carter (satisfying that constraint), Diaz not on Wednesday (Diaz is Tuesday), and Adams on Friday. All constraints are satisfied.",
  },
  {
    id: 13,
    type: "Logical Reasoning",
    difficulty: "Easy",
    passage: "If a person is convicted of a felony, they lose their right to vote in many states. Marcus was convicted of a misdemeanor, not a felony.",
    question: "What can be concluded about Marcus's voting rights based only on this information?",
    options: [
      "Marcus definitely lost his right to vote.",
      "Marcus definitely kept his right to vote.",
      "No conclusion about Marcus's voting rights can be drawn from this information alone.",
      "Marcus can vote only in federal elections.",
    ],
    correct: 2,
    explanation: "The passage only addresses felony convictions. Since Marcus has a misdemeanor, the stated rule doesn't apply — but the passage doesn't tell us what happens with misdemeanors, so no conclusion can be drawn.",
  },
  {
    id: 14,
    type: "Reading Comprehension",
    difficulty: "Hard",
    passage: "Miranda v. Arizona (1966) established that suspects in police custody must be informed of their rights before interrogation: the right to remain silent, the right to an attorney, and the warning that statements can be used against them. However, Miranda warnings are only required when two conditions are met simultaneously: the suspect must be in custody AND subject to interrogation. Voluntary statements made outside of custodial interrogation are admissible without Miranda warnings.",
    question: "Based on the passage, which scenario would most likely NOT require Miranda warnings?",
    options: [
      "A handcuffed suspect questioned at the police station.",
      "A person voluntarily walking into a police station to confess.",
      "A detained suspect asked about their whereabouts.",
      "A person in a police car being formally questioned.",
    ],
    correct: 1,
    explanation: "Miranda warnings require both custody AND interrogation. A person voluntarily entering a police station and confessing is neither in custody nor being interrogated — they are making a voluntary statement, which is admissible without warnings.",
  },
  {
    id: 15,
    type: "Logical Reasoning",
    difficulty: "Hard",
    passage: "Legal scholar: Laws that cannot be enforced should not be passed. This anti-jaywalking ordinance cannot realistically be enforced in a city of one million people. Moreover, unenforced laws breed disrespect for all laws.",
    question: "Which of the following, if true, would most strengthen the scholar's argument?",
    options: [
      "The city has passed many laws that are rarely enforced.",
      "Studies show that when people routinely violate one law without consequence, compliance with other laws decreases.",
      "Jaywalking causes hundreds of injuries per year in the city.",
      "The ordinance was passed with unanimous council support.",
    ],
    correct: 1,
    explanation: "The scholar claims unenforced laws breed disrespect for all laws. Evidence that violating one law without consequence reduces compliance with others directly supports this premise.",
  },
  {
    id: 16,
    type: "Reading Comprehension",
    difficulty: "Easy",
    passage: "The Fifth Amendment contains the 'double jeopardy' clause, which prevents a person from being tried twice for the same crime after an acquittal or conviction. However, this protection only applies within the same sovereign. A person can be tried by both state and federal courts for the same conduct if it violates both state and federal law.",
    question: "Which situation does NOT violate the double jeopardy clause?",
    options: [
      "Retrying a defendant in the same state court after an acquittal.",
      "Trying a defendant in federal court after a state court acquittal for the same conduct.",
      "Convicting a defendant and then retrying them in the same court for the same crime.",
      "Prosecuting someone again in state court after they were already convicted there.",
    ],
    correct: 1,
    explanation: "The dual sovereignty doctrine allows both state and federal governments to prosecute the same conduct. Since they are separate sovereigns, federal prosecution after state acquittal does not violate double jeopardy.",
  },
  {
    id: 17,
    type: "Logical Reasoning",
    difficulty: "Medium",
    passage: "All contracts require offer, acceptance, and consideration to be valid. Sam offered to sell his car to Jenny for $5,000. Jenny said she would pay $4,500 instead.",
    question: "Which best describes the legal status of this transaction?",
    options: [
      "A valid contract exists because both parties communicated.",
      "Jenny's response is a counteroffer that rejects the original offer.",
      "Sam is legally required to sell at $4,500 since Jenny responded.",
      "The original offer remains open because Jenny showed interest.",
    ],
    correct: 1,
    explanation: "In contract law, a counteroffer rejects the original offer and creates a new one. Jenny's $4,500 response is a counteroffer — it terminates Sam's original $5,000 offer and proposes new terms.",
  },
  {
    id: 18,
    type: "Analytical Reasoning",
    difficulty: "Hard",
    passage: "Six jurors must be seated in two rows of three. Jurors are 1, 2, 3, 4, 5, and 6. Jurors 1 and 2 cannot sit in the same row. Juror 3 must sit in the front row. Jurors 4 and 5 must sit in the same row.",
    question: "If Juror 1 is in the front row, which must be true?",
    options: [
      "Juror 4 is in the front row.",
      "Juror 2 is in the front row.",
      "Juror 4 and 5 are in the back row.",
      "Juror 6 is in the front row.",
    ],
    correct: 2,
    explanation: "Juror 1 and 3 are in the front row (two of three spots). Juror 2 must be in the back row (cannot share with Juror 1). Since Jurors 4 and 5 must be together, and the front row has only one spot left, they must both be in the back row.",
  },
  {
    id: 19,
    type: "Logical Reasoning",
    difficulty: "Easy",
    passage: "No evidence obtained through an illegal search can be used in court, under the exclusionary rule. The police searched Alex's home without a warrant and found stolen goods.",
    question: "What does the exclusionary rule require in this case?",
    options: [
      "Alex must be acquitted of all charges.",
      "The stolen goods cannot be used as evidence in court.",
      "The police officers must be fired.",
      "The case must be dismissed entirely.",
    ],
    correct: 1,
    explanation: "The exclusionary rule specifically bars illegally obtained evidence from being used in court. It does not automatically require acquittal or dismissal — other evidence may still exist. It only addresses the admissibility of the illegally obtained evidence.",
  },
  {
    id: 20,
    type: "Reading Comprehension",
    difficulty: "Medium",
    passage: "Tort law allows individuals to seek compensation for civil wrongs. There are three main categories: intentional torts (where harm is deliberate, like assault), negligence torts (where harm results from a failure to exercise reasonable care), and strict liability torts (where a party is liable regardless of fault, often applied to abnormally dangerous activities). Unlike criminal law, tort cases are brought by private parties, not the government.",
    question: "A chemical plant's explosion harms nearby residents, even though the plant followed all safety protocols. Under which tort category would residents most likely seek compensation?",
    options: [
      "Intentional tort, because the plant caused the harm.",
      "Negligence, because the plant should have been more careful.",
      "Strict liability, because dangerous activities create liability regardless of fault.",
      "No tort applies because the plant followed safety protocols.",
    ],
    correct: 2,
    explanation: "Strict liability applies to abnormally dangerous activities regardless of fault. Even if the plant followed all protocols, operating a chemical facility is a dangerous activity that can trigger strict liability when harm occurs.",
  },
  {
    id: 21,
    type: "Logical Reasoning",
    difficulty: "Medium",
    passage: "The school board banned students from wearing political buttons, claiming it prevents disruption. A student argues this violates their First Amendment rights. The school says student speech can be limited when it causes substantial disruption.",
    question: "Which additional piece of information would most help the student's case?",
    options: [
      "The student has worn the button for three weeks without any incident.",
      "Other students disagree with the political message on the button.",
      "The school has a dress code for uniforms.",
      "The school board voted 5-2 to approve the ban.",
    ],
    correct: 0,
    explanation: "Under Tinker v. Des Moines, schools can only restrict speech that causes substantial disruption. Evidence that the button caused no disruption undermines the school's justification for the ban.",
  },
  {
    id: 22,
    type: "Reading Comprehension",
    difficulty: "Hard",
    passage: "Habeas corpus is a legal action through which a prisoner can challenge the lawfulness of their detention. It is often called 'the great writ of liberty.' The U.S. Constitution allows suspension of habeas corpus only 'in cases of rebellion or invasion when the public safety may require it.' During the Civil War, President Lincoln suspended habeas corpus, a decision later challenged in ex parte Merryman, where a federal judge ruled the president lacked this authority — though Lincoln ignored the ruling.",
    question: "What does the Merryman case illustrate about constitutional law?",
    options: [
      "The president always has the power to suspend habeas corpus.",
      "Federal courts can rule against the executive branch, but enforcement depends on compliance.",
      "Habeas corpus was permanently suspended during the Civil War.",
      "The Supreme Court approved Lincoln's suspension of habeas corpus.",
    ],
    correct: 1,
    explanation: "Merryman shows that courts can rule against the executive branch, but they have no direct enforcement power — Lincoln simply ignored the ruling. This illustrates the limits of judicial authority when other branches refuse to comply.",
  },
  {
    id: 23,
    type: "Logical Reasoning",
    difficulty: "Easy",
    passage: "To be elected president, a candidate must win a majority of Electoral College votes. Candidate A won the popular vote by 3 million votes but lost the Electoral College.",
    question: "What can be concluded from this information?",
    options: [
      "Candidate A won the presidency.",
      "Candidate A lost the presidency despite winning the popular vote.",
      "The election results will be contested in court.",
      "Candidate A will win the next election.",
    ],
    correct: 1,
    explanation: "The presidency is determined by Electoral College votes, not the popular vote. Since Candidate A lost the Electoral College despite winning the popular vote, they did not win the presidency.",
  },
  {
    id: 24,
    type: "Logical Reasoning",
    difficulty: "Hard",
    passage: "A law professor states: 'If we allow exceptions to attorney-client privilege for serious crimes, clients will stop being honest with their lawyers. If clients stop being honest, lawyers cannot effectively represent them. If lawyers cannot effectively represent clients, the right to counsel becomes meaningless.'",
    question: "The professor's argument depends on which assumption?",
    options: [
      "Attorney-client privilege currently has no exceptions.",
      "Clients will definitely learn about any exceptions to privilege.",
      "All crimes are equally serious.",
      "Lawyers prefer not to report client confessions.",
    ],
    correct: 1,
    explanation: "The chain of reasoning only works if clients know about the exceptions and change their behavior accordingly. If clients are unaware of exceptions, they would continue to be honest, and the professor's argument collapses.",
  },
  {
    id: 25,
    type: "Reading Comprehension",
    difficulty: "Medium",
    passage: "The Equal Protection Clause of the 14th Amendment requires that states treat similarly situated individuals equally. Courts apply different levels of scrutiny depending on the classification at issue. Laws that classify by race receive 'strict scrutiny' — the government must show a compelling interest and narrow tailoring. Laws classifying by sex receive 'intermediate scrutiny.' Laws based on other distinctions, like age or wealth, receive 'rational basis' review, the easiest standard for the government to meet.",
    question: "A state law treats 18-year-olds differently from 21-year-olds for alcohol purchases. Which level of scrutiny would a court most likely apply?",
    options: [
      "Strict scrutiny, because age is a protected class.",
      "Intermediate scrutiny, because the law affects young people.",
      "Rational basis review, because age is not a suspect classification.",
      "No scrutiny, because states can always regulate alcohol.",
    ],
    correct: 2,
    explanation: "Age is not a suspect or quasi-suspect classification under Equal Protection doctrine. Laws based on age receive rational basis review — the lowest level of scrutiny — meaning the government only needs to show a rational reason for the distinction.",
  },
];

const difficultyColors = {
  Easy: "bg-green-100 text-green-700 border-green-200",
  Medium: "bg-gold/10 text-gold-dark border-gold/20",
  Hard: "bg-red-100 text-red-700 border-red-200",
};

export default function LSATPractice() {
  const [questions] = useState(allQuestions);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];

  const handleSelect = (idx) => {
    if (showResult) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setShowResult(true);
    const correct = selected === q.correct;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { questionId: q.id, selected, correct }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setShowResult(false);
    }
  };

  const restart = () => {
    setCurrent(0);
    setSelected(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setFinished(false);
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-navy-dark rounded-2xl p-10 text-white">
          <Trophy className="w-16 h-16 text-gold mx-auto mb-4" />
          <h1 className="font-display text-4xl font-bold text-gold mb-2">Practice Complete!</h1>
          <p className="text-gold-light/60 font-play mb-8">Here's how you did:</p>
          <div className="text-6xl font-display font-bold text-white mb-2">{pct}%</div>
          <p className="text-gold-light/60 font-play">{score} out of {questions.length} correct</p>
          <div className="mt-8 flex justify-center">
            <Button onClick={restart} className="bg-gold text-navy-dark hover:bg-gold-light font-play font-bold flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-navy-dark flex items-center justify-center">
            <Brain className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-navy-dark">LSAT Practice</h1>
            <p className="text-muted-foreground font-play text-sm">Question {current + 1} of {questions.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-play text-sm text-muted-foreground">Score:</span>
          <span className="font-display text-xl font-bold text-navy-dark">{score}</span>
        </div>
      </div>

      <div className="w-full bg-muted rounded-full h-2 mb-8">
        <div
          className="bg-gold h-2 rounded-full transition-all duration-500"
          style={{ width: `${(current / questions.length) * 100}%` }}
        />
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-navy-dark px-6 py-4 flex items-center gap-3">
          <Badge className="bg-white/10 text-white border-white/10 font-play">{q.type}</Badge>
          <span className={`text-xs font-play px-2 py-0.5 rounded border font-medium ${difficultyColors[q.difficulty]}`}>
            {q.difficulty}
          </span>
        </div>

        <div className="p-6 md:p-8">
          <div className="bg-gold/5 border border-gold/15 rounded-xl p-4 mb-6">
            <p className="font-play text-sm text-muted-foreground leading-relaxed italic">{q.passage}</p>
          </div>

          <h2 className="font-display text-xl font-bold text-navy-dark mb-6">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              let style = "border-border bg-white hover:border-navy-light hover:bg-muted/30";
              if (showResult) {
                if (idx === q.correct) style = "border-green-400 bg-green-50";
                else if (idx === selected && idx !== q.correct) style = "border-red-400 bg-red-50";
                else style = "border-border bg-white opacity-50";
              } else if (selected === idx) {
                style = "border-navy-dark bg-navy-dark/5";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${style}`}
                >
                  <span className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center font-play font-bold text-sm mt-0.5 ${
                    showResult && idx === q.correct
                      ? "border-green-500 bg-green-500 text-white"
                      : showResult && idx === selected && idx !== q.correct
                      ? "border-red-500 bg-red-500 text-white"
                      : selected === idx
                      ? "border-navy-dark bg-navy-dark text-gold"
                      : "border-border text-muted-foreground"
                  }`}>
                    {showResult && idx === q.correct ? <CheckCircle2 className="w-4 h-4" /> :
                     showResult && idx === selected && idx !== q.correct ? <XCircle className="w-4 h-4" /> :
                     String.fromCharCode(65 + idx)}
                  </span>
                  <span className="font-play text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {showResult && (
            <div className={`mt-6 p-4 rounded-xl border ${selected === q.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
              <p className="font-play font-bold text-sm mb-1 flex items-center gap-2">
                {selected === q.correct ? <CheckCircle2 className="w-4 h-4 text-green-600" /> : <XCircle className="w-4 h-4 text-red-600" />}
                {selected === q.correct ? "Correct!" : "Not quite — here's why:"}
              </p>
              <p className="font-play text-sm text-muted-foreground leading-relaxed">{q.explanation}</p>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selected === null}
                className="bg-navy-dark text-gold hover:bg-navy-light font-play font-bold px-8"
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                className="bg-gold text-navy-dark hover:bg-gold-light font-play font-bold flex items-center gap-2 px-8"
              >
                {current + 1 >= questions.length ? "See Results" : "Next Question"}
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
