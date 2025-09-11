import {
    ArrowUpRight,
    AtomIcon,
    BoxIcon,
    Folder,
    Forward,
    Link2,
    MoreHorizontal,
    PlusCircleIcon,
    PlusIcon,
    StarOff,
    Trash2
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    SidebarMenuAction,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar
} from "@/components/ui/sidebar";
import { Agent, deleteRecord, Project, query, Todo } from "ihp-datasync";
import { useQuery } from "ihp-datasync/react";
import { Link, useParams } from "react-router-dom";

import { ChevronRight, PinIcon } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    SidebarMenuSub
} from "@/components/ui/sidebar";
import { Button, Dialog, Flex, Text, TextField } from "@radix-ui/themes";
import { useCallback } from "react";
import useCurrentUserId from "@/src/useCurrentUserId";


export function NavTodos() {
    const todos = useQuery(query("todos").orderByDesc("createdAt"));

    return (
        <Collapsible
            asChild
            defaultOpen={true}
            className="group/collapsible"
        >
            <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Agents" className="font-medium">
                        <AtomIcon />
                        <span>Todos</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <SidebarMenuSub>
                        {todos?.map((todo) => (
                            <TodoItem key={todo.id} todo={todo} />
                        ))}
                        <NewTodoItem />
                    </SidebarMenuSub>
                </CollapsibleContent>
            </SidebarMenuItem>
        </Collapsible>
    )
}

interface TodoItemProps {
    todo: Todo
}
function TodoItem({ todo }: TodoItemProps) {
    const params = useParams();
    const isActive = params.todoId === todo.id;
    const url = `/todos/${todo.id}/details`;
    const { isMobile } = useSidebar()

    return <SidebarMenuSubItem>
        <SidebarMenuSubButton isActive={isActive} asChild>
            <Link to={url} className="hover:text-gray-900">
                <Text truncate>{todo.name}</Text>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuAction showOnHover>
                            <MoreHorizontal />
                            <span className="sr-only">More</span>
                        </SidebarMenuAction>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align={isMobile ? "end" : "start"}
                    >
                        <DeleteTodoItem todo={todo} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </Link>
        </SidebarMenuSubButton>
    </SidebarMenuSubItem>
}

function NewTodoItem() {
    return <SidebarMenuSubItem>
        <SidebarMenuSubButton asChild>
            <Link to="/todos/new">
                <Flex align="center" gap="2">
                    <PlusCircleIcon size="16" />
                    New Todo
                </Flex>
            </Link>
        </SidebarMenuSubButton>
    </SidebarMenuSubItem>;
}

function DeleteTodoItem({ todo }: { todo: Todo }) {
    const todoId = todo.id;
    const todoName = todo.name;
    const onClick = useCallback(() => {
        if (window.confirm(`Are you sure you want to delete the todo "${todoName}"?`)) {
            deleteRecord('todos', todoId)
        }
    }, [todoName, todoId]);
    return <DropdownMenuItem onClick={onClick}>
        <Trash2 className="text-muted-foreground" />
        <span>Delete</span>
    </DropdownMenuItem>;
}