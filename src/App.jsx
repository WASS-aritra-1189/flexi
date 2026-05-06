import { RouterProvider } from "react-router-dom";
import { useSelector } from "react-redux";
import routes from "./routes/Routes";
import Loader from "./Components/Loader/Loader";
import './App.scss';

const App = () => {
  const storeVar = useSelector(state => state.loader);

  return (
    <div className='App'>
      <Loader loading={storeVar?.loading} />
      <RouterProvider router={routes} />
    </div>
  )
};

export default App;