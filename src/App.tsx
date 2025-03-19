import {useCallback, useEffect, useState} from "react";
import words from "./wordList.json";
import styles from "./App.module.css";
import {HangmanDrawing} from "./HangmanDrawing";
import {Keyboard} from "./Keyboard";
import {HangmanWord} from "./HangmanWord";

function App() {
    const [wordToGuess, setWordToGuess] = useState(() => {
        return words[Math.floor(Math.random() * words.length)];
    });

    function getWord() {
        return words[Math.floor(Math.random() * words.length)];
    }

    const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

    const inCorrectLetters = guessedLetters.filter(
        (letter) => !wordToGuess.includes(letter)
    );

    const isLoser = inCorrectLetters.length >= 6;
    const isWinner = wordToGuess
        .split("")
        .every((letter) => guessedLetters.includes(letter));

    const addGuessedLetter = useCallback(
        (letter: string) => {
            if (guessedLetters.includes(letter) || isWinner || isLoser) return;

            setGuessedLetters((currentLetters) => [...currentLetters, letter]);
        },
        [guessedLetters, isWinner, isLoser]
    );

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key;

            if (!key.match(/^[a-z]$/)) return;

            e.preventDefault();
            addGuessedLetter(key);
        };
        document.addEventListener("keypress", handler);
        return () => {
            document.removeEventListener("keypress", handler);
        };
    }, [guessedLetters, addGuessedLetter]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const key = e.key;

            if (key !== "Enter") return;

            setWordToGuess(getWord());
            setGuessedLetters([]);
        };
        document.addEventListener("keypress", handler);
        return () => {
            document.removeEventListener("keypress", handler);
        };
    });

    return (
        <div className={styles.container}>
            <div className={styles.result}>
                {isWinner && "Winner! - Refresh to try again"}
                {isLoser && "Nice Try! - Refresh to try again"}
            </div>
            <HangmanDrawing numberOfGuesses={inCorrectLetters.length} />
            <HangmanWord
                reveal={isLoser}
                guessedLetters={guessedLetters}
                wordToGuess={wordToGuess}
            />
            <div style={{alignSelf: "stretch"}}>
                <Keyboard
                    disabled={isWinner || isLoser}
                    activeLetters={guessedLetters.filter((letter) =>
                        wordToGuess.includes(letter)
                    )}
                    inactiveLetters={inCorrectLetters}
                    addGuesedLetter={addGuessedLetter}
                />
            </div>
        </div>
    );
}

export default App;
