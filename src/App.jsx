import './App.css';
import { Card } from './components/card/Card';
import { Description } from './components/description/Description';
import { Header } from './components/header/Header';

function App() {
  return (
    <section>
      <Header />
      <main className="main">
        <Description />
        <Card />
      </main>
    </section>
  );
}

export default App;
