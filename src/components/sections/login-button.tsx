"use client";

import Link from "next/link";
import { Button } from "../ui/button";

export const LoginButton = () => (
    <Button asChild>
        <Link href={"/login"}>
            Login
        </Link>
    </Button>
)