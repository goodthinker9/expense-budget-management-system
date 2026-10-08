import { useEffect } from "react";
import api from "../services/app.js";

function Categories() {

    useEffect(() => {

        const getCategories = async () => {
            try {
                const response = await api.get("/api/category");

                console.log("Categories:", response.data);

            } catch (error) {
                console.error("Category request failed:", error);
            }
        };

        getCategories();

    }, []);

    return (
        <div>
            <h2>Categories</h2>
            <p>Check the browser console and Network tab.</p>
        </div>
    );
}

export default Categories;