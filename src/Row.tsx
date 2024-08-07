import { Clue, clueClass, CluedLetter, clueWord, obscureClue } from "./clue";

export enum RowState {
  LockedIn,
  Editing,
  Pending,
}

interface RowProps {
  rowState: RowState;
  wordLength: number;
  cluedLetters: CluedLetter[];
  annotation?: string;
}

export function Row(props: RowProps) {
  let obscuredClue = obscureClue(props.cluedLetters);
  const isLockedIn = props.rowState === RowState.LockedIn;
  const isEditing = props.rowState === RowState.Editing;

  let numberElsewhere = 0;
  let numberCorrect = 0;
  if (isLockedIn) {
    numberElsewhere = obscuredClue.get(Clue.Elsewhere) ?? 0;
    numberCorrect = obscuredClue.get(Clue.Correct) ?? 0;
  }

  const letterDivs = props.cluedLetters
    .concat(Array(props.wordLength).fill({ clue: Clue.Absent, letter: "" }))
    .slice(0, props.wordLength)
    .map(({ clue, letter }, i) => {
      let letterClass = "Row-letter";
      if (isLockedIn && clue !== undefined) {
        if (numberElsewhere === props.cluedLetters.length) {
          letterClass += " " + clueClass(Clue.Elsewhere);
        } else if (numberCorrect === props.cluedLetters.length) {
          letterClass += " " + clueClass(Clue.Correct);
        } else if (numberCorrect + numberElsewhere === 0) {
          letterClass += " " + clueClass(Clue.Absent);
        } else {
          letterClass += " " + clueClass(Clue.Unknown);
        }
      }
      return (
        <td
          key={i}
          className={letterClass}
          aria-live={isEditing ? "assertive" : "off"}
          aria-label={letter.toUpperCase()}
        >
          {letter}
        </td>
      );
    });
  let rowClass = "Row";
  if (isLockedIn) rowClass += " Row-locked-in";
  return (
    <tr className={rowClass}>
      {letterDivs}
      <td id="hint-elsewhere" className="Row-letter letter-elsewhere">{numberElsewhere}</td>
      <td id="hint-correct" className="Row-letter letter-correct">{numberCorrect}</td>
      {props.annotation && (
        <span className="Row-annotation">{props.annotation}</span>
      )}
    </tr>
  );
}
