import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "ihp-datasync/react";
import { createRecord, query, Todo } from "ihp-datasync";
import { useCallback } from "react";
import useCurrentUserId from "../useCurrentUserId";

export default function Todos() {
    return <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <Flex direction="column" style={{ height: '100%' }}>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                </header>
                <div className="bg-sidebar" style={{ flexGrow: 1, overflowY: 'auto' }}>
                    <TodosInner />
                </div>
            </Flex>
        </SidebarInset>
    </SidebarProvider>
}

function TodosInner() {
    const todos = useQuery(query('todos').orderByDesc('createdAt'));

    return <div>
        <h2>Todos</h2>

        <ul>
            <li>{todos?.map(todo => <TodoItem key={todo.id} todo={todo} />)}</li>
        </ul>

        <NewTodoForm />
    </div>
}

function TodoItem({ todo }: { todo: Todo }) {
    return <div>
        {todo.name}
    </div>
}

function NewTodoForm() {
    const userId = useCurrentUserId();
    const onSubmit = useCallback((event: React.FormEvent) => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const formData = new FormData(form);
        const name = formData.get('name') as string;
        form.reset();
        form.name.focus();

        createRecord('todos', { userId, name });
    }, [userId]);
    return <form onSubmit={onSubmit}>
        <TextField.Root
                name="name"
                placeholder="New Todo"
                autoFocus
                required
            />
        <Button type="submit">
            Create Todo
        </Button>
    </form>
}