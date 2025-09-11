"use client"

import {
    ChevronsUpDown,
    CreditCard,
    FilesIcon,
    HelpCircleIcon,
    LogOut,
    MessageCircleIcon
} from "lucide-react"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import useCurrentUserId from "@/src/useCurrentUserId"
import { query } from "ihp-datasync"
import { useQuerySingleResult } from "ihp-datasync/react"
import { useCallback } from "react"
import { Link } from "react-router-dom"

export function NavUser() {
    const { isMobile } = useSidebar();
    const userId = useCurrentUserId();
    const user = useQuerySingleResult(query('users').where('id', userId));
    const pictureUrl = '';

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-lg">
                                <AvatarImage src={pictureUrl} />
                                <AvatarFallback className="rounded-lg">USER</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">User</span>
                                <span className="truncate text-xs">{user?.email}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-lg">
                                    <AvatarImage src={pictureUrl} />
                                    <AvatarFallback className="rounded-lg">USER</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">User</span>
                                    <span className="truncate text-xs">{user?.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <Link to="/billing">
                                    <CreditCard />
                                    Payment Settings
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href="/OpenBillingPortal" target="_blank">
                                    <FilesIcon />
                                    Invoices
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem asChild>
                                <a href="mailto:support@example.com" target="_blank">
                                    <HelpCircleIcon />
                                    Contact Support
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href="/feedback" target="_blank">
                                    <MessageCircleIcon />
                                    Give Feedback
                                </a>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <LogoutItem />
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}


function LogoutItem() {
    const doLogout = useCallback((event: React.MouseEvent) => {
        logout(event);
    }, []);
    return <DropdownMenuItem onClick={doLogout}>
        <LogOut />
        Log out
    </DropdownMenuItem>
}

export function logout (event: React.MouseEvent) {
    event.preventDefault();
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/DeleteSession';

    const method = document.createElement('input');
    method.type = 'hidden';
    method.name = '_method';
    method.value = 'DELETE';
    form.appendChild(method);

    document.body.appendChild(form);
    form.submit();
    localStorage.clear();
}