export const TestPage = () => {
    // const result: APIResponse<string> = { data: ['hades'], success: true };
    // console.log(result)
    // >>___<<
    console.log(import.meta.env.VITE_BACKEND_URL);
    return (
        <>
            <div className="bg-red-500 text-white font-bold">This is test page</div>
        </>
    )
}