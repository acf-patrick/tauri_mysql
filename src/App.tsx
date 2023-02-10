import { useEffect, useState } from "react";
import Database from "tauri-plugin-sql-api";
import "./App.css";

function App() {
  const [datas, setDatas] = useState<any>(null);
  const [database, setDatabase] = useState<Database | null>(null);

  const udpateDatas = () => {
    if (database) {
      database
        .select("SELECT * from test.qttable")
        .then((datas) => setDatas(datas))
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleOnSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form: any = e.target;
    if (database) {
      database
        .execute(
          `INSERT INTO test.qttable(NAME, PSEUDO) VALUES('${form.NAME.value}', '${form.PSEUDO.value}')`
        )
        .then((res) => udpateDatas())
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    const getDatabase = async () => {
      return await Database.load(
        "mysql:host=localhost:3306;dbname=test;charset=utf8"
      );
    };

    getDatabase()
      .then((database) => {
        setDatabase(database);
        udpateDatas();
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div className="App">
      <form onSubmit={handleOnSubmit}>
        <p>
          <input type="text" name="NAME" placeholder="Enter pseudo" />
        </p>
        <p>
          <input type="text" name="PSEUDO" placeholder="Enter pseudo" />
        </p>
        <div>
          <button type="submit">INSERT</button>
        </div>
      </form>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>PSEUDO</th>
          </tr>
        </thead>
        <tbody>
          {datas ? (
            datas.map((data: any, index: number) => (
              <tr key={index}>
                <td>{data.ID}</td>
                <td>{data.NAME}</td>
                <td>{data.PSEUDO}</td>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
