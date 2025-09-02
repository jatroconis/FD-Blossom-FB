import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./layout/RootLayout";
import CharactersList from "./pages/CharactersList";
import CharacterDetail from "./pages/CharacterDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <CharactersList /> },
      { path: "character/:id", element: <CharacterDetail /> },
    ],
  },
]);
