import { useState } from "react";
import styles from "./App.module.css";
import Craps from "./components/Craps";

function App() {
  const [dice, setDice] = useState(1);
  const [start, setStart] = useState(false);

  const updateNumberOfDice = (e) => {
    const num = e.target.value;
    console.log("number of dice: ", num);
    setDice(num);
  };


  const beginGame = () => {
    setStart(true);
  };

  const gotoSettings = () => {
    setStart(false);
  };
  return (
    <>
      {start && (
        <>
          <Craps dice={dice} />
          <button onClick={gotoSettings} className={styles.settingsHolder}>settings</button>
        </>
      )}
      {!start && (
        <>
          <div className={styles.holder}>
            <div className={styles.questionHolder}>
              <span>Number of Dice</span>
              <select
                className={styles.settingsSelect}
                name="number"
                onChange={updateNumberOfDice}
                defaultValue={dice}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
              </select>
              <button onClick={beginGame}>BEGIN</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default App;
