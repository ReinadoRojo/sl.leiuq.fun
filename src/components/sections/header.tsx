import { ThemeChanger } from "@/components/theme-changer-button"
import { HeaderProfile } from "./header-profile"

export const GeneralHeader = () => {
    return (
        <header className="fixed justify-between flex flex-row items-center px-8 py-6 bg-background text-primary w-screen h-24">
            <div>
                <ThemeChanger />
            </div>
            <div>
                <HeaderProfile />
            </div>
        </header>
    )
}