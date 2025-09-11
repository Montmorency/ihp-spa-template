"use client"


import {
    SidebarGroup,
    SidebarMenu
} from "@/components/ui/sidebar"
import { NavTodos } from "./nav-todos"

export function NavMain() {
    return (
        <SidebarGroup>
            <SidebarMenu>
                <NavTodos />
            </SidebarMenu>
        </SidebarGroup>
    )
}