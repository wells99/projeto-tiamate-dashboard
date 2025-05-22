import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./services";
import AntProvider from "./contexts/AntContext";
import Paths from "./routes/Paths";

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AntProvider>
        <Paths />
      </AntProvider>
    </QueryClientProvider>
  );
}

export default App;