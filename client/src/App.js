import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

function App() {
    return (
        <Router>
            <Routes>
                {routes.map((route, index) => {
                    const Page = route.page;

                    // Kiểm tra nếu có route con
                    if (route.children) {
                        return (
                            <Route
                                key={index}
                                path={route.path}
                                element={<Page />}
                            >
                                {route.children.map((child, childIndex) => {
                                    const ChildPage = child.page;
                                    return (
                                        <Route
                                            key={childIndex}
                                            path={child.path}
                                            element={<ChildPage />}
                                        />
                                    );
                                })}
                            </Route>
                        );
                    }

                    // Route không có route con
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={<Page />}
                        />
                    );
                })}
            </Routes>
        </Router>
    );
}

export default App;
