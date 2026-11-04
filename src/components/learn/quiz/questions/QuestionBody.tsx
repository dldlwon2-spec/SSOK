"use client";

import { grade, type DeckCard } from "@/lib/curriculum/quiz";
import type { QuizResponse } from "@/lib/curriculum/quiz/types";
import { BlankQuestionView } from "./BlankQuestionView";
import { PosQuestionView } from "./PosQuestionView";
import { StructureQuestionView } from "./StructureQuestionView";
import { UnscrambleQuestionView } from "./UnscrambleQuestionView";

interface QuestionBodyProps {
  card: DeckCard;
  response: QuizResponse;
  submitted: boolean;
  onChange: (response: QuizResponse) => void;
}

/** Renders the right interactive view for any quiz question type. */
export function QuestionBody({ card, response, submitted, onChange }: QuestionBodyProps) {
  const { question } = card;

  if (question.type === "blank" && response.type === "blank") {
    return (
      <BlankQuestionView
        question={question}
        choice={response.choice}
        submitted={submitted}
        onChoose={(choice) => onChange({ type: "blank", choice })}
      />
    );
  }
  if (question.type === "unscramble" && response.type === "unscramble") {
    return (
      <UnscrambleQuestionView
        question={question}
        pool={card.pool}
        order={response.order}
        submitted={submitted}
        correct={submitted && grade(question, response)}
        onChange={(order) => onChange({ type: "unscramble", order })}
      />
    );
  }
  if (question.type === "pos" && response.type === "pick") {
    return (
      <PosQuestionView
        question={question}
        selected={response.selected}
        submitted={submitted}
        onChange={(selected) => onChange({ type: "pick", selected })}
      />
    );
  }
  if (question.type === "structure" && (response.type === "pick" || response.type === "tag")) {
    return <StructureQuestionView question={question} response={response} submitted={submitted} onChange={onChange} />;
  }
  return null;
}
