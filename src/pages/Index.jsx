import { useState } from "react";
import { Container, VStack, HStack, Textarea, Button, Text, Box, IconButton, Table, Thead, Tbody, Tr, Th, Td, Checkbox, useToast, Input, Tag, TagLabel, TagCloseButton, Select } from "@chakra-ui/react";
import { FaTrash } from "react-icons/fa";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedNotes, setSelectedNotes] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");
  const toast = useToast();
  const [inputValue, setInputValue] = useState("");

  const addNote = () => {
    if (editIndex !== null) {
      const newNotes = [...notes];
      newNotes[editIndex] = inputValue;
      setNotes(newNotes);
      setEditIndex(null);
      setInputValue("");
      toast({
        title: "Note updated.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } else if (inputValue.trim() !== "") {
      setNotes([...notes, inputValue]);
      setInputValue("");
      toast({
        title: "Note added.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteNote = (index) => {
    const newNotes = notes.filter((_, i) => i !== index);
    setNotes(newNotes);
  };

  const handleSelectNote = (index) => {
    setSelectedNotes((prev) => {
      if (prev.includes(index)) {
        return prev.filter((i) => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const deleteSelectedNotes = () => {
    setNotes(notes.filter((_, index) => !selectedNotes.includes(index)));
    setSelectedNotes([]);
    toast({
      title: "Notes deleted.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const exportSelectedNotes = () => {
    const selected = notes.filter((_, index) => selectedNotes.includes(index));
    const blob = new Blob([JSON.stringify(selected, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "notes.json";
    link.click();
    toast({
      title: "Notes exported.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const exportAllNotes = () => {
    const blob = new Blob([JSON.stringify(notes, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "all_notes.json";
    link.click();
    toast({
      title: "All notes exported.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const importNotes = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const importedNotes = JSON.parse(e.target.result);
        setNotes(importedNotes);
        toast({
          title: "Notes imported.",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      };
      reader.readAsText(file);
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4} width="100%">
        <HStack width="100%">
          <Textarea placeholder="Enter your note" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <Button onClick={addNote} colorScheme="teal">
            {editIndex !== null ? "Save Note" : "Add Note"}
          </Button>
        </HStack>
        <HStack width="100%" justifyContent="flex-end">
          <Button onClick={deleteSelectedNotes} colorScheme="red" isDisabled={selectedNotes.length === 0}>
            Delete Selected
          </Button>
          <Button onClick={exportSelectedNotes} colorScheme="blue" isDisabled={selectedNotes.length === 0}>
            Export Selected
          </Button>
          <Input type="file" accept=".json" onChange={importNotes} display="none" id="import-notes-input" />
          <Button as="label" htmlFor="import-notes-input" colorScheme="orange">
            Import Notes
          </Button>
          <Button onClick={exportAllNotes} colorScheme="purple">
            Export All
          </Button>
        </HStack>
        <Table variant="simple" width="100%">
          <Thead>
            <Tr>
              <Th>Select</Th>
              <Th>Note</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notes.map((note, index) => (
              <Tr key={index}>
                <Td>
                  <Checkbox isChecked={selectedNotes.includes(index)} onChange={() => handleSelectNote(index)} />
                </Td>
                <Td>{note}</Td>
                <Td>
                  <Button
                    onClick={() => {
                      setEditIndex(index);
                      setInputValue(note);
                    }}
                    colorScheme="yellow"
                  >
                    Edit
                  </Button>
                  <IconButton aria-label="Delete note" icon={<FaTrash />} onClick={() => deleteNote(index)} />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Container>
  );
};

export default Index;
