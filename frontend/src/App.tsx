import { RouterProvider } from "@tanstack/react-router";
import type { FC } from "react";
import {router} from "../routes/router"

const App: FC = () => {
  return <RouterProvider router={router} />
}

export default App