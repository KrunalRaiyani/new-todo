"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import toast, { Toaster } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

const TODOS_STORAGE_KEY = "todos";

const saveTodosToLocalStorage = (todos) => {
  localStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(todos));
};

export default function TodoUi() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  useEffect(() => {
    const savedTodos =
      JSON.parse(localStorage.getItem(TODOS_STORAGE_KEY)) || [];
    setTodos(savedTodos);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
        toast.error("Failed to copy to clipboard");
      });
  };

  const handleToggleTodo = (id) => {
    const updatedTodos = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const handleEditTodo = (id) => {
    setEditingTodoId(id);
    setNewTodoTitle(todos.find((todo) => todo.id === id).title);
  };

  const handleSaveEditedTodo = () => {
    const updatedTodos = todos.map((todo) =>
      todo.id === editingTodoId ? { ...todo, title: newTodoTitle } : todo
    );
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
    setEditingTodoId(null);
    setNewTodoTitle("");
  };

  const handleAddTodo = () => {
    if (newTodoTitle.trim() !== "") {
      const updatedTodos = [
        ...todos,
        { id: Date.now(), title: newTodoTitle, completed: false },
      ];
      setTodos(updatedTodos);
      saveTodosToLocalStorage(updatedTodos);
      setNewTodoTitle("");
    }
  };

  const handleSelectAll = () => {
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: true,
    }));
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const handleUncheckAll = () => {
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: false,
    }));
    setTodos(updatedTodos);
    saveTodosToLocalStorage(updatedTodos);
  };

  const handleDeleteAll = () => {
    setIsDeleteAllDialogOpen(true);
  };

  const confirmDeleteAll = () => {
    const remainingTodos = todos.filter((todo) => !todo.completed);
    setTodos(remainingTodos);
    saveTodosToLocalStorage(remainingTodos);
    setIsDeleteAllDialogOpen(false);
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "pending":
        return todos.filter((todo) => !todo.completed);
      case "done":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }, [filter, todos]);

  const getCompletedTodos = () => {
    return todos
      .filter((todo) => todo.completed)
      .map((todo) => `• ${todo.title}`);
  };

  const handleCopyUpdate1 = () => {
    const completedTodos = getCompletedTodos().join("\n");
    const update1Text = completedTodos;
    copyToClipboard(update1Text);
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      <Toaster position="top-right" />
      <aside className="hidden w-64 border-r bg-muted/40 p-6 md:block">
        <h2 className="mb-4 text-lg font-semibold">Filters</h2>
        <div className="flex flex-col gap-2">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            onClick={() => setFilter("all")}
            className={`w-full justify-start ${
              filter === "all" ? "bg-[#272E3F] text-white" : ""
            }`}>
            All
          </Button>
          <Button
            variant={filter === "pending" ? "primary" : "outline"}
            onClick={() => setFilter("pending")}
            className={`w-full justify-start ${
              filter === "pending" ? "bg-[#272E3F] text-white" : ""
            }`}>
            Pending
          </Button>
          <Button
            variant={filter === "done" ? "primary" : "outline"}
            onClick={() => setFilter("done")}
            className={`w-full justify-start ${
              filter === "done" ? "bg-[#272E3F] text-white" : ""
            }`}>
            Done
          </Button>
          <Button
            variant="secondary"
            onClick={handleCopyUpdate1}
            className="w-full justify-start border-2 border-[#272E3F]">
            Update
          </Button>

          <h2 className="font-semibold text-xl opacity-0">Funcions</h2>

          <Button
            variant="outline"
            onClick={handleSelectAll}
            className={"w-full justify-start"}>
            Cehck all
          </Button>
          <Button
            variant="outline"
            onClick={handleUncheckAll}
            className={"w-full justify-start"}>
            Uncheck all
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteAll}
            className={"w-full justify-start"}>
            Delete all
          </Button>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b bg-background px-4 shadow-sm md:h-16 md:px-6">
          <h1 className="text-lg font-semibold md:text-2xl">Todo App</h1>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              placeholder="Add a new todo..."
              value={editingTodoId ? "" : newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAddTodo();
                }
              }}
              className="h-8 !w-[22rem] rounded-md bg-muted/40 px-3 text-sm md:h-10 md:text-base"
            />
            <Button size="sm" className="h-8 md:h-10" onClick={handleAddTodo}>
              Add
            </Button>
          </div>
        </div>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <ul className="space-y-2">
            {filteredTodos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center gap-4 justify-between rounded-md px-4 py-3 shadow-sm ${
                  todo.completed ? "bg-muted/40" : "bg-muted/40"
                }`}>
                <div className="flex items-center gap-3 w-full">
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => handleToggleTodo(todo.id)}
                  />
                  {editingTodoId === todo.id ? (
                    <Input
                      type="text"
                      value={newTodoTitle}
                      onChange={(e) => setNewTodoTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEditedTodo();
                        }
                      }}
                      className="h-8 w-full rounded-md bg-muted/40 px-3 text-sm md:h-10 md:text-base"
                    />
                  ) : (
                    <label
                      className={`text-sm font-medium ${
                        todo.completed
                          ? "line-through text-muted-foreground"
                          : ""
                      }`}>
                      {todo.title}
                    </label>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {editingTodoId === todo.id ? (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleSaveEditedTodo}>
                        <CheckIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingTodoId(null);
                          setNewTodoTitle("");
                        }}>
                        <XIcon />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditTodo(todo.id)}>
                        <FilePenIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTodo(todo.id)}>
                        <TrashIcon />
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </main>
      </div>

      <Dialog
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete all selected todos? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteAllDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteAll}>
              Delete All
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function FilePenIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="size-6">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
      />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
