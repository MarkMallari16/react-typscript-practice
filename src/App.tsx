import React, { useEffect, useState } from 'react'
import Button from './component/Button';

interface Lists {
  id: number,
  title: string
}
type Status = | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error" };

const App: React.FC = () => {
  const [editingId, setEditingId] = useState<number | null>(null);  //title input
  const [title, setTitle] = useState<string>("");
  //new title input for edit
  const [newTitle, setNewTitle] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);

  //storing list
  const [lists, setLists] = useState<Lists[]>([]);

  //status
  const [status, setStatus] = useState<Status>({ status: "idle" });
  const [sample, setSample] = useState("");

  //create side effect 
  useEffect(() => {
    const data = localStorage.getItem("lists");

    if (data) {
      const parsed = JSON.parse(data) as Lists[];
      setLists(parsed);
    }

    return () => {
      localStorage.removeItem("lists")
    };
  }, [])

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));

    return () => {
      localStorage.removeItem("lists");
    }
  }, [lists])

  //handle title for title iinput 
  const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }

  //add 
  const addList = () => {
    if (title.trim() === "") {
      alert("Please input field");
      return;
    }

    const newList: Lists = {
      id: Date.now(),
      title: title,
    };

    setLists((prevLists) => [...prevLists, newList]);
    setTitle("");

  }

  //delete
  const deleteList = (id: number) => {
    setLists((prevLists) => prevLists.filter(list => list.id !== id))
  }

  //edit
  const editList = (id: number) => {
    const editingItem = lists.find((l) => l.id === id);

    if (editingItem) {
      setNewTitle(editingItem.title);
      setEditingId(id);
    }

    // setLists((prevLists) => prevLists.map((list) => (
    //   list.id === id ? { ...list, isEdit: true } : list
    // )))
  }

  //save
  const saveList = () => {
    setLists((prevlists) => prevlists.map((list) => (
      list.id === editingId ? { ...list, title: newTitle } : list
    )))

    setEditingId(null);
    setNewTitle("");
  }

  //cancel
  const cancelEdit = (id: number) => {
    if (editingId === null) return;

    setLists((prevLists) => prevLists.map((list) => (
      list.id === id ? { ...list, isEdit: false } : list
    )))

    setEditingId(null);
    setNewTitle("");
  }

  //toggling button
  const toggleButton = () => {
    setToggle(!toggle);
  }

  //changing status
  const handleStatus = () => {
    setStatus({ status: "success" });
  }

  type StringOrNumber = string | number;

  type PersonObject = {
    id: StringOrNumber,
    name: string
  }

  const person1: PersonObject = {
    id: 1,
    name: 'Mark Mallari'
  }

  const person2: PersonObject = {
    id: "1",
    name: "Mark Pogi"
  }

  const person3: PersonObject = {
    id: 2,
    name: "Joseph Pogi"
  }
  return (

    <div className='min-h-screen grid place-items-center '>
      <div className='container max-w-1/2'>
        <h1 className='text-2xl font-bold'>Todo List Application</h1>
        <div>
          <label htmlFor="title">Title</label>
          <input value={title} onChange={handleTitle} id='title' type="text" className='block border p-2 w-full mb-2 rounded-md' />
        </div>
        <button onClick={addList} className='w-full bg-blue-500 text-white font-bold p-2 rounded-md  cursor-pointer'>Add List</button>

        <div>
          {
            lists.map((list) => (
              <div key={list.id}>
                {list.id === editingId ?
                  <div className='flex justify-between items-center p-5 ring-1 ring-inset ring-gray-300 mt-2 rounded-lg'>
                    <div>
                      <label htmlFor="newTitle">Enter New Title</label>
                      <input value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                        id='title' type="text" placeholder='Enter title' className='border w-96 p-2 rounded-md block mt-1' />
                    </div>
                    <div className='flex items-center gap-2'>
                      <button onClick={() => cancelEdit(list.id)} className='bg-red-500 px-4 py-2 rounded-md text-white font-bold cursor-pointer'>Cancel</button>
                      <button onClick={saveList} className='bg-blue-500 px-4 py-2 rounded-md text-white font-bold cursor-pointer'>Save</button>

                    </div>
                  </div>
                  :
                  <div className='flex justify-between items-center p-5 ring-1 ring-inset ring-gray-300 mt-2 rounded-lg'>
                    <div>{list.title}</div>
                    <div className='flex items-center gap-2'>
                      <button onClick={() => editList(list.id)} className='bg-blue-500 px-4 py-2 rounded-md text-white font-bold'>Edit</button>
                      <button onClick={() => deleteList(list.id)} className='bg-red-500 px-4 py-2 rounded-md text-white font-bold'>Delete</button>
                    </div>
                  </div>
                }
              </div>
            ))
          }
          <Button title='Pindot' disabled={false} />

        </div>

        {/**
         * Toggling Button
         * 
        <button onClick={toggleButton}>{toggle ? "toggle" : "Not toggle"}</button>
         * 
        <p>{status.status}</p>
        <button onClick={handleStatus}>Change my status</button>
         */}

      </div>
    </div>
  )
}

export default App