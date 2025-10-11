import { getUsersAPI } from "@/services/api"
import { useEffect } from "react"

export const TestPage = () => {
    // const result: APIResponse<string> = { data: ['hades'], success: true };
    // console.log(result)
    // >>___<<
    // console.log(import.meta.env.VITE_BACKEND_URL);

    useEffect(() => {
        const loadUsers = async () => {
            const result = await getUsersAPI();
            if (result.data) {
                const users = result.data;
                console.log(users[0].name, users[0].email);
            }
        }
        loadUsers();
    }, [])

    return (
        <>
            <div className="bg-red-500 text-white font-bold">This is test page</div>
        </>
    )
}