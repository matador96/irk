import "./App.css";
import React, { useState, useEffect } from "react";

function getMlSeconds() {
  return Date.now();
}

const regexList = {
  text: new RegExp(/^[a-zA-Z ]+$/),
  tel: new RegExp("^[0-9]+$"),
  card: new RegExp(/\b(?:d{4}[ -]?){3}(?=d{4}\b)/gm),
};

const ResultsBlock = ({ data }) => (
  <div className="results">
    <table>
      <thead>
        <tr>
          <th>Time</th>
          <th>Rows</th>
        </tr>
      </thead>
      {data.map((item) => (
        <tr key={item.toString()}>
          {Object.values(item).map((val) => (
            <td>{val}</td>
          ))}
        </tr>
      ))}
    </table>
  </div>
);

function App() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const fileReader = new FileReader();

  const addResults = (r) => setResults((prev) => [...prev, r]);

  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const checkFields = async (arr) => {
    let startTime = getMlSeconds();
    setIsLoading(true);
    const result = [];

    for (let key in arr) {
      let el = arr[key];

      if (el.length > 1) {
        let obj = {
          fname: regexList.text.test(el[0]),
          lname: regexList.text.test(el[1]),
          tel: regexList.tel.test(el[2]),
          card: regexList.card.test(el[3]),
        };

        result.push(obj);
      }
    }

    let endTime = getMlSeconds();

    addResults({ time: (endTime - startTime) / 1000, rows: result.length + 1 });
    setIsLoading(false);
  };

  const csvFileToArray = (string) => {
    const arrayRows = [];
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    csvRows.map((i) => arrayRows.push(i.split(";")));

    checkFields(arrayRows);
  };

  const startNormalize = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        csvFileToArray(text);
      };

      fileReader.readAsText(file);
    }
  };

  const reset = (e) => {
    e.preventDefault();
    setFile(null);
    document.querySelector("#csvFileInput").value = "";
  };

  return (
    <div className="App">
      <ResultsBlock data={results} />
      <h1>csv import</h1>
      <div style={{ textAlign: "center" }}>
        <input
          type="file"
          id="csvFileInput"
          accept=".csv"
          onChange={handleOnChange}
          disabled={isLoading}
        />
      </div>

      <div className="download">
        <a href="/testdata.csv" download style={{ margin: 5 }}>
          download 30 rows
        </a>
        <a href="/bigdata.csv" download style={{ margin: 5 }}>
          download 50k rows
        </a>
      </div>

      {file && (
        <>
          <div>
            <button
              disabled={isLoading}
              onClick={(e) => reset(e)}
              style={{ margin: 10 }}
            >
              Reset
            </button>
            <button
              style={{ margin: 10 }}
              disabled={isLoading}
              onClick={(e) => {
                startNormalize(e);
              }}
            >
              start normalize
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
