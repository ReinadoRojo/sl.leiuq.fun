import { ThemeChanger } from "@/components/theme-changer-button"
import { HeaderProfile } from "./header-profile"
import { auth } from "@/auth"
import { LoginButton } from "./login-button";

export const GeneralHeader = async () => {
    const session = await auth();

    return (
        <header className="fixed justify-between flex flex-row items-center px-8 py-6 bg-background text-primary w-screen h-24">
            <div>
                <ThemeChanger />
            </div>
            <div>
                {session?.user ? (<HeaderProfile />) : (<LoginButton />)}
            </div>
        </header>
    )
}