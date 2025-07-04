import { ToastContainer } from "react-toastify";

import { history } from "./Histroy/histroy";
import AppRoute from "./routes/AppRoute";
import { HistoryRouter } from "./Histroy/HistoryRouter";

function App() {
  return (
    <HistoryRouter history={history}>
      <AppRoute />
      <ToastContainer />
    </HistoryRouter>
  );
}

export default App;
